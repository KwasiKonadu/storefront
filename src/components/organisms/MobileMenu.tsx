'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { Brand, Icon, IconButton } from '@/components/atoms';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { api } from '@/lib/api';
import { cx } from '@/lib/format';

export function MobileMenu() {
  const { user } = useStore();
  const { menuOpen, closeMenu } = useUI();
  const cats = api.catalog.categories();

  const link = (href: string, label: ReactNode) => (
    <Link key={href} href={href} onClick={closeMenu}>{label}</Link>
  );

  return (
    <div className={cx('mobile-menu', menuOpen && 'open')}>
      <div className="mm-scrim" onClick={closeMenu} />
      <div className="mm-panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Brand onClick={closeMenu} />
          <IconButton aria-label="Close menu" onClick={closeMenu}>
            <Icon name="x" />
          </IconButton>
        </div>
        <div className="mm-nav">
          {link('/shop', <>Shop all <Icon name="arrR" small /></>)}
          {cats.map((c) => link(`/shop?category=${c.slug}`, <>{c.name} <Icon name="chevR" small /></>))}
        </div>
        <p className="mm-sec">Account</p>
        <div className="mm-nav">
          {user ? (
            <>
              {link('/account', 'My account')}
              {link('/orders', 'My orders')}
              {link('/wishlist', 'Wishlist')}
              {link('/account/addresses', 'Addresses')}
            </>
          ) : (
            <>
              {link('/signin', 'Sign in')}
              {link('/register', 'Create account')}
              {link('/signin?next=/orders', 'Track an order')}
            </>
          )}
        </div>
        <p className="mm-sec">Help</p>
        <div className="mm-nav">
          {link('/faq', 'FAQ')}
          {link('/delivery', 'Delivery & pickup')}
          {link('/returns', 'Returns')}
          {link('/contact', 'Contact us')}
        </div>
      </div>
    </div>
  );
}
