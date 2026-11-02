'use client';

import { useCallback } from 'react';
import { ReorderReport } from '@/components/organisms/ReorderReport';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { ApiError, api } from '@/lib/api';

/** Refill the cart from a past order and show the report of what changed. */
export function useReorder() {
  const { refresh } = useStore();
  const { openModal, toast } = useUI();
  return useCallback(
    (ref: string) => {
      try {
        const report = api.orders.reorder(ref);
        refresh();
        openModal({ title: `Reorder — ${ref}`, content: <ReorderReport report={report} /> });
      } catch (e) {
        toast(e instanceof ApiError ? e.message : 'Could not reorder.', { type: 'warn' });
      }
    },
    [refresh, openModal, toast],
  );
}
