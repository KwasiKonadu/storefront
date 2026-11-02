import { InfoCell } from '@/components/molecules';
import { CFG, areaById } from '@/lib/config';
import type { Order } from '@/lib/types';

export function OrderInfoGrid({ order: o }: { order: Order }) {
  const pay = CFG.paymentMethods.find((m) => m.id === o.paymentMethod);
  const area = areaById(o.areaId);
  return (
    <div className="info-grid" style={{ marginBottom: 22 }}>
      <InfoCell title={o.fulfilment === 'pickup' ? 'Pickup' : 'Delivery address'}>
        {o.fulfilment === 'pickup' || !o.address ? (
          <>
            <b>{CFG.pickup.address}</b>
            <br />
            {CFG.pickup.hours}
            <br />
            <span style={{ color: 'var(--muted)' }}>{CFG.pickup.note}</span>
          </>
        ) : (
          <>
            <b>{o.address.label} · {o.address.name}</b>
            <br />
            {o.address.line1}{o.address.line2 ? `, ${o.address.line2}` : ''}
            <br />
            {o.address.city} {o.address.postal}
            <br />
            {o.address.phone}
            <br />
            <span style={{ color: 'var(--muted)' }}>{area?.name} · {area?.eta}</span>
          </>
        )}
      </InfoCell>
      <InfoCell title="Payment & instructions">
        <b>{pay?.label ?? o.paymentMethod}</b> — {pay?.note}
        <br />
        <span style={{ color: 'var(--muted)' }}>Status: {o.paymentStatus === 'paid' ? 'Paid' : 'Pending'} (kept separate from order status)</span>
        {o.instructions && (
          <>
            <br />
            <span style={{ color: 'var(--muted)' }}>“{o.instructions}”</span>
          </>
        )}
      </InfoCell>
    </div>
  );
}
