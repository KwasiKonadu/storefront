'use client';

import { useEffect, useState } from 'react';
import { api, type ProductPage, type ProductQuery } from '@/lib/api';

/** Loads a page of products; `loading` is true until the (simulated) network call resolves. */
export function useProductList(query: ProductQuery) {
  const [result, setResult] = useState<ProductPage | null>(null);
  const key = JSON.stringify(query);

  useEffect(() => {
    let alive = true;
    setResult(null);
    api.products.list(JSON.parse(key)).then((r) => alive && setResult(r));
    return () => {
      alive = false;
    };
  }, [key]);

  return (result ? { result, loading: false } : { result: null, loading: true }) as
    | { result: ProductPage; loading: false }
    | { result: null; loading: true };
}
