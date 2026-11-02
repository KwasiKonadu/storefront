'use client';

import { Chip } from '@/components/molecules';
import { api } from '@/lib/api';
import type { ShopQuery } from '@/hooks/useShopQuery';

/** Removable chips for each filter currently applied. */
export function ActiveFilters({ query, onRemove }: { query: ShopQuery; onRemove: (key: string) => void }) {
  const category = query.category ? api.catalog.category(query.category) : undefined;
  const chips: [key: string, label: string, remove: string][] = [];
  if (category) chips.push(['category', category.name, 'Remove category filter']);
  if (query.q) chips.push(['q', `“${query.q}”`, 'Remove search']);
  if (query.inStock) chips.push(['inStock', 'In stock', 'Remove filter']);
  if (query.sale) chips.push(['sale', 'On sale', 'Remove filter']);
  if (!chips.length) return null;
  return (
    <div className="chips">
      {chips.map(([key, label, remove]) => (
        <Chip key={key} onRemove={() => onRemove(key)} removeLabel={remove}>{label}</Chip>
      ))}
    </div>
  );
}
