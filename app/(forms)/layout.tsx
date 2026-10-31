import Link from 'next/link';
import type { ReactNode } from 'react';
import { CoinMark, Wordmark } from '@/components/Brand';
import { FormHeaderNote } from '@/components/FormHeaderNote';
import { SMALL_FOOTER_LINKS } from '@/content/site';

export default function FormsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="Moneystrait home">
            <CoinMark />
            <Wordmark />
          </Link>
          <FormHeaderNote />
        </div>
      </header>
      <main id="content" className="main">
        {children}
      </main>
      <footer className="small-footer">
        <div className="container">
          <p>© 2026 Halvern LLC. Moneystrait is not a bank.</p>
          <nav aria-label="Footer">
            {SMALL_FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </>
  );
}
