'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Icon, IconButton } from '@/components/atoms';
import { SearchResultItem } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import { useDebouncedCallback } from '@/hooks';
import { api } from '@/lib/api';
import type { Product } from '@/lib/types';

const HINT = <p className="sr-empty">Start typing — results appear here.</p>;

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  if (!searchOpen) return null;
  return <SearchPanel onClose={closeSearch} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const input = useRef<HTMLInputElement>(null);
  const [term, setTerm] = useState('');
  const [results, setResults] = useState<Product[] | null>(null);

  useEffect(() => input.current?.focus(), []);

  const run = useDebouncedCallback(async (q: string) => {
    if (!q) return setResults(null);
    setResults((await api.products.list({ q, perPage: 5 })).items);
  }, 160);

  const viewAll = () => {
    if (!term.trim()) return;
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div className="overlay-full" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
        <div className="search-bar">
          <Icon name="search" />
          <input
            ref={input}
            type="search"
            placeholder="Search products, descriptions, SKUs…"
            autoComplete="off"
            aria-label="Search"
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              run(e.target.value.trim());
            }}
            onKeyDown={(e) => e.key === 'Enter' && viewAll()}
          />
          <IconButton aria-label="Close search" onClick={onClose}>
            <Icon name="x" />
          </IconButton>
        </div>
        <div className="search-results" aria-live="polite">
          {results === null ? (
            HINT
          ) : results.length ? (
            results.map((p) => (
              <SearchResultItem key={p.id} product={p} categoryName={api.catalog.category(p.categoryId)?.name ?? ''} onNavigate={onClose} />
            ))
          ) : (
            <p className="sr-empty">No products match — try a different word.</p>
          )}
        </div>
        <div className="sr-foot">
          <Link
            className="link"
            href={`/shop?q=${encodeURIComponent(term.trim())}`}
            onClick={(e) => {
              e.preventDefault();
              viewAll();
            }}
          >
            View all results
          </Link>
        </div>
      </div>
    </div>
  );
}
