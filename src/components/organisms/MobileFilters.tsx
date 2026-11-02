'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Checkbox } from '@/components/atoms';
import { ModalBody, ModalFooter } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import { useShopQuery } from '@/hooks';
import { api } from '@/lib/api';

/** Modal content for the small-screen "Filters" button. */
export function MobileFilters() {
  const { closeModal } = useUI();
  const router = useRouter();
  const { query, href } = useShopQuery();
  return (
    <>
      <ModalBody>
        <div className="f-list">
          {api.catalog.categories().map((c) => (
            <Link
              key={c.id}
              href={href({ category: c.slug, page: '' })}
              onClick={closeModal}
              style={{ padding: '10px 6px', display: 'block', borderBottom: '1px solid var(--line)', fontWeight: query.category === c.slug ? 700 : 500 }}
            >
              {c.name}
            </Link>
          ))}
        </div>
        <Checkbox
          labelClassName="f-check"
          checked={!!query.inStock}
          onChange={(e) => router.push(href({ inStock: e.target.checked ? '1' : '', page: '' }))}
        >
          In stock only
        </Checkbox>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={() => { closeModal(); router.push('/shop'); }}>Reset</Button>
        <Button onClick={closeModal}>Done</Button>
      </ModalFooter>
    </>
  );
}
