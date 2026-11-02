import { maxQty, unitPrice, variantLabel } from '../catalog';
import { D, tx } from '../db';
import { cartKey } from '../session';
import type { CartView } from '../types';
import { ApiError } from './errors';
import { prod, pub } from './shared';

const cartRaw = () => D().carts[cartKey()] ?? { items: [] };

export const cart = {
  get(): CartView {
    const items = cartRaw().items.flatMap((it, index) => {
      const p = prod(it.productId);
      if (!p || !p.published) return []; // silently unavailable — surfaced at checkout / reorder
      return [
        {
          index,
          productId: p.id,
          variantId: it.variantId,
          qty: it.qty,
          name: p.name,
          slug: p.slug,
          image: p.images[0],
          stock: maxQty(p, it.variantId),
          unit: unitPrice(p, it.variantId),
          variantLabel: variantLabel(p, it.variantId),
          sku: p.sku,
        },
      ];
    });
    return {
      items,
      subtotal: items.reduce((s, i) => s + i.unit * i.qty, 0),
      count: items.reduce((s, i) => s + i.qty, 0),
    };
  },

  add(productId: string, variantId: string | null, qty = 1) {
    const p = pub(productId);
    if (!p) throw new ApiError('This product is no longer available.');
    const lim = maxQty(p, variantId || null);
    if (lim <= 0) throw new ApiError(p.stock > 0 ? 'Not enough stock for a full pack.' : 'This product is out of stock.');
    const amount = Math.max(1, Math.min(+qty || 1, 99));
    let capped = false;
    tx((d) => {
      const c = (d.carts[cartKey()] ??= { items: [] });
      const ex = c.items.find((i) => i.productId === productId && i.variantId === (variantId || null));
      const want = (ex?.qty ?? 0) + amount;
      if (want > lim) capped = true;
      if (ex) ex.qty = Math.min(want, lim);
      else c.items.push({ productId, variantId: variantId || null, qty: Math.min(want, lim) });
      c.updatedAt = Date.now();
    });
    return { capped, stock: lim };
  },

  setQty(index: number, qty: number) {
    const it = cartRaw().items[index];
    if (!it) return { capped: false, stock: 0 };
    const p = pub(it.productId);
    if (!p) {
      cart.remove(index);
      throw new ApiError('Item removed — no longer available.');
    }
    const lim = maxQty(p, it.variantId);
    const next = Math.max(1, Math.min(+qty || 1, lim, 99));
    const capped = next < Math.min(it.qty, 99) || next === lim;
    tx((d) => {
      d.carts[cartKey()].items[index].qty = next;
    });
    return { capped, stock: lim };
  },

  remove(index: number) {
    tx((d) => d.carts[cartKey()]?.items.splice(index, 1));
  },

  clear() {
    tx((d) => {
      delete d.carts[cartKey()];
    });
  },

  /** Drop unavailable lines and cap quantities at live stock, so the cart reflects reality. */
  reconcile() {
    tx((d) => {
      const c = d.carts[cartKey()];
      if (!c) return;
      c.items = c.items.filter((it) => {
        const p = prod(it.productId);
        return !!p && p.published && maxQty(p, it.variantId) > 0;
      });
      c.items.forEach((it) => {
        const p = prod(it.productId)!;
        const lim = maxQty(p, it.variantId);
        if (it.qty > lim) it.qty = lim;
      });
    });
  },
};
