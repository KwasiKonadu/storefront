import { Icon } from '@/components/atoms';
import { ReviewItem, SummaryRow, SummaryTotal } from '@/components/molecules';
import { fmt } from '@/lib/format';
import type { Fulfilment, CartView } from '@/lib/types';

export interface CheckoutSummaryProps {
  cart: CartView;
  fulfilment: Fulfilment;
  /** listed fee; null = unsupported area */
  fee: number | null;
  feeNote: React.ReactNode;
  total: number;
}

export function CheckoutSummary({ cart, fulfilment, fee, feeNote, total }: CheckoutSummaryProps) {
  return (
    <aside className="summary" aria-label="Order summary">
      <h3>Order summary</h3>
      {cart.items.map((it) => (
        <ReviewItem compact key={`${it.productId}:${it.variantId}`} image={it.image} name={it.name} variantLabel={it.variantLabel} qty={it.qty} unit={it.unit} total={it.unit * it.qty} />
      ))}
      <div style={{ marginTop: 14 }}>
        <SummaryRow label="Subtotal"><b>{fmt(cart.subtotal)}</b></SummaryRow>
        <SummaryRow label={fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}>
          {fulfilment === 'pickup' ? <b>Free</b> : fee == null ? <span style={{ color: 'var(--clay)' }}>Unsupported area</span> : <b>{feeNote}</b>}
        </SummaryRow>
        <SummaryTotal label="Total">{fmt(total)}</SummaryTotal>
      </div>
      <p className="cart-empty-note">
        <Icon name="shield" small /> Stock, prices and totals re-validated on the server at submission. Duplicate submissions are collapsed by an idempotency key.
      </p>
    </aside>
  );
}
