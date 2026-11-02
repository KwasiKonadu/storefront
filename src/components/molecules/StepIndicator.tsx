import { Icon } from '@/components/atoms';
import { cx } from '@/lib/format';

export function StepIndicator({ steps, current, onGoto }: { steps: string[]; current: number; onGoto: (step: number) => void }) {
  return (
    <ol className="co-steps" style={{ listStyle: 'none' }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const done = current > n;
        return (
          <li
            key={label}
            className={cx('co-step', current === n && 'active', done && 'done')}
            {...(done
              ? { role: 'button', tabIndex: 0, onClick: () => onGoto(n), onKeyDown: (e: React.KeyboardEvent) => e.key === 'Enter' && onGoto(n) }
              : {})}
          >
            <span className="n">{done ? <Icon name="check" small /> : n}</span> {label}
          </li>
        );
      })}
    </ol>
  );
}
