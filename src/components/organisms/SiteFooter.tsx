import Link from 'next/link';
import { Brand, Icon } from '@/components/atoms';
import { api } from '@/lib/api';
import { CFG } from '@/lib/config';

export function SiteFooter() {
  const cats = api.catalog.categories();
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="foot-in">
          <div className="foot-brand">
            <Brand />
            {CFG.about && <p>{CFG.about}</p>}
            <div className="foot-contact">
              {CFG.email && <div><Icon name="mail" small /><span>{CFG.email}</span></div>}
              {CFG.phone && <div><Icon name="phone" small /><span>{CFG.phone}</span></div>}
              {(CFG.address || CFG.hours) && (
                <div>
                  <Icon name="pin" small />
                  <span>{CFG.address}{CFG.address && CFG.hours && <br />}{CFG.hours}</span>
                </div>
              )}
            </div>
          </div>
          <div>
            <h4>Shop</h4>
            {cats.map((c) => (
              <Link key={c.id} href={`/shop?category=${c.slug}`}>{c.name}</Link>
            ))}
            <Link href="/shop">All products</Link>
          </div>
          <div>
            <h4>Help</h4>
            <Link href="/faq">Frequently asked questions</Link>
            <Link href="/delivery">Delivery &amp; pickup</Link>
            <Link href="/returns">Returns &amp; refunds</Link>
            <Link href="/contact">Contact us</Link>
            <Link href="/orders">Track an order</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link href="/privacy">Privacy policy</Link>
            <Link href="/terms">Terms &amp; conditions</Link>
            {CFG.socials.map((s) => (
              <a key={s.url} href={s.url} rel="noopener">{s.label}</a>
            ))}
          </div>
        </div>
        <div className="foot-base">
          <span>© {new Date().getFullYear()} {CFG.storeName}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
