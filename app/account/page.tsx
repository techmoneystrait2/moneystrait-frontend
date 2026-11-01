'use client';

import { Clock, LogOut, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicationAnswers } from '@/components/ApplicationAnswers';
import { ApplicationForm } from '@/components/ApplicationForm';
import { CoinMark, Wordmark } from '@/components/Brand';
import { CustomerPanel } from '@/components/CustomerPanel';
import { RfiAnswers } from '@/components/RfiAnswers';
import { api, type User } from '@/lib/api';
import { emptyAnswers, type MyApplication, reapplyAnswers } from '@/lib/application';

const REFRESH_MS = 20_000;

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<MyApplication | null | undefined>(undefined);
  const [applyAgain, setApplyAgain] = useState(false);

  const load = useCallback(() => {
    Promise.all([api<{ user: User }>('/auth/me'), api<{ application: MyApplication | null }>('/application')])
      .then(([me, mine]) => {
        setUser(me.user);
        setApplication(mine.application);
      })
      .catch(() => router.replace('/login'));
  }, [router]);

  useEffect(load, [load]);

  // The page follows an admin's decision by itself: approved, rejected, removed or account deleted.
  useEffect(() => {
    const timer = setInterval(load, REFRESH_MS);
    window.addEventListener('focus', load);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', load);
    };
  }, [load]);

  async function logOut() {
    await api('/auth/logout', {});
    router.replace('/login');
  }

  if (!user || application === undefined) return null;

  if (application?.status === 'approved') {
    return <CustomerPanel user={user} answers={application.answers} onLogOut={logOut} />;
  }

  function handleSent() {
    setApplyAgain(false);
    load();
  }

  const showForm = !application || applyAgain;

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
        {showForm && (
          <ApplicationForm
            initial={application ? reapplyAnswers(application.answers) : emptyAnswers(user.name, user.email)}
            onSent={handleSent}
          />
        )}

        {!showForm && application.status === 'in_review' && (
          <div className="status-page">
            <article className="box status-card">
              <span className="status-icon blue">
                <Clock size={24} aria-hidden="true" />
              </span>
              <h1>Your application is in review</h1>
              <p className="lead">Thank you. We’re checking your application. This page will update when it’s approved.</p>
              <span className="pill blue">In review</span>
            </article>
            <RfiAnswers rfis={application.rfis} onSent={load} />
            <article className="box">
              <h2>What you sent us</h2>
              <ApplicationAnswers answers={application.answers} />
            </article>
          </div>
        )}

        {!showForm && application.status === 'rejected' && (
          <div className="status-page">
            <article className="box status-card">
              <span className="status-icon warn">
                <XCircle size={24} aria-hidden="true" />
              </span>
              <h1>Your application was rejected</h1>
              <p className="lead">We can’t open an account for {application.answers.company.legalName} at the moment. You can check your details and apply again.</p>
              <button className="btn" type="button" onClick={() => setApplyAgain(true)}>
                Apply again
              </button>
            </article>
          </div>
        )}
      </main>
    </>
  );
}
