'use client';

import { PolicyDocument } from '@/components/organisms';
import { ContentPage } from '@/components/templates';
import { usePageTitle } from '@/hooks';
import { terms, POLICIES_UPDATED } from '@/lib/content/policies';
import { fmtDate } from '@/lib/format';

export default function TermsPage() {
  usePageTitle('Terms & conditions');
  return (
    <ContentPage title="Terms & conditions" sub={`Last updated ${fmtDate(POLICIES_UPDATED)}`}>
      <PolicyDocument sections={terms()} />
    </ContentPage>
  );
}
