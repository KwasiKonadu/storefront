'use client';

import { useState } from 'react';
import { Button, Select, Textarea } from '@/components/atoms';
import { FormField, ModalBody, ModalFooter, ReturnItemRow } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { api } from '@/lib/api';
import type { Order } from '@/lib/types';

const REASONS = ['Arrived damaged', 'Not as described', 'Changed my mind', 'Wrong item received', 'Other'];

export function ReturnModal({ order }: { order: Order }) {
  const { refresh } = useStore();
  const { closeModal, toast } = useUI();
  const [qty, setQty] = useState<Record<string, number>>({});
  const [reason, setReason] = useState(REASONS[0]);
  const [notes, setNotes] = useState('');

  const submit = async () => {
    try {
      await api.returns.create(order.ref, { items: order.items.map((i) => ({ productId: i.productId, qty: qty[i.productId] ?? 0 })), reason, notes });
      closeModal();
      refresh();
      toast('Return request submitted — the store will review it shortly.');
    } catch (e) {
      toast(e instanceof Error ? e.message : 'Could not submit the request.', { type: 'warn' });
    }
  };

  return (
    <>
      <ModalBody>
        <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 14 }}>
          Choose items and quantities. This creates a request for the store to review — it is <b>not</b> an automatic refund.
        </p>
        {order.items.map((it) => (
          <ReturnItemRow key={it.productId} item={it} value={qty[it.productId] ?? 0} onChange={(n) => setQty((q) => ({ ...q, [it.productId]: n }))} />
        ))}
        <div style={{ marginTop: 18 }}>
          <FormField id="ret-reason" label="Reason">
            <Select id="ret-reason" value={reason} onChange={(e) => setReason(e.target.value)}>
              {REASONS.map((r) => <option key={r}>{r}</option>)}
            </Select>
          </FormField>
        </div>
        <FormField id="ret-notes" label="Notes" optional>
          <Textarea id="ret-notes" maxLength={500} placeholder="Anything the store should know" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closeModal}>Cancel</Button>
        <Button onClick={submit}>Submit request</Button>
      </ModalFooter>
    </>
  );
}
