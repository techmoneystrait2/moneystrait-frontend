import type { ReactNode } from 'react';
import type { Answers } from '@/lib/application';

function Group({ title, onEdit, children }: { title: string; onEdit?: () => void; children: ReactNode }) {
  return (
    <section className="answer-group">
      <div className="admin-head">
        <h3>{title}</h3>
        {onEdit && (
          <button className="text-button inline" type="button" onClick={onEdit}>
            Edit
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function Rows({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="kv answers">
      {rows
        .filter(([, value]) => value !== undefined && value !== '' && value !== null)
        .map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
    </dl>
  );
}

const ROLE_LABELS = { director: 'Director', owner: 'Owner', both: 'Director and owner' };

export function ApplicationAnswers({ answers, onEdit }: { answers: Answers; onEdit?: (step: number) => void }) {
  const { company, people, usage, bankAccounts } = answers;
  return (
    <>
      <Group title="Your company" onEdit={onEdit && (() => onEdit(0))}>
        <Rows
          rows={[
            ['Country of registration', company.country],
            ['Legal company name', company.legalName],
            ['Registration number', company.registrationNumber],
            ['What the company does', company.business],
            ['Registered address', company.address],
            ['Website', company.website],
            ['Role of the applicant', company.role],
          ]}
        />
      </Group>
      <Group title="Owners and directors" onEdit={onEdit && (() => onEdit(1))}>
        {people.map((person, index) => (
          <Rows
            key={index}
            rows={[
              ['Name', person.name],
              ['Email', person.email],
              ['Role', ROLE_LABELS[person.role]],
              ['Share', person.share === undefined ? undefined : `${person.share}%`],
            ]}
          />
        ))}
      </Group>
      <Group title="How the account will be used" onEdit={onEdit && (() => onEdit(2))}>
        <Rows
          rows={[
            ['Services', usage.services.join(', ')],
            ['Currencies', usage.currencies.join(', ')],
            ['Countries paid most', usage.countries.join(', ')],
            ['Payments a month', usage.paymentsPerMonth],
            ['Total a month', usage.monthlyTotal],
            ['Largest single payment', usage.largestPayment],
            ['Pays', usage.payees],
            ['What for', usage.paymentPurpose],
            ['Source of money', usage.sourceOfFunds],
            ['Source details', usage.sourceDetails],
            ['Crypto networks', usage.networks.join(', ')],
            ['Licensed or regulated', usage.licensed],
            ['Regulator', usage.regulator],
            ['Licence number', usage.licenceNumber],
          ]}
        />
      </Group>
      <Group title="Company bank accounts" onEdit={onEdit && (() => onEdit(3))}>
        {bankAccounts.map((account, index) => (
          <Rows
            key={index}
            rows={[
              ['Bank', account.bank],
              ['Country', account.country],
              ['Account holder', account.holder],
              ['IBAN or account number', account.accountNumber],
            ]}
          />
        ))}
      </Group>
    </>
  );
}
