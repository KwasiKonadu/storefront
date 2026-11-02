import type { InputHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/format';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'children'> {
  children: ReactNode;
  labelClassName?: string;
}

export function Checkbox({ children, labelClassName, ...rest }: CheckboxProps) {
  return (
    <label className={cx('checkline', labelClassName)}>
      <input type="checkbox" {...rest} /> {children}
    </label>
  );
}
