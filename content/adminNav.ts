import {
  BadgeCheck,
  ClipboardList,
  Coins,
  FileText,
  Globe,
  Handshake,
  Inbox,
  KeyRound,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Send,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  superadminOnly?: boolean;
}

export const ADMIN_NAV: AdminNavItem[] = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/leads', label: 'Leads', icon: Inbox },
  { href: '/admin/countries', label: 'Countries', icon: Globe },
  { href: '/admin/admins', label: 'Admins', icon: UserCog },
  { href: '/admin/credentials', label: 'Login credentials', icon: KeyRound, superadminOnly: true },
];

// Sections with no backend yet. Each shows "currently unavailable".
export const UNAVAILABLE_SECTIONS: (AdminNavItem & { slug: string; text: string })[] = [
  { slug: 'verification', href: '/admin/verification', label: 'ID checks', icon: BadgeCheck, text: 'Sumsub company and ID check statuses.' },
  { slug: 'payments', href: '/admin/payments', label: 'Payments', icon: Send, text: 'Customer payments and tracking.' },
  { slug: 'crypto', href: '/admin/crypto', label: 'Crypto', icon: Coins, text: 'Crypto trades and wallets.' },
  { slug: 'otc-desk', href: '/admin/otc-desk', label: 'OTC desk', icon: Handshake, text: 'Desk quotes and deals.' },
  { slug: 'licences', href: '/admin/licences', label: 'Licences', icon: ShieldCheck, text: 'Licence records and the published switch.' },
  { slug: 'content', href: '/admin/content', label: 'Content', icon: FileText, text: 'Website copy, questions and legal pages.' },
  { slug: 'emails', href: '/admin/emails', label: 'Emails', icon: Mail, text: 'Email templates and sent messages.' },
  { slug: 'audit-log', href: '/admin/audit-log', label: 'Audit log', icon: ClipboardList, text: 'A record of every staff action.' },
];
