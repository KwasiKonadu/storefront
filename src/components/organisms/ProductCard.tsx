'use client';

import Link from 'next/link';
import { Flag, Icon } from '@/components/atoms';
import { PriceTag, StockNote, WishButton } from '@/components/molecules';
import { useCartActions, useReveal, useWishlist } from '@/hooks';
import { api } from '@/lib/api';
import { discountPct } from '@/lib/catalog';
import type { Product } from '@/lib/types';

export function ProductCard({ product: p }: { product: Product }) {
  const { has, toggle } = useWishlist();
  const { add } = useCartActions();
  const ref = useReveal<HTMLElement>();
  const disc = discountPct(p);
  // No photo yet: show the default artwork, and the standard placeholder on hover.
  const noPhoto = p.images.every((u) => u.endsWith('/placeholder.svg'));
  const [mainSrc, altSrc] = noPhoto ? ['/placeholderbs.svg', '/placeholder.svg'] : [p.images[0], p.images[1]];
  const categoryName = api.catalog.category(p.categoryId)?.name ?? '';

  return (
    <article ref={ref} className="p-card">
      <div className="p-media">
        {p.isNew ? <Flag kind="new">New</Flag> : disc ? <Flag kind="sale">−{disc}%</Flag> : null}
        <WishButton active={has(p.id)} onToggle={() => toggle(p.id)} />
        <Link href={`/product/${p.slug}`} aria-label={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={noPhoto ? 'main swap' : 'main'} src={mainSrc} alt={p.name} loading="lazy" decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="alt" src={altSrc} alt="" loading="lazy" decoding="async" aria-hidden="true" />
        </Link>
        <div className="quick-add">
          {p.stock > 0 ? (
            <button type="button" className="qa-btn" onClick={() => add(p.id, p.variants?.[0]?.options[0]?.id ?? null, 1)}>
              <Icon name="bag" small /> Add to cart{p.variants ? ' · default' : ''}
            </button>
          ) : (
            <button type="button" className="qa-btn" disabled>Sold out</button>
          )}
        </div>
      </div>
      <div className="p-body">
        <span className="p-cat">{categoryName}</span>
        <h3 className="p-name"><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <PriceTag price={p.price} compareAt={p.compareAtPrice} discount={disc} />
        <StockNote stock={p.stock} />
      </div>
    </article>
  );
}
