import type { ReactNode } from 'react';

/** Small label pinned to a product image ("New", "−20%"). */
export function Flag({ kind, children }: { kind: 'new' | 'sale'; children: ReactNode }) {
  return <span className={`flag ${kind}`}>{children}</span>;
}
