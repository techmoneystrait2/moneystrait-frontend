'use client';

import { useEffect, useState } from 'react';
import { COUNTRY_ALIASES } from '@/content/countries';
import { api } from '@/lib/api';

export interface Country {
  code: string;
  name: string;
  region: string;
  currency: string;
}

export interface AdminCountry extends Country {
  live: boolean;
}

// The countries admins have left live. Read in the browser, so a change shows with no deploy.
export function useLiveCountries() {
  const [countries, setCountries] = useState<Country[] | null>(null);
  const [restricted, setRestricted] = useState<string[]>([]);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<{ countries: Country[]; restricted: string[] }>('/countries')
      .then((data) => {
        setCountries(data.countries);
        setRestricted(data.restricted);
      })
      .catch(() => setFailed(true));
  }, []);

  return { countries, restricted, failed };
}

// Matches names, other names, ISO codes and currency codes: typing "PKR" finds Pakistan.
export function searchCountries(countries: Country[], query: string): Country[] {
  const typed = query.trim().toLowerCase();
  const words = typed.split(/\s+/);
  const matches = countries.filter((country) => {
    const text = `${country.name} ${country.code} ${country.currency} ${COUNTRY_ALIASES[country.code] ?? ''}`.toLowerCase();
    return words.every((word) => text.includes(word));
  });
  // Names starting with what was typed come first, so "India" finds India before Indian Ocean.
  const rank = (country: Country) => (country.name.toLowerCase() === typed ? 0 : country.name.toLowerCase().startsWith(typed) ? 1 : 2);
  return matches.sort((a, b) => rank(a) - rank(b));
}
