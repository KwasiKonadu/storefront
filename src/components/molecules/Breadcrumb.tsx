import Link from 'next/link';
import { Fragment, type CSSProperties } from 'react';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, style }: { items: Crumb[]; style?: CSSProperties }) {
  return (
    <nav className="crumb" style={style} aria-label="Breadcrumb">
      {items.map((c, i) => (
        <Fragment key={i}>
          {i > 0 && <span className="sep">/</span>}
          {c.href ? <Link href={c.href}>{c.label}</Link> : c.label}
        </Fragment>
      ))}
    </nav>
  );
}
