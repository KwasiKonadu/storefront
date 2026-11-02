'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from 'react';
import { api, type LoginResult } from '@/lib/api';
import { loadCatalog } from '@/lib/catalogStore';
import { loadDb } from '@/lib/db';
import { hydrateSession } from '@/lib/api/account';
import { session, wishlistIds } from '@/lib/session';
import type { Customer } from '@/lib/types';

interface StoreValue {
  /** false until the saved local data has been read */
  ready: boolean;
  /** bumps after every mutation so components re-read from the api */
  version: number;
  refresh: () => void;
  user: Customer | null;
  wishIds: string[];
  signIn: (creds: { email: string; password: string }) => Promise<LoginResult>;
  register: (input: { name: string; email: string; password: string }) => Promise<LoginResult>;
  signOut: () => void;
}

const StoreContext = createContext<StoreValue | null>(null);

/**
 * "Is the localStorage-backed database loaded?" lives in an external store so that the hydrating render always uses the
 * server snapshot (`false`) — otherwise a boundary that hydrates after the DB finished loading would mismatch the server HTML.
 */
let dbReady = false;
const readyListeners = new Set<() => void>();
const subscribeReady = (cb: () => void) => {
  readyListeners.add(cb);
  return () => void readyListeners.delete(cb);
};
const markReady = () => {
  dbReady = true;
  readyListeners.forEach((l) => l());
};

/**
 * Read this (not context) wherever the markup differs before/after the DB loads: a Suspense boundary that hydrates late
 * would otherwise see the already-updated context value and mismatch the server HTML.
 */
export const useDbReady = () => useSyncExternalStore(subscribeReady, () => dbReady, () => false);

export function StoreProvider({ children }: { children: ReactNode }) {
  const ready = useDbReady();
  const [version, setVersion] = useState(0);
  const [user, setUser] = useState<Customer | null>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([loadDb(), loadCatalog()])
      .then(() => hydrateSession())
      .then(() => {
        if (!alive) return;
        setUser(session.user);
        markReady();
      });
    return () => {
      alive = false;
    };
  }, []);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);

  // Pick up price, stock and discount changes made in SalesPoint without a reload.
  useEffect(() => {
    if (!ready) return;
    const reload = () => Promise.all([loadCatalog(), api.orders.syncOpen()]).then(() => setVersion((v) => v + 1));
    const timer = setInterval(reload, 60_000);
    const onVisible = () => document.visibilityState === 'visible' && reload();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [ready]);

  const startSession = useCallback((res: LoginResult) => {
    setUser(res.customer);
    setVersion((v) => v + 1);
    return res;
  }, []);

  const signIn = useCallback<StoreValue['signIn']>(async (creds) => startSession(await api.auth.login(creds)), [startSession]);
  const register = useCallback<StoreValue['register']>(async (input) => startSession(await api.auth.register(input)), [startSession]);
  const signOut = useCallback(() => {
    void api.auth.logout().finally(() => {
      setUser(null);
      setVersion((v) => v + 1);
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const wishIds = useMemo(() => (ready ? wishlistIds() : []), [ready, version, user]);

  const value = useMemo<StoreValue>(
    () => ({ ready, version, refresh, user, wishIds, signIn, register, signOut }),
    [ready, version, refresh, user, wishIds, signIn, register, signOut],
  );
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>');
  return ctx;
}
