import { CFG } from '@/lib/config';
import { fmt } from '@/lib/format';

export function ShipProgress({ subtotal, variant }: { subtotal: number; variant: 'drawer' | 'summary' }) {
  const th = CFG.freeDeliveryThreshold;
  if (th == null) return null; // free delivery isn't promised
  const remain = th - subtotal;
  const pct = Math.min(100, Math.round((subtotal / th) * 100));
  const unlocked = remain <= 0;
  return (
    <div className="ship-progress">
      {variant === 'drawer' ? (
        unlocked ? <b>This order qualifies for free delivery</b> : <>You&apos;re <b>{fmt(remain)}</b> away from free delivery</>
      ) : unlocked ? (
        <b>Free delivery unlocked</b>
      ) : (
        <>Add <b>{fmt(remain)}</b> more for free delivery</>
      )}
      <div className="bar">
        <i style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
