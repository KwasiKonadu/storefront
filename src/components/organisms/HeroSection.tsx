'use client';

import { useEffect, useRef, useState } from 'react';
import { Eyebrow, Icon } from '@/components/atoms';
import { ButtonLink } from '@/components/atoms';
import { CFG } from '@/lib/config';
import { fmt } from '@/lib/format';
import Link from 'next/link';
import { api } from '@/lib/api';
import { slotHref } from '@/lib/slots';
import type { Product, PromoSlot } from '@/lib/types';

const ROTATE_MS = 6000;

/** Homepage hero. Shows the live "Hero banner" slots from SalesPoint (rotating if several), else the built-in default. */
export function HeroSection({ featured, slots = [] }: { featured?: Product; slots?: PromoSlot[] }) {
  const [i, setI] = useState(0);
  const count = slots.length;

  useEffect(() => {
    if (count < 2) return;
    const t = setInterval(() => setI((n) => (n + 1) % count), ROTATE_MS);
    return () => clearInterval(t);
  }, [count]);

  const slot = count ? slots[i % count] : null;
  return slot ? <SlotHero slot={slot} featured={featured} index={i % count} count={count} onPick={setI} /> : <DefaultHero />;
}

/** Writes the scroll position to `--sy` on the element so CSS can move its layers at different speeds. */
function useParallax<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      el.style.setProperty('--sy', String(Math.min(window.scrollY, 600)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [active]);
  return ref;
}

function SlotHero({ slot, featured, index, count, onPick }: { slot: PromoSlot; featured?: Product; index: number; count: number; onPick: (n: number) => void }) {
  const href = slotHref(slot.link);
  // Picture: the slot's own image, else the featured product's photo, else none.
  const picture = slot.imageUrl || featured?.images[0] || '';
  // Up to two products shown with the poster: a small picture, then a floating card.
  const [side, card] = api.catalog.slotProducts(slot);
  const visualRef = useParallax<HTMLDivElement>(!!picture);
  return (
    <section className="hero" style={picture ? undefined : { gridTemplateColumns: '1fr' }}>
      <div>
        <Eyebrow>{CFG.storeName}</Eyebrow>
        <h1>{slot.title}</h1>
        {slot.subtitle && <p className="lead">{slot.subtitle}</p>}
        <div className="hero-ctas">
          {href && slot.buttonLabel && (
            <ButtonLink size="lg" href={href}>
              {slot.buttonLabel} <Icon name="arrR" small />
            </ButtonLink>
          )}
          <ButtonLink variant="outline" size="lg" href="/shop">
            Shop all
          </ButtonLink>
        </div>
        <div className="hero-meta">
          {CFG.freeDeliveryThreshold != null && <span><Icon name="truck" small /> Free delivery over {fmt(CFG.freeDeliveryThreshold)}</span>}
          {CFG.returnDays != null && <span><Icon name="refresh" small /> {CFG.returnDays}-day returns</span>}
        </div>
        {count > 1 && (
          <div className="hero-dots" role="tablist" aria-label="Banners">
            {Array.from({ length: count }, (_, n) => (
              <button key={n} type="button" role="tab" aria-selected={n === index} aria-label={`Banner ${n + 1}`} className={n === index ? 'on' : ''} onClick={() => onPick(n)} />
            ))}
          </div>
        )}
      </div>
      {picture && (
        <div ref={visualRef} className="hero-visual poster">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hv-main" src={picture} alt={slot.title} fetchPriority="high" />
          {side && (
            <Link href={`/product/${side.slug}`} aria-label={side.name}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="hv-side" src={side.images[0]} alt={side.name} />
            </Link>
          )}
          {card && (
            <div className="hv-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={card.images[0]} alt="" />
              <div>
                <b>{card.name}</b>
                <span>{fmt(card.price)}</span>
                <br />
                <Link className="go" href={`/product/${card.slug}`}>View <Icon name="arrR" small /></Link>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** Shown when no hero banner is live: just the store name and a way into the shop. */
function DefaultHero() {
  return (
    <section className="hero" style={{ gridTemplateColumns: '1fr' }}>
      <div>
        <h1>{CFG.storeName}</h1>
        <div className="hero-ctas">
          <ButtonLink size="lg" href="/shop">
            Shop all <Icon name="arrR" small />
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
