'use client';

import { ButtonLink, Eyebrow, Icon } from '@/components/atoms';
import { useReveal } from '@/hooks';

export function PromoBanner() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="promo">
      <div>
        <Eyebrow>The Tableware Edit</Eyebrow>
        <h2>Sets for <em>slow mornings</em> and long dinners.</h2>
        <p>Stoneware, linen and glass — buy as a set and the table sets itself.</p>
      </div>
      <ButtonLink variant="cream" size="lg" href="/shop?category=tableware">
        Shop tableware <Icon name="arrR" small />
      </ButtonLink>
    </section>
  );
}
