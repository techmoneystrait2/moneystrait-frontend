'use client';

import { Check, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { ApplicationAnswers } from '@/components/ApplicationAnswers';
import { Dropdown, MultiDropdown } from '@/components/Dropdown';
import { Unavailable } from '@/components/ui';
import { api, ApiError, errorMessage } from '@/lib/api';
import { type Answers, type ApplicationOptions, describeField } from '@/lib/application';

const STEPS = ['Your company', 'Owners and directors', 'How you’ll use your account', 'Documents', 'Review and send'];


interface FieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  hint?: string;
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
}

// The same limits as the server, so a problem shows on its own step.
const NOT_ONLY_SPACES = '.*\\S.*';
const REAL_EMAIL = '[^@\\s]+@[^@\\s]+\\.[^@\\s]+';

function Field({ id, label, value, onChange, required = true, type = 'text', hint, autoComplete, minLength, maxLength }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {!required && <span className="optional"> Optional</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        required={required}
        minLength={minLength}
        maxLength={maxLength ?? (type === 'email' ? 254 : 200)}
        pattern={type === 'email' ? REAL_EMAIL : required ? NOT_ONLY_SPACES : undefined}
        title={type === 'email' ? 'Enter a full email address, like name@company.com.' : required ? 'Enter a value.' : undefined}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {hint && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
    </div>
  );
}

function Checkbox({ id, checked, onChange, children }: { id: string; checked: boolean; onChange: (value: boolean) => void; children: ReactNode }) {
  return (
    <label className="check" htmlFor={id}>
      <input id={id} type="checkbox" required checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{children}</span>
    </label>
  );
}

export function ApplicationForm({ initial, onSent }: { initial: Answers; onSent: () => void }) {
  const [options, setOptions] = useState<ApplicationOptions | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<{ options: ApplicationOptions }>('/application/options')
      .then((data) => setOptions(data.options))
      .catch(() => setFailed(true));
  }, []);

  if (failed) {
    return (
      <p className="error container" role="alert">
        Something went wrong. Reload the page and try again.
      </p>
    );
  }
  if (!options) return null;
  return <FormSteps initial={initial} options={options} onSent={onSent} />;
}

function FormSteps({ initial, options, onSent }: { initial: Answers; options: ApplicationOptions; onSent: () => void }) {
  const [answers, setAnswers] = useState(initial);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { company, people, usage, bankAccounts, declarations } = answers;

  const setCompany = (patch: Partial<Answers['company']>) => setAnswers({ ...answers, company: { ...company, ...patch } });
  const setUsage = (patch: Partial<Answers['usage']>) => setAnswers({ ...answers, usage: { ...usage, ...patch } });
  const setDeclarations = (patch: Partial<Answers['declarations']>) => setAnswers({ ...answers, declarations: { ...declarations, ...patch } });
  const setPerson = (index: number, patch: Partial<Answers['people'][number]>) =>
    setAnswers({ ...answers, people: people.map((person, i) => (i === index ? { ...person, ...patch } : person)) });
  const setAccount = (index: number, patch: Partial<Answers['bankAccounts'][number]>) =>
    setAnswers({ ...answers, bankAccounts: bankAccounts.map((account, i) => (i === index ? { ...account, ...patch } : account)) });

  function goTo(next: number) {
    setError('');
    setStep(next);
    window.scrollTo({ top: 0 });
  }

  const restricted = options.restricted.includes(company.country);
  const restrictedMessage = restricted ? `We can’t serve businesses registered in ${company.country} at the moment.` : undefined;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (restricted) return;
    if (step < STEPS.length - 1) {
      goTo(step + 1);
      return;
    }
    setBusy(true);
    setError('');
    try {
      await api('/application', {
        ...answers,
        people: people.map((person) => (person.role === 'director' ? { ...person, share: undefined } : person)),
      });
      onSent();
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError && err.fields.length > 0) {
        const problems = err.fields.map(describeField);
        setStep(problems[0]!.step);
        setError(`Check these: ${problems.map((problem) => problem.label).join(', ')}.`);
        window.scrollTo({ top: 0 });
        return;
      }
      setError(errorMessage(err));
    }
  }

  return (
    <div className="container form-layout">
      <form className="box talk-form" onSubmit={handleSubmit}>
        <p className="eyebrow">Step {step + 1} of {STEPS.length} · About 10 minutes in total</p>
        <h1>{STEPS[step]}</h1>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}

        {step === 0 && (
          <>
            <p className="lead">Use the details exactly as they appear on your registration papers.</p>
            <div className="form-grid">
              <Dropdown id="country" label="Country of registration" options={options.registrationCountries} value={company.country} error={restrictedMessage} onChange={(country) => setCompany({ country })} />
              <Field id="legalName" label="Legal company name" value={company.legalName} onChange={(legalName) => setCompany({ legalName })} autoComplete="organization" />
              <Field id="registrationNumber" label="Registration number" value={company.registrationNumber} onChange={(registrationNumber) => setCompany({ registrationNumber })} />
              <Dropdown id="business" label="What the company does" options={options.businessTypes} value={company.business} onChange={(business) => setCompany({ business })} />
              <Field id="address" label="Registered address" value={company.address} onChange={(address) => setCompany({ address })} autoComplete="street-address" />
              <Field id="website" label="Website" required={false} value={company.website ?? ''} onChange={(website) => setCompany({ website })} />
              <Dropdown id="role" label="Your role" options={options.roles} value={company.role} onChange={(role) => setCompany({ role })} />
            </div>
            <Checkbox id="authorised" checked={company.authorised} onChange={(authorised) => setCompany({ authorised })}>
              I’m allowed to open an account for this company.
            </Checkbox>
          </>
        )}

        {step === 1 && (
          <>
            <p className="lead">Add the directors, and anyone who owns 25% or more.</p>
            <Unavailable>ID checks are currently unavailable. We’ll ask each person when they are ready.</Unavailable>
            {people.map((person, index) => (
              <fieldset className="repeat" key={index}>
                <legend>Person {index + 1}</legend>
                <div className="form-grid">
                  <Field id={`person-name-${index}`} label="Full name" value={person.name} onChange={(name) => setPerson(index, { name })} />
                  <Field id={`person-email-${index}`} label="Email" type="email" value={person.email} onChange={(email) => setPerson(index, { email })} />
                  <div className="field">
                    <label htmlFor={`person-role-${index}`}>Role</label>
                    <select id={`person-role-${index}`} value={person.role} onChange={(event) => setPerson(index, { role: event.target.value as typeof person.role })}>
                      <option value="director">Director</option>
                      <option value="owner">Owner</option>
                      <option value="both">Director and owner</option>
                    </select>
                  </div>
                  {person.role !== 'director' && (
                    <div className="field">
                      <label htmlFor={`person-share-${index}`}>Share, %</label>
                      <input
                        id={`person-share-${index}`}
                        type="number"
                        min={0}
                        max={100}
                        step="any"
                        required
                        value={person.share ?? ''}
                        onChange={(event) => setPerson(index, { share: event.target.value === '' ? undefined : Number(event.target.value) })}
                      />
                    </div>
                  )}
                </div>
                {people.length > 1 && (
                  <button className="danger-button" type="button" onClick={() => setAnswers({ ...answers, people: people.filter((_, i) => i !== index) })}>
                    <Trash2 size={15} aria-hidden="true" /> Remove
                  </button>
                )}
              </fieldset>
            ))}
            {people.length < 20 && (
              <button className="btn outline small" type="button" onClick={() => setAnswers({ ...answers, people: [...people, { name: '', email: '', role: 'director' }] })}>
                <Plus size={15} aria-hidden="true" /> Add a person
              </button>
            )}
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-grid">
              <MultiDropdown id="services" label="Services you’ll use" options={options.services} value={usage.services} onChange={(services) => setUsage({ services })} />
              <MultiDropdown id="currencies" label="Currencies you’ll pay from and to" options={options.currencies} value={usage.currencies} onChange={(currencies) => setUsage({ currencies })} />
              <MultiDropdown id="countries" label="Countries you’ll pay most" options={options.countries} value={usage.countries} onChange={(countries) => setUsage({ countries })} />
              <Dropdown id="paymentsPerMonth" label="Payments a month" options={options.paymentsPerMonth} value={usage.paymentsPerMonth} onChange={(paymentsPerMonth) => setUsage({ paymentsPerMonth })} />
              <Dropdown id="monthlyTotal" label="Total a month" options={options.monthlyTotals} value={usage.monthlyTotal} onChange={(monthlyTotal) => setUsage({ monthlyTotal })} />
              <Dropdown id="largestPayment" label="Largest single payment" options={options.largestPayments} value={usage.largestPayment} onChange={(largestPayment) => setUsage({ largestPayment })} />
              <Dropdown id="payees" label="Who you’ll pay" options={options.payees} value={usage.payees} onChange={(payees) => setUsage({ payees })} />
              <Field id="paymentPurpose" label="What for" value={usage.paymentPurpose} onChange={(paymentPurpose) => setUsage({ paymentPurpose })} />
              <Dropdown id="sourceOfFunds" label="Where your company’s money comes from" options={options.sourcesOfFunds} value={usage.sourceOfFunds} onChange={(sourceOfFunds) => setUsage({ sourceOfFunds })} />
              <Field id="sourceDetails" label="Anything to add" required={false} value={usage.sourceDetails ?? ''} onChange={(sourceDetails) => setUsage({ sourceDetails })} />
              {usage.services.includes('Crypto') && (
                <MultiDropdown id="networks" label="Networks you’ll use" required={false} hint="Wallets are added later in the app." options={options.networks} value={usage.networks} onChange={(networks) => setUsage({ networks })} />
              )}
              <Dropdown id="licensed" label="Payment and crypto businesses: are you licensed or regulated?" options={options.licensed} value={usage.licensed} onChange={(licensed) => setUsage({ licensed })} />
            </div>
            {usage.licensed === 'Yes' && (
              <div className="form-grid">
                <Field id="regulator" label="Regulator" value={usage.regulator ?? ''} onChange={(regulator) => setUsage({ regulator })} />
                <Field id="licenceNumber" label="Licence number" value={usage.licenceNumber ?? ''} onChange={(licenceNumber) => setUsage({ licenceNumber })} />
              </div>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <Unavailable>Uploading company papers is currently unavailable. We’ll ask for them when it’s ready.</Unavailable>
            <p className="lead">These become the only accounts money may come from.</p>
            {bankAccounts.map((account, index) => (
              <fieldset className="repeat" key={index}>
                <legend>Your company’s bank account {index + 1}</legend>
                <div className="form-grid">
                  <Field id={`bank-${index}`} label="Bank" value={account.bank} onChange={(bank) => setAccount(index, { bank })} />
                  <Dropdown id={`bank-country-${index}`} label="Country" options={options.countries} value={account.country} onChange={(country) => setAccount(index, { country })} />
                  <Field id={`bank-holder-${index}`} label="Account holder" hint="This must be the company." value={account.holder} onChange={(holder) => setAccount(index, { holder })} />
                  <Field id={`bank-number-${index}`} label="IBAN or account number" minLength={4} maxLength={40} hint="4 to 40 characters." value={account.accountNumber} onChange={(accountNumber) => setAccount(index, { accountNumber })} />
                </div>
                {bankAccounts.length > 1 && (
                  <button className="danger-button" type="button" onClick={() => setAnswers({ ...answers, bankAccounts: bankAccounts.filter((_, i) => i !== index) })}>
                    <Trash2 size={15} aria-hidden="true" /> Remove
                  </button>
                )}
              </fieldset>
            ))}
            {bankAccounts.length < 5 && (
              <button className="btn outline small" type="button" onClick={() => setAnswers({ ...answers, bankAccounts: [...bankAccounts, { bank: '', country: '', holder: '', accountNumber: '' }] })}>
                <Plus size={15} aria-hidden="true" /> Add a bank account
              </button>
            )}
          </>
        )}

        {step === 4 && (
          <>
            <ApplicationAnswers answers={answers} onEdit={goTo} />
            <div className="declarations">
              <Checkbox id="trueAndComplete" checked={declarations.trueAndComplete} onChange={(trueAndComplete) => setDeclarations({ trueAndComplete })}>
                The information is true and complete.
              </Checkbox>
              <Checkbox id="actsForItself" checked={declarations.actsForItself} onChange={(actsForItself) => setDeclarations({ actsForItself })}>
                The company acts for itself or, for a payment company, for its own clients under its licence.
              </Checkbox>
              <Checkbox id="agreesToTerms" checked={declarations.agreesToTerms} onChange={(agreesToTerms) => setDeclarations({ agreesToTerms })}>
                The company agrees to the <Link href="/legal/terms">Terms</Link> and the <Link href="/legal/privacy">Privacy notice</Link>.
              </Checkbox>
            </div>
          </>
        )}

        <div className="form-actions">
          {step > 0 && (
            <button className="btn outline" type="button" onClick={() => goTo(step - 1)} disabled={busy}>
              Back
            </button>
          )}
          <button className="btn" type="submit" disabled={busy || restricted}>
            {step === STEPS.length - 1 ? 'Send application' : 'Continue'}
          </button>
        </div>
      </form>

      <aside className="side-panel">
        <article className="box">
          <h3>Your application</h3>
          <ol className="app-steps">
            {STEPS.map((label, index) => (
              <li key={label} className={index === step ? 'now' : index < step ? 'done' : ''} aria-current={index === step ? 'step' : undefined}>
                <i className="step-number">{index < step ? <Check size={13} aria-hidden="true" /> : index + 1}</i>
                {label}
              </li>
            ))}
          </ol>
        </article>
        <article className="box">
          <h3>What you’ll need</h3>
          <Ticks />
        </article>
      </aside>
    </div>
  );
}

function Ticks() {
  return (
    <ul className="need-list">
      <li>Company registration details</li>
      <li>Names and emails of directors and owners of 25% or more</li>
      <li>Your company’s bank account details</li>
    </ul>
  );
}
