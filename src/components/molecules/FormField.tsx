import type { ReactNode } from 'react';
import { cx } from '@/lib/format';

export interface FormFieldProps {
  id: string;
  label: ReactNode;
  optional?: boolean;
  error?: string;
  note?: ReactNode;
  children: ReactNode;
}

/** Label + control + inline error (+ optional helper note). The control gets `id` and `invalid` from the caller. */
export function FormField({ id, label, optional, error, note, children }: FormFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {optional && (
          <>
            {' '}
            <span className="opt">(optional)</span>
          </>
        )}
      </label>
      {children}
      <p className={cx('err', error && 'show')}>{error}</p>
      {note && <div className="form-note">{note}</div>}
    </div>
  );
}
