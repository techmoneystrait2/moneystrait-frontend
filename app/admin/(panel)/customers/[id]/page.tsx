'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ApplicationAnswers } from '@/components/ApplicationAnswers';
import { formatDate } from '@/components/CustomerTable';
import { RfiReview } from '@/components/RfiReview';
import { KeyValues } from '@/components/ui';
import { api, type Customer, errorMessage } from '@/lib/api';
import { type CustomerApplication, STATUS_LABELS, STATUS_TONES } from '@/lib/application';

const ignore = () => undefined;

export default function AdminCustomerPage() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [applications, setApplications] = useState<CustomerApplication[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api<{ customer: Customer; applications: CustomerApplication[] }>(`/admin/customers/${id}`)
      .then((data) => {
        setCustomer(data.customer);
        setApplications(data.applications);
      })
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  return (
    <>
      <p className="back-link">
        <Link href="/admin/customers">← All customers</Link>
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {customer && (
        <>
          <h1>{customer.name}</h1>
          <p className="admin-lead">{customer.email}</p>
          <article className="box">
            <KeyValues
              rows={[
                ['Name', customer.name],
                ['Email', customer.email],
                ['Signs in with', customer.signIn],
                ['Joined', formatDate(customer.createdAt)],
                ['Last updated', formatDate(customer.updatedAt)],
                ['Customer ID', customer.id],
                ['Applications sent', applications.length],
              ]}
            />
          </article>

          <h2 className="admin-section-title">Application forms</h2>
          {applications.length === 0 && <p className="admin-empty">This customer hasn’t sent an application.</p>}
          {applications.map((application) => (
            <section className="customer-application" key={application.id}>
              <article className="box">
                <div className="admin-head">
                  <div>
                    <h3>{application.company}</h3>
                    <span className={`pill ${STATUS_TONES[application.status]}`}>{STATUS_LABELS[application.status]}</span>
                  </div>
                  <Link href={`/admin/applications/${application.id}`}>{application.status === 'in_review' ? 'Review' : 'Open application'}</Link>
                </div>
                <p className="muted">Submitted {formatDate(application.submittedAt)}</p>
                <ApplicationAnswers answers={application.answers} />
              </article>
              <RfiReview rfis={application.rfis} busy={false} canEdit={false} onDecide={ignore} onDelete={ignore} />
            </section>
          ))}
        </>
      )}
    </>
  );
}
