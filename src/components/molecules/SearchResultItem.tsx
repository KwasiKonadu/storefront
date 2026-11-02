import Link from 'next/link';
import { fmt } from '@/lib/format';
import type { Product } from '@/lib/types';

export function SearchResultItem({ product, categoryName, onNavigate }: { product: Product; categoryName: string; onNavigate: () => void }) {
  return (
    <Link className="sr-item" href={`/product/${product.slug}`} onClick={onNavigate}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={product.images[0]} alt="" />
      <span>
        <b>{product.name}</b>
        <span>{categoryName}</span>
      </span>
      <span className="price">{fmt(product.price)}</span>
    </Link>
  );
}
