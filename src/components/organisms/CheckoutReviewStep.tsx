'use client';

import { Button, Icon, Spinner } from '@/components/atoms';
import { AddressOption, ReviewItem } from '@/components/molecules';
import { CFG } from '@/lib/config';
import { fmt } from '@/lib/format';
import { selectedArea, type CheckoutState } from '@/lib/checkout';
import type { Address, CartView } from '@/lib/types';

export interface CheckoutReviewStepProps {
  state: CheckoutState;
  saved: Address[];
  cart: CartView;
  total: number;
  patch: (p: Partial<CheckoutState>) => void;
  onEdit: (step: 1 | 2) => void;
  onBack: () => void;
  onPlace: () => void;
}

export function CheckoutReviewStep({ state: co, saved, cart, total, patch, onEdit, onBack, onPlace }: CheckoutReviewStepProps) {
  const savedAddr = co.addressId !== 'new' ? saved.find((a) => a.id === co.addressId) : undefined;
  const addressLine = savedAddr
    ? `${savedAddr.label}: ${savedAddr.line1}${savedAddr.line2 ? `, ${savedAddr.line2}` : ''}, ${savedAddr.city} ${savedAddr.postal}`
    : `${co.newAddr.line1}${co.newAddr.line2 ? `, ${co.newAddr.line2}` : ''}, ${co.newAddr.city} ${co.newAddr.postal}`;

  return (
    <div className="co-panel">
      <h2>Review &amp; place order</h2>

      <div className="review-block">
        <h4>Contact</h4>
        <p>
          {co.contact.name} · {co.contact.email} · {co.contact.phone}
          <button type="button" className="link edit" onClick={() => onEdit(1)} style={{ marginLeft: 8 }}>Edit</button>
        </p>
      </div>

      <div className="review-block">
        <h4>{co.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'}</h4>
        <p>
          {co.fulfilment === 'delivery' ? `${addressLine} — ${selectedArea(co, saved)?.name ?? ''}` : CFG.pickup.address}
          {co.instructions && (
            <>
              <br />
              <span style={{ color: 'var(--muted)' }}>“{co.instructions}”</span>
            </>
          )}
          <button type="button" className="link edit" onClick={() => onEdit(2)} style={{ marginLeft: 8 }}>Edit</button>
        </p>
      </div>

      <div className="review-block">
        <h4>Payment</h4>
        {CFG.paymentMethods.map((m) => (
          <AddressOption
            key={m.id}
            name="pay"
            selected={co.payment === m.id}
            onSelect={() => patch({ payment: m.id })}
            style={{ marginBottom: 8 }}
          >
            <b>{m.label}</b>
            <span>{m.note}</span>
          </AddressOption>
        ))}
        <p className="form-note" style={{ marginTop: 6 }}>
          Payment status is kept separate from order status and marked <b>pending</b> until actually received. Nothing is charged online.
        </p>
      </div>

      <div className="review-block">
        <h4>Items ({cart.count})</h4>
        {cart.items.map((it) => (
          <ReviewItem key={`${it.productId}:${it.variantId}`} image={it.image} name={it.name} variantLabel={it.variantLabel} qty={it.qty} unit={it.unit} total={it.unit * it.qty} />
        ))}
      </div>

      <div className="co-actions">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button size="lg" onClick={onPlace} disabled={co.placing}>
          {co.placing ? <><Spinner />Placing order…</> : <>Place order · {fmt(total)}</>}
        </Button>
      </div>
    </div>
  );
}
