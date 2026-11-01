'use client';

import { Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Flag } from '@/components/Flag';
import { api, errorMessage } from '@/lib/api';
import type { AdminCountry } from '@/lib/countries';

type Filter = 'all' | 'live' | 'removed';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'live', label: 'Live' },
  { value: 'removed', label: 'Removed' },
];

export default function AdminCountriesPage() {
  const [countries, setCountries] = useState<AdminCountry[] | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api<{ countries: AdminCountry[] }>('/admin/countries')
      .then((data) => setCountries(data.countries))
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const shown = useMemo(() => {
    const words = query.trim().toLowerCase();
    return (countries ?? []).filter(
      (country) =>
        (filter === 'all' || (filter === 'live') === country.live) &&
        `${country.name} ${country.code} ${country.currency} ${country.region}`.toLowerCase().includes(words),
    );
  }, [countries, filter, query]);

  const chosen = (countries ?? []).filter((country) => selected.includes(country.code));
  const toRemove = chosen.filter((country) => country.live);
  const toAdd = chosen.filter((country) => !country.live);
  const liveCount = countries?.filter((country) => country.live).length ?? 0;
  const allShownSelected = shown.length > 0 && shown.every((country) => selected.includes(country.code));

  const toggle = (code: string) => setSelected(selected.includes(code) ? selected.filter((item) => item !== code) : [...selected, code]);

  function toggleAllShown() {
    const codes = shown.map((country) => country.code);
    setSelected(allShownSelected ? selected.filter((code) => !codes.includes(code)) : [...new Set([...selected, ...codes])]);
  }

  async function apply(action: 'remove' | 'add', list: AdminCountry[]) {
    const names = list.length === 1 ? list[0]!.name : `${list.length} countries`;
    const question = action === 'remove' ? `Remove ${names} from the Countries page?` : `Add ${names} back to the Countries page?`;
    if (!window.confirm(question)) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const data = await api<{ countries: AdminCountry[] }>(`/admin/countries/${action}`, { codes: list.map((country) => country.code) });
      setCountries(data.countries);
      setSelected([]);
      setNotice(action === 'remove' ? `${names} removed.` : `${names} added back.`);
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusy(false);
  }

  return (
    <>
      <h1>Countries</h1>
      <p className="admin-lead">{countries ? `${liveCount} of ${countries.length} shown on the Countries page. Restricted countries can’t be added.` : ' '}</p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="success" role="status">
          {notice}
        </p>
      )}

      <div className="search admin-search" role="search">
        <label className="visually-hidden" htmlFor="country-filter">
          Search countries
        </label>
        <span className="search-box">
          <Search size={16} aria-hidden="true" />
          <input id="country-filter" placeholder="Search by country, code, currency or region" value={query} maxLength={100} onChange={(event) => setQuery(event.target.value)} />
        </span>
      </div>

      <div className="tabs" role="group" aria-label="Filter countries">
        {FILTERS.map((item) => (
          <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>
            {item.label}
          </button>
        ))}
      </div>

      <div className="country-actions">
        <button className="btn outline small" type="button" disabled={shown.length === 0} onClick={toggleAllShown}>
          {allShownSelected ? 'Clear selection' : `Select all shown (${shown.length})`}
        </button>
        <button className="btn outline small danger" type="button" disabled={busy || toRemove.length === 0} onClick={() => apply('remove', toRemove)}>
          <Trash2 size={15} aria-hidden="true" /> Remove selected ({toRemove.length})
        </button>
        <button className="btn small" type="button" disabled={busy || toAdd.length === 0} onClick={() => apply('add', toAdd)}>
          <Plus size={15} aria-hidden="true" /> Add selected ({toAdd.length})
        </button>
      </div>

      {countries && shown.length === 0 && <p className="admin-empty">No countries here.</p>}
      {shown.length > 0 && (
        <ul className="box admin-country-list">
          {shown.map((country) => (
            <li key={country.code}>
              <label>
                <input type="checkbox" checked={selected.includes(country.code)} onChange={() => toggle(country.code)} />
                <Flag code={country.code} />
                <span>
                  <strong>{country.name}</strong>
                  <small>
                    {country.currency} · {country.region}
                  </small>
                </span>
                <span className={`pill ${country.live ? 'teal' : 'plain'}`}>{country.live ? 'Live' : 'Removed'}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
