import { CATALOG } from '../catalogStore';
import { delayNet } from './shared';
import { ApiError } from './errors';
import type { Product, ProductWithCategory, PromoSlot } from '../types';

export interface ProductQuery {
  category?: string;
  q?: string;
  sale?: string | boolean;
  inStock?: string | boolean;
  min?: string | number;
  max?: string | number;
  sort?: string;
  page?: number;
  perPage?: number;
}
export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  pages: number;
  per: number;
}

export const catalog = {
  categories: () => CATALOG.categories,
  category: (idOrSlug: string | undefined) => CATALOG.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug),
  /** Live homepage slots, optionally of one type, in display order. */
  slots: (type?: PromoSlot['type']) => CATALOG.slots.filter((s) => !type || s.type === type),
  /** Products a slot features, in the order staff picked them. */
  slotProducts: (s: PromoSlot) =>
    s.productIds.map((id) => CATALOG.products.find((p) => p.id === id)).filter((p): p is Product => !!p && p.published),
  categoryCount: (categoryId: string) => CATALOG.products.filter((p) => p.published && p.categoryId === categoryId).length,
  byIds: (ids: string[]) => ids.map((id) => CATALOG.products.find((p) => p.id === id)).filter((p): p is Product => !!p && p.published),
};

export const products = {
  async list(q: ProductQuery = {}): Promise<ProductPage> {
    await delayNet();
    let items = CATALOG.products.filter((p) => p.published);
    if (q.category) items = items.filter((p) => CATALOG.categories.find((c) => c.slug === q.category)?.id === p.categoryId);
    if (q.q) {
      const t = q.q.toLowerCase();
      items = items.filter((p) => `${p.name} ${p.description} ${p.sku}`.toLowerCase().includes(t));
    }
    if (q.sale) items = items.filter((p) => p.compareAtPrice);
    if (q.inStock) items = items.filter((p) => p.stock > 0);
    if (q.min != null && q.min !== '') items = items.filter((p) => p.price >= Math.round(+q.min! * 100));
    if (q.max != null && q.max !== '') items = items.filter((p) => p.price <= Math.round(+q.max! * 100));
    const sort = q.sort || 'relevance';
    items = [...items].sort((a, b) => {
      if (sort === 'newest') return b.createdAt - a.createdAt;
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'popular') return b.popularity - a.popularity;
      if (q.q) {
        const t = q.q.toLowerCase();
        const rank = (p: Product) => (p.name.toLowerCase().startsWith(t) ? 0 : 1);
        return rank(a) - rank(b) || b.popularity - a.popularity;
      }
      return b.popularity - a.popularity;
    });
    const per = q.perPage || 9;
    const total = items.length;
    const pages = Math.max(1, Math.ceil(total / per));
    const page = Math.min(Math.max(1, +(q.page ?? 1) || 1), pages);
    return { items: items.slice((page - 1) * per, page * per), total, page, pages, per };
  },

  async get(slug: string): Promise<ProductWithCategory> {
    await delayNet();
    const p = CATALOG.products.find((x) => x.slug === slug && x.published);
    if (!p) throw new ApiError('Product not found');
    return { ...p, category: CATALOG.categories.find((c) => c.id === p.categoryId)! };
  },

  related(p: Product): Product[] {
    return CATALOG.products
      .filter((x) => x.published && x.categoryId === p.categoryId && x.id !== p.id)
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 4);
  },

  /** Merchandising lists for the home page. */
  home() {
    const prods = CATALOG.products.filter((p) => p.published);
    const featured = prods.filter((p) => p.featured).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    const fresh = prods.filter((p) => p.isNew).sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);
    const shown = new Set([...featured, ...fresh].map((p) => p.id));
    const best = prods.filter((p) => !shown.has(p.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 4);
    return { featured, fresh, best, hero: featured[0] ?? prods[0], hasAny: prods.length > 0 };
  },
};
