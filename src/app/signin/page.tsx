'use client';

import { SignInForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { usePageTitle, useRedirectIfSignedIn } from '@/hooks';

export default function SignInPage() {
  usePageTitle('Sign in');
  useRedirectIfSignedIn();
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  );
}
