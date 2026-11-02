'use client';

import { usePathname } from 'next/navigation';
import { useEffect, type ReactNode } from 'react';
import { CartDrawer, MobileMenu, Modal, SearchOverlay, SiteFooter, SiteHeader, ToastRegion } from '@/components/organisms';
import { AnnouncementBar } from '@/components/organisms';
import { useDbReady } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

/** Site chrome around every page: announcement, header, footer and the global overlays. */
export function SiteLayout({ children }: { children: ReactNode }) {
  const ready = useDbReady();
  const { closeModal, closeMenu, closeSearch } = useUI();
  const pathname = usePathname();

  // navigating anywhere dismisses open layers
  useEffect(() => {
    closeModal();
    closeMenu();
    closeSearch();
  }, [pathname, closeModal, closeMenu, closeSearch]);

  if (!ready) return <div className="boot" aria-busy="true" style={{ minHeight: '100vh' }} />;

  return (
    <>
      <a className="skip-link" href="#view">Skip to content</a>
      <AnnouncementBar />
      <SiteHeader />
      <main id="view" tabIndex={-1}>{children}</main>
      <SiteFooter />
      <CartDrawer />
      <MobileMenu />
      <SearchOverlay />
      <Modal />
      <ToastRegion />
    </>
  );
}
