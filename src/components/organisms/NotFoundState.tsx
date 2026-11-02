'use client';

import { Button, ButtonLink } from '@/components/atoms';
import { useUI } from '@/context/UIContext';

export function NotFoundState({ message }: { message?: string }) {
  const { openSearch } = useUI();
  return (
    <div className="notfound">
      <h1>404</h1>
      <p>{message ?? 'That page doesn’t exist — maybe it moved, maybe it never did.'}</p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <ButtonLink href="/shop">Back to the shop</ButtonLink>
        <Button variant="outline" onClick={openSearch}>Search products</Button>
      </div>
    </div>
  );
}
