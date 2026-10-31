'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import { ROUTES } from '@/content/site';

type Stage = 'email' | 'code' | 'done';

const RESEND_WAIT_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (stage !== 'code') return;
    const timer = setInterval(() => setSecondsLeft((left) => Math.max(0, left - 1)), 1000);
    return () => clearInterval(timer);
  }, [stage]);

  async function sendCode() {
    setBusy(true);
    setError('');
    try {
      const { minutes } = await api<{ minutes: number }>('/auth/forgot-password', { email });
      setTotalSeconds(minutes * 60);
      setSecondsLeft(minutes * 60);
      setStage('code');
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  function handleEmail(event: FormEvent) {
    event.preventDefault();
    void sendCode();
  }

  async function handleReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (values.get('password') !== values.get('confirm')) {
      setError('The two passwords don’t match.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api('/auth/reset-password', { email, code: values.get('code'), password: values.get('password') });
      setStage('done');
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = String(secondsLeft % 60).padStart(2, '0');
  const canResend = totalSeconds - secondsLeft >= RESEND_WAIT_SECONDS;

  return (
    <div className="card">
      {stage === 'done' ? (
        <>
          <h1>Password changed</h1>
          <p className="lead">You can now log in with your new password. Any other devices have been logged out.</p>
          <Link className="btn wide" href={ROUTES.login}>
            Log in
          </Link>
        </>
      ) : (
        <>
          <h1>Reset your password</h1>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}

          {stage === 'email' && (
            <>
              <p className="lead">Enter your email and we’ll send you a 6-digit code.</p>
              <form onSubmit={handleEmail}>
                <div className="field">
                  <label htmlFor="email">Work email</label>
                  <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
                </div>
                <button className="button" type="submit" disabled={busy}>
                  Send code
                </button>
              </form>
            </>
          )}

          {stage === 'code' && (
            <>
              <p className="lead">If {email} has an account, we’ve sent a code to it. Check your spam folder too.</p>
              <p className={`code-timer ${secondsLeft === 0 ? 'off' : ''}`} role="status">
                {secondsLeft > 0 ? `The code expires in ${minutes}:${seconds}` : 'This code has expired. Ask for a new one.'}
              </p>
              <form onSubmit={handleReset}>
                <div className="field">
                  <label htmlFor="code">6-digit code</label>
                  <input id="code" name="code" inputMode="numeric" autoComplete="one-time-code" required pattern="\d{6}" maxLength={6} title="Enter the 6 digits from the email." />
                </div>
                <div className="field">
                  <label htmlFor="password">New password</label>
                  <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} aria-describedby="password-hint" />
                  <p className="hint" id="password-hint">
                    At least 8 characters.
                  </p>
                </div>
                <div className="field">
                  <label htmlFor="confirm">Repeat new password</label>
                  <input id="confirm" name="confirm" type="password" autoComplete="new-password" required minLength={8} />
                </div>
                <button className="button" type="submit" disabled={busy || secondsLeft === 0}>
                  Change password
                </button>
              </form>
              <button className="button secondary" type="button" disabled={busy || !canResend} onClick={() => void sendCode()}>
                {canResend ? 'Send a new code' : `Send a new code in ${RESEND_WAIT_SECONDS - (totalSeconds - secondsLeft)}s`}
              </button>
            </>
          )}

          <p className="switch">
            Remembered it? <Link href={ROUTES.login}>Log in</Link>
          </p>
        </>
      )}
    </div>
  );
}
