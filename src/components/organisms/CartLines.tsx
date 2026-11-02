'use client';

import { Button, Icon, TextLink } from '@/components/atoms';
import { CartLineItem } from '@/components/molecules';
import { useCartActions, useConfirm } from '@/hooks';
import type { CartView } from '@/lib/types';

export function CartLines({ cart }: { cart: CartView }) {
  const { setQty, remove, clear } = useCartActions();
  const confirm = useConfirm();

  return (
    <div className="cart-lines">
      {cart.items.map((line) => (
        <CartLineItem
          key={`${line.productId}:${line.variantId}`}
          line={line}
          onQty={(d) => setQty(line.index, line.qty + d, d)}
          onRemove={() => remove(line.index)}
        />
      ))}
      <div className="cart-foot">
        <Button
          variant="outline"
          size="sm"
          onClick={async () => {
            if (await confirm({ title: 'Clear the cart?', message: 'This removes every item. You can always add them again.', confirmLabel: 'Clear cart', danger: true })) clear();
          }}
        >
          <Icon name="trash" small /> Clear cart
        </Button>
        <TextLink href="/shop">Continue shopping <Icon name="arrR" small /></TextLink>
      </div>
    </div>
  );
}
