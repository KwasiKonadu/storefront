import { CFG } from '../config';

export type PolicySection = [heading: string, body: string];

/** Functions, not constants: the store name and email arrive after the catalogue loads. */
export const privacy = (): PolicySection[] => [
  ['What we collect', 'When you browse: nothing personal. When you order: your name, contact details, addresses and order history. Passwords are stored only as salted, iterated hashes — never in readable form.'],
  ['How it’s used', 'Your details are used to fulfil orders, provide support, and show your account area to you alone. Order pages and APIs are scoped per customer: no account can read another’s orders by changing an ID or URL.'],
  ['What we don’t do', 'We don’t sell your data. Contact form messages are kept only as long as needed to help you.'],
  ['Your control', `You can update your profile and addresses at any time, and changing your password signs you out of other devices. Questions: ${CFG.email || 'use the contact page'}.`],
];

export const terms = (): PolicySection[] => [
  ['The store', `These terms govern use of the ${CFG.storeName} website. By placing an order you accept them. The store sells consumer goods for private use; wholesale enquiries go through the contact page.`],
  ['Orders', 'An order is a request. It becomes binding when the store confirms it — until then its status is “pending confirmation” and you can cancel freely. Prices and stock are checked when you place it; if something has changed, your cart is corrected and you are asked to review before the order is created.'],
  ['Prices & payment', `All prices are shown in ${CFG.currency}. Payment methods currently offered: ${CFG.paymentMethods.map((m) => m.label).join(' and ')}. Payment status is recorded separately from order status and is only marked paid after funds are actually received.`],
  ['Delivery & pickup', 'Delivery times and fees depend on the configured areas and are shown before you commit. Risk passes at handover.'],
  ['Liability', 'Nothing here limits your statutory consumer rights. The website is provided carefully but “as is”; to the extent permitted by law the store is not liable for indirect losses arising from its use.'],
];

/** Shown as "Last updated" on policy pages — bump when the text changes. */
export const POLICIES_UPDATED = Date.UTC(2026, 9, 27);
