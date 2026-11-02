'use client';

import { ResetPasswordForm } from '@/components/organisms';
import { AuthLayout } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function ResetPasswordPage() {
  usePageTitle('Reset password');
  return (
    <AuthLayout>
      <ResetPasswordForm />
    </AuthLayout>
  );
}
