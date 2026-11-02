'use client';

import { useState, type FormEvent } from 'react';
import { Button, ButtonLink, Icon, Input } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import type { OrderContact } from '@/lib/types';
import { isEmail, isPhone } from '@/lib/validation';

export function CheckoutContactStep({ contact, onNext }: { contact: OrderContact; onNext: (contact: OrderContact) => void }) {
  const [values, setValues] = useState(contact);
  const [errors, setErrors] = useState<Partial<Record<keyof OrderContact, string>>>({});
  const bind = (k: keyof OrderContact) => ({
    value: values[k],
    invalid: !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = {
      name: values.name.trim() ? '' : 'Please enter your name',
      email: isEmail(values.email) ? '' : 'Enter a valid email',
      phone: isPhone(values.phone) ? '' : 'Enter a valid phone number',
    };
    setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    onNext(values);
  };

  return (
    <div className="co-panel">
      <h2>Contact details</h2>
      <form onSubmit={submit} noValidate>
        <FormField id="c-name" label="Full name" error={errors.name}>
          <Input id="c-name" autoComplete="name" {...bind('name')} />
        </FormField>
        <FormField id="c-email" label="Email" error={errors.email} note="Your confirmation and order updates go here.">
          <Input id="c-email" type="email" autoComplete="email" {...bind('email')} />
        </FormField>
        <FormField id="c-phone" label="Phone" error={errors.phone}>
          <Input id="c-phone" type="tel" autoComplete="tel" {...bind('phone')} />
        </FormField>
        <div className="co-actions">
          <ButtonLink variant="outline" href="/cart">Back to cart</ButtonLink>
          <Button type="submit">Continue <Icon name="arrR" small /></Button>
        </div>
      </form>
    </div>
  );
}
