import type { ReactNode } from 'react';
import { PageHeading } from '@/components/molecules';
import { PageContainer } from './PageContainer';

/** Long-form page (FAQ, policies…): heading + readable column. */
export function ContentPage({ title, sub, children, maxWidth = 840 }: { title: ReactNode; sub?: ReactNode; children: ReactNode; maxWidth?: number }) {
  return (
    <PageContainer maxWidth={maxWidth}>
      <PageHeading title={title} sub={sub} />
      {children}
    </PageContainer>
  );
}
