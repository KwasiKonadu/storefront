'use client';

import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/atoms';
import { useReveal } from '@/hooks';

export function SectionHead({ eyebrow, title, action }: { eyebrow: ReactNode; title: ReactNode; action?: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="sec-head">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}
