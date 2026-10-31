'use client';

import { Trash2 } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { roleLabel, useAdmin } from '@/components/AdminShell';
import { formatDate } from '@/components/CustomerTable';
import { type Admin, api, errorMessage } from '@/lib/api';

export default function AdminAdminsPage() {
  const { admin: current } = useAdmin();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isSuperadmin = current.role === 'superadmin';

  const load = useCallback(() => {
    api<{ admins: Admin[] }>('/admin/admins')
      .then((data) => setAdmins(data.admins))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  useEffect(load, [load]);

  async function createAdmin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError('');
    try {
      await api('/admin/admins', Object.fromEntries(new FormData(form)));
      form.reset();
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  async function deleteAdmin(admin: Admin) {
    if (!window.confirm(`Delete the admin "${admin.username}"? They will be logged out straight away.`)) return;
    setError('');
    try {
      await api(`/admin/admins/${admin.id}`, undefined, 'DELETE');
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  return (
    <>
      <h1>Admins</h1>
      <p className="admin-lead">{isSuperadmin ? 'Create and delete admin accounts.' : 'Only the super admin can create or delete admins.'}</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}

      {isSuperadmin && (
        <form className="box admin-form" onSubmit={createAdmin}>
          <h2>New admin</h2>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="username">Username</label>
              <input id="username" name="username" autoComplete="off" required minLength={3} maxLength={50} pattern="[A-Za-z0-9._\-]+" aria-describedby="username-hint" />
              <p className="hint" id="username-hint">
                Letters, numbers, dots, dashes and underscores.
              </p>
            </div>
            <div className="field">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" autoComplete="new-password" required minLength={8} aria-describedby="password-hint" />
              <p className="hint" id="password-hint">
                At least 8 characters.
              </p>
            </div>
          </div>
          <button className="btn" type="submit" disabled={busy}>
            Create admin
          </button>
        </form>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              <th scope="col">Role</th>
              <th scope="col">Created</th>
              {isSuperadmin && <th scope="col">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td data-label="Username">
                  <strong>{admin.username}</strong>
                </td>
                <td data-label="Role">
                  <span className={`pill ${admin.role === 'superadmin' ? 'navy' : 'plain'}`}>{roleLabel(admin.role)}</span>
                </td>
                <td data-label="Created">{formatDate(admin.createdAt)}</td>
                {isSuperadmin && (
                  <td data-label="Actions">
                    {admin.role === 'admin' ? (
                      <button className="danger-button" type="button" onClick={() => deleteAdmin(admin)} aria-label={`Delete ${admin.username}`}>
                        <Trash2 size={15} aria-hidden="true" /> Delete
                      </button>
                    ) : (
                      '—'
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
