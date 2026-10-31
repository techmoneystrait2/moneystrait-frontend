import {
  Building2,
  Check,
  ChevronRight,
  Coins,
  Landmark,
  Link2,
  MessageSquare,
  Package,
  Plus,
  Route,
  ShieldCheck,
  ShoppingCart,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { HomeRiver } from '@/components/Brand';
import { Flag } from '@/components/Flag';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, HeroButtons, IconTile, SectionHead, Ticks } from '@/components/ui';
import { publishedBodies } from '@/content/licences';
import { ROUTES } from '@/content/site';

const bodies = publishedBodies.join(' · ');

const TRUST = [
  ...(bodies ? [{ icon: ShieldCheck, title: 'Registered and licensed', text: bodies }] : []),
  { icon: Building2, title: 'For registered businesses', text: 'They can pay companies or people' },
  { icon: Route, title: 'Tracked to the last step', text: 'Until the money is in their account' },
  { icon: UserRound, title: 'A named manager', text: 'A person, not a ticket queue' },
];

const AUDIENCE = [
  { icon: Package, title: 'Importers and traders', text: 'Pay suppliers in China, India, Turkey and 150+ countries.', short: 'Pay suppliers in 150+ countries.', href: '/payments' },
  { icon: ShoppingCart, title: 'Online sellers', text: 'Pay manufacturers, agencies and ad bills abroad.', short: 'Pay manufacturers, agencies and ad bills.', href: '/payments' },
  { icon: Landmark, title: 'Payment companies', text: 'Remittance firms and exchange houses: payouts where you don’t reach.', short: 'Payouts where you don’t reach.', href: '/payments' },
  { icon: Coins, title: 'Crypto businesses', text: 'Turn USDT, USDC, BTC or ETH into money in a bank, and back.', short: 'Crypto to money in a bank, and back.', href: '/crypto' },
  { icon: Users, title: 'Teams abroad', text: 'Pay contractors, freelancers and remote staff on time.', short: 'Pay contractors and remote staff.', href: '/payments' },
];

const FIXES = [
  ['2.5% to 5% lost in hidden exchange rates', 'Your own rate, lower than today, in writing'],
  ['Days of waiting, and a cost you only see at the end', 'Local payouts in 150+ countries, and the exact amount before you approve'],
  ['Suppliers asking where the money is', 'Every payment tracked, with a link you can share'],
  ['Papers and invoices for every payment', 'One check when you join. No invoices after that'],
  ['Unregistered crypto sellers and frozen bank accounts', 'A registered company, and a receipt for every trade'],
  ['Large amounts at a worse price', 'One firm price for the full amount, from $25,000'],
];

const TIMELINE = [
  ['Approved', '8 Oct, 15:06', '8 Oct'],
  ['Sent', '8 Oct, 15:41', '8 Oct'],
  ['At their bank', '9 Oct, 09:20', '9 Oct'],
  ['Credited', '9 Oct, 11:02', '9 Oct'],
];

const QUESTIONS = [
  { q: 'How do you set my rate?', a: 'We talk first. Your manager asks how you pay today and offers you less. Once your account is approved, you get the rate in writing, fixed for 6 months.' },
  { q: 'Who can I pay?', a: 'Companies or people in 150+ countries by local transfer, and 200+ by SWIFT wire.' },
  {
    q: 'Are you licensed?',
    a: bodies ? (
      <>
        Moneystrait and its partners are registered with, or licensed by, {publishedBodies.join(', ')}. You can check each number on our <Link href="/licences">Licences</Link> page.
      </>
    ) : (
      <>
        Licence details are currently unavailable. They will appear on our <Link href="/licences">Licences</Link> page.
      </>
    ),
  },
  { q: 'Do I need an invoice for each payment?', a: 'No. One check when you join. No invoices after that. For a few countries, a one-tap reason, like “goods” or “services”.' },
  { q: 'Which currencies and coins can I use?', a: 'USD, EUR, GBP, AED, SAR, CAD, AUD or CHF by bank transfer, or USDT, USDC, BTC or ETH. We don’t take cards.' },
  { q: 'Can my customers pay into my account?', a: 'No. Money comes only from your company’s own bank accounts or verified wallets. Money from anyone else is sent back.' },
  { q: 'Can I add my other companies?', a: 'Yes. Add your other companies under the same login. We check you once; each new company gets its own company check.' },
  { q: 'What if you can’t beat what I pay now?', a: 'We’ll tell you. We don’t promise a saving we can’t give.' },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <HomeRiver />
        <div className="container home-hero-grid">
          <div>
            <p className="eyebrow">
              Business payments · Crypto<span className="desktop-only"> · OTC desk</span>
            </p>
            <h1 className="title-home">Pay anyone abroad for less than you pay today.</h1>
            <p className="lead desktop-only">
              Suppliers, partners or staff in 150+ countries. Send from your bank or in crypto, at a rate set for your business, and watch every payment arrive.
            </p>
            <p className="lead phone-only">Suppliers, partners or staff in 150+ countries, at a rate set for your business.</p>
            <div className="desktop-only">
              <HeroButtons>
                <Link className="btn outline" href={ROUTES.signup}>
                  Create an account
                </Link>
              </HeroButtons>
            </div>
            <div className="phone-only">
              <div className="actions">
                <Link className="btn wide" href={ROUTES.rate}>
                  Get your rate
                </Link>
                <Link className="btn outline wide" href={ROUTES.signup}>
                  Create an account
                </Link>
              </div>
            </div>
            <div className="desktop-only">
              <Ticks className="inline" items={['Pay companies or people', 'No invoices needed', 'A person you can call']} />
            </div>
          </div>

          <div className="hero-cards">
            <p className="visually-hidden">Example: a USD 48,500 payment to a supplier in China, credited the next day.</p>
            <div className="picture-card" aria-hidden="true">
              <div className="row-between">
                <div className="payee">
                  <Flag code="CN" />
                  <span>
                    <strong>Shenzhen Hongda Electronics</strong>
                    <small>Supplier · Bank of China</small>
                  </span>
                </div>
                <span className="pill teal">
                  <Check size={12} /> Credited
                </span>
              </div>
              <small className="muted">They received</small>
              <p className="big-amount">USD 48,500.00</p>
              <small className="teal-text">In full, bank charges included</small>
              <ol className="timeline">
                {TIMELINE.map(([label, long, short]) => (
                  <li key={label}>
                    <i>
                      <Check size={11} />
                    </i>
                    <strong>{label}</strong>
                    <small className="desktop-only">{long}</small>
                    <small className="phone-only">{short}</small>
                  </li>
                ))}
              </ol>
              <p className="note-bar">
                <Link2 size={13} /> Tracking link shared with your supplier
              </p>
            </div>
            <div className="picture-card small desktop-only" aria-hidden="true">
              <div className="row-between">
                <strong>Accounts in your name</strong>
                <span className="pill teal">Yours</span>
              </div>
              {[
                ['US', 'USD · Kestrel Imports LLC'],
                ['EU', 'EUR · Kestrel Imports GmbH'],
                ['GB', 'GBP · Kestrel Imports Ltd'],
              ].map(([code, label]) => (
                <p className="account-row" key={label}>
                  <Flag code={code!} /> {label}
                </p>
              ))}
            </div>
          </div>

          <div className="phone-only">
            <Ticks items={['Pay companies or people', 'No invoices needed', ...(bodies ? [bodies] : [])]} />
          </div>
        </div>
      </section>

      <section className="trust-strip">
        <div className="container trust-grid">
          {TRUST.map((item) => (
            <div key={item.title}>
              <item.icon size={20} strokeWidth={1.75} aria-hidden="true" />
              <p>
                <strong>{item.title}</strong>
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="who">
        <div className="container">
          <SectionHead eyebrow="Who it’s for" title="Built for businesses that move money across borders" />
          <div className="grid cols-3 audience">
            {AUDIENCE.map((item) => (
              <Link className="box audience-card" href={item.href} key={item.title}>
                <IconTile icon={item.icon} />
                <span className="audience-text">
                  <h3>{item.title}</h3>
                  <p className="desktop-only">{item.text}</p>
                  <p className="phone-only">{item.short}</p>
                </span>
                <ChevronRight className="phone-only" size={18} aria-hidden="true" />
              </Link>
            ))}
            <article className="box navy-card">
              <span className="icon-tile navy">
                <MessageSquare size={22} strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3>Moving $25,000 or more?</h3>
              <p>Your manager gives you one firm price for the full amount.</p>
              <Link className="btn gold" href="/otc-desk">
                Talk to the desk
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <SectionHead eyebrow="What we fix" title="What changes when you switch" />
          <div className="grid cols-3">
            {FIXES.map(([problem, answer]) => (
              <article className="box fix" key={problem}>
                <p className="problem">
                  <X size={14} aria-hidden="true" /> {problem}
                </p>
                <p className="answer">
                  <Check size={14} aria-hidden="true" /> {answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead eyebrow="How it works" title="Start in three steps" lead="From your first call to your first payment, with a person by your side." />
          <div className="grid cols-3 three-steps">
            <div>
              <div className="picture-card small step-picture" aria-hidden="true">
                <p className="manager-line">
                  <i className="avatar">SR</i> Sami · your manager
                </p>
                <p className="bubble">Tell me how you pay today. I’ll show you what you’d save.</p>
                <p className="bubble mine">Through our bank, about USD 200,000 a month.</p>
              </div>
              <h3>
                <i className="step-number">1</i> Talk to us
              </h3>
              <p>A 15-minute call or a chat. Tell us how you pay today, and we show you what you’d save.</p>
            </div>
            <div>
              <div className="picture-card small step-picture" aria-hidden="true">
                <div className="row-between">
                  <strong>Your application</strong>
                  <span className="teal-text">Approved</span>
                </div>
                <div className="progress" />
                <Ticks items={['Company details', 'Owners and directors', 'Your rate, in writing']} />
              </div>
              <h3>
                <i className="step-number">2</i> Open your account
              </h3>
              <p>One online application. We check your company once, then send your rate in writing.</p>
            </div>
            <div>
              <div className="picture-card small step-picture" aria-hidden="true">
                <div className="row-between">
                  <span className="payee">
                    <Flag code="CN" />
                    <span>
                      <strong>Shenzhen Hongda</strong>
                      <small>USD 48,500.00</small>
                    </span>
                  </span>
                  <span className="teal-text">Credited</span>
                </div>
                <div className="row-between">
                  <span className="payee">
                    <Flag code="IN" />
                    <span>
                      <strong>Priya Raman · contractor</strong>
                      <small>INR 185,000.00</small>
                    </span>
                  </span>
                  <span className="blue-text">On its way</span>
                </div>
              </div>
              <h3>
                <i className="step-number">3</i> Pay anyone, and track it
              </h3>
              <p>Add money from your company’s own bank account. Pay companies or people in 150+ countries, and follow every payment.</p>
            </div>
          </div>
          <Link className="btn top-gap" href={ROUTES.rate}>
            Get your rate
          </Link>
        </div>
      </section>

      <section className="section white" id="group">
        <div className="container split">
          <div>
            <SectionHead eyebrow="For groups" title="One login for all your companies" lead="Add your other companies under the same login. We check you once; each new company gets its own company check." />
            <Ticks items={['Accounts in each company’s own name', 'One total across all of them', 'Move money between them in a few clicks.']} />
          </div>
          <div className="picture-card" aria-hidden="true">
            <div className="row-between">
              <span>
                <small className="muted">Kestrel group</small>
                <strong className="block">3 companies</strong>
              </span>
              <span className="right">
                <small className="muted">Total</small>
                <strong className="block group-total">661,035.06 USD</strong>
              </span>
            </div>
            {[
              ['US', 'Kestrel Imports LLC', 'United States · USD', '221,354.06'],
              ['CH', 'Kestrel Imports GmbH', 'Switzerland · EUR, CHF', '325,775.00'],
              ['GB', 'Kestrel Imports Ltd', 'United Kingdom · GBP', '113,906.00'],
            ].map(([code, name, where, amount]) => (
              <div className="row-between divided" key={name}>
                <span className="payee">
                  <Flag code={code!} />
                  <span>
                    <strong>{name}</strong>
                    <small>{where}</small>
                  </span>
                </span>
                <span className="tabular">{amount}</span>
              </div>
            ))}
            <p className="add-company">
              <Plus size={14} /> Add a company
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container faq">
          <div>
            <h2>Questions</h2>
            <p>
              Something else? <Link href={ROUTES.chat}>Chat with us.</Link>
            </p>
          </div>
          <div className="faq-list">
            {QUESTIONS.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <ClosingBand />
      <SiteFooter variant="full" />
    </>
  );
}
