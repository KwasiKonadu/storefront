import { fmt } from '@/lib/format';
import type { OrderItem } from '@/lib/types';

export function OrderItemLine({ item }: { item: OrderItem }) {
  return (
    <div className="oi-line">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image || '/placeholder.svg'} alt="" loading="lazy" />
      <div>
        <b>{item.name}</b>
        <span className="var">
          {item.variantLabel ? `${item.variantLabel} · ` : ''}
          {item.sku} · {item.qty} × {fmt(item.unitPrice)}
        </span>
      </div>
      <div className="p"><b>{fmt(item.lineTotal)}</b></div>
    </div>
  );
}
