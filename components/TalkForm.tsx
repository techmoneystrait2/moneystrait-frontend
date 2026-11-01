'use client';

import { MessageCircle, Phone, Send } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { Dropdown } from '@/components/Dropdown';
import { api, ApiError, errorMessage, type User } from '@/lib/api';
import { LEAD_FIELD_LABELS, type LeadOptions } from '@/lib/leads';

const CHANNEL_ICONS: Record<string, typeof Phone> = { 'Phone call': Phone, WhatsApp: MessageCircle, Telegram: Send };

const EMPTY = {
  name: '',
  role: '',
  email: '',
  phone: '',
  company: '',
  registeredIn: '',
  website: '',
  business: '',
  monthlyTotal: '',
  payToday: '',
  telegram: '',
};

function contactLine(channel: string, phone: string): string {
  if (channel === 'Phone call') return `We’ll call you on ${phone}.`;
  return `We’ll message you on ${channel}.`;
}

export function TalkForm() {
  const [options, setOptions] = useState<LeadOptions | null>(null);
  const [failed, setFailed] = useState(false);
  const [answers, setAnswers] = useState(EMPTY);
  const [uses, setUses] = useState<string[]>([]);
  const [channel, setChannel] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api<{ options: LeadOptions }>('/leads/options')
      .then((data) => setOptions(data.options))
      .catch(() => setFailed(true));
    // A logged-in customer doesn't type their name and email again.
    api<{ user: User }>('/auth/me')
      .then(({ user }) => setAnswers((current) => ({ ...current, name: current.name || user.name, email: current.email || user.email })))
      .catch(() => undefined);
  }, []);

  const set = (patch: Partial<typeof EMPTY>) => setAnswers({ ...answers, ...patch });
  const toggleUse = (use: string) => setUses(uses.includes(use) ? uses.filter((item) => item !== use) : [...uses, use]);

  const restricted = options?.restricted.includes(answers.registeredIn);
  const restrictedMessage = restricted ? `We can’t serve businesses registered in ${answers.registeredIn} at the moment.` : undefined;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // Checked here too, so a forgotten choice doesn't use up one of the hourly tries.
    const lists = { role: answers.role, registeredIn: answers.registeredIn, business: answers.business, monthlyTotal: answers.monthlyTotal, payToday: answers.payToday, channel };
    const missing = [...Object.entries(lists).filter(([, value]) => !value).map(([key]) => key), ...(uses.length === 0 ? ['uses'] : [])];
    if (missing.length > 0) {
      setError(`Check these: ${missing.map((field) => LEAD_FIELD_LABELS[field]).join(', ')}.`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api('/leads', { ...answers, uses, channel, telegram: answers.telegram || undefined, nickname: nickname || undefined });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.fields.length > 0) {
        setError(`Check these: ${err.fields.map((field) => LEAD_FIELD_LABELS[field] ?? field).join(', ')}.`);
      } else {
        setError(errorMessage(err));
      }
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="box talk-form">
        <p className="eyebrow">Get your rate</p>
        <h1>Thanks, we’ve got your details</h1>
        <p className="lead">{contactLine(channel, answers.phone)} We’ll tell you about your rate and answer your questions.</p>
        <Link className="btn" href="/">
          Go to the homepage
        </Link>
      </div>
    );
  }

  return (
    <form className="box talk-form" onSubmit={handleSubmit}>
      <p className="eyebrow">Get your rate</p>
      <h1>Let’s talk about your rate</h1>
      <p className="lead">Tell us who you are and how you pay today, so your manager comes to the call prepared. Two minutes, no documents.</p>
      {failed && (
        <p className="error" role="alert">
          Something went wrong. Reload the page and try again.
        </p>
      )}
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {options && (
        <>
          <fieldset>
            <legend>
              <i className="step-number navy">1</i> About you
            </legend>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input id="name" autoComplete="name" required minLength={2} maxLength={100} value={answers.name} onChange={(event) => set({ name: event.target.value })} />
              </div>
              <Dropdown id="role" label="Your role" options={options.roles} value={answers.role} onChange={(role) => set({ role })} />
              <div className="field">
                <label htmlFor="email">Work email</label>
                <input id="email" type="email" autoComplete="email" required maxLength={254} value={answers.email} onChange={(event) => set({ email: event.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone or WhatsApp</label>
                <input id="phone" type="tel" autoComplete="tel" required pattern="\+?[\d\s()\-]{6,25}" title="Enter your number with its country code, like +49 30 123456." value={answers.phone} onChange={(event) => set({ phone: event.target.value })} />
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <i className="step-number navy">2</i> Your company
            </legend>
            <div className="form-grid">
              <div className="field">
                <label htmlFor="company">Company name</label>
                <input id="company" autoComplete="organization" required maxLength={200} value={answers.company} onChange={(event) => set({ company: event.target.value })} />
              </div>
              <Dropdown id="registeredIn" label="Registered in" options={options.countries} value={answers.registeredIn} error={restrictedMessage} onChange={(registeredIn) => set({ registeredIn })} />
              <div className="field">
                <label htmlFor="website">Website or social page</label>
                <input id="website" required maxLength={200} value={answers.website} onChange={(event) => set({ website: event.target.value })} />
              </div>
              <Dropdown id="business" label="What your company does" options={options.businessTypes} value={answers.business} onChange={(business) => set({ business })} />
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <i className="step-number navy">3</i> Your payments
            </legend>
            <p className="group-label">What will you use Moneystrait for?</p>
            <div className="option-chips">
              {options.uses.map((use) => (
                <button key={use} type="button" aria-pressed={uses.includes(use)} onClick={() => toggleUse(use)}>
                  {use}
                </button>
              ))}
            </div>
            <div className="form-grid">
              <Dropdown id="monthlyTotal" label="Each month, about" options={options.monthlyTotals} value={answers.monthlyTotal} onChange={(monthlyTotal) => set({ monthlyTotal })} />
              <Dropdown id="payToday" label="How you pay today" options={options.payToday} value={answers.payToday} onChange={(payToday) => set({ payToday })} />
            </div>
          </fieldset>

          <fieldset>
            <legend>
              <i className="step-number navy">4</i> How should we talk?
            </legend>
            <div className="channels">
              {options.channels.map((item) => {
                const Icon = CHANNEL_ICONS[item] ?? Phone;
                return (
                  <button key={item} type="button" aria-pressed={channel === item} onClick={() => setChannel(item)}>
                    <Icon size={16} aria-hidden="true" /> {item}
                  </button>
                );
              })}
            </div>
            {channel === 'Telegram' && (
              <div className="field">
                <label htmlFor="telegram">
                  Telegram username <span className="optional">Optional</span>
                </label>
                <input id="telegram" maxLength={100} value={answers.telegram} onChange={(event) => set({ telegram: event.target.value })} />
              </div>
            )}
          </fieldset>

          <div className="hp-field" aria-hidden="true">
            <label htmlFor="nickname">Leave this empty</label>
            <input id="nickname" tabIndex={-1} autoComplete="off" value={nickname} onChange={(event) => setNickname(event.target.value)} />
          </div>

          <button className="btn" type="submit" disabled={busy || restricted}>
            Send my details
          </button>
          <p className="talk-privacy">
            <Link href="/legal/privacy">How we use your data</Link>
          </p>
        </>
      )}
    </form>
  );
}
