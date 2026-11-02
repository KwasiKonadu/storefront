import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cx } from '@/lib/format';

export function TextLink({ className, ...rest }: ComponentProps<typeof Link>) {
  return <Link className={cx('link', className)} {...rest} />;
}
