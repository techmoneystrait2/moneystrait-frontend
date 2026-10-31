'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/content/site';

export function FormHeaderNote() {
  const pathname = usePathname();
  if (pathname === ROUTES.login) return null;
  return (
    <p className="form-note">
      {pathname === '/open-account' && <span className="secure">Secure application</span>}
      Already a customer? <Link href={ROUTES.login}>Log in</Link>
    </p>
  );
}
