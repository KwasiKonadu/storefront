import type { CSSProperties } from 'react';
import { Icon } from '@/components/atoms';
import { cx } from '@/lib/format';

export interface QuantityStepperProps {
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  small?: boolean;
  style?: CSSProperties;
}

export function QuantityStepper({ value, onDecrease, onIncrease, decreaseDisabled, increaseDisabled, small, style }: QuantityStepperProps) {
  return (
    <div className={cx('qty', small && 'sm')} style={style}>
      <button type="button" onClick={onDecrease} disabled={decreaseDisabled} aria-label="Decrease quantity">
        <Icon name="minus" small />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={onIncrease} disabled={increaseDisabled} aria-label="Increase quantity">
        <Icon name="plus" small />
      </button>
    </div>
  );
}
