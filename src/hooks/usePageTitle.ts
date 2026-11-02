'use client';

import { useEffect } from 'react';
import { CFG } from '@/lib/config';

/** Sets document.title. Pass nothing for the default "Store — tagline" title. */
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} — ${CFG.storeName}` : [CFG.storeName, CFG.tagline].filter(Boolean).join(' — ');
  }, [title]);
}
