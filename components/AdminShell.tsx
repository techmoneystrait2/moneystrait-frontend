'use client';

import { LogOut, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { CoinMark, Wordmark } from '@/components/Brand';
import { ADMIN_NAV, UNAVAILABLE_SECTIONS } from '@/content/adminNav';
import { type Admin, api, ApiError } from '@/lib/api';

interface AdminContextValue {
  admin: Admin;
  setAdmin: (admin: Admin) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function useAdmin(): AdminContextValue {
  const value = useContext(AdminContext);
  if (!value) throw new Error('useAdmin must be used inside AdminShell');
  return value;
}

export function roleLabel(role: Admin['role']): string {
  return role === 'superadmin' ? 'Super admin' : 'Admin';
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  // Only a refused session goes to the login. A lost connection keeps the admin logged in.
  useEffect(() => {
    api<{ admin: Admin }>('/admin/me')
      .then((data) => setAdmin(data.admin))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) router.replace('/admin/login');
        else setFailed(true);
      });
  }, [router]);

  const logOut = useCallback(async () => {
    await api('/admin/logout', {});
    router.replace('/admin/login');
  }, [router]);

  if (!admin) {
    return failed ? (
      <p className="error" role="alert">
        We can’t reach Moneystrait. Check your connection and reload the page.
      </p>
    ) : null;
  }

  const links = ADMIN_NAV.filter((item) => !item.superadminOnly || admin.role === 'superadmin');
  const navLink = (item: (typeof ADMIN_NAV)[number]) => (
    <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>
      <item.icon size={17} strokeWidth={1.75} aria-hidden="true" /> {item.label}
    </Link>
  );

  return (
    <div className="admin">
      <aside className={`admin-side ${open ? 'open' : ''}`}>
        <div className="admin-brand">
          <Link className="brand" href="/admin" aria-label="Admin home">
            <CoinMark dark />
            <Wordmark dark />
          </Link>
          <button className="admin-menu" type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Admin">
          {links.map(navLink)}
          <p className="admin-nav-label">Coming later</p>
          {UNAVAILABLE_SECTIONS.map(navLink)}
        </nav>
      </aside>

      <div className="admin-body">
        <header className="admin-top">
          <button className="admin-menu" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={20} aria-hidden="true" />
          </button>
          <p>
            <strong>{admin.username}</strong> <span className="pill navy">{roleLabel(admin.role)}</span>
          </p>
          <button className="admin-logout" type="button" onClick={logOut}>
            <LogOut size={16} aria-hidden="true" /> Log out
          </button>
        </header>
        <main id="content" className="admin-main">
          <AdminContext.Provider value={{ admin, setAdmin }}>{children}</AdminContext.Provider>
        </main>
      </div>
    </div>
  );
}
