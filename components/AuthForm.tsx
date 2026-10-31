'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { GoogleButton } from '@/components/GoogleButton';
import { api, errorMessage } from '@/lib/api';

const COPY = {
  login: {
    heading: 'Log in',
    lead: 'Welcome back.',
    submit: 'Log in',
    google: 'signin_with',
    switchText: 'New to Moneystrait?',
    switchLabel: 'Create an account',
    switchHref: '/signup',
  },
  signup: {
    heading: 'Create your account',
    lead: 'For registered businesses.',
    submit: 'Create account',
    google: 'signup_with',
    switchText: 'Already a customer?',
    switchLabel: 'Log in',
    switchHref: '/login',
  },
} as const;

export function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const copy = COPY[mode];
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');

  async function send(path: string, body: object) {
    setBusy(true);
    setError('');
    try {
      await api(path, body);
      router.push('/account');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    void send(`/auth/${mode}`, Object.fromEntries(form));
  }

  return (
    <div className="card">
      <h1>{copy.heading}</h1>
      <p className="lead">{copy.lead}</p>

      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        {mode === 'signup' && (
          <div className="field">
            <label htmlFor="name">Full name</label>
            <input id="name" name="name" autoComplete="name" required minLength={2} maxLength={100} />
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Work email</label>
          <input id="email" name="email" type="email" autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            required
            minLength={mode === 'signup' ? 8 : undefined}
            aria-describedby={mode === 'signup' ? 'password-hint' : undefined}
          />
          {mode === 'signup' && (
            <p className="hint" id="password-hint">
              At least 8 characters.
            </p>
          )}
        </div>
        {mode === 'login' && (
          <Link className="forgot-link" href="/forgot-password">
            Forgot password?
          </Link>
        )}
        <button className="button" type="submit" disabled={busy}>
          {copy.submit}
        </button>
      </form>

      <div className="divider">or</div>
      <GoogleButton
        text={copy.google}
        onCredential={(credential) => void send('/auth/google', { credential })}
      />
      {mode === 'login' && (
        <button className="button secondary" type="button" onClick={() => setNotice('Passkey sign-in is currently unavailable.')}>
          Log in with a passkey
        </button>
      )}
      {notice && (
        <p className="unavailable" role="status">
          {notice}
        </p>
      )}

      <p className="switch">
        {copy.switchText} <Link href={copy.switchHref}>{copy.switchLabel}</Link>
      </p>
    </div>
  );
}
