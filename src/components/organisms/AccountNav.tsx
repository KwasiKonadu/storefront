'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, type IconName } from '@/components/atoms';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { cx } from '@/lib/format';

const ITEMS: [href: string, icon: IconName, label: string][] = [
  ['/account', 'user', 'My account'],
  ['/account/profile', 'edit', 'Edit profile'],
  ['/account/addresses', 'pin', 'Saved addresses'],
  ['/orders', 'box', 'My orders'],
  ['/wishlist', 'heart', 'Wishlist'],
];

export function AccountNav({ active }: { active: string }) {
  const { signOut } = useStore();
  const { toast } = useUI();
  const router = useRouter();
  return (
    <nav className="acct-nav" aria-label="Account">
      {ITEMS.map(([href, icon, label]) => (
        <Link key={href} href={href} className={cx(active === href && 'on')}>
          <Icon name={icon} small /> {label}
        </Link>
      ))}
      <button
        type="button"
        onClick={() => {
          signOut();
          toast('Signed out. See you soon.');
          router.push('/');
        }}
      >
        <Icon name="logout" small /> Sign out
      </button>
    </nav>
  );
}
