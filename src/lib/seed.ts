import type { Database } from './types';

/** Bump to reset every browser's saved local data (cart, wishlist, caches) on next load. */
export const SEED_VERSION = 2;

/** Empty local database. Products, accounts and orders all come from the store (SalesPoint). */
export async function seed(): Promise<Database> {
  return {
    meta: { seedVersion: SEED_VERSION, seededAt: Date.now(), sampleData: false },
    categories: [],
    products: [],
    customers: [],
    sessions: [],
    resetTokens: [],
    addresses: [],
    carts: {},
    wishlists: {},
    orders: [],
    returnRequests: [],
    contactMessages: [],
    idempotency: {},
  };
}
