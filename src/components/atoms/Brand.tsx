import Link from 'next/link';
import type { ComponentProps } from 'react';
import { CFG } from '@/lib/config';
import { cx } from '@/lib/format';

export function Brand({ className, ...rest }: Omit<ComponentProps<typeof Link>, 'href'>) {
  return (
    <Link className={cx('brand', className)} href="/" {...rest}>
      {CFG.storeName.split(/\s&\s/).flatMap((part, i) => (i ? [<span key={i} className="amp">&amp;</span>, part] : [part]))}
    </Link>
  );
}
