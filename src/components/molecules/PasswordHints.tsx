import { Icon } from '@/components/atoms';
import { passwordRules } from '@/lib/validation';
import { cx } from '@/lib/format';

export function PasswordHints({ value }: { value: string }) {
  const r = passwordRules(value);
  const hint = (ok: boolean, text: string) => (
    <span className={cx(ok && 'ok')}>
      <Icon name="check" small /> {text}
    </span>
  );
  return (
    <div className="pw-hints">
      {hint(r.len, '8+ characters')}
      {hint(r.letter, 'Contains a letter')}
      {hint(r.num, 'Contains a number')}
    </div>
  );
}
