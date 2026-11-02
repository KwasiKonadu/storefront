import { CFG } from './config';

export const fmt = (cents: number) =>
  new Intl.NumberFormat(CFG.locale, { style: 'currency', currency: CFG.currency }).format(cents / 100);

export const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString(CFG.locale, { month: 'short', day: 'numeric', year: 'numeric' });

export const fmtDateTime = (ts: number) =>
  new Date(ts).toLocaleString(CFG.locale, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

export function timeAgo(ts: number) {
  const m = Math.round((Date.now() - ts) / 6e4);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return d < 7 ? `${d}d ago` : fmtDate(ts);
}

export const uid = (prefix = 'id_') => prefix + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
export const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
export const cx = (...parts: (string | false | null | undefined)[]) => parts.filter(Boolean).join(' ');
export const plural = (n: number, one: string, many = one + 's') => `${n} ${n === 1 ? one : many}`;
