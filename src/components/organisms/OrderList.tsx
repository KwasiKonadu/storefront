'use client';

import { useRouter } from 'next/navigation';
import { ButtonLink } from '@/components/atoms';
import { EmptyState, OrderCard } from '@/components/molecules';
import { useReorder } from '@/hooks';
import { IN_PROGRESS } from '@/lib/config';
import { plural } from '@/lib/format';
import type { Order } from '@/lib/types';

const FILTERS: [string, string][] = [
  ['all', 'All orders'],
  ['active', 'In progress'],
  ['completed', 'Completed'],
  ['cancelled', 'Cancelled'],
];

export const filterOrders = (orders: Order[], f: string) =>
  orders.filter((o) => (f === 'all' ? true : f === 'active' ? IN_PROGRESS.includes(o.status) : o.status === f));

/** Filter dropdown + order cards. `filter` comes from the URL. */
export function OrderList({ orders, filter }: { orders: Order[]; filter: string }) {
  const router = useRouter();
  const reorder = useReorder();
  const shown = filterOrders(orders, filter);
  return (
    <div style={{ maxWidth: 860 }}>
      <div className="shop-toolbar">
        <span className="result-count">{plural(shown.length, 'order')}</span>
        <label className="sort-wrap">
          Show
          <select value={filter} onChange={(e) => router.push(e.target.value === 'all' ? '/orders' : `/orders?f=${e.target.value}`)}>
            {FILTERS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
      </div>
      {shown.length ? (
        shown.map((o) => <OrderCard key={o.id} order={o} onReorder={() => reorder(o.ref)} />)
      ) : (
        <EmptyState
          icon="box"
          title={filter === 'all' ? 'No orders yet' : 'No orders here yet'}
          text={filter === 'all' ? 'Your first order will appear here the moment it’s placed.' : 'Try another filter, or place a new order.'}
          action={<ButtonLink href="/shop">Browse the shop</ButtonLink>}
        />
      )}
    </div>
  );
}
