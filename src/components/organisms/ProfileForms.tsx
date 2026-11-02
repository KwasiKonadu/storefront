'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { ApiError, api } from '@/lib/api';
import type { Customer } from '@/lib/types';

export function ContactInfoForm({ user }: { user: Customer }) {
  const { refresh } = useStore();
  const { toast } = useUI();
  const [values, setValues] = useState({ name: user.name, email: user.email, phone: user.phone || '' });
  const [errors, setErrors] = useState<Partial<Record<'name' | 'email', string>>>({});
  const bind = (k: keyof typeof values) => ({ value: values[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value })) });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api.auth.updateProfile(values);
      setErrors({});
      refresh();
      toast('Profile updated.');
    } catch (err) {
      if (err instanceof ApiError && (err.field === 'name' || err.field === 'email')) setErrors({ [err.field]: err.message });
      else toast(err instanceof Error ? err.message : 'Could not save.', { type: 'warn' });
    }
  };

  return (
    <div className="panel">
      <h2>Contact information</h2>
      <p className="panel-sub">Your name and how we reach you about orders.</p>
      <form onSubmit={submit} noValidate>
        <FormField id="p-name" label="Full name" error={errors.name}>
          <Input id="p-name" autoComplete="name" invalid={!!errors.name} {...bind('name')} />
        </FormField>
        <div className="info-grid">
          <FormField id="p-email" label="Email" error={errors.email}>
            <Input id="p-email" type="email" autoComplete="email" invalid={!!errors.email} {...bind('email')} />
          </FormField>
          <FormField id="p-phone" label="Phone" optional>
            <Input id="p-phone" type="tel" autoComplete="tel" {...bind('phone')} />
          </FormField>
        </div>
        <Button type="submit">Save changes</Button>
      </form>
    </div>
  );
}

export function ChangePasswordForm() {
  const { toast } = useUI();
  const empty = { current: '', next: '', confirm: '' };
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof typeof empty, string>>>({});
  const bind = (k: keyof typeof empty) => ({ value: values[k], invalid: !!errors[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value })) });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (values.next !== values.confirm) return setErrors({ confirm: 'Passwords don’t match' });
    try {
      await api.auth.changePassword({ current: values.current, next: values.next });
      setErrors({});
      setValues(empty);
      toast('Password updated.');
    } catch (err) {
      if (err instanceof ApiError && (err.field === 'current' || err.field === 'next')) setErrors({ [err.field]: err.message });
      else toast(err instanceof Error ? err.message : 'Could not update.', { type: 'warn' });
    }
  };

  return (
    <div className="panel">
      <h2>Change password</h2>
      <p className="panel-sub">Changing your password signs you out of other devices.</p>
      <form onSubmit={submit} noValidate>
        <FormField id="pw-cur" label="Current password" error={errors.current}>
          <Input id="pw-cur" type="password" autoComplete="current-password" {...bind('current')} />
        </FormField>
        <div className="info-grid">
          <FormField id="pw-new" label="New password" error={errors.next}>
            <Input id="pw-new" type="password" autoComplete="new-password" {...bind('next')} />
          </FormField>
          <FormField id="pw-new2" label="Confirm new password" error={errors.confirm}>
            <Input id="pw-new2" type="password" autoComplete="new-password" {...bind('confirm')} />
          </FormField>
        </div>
        <Button type="submit" variant="outline">Update password</Button>
      </form>
    </div>
  );
}
