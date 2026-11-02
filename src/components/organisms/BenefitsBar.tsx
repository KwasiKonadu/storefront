import { BenefitItem } from '@/components/molecules';
import { CFG, lowestDeliveryFee } from '@/lib/config';
import { fmt } from '@/lib/format';

export function BenefitsBar() {
  return (
    <div className="benefits">
      {lowestDeliveryFee() != null && (
        <BenefitItem icon="truck" title="Delivery">
          Delivery from {fmt(lowestDeliveryFee() as number)}
          {CFG.freeDeliveryThreshold != null && <> or free over {fmt(CFG.freeDeliveryThreshold)}</>}.
        </BenefitItem>
      )}
      {CFG.pickup.enabled && (
        <BenefitItem icon="store" title="Collect in store">
          Order online and pick it up from our shop{CFG.pickup.address ? <> at {CFG.pickup.address}</> : null}. No delivery fee.
        </BenefitItem>
      )}
      {CFG.returnDays != null && (
        <BenefitItem icon="refresh" title={`Easy ${CFG.returnDays}-day returns`}>Changed your mind? Request a return right from your order.</BenefitItem>
      )}
      <BenefitItem icon="box" title="One-tap reorder">Every past order can refill your cart with current prices and stock.</BenefitItem>
      <BenefitItem icon="shield" title="Reliable & verified">Prices, stock and totals are re-checked on every order.</BenefitItem>
    </div>
  );
}
