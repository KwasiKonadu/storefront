import { ORDER_STATUSES } from '@/lib/config';
import { fmtDateTime } from '@/lib/format';
import type { StatusEvent } from '@/lib/types';

export function OrderHistory({ events }: { events: StatusEvent[] }) {
  return (
    <ul className="history">
      {[...events].reverse().map((h, i) => (
        <li key={i}>
          <span className="h-dot" />
          <div>
            <b>{ORDER_STATUSES[h.status]}</b>
            {h.note && <span>{h.note}</span>}
          </div>
          <span className="h-date">{fmtDateTime(h.at)}</span>
        </li>
      ))}
    </ul>
  );
}
