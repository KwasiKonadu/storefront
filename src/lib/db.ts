import { SEED_VERSION, seed } from './seed';
import type { Database } from './types';

const KEY = 'marlow_pine_next_db_v1';
let data: Database | null = null;

/** Load the persisted database (or seed it). Must be called once on the client before any api call. */
let loading: Promise<void> | null = null;
export const loadDb = () => (loading ??= readOrSeed());

async function readOrSeed(): Promise<void> {
  try {
    data = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Database | null;
  } catch {
    data = null;
  }
  if (!data || data.meta?.seedVersion !== SEED_VERSION) {
    data = await seed();
    saveDb();
  }
}

export function D(): Database {
  if (!data) throw new Error('Database not loaded yet');
  return data;
}

const savedListeners: (() => void)[] = [];
/** Run `fn` after every save (the account sync watches the cart and wishlist this way). */
export const onSaved = (fn: () => void) => void savedListeners.push(fn);

export function saveDb() {
  localStorage.setItem(KEY, JSON.stringify(data));
  savedListeners.forEach((fn) => fn());
}

/** Run a mutation and persist it as a single write. */
export function tx<T>(fn: (d: Database) => T): T {
  const out = fn(D());
  saveDb();
  return out;
}
