import Link from 'next/link';
import { fmt } from '@/lib/format';
import type { CartLine } from '@/lib/types';
import { QuantityStepper } from './QuantityStepper';

export interface DrawerLineItemProps {
  line: CartLine;
  onNavigate: () => void;
  onQty: (direction: 1 | -1) => void;
  onRemove: () => void;
}

export function DrawerLineItem({ line, onNavigate, onQty, onRemove }: DrawerLineItemProps) {
  return (
    <div className="d-line">
      <Link href={`/product/${line.slug}`} onClick={onNavigate}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={line.image} alt={line.name} loading="lazy" />
      </Link>
      <div>
        <div className="cl-name"><Link href={`/product/${line.slug}`} onClick={onNavigate}>{line.name}</Link></div>
        {line.variantLabel && <div className="cl-var">{line.variantLabel}</div>}
        <div className="cl-unit">{fmt(line.unit)} each</div>
        <QuantityStepper
          small
          style={{ marginTop: 8 }}
          value={line.qty}
          onDecrease={() => onQty(-1)}
          onIncrease={() => onQty(1)}
          increaseDisabled={line.qty >= line.stock}
        />
      </div>
      <div className="d-right">
        <b>{fmt(line.unit * line.qty)}</b>
        <button type="button" className="d-remove" onClick={onRemove}>Remove</button>
      </div>
    </div>
  );
}
