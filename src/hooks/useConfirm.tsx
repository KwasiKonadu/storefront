'use client';

import { useCallback } from 'react';
import { ConfirmDialog, type ConfirmDialogProps } from '@/components/organisms/ConfirmDialog';
import { useUI } from '@/context/UIContext';

export type ConfirmOptions = Omit<ConfirmDialogProps, 'onResult'>;

/** Promise-based confirmation dialog: `if (await confirm({...})) { … }` */
export function useConfirm() {
  const { openModal, closeModal } = useUI();
  return useCallback(
    (opts: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        let settled = false;
        const done = (v: boolean) => {
          if (settled) return;
          settled = true;
          resolve(v);
        };
        openModal({
          title: opts.title ?? 'Are you sure?',
          content: (
            <ConfirmDialog
              {...opts}
              onResult={(v) => {
                done(v);
                closeModal();
              }}
            />
          ),
          onClose: () => done(false),
        });
      }),
    [openModal, closeModal],
  );
}
