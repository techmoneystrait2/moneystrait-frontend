'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CustomerTable } from '@/components/CustomerTable';
import { useAdmin } from '@/components/AdminShell';
import { Unavailable } from '@/components/ui';
import { UNAVAILABLE_SECTIONS } from '@/content/adminNav';
import { api, type Customer, errorMessage } from '@/lib/api';

interface Overview {
  stats: Record<'customers' | 'newThisWeek' | 'passwordAccounts' | 'googleAccounts' | 'admins' | 'activeSessions', number>;
  recentCustomers: Customer[];
}

const TILES = [
  ['customers', 'Customers'],
  ['newThisWeek', 'New in the last 7 days'],
  ['passwordAccounts', 'Password accounts'],
  ['googleAccounts', 'Google accounts'],
  ['admins', 'Admins'],
  ['activeSessions', 'Active sessions'],
] as const;

export default function AdminOverviewPage() {
  const { admin } = useAdmin();
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<Overview>('/admin/overview')
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  return (
    <>
      <h1>Hello, {admin.username}</h1>
      <p className="admin-lead">Everything happening on Moneystrait, in one place.</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <dl className="stat-grid">
        {TILES.map(([key, label]) => (
          <div className="stat" key={key}>
            <dt>{label}</dt>
            <dd>{data ? data.stats[key].toLocaleString('en-GB') : '—'}</dd>
          </div>
        ))}
      </dl>

      <div className="admin-head">
        <h2>Newest customers</h2>
        <Link href="/admin/customers">See all customers</Link>
      </div>
      {data && <CustomerTable customers={data.recentCustomers} />}

      <h2 className="admin-section-title">Everything else</h2>
      <div className="unavailable-grid">
        {UNAVAILABLE_SECTIONS.map((section) => (
          <Link className="box unavailable-card" href={section.href} key={section.slug}>
            <section.icon size={20} strokeWidth={1.75} aria-hidden="true" />
            <h3>{section.label}</h3>
            <p>{section.text}</p>
            <span className="pill plain">Unavailable</span>
          </Link>
        ))}
      </div>
      <Unavailable>These sections need their own backend, so they are currently unavailable.</Unavailable>
    </>
  );
}
