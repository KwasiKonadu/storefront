'use client';

import { PageHeading } from '@/components/molecules';
import { CheckoutFlow } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { useCart, usePageTitle, useRequireUser } from '@/hooks';

export default function CheckoutPage() {
  usePageTitle('Checkout');
  const user = useRequireUser();
  const cart = useCart();
  if (!user) return null;
  return (
    <PageContainer>
      <PageHeading title="Checkout" sub="Three short steps. We confirm the final prices and stock when you place the order." />
      <CheckoutFlow user={user} cart={cart} />
    </PageContainer>
  );
}
