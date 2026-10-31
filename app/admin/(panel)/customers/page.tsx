'use client';

import { Search } from 'lucide-react';
import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { CustomerTable } from '@/components/CustomerTable';
import { api, type Customer, errorMessage } from '@/lib/api';

interface CustomerPage {
  customers: Customer[];
  page: number;
  pages: number;
  total: number;
}

export default function AdminCustomersPage() {
  const [draft, setDraft] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CustomerPage | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [emailed, setEmailed] = useState(true);

  const load = useCallback(() => {
    const query = new URLSearchParams({ page: String(page), search });
    api<CustomerPage>(`/admin/customers?${query}`)
      .then(setData)
      .catch((err) => setError(errorMessage(err)));
  }, [page, search]);

  useEffect(load, [load]);

  async function deleteCustomer(customer: Customer) {
    const question = `Delete the account of ${customer.name} (${customer.email})? They can no longer log in, and we’ll email them. This can’t be undone.`;
    if (!window.confirm(question)) return;
    setError('');
    setNotice('');
    try {
      const { emailSent } = await api<{ emailSent: boolean }>(`/admin/customers/${customer.id}`, undefined, 'DELETE');
      setNotice(
        emailSent
          ? `${customer.email} has been deleted, and they’ve been emailed.`
          : `${customer.email} has been deleted, but the email could not be sent. Check the email settings.`,
      );
      setEmailed(emailSent);
      load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setPage(1);
    setSearch(draft.trim());
  }

  return (
    <>
      <h1>Customers</h1>
      <p className="admin-lead">{data ? `${data.total.toLocaleString('en-GB')} in total` : ' '}</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className={emailed ? 'success' : 'error'} role="status">
          {notice}
        </p>
      )}
      <form className="search admin-search" role="search" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="customer-search">
          Search customers
        </label>
        <span className="search-box">
          <Search size={16} aria-hidden="true" />
          <input
            id="customer-search"
            placeholder="Search by name or email"
            value={draft}
            maxLength={100}
            onChange={(event) => setDraft(event.target.value)}
          />
        </span>
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      {data && <CustomerTable customers={data.customers} onDelete={deleteCustomer} />}
      {data && data.pages > 1 && (
        <div className="pager">
          <button className="btn outline small" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {data.page} of {data.pages}
          </span>
          <button className="btn outline small" type="button" disabled={page >= data.pages} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </>
  );
}
