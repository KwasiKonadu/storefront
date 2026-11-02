'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, Input, Spinner, TextLink } from '@/components/atoms';
import { Alert, FormField, PasswordHints } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';
import { ApiError } from '@/lib/api';
import { CFG } from '@/lib/config';
import { isEmail, isStrongPassword } from '@/lib/validation';

type Field = 'name' | 'email' | 'password' | 'confirm';

export function RegisterForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '';
  const { register } = useStore();
  const { toast } = useUI();
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const bind = (k: Field) => ({
    value: values[k],
    invalid: !!errors[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [k]: e.target.value })),
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const found: Partial<Record<Field, string>> = {
      name: values.name.trim() ? undefined : 'Please enter your name',
      email: isEmail(values.email) ? undefined : 'Enter a valid email',
      password: isStrongPassword(values.password) ? undefined : '8+ chars with a letter and a number',
      confirm: values.confirm === values.password ? undefined : 'Passwords don’t match',
    };
    setErrors(found);
    if (Object.values(found).some(Boolean)) return;

    setBusy(true);
    setFormError('');
    try {
      const { customer, mergeReport: rep } = await register({ name: values.name, email: values.email, password: values.password });
      toast(`Welcome to ${CFG.storeName}, ${customer.name.split(' ')[0]}.`);
      if (rep.merged || rep.wishes) toast(`We brought your guest cart (${rep.merged}) and wishlist (${rep.wishes}) into your account.`);
      router.push(next.startsWith('/') ? next : '/account');
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError && err.field) setErrors({ [err.field === 'password' ? 'password' : err.field]: err.message } as typeof errors);
      else setFormError(err instanceof Error ? err.message : 'Could not create the account.');
    }
  };

  return (
    <div className="auth-form">
      <h1>Create your account</h1>
      <p className="sub">One account for orders, tracking, addresses and your wishlist.</p>
      {formError && <Alert tone="error">{formError}</Alert>}
      <form onSubmit={submit} noValidate>
        <FormField id="r-name" label="Full name" error={errors.name}>
          <Input id="r-name" autoComplete="name" required {...bind('name')} />
        </FormField>
        <FormField id="r-email" label="Email" error={errors.email}>
          <Input id="r-email" type="email" autoComplete="email" required {...bind('email')} />
        </FormField>
        <FormField id="r-pass" label="Password" error={errors.password} note={<PasswordHints value={values.password} />}>
          <Input id="r-pass" type="password" autoComplete="new-password" required {...bind('password')} />
        </FormField>
        <FormField id="r-pass2" label="Confirm password" error={errors.confirm}>
          <Input id="r-pass2" type="password" autoComplete="new-password" required {...bind('confirm')} />
        </FormField>
        <p className="form-note" style={{ margin: '10px 0 16px' }}>Customer accounts only — this store has no self-assigned staff or admin roles.</p>
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? <><Spinner />Creating…</> : 'Create account'}
        </Button>
      </form>
      <p className="auth-alt">Already have an account? <TextLink href="/signin">Sign in</TextLink></p>
    </div>
  );
}
