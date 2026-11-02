import type { ReactNode } from 'react';
import { Icon } from '@/components/atoms';

export function Chip({ children, onRemove, removeLabel }: { children: ReactNode; onRemove: () => void; removeLabel: string }) {
  return (
    <span className="chip">
      {children}
      <button type="button" onClick={onRemove} aria-label={removeLabel}>
        <Icon name="x" small />
      </button>
    </span>
  );
}
