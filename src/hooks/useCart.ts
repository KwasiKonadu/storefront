'use client';

import { useCallback, useMemo } from 'react';
import { api, ApiError } from '@/lib/api';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

/** Live cart view — re-reads after every store mutation. */
export function useCart() {
  const { version, ready } = useStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => api.cart.get(), [version, ready]);
}

/** Cart mutations with the toasts / drawer behaviour the storefront expects. */
export function useCartActions() {
  const { refresh } = useStore();
  const { toast, openCart } = useUI();
  const fail = useCallback((e: unknown) => toast(e instanceof ApiError ? e.message : 'Something went wrong.', { type: 'warn' }), [toast]);

  const add = useCallback(
    (productId: string, variantId: string | null, qty = 1, { openDrawer = true } = {}) => {
      try {
        const r = api.cart.add(productId, variantId, qty);
        refresh();
        if (r.capped) toast(`Added — limited to ${r.stock} in stock.`, { type: 'warn' });
        if (openDrawer) openCart();
        else toast('Added to your cart.', { action: { label: 'View cart', onClick: openCart } });
      } catch (e) {
        fail(e);
      }
    },
    [refresh, toast, openCart, fail],
  );

  const setQty = useCallback(
    (index: number, qty: number, direction: 1 | -1) => {
      try {
        const r = api.cart.setQty(index, qty);
        if (r.capped && direction > 0) toast(`Limited to ${r.stock} — that’s all the stock there is.`, { type: 'warn' });
      } catch (e) {
        fail(e);
      }
      refresh();
    },
    [refresh, toast, fail],
  );

  const remove = useCallback(
    (index: number) => {
      api.cart.remove(index);
      refresh();
    },
    [refresh],
  );

  const clear = useCallback(() => {
    api.cart.clear();
    refresh();
    toast('Cart cleared.');
  }, [refresh, toast]);

  return { add, setQty, remove, clear };
}
