import { OrderItemLine, SummaryRow, SummaryTotal } from '@/components/molecules';
import { fmt } from '@/lib/format';
import type { Order } from '@/lib/types';

export function OrderItemsPanel({ order }: { order: Order }) {
  return (
    <div className="panel">
      <h2>Items</h2>
      {order.items.map((it) => (
        <OrderItemLine key={it.productId + it.variantLabel} item={it} />
      ))}
      <div style={{ marginTop: 16, maxWidth: 320, marginLeft: 'auto' }}>
        <SummaryRow label="Subtotal"><b>{fmt(order.subtotal)}</b></SummaryRow>
        <SummaryRow label={order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}><b>{order.deliveryFee ? fmt(order.deliveryFee) : 'Free'}</b></SummaryRow>
        <SummaryTotal label="Total">{fmt(order.total)}</SummaryTotal>
      </div>
    </div>
  );
}
