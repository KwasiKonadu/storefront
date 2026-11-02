import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cx } from '@/lib/format';

export type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string;
  children: ReactNode;
};

/** Round 42px header-style button; children are an <Icon /> and optionally a <CountBadge />. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({ className, type = 'button', ...rest }, ref) {
  return <button ref={ref} type={type} className={cx('hbtn', className)} {...rest} />;
});
