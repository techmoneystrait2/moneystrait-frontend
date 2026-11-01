'use client';

import { Search } from 'lucide-react';
import { type FormEvent, type KeyboardEvent, useEffect, useMemo, useState } from 'react';
import { Flag } from '@/components/Flag';
import { Unavailable } from '@/components/ui';
import { POPULAR, REGIONS } from '@/content/countries';
import { type Country, searchCountries, useLiveCountries } from '@/lib/countries';

const PICK_EVENT = 'country-pick';
const HIGHLIGHT_MS = 2000;

function highlight(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  element.classList.add('country-hit');
  setTimeout(() => element.classList.remove('country-hit'), HIGHLIGHT_MS);
}

export function CountrySearch() {
  const { countries, restricted, failed } = useLiveCountries();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [message, setMessage] = useState('');

  const results = useMemo(() => (countries && query.trim() ? searchCountries(countries, query).slice(0, 8) : []), [countries, query]);

  function pick(country: Country) {
    setQuery(country.name);
    setOpen(false);
    setMessage('');
    // A popular country goes to its table row, and any other to its chip in the region tabs.
    if (document.getElementById(`country-row-${country.code}`)) highlight(`country-row-${country.code}`);
    else window.dispatchEvent(new CustomEvent<Country>(PICK_EVENT, { detail: country }));
  }

  function search() {
    const words = query.trim();
    if (!words) return;
    const chosen = results[active];
    if (chosen) {
      pick(chosen);
      return;
    }
    setOpen(false);
    const blocked = restricted.find((place) => place.toLowerCase().includes(words.toLowerCase()));
    setMessage(blocked ? `We can’t send money to ${blocked}. We follow US sanctions.` : `We don’t list “${words}” at the moment.`);
  }

  function handleKeys(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && results.length > 0) {
      event.preventDefault();
      setOpen(true);
      setActive((active + 1) % results.length);
    } else if (event.key === 'ArrowUp' && results.length > 0) {
      event.preventDefault();
      setActive((active - 1 + results.length) % results.length);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    search();
  }

  if (failed) return <Unavailable>Country search is currently unavailable.</Unavailable>;

  const showList = open && results.length > 0;
  return (
    <div className="country-search">
      <form className="search" role="search" onSubmit={handleSubmit}>
        <label className="visually-hidden" htmlFor="country-search">
          Find a country
        </label>
        <span className="search-box">
          <Search size={16} aria-hidden="true" />
          <input
            id="country-search"
            role="combobox"
            aria-expanded={showList}
            aria-controls="country-results"
            aria-autocomplete="list"
            aria-activedescendant={showList ? `country-result-${active}` : undefined}
            autoComplete="off"
            placeholder="Find a country"
            maxLength={100}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
              setOpen(true);
              setMessage('');
            }}
            onKeyDown={handleKeys}
            onBlur={() => setOpen(false)}
          />
        </span>
        <button className="btn" type="submit">
          Search
        </button>
      </form>
      {showList && (
        <ul className="country-results" id="country-results" role="listbox" aria-label="Countries">
          {results.map((country, index) => (
            <li
              key={country.code}
              id={`country-result-${index}`}
              role="option"
              aria-selected={index === active}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => pick(country)}
            >
              <Flag code={country.code} /> {country.name} <small>{country.currency}</small>
            </li>
          ))}
        </ul>
      )}
      {message && (
        <p className="country-message" role="status">
          {message}
        </p>
      )}
    </div>
  );
}

// Only countries an admin has left live. Removing one takes it out of this table too.
export function PopularCountries() {
  const { countries, failed } = useLiveCountries();
  if (failed) return <Unavailable>The country list is currently unavailable.</Unavailable>;
  if (!countries) return null;
  const live = new Set(countries.map((country) => country.code));
  const shown = POPULAR.filter((country) => live.has(country.code));
  if (shown.length === 0) return null;
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Country</th>
            <th scope="col">How we pay</th>
            <th scope="col">Typical time</th>
            <th scope="col">Details you need</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((country) => (
            <tr key={country.code} id={`country-row-${country.code}`}>
              <td data-label="Country">
                <span className="payee">
                  <Flag code={country.code} />
                  <span>
                    <strong>{country.name}</strong>
                    <small>{country.currency}</small>
                  </span>
                </span>
              </td>
              <td data-label="How we pay">{country.method}</td>
              <td data-label="Typical time">
                <span className="pill teal">{country.time}</span>
              </td>
              <td data-label="Details you need">{country.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RegionTabs() {
  const [active, setActive] = useState(REGIONS[0]);
  const { countries, failed } = useLiveCountries();
  const shown = countries?.filter((country) => country.region === active) ?? [];

  useEffect(() => {
    function handlePick(event: Event) {
      const { code, region } = (event as CustomEvent<Country>).detail;
      setActive(region);
      // After the tab has changed, so its chip exists.
      setTimeout(() => highlight(`country-chip-${code}`));
    }
    window.addEventListener(PICK_EVENT, handlePick);
    return () => window.removeEventListener(PICK_EVENT, handlePick);
  }, []);
  return (
    <>
      <div className="tabs" role="tablist" aria-label="Regions">
        {REGIONS.map((region) => (
          <button
            key={region}
            type="button"
            role="tab"
            aria-selected={region === active}
            tabIndex={region === active ? 0 : -1}
            onClick={() => setActive(region)}
            onKeyDown={(event) => {
              const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
              if (!step) return;
              const next = REGIONS[(REGIONS.indexOf(region) + step + REGIONS.length) % REGIONS.length]!;
              setActive(next);
              (event.currentTarget.parentElement?.querySelector(`[data-region="${next}"]`) as HTMLElement | null)?.focus();
            }}
            data-region={region}
          >
            {region}
          </button>
        ))}
      </div>
      <div className="box" role="tabpanel">
        {failed && <p className="unavailable">The country list is currently unavailable.</p>}
        {countries && shown.length === 0 && <p className="muted">No countries listed here at the moment.</p>}
        {shown.length > 0 && (
          <ul className="country-chips">
            {shown.map((country) => (
              <li key={country.code} id={`country-chip-${country.code}`}>
                <Flag code={country.code} /> {country.name} <small>{country.currency}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
