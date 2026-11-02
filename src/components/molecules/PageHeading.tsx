import type { CSSProperties, ReactNode } from 'react';
import { Breadcrumb, type Crumb } from './Breadcrumb';

export interface PageHeadingProps {
  title: ReactNode;
  sub?: ReactNode;
  crumbs?: Crumb[];
  /** right-aligned content (e.g. status pills) */
  aside?: ReactNode;
}

export function PageHeading({ title, sub, crumbs, aside }: PageHeadingProps) {
  const row: CSSProperties | undefined = aside
    ? { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 14 }
    : undefined;
  const text = (
    <div>
      <h1>{title}</h1>
      {sub && <p className="sub">{sub}</p>}
    </div>
  );
  return (
    <div className="page-head" style={row}>
      {crumbs && <Breadcrumb items={crumbs} style={{ padding: '0 0 10px' }} />}
      {aside ? (
        <>
          {text}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{aside}</div>
        </>
      ) : (
        <>
          <h1>{title}</h1>
          {sub && <p className="sub">{sub}</p>}
        </>
      )}
    </div>
  );
}
