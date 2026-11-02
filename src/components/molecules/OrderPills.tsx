import { Pill } from '@/components/atoms';
import { ORDER_STATUSES } from '@/lib/config';
import type { Order, OrderStatus } from '@/lib/types';

export const OrderStatusPill = ({ status }: { status: OrderStatus }) => (
  <Pill tone={`s-${status}`} dot>
    {ORDER_STATUSES[status]}
  </Pill>
);

export const PaymentPill = ({ order }: { order: Pick<Order, 'paymentStatus'> }) => (
  <Pill tone={order.paymentStatus === 'paid' ? 'pay-pill paid' : 'pay-pill'}>{order.paymentStatus === 'paid' ? 'Paid' : 'Payment pending'}</Pill>
);

/** Status + payment pills side by side (order detail header). */
export const OrderPills = ({ order }: { order: Order }) => (
  <>
    <OrderStatusPill status={order.status} />
    <PaymentPill order={order} />
  </>
);
