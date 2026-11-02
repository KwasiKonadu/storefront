'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

/** Signed-in customers have no business on sign in / register — send them on (honouring ?next=). */
export function useRedirectIfSignedIn() {
  const { user } = useStore();
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '';
  useEffect(() => {
    if (user) router.replace(next.startsWith('/') ? next : '/account');
  }, [user, next, router]);
}
