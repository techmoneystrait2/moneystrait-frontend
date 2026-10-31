'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { api, type User } from '@/lib/api';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api<{ user: User }>('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => router.replace('/login'));
  }, [router]);

  async function logOut() {
    await api('/auth/logout', {});
    router.replace('/login');
  }

  if (!user) return null;

  return (
    <div className="card">
      <h1>Hello, {user.name}</h1>
      <p className="lead">{user.email}</p>
      <button className="button" type="button" onClick={logOut}>
        Log out
      </button>
    </div>
  );
}
