'use client';

import { ButtonLink, TextLink } from '@/components/atoms';
import { Alert, EmptyState, PageHeading } from '@/components/molecules';
import { ProductGrid } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { useStore } from '@/context/StoreContext';
import { usePageTitle } from '@/hooks';
import { api } from '@/lib/api';

export default function WishlistPage() {
  usePageTitle('Wishlist');
  const { user, wishIds } = useStore();
  const items = api.catalog.byIds(wishIds);
  return (
    <PageContainer>
      <PageHeading
        title="Wishlist"
        sub={user ? 'Saved to your account — available on any device.' : 'Saved in this browser for now — sign in to keep it on your account.'}
      />
      {!user && (
        <Alert tone="info" style={{ marginBottom: 22 }}>
          Guest wishlist. <TextLink href="/signin?next=/wishlist">Sign in</TextLink> to save it permanently.
        </Alert>
      )}
      {items.length ? (
        <ProductGrid products={items} columns={4} style={{ paddingBottom: 60 }} />
      ) : (
        <EmptyState icon="heart" title="Nothing saved yet" text="Tap the heart on any product to keep it here for later." action={<ButtonLink href="/shop">Discover products</ButtonLink>} />
      )}
    </PageContainer>
  );
}
