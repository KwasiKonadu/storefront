'use client';

import { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

export type ShopQuery = Record<string, string>;

/** Parses the shop URL and builds hrefs that tweak individual filters. */
export function useShopQuery() {
  const params = useSearchParams();
  return useMemo(() => {
    const query: ShopQuery = Object.fromEntries(params.entries());
    const href = (over: ShopQuery = {}) => {
      const merged = { ...query, ...over };
      Object.keys(merged).forEach((k) => {
        if (merged[k] === '' || merged[k] == null) delete merged[k];
      });
      const qs = new URLSearchParams(merged).toString();
      return '/shop' + (qs ? `?${qs}` : '');
    };
    return { query, href };
  }, [params]);
}
