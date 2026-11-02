'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button, Checkbox, Icon, Input } from '@/components/atoms';
import { FilterGroup } from '@/components/molecules';
import { useDebouncedCallback, useShopQuery } from '@/hooks';
import { api } from '@/lib/api';
import { cx } from '@/lib/format';

/** Sidebar filters (category, price, availability). Everything is driven by the URL. */
export function ShopFilters() {
  const router = useRouter();
  const { query, href } = useShopQuery();
  const [min, setMin] = useState(query.min ?? '');
  const [max, setMax] = useState(query.max ?? '');
  const categories = api.catalog.categories();

  // keep the price inputs in sync when the URL changes (reset, chip removal…)
  useEffect(() => {
    setMin(query.min ?? '');
    setMax(query.max ?? '');
  }, [query.min, query.max]);

  const applyPrice = useDebouncedCallback((lo: string, hi: string) => router.push(href({ min: lo, max: hi, page: '' })), 500);

  return (
    <aside className="filters" aria-label="Filters">
      <FilterGroup title="Category">
        <div className="f-list">
          <Link href={href({ category: '', page: '' })} className={cx(!query.category && 'on')}>All products</Link>
          {categories.map((c) => (
            <Link key={c.id} href={href({ category: c.slug, page: '' })} className={cx(query.category === c.slug && 'on')}>
              {c.name}
              <span>{api.catalog.categoryCount(c.id)}</span>
            </Link>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <div className="price-row">
          <Input type="number" min={0} placeholder="Min" aria-label="Minimum price" value={min} onChange={(e) => { setMin(e.target.value); applyPrice(e.target.value, max); }} />
          <span style={{ color: 'var(--faint)' }}>–</span>
          <Input type="number" min={0} placeholder="Max" aria-label="Maximum price" value={max} onChange={(e) => { setMax(e.target.value); applyPrice(min, e.target.value); }} />
        </div>
      </FilterGroup>
      <FilterGroup title="Availability">
        <Checkbox labelClassName="f-check" checked={!!query.inStock} onChange={(e) => router.push(href({ inStock: e.target.checked ? '1' : '', page: '' }))}>
          In stock only
        </Checkbox>
        <Checkbox labelClassName="f-check" checked={!!query.sale} onChange={(e) => router.push(href({ sale: e.target.checked ? '1' : '', page: '' }))}>
          On sale
        </Checkbox>
      </FilterGroup>
      <FilterGroup>
        <Button variant="outline" size="sm" onClick={() => router.push('/shop')}>
          <Icon name="refresh" small /> Reset filters
        </Button>
      </FilterGroup>
    </aside>
  );
}
