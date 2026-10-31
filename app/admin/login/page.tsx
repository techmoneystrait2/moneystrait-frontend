'use client';

import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { CoinMark, Wordmark } from '@/components/Brand';
import { api, errorMessage } from '@/lib/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api('/admin/login', Object.fromEntries(new FormData(event.currentTarget)));
      router.push('/admin');
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <main id="content" className="admin-login">
      <div className="card">
        <span className="brand">
          <CoinMark />
          <Wordmark />
        </span>
        <h1>Admin log in</h1>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input id="username" name="username" autoComplete="username" required />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required />
          </div>
          <button className="button" type="submit" disabled={busy}>
            Log in
          </button>
        </form>
      </div>
    </main>
  );
}
