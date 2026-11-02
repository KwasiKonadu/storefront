'use client';

import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { ButtonLink, TextLink } from '@/components/atoms';
import { Alert, EmptyState, StepIndicator } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useCheckout } from '@/hooks';
import { ApiError, api } from '@/lib/api';
import { chargedFee, isFreeDelivery, listedFee } from '@/lib/checkout';
import { fmt } from '@/lib/format';
import type { CartView, Customer } from '@/lib/types';
import { CheckoutContactStep } from './CheckoutContactStep';
import { CheckoutFulfilmentStep } from './CheckoutFulfilmentStep';
import { CheckoutReviewStep } from './CheckoutReviewStep';
import { CheckoutSummary } from './CheckoutSummary';

/** The whole checkout: step indicator, the active step, and the order summary. */
export function CheckoutFlow({ user, cart: liveCart }: { user: Customer; cart: CartView }) {
  const router = useRouter();
  const { refresh } = useStore();
  const { state: co, patch, goto } = useCheckout(user);
  const saved = api.addresses.list();

  // Placing an order empties the live cart; keep showing the last non-empty one until navigation completes.
  const lastCart = useRef(liveCart);
  if (liveCart.items.length) lastCart.current = liveCart;
  const cart = liveCart.items.length || !co.placing ? liveCart : lastCart.current;

  const fee = listedFee(co, saved);
  const free = isFreeDelivery(cart.subtotal);
  const total = cart.subtotal + chargedFee(cart.subtotal, co, saved);
  const feeNote =
    co.fulfilment === 'pickup' ? 'Free' : fee == null ? '—' : free ? (
      <>
        <s style={{ color: 'var(--faint)' }}>{fmt(fee)}</s> <span style={{ color: 'var(--pine)', fontWeight: 700 }}>Free</span>
      </>
    ) : (
      fmt(fee)
    );

  if (!cart.items.length) {
    return (
      <EmptyState icon="bag" title="Nothing to check out" text="Your cart is empty — add something lovely first." action={<ButtonLink href="/shop">Browse the shop</ButtonLink>} />
    );
  }

  const place = async () => {
    if (co.placing) return; // repeated clicks can't create duplicates; the idempotency key guards retries too
    patch({ placing: true });
    try {
      const order = await api.orders.create({
        idempotencyKey: co.idempotencyKey,
        contact: co.contact,
        fulfilment: co.fulfilment,
        addressId: co.addressId,
        address: co.addressId === 'new' ? { ...co.newAddr, areaId: co.areaId } : null,
        saveAddress: co.fulfilment === 'delivery' && co.addressId === 'new' && co.saveAddress,
        areaId: co.areaId,
        instructions: co.instructions,
        paymentMethod: co.payment,
      });
      refresh();
      router.push(`/order-confirm/${order.ref}`);
    } catch (e) {
      const err = e instanceof ApiError ? e : new ApiError('Something went wrong placing your order.');
      patch({ placing: false, error: { message: err.message, issues: err.issues, cartIssue: /cart/i.test(err.message) } });
      refresh(); // the api may have corrected the cart
      window.scrollTo({ top: 0 });
    }
  };

  return (
    <div className="co-layout">
      <div>
        <StepIndicator steps={['Contact', 'Fulfilment', 'Review']} current={co.step} onGoto={(s) => goto(s as 1 | 2 | 3)} />

        {co.error && (
          <Alert tone="error">
            <b>{co.error.message}</b>
            {co.error.issues?.length ? (
              <ul>
                {co.error.issues.map((i, n) => (
                  <li key={n}>
                    {i.name || i.field || ''}
                    {i.reason ? ` — ${i.reason}` : i.message ? ` — ${i.message}` : ''}
                  </li>
                ))}
              </ul>
            ) : null}
            {co.error.cartIssue && (
              <div style={{ marginTop: 8 }}>
                <TextLink href="/cart">Review your cart</TextLink>
              </div>
            )}
          </Alert>
        )}

        {co.step === 1 && <CheckoutContactStep contact={co.contact} onNext={(contact) => patch({ contact, step: 2, error: null })} />}
        {co.step === 2 && (
          <CheckoutFulfilmentStep
            state={co}
            saved={saved}
            feeNote={feeNote}
            patch={patch}
            onBack={() => goto(1)}
            onNext={() => {
              patch({ step: 3, error: null });
              window.scrollTo({ top: 0 });
            }}
          />
        )}
        {co.step === 3 && (
          <CheckoutReviewStep state={co} saved={saved} cart={cart} total={total} patch={patch} onEdit={goto} onBack={() => goto(2)} onPlace={place} />
        )}
      </div>
      <CheckoutSummary cart={cart} fulfilment={co.fulfilment} fee={fee} feeNote={feeNote} total={total} />
    </div>
  );
}
