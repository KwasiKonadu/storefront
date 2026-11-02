import { fmt } from '@/lib/format';

export interface PriceTagProps {
  price: number;
  compareAt?: number | null;
  discount?: number;
  /** `card` = compact grid price, `pdp` = large product-page price */
  size?: 'card' | 'pdp';
}

export function PriceTag({ price, compareAt, discount = 0, size = 'card' }: PriceTagProps) {
  return (
    <div className={size === 'pdp' ? 'pdp-price' : 'p-price'}>
      <b>{fmt(price)}</b>
      {compareAt ? (
        <>
          <s>{fmt(compareAt)}</s>
          <span className="save">Save {discount}%</span>
        </>
      ) : null}
    </div>
  );
}
