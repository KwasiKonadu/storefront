'use client';

import { ButtonLink } from '@/components/atoms';
import { EmptyState, PageHeading } from '@/components/molecules';
import { CartLines, CartSummary } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { useCart, usePageTitle } from '@/hooks';
import { plural } from '@/lib/format';

export default function CartPage() {
  usePageTitle('Cart');
  const cart = useCart();
  return (
    <PageContainer>
      <PageHeading
        title="Shopping cart"
        sub={cart.count ? `${plural(cart.count, 'item')} — quantities are re-checked against live stock at checkout.` : 'Your picks will collect here.'}
      />
      {cart.items.length ? (
        <div className="cart-layout">
          <CartLines cart={cart} />
          <CartSummary subtotal={cart.subtotal} />
        </div>
      ) : (
        <EmptyState icon="bag" title="Your cart is empty" text="Browse the catalogue and add a few good things." action={<ButtonLink href="/shop">Start shopping</ButtonLink>} />
      )}
    </PageContainer>
  );
}
