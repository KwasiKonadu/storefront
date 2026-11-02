'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

/** "Proceed to checkout" — sends guests to sign in first, then back to checkout. */
export function useGoToCheckout() {
  const { user } = useStore();
  const { toast, closeCart } = useUI();
  const router = useRouter();
  return useCallback(() => {
    closeCart();
    if (!user) {
      toast('Please sign in to check out.');
      router.push(`/signin?next=${encodeURIComponent('/checkout')}`);
      return;
    }
    router.push('/checkout');
  }, [user, toast, closeCart, router]);
}
