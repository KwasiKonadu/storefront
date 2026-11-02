'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Brand, CountBadge, Icon, IconButton } from '@/components/atoms';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/hooks';
import { api } from '@/lib/api';
import { cx } from '@/lib/format';
import { AccountPopover } from './AccountPopover';

export function SiteHeader() {
  const { wishIds } = useStore();
  const { openMenu, openSearch, openCart } = useUI();
  const cart = useCart();
  const pathname = usePathname();
  const activeCategory = useSearchParams().get('category');
  const cats = api.catalog.categories().slice(0, 5);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cx('site-header', scrolled && 'scrolled')}>
      <div className="shell header-in">
        <IconButton className="hmenu" aria-label="Open menu" onClick={openMenu}>
          <Icon name="menu" />
        </IconButton>
        <Brand />
        <nav className="main-nav" aria-label="Primary">
          <Link href="/shop" className={cx(pathname === '/shop' && !activeCategory && 'on')}>Shop all</Link>
          {cats.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className={cx(pathname === '/shop' && activeCategory === c.slug && 'on')}>
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <IconButton aria-label="Search" onClick={openSearch}>
            <Icon name="search" />
          </IconButton>
          <AccountPopover />
          <Link className="hbtn" href="/wishlist" aria-label={`Wishlist (${wishIds.length} items)`}>
            <Icon name="heart" />
            <CountBadge count={wishIds.length} />
          </Link>
          <IconButton aria-label={`Cart (${cart.count} items)`} onClick={openCart}>
            <Icon name="bag" />
            <CountBadge count={cart.count} />
          </IconButton>
        </div>
      </div>
    </header>
  );
}
