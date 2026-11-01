'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { type FormEvent, useEffect, useState } from 'react';
import { api, errorMessage } from '@/lib/api';
import type { ApplicationDetail } from '@/lib/application';

export default function RequestInformationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [question, setQuestion] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ application: ApplicationDetail }>(`/admin/applications/${id}`)
      .then((data) => setApplication(data.application))
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { emailSent } = await api<{ emailSent: boolean }>(`/admin/applications/${id}/rfis`, { question });
      router.replace(`/admin/applications/${id}?rfi=${emailSent ? 'emailed' : 'not-emailed'}`);
    } catch (err) {
      setError(errorMessage(err));
      setBusy(false);
    }
  }

  return (
    <>
      <p className="back-link">
        <Link href={`/admin/applications/${id}`}>← Back to the application</Link>
      </p>
      <h1>Request information</h1>
      <p className="admin-lead">{application ? `Ask ${application.company} for anything you need to finish the review.` : ' '}</p>
      <form className="box admin-form narrow" onSubmit={handleSubmit}>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <div className="field">
          <label htmlFor="question">Your question</label>
          <textarea
            id="question"
            rows={5}
            required
            minLength={3}
            maxLength={1000}
            placeholder="For example: Please send your company’s registered address."
            aria-describedby="question-hint"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
          />
          <p className="hint" id="question-hint">
            The customer sees this in their account, and we email them to log in.
          </p>
        </div>
        <button className="btn" type="submit" disabled={busy}>
          Send to customer
        </button>
      </form>
    </>
  );
}
