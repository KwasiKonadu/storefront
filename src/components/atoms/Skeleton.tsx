import type { CSSProperties } from 'react';

export function Skeleton({ style }: { style?: CSSProperties }) {
  return <div className="skeleton" style={style} aria-hidden="true" />;
}
