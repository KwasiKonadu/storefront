import type { PolicySection } from '@/lib/content/policies';

export function PolicyDocument({ sections }: { sections: PolicySection[] }) {
  return (
    <div className="prose" style={{ paddingBottom: 60 }}>
      {sections.map(([heading, body]) => (
        <section key={heading}>
          <h2>{heading}</h2>
          <p>{body}</p>
        </section>
      ))}
    </div>
  );
}
