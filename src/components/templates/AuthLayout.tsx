import type { ReactNode } from 'react';
import { AuthSidePanel } from '@/components/organisms';

/** Split-screen layout for sign in / register / password pages. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="view-in">
      <div className="auth-layout">
        <AuthSidePanel />
        <div className="auth-form-wrap">{children}</div>
      </div>
    </div>
  );
}
