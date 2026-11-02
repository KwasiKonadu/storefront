'use client';

import { PageHeading } from '@/components/molecules';
import { ContactForm, ContactInfo } from '@/components/organisms';
import { PageContainer } from '@/components/templates';
import { usePageTitle } from '@/hooks';

export default function ContactPage() {
  usePageTitle('Contact us');
  return (
    <PageContainer>
      <PageHeading title="Contact us" sub="Questions about an order, a product, or anything else — send us a message and we’ll get back to you." />
      <div className="contact-layout">
        <ContactInfo />
        <ContactForm />
      </div>
    </PageContainer>
  );
}
