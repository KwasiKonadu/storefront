import type { ReactNode } from 'react';

export function FilterGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="f-group">
      {title && <h4>{title}</h4>}
      {children}
    </div>
  );
}
