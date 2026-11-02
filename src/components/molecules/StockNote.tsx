import { stockInfo } from '@/lib/catalog';

export function StockNote({ stock }: { stock: number }) {
  const st = stockInfo({ stock });
  if (st.level === 'in') return null;
  return <span className={`stock-note ${st.level}`}>{st.label}</span>;
}
