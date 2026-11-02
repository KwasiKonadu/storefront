'use client';

import { Toast } from '@/components/molecules';
import { useUI } from '@/context/UIContext';

export function ToastRegion() {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="toast-root" aria-live="polite" aria-atomic="false">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={() => dismissToast(t.id)} />
      ))}
    </div>
  );
}
