'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ButtonLink, Icon } from '@/components/atoms';
import { useReveal } from '@/hooks';
import { PriceTag } from '@/components/molecules';
import { api } from '@/lib/api';
import { discountPct } from '@/lib/catalog';
import { CATALOG } from '@/lib/catalogStore';
import { fmt } from '@/lib/format';
import { slotHref } from '@/lib/slots';
import type { Product, PromoSlot } from '@/lib/types';
import { Carousel, RailCarousel } from './Carousel';
import { ProductSection } from './ProductSection';

const seeAllFor = (s: PromoSlot) => {
  const href = slotHref(s.link);
  return href ? { href, label: s.buttonLabel || 'See all' } : undefined;
};

const DAY = 86_400_000;

/** "End of week sale" when the discount ends within a week, else plain "On sale". */
function saleTag(p: Product): string {
  return p.saleEnds && new Date(p.saleEnds).getTime() - Date.now() <= 7 * DAY ? 'End of week sale' : 'On sale';
}

/** One feature card: a stage for the product photo (with a thumbnail strip) beside its story. */
function FeatureSlide({ product: p, blurb, tag, tone, autoPhotos }: { product: Product; blurb?: string; tag: string; tone: 'pick' | 'sale'; autoPhotos: boolean }) {
  const stageRef = useReveal<HTMLDivElement>();
  const bodyRef = useReveal<HTMLDivElement>(140);
  const [shown, setShown] = useState(0);
  const category = CATALOG.categories.find((c) => c.id === p.categoryId);
  const pct = discountPct(p);
  const saving = p.compareAtPrice ? p.compareAtPrice - p.price : 0;
  const photos = p.images.filter((u) => !u.endsWith('/placeholder.svg'));
  const facts = p.details.slice(0, 3);
  const count = Math.min(photos.length, 4);
  const [paused, setPaused] = useState(false);
  // On its own the card cycles through the product's photos; hovering pauses it. Inside the rotating
  // carousel the slides move instead, so photos only change when you pick a thumbnail.
  useEffect(() => {
    if (!autoPhotos || count < 2 || paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setShown((n) => (n + 1) % count), 3500);
    return () => clearInterval(t);
  }, [autoPhotos, count, paused, shown]);
  const text = blurb || p.description;
  const href = `/product/${p.slug}`;
  const ends = p.saleEnds ? new Date(p.saleEnds).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' }) : '';
  return (
    <div className={`potw ${tone}`}>
      <div ref={stageRef} className="potw-stage potw-from-left" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        <Link href={href} className="potw-photo" aria-label={p.name}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={shown} src={photos[shown] ?? p.images[0]} alt={p.name} />
        </Link>
        <span className="potw-seal" aria-hidden>
          <span>{tag}</span>
        </span>
        {pct > 0 && <span className="potw-off">-{pct}%</span>}
        {photos.length > 1 && (
          <div className="potw-thumbs">
            {photos.slice(0, 4).map((u, i) => (
              <button key={u} type="button" className={i === shown ? 'on' : ''} aria-label={`Photo ${i + 1}`} onClick={() => setShown(i)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div ref={bodyRef} className="potw-body potw-from-right">
        <span className="potw-chip">
          ★ {tone === 'sale' ? tag : category?.name ?? 'This week'}
        </span>
        <h3>{p.name}</h3>
        {text && <p className="lead">{text}</p>}
        {tone === 'pick' && facts.length > 0 && (
          <ul className="potw-facts">
            {facts.map(([k, v]) => (
              <li key={k}>
                <span>{k}</span>
                <b>{v}</b>
              </li>
            ))}
          </ul>
        )}
        <div className="potw-buy">
          <PriceTag size="pdp" price={p.price} compareAt={p.compareAtPrice} discount={pct} />
          {saving > 0 && <span className="potw-save">You save {fmt(saving)}</span>}
          {ends && <span className="potw-ends">Ends {ends}</span>}
        </div>
        <p className={p.stock > 0 && p.stock <= 10 ? 'potw-stock low' : 'potw-stock'}>
          <i aria-hidden /> {p.stock <= 0 ? 'Out of stock' : p.stock <= 10 ? `Only ${p.stock} left` : 'In stock'}
        </p>
        <div className="potw-ctas">
          <ButtonLink size="lg" href={href}>
            View product <Icon name="arrR" small />
          </ButtonLink>
          {category && (
            <ButtonLink variant="outline" size="lg" href={`/shop?category=${category.slug}`}>
              More {category.name}
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}

/** The pick of the week first, then the discounts ending soonest, rotating like stories. */
function ProductOfWeek({ slot, product: p }: { slot: PromoSlot; product: Product }) {
  const sales = CATALOG.products
    .filter((x) => x.published && x.compareAtPrice && x.id !== p.id)
    .sort((a, b) => (a.saleEnds ?? '9').localeCompare(b.saleEnds ?? '9'))
    .slice(0, 5);
  if (!sales.length) return <FeatureSlide product={p} blurb={slot.subtitle} tag="Pick of the week" tone="pick" autoPhotos />;
  return (
    <Carousel
      label="Featured products"
      slides={[
        { ms: 8000, node: <FeatureSlide product={p} blurb={slot.subtitle} tag="Pick of the week" tone="pick" autoPhotos={false} /> },
        ...sales.map((x) => ({ ms: 6000, node: <FeatureSlide key={x.id} product={x} tag={saleTag(x)} tone="sale" autoPhotos={false} /> })),
      ]}
    />
  );
}

/** Product of the week, hand-picked collections, in the order staff arranged them. */
export function HomePromos({ slots }: { slots: PromoSlot[] }) {
  return (
    <>
      {slots.map((s) => {
        if (s.type === 'product_of_week') {
          const p = api.catalog.slotProducts(s)[0];
          if (!p) return null;
          return (
            <ProductSection key={s.id} eyebrow="Product of the week" title={s.title}>
              <ProductOfWeek slot={s} product={p} />
            </ProductSection>
          );
        }
        if (s.type === 'collection') {
          const products = api.catalog.slotProducts(s);
          if (!products.length) return null;
          return (
            <ProductSection key={s.id} eyebrow={s.subtitle || 'Hand-picked'} title={s.title} seeAll={seeAllFor(s)}>
              <RailCarousel products={products} />
            </ProductSection>
          );
        }
        return null;
      })}
    </>
  );
}
