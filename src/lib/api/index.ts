/**
 * The API seam: validation, auth and business rules live behind this object.
 * Replace the internals of each module with HTTP calls and the entire frontend keeps working against a real backend.
 */
import { addresses } from './addresses';
import { auth } from './auth';
import { cart } from './cart';
import { catalog, products } from './catalog';
import { contact } from './contact';
import { orders } from './orders';
import { returns } from './returns';
import { wishlist } from './wishlist';

export const api = { catalog, products, auth, cart, wishlist, addresses, orders, returns, contact };

export { ApiError } from './errors';
export type { FieldIssue } from './errors';
export type { MergeReport, LoginResult } from './auth';
export type { PlaceOrderInput, ReorderReport } from './orders';
export type { ProductPage, ProductQuery } from './catalog';
