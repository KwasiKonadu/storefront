import { ButtonLink, Icon } from '@/components/atoms';
import { ReviewItem, SummaryRow, SummaryTotal } from '@/components/molecules';
import { CFG } from '@/lib/config';
import { fmt, timeAgo } from '@/lib/format';
import type { Order } from '@/lib/types';

export function OrderConfirmation({ order: o }: { order: Order }) {
  return (
    <>
      <div className="confirm-hero">
        <div className="big-check"><Icon name="check" /></div>
        <h1>Thank you — order placed</h1>
        <p className="ref">Your reference is <b>{o.ref}</b> · placed {timeAgo(o.createdAt)}</p>
        <p style={{ color: 'var(--muted)', marginTop: 8, maxWidth: 440, marginInline: 'auto' }}>
          We’re reviewing your order now. You can follow its status any time from My Orders — payment is currently <b>pending</b> ({CFG.paymentMethods.find((m) => m.id === o.paymentMethod)?.label}).
        </p>
      </div>
      <div className="panel" style={{ marginTop: 20 }}>
        {o.items.map((it) => (
          <ReviewItem key={it.productId + it.variantLabel} image={it.image} name={it.name} variantLabel={it.variantLabel} qty={it.qty} unit={it.unitPrice} total={it.lineTotal} />
        ))}
        <div style={{ marginTop: 14 }}>
          <SummaryRow label="Subtotal"><b>{fmt(o.subtotal)}</b></SummaryRow>
          <SummaryRow label={o.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}><b>{o.deliveryFee ? fmt(o.deliveryFee) : 'Free'}</b></SummaryRow>
          <SummaryTotal label="Total">{fmt(o.total)}</SummaryTotal>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 22, flexWrap: 'wrap' }}>
          <ButtonLink href={`/orders/${o.ref}`}>View order details</ButtonLink>
          <ButtonLink variant="outline" href="/shop">Continue shopping</ButtonLink>
        </div>
      </div>
    </>
  );
}
