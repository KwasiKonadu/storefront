'use client';

import type { ReactNode } from 'react';
import { Button } from '@/components/atoms';
import { ModalBody, ModalFooter } from '@/components/molecules';

export interface ConfirmDialogProps {
  title?: string;
  message: ReactNode;
  confirmLabel?: string;
  danger?: boolean;
  onResult: (confirmed: boolean) => void;
}

export function ConfirmDialog({ message, confirmLabel = 'Confirm', danger, onResult }: ConfirmDialogProps) {
  return (
    <>
      <ModalBody>
        <p style={{ color: 'var(--muted)', fontSize: 14.5 }}>{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={() => onResult(false)}>Cancel</Button>
        <Button
          style={danger ? { background: 'var(--clay)', borderColor: 'var(--clay)' } : undefined}
          onClick={() => onResult(true)}
        >
          {confirmLabel}
        </Button>
      </ModalFooter>
    </>
  );
}
