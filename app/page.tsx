import Link from 'next/link';

const SERVICES = [
  {
    title: 'Payments',
    text: 'Pay companies or people in 150+ countries by local transfer, or 200+ countries and territories by SWIFT wire. Pay from your bank balances or from crypto.',
  },
  {
    title: 'Crypto',
    text: 'Buy or sell USDT, USDC, BTC and ETH using your company’s own bank account and wallets. When you sell, we can pay any bank account.',
  },
  {
    title: 'OTC desk',
    text: 'One firm price for the full amount, from $25,000. A named manager quotes it on WhatsApp, Telegram or in the app.',
  },
];

const AUDIENCE = [
  'Importers and traders',
  'Online sellers',
  'Payment companies',
  'Crypto businesses',
  'Teams abroad',
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Business payments · Crypto · OTC desk</p>
          <h1 className="home-title">Pay anyone abroad for less than you pay today.</h1>
          <p className="home-lead">
            Suppliers, partners or staff in 150+ countries. Send from your bank or in crypto, at a
            rate set for your business, and watch every payment arrive.
          </p>
          <div className="actions">
            <Link className="link-button" href="/signup">
              Create an account
            </Link>
            <Link className="link-button outline" href="/login">
              Log in
            </Link>
          </div>
          <ul className="ticks">
            <li>Pay companies or people</li>
            <li>No invoices needed</li>
            <li>A person you can call</li>
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2>What we offer</h2>
          <div className="grid">
            {SERVICES.map((service) => (
              <article className="tile" key={service.title}>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2>Built for businesses that move money across borders</h2>
          <p className="home-lead">For registered businesses. They can pay companies or people.</p>
          <ul className="chips">
            {AUDIENCE.map((group) => (
              <li key={group}>{group}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="band">
        <div className="container">
          <h2>Pay less on every payment abroad.</h2>
          <p>Tell us what you pay today, and we’ll offer you less.</p>
          <div className="actions">
            <Link className="link-button on-navy" href="/signup">
              Create an account
            </Link>
            <Link className="link-button on-navy-outline" href="/login">
              Log in
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
