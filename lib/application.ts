export type ApplicationStatus = 'in_review' | 'approved' | 'rejected' | 'removed';

export interface Person {
  name: string;
  email: string;
  role: 'director' | 'owner' | 'both';
  share?: number;
}

export interface BankAccount {
  bank: string;
  country: string;
  holder: string;
  accountNumber: string;
}

export interface Answers {
  company: {
    country: string;
    legalName: string;
    registrationNumber: string;
    business: string;
    address: string;
    website?: string;
    role: string;
    authorised: boolean;
  };
  people: Person[];
  usage: {
    services: string[];
    currencies: string[];
    countries: string[];
    paymentsPerMonth: string;
    monthlyTotal: string;
    largestPayment: string;
    payees: string;
    paymentPurpose: string;
    sourceOfFunds: string;
    sourceDetails?: string;
    networks: string[];
    licensed: string;
    regulator?: string;
    licenceNumber?: string;
  };
  bankAccounts: BankAccount[];
  declarations: { trueAndComplete: boolean; actsForItself: boolean; agreesToTerms: boolean };
}

export interface MyApplication {
  id: string;
  status: ApplicationStatus;
  answers: Answers;
  reviewedAt?: string;
}

export interface ApplicationSummary {
  id: string;
  status: ApplicationStatus;
  company: string;
  country: string;
  customer: { id: string | null; name: string; email: string } | null;
  accountDeleted: boolean;
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  removedAt?: string;
  removedBy?: string;
}

export interface ApplicationDetail extends ApplicationSummary {
  answers: Answers;
  attempts: number;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
  removed: 'Removed',
};

export const STATUS_TONES: Record<ApplicationStatus, string> = {
  in_review: 'blue',
  approved: 'teal',
  rejected: 'warn',
  removed: 'plain',
};

// The approved lists, served by the backend, which refuses anything else.
export interface ApplicationOptions {
  registrationCountries: string[];
  countries: string[];
  restricted: string[];
  businessTypes: string[];
  roles: string[];
  services: string[];
  currencies: string[];
  paymentsPerMonth: string[];
  monthlyTotals: string[];
  largestPayments: string[];
  payees: string[];
  sourcesOfFunds: string[];
  networks: string[];
  licensed: string[];
}

export function emptyAnswers(name: string, email: string): Answers {
  return {
    company: { country: '', legalName: '', registrationNumber: '', business: '', address: '', website: '', role: '', authorised: false },
    people: [{ name, email, role: 'director' }],
    usage: {
      services: [],
      currencies: [],
      countries: [],
      paymentsPerMonth: '',
      monthlyTotal: '',
      largestPayment: '',
      payees: '',
      paymentPurpose: '',
      sourceOfFunds: '',
      sourceDetails: '',
      networks: [],
      licensed: '',
      regulator: '',
      licenceNumber: '',
    },
    bankAccounts: [{ bank: '', country: '', holder: '', accountNumber: '' }],
    declarations: { trueAndComplete: false, actsForItself: false, agreesToTerms: false },
  };
}

const COMPANY_LABELS: Record<string, string> = {
  country: 'Country of registration',
  legalName: 'Legal company name',
  registrationNumber: 'Registration number',
  business: 'What the company does',
  address: 'Registered address',
  website: 'Website',
  role: 'Your role',
  authorised: 'I’m allowed to open an account',
};

const USAGE_LABELS: Record<string, string> = {
  services: 'Services you’ll use',
  currencies: 'Currencies',
  countries: 'Countries you’ll pay most',
  paymentsPerMonth: 'Payments a month',
  monthlyTotal: 'Total a month',
  largestPayment: 'Largest single payment',
  payees: 'Who you’ll pay',
  paymentPurpose: 'What for',
  sourceOfFunds: 'Where your company’s money comes from',
  sourceDetails: 'Anything to add',
  networks: 'Networks',
  licensed: 'Licensed or regulated',
  regulator: 'Regulator',
  licenceNumber: 'Licence number',
};

const BANK_LABELS: Record<string, string> = {
  bank: 'Bank',
  country: 'Country',
  holder: 'Account holder',
  accountNumber: 'IBAN or account number',
};

const PERSON_LABELS: Record<string, string> = { name: 'Full name', email: 'Email', role: 'Role', share: 'Share' };

// Turns a refused field such as "bankAccounts.0.accountNumber" into its step and label.
export function describeField(field: string): { step: number; label: string } {
  const [section, second, third] = field.split('.');
  if (section === 'company') return { step: 0, label: COMPANY_LABELS[second ?? ''] ?? 'Your company' };
  if (section === 'people') {
    const person = second === undefined ? 'Owners and directors' : `Person ${Number(second) + 1}`;
    return { step: 1, label: third ? `${person}: ${PERSON_LABELS[third]}` : `${person}: Share` };
  }
  if (section === 'usage') return { step: 2, label: USAGE_LABELS[second ?? ''] ?? 'Regulator and licence number' };
  if (section === 'bankAccounts') {
    const account = second === undefined ? 'Bank accounts' : `Bank account ${Number(second) + 1}`;
    return { step: 3, label: third ? `${account}: ${BANK_LABELS[third]}` : account };
  }
  return { step: 4, label: 'The declarations' };
}

// A new attempt starts from the old answers, but the customer confirms everything again.
export function reapplyAnswers(previous: Answers): Answers {
  return {
    ...previous,
    company: { ...previous.company, authorised: false },
    declarations: { trueAndComplete: false, actsForItself: false, agreesToTerms: false },
  };
}
