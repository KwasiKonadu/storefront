'use client';

import { useState } from 'react';
import { Button, Checkbox, Icon, Input, Select, Textarea } from '@/components/atoms';
import { AddressOption, FormField, MethodCard } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import { CFG, areaById, canFulfil, defaultAreaId, deliverableAreas } from '@/lib/config';
import { fmt } from '@/lib/format';
import { listedFee, selectedArea, type CheckoutState } from '@/lib/checkout';
import type { Address } from '@/lib/types';
import { isPhone } from '@/lib/validation';

export interface CheckoutFulfilmentStepProps {
  state: CheckoutState;
  saved: Address[];
  /** shown next to the area note: "Free" / "$6.00" / struck-through fee */
  feeNote: React.ReactNode;
  patch: (p: Partial<CheckoutState>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function CheckoutFulfilmentStep({ state: co, saved, feeNote, patch, onBack, onNext }: CheckoutFulfilmentStepProps) {
  const { toast } = useUI();
  const [errors, setErrors] = useState<{ line1?: string; city?: string; phone?: string }>({});
  const canDeliver = deliverableAreas().length > 0;
  const fee = listedFee(co, saved);
  const area = selectedArea(co, saved);
  const setAddr = (p: Partial<CheckoutState['newAddr']>) => patch({ newAddr: { ...co.newAddr, ...p } });

  const next = () => {
    if (!canFulfil()) {
      toast('Delivery and pickup are not available yet.', { type: 'warn' });
      return;
    }
    if (co.fulfilment === 'delivery' && co.addressId === 'new') {
      const errs = {
        line1: co.newAddr.line1.trim() ? undefined : 'Required',
        city: co.newAddr.city.trim() ? undefined : 'Required',
        phone: isPhone(co.newAddr.phone) ? undefined : 'Enter a valid phone number',
      };
      setErrors(errs);
      if (Object.values(errs).some(Boolean)) return;
    }
    if (co.fulfilment === 'delivery' && fee == null) {
      toast('We don’t deliver to the selected area — choose pickup instead.', { type: 'warn' });
      return;
    }
    onNext();
  };

  return (
    <div className="co-panel">
      <h2>Fulfilment</h2>
      {!canFulfil() && (
        <div className="area-note warn">
          <span><b>Ordering isn’t available yet.</b> The store hasn’t set up delivery or pickup.</span>
        </div>
      )}
      <div className="method-cards" role="radiogroup" aria-label="Fulfilment method">
        <MethodCard disabled={!canDeliver} selected={co.fulfilment === 'delivery'} onSelect={() => patch({ fulfilment: 'delivery' })}>
          <b><Icon name="truck" /> Delivery</b>
          <span>
            {canDeliver
              ? `To your door${deliverableAreas().some((a) => a.eta) ? `, ${deliverableAreas().map((a) => a.eta).filter(Boolean).join(' / ')}` : ''}.`
              : 'Coming soon.'}
          </span>
        </MethodCard>
        <MethodCard disabled={!CFG.pickup.enabled} selected={co.fulfilment === 'pickup'} onSelect={() => patch({ fulfilment: 'pickup' })}>
          <b><Icon name="store" /> Pickup</b>
          <span>{CFG.pickup.enabled ? 'Free — collect from the store.' : 'Not available right now.'}</span>
        </MethodCard>
      </div>

      {co.fulfilment === 'delivery' ? (
        <>
          <div style={{ marginTop: 22 }}>
            <h3 style={{ fontSize: 16, marginBottom: 12 }}>Delivery address</h3>
            <div className="addr-pick">
              {saved.map((a) => (
                <AddressOption key={a.id} name="addr" selected={co.addressId === a.id} onSelect={() => patch({ addressId: a.id })}>
                  <b>{a.label} · {a.name}</b>
                  <span>{a.line1}{a.line2 ? `, ${a.line2}` : ''}, {a.city} {a.postal} — {areaById(a.areaId)?.name}</span>
                </AddressOption>
              ))}
              <AddressOption name="addr" selected={co.addressId === 'new'} onSelect={() => patch({ addressId: 'new', areaId: areaById(co.areaId)?.fee == null ? defaultAreaId() : co.areaId })}>
                <b>Use a new address</b>
                <span>Enter a different delivery address below.</span>
              </AddressOption>
            </div>
          </div>

          {co.addressId === 'new' && (
            <div style={{ marginTop: 18 }}>
              <FormField id="a-line1" label="Street address" error={errors.line1}>
                <Input id="a-line1" autoComplete="address-line1" value={co.newAddr.line1} invalid={!!errors.line1} onChange={(e) => setAddr({ line1: e.target.value })} />
              </FormField>
              <FormField id="a-line2" label="Apartment, suite" optional>
                <Input id="a-line2" autoComplete="address-line2" value={co.newAddr.line2} onChange={(e) => setAddr({ line2: e.target.value })} />
              </FormField>
              <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                <FormField id="a-city" label="City" error={errors.city}>
                  <Input id="a-city" autoComplete="address-level2" value={co.newAddr.city} invalid={!!errors.city} onChange={(e) => setAddr({ city: e.target.value })} />
                </FormField>
                <FormField id="a-postal" label="Postal code">
                  <Input id="a-postal" autoComplete="postal-code" value={co.newAddr.postal} onChange={(e) => setAddr({ postal: e.target.value })} />
                </FormField>
                <FormField id="a-phone" label="Phone" error={errors.phone}>
                  <Input id="a-phone" autoComplete="tel" value={co.newAddr.phone} invalid={!!errors.phone} onChange={(e) => setAddr({ phone: e.target.value })} />
                </FormField>
              </div>
              <FormField id="a-area" label="Delivery area">
                <Select id="a-area" value={co.areaId} onChange={(e) => patch({ areaId: e.target.value })}>
                  {CFG.deliveryAreas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}{a.fee != null ? ` — ${fmt(a.fee)} · ${a.eta}` : ''}
                    </option>
                  ))}
                </Select>
              </FormField>
              <Checkbox checked={co.saveAddress} onChange={(e) => patch({ saveAddress: e.target.checked })}>
                Save this address to my account
              </Checkbox>
            </div>
          )}

          <div className={fee == null ? 'area-note warn' : 'area-note'}>
            <span>
              {fee == null ? (
                <><b>We don’t deliver to this area yet.</b> Choose pickup, or pick one of the listed areas.</>
              ) : (
                area && <><b>{area.name}</b> · {area.eta}</>
              )}
            </span>
            <b>{feeNote}</b>
          </div>
        </>
      ) : (
        <div style={{ marginTop: 22 }}>
          <div className="review-block">
            <h4>Pickup location</h4>
            <p>
              <b>{CFG.pickup.address}</b>
              <br />
              {CFG.pickup.hours}
              <br />
              <span style={{ color: 'var(--muted)' }}>{CFG.pickup.note}</span>
            </p>
          </div>
        </div>
      )}

      <div className="field" style={{ marginTop: 18 }}>
        <label htmlFor="co-instr">
          {co.fulfilment === 'delivery' ? 'Delivery instructions' : 'Pickup notes'} <span className="opt">(optional)</span>
        </label>
        <Textarea
          id="co-instr"
          maxLength={500}
          placeholder="e.g. Leave with the neighbour at №12 if I’m out"
          value={co.instructions}
          onChange={(e) => patch({ instructions: e.target.value })}
        />
      </div>

      <div className="co-actions">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={next}>Continue <Icon name="arrR" small /></Button>
      </div>
    </div>
  );
}
