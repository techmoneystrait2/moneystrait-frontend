'use client';

import { type FormEvent, useState } from 'react';
import { useAdmin } from '@/components/AdminShell';
import { Unavailable } from '@/components/ui';
import { type Admin, api, errorMessage } from '@/lib/api';

export default function AdminCredentialsPage() {
  const { admin, setAdmin } = useAdmin();
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const username = String(values.get('username')).trim().toLowerCase();
    const password = String(values.get('password'));
    if (username === admin.username && !password) {
      setSaved(false);
      setError('Change your username or password first.');
      return;
    }
    setBusy(true);
    setError('');
    setSaved(false);
    try {
      const data = await api<{ admin: Admin }>(
        '/admin/credentials',
        {
          currentPassword: values.get('currentPassword'),
          ...(username !== admin.username && { username }),
          ...(password && { password }),
        },
        'PATCH',
      );
      setAdmin(data.admin);
      setSaved(true);
      form.reset();
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  if (admin.role !== 'superadmin') {
    return (
      <>
        <h1>Login credentials</h1>
        <Unavailable>Only the super admin can change login credentials.</Unavailable>
      </>
    );
  }

  return (
    <>
      <h1>Login credentials</h1>
      <p className="admin-lead">Change your username or password. Any other devices will be logged out.</p>
      <form className="box admin-form narrow" onSubmit={handleSubmit} key={admin.username}>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {saved && (
          <p className="success" role="status">
            Your login credentials have been updated.
          </p>
        )}
        <div className="field">
          <label htmlFor="username">Username</label>
          <input id="username" name="username" defaultValue={admin.username} autoComplete="username" required minLength={3} maxLength={50} />
        </div>
        <div className="field">
          <label htmlFor="password">New password</label>
          <input id="password" name="password" type="password" autoComplete="new-password" minLength={8} aria-describedby="password-hint" />
          <p className="hint" id="password-hint">
            At least 8 characters. Leave empty to keep your password.
          </p>
        </div>
        <div className="field">
          <label htmlFor="currentPassword">Current password</label>
          <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
        </div>
        <button className="btn" type="submit" disabled={busy}>
          Save changes
        </button>
      </form>
    </>
  );
}
