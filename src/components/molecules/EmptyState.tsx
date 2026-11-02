import type { ReactNode } from 'react';
import { Icon, type IconName } from '@/components/atoms';

export function EmptyState({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty-state">
      <Icon name={icon} />
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
