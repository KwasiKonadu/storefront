import { CFG, deliverableAreas } from '../config';

export type FaqTopic = [topic: string, items: [question: string, answer: string][]];

/** A function, not a constant: delivery and pickup answers follow what the store has set up. */
export const faq = (): FaqTopic[] => {
  const areas = deliverableAreas();
  const delivers = areas.length > 0;
  const topics: FaqTopic[] = [
    [
      'Ordering & payment',
      [
        ['How do I place an order?', 'Add products to your cart, sign in, and complete the short checkout. You’ll receive an order reference straight away — use it any time in My Orders.'],
        ['When do I pay?', 'You pay in the shop when you collect your order. Nothing shows as “paid” until the store has actually received it.'],
        ['Can I order more than is in stock?', 'No — quantities are limited to what is in stock, and checked again when the order is placed.'],
      ],
    ],
  ];

  if (delivers) {
    topics.push([
      'Delivery',
      [
        ['Which areas do you deliver to?', `We deliver to ${areas.map((a) => a.name).join(', ')}. The exact fee for your area is shown at checkout before you commit.`],
        CFG.freeDeliveryThreshold != null
          ? ['Is there free delivery?', 'Yes — orders over the free-delivery amount shown at the top of the site are delivered free to any listed area.']
          : ['Is there free delivery?', 'Delivery fees are shown at checkout before you commit.'],
        ['What if I’m outside your areas?', 'Checkout will tell you before you submit, and pickup is a good alternative.'],
      ],
    ]);
  }

  if (CFG.pickup.enabled) {
    topics.push([
      'Pickup',
      [['How does pickup work?', `Choose pickup at checkout and we’ll prepare your order at the store${CFG.pickup.address ? ` (${CFG.pickup.address})` : ''}. You’ll get a reference to quote at the counter.`]],
    ]);
  }

  topics.push(
    [
      'Returns & cancellations',
      [
        ['Can I cancel an order?', 'Yes, while it is still pending confirmation or confirmed — the Cancel button appears on the order page. After that, contact us and we’ll help.'],
        ['How do returns work?', 'Completed orders can request a return from the order page. A request is reviewed by the store; it is not an automatic refund until approved.'],
      ],
    ],
    [
      'Accounts',
      [
        ['Do I need an account to browse?', 'No — browsing, search, cart and wishlist all work as a guest. Sign-in is required only at checkout.'],
        ['What happens to my guest cart when I sign in?', 'It merges into your account cart — duplicates are combined and anything out of stock is flagged, never silently lost.'],
      ],
    ],
  );
  return topics;
};
