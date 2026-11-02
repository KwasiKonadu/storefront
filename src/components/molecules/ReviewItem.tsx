import { fmt } from '@/lib/format';

export interface ReviewItemProps {
  image: string;
  name: string;
  variantLabel?: string | null;
  qty: number;
  unit: number;
  total: number;
  /** compact sidebar layout (name + "Qty n · variant" + total) */
  compact?: boolean;
}

/** One product row used in checkout review, order confirmation and the checkout sidebar. */
export function ReviewItem({ image, name, variantLabel, qty, unit, total, compact }: ReviewItemProps) {
  if (compact) {
    return (
      <div className="rev-item">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image || '/placeholder.svg'} alt="" />
        <span style={{ flex: 1 }}>
          <b style={{ fontSize: 13.5 }}>{name}</b>
          <br />
          <span className="q">
            Qty {qty}
            {variantLabel ? ` · ${variantLabel}` : ''}
          </span>
        </span>
        <span className="p" style={{ fontSize: 13.5 }}>{fmt(total)}</span>
      </div>
    );
  }
  return (
    <div className="rev-item">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image || '/placeholder.svg'} alt="" />
      <span>
        <b>{name}</b>
        {variantLabel && (
          <>
            <br />
            <span className="q">{variantLabel}</span>
          </>
        )}
      </span>
      <span className="q">{qty} × {fmt(unit)}</span>
      <span className="p">{fmt(total)}</span>
    </div>
  );
}
