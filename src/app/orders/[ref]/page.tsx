'use client';

import { useParams } from 'next/navigation';
import { OrderPills, PageHeading } from '@/components/molecules';
import { NotFoundState, OrderActions, OrderInfoGrid, OrderItemsPanel, OrderStatusPanel } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';
import { api } from '@/lib/api';
import { fmtDateTime } from '@/lib/format';
import type { Order } from '@/lib/types';

export default function OrderDetailPage() {
  const { ref } = useParams<{ ref: string }>();
  const user = useRequireUser();
  usePageTitle(`Order ${decodeURIComponent(ref)}`);
  if (!user) return null;

  let order: Order | null = null;
  try {
    order = api.orders.get(decodeURIComponent(ref));
  } catch {
    /* falls through to not-found */
  }
  if (!order)
    return (
      <PageContainer>
        <NotFoundState message="This order doesn’t exist, or it belongs to a different account." />
      </PageContainer>
    );

  return (
    <PageContainer maxWidth={880}>
      <PageHeading
        crumbs={[{ label: 'My orders', href: '/orders' }, { label: order.ref }]}
        title={`Order ${order.ref}`}
        sub={`Placed ${fmtDateTime(order.createdAt)}`}
        aside={<OrderPills order={order} />}
      />
      <OrderStatusPanel order={order} />
      <OrderItemsPanel order={order} />
      <OrderInfoGrid order={order} />
      <OrderActions order={order} />
    </PageContainer>
  );
}
