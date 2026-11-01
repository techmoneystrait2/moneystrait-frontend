'use client';

import { Check, MessageSquarePlus, RotateCcw, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { ApplicationAnswers } from '@/components/ApplicationAnswers';
import { formatDate } from '@/components/CustomerTable';
import { RfiReview } from '@/components/RfiReview';
import { KeyValues, Unavailable } from '@/components/ui';
import { deleteForever, sendBackToReview } from '@/lib/adminApplications';
import { api, errorMessage } from '@/lib/api';
import { type AdminRfi, type ApplicationDetail, STATUS_LABELS, STATUS_TONES } from '@/lib/application';

export default function AdminApplicationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const sent = useSearchParams().get('rfi');
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api<{ application: ApplicationDetail }>(`/admin/applications/${id}`)
      .then((data) => setApplication(data.application))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  useEffect(load, [load]);

  async function restore() {
    if (!application) return;
    setBusy(true);
    setError('');
    try {
      if (await sendBackToReview(application)) load();
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  async function erase() {
    if (!application) return;
    setBusy(true);
    setError('');
    try {
      if (await deleteForever(application)) {
        router.replace('/admin/applications');
        return;
      }
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  async function remove() {
    if (!application) return;
    const question = `Remove this application from ${application.company}? The customer goes back to a new, empty form. The record stays under Removed.`;
    if (!window.confirm(question)) return;
    setBusy(true);
    setError('');
    try {
      await api(`/admin/applications/${id}`, undefined, 'DELETE');
    } catch (err) {
      setError(errorMessage(err));
    }
    load();
    setBusy(false);
  }

  async function decideRfi(rfi: AdminRfi, decision: 'accept' | 'reject') {
    const question =
      decision === 'accept'
        ? 'Accept this response?'
        : 'Reject this response? The customer is asked the same question again, without a reason.';
    if (!window.confirm(question)) return;
    setBusy(true);
    setError('');
    try {
      await api(`/admin/applications/${id}/rfis/${rfi.id}/${decision}`, {});
    } catch (err) {
      setError(errorMessage(err));
    }
    load();
    setBusy(false);
  }

  async function deleteRfi(rfi: AdminRfi) {
    const answers = rfi.responses.length > 0 ? ' Their answers are erased too.' : '';
    if (!window.confirm(`Delete this question? The customer will no longer see it.${answers} This can’t be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      await api(`/admin/applications/${id}/rfis/${rfi.id}`, undefined, 'DELETE');
    } catch (err) {
      setError(errorMessage(err));
    }
    load();
    setBusy(false);
  }

  async function decide(action: 'approve' | 'reject') {
    if (!application) return;
    const question =
      action === 'approve'
        ? `Approve ${application.company}? Their customer panel opens straight away.`
        : `Reject ${application.company}? They will be told, without a reason, and can apply again.`;
    if (!window.confirm(question)) return;
    setBusy(true);
    setError('');
    try {
      await api(`/admin/applications/${id}/${action}`, {});
    } catch (err) {
      setError(errorMessage(err));
    }
    load();
    setBusy(false);
  }

  return (
    <>
      <p className="back-link">
        <Link href="/admin/applications">← All applications</Link>
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {sent === 'emailed' && (
        <p className="success" role="status">
          Your question has been sent, and the customer has been emailed.
        </p>
      )}
      {sent === 'not-emailed' && (
        <p className="error" role="status">
          Your question is in the customer’s account, but the email could not be sent. Check the email settings.
        </p>
      )}
      {application && (
        <>
          <div className="admin-head review-head">
            <div>
              <h1>{application.company}</h1>
              <span className={`pill ${STATUS_TONES[application.status]}`}>{STATUS_LABELS[application.status]}</span>
            </div>
            {application.status === 'removed' && (
              <div className="actions">
                {!application.accountDeleted && (
                  <button className="btn" type="button" disabled={busy} onClick={restore}>
                    <RotateCcw size={16} aria-hidden="true" /> Send to review
                  </button>
                )}
                <button className="btn outline danger" type="button" disabled={busy} onClick={erase}>
                  <Trash2 size={16} aria-hidden="true" /> Delete forever
                </button>
              </div>
            )}
            {application.status !== 'removed' && (
              <div className="actions">
                {application.status === 'in_review' && (
                  <>
                    <Link className="btn outline" href={`/admin/applications/${id}/rfi`}>
                      <MessageSquarePlus size={16} aria-hidden="true" /> Request information
                    </Link>
                    <button className="btn" type="button" disabled={busy} onClick={() => decide('approve')}>
                      <Check size={16} aria-hidden="true" /> Approve
                    </button>
                    <button className="btn outline danger" type="button" disabled={busy} onClick={() => decide('reject')}>
                      <X size={16} aria-hidden="true" /> Reject
                    </button>
                  </>
                )}
                <button className="btn outline danger" type="button" disabled={busy} onClick={remove}>
                  <Trash2 size={16} aria-hidden="true" /> Remove application
                </button>
              </div>
            )}
          </div>

          <div className="portal-grid review-grid">
            <div>
              <article className="box">
                <ApplicationAnswers answers={application.answers} />
              </article>
              <RfiReview rfis={application.rfis} busy={busy} canEdit={application.status === 'in_review'} onDecide={decideRfi} onDelete={deleteRfi} />
            </div>
            <aside className="side-panel">
              <article className="box">
                <h3>Customer</h3>
                <KeyValues
                  rows={[
                    ['Name', application.customer?.name],
                    ['Email', application.customer?.email],
                    ['Applications sent', application.attempts],
                    ['Submitted', formatDate(application.submittedAt)],
                    ...(application.reviewedAt
                      ? ([
                          ['Decided', formatDate(application.reviewedAt)],
                          ['Decided by', application.reviewedBy],
                        ] as [string, string][])
                      : []),
                    ...(application.removedAt
                      ? ([
                          ['Removed', formatDate(application.removedAt)],
                          ['Removed by', application.removedBy],
                        ] as [string, string][])
                      : []),
                    ...(application.accountDeleted ? ([['Account', 'Deleted']] as [string, string][]) : []),
                  ]}
                />
              </article>
              <article className="box">
                <h3>Checks</h3>
                <Unavailable>Sumsub ID and company checks are currently unavailable. Review the answers by hand.</Unavailable>
              </article>
            </aside>
          </div>
        </>
      )}
    </>
  );
}
