'use client';

import { useState, type FormEvent } from 'react';
import { Button, Input, TextLink } from '@/components/atoms';
import { Alert, FormField } from '@/components/molecules';
import { api } from '@/lib/api';
import { isEmail } from '@/lib/validation';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState<{ email: string; devLink: string | null } | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const addr = email.trim();
    if (!isEmail(addr)) return setError('Enter a valid email');
    setError('');
    const r = await api.auth.requestReset(addr);
    setSent({ email: addr, devLink: r.devLink });
  };

  return (
    <div className="auth-form">
      <h1>Forgot your password?</h1>
      <p className="sub">Enter your email and we’ll set up a secure, single-use reset link valid for one hour.</p>
      {sent ? (
        <>
          <Alert tone="success" style={{ marginTop: 18 }}>
            If an account exists for <b>{sent.email}</b>, a reset link has been set up.
          </Alert>
          {sent.devLink ? (
            <div className="demo-box">
              Emailing isn’t switched on yet, so here is your link:
              <div className="row">
                <TextLink href={sent.devLink} style={{ wordBreak: 'break-all' }}>{sent.devLink}</TextLink>
              </div>
            </div>
          ) : (
            <p className="form-note" style={{ marginTop: 12 }}>
              Emailed resets aren’t available yet. If you can’t get back in, please contact the store and we’ll help you.
            </p>
          )}
        </>
      ) : (
        <form onSubmit={submit} noValidate>
          <FormField id="f-email" label="Email" error={error}>
            <Input id="f-email" type="email" autoComplete="email" required value={email} invalid={!!error} onChange={(e) => setEmail(e.target.value)} />
          </FormField>
          <Button type="submit" size="lg" block>Send reset link</Button>
        </form>
      )}
      <p className="auth-alt"><TextLink href="/signin">Back to sign in</TextLink></p>
    </div>
  );
}
