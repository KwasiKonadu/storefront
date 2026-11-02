import Link from 'next/link';
import type { ComponentProps } from 'react';
import { buttonClass, type ButtonStyleProps } from './Button';

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonStyleProps;

export function ButtonLink({ variant, size, block, className, style, ...rest }: ButtonLinkProps) {
  return <Link className={buttonClass({ variant, size, className })} style={block ? { width: '100%', ...style } : style} {...rest} />;
}
