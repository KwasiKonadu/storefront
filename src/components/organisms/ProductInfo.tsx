'use client';

import { useState } from 'react';
import { Button, Icon } from '@/components/atoms';
import { PriceTag, QuantityStepper, SpecTable, VariantPicker, WishButton } from '@/components/molecules';
import { useCartActions, useWishlist } from '@/hooks';
import { discountPct, maxQty as maxQtyFor, stockInfo, unitPrice, unitsPer } from '@/lib/catalog';
import { CFG, lowestDeliveryFee } from '@/lib/config';
import { fmt } from '@/lib/format';
import type { ProductWithCategory } from '@/lib/types';

const STOCK_COLOR = { out: 'var(--line-2)', low: 'var(--clay)', in: 'var(--pine)' } as const;
const STOCK_TEXT = { out: () => 'Out of stock', low: (label: string) => `${label} — order soon`, in: () => 'In stock, ready to ship' } as const;

/** Right-hand column of the product page: title, price, variants, buy box, shipping and specs. */
export function ProductInfo({ product: p }: { product: ProductWithCategory }) {
  const { has, toggle } = useWishlist();
  const { add } = useCartActions();
  const [variantId, setVariantId] = useState<string | null>(p.variants?.[0]?.options[0]?.id ?? null);
  const [qty, setQty] = useState(1);

  const st = stockInfo(p);
  const unit = unitPrice(p, variantId);
  const isPack = unitsPer(p, variantId) > 1;
  const available = maxQtyFor(p, variantId);
  const maxQty = Math.max(1, Math.min(99, available));
  const shownQty = Math.min(qty, maxQty);

  return (
    <div className="pdp-info">
      <span className="p-cat">{p.category.name} · {p.sku}</span>
      <h1>{p.name}</h1>
      <PriceTag size="pdp" price={unit} compareAt={isPack ? null : p.compareAtPrice} discount={isPack ? 0 : discountPct(p)} />
      <p className="pdp-stock">
        <span className="dot" style={{ background: STOCK_COLOR[st.level] }} />
        {STOCK_TEXT[st.level](st.label)}
      </p>
      <p className="pdp-desc">{p.description}</p>

      {p.variants?.map((g) => (
        <VariantPicker
          key={g.name}
          group={g}
          selectedId={variantId ?? g.options[0].id}
          onSelect={(id) => {
            setVariantId(id);
            setQty(1);
          }}
        />
      ))}

      <div className="buy-row">
        <QuantityStepper
          value={shownQty}
          onDecrease={() => setQty((q) => Math.max(1, q - 1))}
          onIncrease={() => setQty((q) => Math.min(maxQty, q + 1))}
          decreaseDisabled={shownQty <= 1}
          increaseDisabled={shownQty >= maxQty}
        />
        <Button size="lg" style={{ flex: 1 }} disabled={available <= 0} onClick={() => add(p.id, variantId, shownQty, { openDrawer: false })}>
          {available > 0 ? <>Add to cart — {fmt(unit * shownQty)}</> : p.stock > 0 ? 'Not enough stock for a pack' : 'Out of stock'}
        </Button>
      </div>

      <WishButton variant="line" active={has(p.id)} onToggle={() => toggle(p.id)} />

      <div className="pdp-ship">
        {lowestDeliveryFee() != null && (
          <span>
            <Icon name="truck" small /> Delivery from {fmt(lowestDeliveryFee() as number)}
            {CFG.freeDeliveryThreshold != null && <> · free over {fmt(CFG.freeDeliveryThreshold)}</>}
          </span>
        )}
        {CFG.pickup.enabled && <span><Icon name="store" small /> Pickup at {CFG.pickup.address.split(',')[0]}</span>}
        {CFG.returnDays != null && <span><Icon name="refresh" small /> {CFG.returnDays}-day returns</span>}
      </div>

      {p.details.length > 0 && (
        <div className="pdp-details-box">
          <h3>Details &amp; specifications</h3>
          <SpecTable rows={p.details} />
        </div>
      )}
    </div>
  );
}
