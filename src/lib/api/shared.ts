import { CATALOG } from '../catalogStore';
import { delay } from '../format';
import { session } from '../session';
import { ApiError } from './errors';

/** Small simulated latency so loading states are real. */
export const delayNet = () => delay(90 + Math.random() * 140);

export const requireAuth = () => {
  if (!session.user) throw new ApiError('Please sign in to continue.');
  return session.user;
};

export const prod = (id: string) => CATALOG.products.find((p) => p.id === id);
export const pub = (id: string) => {
  const p = prod(id);
  return p && p.published ? p : undefined;
};
