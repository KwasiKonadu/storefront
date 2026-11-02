import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

export interface PillProps {
  /** extra modifier classes, e.g. `s-completed` or `pay-pill paid` */
  tone?: string;
  dot?: boolean;
  children: ReactNode;
}

export function Pill({ tone, dot, children }: PillProps) {
  return (
    <span className={cx('pill', tone)}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}
