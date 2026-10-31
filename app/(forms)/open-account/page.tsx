import type { Metadata } from 'next';
import Link from 'next/link';
import { ROUTES } from '@/content/site';

export const metadata: Metadata = { title: 'Open a business account · Moneystrait', robots: { index: false } };

export default function OpenAccountPage() {
  return (
    <div className="card">
      <p className="eyebrow">Open a business account</p>
      <h1>One application</h1>
      <p className="lead">Create your login, then fill in your application. About 10 minutes in total.</p>
      <Link className="btn wide" href={ROUTES.signup}>
        Create an account
      </Link>
      <Link className="btn outline wide top-space" href={ROUTES.login}>
        Log in
      </Link>
    </div>
  );
}
