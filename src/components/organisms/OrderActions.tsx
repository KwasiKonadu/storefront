'use client';

import { Button, Icon } from '@/components/atoms';
import { Alert } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useConfirm, useReorder } from '@/hooks';
import { ApiError, api } from '@/lib/api';
import { CANCELLABLE, CFG } from '@/lib/config';
import type { Order } from '@/lib/types';
import { ReturnModal } from './ReturnModal';

const RETURN_HEADLINE: Record<string, string> = {
  requested: 'Return request received — under review',
  approved: 'Return approved',
  rejected: 'Return request declined',
  completed: 'Return completed',
};

export function OrderActions({ order: o }: { order: Order }) {
  const { refresh } = useStore();
  const { toast, openModal } = useUI();
  const confirm = useConfirm();
  const reorder = useReorder();
  const rr = api.returns.forOrder(o.ref);

  const cancel = async () => {
    const ok = await confirm({
      title: 'Cancel this order?',
      message: <>Order <b>{o.ref}</b> will be cancelled and its items returned to stock. This can’t be undone.</>,
      confirmLabel: 'Cancel order',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.orders.cancel(o.ref);
      refresh();
      toast('Order cancelled — stock has been returned.');
    } catch (e) {
      toast(e instanceof ApiError ? e.message : 'Could not cancel.', { type: 'warn' });
    }
  };

  return (
    <>
      <div className="no-print" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
        <Button onClick={() => reorder(o.ref)}><Icon name="refresh" small /> Reorder items</Button>
        {CANCELLABLE.includes(o.status) ? (
          <Button variant="outline" onClick={cancel}>Cancel order</Button>
        ) : o.status !== 'cancelled' && o.status !== 'completed' ? (
          <span style={{ alignSelf: 'center', fontSize: 13, color: 'var(--muted)' }}>Cancellation window has passed for this order.</span>
        ) : null}
        {o.status === 'completed' && !rr && CFG.returnDays != null && (
          <Button variant="outline" onClick={() => openModal({ title: `Request a return — ${o.ref}`, wide: true, content: <ReturnModal order={o} /> })}>
            <Icon name="pinReturn" small /> Request a return
          </Button>
        )}
        <Button variant="outline" onClick={() => window.print()}><Icon name="print" small /> Print receipt</Button>
      </div>
      {rr && (
        <Alert tone={rr.status === 'rejected' ? 'error' : rr.status === 'requested' ? 'info' : 'success'}>
          <b>{RETURN_HEADLINE[rr.status]}</b> — {rr.items.map((i) => `${i.qty}× ${i.name}`).join(', ')}. Reason: {rr.reason}.
          {rr.status === 'requested' && ' A request is not an approved refund until the store confirms it.'}
          {rr.staffNote && <> Message from the store: “{rr.staffNote}”</>}
        </Alert>
      )}
    </>
  );
}
