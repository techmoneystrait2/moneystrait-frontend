import { ArrowRightToLine, Award, Ban, Building2, KeyRound, Landmark, ListChecks, MessageSquare, ShieldCheck, UserRound, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, FeatureCards, IconTile, KeyValues, SectionHead, Ticks, Unavailable } from '@/components/ui';
import { ISO_27001_CERTIFICATE, publishedLicences } from '@/content/licences';
import { UNAVAILABLE } from '@/content/site';

export const metadata: Metadata = {
  title: 'Security and compliance · Moneystrait',
  description: 'How we check every business, screen every payment and protect your account.',
};

const PROTECTIONS = [
  { icon: KeyRound, title: 'Two-step sign-in', text: 'An authenticator app or security key, every time.' },
  { icon: Users, title: 'Roles and approvals', text: 'Choose who creates, approves or only views payments. Over $25,000, a second person approves.' },
  { icon: Landmark, title: 'New recipients approved', text: 'A new recipient or wallet is approved by your team before its first payment.' },
  { icon: ListChecks, title: 'Full audit log', text: 'Every sign-in, change and payment, with who did it and when.' },
  ...(ISO_27001_CERTIFICATE
    ? [{ icon: Award, title: 'Certified information security', text: `ISO/IEC 27001, certificate no. ${ISO_27001_CERTIFICATE}.` }]
    : []),
];

const TEAM = [
  ['AM', 'Anna Meyer', 'Finance manager', 'Admin', 'navy'],
  ['JB', 'Jonas Brunner', 'CFO', 'Approver', 'amber'],
  ['LW', 'Lukas Weber', 'Accounts', 'Creates payments', 'blue'],
  ['TS', 'Tina Schmid', 'Auditor', 'View only', 'plain'],
];

const REFUSED = ['Personal accounts', 'Sanctioned countries and people', 'Shell companies', 'Unlicensed money services', 'Gambling', 'Weapons', 'Adult content', 'Crypto mixers and privacy coins'];

const NEVER = ['Ask for your password or sign-in codes', 'Ask you to move money to a “safe account”', 'Change our bank details by email or chat'];

const CONTACTS = ['Report a security issue', 'Compliance questions', 'Complaints'];

export default function SecurityPage() {
  const bodies = publishedLicences.filter((licence) => licence.securityCovers);
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">Security</p>
            <h1>Security and compliance, in plain words.</h1>
            <p className="lead">How we check every business, screen every payment and protect your account.</p>
            <Ticks items={['Every customer is a verified business', 'Every payment and wallet screened', 'Two-step sign-in and team approvals']} />
          </div>
          <article className="box">
            <h3 className="with-icon">
              <IconTile icon={ShieldCheck} /> Registered and licensed
            </h3>
            {bodies.length ? (
              <>
                <KeyValues rows={bodies.map((licence) => [licence.body, licence.securityCovers])} />
                <Link className="plain-link" href="/licences">
                  Numbers and public registers
                </Link>
              </>
            ) : (
              <Unavailable>Licence details are currently unavailable.</Unavailable>
            )}
            <small className="muted block">Held by Moneystrait and its partners. Moneystrait is not a bank.</small>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="One check when you join" lead="We check your company once, online. ID and company checks run on Sumsub, a specialist verification provider." />
          <FeatureCards
            items={[
              { icon: UserRound, title: 'You', text: 'A photo of your ID and a short face scan, on your phone. About 2 minutes.' },
              { icon: Building2, title: 'Your company', text: 'Papers checked against the official register. Owners and directors verify by secure link.' },
              { icon: ArrowRightToLine, title: 'Payments and wallets', text: 'Screened automatically, with no invoices to upload. Add each wallet once, with a small test transfer.' },
              { icon: MessageSquare, title: 'If we need something', text: 'Your manager asks you directly. A quick question, not a form.' },
            ]}
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container split">
          <div>
            <SectionHead title="Your account is protected" lead="You decide who can do what. Every action is on record." />
            <ul className="protections">
              {PROTECTIONS.map((item) => (
                <li key={item.title}>
                  <span className="icon-tile white">
                    <item.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <p>
                    <strong>{item.title}</strong>
                    {item.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="picture-card flush" aria-hidden="true">
            <div className="row-between team-head">
              <strong>Team and approvals</strong>
              <small className="muted">Kestrel Imports GmbH</small>
            </div>
            {TEAM.map(([initials, name, role, access, tone]) => (
              <div className="row-between team-row" key={name}>
                <span className="payee">
                  <i className={`avatar ${tone}`}>{initials}</i>
                  <span>
                    <strong>{name}</strong>
                    <small>{role}</small>
                  </span>
                </span>
                <span className={`pill ${tone}`}>{access}</span>
              </div>
            ))}
            <div className="row-between team-foot">
              <span>
                <strong className="block">Second approval</strong>
                <small>Payments over USD 25,000 need a second approver.</small>
              </span>
              <i className="switch-on" />
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-2">
          <article className="box">
            <h2>Who we can’t serve</h2>
            <p>We open accounts for verified businesses, and they can pay companies or people. We can’t open accounts for:</p>
            <ul className="tag-chips">
              {REFUSED.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article className="box navy-card">
            <h2>We will never</h2>
            <ul className="never">
              {NEVER.map((item) => (
                <li key={item}>
                  <Ban size={16} aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <p>Our payment details only ever appear in the app. If something feels wrong, stop and call your manager.</p>
          </article>
        </div>
        <div className="container">
          <div className="contacts">
            {CONTACTS.map((label) => (
              <p key={label}>
                <small>{label}</small>
                <strong className="contact-off">{UNAVAILABLE}</strong>
              </p>
            ))}
          </div>
        </div>
      </section>

      <ClosingBand />
      <SiteFooter />
    </>
  );
}
