'use client';

import { Button, Icon } from '@/components/atoms';
import { AddressCard, EmptyState } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { useConfirm } from '@/hooks';
import { api } from '@/lib/api';
import type { Address } from '@/lib/types';
import { AddressFormModal } from './AddressFormModal';

export function AddressBook() {
  const { refresh } = useStore();
  const { openModal, toast } = useUI();
  const confirm = useConfirm();
  const list = api.addresses.list();

  const edit = (a?: Address) => openModal({ title: a ? 'Edit address' : 'New address', content: <AddressFormModal address={a} /> });

  return (
    <div>
      {list.length ? (
        <div className="info-grid">
          {list.map((a) => (
            <AddressCard
              key={a.id}
              address={a}
              onSetDefault={async () => {
                try { await api.addresses.setDefault(a.id); refresh(); toast('Default address updated.'); }
                catch (e) { toast(e instanceof Error ? e.message : 'Could not update.', { type: 'warn' }); }
              }}
              onEdit={() => edit(a)}
              onDelete={async () => {
                if (await confirm({ title: 'Delete address?', message: 'This saved address will be removed from your account.', confirmLabel: 'Delete', danger: true })) {
                  try { await api.addresses.remove(a.id); refresh(); toast('Address deleted.'); }
                  catch (e) { toast(e instanceof Error ? e.message : 'Could not delete.', { type: 'warn' }); }
                }
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState icon="pin" title="No saved addresses yet" text="Add one now and checkout becomes a single click later." />
      )}
      <div style={{ marginTop: 22 }}>
        <Button onClick={() => edit()}><Icon name="plus" small /> Add address</Button>
      </div>
    </div>
  );
}
