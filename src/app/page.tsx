'use client';

import { ButtonLink } from '@/components/atoms';
import { EmptyState } from '@/components/molecules';
import { BenefitsBar, CategoryMosaic, HeroSection, HomePromos, ProductGrid, ProductRail, ProductSection } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { useStore } from '@/context/StoreContext';
import { usePageTitle } from '@/hooks';
import { api } from '@/lib/api';
import { useMemo } from 'react';

export default function HomePage() {
  usePageTitle();
  const { version } = useStore();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const { featured, fresh, best, hero, hasAny } = useMemo(() => api.products.home(), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const heroSlots = useMemo(() => api.catalog.slots('hero'), [version]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const promoSlots = useMemo(() => api.catalog.slots().filter((s) => ['product_of_week', 'collection'].includes(s.type)), [version]);

  return (
    <PageContainer>
      <HeroSection featured={hero} slots={heroSlots} />

      {hasAny ? (
        <>
          <HomePromos slots={promoSlots} />

          <ProductSection eyebrow="Browse" title="Featured categories" seeAll={{ href: '/shop', label: 'All products' }}>
            <CategoryMosaic categories={api.catalog.categories()} />
          </ProductSection>

          {featured.length > 0 && (
            <ProductSection eyebrow="Hand-picked" title="Featured this week">
              <ProductRail products={featured} />
            </ProductSection>
          )}

          {fresh.length > 0 && (
            <ProductSection eyebrow="Just landed" title="New arrivals" seeAll={{ href: '/shop?sort=newest', label: 'See all new' }}>
              <ProductGrid products={fresh} columns={4} />
            </ProductSection>
          )}

          {best.length > 0 && (
            <ProductSection eyebrow="Most loved" title="Best sellers" seeAll={{ href: '/shop?sort=popular', label: 'Shop popular' }}>
              <ProductGrid products={best} columns={4} />
            </ProductSection>
          )}
        </>
      ) : (
        <EmptyState
          icon="box"
          title="The shelves are being stocked"
          text="New products will appear here as soon as the store publishes them. Please check back soon."
          action={<ButtonLink href="/shop">Go to the shop</ButtonLink>}
        />
      )}

      <section className="section" style={{ paddingBottom: 20 }}>
        <BenefitsBar />
      </section>
    </PageContainer>
  );
}
