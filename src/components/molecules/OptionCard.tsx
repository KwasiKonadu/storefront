import type { KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/format';

interface Common {
  selected: boolean;
  onSelect: () => void;
}

const onEnter = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === 'Enter') fn();
};

/** Big selectable card (e.g. Delivery / Pickup). */
export function MethodCard({ selected, onSelect, children, disabled }: Common & { children: ReactNode; disabled?: boolean }) {
  return (
    <div
      className={cx('method-card', selected && 'on', disabled && 'off')}
      role="radio"
      aria-checked={selected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={disabled ? undefined : onSelect}
      onKeyDown={disabled ? undefined : onEnter(onSelect)}
    >
      {children}
    </div>
  );
}

/** Radio row (saved address, payment method). */
export function AddressOption({ selected, onSelect, name, children, style }: Common & { name: string; children: ReactNode; style?: React.CSSProperties }) {
  return (
    <label className={cx('addr-opt', selected && 'on')} style={style} onKeyDown={onEnter(onSelect)}>
      <input type="radio" name={name} checked={selected} onChange={onSelect} />
      <span>{children}</span>
    </label>
  );
}
