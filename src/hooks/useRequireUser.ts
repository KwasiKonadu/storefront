'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useStore } from '@/context/StoreContext';

/** Redirects guests to /signin (remembering where they were). Returns the customer, or null while redirecting. */
export function useRequireUser() {
  const { user, ready } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams().toString();

  useEffect(() => {
    if (ready && !user) router.replace(`/signin?next=${encodeURIComponent(pathname + (search ? `?${search}` : ''))}`);
  }, [ready, user, router, pathname, search]);

  return user;
}
