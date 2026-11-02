import { SectionHead } from '@/components/molecules';
import type { Product } from '@/lib/types';
import { ProductGrid } from './ProductGrid';

export function RelatedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="section">
      <SectionHead eyebrow="Goes well with" title="Related pieces" />
      <ProductGrid products={products} columns={4} />
    </section>
  );
}
