import { Download, Info, Receipt, ShieldCheck, TriangleAlert, Upload, Wallet } from 'lucide-react';
import type { Metadata } from 'next';
import { CoinBadge } from '@/components/Flag';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, Crosses, FeatureCards, HeroButtons, IconTile, KeyValues, SectionHead, Ticks } from '@/components/ui';
import { publishedBodies } from '@/content/licences';

export const metadata: Metadata = {
  title: 'Buy and sell USDT, USDC, BTC and ETH · Moneystrait',
  description: 'Turn crypto into money in a bank, and back, with your company’s own bank account and wallets. A receipt for every trade.',
};

const COINS = [
  { letter: 'T', name: 'USDT', full: 'Tether dollar', networks: ['TRON (TRC-20)', 'Ethereum (ERC-20)', 'BNB Smart Chain (BEP-20)', 'Solana'], note: 'Not for companies in the EU or EEA.' },
  { letter: 'C', name: 'USDC', full: 'Circle dollar', networks: ['Ethereum (ERC-20)', 'Solana', 'BNB Smart Chain (BEP-20)'] },
  { letter: 'B', name: 'BTC', full: 'Bitcoin', networks: ['Bitcoin'] },
  { letter: 'E', name: 'ETH', full: 'Ether', networks: ['Ethereum'] },
] as const;

const WAYS = [
  {
    title: 'Buy',
    tag: 'Money to crypto',
    steps: [
      ['Add money', 'From your business bank account, or use your balance.'],
      ['Confirm the price', 'See exactly what you get, then confirm.'],
      ['Receive the coins', 'In your verified wallet, or kept in your balance.'],
    ],
  },
  {
    title: 'Sell',
    tag: 'Crypto to money',
    steps: [
      ['Tell us who to pay', 'Yourself or anyone else, and how much.'],
      ['Send the coins', 'To your own deposit address, or sell from your balance.'],
      ['We pay', 'By local transfer in 150+ countries, or SWIFT wire to 200+.'],
    ],
  },
];

export default function CryptoPage() {
  const compare = [
    ...(publishedBodies.length ? [`Registered and licensed: ${publishedBodies.join(', ')}`] : []),
    'Money moves from your business account',
    'Receipts and statements',
    'One trade, one price, any size',
    'A named manager you can call',
  ];

  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">Crypto</p>
            <h1>Turn crypto into money in a bank, and back.</h1>
            <p className="lead">Buy or sell USDT, USDC, BTC and ETH using your company’s own bank account and wallets. When you sell, we can pay any bank account.</p>
            <div className="notes">
              <div>
                <IconTile icon={Download} />
                <p>
                  <strong>Buy: money to crypto</strong>
                  Pay in USD, EUR, GBP, AED, SAR, CAD, AUD or CHF. We send the coins to your wallet.
                </p>
              </div>
              <div>
                <IconTile icon={Upload} />
                <p>
                  <strong>Sell: crypto to money</strong>
                  Send coins from your own wallet. We pay you, or anyone else, by local transfer or SWIFT.
                </p>
              </div>
            </div>
            <HeroButtons />
          </div>
          <div className="picture-card" aria-hidden="true">
            <div className="row-between">
              <span className="segmented">
                <b>Buy</b>
                <span>Sell</span>
              </span>
              <span className="pill teal">Network fee included</span>
            </div>
            <small className="chip-label">Coin</small>
            <ul className="mini-chips">
              {COINS.map((coin) => (
                <li key={coin.name} className={coin.name === 'USDT' ? 'on' : ''}>
                  <CoinBadge letter={coin.letter} /> {coin.name}
                </li>
              ))}
            </ul>
            <small className="chip-label">Network</small>
            <ul className="mini-chips plain">
              <li className="filled">TRON</li>
              <li>Ethereum</li>
              <li>BNB Smart Chain</li>
              <li>Solana</li>
            </ul>
            <KeyValues
              rows={[
                ['You pay', 'USD 100,000.00'],
                ['From', 'Kestrel Imports LLC'],
                ['To', 'Kestrel treasury · verified'],
                ['Your price', <span className="teal-text" key="price">Shown before you confirm</span>],
              ]}
            />
            <span className="btn wide fake">Get your rate</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Four coins, five networks" lead="Pick the network your wallet uses. We show it on every screen." />
          <div className="grid cols-4">
            {COINS.map((coin) => (
              <article className="box" key={coin.name}>
                <div className="coin-head">
                  <CoinBadge letter={coin.letter} />
                  <span>
                    <strong>{coin.name}</strong>
                    <small>{coin.full}</small>
                  </span>
                </div>
                <ul className="mini-chips plain">
                  {coin.networks.map((network) => (
                    <li key={network}>{network}</li>
                  ))}
                </ul>
                {'note' in coin && <small className="muted">{coin.note}</small>}
              </article>
            ))}
          </div>
          <p className="warning">
            <TriangleAlert size={16} aria-hidden="true" />
            <span>
              <strong>Always send on the network shown.</strong> Coins sent on the wrong network can be lost.
            </span>
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead title="How it works" lead="Three steps each way. You see the exact amount before you confirm." />
          <div className="grid cols-2">
            {WAYS.map((way) => (
              <article className="box" key={way.title}>
                <h3 className="with-tag">
                  {way.title} <span className="tag">{way.tag}</span>
                </h3>
                <ol className="inline-steps">
                  {way.steps.map(([title, text], index) => (
                    <li key={title}>
                      <span>0{index + 1}</span>
                      <p>
                        <strong>{title}</strong>
                        {text}
                      </p>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Safe, without the hassle" lead="The checks happen in the background. You just trade." />
          <FeatureCards
            items={[
              { icon: Wallet, title: 'Add your wallet once', text: 'Show it’s yours with a small test transfer. Then use it as often as you like.' },
              { icon: ShieldCheck, title: 'Checked in the background', text: 'Every transfer is screened automatically. Nothing for you to do.' },
              { icon: Receipt, title: 'A receipt for every trade', text: 'Price, amount and transaction ID, ready for your accountant.' },
            ]}
          />
        </div>
      </section>

      <section className="section white">
        <div className="container">
          <SectionHead title="Why not buy from unregistered sellers?" lead="Buying from unregistered sellers can end with a frozen bank account, or coins that never arrive." />
          <div className="grid cols-2">
            <article className="box tinted">
              <h3>Unregistered sellers</h3>
              <Crosses items={['Unknown people', 'Your bank account can be frozen', 'Chat screenshots as records', 'Many small trades for large amounts', 'On your own if something goes wrong']} />
            </article>
            <article className="box outlined">
              <h3>Moneystrait</h3>
              <Ticks className="strong" items={compare} />
            </article>
          </div>
          <p className="warning neutral">
            <Info size={16} aria-hidden="true" />
            <span>Crypto can lose some or all of its value and its price can swing sharply. It is not a bank deposit.</span>
          </p>
        </div>
      </section>

      <ClosingBand heading="Buy or sell your first crypto." line="Over $25,000? Our desk gives you one firm price." />
      <SiteFooter />
    </>
  );
}
