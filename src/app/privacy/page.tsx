'use client';

import { PolicyDocument } from '@/components/organisms';
import { ContentPage } from '@/components/templates';
import { usePageTitle } from '@/hooks';
import { privacy, POLICIES_UPDATED } from '@/lib/content/policies';
import { fmtDate } from '@/lib/format';

export default function PrivacyPage() {
  usePageTitle('Privacy policy');
  return (
    <ContentPage title="Privacy policy" sub={`Last updated ${fmtDate(POLICIES_UPDATED)}`}>
      <PolicyDocument sections={privacy()} />
    </ContentPage>
  );
}
