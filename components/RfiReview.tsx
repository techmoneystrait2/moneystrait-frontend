import { Check, X } from 'lucide-react';
import { formatDate } from '@/components/CustomerTable';
import type { AdminRfi } from '@/lib/application';

const STATUS = {
  waiting: { label: 'Waiting for customer', tone: 'amber' },
  answered: { label: 'Response to review', tone: 'blue' },
  accepted: { label: 'Accepted', tone: 'teal' },
};

const DECISION = {
  pending: { label: 'To review', tone: 'blue' },
  accepted: { label: 'Accepted', tone: 'teal' },
  rejected: { label: 'Rejected', tone: 'warn' },
};

interface Props {
  rfis: AdminRfi[];
  busy: boolean;
  onDecide: (rfi: AdminRfi, decision: 'accept' | 'reject') => void;
}

export function RfiReview({ rfis, busy, onDecide }: Props) {
  if (rfis.length === 0) return null;
  return (
    <section className="box rfi-section" aria-labelledby="rfi-heading">
      <h2 id="rfi-heading">Requests for information</h2>
      {rfis.map((rfi, index) => (
        <article className="rfi-item" key={rfi.id}>
          <div className="row-between">
            <h3>Request {index + 1}</h3>
            <span className={`pill ${STATUS[rfi.status].tone}`}>{STATUS[rfi.status].label}</span>
          </div>
          <p className="rfi-question">{rfi.question}</p>
          <small className="muted block">
            Asked by {rfi.askedBy}, {formatDate(rfi.askedAt)}
          </small>

          {rfi.responses.map((response) => (
            <div className="rfi-response" key={response.answeredAt}>
              <div className="row-between">
                <small className="muted">Customer’s response, {formatDate(response.answeredAt)}</small>
                <span className={`pill ${DECISION[response.decision].tone}`}>{DECISION[response.decision].label}</span>
              </div>
              <p>{response.answer}</p>
              {response.decidedBy && (
                <small className="muted block">
                  Decided by {response.decidedBy}
                  {response.decidedAt && `, ${formatDate(response.decidedAt)}`}
                </small>
              )}
            </div>
          ))}

          {rfi.status === 'answered' && (
            <div className="actions rfi-actions">
              <button className="btn small" type="button" disabled={busy} onClick={() => onDecide(rfi, 'accept')}>
                <Check size={15} aria-hidden="true" /> Accept response
              </button>
              <button className="btn small outline danger" type="button" disabled={busy} onClick={() => onDecide(rfi, 'reject')}>
                <X size={15} aria-hidden="true" /> Reject response
              </button>
            </div>
          )}
        </article>
      ))}
    </section>
  );
}
