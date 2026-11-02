'use client';

import { Icon, IconButton } from '@/components/atoms';
import { useUI } from '@/context/UIContext';

/** Renders whichever modal `useUI().openModal()` last opened. */
export function Modal() {
  const { modal, closeModal } = useUI();
  if (!modal) return null;
  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onClick={(e) => e.target === e.currentTarget && closeModal()}>
      <div className="modal" style={modal.wide ? { width: 'min(600px,100%)' } : undefined}>
        <div className="modal-head">
          <h3>{modal.title}</h3>
          <IconButton aria-label="Close" onClick={closeModal}>
            <Icon name="x" />
          </IconButton>
        </div>
        {modal.content}
      </div>
    </div>
  );
}
