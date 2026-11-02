'use client';

import { useState } from 'react';
import { Icon } from '@/components/atoms';
import { cx } from '@/lib/format';

export function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cx('faq-item', open && 'open')}>
      <button type="button" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {question}
        <Icon name="chevD" />
      </button>
      <div className="faq-a">{answer}</div>
    </div>
  );
}
