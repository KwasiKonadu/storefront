import { fmt } from '@/lib/format';
import type { OrderItem } from '@/lib/types';

export interface ReturnItemRowProps {
  item: OrderItem;
  value: number;
  onChange: (qty: number) => void;
}

export function ReturnItemRow({ item, value, onChange }: ReturnItemRowProps) {
  return (
    <div className="rr-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image || '/placeholder.svg'} alt="" />
      <span style={{ flex: 1 }}>
        <b>{item.name}</b>
        <br />
        <span style={{ color: 'var(--muted)', fontSize: 12.5 }}>ordered {item.qty} · {fmt(item.unitPrice)}</span>
      </span>
      <input
        type="number"
        min={0}
        max={item.qty}
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.min(item.qty, +e.target.value || 0)))}
        aria-label={`Quantity to return of ${item.name}`}
      />
    </div>
  );
}
