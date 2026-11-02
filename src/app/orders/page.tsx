'use client';

import { useSearchParams } from 'next/navigation';
import { PageHeading } from '@/components/molecules';
import { OrderList } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { usePageTitle, useRequireUser } from '@/hooks';
import { api } from '@/lib/api';

export default function OrdersPage() {
  usePageTitle('My orders');
  const user = useRequireUser();
  const filter = useSearchParams().get('f') ?? 'all';
  if (!user) return null;
  return (
    <PageContainer>
      <PageHeading title="My orders" sub="Your current and past orders, with their latest status." />
      <OrderList orders={api.orders.listMine()} filter={filter} />
    </PageContainer>
  );
}
