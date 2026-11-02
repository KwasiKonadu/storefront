import { D, tx } from '../db';
import { cartKey, session } from '../session';
import type { Customer } from '../types';
import { isEmail, isStrongPassword } from '../validation';
import { ApiError } from './errors';
import { accountFetch, forgetAccount, loadAccount, pushLists } from './account';
import { pub, prod, requireAuth } from './shared';

export interface MergeReport {
  merged: number;
  capped: number;
  dropped: number;
  wishes: number;
}
export interface LoginResult {
  customer: Customer;
  mergeReport: MergeReport;
}

const PASSWORD_MSG = 'Password needs at least 8 characters, including a letter and a number.';

/** Guest cart + wishlist merge into the account — never duplicated, never invalid. */
function mergeGuestData(customerId: string): MergeReport {
  const guestKey = `guest:${session.guestId}`;
  const userKey = `user:${customerId}`;
  const rep: MergeReport = { merged: 0, capped: 0, dropped: 0, wishes: 0 };
  const d = D();
  const guestCart = d.carts[guestKey];
  if (guestCart?.items.length) {
    const userCart = (d.carts[userKey] ??= { items: [] });
    guestCart.items.forEach((gi) => {
      const p = pub(gi.productId);
      if (!p || p.stock <= 0) {
        rep.dropped++;
        return;
      }
      const ex = userCart.items.find((x) => x.productId === gi.productId && x.variantId === gi.variantId);
      const want = (ex?.qty ?? 0) + gi.qty;
      if (ex) ex.qty = Math.min(want, p.stock);
      else userCart.items.push({ ...gi, qty: Math.min(want, p.stock) });
      rep.merged++;
      if (want > p.stock) rep.capped++;
    });
    delete d.carts[guestKey];
  }
  const guestWish = d.wishlists[guestKey] ?? [];
  if (guestWish.length) {
    const merged = [...new Set([...(d.wishlists[userKey] ?? []), ...guestWish.filter((id) => prod(id)?.published)])];
    d.wishlists[userKey] = merged;
    rep.wishes = merged.length;
  }
  delete d.wishlists[guestKey];
  return rep;
}

export const auth = {
  /** Create the account, then sign in with it. */
  async register(input: { name: string; email: string; password: string }): Promise<LoginResult> {
    const { name, email, password } = input;
    if (!name?.trim()) throw new ApiError('Please enter your name.', { field: 'name' });
    if (!isEmail(email)) throw new ApiError('Please enter a valid email address.', { field: 'email' });
    if (!isStrongPassword(password)) throw new ApiError(PASSWORD_MSG, { field: 'password' });
    await accountFetch('register', { method: 'POST', body: { name: name.trim(), email, password } });
    return finishSignIn();
  },

  async login({ email, password }: { email: string; password: string }): Promise<LoginResult> {
    await accountFetch('login', { method: 'POST', body: { email, password } });
    return finishSignIn();
  },

  async logout() {
    const id = session.user?.id;
    await pushLists().catch(() => null); // don't lose a last-second change
    await accountFetch('logout', { method: 'POST' }).catch(() => null);
    forgetAccount(id);
    session.user = null;
  },

  async requestReset(email: string) {
    return accountFetch<{ sent: boolean; devLink: string | null }>('forgot', { method: 'POST', body: { email } });
  },

  async resetPassword(token: string, password: string) {
    if (!isStrongPassword(password)) throw new ApiError(PASSWORD_MSG, { field: 'password' });
    await accountFetch('reset', { method: 'POST', body: { token, password } });
    return true;
  },

  async changePassword({ current, next }: { current: string; next: string }) {
    requireAuth();
    if (!isStrongPassword(next)) throw new ApiError('New password needs 8+ characters with a letter and a number.', { field: 'next' });
    await accountFetch('password', { method: 'PUT', body: { current, next } });
    return true;
  },

  async updateProfile({ name, email, phone }: { name: string; email: string; phone: string }) {
    requireAuth();
    if (!name?.trim()) throw new ApiError('Please enter your name.', { field: 'name' });
    if (!isEmail(email)) throw new ApiError('Please enter a valid email address.', { field: 'email' });
    const { customer } = await accountFetch<{ customer: Customer }>('profile', { method: 'PUT', body: { name, email, phone } });
    session.user = customer;
    return customer;
  },
};

/** The cookie is set; load the account (addresses, orders) and merge the guest cart into it. */
async function finishSignIn(): Promise<LoginResult> {
  if (!(await loadAccount())) throw new ApiError('We couldn’t sign you in. Please try again.');
  const customer = session.user!;
  // Saved through tx so the merged cart and wishlist are sent to the account.
  return { customer, mergeReport: tx(() => mergeGuestData(customer.id)) };
}
