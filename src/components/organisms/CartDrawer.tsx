'use client';

import Link from 'next/link';
import { Button, Icon, IconButton } from '@/components/atoms';
import { DrawerLineItem, ShipProgress } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import { useCart, useCartActions, useGoToCheckout } from '@/hooks';
import { cx, fmt } from '@/lib/format';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const cart = useCart();
  const { setQty, remove } = useCartActions();
  const goToCheckout = useGoToCheckout();
  const router = useRouter();

  return (
    <>
      <div className={cx('drawer-overlay', cartOpen && 'open')} onClick={closeCart} />
      <aside className={cx('drawer', cartOpen && 'open')} role="dialog" aria-modal="true" aria-label="Shopping cart" aria-hidden={!cartOpen}>
        <div className="drawer-head">
          <h3>
            Your cart{' '}
            {cart.count > 0 && <span style={{ color: 'var(--muted)', fontSize: 15 }}>({cart.count})</span>}
          </h3>
          <IconButton aria-label="Close cart" onClick={closeCart}>
            <Icon name="x" />
          </IconButton>
        </div>
        <div className="drawer-body">
          {cart.items.length ? (
            cart.items.map((line) => (
              <DrawerLineItem
                key={`${line.productId}:${line.variantId}`}
                line={line}
                onNavigate={closeCart}
                onQty={(d) => setQty(line.index, line.qty + d, d)}
                onRemove={() => remove(line.index)}
              />
            ))
          ) : (
            <div className="empty-drawer">
              <Icon name="bag" />
              <p style={{ marginBottom: 16 }}>
                Your cart is empty.
                <br />
                Good things are waiting on the shelves.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  closeCart();
                  router.push('/shop');
                }}
              >
                Browse the shop
              </Button>
            </div>
          )}
        </div>
        {cart.items.length > 0 && (
          <div className="drawer-foot">
            <ShipProgress subtotal={cart.subtotal} variant="drawer" />
            <div className="d-sub">
              <span>Subtotal</span>
              <b>{fmt(cart.subtotal)}</b>
            </div>
            <p className="d-note">Delivery calculated at checkout. Prices re-verified before you pay.</p>
            <Button size="lg" onClick={goToCheckout}>
              Proceed to checkout <Icon name="arrR" small />
            </Button>
            <Link className="view-all" href="/cart" onClick={closeCart}>View full cart</Link>
          </div>
        )}
      </aside>
    </>
  );
}
