'use client';

import { useParams } from 'next/navigation';
import { NotFoundState, OrderConfirmation } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

export default function OrderConfirmPage() {
  usePageTitle('Order placed');
  const { ref } = useParams<{ ref: string }>();
  const user = useRequireUser();
  if (!user) return null;

  let order: Order | null = null;
  try {
    order = api.orders.get(decodeURIComponent(ref));
  } catch {
    /* falls through to not-found */
  }

  return (
    <PageContainer maxWidth={760}>
      {order ? <OrderConfirmation order={order} /> : <NotFoundState />}
    </PageContainer>
  );
}
