export interface LeadOptions {
  roles: string[];
  countries: string[];
  restricted: string[];
  businessTypes: string[];
  uses: string[];
  monthlyTotals: string[];
  payToday: string[];
  channels: string[];
}

export interface Lead {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  company: string;
  registeredIn: string;
  website: string;
  business: string;
  uses: string[];
  monthlyTotal: string;
  payToday: string;
  channel: string;
  telegram?: string;
  source: 'website' | 'app';
  submittedBy: 'customer' | 'visitor';
  customer: { id: string; name: string; email: string } | null;
  accountDeleted: boolean;
  desk: boolean;
  freeEmail: boolean;
  submittedAt: string;
}

export const LEAD_FIELD_LABELS: Record<string, string> = {
  name: 'Full name',
  role: 'Your role',
  email: 'Work email',
  phone: 'Phone or WhatsApp',
  company: 'Company name',
  registeredIn: 'Registered in',
  website: 'Website or social page',
  business: 'What your company does',
  uses: 'What you’ll use Moneystrait for',
  monthlyTotal: 'Each month, about',
  payToday: 'How you pay today',
  channel: 'How should we talk?',
  telegram: 'Telegram username',
};

// Whether the form came from someone with an account. Always a word, never colour alone.
export function leadSender(lead: Lead): { label: string; tone: string } {
  if (lead.accountDeleted) return { label: 'Customer, account deleted', tone: 'warn' };
  if (lead.submittedBy === 'customer') return { label: 'Has an account', tone: 'teal' };
  return { label: 'Visitor', tone: 'plain' };
}
