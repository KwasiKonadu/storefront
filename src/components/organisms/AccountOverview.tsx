'use client';

import { ButtonLink, TextLink } from '@/components/atoms';
import { EmptyState, InfoCell, OrderCard } from '@/components/molecules';
import { useReorder } from '@/hooks';
import { api } from '@/lib/api';
import { areaById } from '@/lib/config';
import type { Customer } from '@/lib/types';

export function AccountOverview({ user }: { user: Customer }) {
  const reorder = useReorder();
  const recent = api.orders.listMine().slice(0, 3);
  const def = api.addresses.list().find((a) => a.isDefault);
  const small = { fontSize: 13 } as const;
  return (
    <div>
      <div className="info-grid" style={{ marginBottom: 22 }}>
        <InfoCell title="Profile">
          <b>{user.name}</b>
          <br />
          {user.email}
          {user.phone && <><br />{user.phone}</>}
          <br />
          <TextLink href="/account/profile" style={small}>Edit profile</TextLink>
        </InfoCell>
        <InfoCell title="Default address">
          {def ? (
            <>
              {def.line1}, {def.city}
              <br />
              <span style={{ color: 'var(--muted)' }}>{areaById(def.areaId)?.name}</span>
              <br />
              <TextLink href="/account/addresses" style={small}>Manage addresses</TextLink>
            </>
          ) : (
            <>
              No address saved yet.
              <br />
              <TextLink href="/account/addresses" style={small}>Add one</TextLink>
            </>
          )}
        </InfoCell>
      </div>
      <div className="panel">
        <h2>Recent orders</h2>
        <p className="panel-sub">Your latest activity. See all in <TextLink href="/orders">My Orders</TextLink>.</p>
        {recent.length ? (
          recent.map((o) => <OrderCard key={o.id} order={o} onReorder={() => reorder(o.ref)} />)
        ) : (
          <EmptyState icon="box" title="No orders yet" text="When you place your first order it will appear here." action={<ButtonLink href="/shop">Start shopping</ButtonLink>} />
        )}
      </div>
    </div>
  );
}
