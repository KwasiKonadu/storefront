import { D, tx } from '../db';
import type { ReturnRequest } from '../types';
import { accountFetch } from './account';
import { ApiError } from './errors';
import { requireAuth } from './shared';

export const returns = {
  forOrder: (ref: string) => D().returnRequests.find((r) => r.ref === ref) ?? null,

  /** Sends the request to the store, which checks it against the order and the returns window. */
  async create(ref: string, { items, reason, notes }: { items: { productId: string; qty: number }[]; reason: string; notes: string }) {
    requireAuth();
    const picked = (items || []).filter((i) => +i.qty > 0).map((i) => ({ productId: i.productId, qty: +i.qty }));
    if (!picked.length) throw new ApiError('Select at least one item and quantity to return.');
    if (!reason) throw new ApiError('Please choose a reason for the return.');
    const req = await accountFetch<ReturnRequest>('returns', { method: 'POST', body: { ref, items: picked, reason, notes } });
    tx((d) => {
      d.returnRequests = d.returnRequests.filter((r) => r.ref !== ref).concat(req);
    });
    return req;
  },
};
