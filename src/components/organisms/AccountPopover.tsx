'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon, IconButton, type IconName } from '@/components/atoms';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

export function AccountPopover() {
  const { user, signOut } = useStore();
  const { toast } = useUI();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const item = (href: string, icon: IconName, label: string) => (
    <Link href={href} onClick={() => setOpen(false)}>
      <Icon name={icon} small /> {label}
    </Link>
  );

  return (
    <div className="acct-wrap" ref={wrap}>
      <IconButton aria-label="Account" aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <Icon name="user" />
      </IconButton>
      <div className={open ? 'popover open' : 'popover'}>
        {user ? (
          <>
            <div className="pp-head">
              <b>{user.name}</b>
              <span>{user.email}</span>
            </div>
            {item('/account', 'user', 'My account')}
            {item('/orders', 'box', 'My orders')}
            {item('/wishlist', 'heart', 'Wishlist')}
            {item('/account/addresses', 'pin', 'Saved addresses')}
            <button
              type="button"
              className="pp-item"
              onClick={() => {
                setOpen(false);
                signOut();
                toast('Signed out. See you soon.');
                router.push('/');
              }}
            >
              <Icon name="logout" small /> Sign out
            </button>
          </>
        ) : (
          <>
            {item('/signin', 'user', 'Sign in')}
            {item('/register', 'heart', 'Create account')}
            {item('/signin?next=/orders', 'box', 'Track an order')}
          </>
        )}
      </div>
    </div>
  );
}
