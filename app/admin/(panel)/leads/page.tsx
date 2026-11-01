'use client';

import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { formatDate } from '@/components/CustomerTable';
import { api, errorMessage } from '@/lib/api';
import { type Lead, leadSender } from '@/lib/leads';

interface LeadPage {
  leads: Lead[];
  page: number;
  pages: number;
  total: number;
}

type Filter = '' | 'customer' | 'visitor';

const FILTERS: { value: Filter; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'customer', label: 'Has an account' },
  { value: 'visitor', label: 'Visitors' },
];

export default function AdminLeadsPage() {
  const [filter, setFilter] = useState<Filter>('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeadPage | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    api<LeadPage>(`/admin/leads?${new URLSearchParams({ submittedBy: filter, page: String(page) })}`)
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, [filter, page]);

  useEffect(load, [load]);

  async function deleteLead(lead: Lead) {
    if (!window.confirm(`Delete the form from ${lead.name} (${lead.company})? This can’t be undone.`)) return;
    setError('');
    try {
      await api(`/admin/leads/${lead.id}`, undefined, 'DELETE');
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <h1>Leads</h1>
      <p className="admin-lead">{data ? `${data.total.toLocaleString('en-GB')} ${data.total === 1 ? 'form' : 'forms'} from Talk to us` : ' '}</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="tabs" role="group" aria-label="Filter by sender">
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

      {data && data.leads.length === 0 && <p className="admin-empty">No forms here.</p>}
      {data && data.leads.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Company</th>
                <th scope="col">Sent by</th>
                <th scope="col">How to talk</th>
                <th scope="col">Submitted</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => {
                const sender = leadSender(lead);
                return (
                  <tr key={lead.id}>
                    <td data-label="Name" className="wrap">
                      <strong>{lead.name}</strong>
                      <small className="block muted">{lead.email}</small>
                    </td>
                    <td data-label="Company" className="wrap">
                      {lead.company}
                      <small className="block muted">{lead.registeredIn}</small>
                    </td>
                    <td data-label="Sent by">
                      <span className={`pill ${sender.tone}`}>{sender.label}</span>
                      {lead.desk && <small className="block rfi-flag">Desk</small>}
                    </td>
                    <td data-label="How to talk">{lead.channel}</td>
                    <td data-label="Submitted">{formatDate(lead.submittedAt)}</td>
                    <td data-label="Actions">
                      <div className="row-actions">
                        <Link className="admin-logout" href={`/admin/leads/${lead.id}`} aria-label={`View the form from ${lead.name}`}>
                          <Eye size={15} aria-hidden="true" /> View
                        </Link>
                        <button className="danger-button" type="button" aria-label={`Delete the form from ${lead.name}`} onClick={() => deleteLead(lead)}>
                          <Trash2 size={15} aria-hidden="true" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
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
