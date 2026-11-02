'use client';

import { Button, Icon } from '@/components/atoms';

const SORTS: [string, string][] = [
  ['relevance', 'Relevance'],
  ['newest', 'Newest'],
  ['popular', 'Popularity'],
  ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'],
];

export interface ShopToolbarProps {
  countLabel: string;
  sort: string;
  onSort: (sort: string) => void;
  onOpenFilters: () => void;
}

export function ShopToolbar({ countLabel, sort, onSort, onOpenFilters }: ShopToolbarProps) {
  return (
    <div className="shop-toolbar">
      <span className="result-count">{countLabel}</span>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <Button variant="outline" size="sm" className="fab-filters" onClick={onOpenFilters}>
          <Icon name="filter" small /> Filters
        </Button>
        <label className="sort-wrap">
          Sort
          <select value={sort} onChange={(e) => onSort(e.target.value)} aria-label="Sort products">
            {SORTS.map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
