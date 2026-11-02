'use client';

import { ForgotPasswordForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function ForgotPasswordPage() {
  usePageTitle('Forgot password');
  return (
    <AuthLayout>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
