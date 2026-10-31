'use client';

import { Search } from 'lucide-react';
import { useState } from 'react';
import { Flag } from '@/components/Flag';
import { Unavailable } from '@/components/ui';
import { ASIA, REGIONS } from '@/content/countries';

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

export function RegionTabs() {
  const [active, setActive] = useState(REGIONS[0]);
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
        {active === 'Asia' ? (
          <ul className="country-chips">
            {ASIA.map((country) => (
              <li key={country.code}>
                <Flag code={country.code} /> {country.name} <small>{country.currency}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className="unavailable">The {active} list is currently unavailable.</p>
        )}
      </div>
    </>
  );
}
