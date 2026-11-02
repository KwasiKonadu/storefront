export type OrderStatus =
  | 'pending_confirmation'
  | 'confirmed'
  | 'processing'
  | 'ready_for_pickup'
  | 'out_for_delivery'
  | 'completed'
  | 'cancelled';
export type PaymentStatus = 'pending' | 'paid';
export type Fulfilment = 'delivery' | 'pickup';

/* ---------- configuration ---------- */
export interface DeliveryArea {
  id: string;
  name: string;
  fee: number | null;
  eta: string | null;
}
export interface PaymentMethod {
  id: string;
  label: string;
  note: string;
}
export interface StoreConfig {
  storeName: string;
  tagline: string;
  about: string;
  currency: string;
  locale: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
  pickup: { enabled: boolean; address: string; hours: string; note: string };
  /** Order amount (minor units) that ships free; null = not promised. Set from SalesPoint. */
  freeDeliveryThreshold: number | null;
  /** Days customers have to request a return; null = not promised. Set from SalesPoint. */
  returnDays: number | null;
  announcement: string;
  deliveryAreas: DeliveryArea[];
  paymentMethods: PaymentMethod[];
  socials: { label: string; url: string }[];
}

/* ---------- homepage promotion slots (managed in SalesPoint) ---------- */
export type SlotType = 'hero' | 'product_of_week' | 'collection' | 'announcement';
export interface SlotLink {
  type: 'product' | 'category' | 'sale' | 'url';
  target: string | null;
}
export interface PromoSlot {
  id: string;
  type: SlotType;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonLabel: string;
  link: SlotLink | null;
  productIds: string[];
}

/* ---------- catalogue ---------- */
export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  /** Emoji set in SalesPoint; shown when there is no image. */
  icon?: string;
}
export interface VariantOption {
  id: string;
  label: string;
  priceDelta: number;
  /** Stock units one of this option consumes (a pack of 12 = 12). Defaults to 1. */
  unitsPer?: number;
  /** Display price shown beside the label, when the delta alone would be unclear (packs). */
  priceLabel?: string;
}
export interface VariantGroup {
  name: string;
  options: VariantOption[];
}
export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryId: string;
  price: number;
  compareAtPrice: number | null;
  /** When the running sale ends (ISO); null if not on sale or open-ended. */
  saleEnds?: string | null;
  description: string;
  details: [string, string][];
  variants: VariantGroup[] | null;
  stock: number;
  images: string[];
  featured: boolean;
  isNew: boolean;
  popularity: number;
  published: boolean;
  createdAt: number;
  /** Full pack sold at the wholesale rate (price in minor units). Turned into a variant on load. */
  pack?: { size: number; price: number } | null;
}
export interface ProductWithCategory extends Product {
  category: Category;
}

/* ---------- customers ---------- */
export interface Customer {
  id: string;
  email: string;
  name: string;
  phone: string;
  /** Demo-era fields; real accounts live in SalesPoint and never send these. */
  salt?: string;
  passwordHash?: string;
  createdAt: number;
}
export interface Session {
  token: string;
  customerId: string;
  createdAt: number;
  expiresAt: number;
}
export interface ResetToken {
  token: string;
  customerId: string;
  expiresAt: number;
  used: boolean;
}
export interface Address {
  id: string;
  customerId: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  postal: string;
  areaId: string;
  isDefault: boolean;
}
export type AddressInput = Omit<Address, 'id' | 'customerId'>;

/* ---------- cart / wishlist ---------- */
export interface StoredCartItem {
  productId: string;
  variantId: string | null;
  qty: number;
}
export interface StoredCart {
  items: StoredCartItem[];
  updatedAt?: number;
}
export interface CartLine {
  index: number; // position in the stored cart, used for mutations
  productId: string;
  variantId: string | null;
  qty: number;
  name: string;
  slug: string;
  image: string;
  stock: number;
  unit: number;
  variantLabel: string | null;
  sku: string;
}
export interface CartView {
  items: CartLine[];
  subtotal: number;
  count: number;
}

/* ---------- orders ---------- */
export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  variantLabel: string | null;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  image: string;
  /** Stock units this line takes (qty × units per item); defaults to qty. */
  units?: number;
}
export interface StatusEvent {
  status: OrderStatus;
  at: number;
  note: string | null;
}
export interface OrderContact {
  name: string;
  email: string;
  phone: string;
}
export interface Order {
  id: string;
  ref: string;
  customerId: string;
  createdAt: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  fulfilment: Fulfilment;
  areaId: string | null;
  contact: OrderContact;
  address: Address | null;
  instructions: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  statusHistory: StatusEvent[];
}
export interface ReturnRequest {
  id: string;
  ref: string;
  customerId: string;
  orderId: string;
  items: { productId: string; name: string; qty: number }[];
  reason: string;
  notes: string;
  status: 'requested' | 'approved' | 'rejected' | 'completed';
  /** The store's note to the customer, if any. */
  staffNote?: string;
  createdAt: number;
}
export interface ContactMessage {
  id: string;
  ip: string;
  at: number;
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Database {
  meta: { seedVersion: number; seededAt: number; sampleData: boolean };
  categories: Category[];
  products: Product[];
  customers: Customer[];
  sessions: Session[];
  resetTokens: ResetToken[];
  addresses: Address[];
  carts: Record<string, StoredCart>;
  wishlists: Record<string, string[]>;
  orders: Order[];
  returnRequests: ReturnRequest[];
  contactMessages: ContactMessage[];
  idempotency: Record<string, string>;
}
