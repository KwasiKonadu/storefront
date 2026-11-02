import { areaById, deliverableAreas } from '../config';
import { D, tx } from '../db';
import { session } from '../session';
import type { Address, AddressInput } from '../types';
import { isPhone } from '../validation';
import { accountFetch } from './account';
import { ApiError } from './errors';

/** Saved addresses live in the store; this keeps a copy so screens can read them straight away. */
const putLocal = (saved: Address) =>
  tx((d) => {
    const userId = saved.customerId;
    const i = d.addresses.findIndex((a) => a.id === saved.id);
    if (i >= 0) d.addresses[i] = saved;
    else d.addresses.push(saved);
    if (saved.isDefault) d.addresses.filter((a) => a.customerId === userId).forEach((a) => (a.isDefault = a.id === saved.id));
  });

export const addresses = {
  list: () => D().addresses.filter((a) => a.customerId === session.user?.id),

  /** Create or update, scoped to the signed-in customer. */
  async save(data: AddressInput, id?: string) {
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = 'Required';
    if (!data.line1?.trim()) errs.line1 = 'Required';
    if (!data.city?.trim()) errs.city = 'Required';
    if (!isPhone(data.phone)) errs.phone = 'Enter a valid phone number';
    // An area is only needed once delivery areas exist (delivery may not be offered yet).
    if (deliverableAreas().length && areaById(data.areaId)?.fee == null) errs.areaId = 'Choose a delivery area';
    if (Object.keys(errs).length)
      throw new ApiError('Please check the highlighted fields.', {
        issues: Object.entries(errs).map(([field, message]) => ({ field, message })),
      });
    const saved = await accountFetch<Address>(id ? `addresses/${id}` : 'addresses', { method: id ? 'PUT' : 'POST', body: data });
    putLocal(saved);
    return saved.id;
  },

  async remove(id: string) {
    await accountFetch(`addresses/${id}`, { method: 'DELETE' });
    const userId = session.user!.id;
    tx((d) => {
      d.addresses = d.addresses.filter((a) => !(a.id === id && a.customerId === userId));
      const rest = d.addresses.filter((a) => a.customerId === userId);
      if (rest.length && !rest.some((a) => a.isDefault)) rest[0].isDefault = true;
    });
  },

  async setDefault(id: string) {
    const saved = await accountFetch<Address>(`addresses/${id}`, { method: 'PUT', body: { isDefault: true } });
    putLocal(saved);
  },
};
