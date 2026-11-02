'use client';

import type { ReactNode } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import { UIProvider } from '@/context/UIContext';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <UIProvider>
      <StoreProvider>{children}</StoreProvider>
    </UIProvider>
  );
}
