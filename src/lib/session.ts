import { D } from './db';
import type { Customer } from './types';

export const GUEST_KEY = 'mp_guest';

/** Mutable, module-level session — the equivalent of "who is calling the API". */
export const session = {
  user: null as Customer | null,
  guestId: '',
};

export const cartKey = () => (session.user ? `user:${session.user.id}` : `guest:${session.guestId}`);
export const wishKey = cartKey;

export function wishlistIds(): string[] {
  return [...(D().wishlists[wishKey()] ?? [])];
}
