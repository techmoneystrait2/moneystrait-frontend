import { Check, Globe, Landmark } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CoinBadge, Flag } from '@/components/Flag';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, HeroButtons, KeyValues, NumberedSteps, SectionHead, Ticks } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Pay companies and people abroad · Moneystrait',
  description: 'Local transfers to 150+ countries and SWIFT wires to 200+, tracked until the money arrives. No invoices needed.',
};

const CURRENCIES = [
  ['US', 'USD'],
  ['EU', 'EUR'],
  ['GB', 'GBP'],
  ['AE', 'AED'],
  ['SA', 'SAR'],
  ['CA', 'CAD'],
  ['AU', 'AUD'],
  ['CH', 'CHF'],
] as const;

const COINS = [
  ['T', 'USDT'],
  ['C', 'USDC'],
  ['B', 'BTC'],
  ['E', 'ETH'],
] as const;

export default function PaymentsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">Payments</p>
            <h1>Pay anyone abroad, in their own currency.</h1>
            <p className="lead">Companies or people in 150+ countries by local transfer, and 200+ by SWIFT wire. Pay from your bank balances or from crypto.</p>
            <p className="chip-label">Pay from</p>
            <ul className="mini-chips">
              {CURRENCIES.map(([code, label]) => (
                <li key={label}>
                  <Flag code={code} /> {label}
                </li>
              ))}
              {COINS.map(([letter, label]) => (
                <li key={label}>
                  <CoinBadge letter={letter} /> {label}
                </li>
              ))}
            </ul>
            <HeroButtons />
          </div>
          <div className="picture-card" aria-hidden="true">
            <div className="row-between">
              <strong>New payment</strong>
              <span className="pill teal">No invoice needed</span>
            </div>
            <div className="saved-payee row-between">
              <span className="payee">
                <Flag code="CN" />
                <span>
                  <strong>Shenzhen Hongda Electronics</strong>
                  <small>Bank of China · •••• 6688</small>
                </span>
              </span>
              <small className="teal-text">Saved</small>
            </div>
            <small className="muted">They receive</small>
            <p className="big-amount">USD 48,500.00</p>
            <KeyValues
              rows={[
                ['Pay from', 'USD · Kestrel Imports LLC'],
                ['How', 'SWIFT wire · tracked'],
                ['Arrives', 'By Mon 12 Oct'],
                ['Bank charges', 'Included'],
                ['Your price', <span className="teal-text" key="price">Shown before you approve</span>],
              ]}
            />
            <span className="btn wide fake">Review and approve</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="How a payment works" lead="Four steps, and nothing to upload." />
          <NumberedSteps
            steps={[
              { title: 'Choose who to pay', text: 'A company or a person, with their bank details. Saved for next time.' },
              { title: 'Enter the amount', text: 'See exactly what they receive and when it arrives.' },
              { title: 'Approve', text: 'Over USD 25,000, a second person on your team can approve.' },
              { title: 'Track it', text: 'Follow every step, and share a link with the person you paid.' },
            ]}
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead title="Local transfer or SWIFT wire?" lead="We pick the faster one for each payment. You can always change it." />
          <div className="grid cols-2">
            <article className="box">
              <h3 className="with-icon">
                <Landmark size={18} aria-hidden="true" /> Local transfer
              </h3>
              <KeyValues
                rows={[
                  ['Where', '150+ countries'],
                  ['Currency', 'Their own currency'],
                  ['Typical time', 'Minutes to 1 business day'],
                  ['Bank charges', 'Included'],
                ]}
              />
            </article>
            <article className="box">
              <h3 className="with-icon">
                <Globe size={18} aria-hidden="true" /> SWIFT wire
              </h3>
              <KeyValues
                rows={[
                  ['Where', '200+ countries and territories'],
                  ['Currency', 'USD, EUR or GBP'],
                  ['Typical time', '1 to 2 business days'],
                  ['Bank charges', 'Included'],
                  ['Standard', 'ISO 20022 payment messages'],
                  ['Proof', 'Tracking number and bank copy'],
                ]}
              />
            </article>
          </div>
          <p className="after-grid">
            Either way, we pay the bank charges, so the full amount arrives. <Link href="/countries">See every country we pay →</Link>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <div>
            <SectionHead title="Tracked until it’s paid" lead="Banks stop at “sent”. We show every step until the money is in their account." />
            <Ticks items={['Live status at every step', 'Proof of payment as a PDF', 'A tracking link for the person you pay']} />
          </div>
          <div className="picture-card" aria-hidden="true">
            <div className="row-between">
              <span>
                <small className="muted">Shenzhen Hongda Electronics</small>
                <strong className="block">USD 48,500.00</strong>
              </span>
              <span className="pill blue">In progress</span>
            </div>
            <ol className="track">
              <li className="done">
                <i><Check size={11} /></i>
                <span><strong>Approved by J. Brunner</strong><small>8 Oct, 15:06</small></span>
              </li>
              <li className="done">
                <i><Check size={11} /></i>
                <span><strong>Sent by SWIFT</strong><small>8 Oct, 15:41</small></span>
              </li>
              <li className="now">
                <i />
                <span><strong>At their bank</strong><small>Bank of China, Shenzhen · now</small></span>
              </li>
              <li>
                <i />
                <span>Credited to their account</span>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container grid cols-2">
          <article className="box">
            <h3>All we need for a payment</h3>
            <Ticks items={['Who you’re paying, and their bank details', 'The amount', 'For a few countries, a one-tap reason, like “goods” or “services”']} />
          </article>
          <article className="box">
            <h3>Paying suppliers in China</h3>
            <p>Payments to China often come back when details don’t match. Before your first payment to a new supplier, we check its bank details for you.</p>
          </article>
        </div>
      </section>

      <ClosingBand />
      <SiteFooter />
    </>
  );
}
