import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, HeroButtons, KeyValues, NumberedSteps, SectionHead, Ticks } from '@/components/ui';
import { ROUTES } from '@/content/site';

export const metadata: Metadata = {
  title: 'Your own rate · Moneystrait',
  description: 'No price list. Tell us what you pay today, and we offer you less, in writing.',
};

const ANSWERS = [
  ['Why no price list?', 'Businesses pay on different routes and amounts. One list makes some pay too much and others too little.'],
  ['Can’t beat your rate?', 'We’ll tell you. We don’t promise a saving we can’t give.'],
  ['Can my rate go up?', 'Not during the 6 months. At each review, more volume means a lower rate.'],
  ['How do I pay?', 'By transfer from your company’s bank account, or in USDT, USDC, BTC or ETH. We don’t take cards.'],
];

export default function PricingPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">Pricing</p>
            <h1>Your own rate, lower than you pay today.</h1>
            <p className="lead">No price list. Tell us what you pay now, and we offer less, in writing. Before every payment, you see the exact amount.</p>
            <HeroButtons />
          </div>
          <div className="picture-card" aria-hidden="true">
            <div className="row-between">
              <strong>Your rate letter</strong>
              <span className="pill amber">Private</span>
            </div>
            <small className="muted">Prepared for Kestrel Imports GmbH</small>
            <KeyValues
              rows={[
                ['Your rate', 'Lower than you pay today'],
                ['Includes', 'Our margin, fee and bank charges'],
                ['Fixed for', '6 months'],
                ['Review', 'Every 6 months'],
              ]}
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="How we set your rate" />
          <NumberedSteps
            steps={[
              { title: 'Tell us what you pay today', text: 'A short form, then a 15-minute call or chat. No documents.' },
              { title: 'We find you a lower rate', text: 'We compare what you pay with the market, fees included.' },
              { title: 'You get it in writing', text: 'Once your account is approved. If we can’t beat your rate, we say so.' },
            ]}
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container grid cols-2">
          <article className="box">
            <h3>What your rate includes</h3>
            <Ticks items={['Our exchange margin and our fee, in one number', 'Bank charges on SWIFT wires, so the full amount arrives', 'Network fees when you buy or sell crypto', 'No monthly fee and no setup fee']} />
          </article>
          <article className="box">
            <h3>What stays fixed</h3>
            <Ticks items={['Your rate, for 6 months. It never goes up in that time.', 'The exact amount, shown before you approve each payment', 'A review every 6 months: more volume, lower rate']} />
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="navy-strip">
            <div>
              <p className="eyebrow gold">Large amounts</p>
              <h2>From $25,000, your manager quotes one firm price for the full amount.</h2>
            </div>
            <Link className="btn gold" href={ROUTES.rate}>
              Talk to the desk
            </Link>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead title="Good to know" />
          <div className="grid cols-2">
            {ANSWERS.map(([question, answer]) => (
              <article className="box" key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ClosingBand />
      <SiteFooter />
    </>
  );
}
