import Link from 'next/link';
import { CoinMark, Wordmark } from '@/components/Brand';
import { regulatorSentence } from '@/content/licences';
import { COMPACT_FOOTER_LINKS, FOOTER_COLUMNS } from '@/content/site';

function LegalText() {
  const regulators = regulatorSentence();
  return (
    <p className="legal-text">
      Moneystrait is a trading name of Halvern LLC, [registered address].{' '}
      {regulators && `${regulators} `}Details are on our <Link href="/licences">Licences</Link> page. Accounts are held with
      our partner banks. Accounts are for registered businesses, funded only from their own bank accounts or wallets, and
      can pay companies or people. Services are not available in every jurisdiction. Moneystrait is not a bank and not a
      stablecoin issuer. Crypto assets are not bank deposits and are not covered by deposit insurance; they can lose some
      or all of their value and can be extremely volatile.
    </p>
  );
}

export function SiteFooter({ variant = 'compact' }: { variant?: 'full' | 'compact' }) {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className={`footer-top ${variant}`}>
          <div className="footer-brand">
            <span className="footer-logo">
              {variant === 'full' && <CoinMark dark />}
              <Wordmark dark />
            </span>
            <p>Pay abroad. Pay less.</p>
          </div>
          {variant === 'full' ? (
            <div className="footer-columns">
              {FOOTER_COLUMNS.map((column) => (
                <div key={column.title}>
                  <h2>{column.title}</h2>
                  {column.links.map((link) => (
                    <Link key={link.label} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <nav className="footer-row" aria-label="Footer">
              {COMPACT_FOOTER_LINKS.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
        <LegalText />
        <p className="copyright">© 2026 Halvern LLC</p>
      </div>
    </footer>
  );
}
