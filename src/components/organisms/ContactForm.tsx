'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input, Select, Textarea } from '@/components/atoms';
import { Alert, FormField } from '@/components/molecules';
import { useUI } from '@/context/UIContext';
import { ApiError, api } from '@/lib/api';

const SUBJECTS = ['General enquiry', 'Order question', 'Delivery & pickup', 'Returns', 'Wholesale'];
type Field = 'name' | 'email' | 'phone' | 'message';

export function ContactForm() {
  const { toast } = useUI();
  const [values, setValues] = useState({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '', company: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const bind = (k: Field) => ({ value: values[k], invalid: !!errors[k], onChange: (e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => setValues((v) => ({ ...v, [k]: e.target.value })) });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setErrors({});
    try {
      await api.contact.send(values);
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.field) setErrors({ [err.field]: err.message });
      else toast(err instanceof Error ? err.message : 'Could not send.', { type: 'warn' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel" style={{ marginBottom: 0 }}>
      <h2>Send a message</h2>
      {sent ? (
        <Alert tone="success"><b>Message sent.</b> We’ll get back to you using the details you gave.</Alert>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="info-grid">
            <FormField id="ct-name" label="Name" error={errors.name}><Input id="ct-name" autoComplete="name" {...bind('name')} /></FormField>
            <FormField id="ct-email" label="Email" error={errors.email}><Input id="ct-email" type="email" autoComplete="email" {...bind('email')} /></FormField>
          </div>
          <FormField id="ct-phone" label="Phone" optional error={errors.phone}><Input id="ct-phone" type="tel" autoComplete="tel" {...bind('phone')} /></FormField>
          <FormField id="ct-subject" label="Subject">
            <Select id="ct-subject" value={values.subject} onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}>
              {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
            </Select>
          </FormField>
          <FormField id="ct-msg" label="Message" error={errors.message}>
            <Textarea id="ct-msg" maxLength={2000} placeholder="How can we help?" {...bind('message')} />
          </FormField>
          <div className="hp-field" aria-hidden="true">
            <label>Company<input tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => setValues((v) => ({ ...v, company: e.target.value }))} /></label>
          </div>
          <Button type="submit" size="lg" disabled={busy}>{busy ? 'Sending…' : 'Send message'}</Button>
        </form>
      )}
    </div>
  );
}
