'use client';

import { useEffect, useState } from 'react';
import { Icon, type IconName } from '@/components/atoms';
import type { ToastItem } from '@/context/UIContext';

const ICON: Record<ToastItem['type'], IconName> = { ok: 'checkC', warn: 'alert', info: 'info' };

export function Toast({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    const fade = setTimeout(() => setLeaving(true), 4200);
    const gone = setTimeout(onDismiss, 4600);
    return () => {
      clearTimeout(fade);
      clearTimeout(gone);
    };
  }, [onDismiss]);

  return (
    <div className={`toast ${toast.type}`} style={leaving ? { opacity: 0, transition: 'opacity .4s' } : undefined}>
      <Icon name={ICON[toast.type]} small />
      <div>
        {toast.message}
        {toast.action && (
          <>
            <br />
            <button
              type="button"
              className="t-action"
              onClick={() => {
                toast.action?.onClick();
                onDismiss();
              }}
            >
              {toast.action.label}
            </button>
          </>
        )}
      </div>
      <button type="button" className="t-x" aria-label="Dismiss" onClick={onDismiss}>
        <Icon name="x" small />
      </button>
    </div>
  );
}
