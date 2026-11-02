import type { SlotLink } from './types';

/** Where a slot's button goes. Returns null when there is nothing to link to. */
export function slotHref(link: SlotLink | null): string | null {
  if (!link) return null;
  switch (link.type) {
    case 'product':
      return link.target ? `/product/${link.target}` : null;
    case 'category':
      return link.target ? `/shop?category=${link.target}` : null;
    case 'sale':
      return '/shop?sale=1';
    case 'url':
      return link.target || null;
  }
}
