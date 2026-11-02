import Link from 'next/link';
import { Button, buttonClass, Icon } from '@/components/atoms';
import { fmt, fmtDate } from '@/lib/format';
import type { Order } from '@/lib/types';
import { OrderStatusPill, PaymentPill } from './OrderPills';

export function OrderCard({ order, onReorder }: { order: Order; onReorder: () => void }) {
  const count = order.items.reduce((s, i) => s + i.qty, 0);
  return (
    <div className="order-card">
      <div className="oc-ref">
        <b>{order.ref}</b>
        <span>{fmtDate(order.createdAt)}</span>
      </div>
      <div className="oc-meta">
        <div>Items<b>{count}</b></div>
        <div>Total<b>{fmt(order.total)}</b></div>
        <div>Status<OrderStatusPill status={order.status} /></div>
        <div>Payment<PaymentPill order={order} /></div>
      </div>
      <div className="oc-actions">
        <Button variant="outline" size="sm" onClick={onReorder}>
          <Icon name="refresh" small /> Reorder
        </Button>
        <Link className={buttonClass({ size: 'sm' })} href={`/orders/${order.ref}`}>View details</Link>
      </div>
    </div>
  );
}
