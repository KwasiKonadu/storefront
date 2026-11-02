'use client';

import { RegisterForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { usePageTitle, useRedirectIfSignedIn } from '@/hooks';

export default function RegisterPage() {
  usePageTitle('Create account');
  useRedirectIfSignedIn();
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
