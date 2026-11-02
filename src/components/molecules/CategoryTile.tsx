'use client';

import Link from 'next/link';
import { useReveal } from '@/hooks';
import { Icon } from '@/components/atoms';
import { CATALOG } from '@/lib/catalogStore';
import type { Category } from '@/lib/types';

/** No uploaded picture: a collage of the category's own product photos with its icon in the middle. */
function Collage({ category }: { category: Category }) {
  const inCategory = CATALOG.products.filter((p) => p.published && p.categoryId === category.id);
  // Every product's main photo first, then their secondary photos, so a small category still fills the collage.
  const pool: string[] = [];
  for (let round = 0; round < 4; round++) for (const p of inCategory) if (p.images[round]) pool.push(p.images[round]);
  const photos = [...new Set(pool)].filter((u) => !u.endsWith('/placeholder.svg')).slice(0, 4);
  return (
    <span className={`ct-collage n${photos.length}`} aria-hidden>
      <span className="ct-photos">
        {photos.map((u, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={u} alt="" loading="lazy" />
        ))}
      </span>
      <span className="ct-icon">{category.icon || '🛍️'}</span>
    </span>
  );
}

export function CategoryTile({ category, count }: { category: Category; count: number }) {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <Link ref={ref} className="cat-tile" href={`/shop?category=${category.slug}`}>
      {category.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={category.image} alt={category.name} loading="lazy" />
      ) : (
        <Collage category={category} />
      )}
      <span className="ct-label">
        <b>{category.name}</b>
        <span>{count} products</span>
      </span>
    </Link>
  );
}

export function AllProductsTile() {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <Link ref={ref} className="cat-tile t-all" href="/shop">
      <b>The whole store,<br />one shelf.</b>
      <span>Shop all products <Icon name="arrR" small /></span>
    </Link>
  );
}
