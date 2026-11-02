import type { Product, VariantOption } from './types';

export const allOptions = (p: Pick<Product, 'variants'>): VariantOption[] => p.variants?.flatMap((g) => g.options) ?? [];

export const findOption = (p: Pick<Product, 'variants'>, variantId: string | null | undefined) =>
  variantId ? allOptions(p).find((o) => o.id === variantId) : undefined;

/** Unit price for a product + selected variant option (variant deltas are added to the base price). */
export const unitPrice = (p: Product, variantId: string | null | undefined) => p.price + (findOption(p, variantId)?.priceDelta ?? 0);

/** Stock units one item of this variant takes (a pack of 12 = 12). */
export const unitsPer = (p: Pick<Product, 'variants'>, variantId: string | null | undefined) => findOption(p, variantId)?.unitsPer ?? 1;

/** How many of this variant can be bought with the stock on hand. */
export const maxQty = (p: Pick<Product, 'variants' | 'stock'>, variantId: string | null | undefined) =>
  Math.floor(p.stock / unitsPer(p, variantId));

export const variantLabel = (p: Product, variantId: string | null | undefined) => findOption(p, variantId)?.label ?? null;

export const discountPct = (p: Pick<Product, 'price' | 'compareAtPrice'>) =>
  p.compareAtPrice ? Math.round(100 - (p.price / p.compareAtPrice) * 100) : 0;

export type StockLevel = 'in' | 'low' | 'out';
export function stockInfo(p: Pick<Product, 'stock'>): { level: StockLevel; label: string } {
  if (p.stock <= 0) return { level: 'out', label: 'Out of stock' };
  if (p.stock <= 5) return { level: 'low', label: `Only ${p.stock} left` };
  return { level: 'in', label: 'In stock' };
}
