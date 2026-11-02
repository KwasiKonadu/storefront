import type { ReactNode } from 'react';

/** Standard page wrapper: fade-in + centred shell, optionally narrower. */
export function PageContainer({ children, maxWidth }: { children: ReactNode; maxWidth?: number }) {
  return (
    <div className="view-in">
      <div className="shell" style={maxWidth ? { maxWidth } : undefined}>
        {children}
      </div>
    </div>
  );
}
