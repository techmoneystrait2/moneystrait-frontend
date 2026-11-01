import { ArrowLeftRight, ArrowRightToLine, Check, Clock, Coins, Lock } from 'lucide-react';
import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, FeatureCards, HeroButtons, KeyValues, NumberedSteps, SectionHead, Unavailable } from '@/components/ui';
import { ROUTES } from '@/content/site';

export const metadata: Metadata = {
  title: 'OTC desk from $25,000 · Moneystrait',
  description: 'Large crypto trades, conversions and payments at one firm price, quoted by your own manager.',
};

export default function OtcDeskPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">OTC desk · from $25,000</p>
            <h1>Large deals, one firm price.</h1>
            <p className="lead">Your manager quotes the full amount on WhatsApp, Telegram or in the app. You accept, and we settle.</p>
            <dl className="facts">
              <div>
                <dt>$25,000+</dt>
                <dd>Per deal</dd>
              </div>
              <div>
                <dt>Minutes</dt>
                <dd>From request to price</dd>
              </div>
              <div>
                <dt>1 manager</dt>
                <dd>Named, for your company</dd>
              </div>
            </dl>
            <HeroButtons primary="Talk to the desk" primaryHref={ROUTES.rate} chat="Chat on WhatsApp" />
          </div>
          <div className="picture-card chat" aria-hidden="true">
            <div className="row-between chat-head">
              <span className="payee">
                <i className="avatar">SR</i>
                <span>
                  <strong>Sami Rahman</strong>
                  <small>Your manager</small>
                </span>
              </span>
              <small className="teal-text">● Online</small>
            </div>
            <p className="bubble mine">Hi Sami. We need USDT for USD 1,000,000 today, on TRON.<small>14:31</small></p>
            <p className="bubble">Hi Anna. Your firm price is in the app.<small>14:33</small></p>
            <div className="quote">
              <div className="row-between">
                <strong>Desk quote</strong>
                <small className="with-icon">
                  <Lock size={11} /> Only your team sees it
                </small>
              </div>
              <KeyValues
                rows={[
                  ['You pay', 'USD 1,000,000.00'],
                  ['You get', 'USDT'],
                  ['Network', 'TRON (TRC-20)'],
                ]}
              />
              <p className="quote-timer">
                <Clock size={12} /> Price fixed for <b>01:45</b>
              </p>
            </div>
            <p className="bubble mine">Accepted in the app. Sending the USD now.<small>14:34</small></p>
            <p className="bubble">Thanks, Anna. I’ll message you the moment the USDT is sent.<small>14:34</small></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="How a desk deal works" />
          <NumberedSteps
            steps={[
              { title: 'Ask', text: 'Tell your manager the amount and what you need. On WhatsApp, Telegram or in the app.' },
              { title: 'Accept', text: 'You get one firm price for the full amount. Accept it in the app, so it’s on record.' },
              { title: 'Settle', text: 'Send your money or coins. We send the coins or make the payment, with a receipt.' },
            ]}
          />
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead title="What the desk handles" />
          <FeatureCards
            items={[
              { icon: Coins, title: 'Large crypto trades', text: 'Buy or sell USDT, USDC, BTC or ETH in one trade, on the network you use.' },
              { icon: ArrowLeftRight, title: 'Large conversions', text: 'Between USD, EUR, GBP, AED, SAR, CAD, AUD and CHF, at one price.' },
              { icon: ArrowRightToLine, title: 'Large payments', text: 'One big payment to anyone abroad, followed by your manager until it arrives.' },
            ]}
          />
          <p className="strip">
            <Check size={16} aria-hidden="true" />
            <span>
              <strong>The price you accept is the price you pay.</strong> No slippage, no extra fees after.
            </span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container split">
          <SectionHead title="A manager who knows your business" lead="The same person every time. Message them when you need a price, or when you want to know where your money is." />
          <article className="box">
            <h3>Your desk contact</h3>
            <Unavailable>WhatsApp, Telegram and email for the desk are currently unavailable.</Unavailable>
            <small className="muted">Already a customer? Ask in the app for the fastest reply.</small>
          </article>
        </div>
      </section>

      <ClosingBand heading="Talk to the desk." line="From $25,000. One firm price for the full amount." button="Talk to the desk" href={ROUTES.rate} />
      <SiteFooter />
    </>
  );
}
