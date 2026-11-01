'use client';

import { ChevronRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CoinMark, Wordmark } from '@/components/Brand';
import { HEADER_LINKS, MENU_ROWS, ROUTES } from '@/content/site';

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    sheet.current?.querySelector<HTMLElement>('button, a')?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !sheet.current) return;
      const items = sheet.current.querySelectorAll<HTMLElement>('button, a');
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    const button = menuButton.current;
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKeyDown);
      button?.focus();
    };
  }, [open]);

  const brand = (
    <Link className="brand" href="/" aria-label="Moneystrait home">
      <CoinMark />
      <Wordmark />
    </Link>
  );

  return (
    <header className="site-header">
      <div className="header-inner">
        {brand}
        <nav className="header-nav" aria-label="Main">
          {HEADER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          <Link className="header-login" href={ROUTES.login}>
            Log in
          </Link>
          <Link className="btn small header-rate" href={ROUTES.rate}>
            Get your rate
          </Link>
          <button ref={menuButton} className="menu-button" type="button" aria-label="Open menu" aria-expanded={open} aria-controls={open ? 'site-menu' : undefined} onClick={() => setOpen(true)}>
            <Menu size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {open && (
        <div className="menu-sheet" id="site-menu" role="dialog" aria-modal="true" aria-label="Menu" ref={sheet}>
          <div className="menu-top">
            {brand}
            <button className="menu-button" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X size={20} aria-hidden="true" />
            </button>
          </div>
          <nav className="menu-rows" aria-label="Phone">
            {MENU_ROWS.map((row) => (
              <Link key={row.href} href={row.href} onClick={() => setOpen(false)}>
                <span>
                  <strong>{row.label}</strong>
                  {row.text}
                </span>
                <ChevronRight size={18} aria-hidden="true" />
              </Link>
            ))}
          </nav>
          <div className="menu-bottom">
            <Link className="btn" href={ROUTES.rate} onClick={() => setOpen(false)}>
              Get your rate
            </Link>
            <Link className="btn outline" href={ROUTES.login} onClick={() => setOpen(false)}>
              Log in
            </Link>
            <p>For registered businesses</p>
          </div>
        </div>
      )}
    </header>
  );
}
