import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '@/lib/format';

export type ButtonVariant = 'primary' | 'outline' | 'cream' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonStyleProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
}

const VARIANT: Record<ButtonVariant, string> = { primary: '', outline: 'btn-o', cream: 'btn-cream', danger: 'btn-danger' };
const SIZE: Record<ButtonSize, string> = { sm: 'btn-sm', md: '', lg: 'btn-lg' };

/** Shared by <Button> and <ButtonLink> so links and buttons look identical. */
export const buttonClass = ({ variant = 'primary', size = 'md', block, className }: ButtonStyleProps & { className?: string } = {}) =>
  cx('btn', VARIANT[variant], SIZE[size], className);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyleProps;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant, size, block, className, style, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={buttonClass({ variant, size, className })} style={block ? { width: '100%', ...style } : style} {...rest} />;
});
