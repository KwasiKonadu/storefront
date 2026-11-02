'use client';

import { ChangePasswordForm, ContactInfoForm } from '@/components/organisms';
import { AccountLayout } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';

export default function ProfilePage() {
  usePageTitle('Edit profile');
  const user = useRequireUser();
  if (!user) return null;
  return (
    <AccountLayout active="/account/profile" title="Edit profile" crumbs={[{ label: 'My account', href: '/account' }, { label: 'Edit profile' }]}>
      <ContactInfoForm user={user} />
      <ChangePasswordForm />
    </AccountLayout>
  );
}
