'use client';

import { Button, Icon } from '@/components/atoms';
import { ShipProgress, SummaryRow, SummaryTotal } from '@/components/molecules';
import { useGoToCheckout } from '@/hooks';
import { fmt } from '@/lib/format';

export function CartSummary({ subtotal }: { subtotal: number }) {
  const goToCheckout = useGoToCheckout();
  return (
    <aside className="summary" aria-label="Order summary">
      <h3>Summary</h3>
      <ShipProgress subtotal={subtotal} variant="summary" />
      <SummaryRow label="Subtotal"><b>{fmt(subtotal)}</b></SummaryRow>
      <SummaryRow label="Discounts"><b>Already applied</b></SummaryRow>
      <SummaryRow label="Delivery"><span style={{ color: 'var(--faint)' }}>Calculated at checkout</span></SummaryRow>
      <SummaryTotal label="Estimated total">{fmt(subtotal)}</SummaryTotal>
      <Button size="lg" onClick={goToCheckout}>
        Proceed to checkout <Icon name="arrR" small />
      </Button>
      <p className="cart-empty-note">Final prices and stock are confirmed when you place the order.</p>
    </aside>
  );
}
