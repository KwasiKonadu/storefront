import type { ReactNode } from 'react';
import { TextLink, Icon } from '@/components/atoms';
import { SectionHead } from '@/components/molecules';

/** A home-page band: heading (+ optional "see all" link) and a product list underneath. */
export function ProductSection({
  eyebrow,
  title,
  seeAll,
  children,
}: {
  eyebrow: string;
  title: string;
  seeAll?: { href: string; label: string };
  children: ReactNode;
}) {
  return (
    <section className="section">
      <SectionHead
        eyebrow={eyebrow}
        title={title}
        action={seeAll && <TextLink href={seeAll.href}>{seeAll.label} <Icon name="arrR" small /></TextLink>}
      />
      {children}
    </section>
  );
}
