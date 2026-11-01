'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { CoinMark, Wordmark } from '@/components/Brand';
import { api, errorMessage, type User } from '@/lib/api';

const PASSWORD_SAVED = 'Your password has been changed. Any other devices have been logged out.';

export default function AccountSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [profileMessage, setProfileMessage] = useState({ text: '', ok: false });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', ok: false });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((data) => {
        setUser(data.user);
        setName(data.user.name);
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  async function logOut() {
    await api('/auth/logout', {});
    router.replace('/login');
  }

  async function saveName(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setProfileMessage({ text: '', ok: false });
    try {
      const data = await api<{ user: User }>('/auth/profile', { name }, 'PATCH');
      setUser({ ...user, ...data.user });
      setName(data.user.name);
      setProfileMessage({ text: 'Your display name has been updated.', ok: true });
    } catch (err) {
      setProfileMessage({ text: errorMessage(err), ok: false });
    }
    setBusy(false);
  }

  async function savePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get('password') !== values.get('confirm')) {
      setPasswordMessage({ text: 'The two new passwords don’t match.', ok: false });
      return;
    }
    setBusy(true);
    setPasswordMessage({ text: '', ok: false });
    try {
      await api('/auth/password', { currentPassword: values.get('currentPassword'), password: values.get('password') });
      form.reset();
      setPasswordMessage({ text: PASSWORD_SAVED, ok: true });
    } catch (err) {
      setPasswordMessage({ text: errorMessage(err), ok: false });
    }
    setBusy(false);
  }

  if (!user) return null;

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Moneystrait home">
            <CoinMark />
            <Wordmark />
          </Link>
          <div className="header-actions">
            <span className="account-name">{user.name}</span>
            <button className="admin-logout" type="button" onClick={logOut}>
              <LogOut size={16} aria-hidden="true" /> Log out
            </button>
          </div>
        </div>
      </header>

      <main id="content" className="main">
        <div className="status-page">
          <p className="back-link">
            <Link href="/account">← Back to your account</Link>
          </p>
          <h1 className="settings-title">Settings</h1>

          <form className="box" onSubmit={saveName}>
            <h2 className="settings-heading">Your details</h2>
            {profileMessage.text && (
              <p className={profileMessage.ok ? 'success' : 'error'} role="status">
                {profileMessage.text}
              </p>
            )}
            <div className="field">
              <label htmlFor="name">Display name</label>
              <input
                id="name"
                autoComplete="name"
                required
                minLength={2}
                maxLength={100}
                pattern=".*\S.*"
                title="Enter your name."
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" value={user.email} readOnly disabled aria-describedby="email-hint" />
              <p className="hint" id="email-hint">
                Your email can’t be changed.
              </p>
            </div>
            <button className="btn" type="submit" disabled={busy}>
              Save name
            </button>
          </form>

          <section className="box" aria-labelledby="password-heading">
            <h2 className="settings-heading" id="password-heading">
              Password
            </h2>
            {user.hasPassword ? (
              <form onSubmit={savePassword}>
                {passwordMessage.text && (
                  <p className={passwordMessage.ok ? 'success' : 'error'} role="status">
                    {passwordMessage.text}
                  </p>
                )}
                <div className="field">
                  <label htmlFor="currentPassword">Current password</label>
                  <input id="currentPassword" name="currentPassword" type="password" autoComplete="current-password" required />
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
                <button className="btn" type="submit" disabled={busy}>
                  Change password
                </button>
              </form>
            ) : (
              <p>
                You sign in with Google, so you don’t have a password here. To add one, use <Link href="/forgot-password">Forgot password</Link>, and we’ll email you a code.
              </p>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
