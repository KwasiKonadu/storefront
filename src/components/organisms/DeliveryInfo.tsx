import { CFG, deliverableAreas } from '@/lib/config';
import { fmt } from '@/lib/format';

export function DeliveryInfo() {
  return (
    <div className="prose" style={{ paddingBottom: 60 }}>
      <h2>Delivery areas &amp; fees</h2>
      {deliverableAreas().length === 0 ? <p>Delivery areas and fees will be listed here soon.</p> : (
      <table className="area-table">
        <thead>
          <tr><th>Area</th><th>Fee</th><th>Estimated time</th></tr>
        </thead>
        <tbody>
          {deliverableAreas().map((a) => (
            <tr key={a.id}>
              <td><b>{a.name}</b></td>
              <td>{fmt(a.fee as number)}</td>
              <td>{a.eta}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
      <p style={{ marginTop: 16 }}>
        {CFG.freeDeliveryThreshold != null && <>Orders of <b>{fmt(CFG.freeDeliveryThreshold)} or more</b> ship free to every listed area. </>}
        The fee for your address is always shown at checkout before you confirm — if your area isn’t listed, checkout tells you before any order is placed.
      </p>
      <h2>Pickup</h2>
      <p>
        {CFG.pickup.enabled ? (
          <>Collect from <b>{CFG.pickup.address}</b> during <b>{CFG.pickup.hours}</b>. Pickup is free — no delivery fee is charged. {CFG.pickup.note}</>
        ) : (
          'Pickup is not available at the moment.'
        )}
      </p>
      <h2>Processing</h2>
      <p>Orders are confirmed by the store before dispatch. You can follow every step — pending confirmation, confirmed, processing, out for delivery or ready for pickup, completed — on the order page in My Orders.</p>
    </div>
  );
}
