import { Icon } from '@/components/atoms';
import { DELIVERY_FLOW, ORDER_STATUSES, PICKUP_FLOW } from '@/lib/config';
import { cx } from '@/lib/format';
import type { Order } from '@/lib/types';

export function OrderTracker({ order }: { order: Pick<Order, 'fulfilment' | 'status'> }) {
  const flow = order.fulfilment === 'pickup' ? PICKUP_FLOW : DELIVERY_FLOW;
  const idx = flow.indexOf(order.status);
  return (
    <div className="tracker">
      {flow.map((s, i) => (
        <div key={s} className={cx('tr-step', i < idx && 'done', i === idx && 'active')}>
          <span className="tr-dot">{i <= idx && <Icon name="check" small />}</span>
          <span className="tr-label">{ORDER_STATUSES[s]}</span>
        </div>
      ))}
    </div>
  );
}
