import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/atoms';

export function ContactRow({ icon, title, children }: { icon: IconName; title: string; children: ReactNode }) {
  return (
    <div className="c-row">
      <Icon name={icon} />
      <div>
        <b>{title}</b>
        <span>{children}</span>
      </div>
    </div>
  );
}
