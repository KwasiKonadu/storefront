import type { ReactNode } from 'react';

export function SummaryRow({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="sum-row">
      <span>{label}</span>
      {children}
    </div>
  );
}

export function SummaryTotal({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="sum-total">
      <span>{label}</span>
      <span className="serif">{children}</span>
    </div>
  );
}
