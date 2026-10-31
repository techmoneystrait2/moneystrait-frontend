'use client';

import { RotateCcw, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { formatDate } from '@/components/CustomerTable';
import { deleteForever, sendBackToReview } from '@/lib/adminApplications';
import { api, errorMessage } from '@/lib/api';
import { type ApplicationStatus, type ApplicationSummary, STATUS_LABELS, STATUS_TONES } from '@/lib/application';

interface ApplicationPage {
  applications: ApplicationSummary[];
  page: number;
  pages: number;
  total: number;
  inReview: number;
}

const FILTERS: { value: ApplicationStatus | ''; label: string }[] = [
  { value: 'in_review', label: 'In review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'removed', label: 'Removed' },
  { value: '', label: 'All' },
];

export default function AdminApplicationsPage() {
  const [filter, setFilter] = useState<ApplicationStatus | ''>('in_review');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ApplicationPage | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api<ApplicationPage>(`/admin/applications?${new URLSearchParams({ status: filter, page: String(page) })}`)
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, [filter, page]);

  useEffect(load, [load]);

  async function run(action: () => Promise<boolean>) {
    setError('');
    try {
      if (await action()) load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <h1>Applications</h1>
      <p className="admin-lead">{data ? `${data.inReview} waiting for review` : ' '}</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="tabs" role="group" aria-label="Filter by status">
        {FILTERS.map((item) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={filter === item.value}
            onClick={() => {
              setFilter(item.value);
              setPage(1);
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {data && data.applications.length === 0 && <p className="admin-empty">No applications here.</p>}
      {data && data.applications.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Customer</th>
                <th scope="col">Country</th>
                <th scope="col">Submitted</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {data.applications.map((application) => (
                <tr key={application.id}>
                  <td data-label="Company" className="wrap">
                    <strong>{application.company}</strong>
                  </td>
                  <td data-label="Customer" className="wrap">
                    {application.customer?.name}
                    <small className="block muted">
                      {application.customer?.email}
                      {application.accountDeleted && ' · account deleted'}
                    </small>
                  </td>
                  <td data-label="Country">{application.country}</td>
                  <td data-label="Submitted">{formatDate(application.submittedAt)}</td>
                  <td data-label="Status">
                    <span className={`pill ${STATUS_TONES[application.status]}`}>{STATUS_LABELS[application.status]}</span>
                  </td>
                  <td data-label="Action">
                    <div className="row-actions">
                      <Link href={`/admin/applications/${application.id}`}>{application.status === 'in_review' ? 'Review' : 'View'}</Link>
                      {application.status === 'removed' && !application.accountDeleted && (
                        <button className="admin-logout" type="button" onClick={() => run(() => sendBackToReview(application))}>
                          <RotateCcw size={15} aria-hidden="true" /> Send to review
                        </button>
                      )}
                      {application.status === 'removed' && (
                        <button className="danger-button" type="button" onClick={() => run(() => deleteForever(application))}>
                          <Trash2 size={15} aria-hidden="true" /> Delete forever
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {data && data.pages > 1 && (
        <div className="pager">
          <button className="btn outline small" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {data.page} of {data.pages}
          </span>
          <button className="btn outline small" type="button" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
