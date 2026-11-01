'use client';

import { Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/components/CustomerTable';
import { KeyValues } from '@/components/ui';
import { api, errorMessage } from '@/lib/api';
import { type Lead, leadSender } from '@/lib/leads';

export default function AdminLeadPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ lead: Lead }>(`/admin/leads/${id}`)
      .then((data) => setLead(data.lead))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function deleteLead() {
    if (!lead || !window.confirm(`Delete the form from ${lead.name} (${lead.company})? This can’t be undone.`)) return;
    setError('');
    try {
      await api(`/admin/leads/${lead.id}`, undefined, 'DELETE');
      router.replace('/admin/leads');
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const sender = lead && leadSender(lead);

  return (
    <>
      <p className="back-link">
        <Link href="/admin/leads">← All leads</Link>
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {lead && sender && (
        <>
          <div className="admin-head review-head">
            <div>
              <h1>{lead.company}</h1>
              <span className={`pill ${sender.tone}`}>{sender.label}</span>
            </div>
            <div className="actions">
              <button className="btn outline danger" type="button" onClick={deleteLead}>
                <Trash2 size={16} aria-hidden="true" /> Delete form
              </button>
            </div>
          </div>

          <div className="portal-grid review-grid">
            <div>
              <article className="box">
                <h3>About them</h3>
                <KeyValues
                  rows={[
                    ['Full name', lead.name],
                    ['Role', lead.role],
                    ['Work email', lead.email],
                    ['Phone or WhatsApp', lead.phone],
                  ]}
                />
              </article>
              <article className="box">
                <h3>Their company</h3>
                <KeyValues
                  rows={[
                    ['Company name', lead.company],
                    ['Registered in', lead.registeredIn],
                    ['Website or social page', lead.website],
                    ['What the company does', lead.business],
                  ]}
                />
              </article>
              <article className="box">
                <h3>Their payments</h3>
                <KeyValues
                  rows={[
                    ['Will use Moneystrait for', lead.uses.join(', ')],
                    ['Each month, about', lead.monthlyTotal],
                    ['Pays today', lead.payToday],
                  ]}
                />
              </article>
            </div>
            <aside className="side-panel">
              <article className="box">
                <h3>Who sent this</h3>
                <KeyValues
                  rows={[
                    ['Sent by', sender.label],
                    ...(lead.customer
                      ? ([
                          ['Account name', <Link key="customer" href={`/admin/customers/${lead.customer.id}`}>{lead.customer.name}</Link>],
                          ['Account email', lead.customer.email],
                        ] as [string, React.ReactNode][])
                      : []),
                    ['Sent from', lead.source === 'app' ? 'Mobile app' : 'Website'],
                    ['Submitted', formatDate(lead.submittedAt)],
                  ]}
                />
              </article>
              <article className="box">
                <h3>How to talk</h3>
                <KeyValues
                  rows={[
                    ['Channel', lead.channel],
                    ...(lead.telegram ? ([['Telegram username', lead.telegram]] as [string, string][]) : []),
                  ]}
                />
              </article>
              {(lead.desk || lead.freeEmail) && (
                <article className="box">
                  <h3>Flags</h3>
                  <KeyValues
                    rows={[
                      ...(lead.desk ? ([['Desk', 'Large deal or volume']] as [string, string][]) : []),
                      ...(lead.freeEmail ? ([['Free email', 'Not a company address']] as [string, string][]) : []),
                    ]}
                  />
                </article>
              )}
            </aside>
          </div>
        </>
      )}
    </>
  );
}
