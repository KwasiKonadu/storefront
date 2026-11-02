import type { OrderStatus, StoreConfig } from './types';

/** Store configuration — edit here (or swap for a backend-provided config). Nothing is hardcoded in components. */
export const CFG: StoreConfig = {
  storeName: '', // filled from SalesPoint's business name
  // Store details are managed in SalesPoint (Website → Store details) and filled from the catalogue.
  tagline: '',
  about: '',
  currency: 'GHS',
  locale: 'en-GH',
  email: '',
  phone: '',
  address: '',
  hours: '',
  // Delivery, free delivery, returns and pickup are promises managed in SalesPoint
  // (Website → Promises). They start off here and are filled in from the catalogue.
  pickup: { enabled: false, address: '', hours: '', note: '' },
  freeDeliveryThreshold: null,
  returnDays: null,
  announcement: '',
  deliveryAreas: [],
  paymentMethods: [
    {
      id: 'on_delivery',
      label: 'Pay at pickup',
      note: 'Pay in the shop when you collect your order.',
    },
  ],
  socials: [], // add e.g. {label:'Instagram', url:'…'} to render footer links
};

export const ORDER_STATUSES: Record<OrderStatus, string> = {
  pending_confirmation: 'Pending confirmation',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready_for_pickup: 'Ready for pickup',
  out_for_delivery: 'Out for delivery',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const DELIVERY_FLOW: OrderStatus[] = ['pending_confirmation', 'confirmed', 'processing', 'out_for_delivery', 'completed'];
export const PICKUP_FLOW: OrderStatus[] = ['pending_confirmation', 'confirmed', 'processing', 'ready_for_pickup', 'completed'];
export const CANCELLABLE: OrderStatus[] = ['pending_confirmation', 'confirmed'];
export const IN_PROGRESS: OrderStatus[] = ['pending_confirmation', 'confirmed', 'processing', 'ready_for_pickup', 'out_for_delivery'];

export const deliverableAreas = () => CFG.deliveryAreas.filter((a) => a.fee != null);
export const areaById = (id: string | null | undefined) => CFG.deliveryAreas.find((a) => a.id === id);
export const lowestDeliveryFee = (): number | null => {
  const fees = deliverableAreas().map((a) => a.fee as number);
  return fees.length ? Math.min(...fees) : null;
};
/** Does an order of this size get free delivery? False when free delivery isn't promised. */
export const qualifiesForFreeDelivery = (subtotal: number) => CFG.freeDeliveryThreshold != null && subtotal >= CFG.freeDeliveryThreshold;
/** Area to preselect at checkout: the first one we deliver to. */
export const defaultAreaId = () => deliverableAreas()[0]?.id ?? '';
/** Can customers place an order at all (delivery somewhere, or pickup)? */
export const canFulfil = () => deliverableAreas().length > 0 || CFG.pickup.enabled;
