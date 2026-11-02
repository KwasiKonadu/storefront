import { Skeleton } from '@/components/atoms';
import { cx } from '@/lib/format';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products, columns = 3, style }: { products: Product[]; columns?: 3 | 4; style?: React.CSSProperties }) {
  return (
    <div className={cx('grid-p', columns === 4 && 'grid-4')} style={style}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid-p">
      {Array.from({ length: count }, (_, i) => (
        <div key={i}>
          <Skeleton style={{ aspectRatio: '4/5' }} />
          <Skeleton style={{ height: 13, width: '55%', marginTop: 14, borderRadius: 6 }} />
          <Skeleton style={{ height: 13, width: '80%', marginTop: 8, borderRadius: 6 }} />
        </div>
      ))}
    </div>
  );
}

/** Horizontally scrolling row of cards. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <div className="hscroll">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
