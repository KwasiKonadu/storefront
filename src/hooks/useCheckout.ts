'use client';

import { useCallback, useState } from 'react';
import { api } from '@/lib/api';
import { CFG, defaultAreaId, deliverableAreas } from '@/lib/config';
import { uid } from '@/lib/format';
import type { CheckoutState } from '@/lib/checkout';
import type { Customer } from '@/lib/types';

function initialState(user: Customer): CheckoutState {
  const saved = api.addresses.list();
  const def = saved.find((a) => a.isDefault) ?? saved[0];
  return {
    step: 1,
    idempotencyKey: uid('idem_'),
    placing: false,
    error: null,
    contact: { name: user.name, email: user.email, phone: user.phone || '' },
    fulfilment: deliverableAreas().length === 0 && CFG.pickup.enabled ? 'pickup' : 'delivery',
    addressId: def?.id ?? 'new',
    newAddr: { label: 'Home', name: user.name, phone: user.phone || '', line1: '', line2: '', city: '', postal: '', areaId: defaultAreaId(), isDefault: true },
    saveAddress: !saved.length,
    areaId: def?.areaId ?? defaultAreaId(),
    instructions: '',
    payment: CFG.paymentMethods[0].id,
  };
}

/** State machine for the 3-step checkout. */
export function useCheckout(user: Customer) {
  const [state, setState] = useState<CheckoutState>(() => initialState(user));
  const patch = useCallback((p: Partial<CheckoutState>) => setState((s) => ({ ...s, ...p })), []);
  const goto = useCallback((step: CheckoutState['step']) => setState((s) => ({ ...s, step, error: null })), []);
  return { state, patch, goto };
}
