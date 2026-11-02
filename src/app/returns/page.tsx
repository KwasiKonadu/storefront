'use client';

import { ReturnsPolicy } from '@/components/organisms';
import { ContentPage } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function ReturnsPage() {
  usePageTitle('Returns & refunds');
  return (
    <ContentPage title="Returns & refunds">
      <ReturnsPolicy />
    </ContentPage>
  );
}
