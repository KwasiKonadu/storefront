import type { CSSProperties, ReactNode } from 'react';
import { Icon, type IconName } from '@/components/atoms';

const ICON: Record<'error' | 'info' | 'success', IconName> = { error: 'alert', info: 'info', success: 'checkC' };

export function Alert({ tone, children, style }: { tone: 'error' | 'info' | 'success'; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className={`alert ${tone}`} role={tone === 'error' ? 'alert' : undefined} style={style}>
      <Icon name={ICON[tone]} small />
      <div>{children}</div>
    </div>
  );
}
