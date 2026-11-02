import { areaById } from '@/lib/config';
import { cx } from '@/lib/format';
import type { Address } from '@/lib/types';

export interface AddressCardProps {
  address: Address;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function AddressCard({ address: a, onSetDefault, onEdit, onDelete }: AddressCardProps) {
  return (
    <div className={cx('addr-card', a.isDefault && 'default')}>
      {a.isDefault && <span className="def-badge">Default</span>}
      <b>{a.label} · {a.name}</b>
      <p>
        {a.line1}{a.line2 ? `, ${a.line2}` : ''}
        <br />
        {a.city} {a.postal}
        <br />
        {a.phone}
        <br />
        <span style={{ color: 'var(--pine)', fontWeight: 600 }}>{areaById(a.areaId)?.name}</span>
      </p>
      <div className="addr-actions">
        {!a.isDefault && <button type="button" onClick={onSetDefault}>Set default</button>}
        <button type="button" onClick={onEdit}>Edit</button>
        <button type="button" className="del" onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
}
