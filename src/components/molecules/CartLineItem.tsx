import Link from 'next/link';
import { Icon } from '@/components/atoms';
import { fmt } from '@/lib/format';
import type { CartLine } from '@/lib/types';
import { QuantityStepper } from './QuantityStepper';

export interface CartLineItemProps {
  line: CartLine;
  onQty: (direction: 1 | -1) => void;
  onRemove: () => void;
}

export function CartLineItem({ line, onQty, onRemove }: CartLineItemProps) {
  return (
    <div className="cart-line">
      <Link href={`/product/${line.slug}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={line.image} alt={line.name} loading="lazy" />
      </Link>
      <div>
        <div className="cl-name"><Link href={`/product/${line.slug}`}>{line.name}</Link></div>
        {line.variantLabel && <div className="cl-var">{line.variantLabel}</div>}
        <div className="cl-unit">{fmt(line.unit)} each · {line.sku}</div>
        <QuantityStepper
          small
          style={{ marginTop: 10 }}
          value={line.qty}
          onDecrease={() => onQty(-1)}
          onIncrease={() => onQty(1)}
          increaseDisabled={line.qty >= line.stock}
        />
        {line.qty >= line.stock && <div className="cl-var" style={{ color: 'var(--clay)' }}>Maximum available stock</div>}
      </div>
      <div className="cl-right">
        <b className="cl-total">{fmt(line.unit * line.qty)}</b>
        <button type="button" className="cl-remove" onClick={onRemove}>
          <Icon name="trash" small /> Remove
        </button>
      </div>
    </div>
  );
}
