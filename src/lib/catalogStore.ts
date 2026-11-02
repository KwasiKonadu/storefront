import { CFG } from './config';
import { fmt } from './format';
import type { Category, Product, PromoSlot, StoreConfig } from './types';

interface PublicPromises {
  freeDeliveryThreshold: number | null;
  deliveryAreas: { id: string; name: string; fee: number | null; eta: string }[];
  returnDays: number | null;
  pickup: { enabled: boolean; address: string; hours: string; note: string };
}

const PLACEHOLDER = '/placeholder.svg';
const OTHER: Category = { id: 'uncategorised', slug: 'other', name: 'Other', description: '', image: '' };

/** The live catalogue. Read synchronously by the api layer; filled by `loadCatalog`. */
export const CATALOG: { categories: Category[]; products: Product[]; slots: PromoSlot[]; loaded: boolean; failed: boolean } = {
  categories: [],
  products: [],
  slots: [],
  loaded: false,
  failed: false,
};

/** Fetch the catalogue from SalesPoint. Never throws: on failure the last good copy is kept. */
export async function loadCatalog(): Promise<void> {
  try {
    const res = await fetch('/api/catalog');
    if (!res.ok) throw new Error(String(res.status));
    const data = (await res.json()) as { categories: Category[]; products: Product[]; slots?: PromoSlot[]; promises?: PublicPromises; store?: Partial<Pick<StoreConfig, 'tagline' | 'about' | 'email' | 'phone' | 'address' | 'hours' | 'socials'>> & { name: string } };
    const products = data.products.map((p) => ({
      ...p,
      images: p.images.length ? p.images : [PLACEHOLDER],
      categoryId: p.categoryId || OTHER.id,
      // A product sold by the pack gets a "Buy as" picker: Single (default) or Pack of N.
      variants: p.pack
        ? [
            {
              name: 'Buy as',
              options: [
                { id: 'single', label: 'Single', priceDelta: 0, unitsPer: 1 },
                { id: 'pack', label: `Pack of ${p.pack.size}`, priceDelta: p.pack.price - p.price, unitsPer: p.pack.size, priceLabel: fmt(p.pack.price) },
              ],
            },
          ]
        : p.variants,
    }));
    const categories: Category[] = [...data.categories];
    if (products.some((p) => p.categoryId === OTHER.id)) categories.push(OTHER);
    CATALOG.categories = categories;
    CATALOG.products = products;
    CATALOG.slots = data.slots ?? [];
    // The shop's name comes from SalesPoint (Settings → Business info).
    const st = data.store;
    CFG.storeName = st?.name ?? '';
    CFG.tagline = st?.tagline ?? '';
    CFG.about = st?.about ?? '';
    CFG.email = st?.email ?? '';
    CFG.phone = st?.phone ?? '';
    CFG.address = st?.address ?? '';
    CFG.hours = st?.hours ?? '';
    CFG.socials = st?.socials ?? [];
    // Promises: anything SalesPoint hasn't switched on stays off.
    const pr = data.promises;
    CFG.freeDeliveryThreshold = pr?.freeDeliveryThreshold ?? null;
    CFG.returnDays = pr?.returnDays ?? null;
    CFG.deliveryAreas = (pr?.deliveryAreas ?? []).map((a) => ({ ...a, eta: a.fee == null ? null : a.eta || null }));
    CFG.pickup = pr?.pickup ?? { enabled: false, address: '', hours: '', note: '' };
    CATALOG.failed = false;
  } catch {
    CATALOG.failed = true;
  }
  CATALOG.loaded = true;
}
