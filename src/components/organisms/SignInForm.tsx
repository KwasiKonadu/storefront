'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { Button, Input, Spinner, TextLink } from '@/components/atoms';
import { Alert, FormField } from '@/components/molecules';
import { useStore } from '@/context/StoreContext';
import { useUI } from '@/context/UIContext';

export function SignInForm() {
  const router = useRouter();
  const next = useSearchParams().get('next') ?? '';
  const { signIn } = useStore();
  const { toast } = useUI();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { customer, mergeReport: rep } = await signIn({ email: email.trim(), password });
      toast(`Welcome back, ${customer.name.split(' ')[0]}.`);
      if (rep.merged || rep.dropped || rep.capped) {
        toast(
          `Guest cart merged: ${rep.merged} item${rep.merged === 1 ? '' : 's'} added${rep.dropped ? `, ${rep.dropped} unavailable removed` : ''}${rep.capped ? ' (some quantities capped by stock)' : ''}.`,
          { type: 'warn' },
        );
      }
      router.push(next.startsWith('/') ? next : '/account');
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : 'Could not sign in.');
    }
  };

  return (
    <div className="auth-form">
      <h1>Welcome back</h1>
      <p className="sub">Sign in to check out faster, track orders and keep a wishlist.</p>
      {error && <Alert tone="error">{error}</Alert>}
      <form onSubmit={submit} noValidate>
        <FormField id="l-email" label="Email">
          <Input id="l-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </FormField>
        <FormField id="l-pass" label="Password">
          <Input id="l-pass" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </FormField>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '-6px 0 16px' }}>
          <TextLink href="/forgot" style={{ fontSize: 13.5 }}>Forgot password?</TextLink>
        </div>
        <Button type="submit" size="lg" block disabled={busy}>
          {busy ? <><Spinner />Signing in…</> : 'Sign in'}
        </Button>
      </form>
      <p className="auth-alt">
        New here? <TextLink href={next ? `/register?next=${encodeURIComponent(next)}` : '/register'}>Create an account</TextLink>
      </p>
    </div>
  );
}
