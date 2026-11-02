import { FaqItem } from '@/components/molecules';
import { faq } from '@/lib/content/faq';

export function FaqList() {
  return (
    <div style={{ paddingBottom: 60 }}>
      {faq().map(([topic, items]) => (
        <div className="faq-group" key={topic}>
          <h2>{topic}</h2>
          {items.map(([q, a]) => (
            <FaqItem key={q} question={q} answer={a} />
          ))}
        </div>
      ))}
    </div>
  );
}
