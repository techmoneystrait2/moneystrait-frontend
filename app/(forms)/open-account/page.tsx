import type { Metadata } from 'next';
import Link from 'next/link';
import { Unavailable } from '@/components/ui';
import { ROUTES } from '@/content/site';

export const metadata: Metadata = { title: 'Open a business account · Moneystrait', robots: { index: false } };

export default function OpenAccountPage() {
  return (
    <div className="card">
      <p className="eyebrow">Open a business account</p>
      <h1>Tell us about your company</h1>
      <p className="lead">Accounts open by invitation, after your call with us.</p>
      <Unavailable>The online application is currently unavailable.</Unavailable>
      <Link className="btn wide top-gap" href={ROUTES.rate}>
        Get your rate
      </Link>
    </div>
  );
}
