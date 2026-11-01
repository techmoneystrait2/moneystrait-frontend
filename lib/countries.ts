'use client';

import { useEffect, useState } from 'react';
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
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api<{ countries: Country[] }>('/countries')
      .then((data) => setCountries(data.countries))
      .catch(() => setFailed(true));
  }, []);

  return { countries, failed };
}
