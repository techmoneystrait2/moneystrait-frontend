'use client';

import {
  ArrowRight,
  ArrowRightLeft,
  Building2,
  CircleCheck,
  Coins,
  FileText,
  Home,
  Landmark,
  LogOut,
  type LucideIcon,
  Menu,
  MessageSquare,
  Plus,
  Send,
  Settings,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { ApplicationAnswers } from '@/components/ApplicationAnswers';
import { CoinMark, Wordmark } from '@/components/Brand';
import { CoinBadge, Flag } from '@/components/Flag';
import { Unavailable } from '@/components/ui';
import type { User } from '@/lib/api';
import type { Answers } from '@/lib/application';

const MAIN: { label: string; icon: LucideIcon }[] = [
  { label: 'Home', icon: Home },
  { label: 'Payments', icon: Send },
  { label: 'Crypto', icon: Coins },
  { label: 'OTC desk', icon: MessageSquare },
  { label: 'Recipients', icon: Landmark },
  { label: 'Statements', icon: FileText },
];

const MORE: { label: string; icon: LucideIcon }[] = [
  { label: 'Your application', icon: CircleCheck },
  { label: 'Your companies', icon: Building2 },
  { label: 'Team and approvals', icon: Users },
];

const ACTIONS: { label: string; icon: LucideIcon }[] = [
  { label: 'Send money', icon: ArrowRight },
  { label: 'Add money', icon: Plus },
  { label: 'Convert', icon: ArrowRightLeft },
  { label: 'Crypto', icon: Coins },
];

const CURRENCIES = [
  ['US', 'USD', 'US Dollar'],
  ['EU', 'EUR', 'Euro'],
  ['GB', 'GBP', 'British Pound'],
  ['CH', 'CHF', 'Swiss Franc'],
  ['AE', 'AED', 'UAE Dirham'],
  ['SA', 'SAR', 'Saudi Riyal'],
  ['CA', 'CAD', 'Canadian Dollar'],
  ['AU', 'AUD', 'Australian Dollar'],
];

const COINS = [
  ['T', 'USDT', 'Tether USD'],
  ['C', 'USDC', 'USD Coin'],
  ['B', 'BTC', 'Bitcoin'],
  ['E', 'ETH', 'Ether'],
] as const;

function HomeSection({ company, name, onNotice, notice }: { company: string; name: string; notice: string; onNotice: (text: string) => void }) {
  return (
    <>
      <p className="welcome">
        <CircleCheck size={18} aria-hidden="true" /> Your application is approved. Welcome, {name}.
      </p>
      <h1>{company}</h1>
      <div className="portal-grid">
        <div>
          <article className="box balance">
            <p className="muted">Available balance</p>
            <p className="balance-value">Currently unavailable</p>
            <div className="actions">
              {ACTIONS.map((action, index) => (
                <button
                  key={action.label}
                  className={`btn small ${index === 0 ? '' : 'outline'}`}
                  type="button"
                  onClick={() => onNotice(`${action.label} is currently unavailable.`)}
                >
                  <action.icon size={15} aria-hidden="true" /> {action.label}
                </button>
              ))}
            </div>
            {notice && <Unavailable>{notice}</Unavailable>}
          </article>
          <div className="table-wrap portal-table">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Currency</th>
                  <th scope="col">Balance</th>
                </tr>
              </thead>
              <tbody>
                {CURRENCIES.map(([code, label, full]) => (
                  <tr key={label}>
                    <td data-label="Currency">
                      <span className="payee">
                        <Flag code={code!} />
                        <span>
                          <strong>{label}</strong>
                          <small>{full}</small>
                        </span>
                      </span>
                    </td>
                    <td data-label="Balance" className="muted">
                      Unavailable
                    </td>
                  </tr>
                ))}
                {COINS.map(([letter, label, full]) => (
                  <tr key={label}>
                    <td data-label="Currency">
                      <span className="payee">
                        <CoinBadge letter={letter} />
                        <span>
                          <strong>{label}</strong>
                          <small>{full}</small>
                        </span>
                      </span>
                    </td>
                    <td data-label="Balance" className="muted">
                      Unavailable
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <aside className="side-panel">
          <article className="box">
            <h3>Recent activity</h3>
            <Unavailable>Activity is currently unavailable.</Unavailable>
          </article>
          <article className="box">
            <h3>Your rate letter</h3>
            <Unavailable>Your rate letter is currently unavailable here.</Unavailable>
          </article>
          <article className="box">
            <h3>Your manager</h3>
            <Unavailable>Messaging your manager is currently unavailable.</Unavailable>
          </article>
        </aside>
      </div>
    </>
  );
}

export function CustomerPanel({ user, answers, onLogOut }: { user: User; answers: Answers; onLogOut: () => void }) {
  const [section, setSection] = useState('Home');
  const [open, setOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const link = (item: { label: string; icon: LucideIcon }) => (
    <button
      key={item.label}
      type="button"
      aria-current={section === item.label ? 'page' : undefined}
      onClick={() => {
        setSection(item.label);
        setOpen(false);
      }}
    >
      <item.icon size={18} strokeWidth={1.75} aria-hidden="true" /> {item.label}
    </button>
  );

  return (
    <div className="admin portal">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <div className="admin-brand">
          <span className="brand">
            <CoinMark />
            <Wordmark />
          </span>
          <button className="admin-menu" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Account">
          {MAIN.map(link)}
          <hr />
          {MORE.map(link)}
          <Link href="/account/settings">
            <Settings size={18} strokeWidth={1.75} aria-hidden="true" /> Settings
          </Link>
        </nav>
      </aside>

      <div className="admin-body">
        <header className="admin-top">
          <button className="admin-menu" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={20} aria-hidden="true" />
          </button>
          <p>
            <strong>{user.name}</strong>
          </p>
          <Link className="admin-logout" href="/account/settings">
            <Settings size={16} aria-hidden="true" /> Settings
          </Link>
          <button className="admin-logout" type="button" onClick={onLogOut}>
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </header>
        <main id="content" className="admin-main">
          {section === 'Home' && <HomeSection company={answers.company.legalName} name={user.name} notice={notice} onNotice={setNotice} />}
          {section === 'Your application' && (
            <>
              <h1>Your application</h1>
              <p className="admin-lead">Approved. These are the details you sent us.</p>
              <div className="box">
                <ApplicationAnswers answers={answers} />
              </div>
            </>
          )}
          {section !== 'Home' && section !== 'Your application' && (
            <>
              <h1>{section}</h1>
              <Unavailable>{section} is currently unavailable.</Unavailable>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
