'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

export function useWishlist() {
  const { wishIds, refresh, user } = useStore();
  const { toast } = useUI();
  const router = useRouter();

  const toggle = useCallback(
    (productId: string) => {
      const added = api.wishlist.toggle(productId);
      refresh();
      toast(added ? 'Saved to wishlist.' : 'Removed from wishlist.', {
        action: user
          ? { label: 'View', onClick: () => router.push('/wishlist') }
          : { label: 'Sign in to sync', onClick: () => router.push('/signin') },
      });
    },
    [refresh, toast, user, router],
  );

  return { ids: wishIds, has: (id: string) => wishIds.includes(id), toggle };
}
