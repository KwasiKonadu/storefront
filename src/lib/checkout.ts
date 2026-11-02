import { areaById, qualifiesForFreeDelivery } from './config';
import type { Address, AddressInput, DeliveryArea, Fulfilment, OrderContact } from './types';
import type { FieldIssue } from './api/errors';

export interface CheckoutState {
  step: 1 | 2 | 3;
  idempotencyKey: string;
  placing: boolean;
  error: { message: string; issues: FieldIssue[] | null; cartIssue: boolean } | null;
  contact: OrderContact;
  fulfilment: Fulfilment;
  /** saved address id, or 'new' */
  addressId: string;
  newAddr: AddressInput;
  saveAddress: boolean;
  /** area for a new address */
  areaId: string;
  instructions: string;
  payment: string;
}

type AreaSelection = Pick<CheckoutState, 'fulfilment' | 'addressId' | 'areaId'>;

/** The delivery area implied by the current selection (undefined for pickup). */
export function selectedArea(s: AreaSelection, saved: Address[]): DeliveryArea | undefined {
  if (s.fulfilment === 'pickup') return undefined;
  return areaById(s.addressId !== 'new' ? saved.find((a) => a.id === s.addressId)?.areaId : s.areaId);
}

/** Listed delivery fee: 0 for pickup, null when the area isn't deliverable. */
export function listedFee(s: AreaSelection, saved: Address[]): number | null {
  if (s.fulfilment === 'pickup') return 0;
  return selectedArea(s, saved)?.fee ?? null;
}

/** What the customer will actually be charged for delivery (free above the threshold). */
export function chargedFee(subtotal: number, s: AreaSelection, saved: Address[]): number {
  const fee = listedFee(s, saved);
  if (s.fulfilment !== 'delivery' || fee == null || qualifiesForFreeDelivery(subtotal)) return 0;
  return fee;
}

export const isFreeDelivery = (subtotal: number) => qualifiesForFreeDelivery(subtotal);
