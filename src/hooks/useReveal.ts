'use client';

import { useLayoutEffect, useRef } from 'react';

/**
 * Fades/slides an element in the first time it scrolls into view.
 * Add the returned ref to an element whose `className` is static; the reveal classes are removed afterwards
 * so the element's own hover transitions are untouched.
 */
export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    el.classList.add('reveal');
    if (delay) el.style.setProperty('--reveal-delay', `${delay}ms`);
    let cleanup: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add('in');
        io.disconnect();
        cleanup = setTimeout(() => {
          el.classList.remove('reveal', 'in');
          el.style.removeProperty('--reveal-delay');
        }, 1000 + delay);
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(cleanup);
    };
  }, [delay]);
  return ref;
}
