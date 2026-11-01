'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Flag } from '@/components/Flag';
import { Unavailable } from '@/components/ui';
import { POPULAR, REGIONS } from '@/content/countries';
import { useLiveCountries } from '@/lib/countries';

export function CountrySearch() {
  return (
    <>
      <fieldset disabled className="search form-off">
        <label className="visually-hidden" htmlFor="country-search">
          Find a country
        </label>
        <span className="search-box">
          <Search size={16} aria-hidden="true" />
          <input id="country-search" placeholder="Find a country" />
        </span>
        <button className="btn" type="button">
          Search
        </button>
      </fieldset>
      <Unavailable>Country search is currently unavailable.</Unavailable>
    </>
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
            <tr key={country.code}>
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
              <li key={country.code}>
                <Flag code={country.code} /> {country.name} <small>{country.currency}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
