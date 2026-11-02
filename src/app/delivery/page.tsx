'use client';

import { DeliveryInfo } from '@/components/organisms';
import { ContentPage } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function DeliveryPage() {
  usePageTitle('Delivery & pickup');
  return (
    <ContentPage title="Delivery & pickup" sub="Straight from the store’s configuration — the same rules the checkout enforces.">
      <DeliveryInfo />
    </ContentPage>
  );
}
