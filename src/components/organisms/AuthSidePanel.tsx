import { CFG } from '@/lib/config';

export function AuthSidePanel() {
  return (
    <div className="auth-side">
      <blockquote>
        {CFG.storeName}
        {CFG.tagline && <span className="who">{CFG.tagline}</span>}
      </blockquote>
    </div>
  );
}
