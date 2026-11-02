import { cx } from '@/lib/format';

export function Pager({ page, pages, onPage }: { page: number; pages: number; onPage: (page: number) => void }) {
  if (pages <= 1) return null;
  return (
    <nav className="pager" aria-label="Pagination">
      <button type="button" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page">←</button>
      {Array.from({ length: pages }, (_, i) => (
        <button key={i} type="button" className={cx(page === i + 1 && 'on')} onClick={() => onPage(i + 1)}>
          {i + 1}
        </button>
      ))}
      <button type="button" onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label="Next page">→</button>
    </nav>
  );
}
