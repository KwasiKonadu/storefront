'use client';

import { Button, Icon } from '@/components/atoms';
import { ModalBody, ModalFooter } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import type { ReorderReport as Report } from '@/lib/api';

const List = ({ items }: { items: (string | { name: string; reason: string })[] }) =>
  items.length ? (
    <ul>
      {items.map((x, i) => (
        <li key={i}>{typeof x === 'string' ? x : `${x.name} — ${x.reason}`}</li>
      ))}
    </ul>
  ) : (
    <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nothing.</p>
  );

/** Modal content summarising what a reorder added, adjusted or skipped. */
export function ReorderReport({ report }: { report: Report }) {
  const { closeModal, openCart } = useUI();
  return (
    <>
      <ModalBody>
        <div className="reorder-report">
          <div>
            <h4><Icon name="checkC" small /> Added at current prices ({report.added.length})</h4>
            <List items={report.added} />
          </div>
          {report.adjusted.length > 0 && (
            <div>
              <h4 className="bad"><Icon name="alert" small /> Adjusted</h4>
              <List items={report.adjusted} />
            </div>
          )}
          {report.unavailable.length > 0 && (
            <div>
              <h4 className="bad"><Icon name="alert" small /> Unavailable / discontinued</h4>
              <List items={report.unavailable} />
            </div>
          )}
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Review your cart before checking out — nothing was ordered automatically.</p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="outline" onClick={closeModal}>Keep shopping</Button>
        <Button onClick={() => { closeModal(); openCart(); }}>Review cart</Button>
      </ModalFooter>
    </>
  );
}
