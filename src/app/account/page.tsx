'use client';

import { AccountOverview } from '@/components/organisms';
import { AccountLayout } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';

export default function AccountPage() {
  usePageTitle('My account');
  const user = useRequireUser();
  if (!user) return null;
  return (
    <AccountLayout active="/account" title="My account" sub={`Hello, ${user.name.split(' ')[0]} — here’s where things stand.`}>
      <AccountOverview user={user} />
    </AccountLayout>
  );
}
