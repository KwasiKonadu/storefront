import { ICONS, type IconName } from './icons';
import { cx } from '@/lib/format';

export interface IconProps {
  name: IconName;
  /** 16px variant (`ic-s`) instead of the default 20px */
  small?: boolean;
  className?: string;
}

export function Icon({ name, small, className }: IconProps) {
  return (
    <svg
      className={cx(small ? 'ic-s' : 'ic', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      data-icon={name}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}
