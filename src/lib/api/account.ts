import { D, onSaved, tx } from '../db';
import { uid } from '../format';
import { GUEST_KEY, session } from '../session';
import type { Address, Customer, Order, ReturnRequest } from '../types';
import { ApiError, type FieldIssue } from './errors';

/** Call the storefront's own /api/account route (which holds the sign-in cookie and talks to SalesPoint). */
export async function accountFetch<T = Record<string, never>>(path: string, init: { method?: string; body?: unknown } = {}): Promise<T> {
  const res = await fetch(`/api/account/${path}`, {
    method: init.method ?? 'GET',
    headers: init.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  }).catch(() => null);
  if (!res) throw new ApiError('We couldn’t reach the store. Check your connection and try again.');
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issues: FieldIssue[] | null = Array.isArray(data.issues) ? data.issues : null;
    throw new ApiError(data.error ?? 'Something went wrong. Please try again.', { issues: issues ?? undefined, field: data.field ?? undefined });
  }
  return data as T;
}

/** The saved cart and wishlist that follow the account from device to device. */
interface Lists {
  cart: { productId: string; variantId: string | null; qty: number }[];
  wishlist: string[];
}

export interface AccountData {
  customer: Customer;
  addresses: Address[];
  orders: Order[];
  returns?: ReturnRequest[];
  lists?: Lists;
}

// ---------- cart + wishlist sync ----------
// The cart and wishlist of a signed-in customer are kept on their account. Every local save is compared with the
// last copy the store is known to have; a difference is sent a moment later. Pulling replaces the local copy,
// unless there are changes still waiting to be sent.

/** JSON of the lists as the store last had them (null = not known yet). */
let synced: string | null = null;
let pushTimer: ReturnType<typeof setTimeout> | null = null;

const localLists = (): Lists | null => {
  const u = session.user;
  if (!u) return null;
  const d = D();
  return {
    cart: (d.carts[`user:${u.id}`]?.items ?? []).map(({ productId, variantId, qty }) => ({ productId, variantId, qty })),
    wishlist: [...(d.wishlists[`user:${u.id}`] ?? [])],
  };
};
const stamp = (l: Lists) => JSON.stringify({ cart: l.cart, wishlist: l.wishlist });
const isDirty = () => {
  const l = localLists();
  return !!l && stamp(l) !== synced;
};

const schedulePush = (ms = 800) => {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => void pushLists(), ms);
};

/** Send the local cart + wishlist to the store if they differ from what it has. */
export async function pushLists(): Promise<void> {
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  const l = localLists();
  if (!l) return;
  const body = stamp(l);
  if (body === synced) return;
  try {
    await accountFetch('lists', { method: 'PUT', body: l });
    synced = body;
  } catch {
    schedulePush(15_000); // offline or the store is busy: try again shortly
  }
}

onSaved(() => {
  if (session.user && isDirty()) schedulePush();
});

/** Make the local cart + wishlist match the store's copy. Returns true if anything changed. */
function applyLists(customerId: string, lists: Lists, force: boolean): boolean {
  if (!force && isDirty()) return false; // our own changes haven't been sent yet — they win
  const before = localLists();
  const after = stamp(lists);
  synced = after; // set first so this write isn't mistaken for a change to send
  tx((d) => {
    d.carts[`user:${customerId}`] = { items: lists.cart.map((i) => ({ ...i })), updatedAt: Date.now() };
    d.wishlists[`user:${customerId}`] = [...lists.wishlist];
  });
  return !before || stamp(before) !== after;
}

/** Ask the store for the latest cart + wishlist (skipped while local changes are waiting to be sent). */
export async function pullLists(): Promise<boolean> {
  const u = session.user;
  if (!u || isDirty()) return false;
  const lists = await accountFetch<Lists>('lists').catch(() => null);
  return lists ? applyLists(u.id, lists, false) : false;
}

/** Keep a local copy of the signed-in customer's addresses and orders so screens can read them instantly. */
export function applyAccount(data: AccountData) {
  const id = data.customer.id;
  session.user = data.customer;
  tx((d) => {
    d.addresses = d.addresses.filter((a) => a.customerId !== id).concat(data.addresses);
    d.orders = d.orders.filter((o) => o.customerId !== id).concat(data.orders);
    d.returnRequests = d.returnRequests.filter((r) => r.customerId !== id).concat(data.returns ?? []);
  });
  if (data.lists) applyLists(id, data.lists, true);
}

/** Ask the store who is signed in (the cookie decides). Returns true if someone is. */
export async function loadAccount(): Promise<boolean> {
  try {
    applyAccount(await accountFetch<AccountData>('me'));
    return true;
  } catch {
    session.user = null;
    return false;
  }
}

/** Forget this customer's data on this device (sign-out). */
export function forgetAccount(customerId: string | undefined) {
  if (!customerId) return;
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = null;
  synced = null;
  tx((d) => {
    d.addresses = d.addresses.filter((a) => a.customerId !== customerId);
    d.orders = d.orders.filter((o) => o.customerId !== customerId);
    d.returnRequests = d.returnRequests.filter((r) => r.customerId !== customerId);
    delete d.carts[`user:${customerId}`];
    delete d.wishlists[`user:${customerId}`];
  });
}

/** Pull the latest orders, return requests, cart and wishlist from the store. Returns true if an order's status changed. */
export const refreshOrdersFromStore = async (): Promise<boolean> => {
  const u = session.user;
  if (!u) return false;
  const before = JSON.stringify(D().orders.filter((o) => o.customerId === u.id).map((o) => [o.ref, o.status, o.paymentStatus]));
  const [fetched] = await Promise.all([accountFetch<{ orders: Order[]; returns?: ReturnRequest[] }>('orders').catch(() => null), pullLists()]);
  if (!fetched) return false;
  tx((d) => {
    d.orders = d.orders.filter((o) => o.customerId !== u.id).concat(fetched.orders);
    d.returnRequests = d.returnRequests.filter((r) => r.customerId !== u.id).concat(fetched.returns ?? []);
  });
  return before !== JSON.stringify(fetched.orders.map((o) => [o.ref, o.status, o.paymentStatus]));
};

/** Restore the guest id, then ask the store who is signed in (the httpOnly cookie decides). */
export async function hydrateSession() {
  session.guestId =
    localStorage.getItem(GUEST_KEY) ||
    (() => {
      const g = uid('g_');
      localStorage.setItem(GUEST_KEY, g);
      return g;
    })();
  await loadAccount();
}
