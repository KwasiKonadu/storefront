'use client';

import { FaqList } from '@/components/organisms';
import { ContentPage } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function FaqPage() {
  usePageTitle('FAQ');
  return (
    <ContentPage title="Frequently asked questions" sub="Short answers on ordering, delivery, pickup, returns and accounts." maxWidth={780}>
      <FaqList />
    </ContentPage>
  );
}
