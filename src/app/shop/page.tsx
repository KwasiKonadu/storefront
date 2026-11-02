'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';
import { EmptyState, PageHeading, Pager } from '@/components/molecules';
import { ActiveFilters, MobileFilters, ProductGrid, ProductGridSkeleton, ShopFilters, ShopToolbar } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { useUI } from '@/context/UIContext';
import { usePageTitle, useProductList, useShopQuery } from '@/hooks';
import { api } from '@/lib/api';
import { plural } from '@/lib/format';

export default function ShopPage() {
  const router = useRouter();
  const { openModal } = useUI();
  const { query, href } = useShopQuery();
  const list = useProductList({ ...query, page: +query.page || 1, perPage: 9 });

  const category = query.category ? api.catalog.category(query.category) : undefined;
  const title = query.q ? `Results for “${query.q}”` : category ? category.name : 'Shop all';
  const sub = category
    ? category.description
    : query.q
      ? 'Products matching your search across the whole catalogue.'
      : 'Every piece in the store, filterable and sortable.';
  usePageTitle(title);

  const { result } = list;
  const countLabel = result ? `${plural(result.total, 'product')}${result.pages > 1 ? ` · page ${result.page} of ${result.pages}` : ''}` : 'Loading…';

  return (
    <PageContainer>
      <PageHeading title={title} sub={sub} crumbs={[{ label: 'Home', href: '/' }, { label: 'Shop' }]} />
      <div className="shop-layout">
        <ShopFilters />
        <div>
          <ShopToolbar
            countLabel={countLabel}
            sort={query.sort || 'relevance'}
            onSort={(sort) => router.push(href({ sort, page: '' }))}
            onOpenFilters={() => openModal({ title: 'Filters', content: <MobileFilters /> })}
          />
          <ActiveFilters query={query} onRemove={(key) => router.push(href({ [key]: '', page: '' }))} />
          {!result ? (
            <ProductGridSkeleton count={9} />
          ) : result.items.length ? (
            <ProductGrid products={result.items} />
          ) : (
            <EmptyState
              icon="search"
              title="Nothing matches those filters"
              text="Try removing a filter or broadening the price range."
              action={<Button variant="outline" onClick={() => router.push('/shop')}>Reset all filters</Button>}
            />
          )}
          {result && (
            <Pager
              page={result.page}
              pages={result.pages}
              onPage={(p) => {
                router.push(href({ page: String(p) }));
                window.scrollTo({ top: 0 });
              }}
            />
          )}
        </div>
      </div>
    </PageContainer>
  );
}
