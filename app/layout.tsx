import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Moneystrait',
  robots: { index: false },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="header">
          <a className="wordmark" href="/login" aria-label="Moneystrait home">
            MONEY<span>STRAIT</span>
          </a>
        </header>
        <main className="main">{children}</main>
        <footer className="footer">© 2026 Halvern LLC. Moneystrait is not a bank.</footer>
      </body>
    </html>
  );
}
