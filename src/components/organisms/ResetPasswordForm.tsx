'use client';

import { useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, ButtonLink, Input, TextLink } from '@/components/atoms';
import { Alert, FormField } from '@/components/molecules';
import { ApiError, api } from '@/lib/api';

export function ResetPasswordForm() {
  const token = useSearchParams().get('token') ?? '';
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [fieldErr, setFieldErr] = useState<{ p1?: string; p2?: string }>({});
  const [outcome, setOutcome] = useState<{ ok: true } | { ok: false; message: string } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (p1 !== p2) return setFieldErr({ p2: 'Passwords don’t match' });
    setFieldErr({});
    try {
      await api.auth.resetPassword(token, p1);
      setOutcome({ ok: true });
    } catch (err) {
      if (err instanceof ApiError && err.field) setFieldErr({ p1: err.message });
      else setOutcome({ ok: false, message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  };

  if (outcome?.ok)
    return (
      <div className="auth-form">
        <h1>Password updated</h1>
        <Alert tone="success" style={{ marginTop: 18 }}>Your password has been changed and old sessions were signed out.</Alert>
        <ButtonLink size="lg" block href="/signin">Sign in with your new password</ButtonLink>
      </div>
    );
  if (outcome && !outcome.ok)
    return (
      <div className="auth-form">
        <h1>Link no longer valid</h1>
        <Alert tone="error" style={{ marginTop: 18 }}>{outcome.message}</Alert>
        <ButtonLink href="/forgot">Request a new link</ButtonLink>
      </div>
    );

  return (
    <div className="auth-form">
      <h1>Set a new password</h1>
      <p className="sub">Choose something at least 8 characters long with a letter and a number.</p>
      <form onSubmit={submit} noValidate>
        <FormField id="n-pass" label="New password" error={fieldErr.p1}>
          <Input id="n-pass" type="password" autoComplete="new-password" required value={p1} invalid={!!fieldErr.p1} onChange={(e) => setP1(e.target.value)} />
        </FormField>
        <FormField id="n-pass2" label="Confirm new password" error={fieldErr.p2}>
          <Input id="n-pass2" type="password" autoComplete="new-password" required value={p2} invalid={!!fieldErr.p2} onChange={(e) => setP2(e.target.value)} />
        </FormField>
        <Button type="submit" size="lg" block>Reset password</Button>
      </form>
      <p className="auth-alt"><TextLink href="/signin">Back to sign in</TextLink></p>
    </div>
  );
}
