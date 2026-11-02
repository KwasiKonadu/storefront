'use client';

import { useParams } from 'next/navigation';
import { Skeleton } from '@/components/atoms';
import { Breadcrumb } from '@/components/molecules';
import { NotFoundState, ProductGallery, ProductInfo, RelatedProducts } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { usePageTitle, useProduct } from '@/hooks';
import { api } from '@/lib/api';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const state = useProduct(slug);
  usePageTitle(state.status === 'ready' ? state.product.name : state.status === 'missing' ? 'Product not found' : undefined);

  if (state.status === 'missing')
    return (
      <PageContainer>
        <NotFoundState message="We couldn’t find that product. It may have been unpublished or retired." />
      </PageContainer>
    );

  if (state.status === 'loading')
    return (
      <PageContainer>
        <div className="pdp" style={{ paddingTop: 40 }} aria-busy="true">
          <Skeleton style={{ aspectRatio: '4/5', borderRadius: 'var(--r-l)' }} />
          <div>
            <Skeleton style={{ height: 14, width: '30%', borderRadius: 6 }} />
            <Skeleton style={{ height: 34, width: '70%', marginTop: 16, borderRadius: 8 }} />
            <Skeleton style={{ height: 90, marginTop: 24 }} />
          </div>
        </div>
      </PageContainer>
    );

  const { product } = state;
  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
          { label: product.category.name, href: `/shop?category=${product.category.slug}` },
          { label: product.name },
        ]}
      />
      {/* keyed so gallery/variant/quantity state resets when navigating between related products */}
      <div className="pdp" key={product.id}>
        <ProductGallery images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>
      <RelatedProducts products={api.products.related(product)} />
    </PageContainer>
  );
}
