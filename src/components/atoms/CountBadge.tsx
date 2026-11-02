'use client';

import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/format';

/** Round counter on a header icon; pops briefly when the number changes. */
export function CountBadge({ count, id }: { count: number; id?: string }) {
  const [bump, setBump] = useState(false);
  const prev = useRef(count);
  useEffect(() => {
    if (prev.current === count) return;
    prev.current = count;
    setBump(true);
    const t = setTimeout(() => setBump(false), 360);
    return () => clearTimeout(t);
  }, [count]);
  return (
    <span id={id} className={cx('ct', !count && 'zero', bump && 'bump')}>
      {count}
    </span>
  );
}
