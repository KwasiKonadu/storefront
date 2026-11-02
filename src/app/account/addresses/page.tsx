'use client';

import { AddressBook } from '@/components/organisms';
import { AccountLayout } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';

export default function AddressesPage() {
  usePageTitle('Saved addresses');
  const user = useRequireUser();
  if (!user) return null;
  return (
    <AccountLayout
      active="/account/addresses"
      title="Saved addresses"
      sub="Used at checkout. Fees and speed depend on each address’s delivery area."
      crumbs={[{ label: 'My account', href: '/account' }, { label: 'Saved addresses' }]}
    >
      <AddressBook />
    </AccountLayout>
  );
}
