import { Alert, OrderHistory, OrderTracker } from '@/components/molecules';
import type { Order } from '@/lib/types';

export function OrderStatusPanel({ order }: { order: Order }) {
  const cancelNote = order.statusHistory.filter((h) => h.status === 'cancelled').slice(-1)[0]?.note;
  return (
    <div className="panel">
      {order.status === 'cancelled' ? (
        <Alert tone="error" style={{ margin: 0 }}>
          <b>This order was cancelled.</b> {cancelNote}
        </Alert>
      ) : (
        <OrderTracker order={order} />
      )}
      <OrderHistory events={order.statusHistory} />
    </div>
  );
}
