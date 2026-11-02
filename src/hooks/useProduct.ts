'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import type { ProductWithCategory } from '@/lib/types';

export type ProductState = { status: 'loading' } | { status: 'missing' } | { status: 'ready'; product: ProductWithCategory };

export function useProduct(slug: string): ProductState {
  const [state, setState] = useState<ProductState>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    setState({ status: 'loading' });
    api.products
      .get(slug)
      .then((product) => alive && setState({ status: 'ready', product }))
      .catch(() => alive && setState({ status: 'missing' }));
    return () => {
      alive = false;
    };
  }, [slug]);
  return state;
}
