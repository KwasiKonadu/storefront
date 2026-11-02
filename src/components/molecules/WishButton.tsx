import { Icon } from '@/components/atoms';
import { cx } from '@/lib/format';

export interface WishButtonProps {
  active: boolean;
  onToggle: () => void;
  /** `icon` = heart pinned on a card, `line` = full-width button on the product page */
  variant?: 'icon' | 'line';
}

export function WishButton({ active, onToggle, variant = 'icon' }: WishButtonProps) {
  if (variant === 'line') {
    return (
      <button type="button" className={cx('wish-line', active && 'on')} onClick={onToggle}>
        <Icon name="heart" small /> <span>{active ? 'Saved to wishlist' : 'Add to wishlist'}</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      className={cx('wish-b', active && 'on')}
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? 'Remove from wishlist' : 'Save to wishlist'}
    >
      <Icon name="heart" small />
    </button>
  );
}
