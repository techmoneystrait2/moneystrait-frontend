'use client';

import { type FormEvent, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import type { CustomerRfi } from '@/lib/application';

function RfiQuestion({ rfi, onSent }: { rfi: CustomerRfi; onSent: () => void }) {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api(`/application/rfis/${rfi.id}`, { answer });
      setAnswer('');
      onSent();
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  return (
    <form className="rfi-item" onSubmit={handleSubmit}>
      <p className="rfi-question">{rfi.question}</p>
      {rfi.askedAgain && <p className="hint">Please answer this again.</p>}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      <div className="field">
        <label htmlFor={`rfi-${rfi.id}`}>Your answer</label>
        <textarea id={`rfi-${rfi.id}`} rows={4} required maxLength={2000} value={answer} onChange={(event) => setAnswer(event.target.value)} />
      </div>
      <button className="btn small" type="submit" disabled={busy || !answer.trim()}>
        Send answer
      </button>
    </form>
  );
}

export function RfiAnswers({ rfis, onSent }: { rfis: CustomerRfi[]; onSent: () => void }) {
  const waiting = rfis.filter((rfi) => rfi.status === 'waiting');
  const answered = rfis.filter((rfi) => rfi.status !== 'waiting');
  if (rfis.length === 0) return null;
  return (
    <>
      {waiting.length > 0 && (
        <article className="box rfi-section" aria-labelledby="rfi-needed">
          <h2 id="rfi-needed">We need more information</h2>
          <p className="rfi-intro">Please answer so we can finish checking your application.</p>
          {waiting.map((rfi) => (
            <RfiQuestion key={rfi.id} rfi={rfi} onSent={onSent} />
          ))}
        </article>
      )}
      {answered.length > 0 && (
        <article className="box rfi-section" aria-labelledby="rfi-sent">
          <h2 id="rfi-sent">Information you sent</h2>
          {answered.map((rfi) => (
            <div className="rfi-item" key={rfi.id}>
              <p className="rfi-question">{rfi.question}</p>
              <p className="rfi-answer">{rfi.answer}</p>
            </div>
          ))}
        </article>
      )}
    </>
  );
}
