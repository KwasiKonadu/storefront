import { D, tx } from '../db';
import { wishKey } from '../session';
import { catalog } from './catalog';

export const wishlist = {
  ids: () => [...(D().wishlists[wishKey()] ?? [])],
  list: () => catalog.byIds(wishlist.ids()),
  /** @returns true when the product was added, false when removed */
  toggle(productId: string) {
    let added = false;
    tx((d) => {
      const w = (d.wishlists[wishKey()] ??= []);
      const i = w.indexOf(productId);
      if (i >= 0) w.splice(i, 1);
      else {
        w.push(productId);
        added = true;
      }
    });
    return added;
  },
};
