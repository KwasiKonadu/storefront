'use client';

import type { ReactNode } from 'react';
import { useReveal } from '@/hooks';
import { Icon, type IconName } from '@/components/atoms';

export function BenefitItem({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="benefit">
      <Icon name={icon} />
      <div>
        <b>{title}</b>
        <span>{children}</span>
      </div>
    </div>
  );
}
