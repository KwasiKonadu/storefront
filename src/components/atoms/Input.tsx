import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cx } from '@/lib/format';

interface Invalidatable {
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & Invalidatable>(function Input(
  { invalid, className, ...rest },
  ref,
) {
  return <input ref={ref} className={cx('input', className)} aria-invalid={invalid ? 'true' : undefined} {...rest} />;
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & Invalidatable>(function Textarea(
  { invalid, className, ...rest },
  ref,
) {
  return <textarea ref={ref} className={cx('input', className)} aria-invalid={invalid ? 'true' : undefined} {...rest} />;
});

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & Invalidatable>(function Select(
  { invalid, className, ...rest },
  ref,
) {
  return <select ref={ref} className={cx('input', className)} aria-invalid={invalid ? 'true' : undefined} {...rest} />;
});
