'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Icon } from '@/components/atoms';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export interface CarouselSlide {
  node: ReactNode;
  /** How long this slide stays up, in ms. */
  ms?: number;
}

/**
 * Rotating slides, story-style: a progress bar per slide, arrows, swipe, and it pauses while the pointer
 * or focus is inside. All slides share one grid cell, so the carousel never changes height as it turns.
 */
export function Carousel({ slides, label }: { slides: CarouselSlide[]; label: string }) {
  const n = slides.length;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const startX = useRef<number | null>(null);
  useEffect(() => setStill(reduced()), []);

  const go = (k: number) => setI(((k % n) + n) % n);
  const cur = Math.min(i, n - 1);

  return (
    <div
      className={`carousel${paused ? ' paused' : ''}`}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onPointerDown={(e) => {
        startX.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (startX.current == null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > 50) go(cur + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="car-stack">
        {slides.map((s, k) => (
          <div key={k} className={`car-slide${k === cur ? ' on' : ''}`} aria-hidden={k !== cur} inert={k !== cur}>
            {s.node}
          </div>
        ))}
      </div>
      {n > 1 && (
        <div className="car-nav">
          <button type="button" className="car-arrow" aria-label="Previous" onClick={() => go(cur - 1)}>
            <Icon name="chevR" small />
          </button>
          <div className="car-bars">
            {slides.map((s, k) => (
              <button key={k} type="button" aria-label={`Slide ${k + 1}`} className={k < cur || (k === cur && still) ? 'done' : k === cur ? 'on' : ''} onClick={() => go(k)}>
                {k === cur && !still && <i key={cur} style={{ animationDuration: `${s.ms ?? 6000}ms` }} onAnimationEnd={() => go(cur + 1)} />}
              </button>
            ))}
          </div>
          <button type="button" className="car-arrow" aria-label="Next" onClick={() => go(cur + 1)}>
            <Icon name="chevR" small />
          </button>
        </div>
      )}
    </div>
  );
}

/** A row of product cards that moves along by itself, one card at a time, and loops. Pauses on hover. */
export function RailCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [overflow, setOverflow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setOverflow(el.scrollWidth > el.clientWidth + 4);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [products.length]);

  const step = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = (card?.offsetWidth ?? 280) + 20;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: 'smooth' });
    else if (dir === -1 && el.scrollLeft <= 4) el.scrollTo({ left: el.scrollWidth, behavior: 'smooth' });
    else el.scrollBy({ left: dir * w, behavior: 'smooth' });
  };

  useEffect(() => {
    if (!overflow || paused || reduced()) return;
    const t = setInterval(() => step(1), 4500);
    return () => clearInterval(t);
  }, [overflow, paused]);

  return (
    <div className="rail-car" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div ref={ref} className="hscroll">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {overflow && (
        <>
          <button type="button" className="rail-arrow prev" aria-label="Previous" onClick={() => step(-1)}>
            <Icon name="chevR" small />
          </button>
          <button type="button" className="rail-arrow next" aria-label="Next" onClick={() => step(1)}>
            <Icon name="chevR" small />
          </button>
        </>
      )}
    </div>
  );
}
