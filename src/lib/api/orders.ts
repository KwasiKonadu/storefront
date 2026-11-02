import { maxQty, unitPrice, unitsPer } from '../catalog';
import { loadCatalog } from '../catalogStore';
import { CANCELLABLE, CFG, IN_PROGRESS, ORDER_STATUSES, areaById } from '../config';
import { D, tx } from '../db';
import { fmt, uid } from '../format';
import { cartKey, session } from '../session';
import type { AddressInput, Order, OrderContact, OrderItem } from '../types';
import { isEmail, isPhone } from '../validation';
import { addresses } from './addresses';
import { refreshOrdersFromStore } from './account';
import { cart } from './cart';
import { ApiError, type FieldIssue } from './errors';
import { delayNet, prod, pub, requireAuth } from './shared';

export interface PlaceOrderInput {
  idempotencyKey: string;
  contact: OrderContact;
  fulfilment: 'delivery' | 'pickup';
  addressId: string; // saved address id, or 'new'
  address: AddressInput | null;
  saveAddress: boolean;
  areaId: string;
  instructions: string;
  paymentMethod: string;
}

export interface ReorderReport {
  added: string[];
  adjusted: { name: string; reason: string }[];
  unavailable: string[];
}

const REF_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const newRef = () => {
  let ref: string;
  do {
    ref = 'MP-' + Array.from({ length: 6 }, () => REF_ALPHABET[Math.floor(Math.random() * REF_ALPHABET.length)]).join('');
  } while (D().orders.some((o) => o.ref === ref));
  return ref;
};

/** Copy the store's current status, payment and history onto our saved copy of the order. */
const applyServerOrder = (o: Order, server: Pick<Order, 'status' | 'paymentStatus' | 'statusHistory'>) =>
  tx(() => {
    o.status = server.status;
    o.paymentStatus = server.paymentStatus;
    o.statusHistory = server.statusHistory;
  });

const ownOrder = (ref: string) => {
  const u = requireAuth();
  const o = D().orders.find((x) => x.ref === ref && x.customerId === u.id); // authorization: own orders only
  if (!o) throw new ApiError('Order not found.');
  return o;
};

export const orders = {
  /** Server-side totals & stock; idempotent creation. */
  async create(p: PlaceOrderInput): Promise<Order> {
    await delayNet();
    const u = requireAuth();
    const existing = D().idempotency[p.idempotencyKey];
    if (existing) return D().orders.find((o) => o.id === existing)!; // retry / double-click → same order, never a duplicate

    const cartData = cart.get();
    if (!cartData.items.length) throw new ApiError('Your cart is empty.');

    const issues: FieldIssue[] = [];
    const lines: OrderItem[] = [];
    cartData.items.forEach((it) => {
      const raw = prod(it.productId);
      if (!raw || !raw.published || maxQty(raw, it.variantId) <= 0) {
        issues.push({ name: it.name, reason: 'No longer available — removed from your cart' });
        return;
      }
      let qty = it.qty;
      const lim = maxQty(raw, it.variantId);
      if (qty > lim) {
        issues.push({ name: it.name, reason: `Only ${lim} in stock — quantity reduced` });
        qty = lim;
      }
      const unit = unitPrice(raw, it.variantId);
      lines.push({ productId: raw.id, name: raw.name, sku: raw.sku, variantLabel: it.variantLabel, unitPrice: unit, qty, lineTotal: unit * qty, image: raw.images[0], units: qty * unitsPer(raw, it.variantId) });
    });
    if (issues.length) {
      cart.reconcile(); // sync the cart to reality so the customer sees the corrected state
      throw new ApiError('Some items need your attention — we updated your cart.', { issues });
    }
    if (!lines.length) throw new ApiError('None of the items in your cart are currently available.');

    if (!p.contact?.name?.trim() || !isEmail(p.contact?.email) || !isPhone(p.contact?.phone))
      throw new ApiError('Please complete your contact details before placing the order.');

    let address: Order['address'] = null;
    let area = areaById(p.areaId);
    if (p.fulfilment === 'delivery') {
      if (!area || area.fee == null) throw new ApiError('We don’t deliver to the selected area yet. Please choose pickup or a listed area.');
      if (p.addressId && p.addressId !== 'new') {
        const saved = D().addresses.find((a) => a.id === p.addressId && a.customerId === u.id);
        if (!saved) throw new ApiError('Please choose a delivery address.');
        address = saved;
        area = areaById(saved.areaId);
        if (!area || area.fee == null) throw new ApiError('This saved address is outside our delivery areas. Please update it or choose pickup.');
      } else {
        const a = p.address;
        if (!a?.name?.trim() || !a.line1?.trim() || !a.city?.trim() || !isPhone(a.phone))
          throw new ApiError('Please complete the delivery address details.');
        address = { ...a, id: uid('adr_'), customerId: u.id, areaId: area.id };
      }
    } else if (p.fulfilment !== 'pickup') {
      throw new ApiError('Please choose delivery or pickup.');
    }

    const paymentMethod = CFG.paymentMethods.find((m) => m.id === p.paymentMethod);
    if (!paymentMethod) throw new ApiError('Please choose a payment method.');

    // SalesPoint is the source of truth: it re-prices the lines, re-checks stock and the delivery rules, and takes the stock.
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idempotencyKey: p.idempotencyKey,
        items: cartData.items.map((it) => ({ productId: it.productId, variantId: it.variantId, qty: it.qty })),
        contact: p.contact,
        fulfilment: p.fulfilment,
        areaId: area?.id ?? null,
        address,
        instructions: p.instructions,
        paymentMethod: paymentMethod.id,
      }),
    }).catch(() => null);
    if (!res) throw new ApiError('We couldn’t reach the store. Check your connection and try again.');
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (data.issues?.length) {
        await loadCatalog(); // pick up the real stock and prices, then sync the cart to them
        cart.reconcile();
        throw new ApiError(data.error ?? 'Some items need your attention.', { issues: data.issues });
      }
      throw new ApiError(data.error ?? 'We couldn’t place your order. Please try again.');
    }
    const order: Order = { ...data, customerId: u.id };
    tx((d) => {
      d.orders.push(order);
      delete d.carts[cartKey()];
      d.idempotency[p.idempotencyKey] = order.id;
    });
    if (p.fulfilment === 'delivery' && p.addressId === 'new' && p.saveAddress && p.address)
      await addresses.save({ ...p.address, areaId: area?.id ?? p.address.areaId, isDefault: addresses.list().length === 0 }).catch(() => null);
    void loadCatalog(); // stock has just changed
    return order;
  },

  listMine(): Order[] {
    const u = requireAuth();
    return D().orders.filter((o) => o.customerId === u.id).sort((a, b) => b.createdAt - a.createdAt);
  },

  get: (ref: string): Order => ownOrder(ref),

  /** Ask the store to cancel; it puts the stock back. Only while the order is pending or confirmed. */
  async cancel(ref: string) {
    const o = ownOrder(ref);
    if (!CANCELLABLE.includes(o.status))
      throw new ApiError(`This order has already moved past the cancellation window (it is ${ORDER_STATUSES[o.status].toLowerCase()}). Contact us if you still need changes.`);
    const res = await fetch(`/api/orders/${encodeURIComponent(ref)}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: o.contact.phone }),
    }).catch(() => null);
    const data = res ? await res.json().catch(() => ({})) : {};
    if (!res?.ok) throw new ApiError(data.error ?? 'Could not cancel. Please try again.');
    applyServerOrder(o, data);
    void loadCatalog();
    return o;
  },

  /** Pull the latest orders from the store (it moves them along). Returns true if any status changed. */
  syncOpen: refreshOrdersFromStore,

  /** Refill the cart from a past order using current prices and stock; nothing is ordered automatically. */
  reorder(ref: string): ReorderReport {
    const o = ownOrder(ref);
    const rep: ReorderReport = { added: [], adjusted: [], unavailable: [] };
    tx((d) => {
      const c = (d.carts[cartKey()] ??= { items: [] });
      o.items.forEach((li) => {
        const p = pub(li.productId);
        const vid = p?.variants && li.variantLabel ? (p.variants.flatMap((g) => g.options).find((op) => op.label === li.variantLabel)?.id ?? null) : null;
        if (!p || maxQty(p, vid) <= 0) {
          rep.unavailable.push(li.name);
          return;
        }
        const lim = maxQty(p, vid);
        const ex = c.items.find((x) => x.productId === p.id && x.variantId === vid);
        let qty = li.qty;
        if ((ex?.qty ?? 0) + qty > lim) {
          qty = lim - (ex?.qty ?? 0);
          if (qty <= 0) {
            rep.adjusted.push({ name: p.name, reason: 'already at maximum stock in your cart' });
            return;
          }
          rep.adjusted.push({ name: p.name, reason: `only ${lim} in stock now (was ${li.qty})` });
        }
        const price = unitPrice(p, vid);
        if (price !== li.unitPrice) rep.adjusted.push({ name: p.name, reason: `current price ${fmt(price)} (was ${fmt(li.unitPrice)})` });
        if (ex) ex.qty = Math.min(ex.qty + qty, lim);
        else c.items.push({ productId: p.id, variantId: vid, qty: Math.min(qty, lim) });
        rep.added.push(p.name);
      });
    });
    return rep;
  },
};
