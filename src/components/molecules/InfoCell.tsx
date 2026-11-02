import type { ReactNode } from 'react';

export function InfoCell({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="info-cell">
      <h4>{title}</h4>
      <p>{children}</p>
    </div>
  );
}
