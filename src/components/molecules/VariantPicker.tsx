import { fmt } from '@/lib/format';
import { cx } from '@/lib/format';
import type { VariantGroup } from '@/lib/types';

export interface VariantPickerProps {
  group: VariantGroup;
  selectedId: string;
  onSelect: (optionId: string) => void;
}

export function VariantPicker({ group, selectedId, onSelect }: VariantPickerProps) {
  const selected = group.options.find((o) => o.id === selectedId);
  return (
    <div className="v-group">
      <div className="v-label">
        {group.name} <span>· {selected?.label}</span>
      </div>
      <div className="v-opts" role="radiogroup" aria-label={group.name}>
        {group.options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={selectedId === o.id}
            className={cx('v-opt', selectedId === o.id && 'on')}
            onClick={() => onSelect(o.id)}
          >
            {o.label}
            {o.priceLabel ? ` · ${o.priceLabel}` : o.priceDelta ? ` · ${o.priceDelta > 0 ? '+' : ''}${fmt(o.priceDelta).replace('.00', '')}` : ''}
          </button>
        ))}
      </div>
    </div>
  );
}
