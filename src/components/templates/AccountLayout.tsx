import type { ReactNode } from 'react';
import { PageHeading, type Crumb } from '@/components/molecules';
import { AccountNav } from '@/components/organisms';
import { PageContainer } from './PageContainer';

/** Account area frame: page heading + side navigation + content column. */
export function AccountLayout({ active, title, sub, crumbs, children }: { active: string; title: ReactNode; sub?: ReactNode; crumbs?: Crumb[]; children: ReactNode }) {
  return (
    <PageContainer>
      <PageHeading title={title} sub={sub} crumbs={crumbs} />
      <div className="account-layout">
        <AccountNav active={active} />
        <div>{children}</div>
      </div>
    </PageContainer>
  );
}
