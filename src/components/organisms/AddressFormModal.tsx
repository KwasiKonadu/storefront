'use client';

import { useState } from 'react';
import { Button, Checkbox, Input, Select } from '@/components/atoms';
import { FormField, ModalBody, ModalFooter } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { ApiError, api } from '@/lib/api';
import { deliverableAreas } from '@/lib/config';
import { fmt } from '@/lib/format';
import type { Address } from '@/lib/types';

type Fields = 'label' | 'name' | 'phone' | 'line1' | 'line2' | 'city' | 'postal' | 'areaId';

/** Modal content for creating (`address` undefined) or editing a saved address. */
export function AddressFormModal({ address }: { address?: Address }) {
  const { user, refresh } = useStore();
  const { closeModal, toast } = useUI();
  const [values, setValues] = useState<Record<Fields, string>>({
    label: address?.label ?? 'Home',
    name: address?.name ?? user?.name ?? '',
    phone: address?.phone ?? '',
    line1: address?.line1 ?? '',
    line2: address?.line2 ?? '',
    city: address?.city ?? '',
    postal: address?.postal ?? '',
    areaId: address?.areaId ?? deliverableAreas()[0]?.id ?? '',
  });
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);
  const [errors, setErrors] = useState<Partial<Record<Fields, string>>>({});

  const bind = (k: Fields) => ({
    id: `ad-${k}`,
    value: values[k],
    invalid: !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
  });

  const save = async () => {
    try {
      await api.addresses.save({ ...values, label: values.label.trim() || 'Address', isDefault }, address?.id);
      closeModal();
      refresh();
      toast(address ? 'Address updated.' : 'Address added.');
    } catch (err) {
      if (err instanceof ApiError && err.issues) setErrors(Object.fromEntries(err.issues.map((i) => [i.field, i.message])));
      else toast(err instanceof Error ? err.message : 'Could not save.', { type: 'warn' });
    }
  };

  return (
    <>
      <ModalBody>
        <form noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
          <FormField id="ad-label" label="Label"><Input placeholder="Home, Work…" {...bind('label')} /></FormField>
          <FormField id="ad-name" label="Recipient name" error={errors.name}><Input {...bind('name')} /></FormField>
          <FormField id="ad-phone" label="Phone" error={errors.phone}><Input type="tel" {...bind('phone')} /></FormField>
          <FormField id="ad-line1" label="Street address" error={errors.line1}><Input {...bind('line1')} /></FormField>
          <FormField id="ad-line2" label="Apartment, suite" optional><Input {...bind('line2')} /></FormField>
          <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <FormField id="ad-city" label="City" error={errors.city}><Input {...bind('city')} /></FormField>
            <FormField id="ad-postal" label="Postal code"><Input {...bind('postal')} /></FormField>
          </div>
          <FormField id="ad-areaId" label="Delivery area" error={errors.areaId}>
            <Select {...bind('areaId')}>
              {deliverableAreas().map((a) => (
                <option key={a.id} value={a.id}>{a.name} — {fmt(a.fee as number)}</option>
              ))}
            </Select>
          </FormField>
          <Checkbox checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)}>Set as default delivery address</Checkbox>
        </form>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closeModal}>Cancel</Button>
        <Button onClick={save}>{address ? 'Save changes' : 'Add address'}</Button>
      </ModalFooter>
    </>
  );
}
