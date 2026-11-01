// How we pay the eight popular countries. Which countries are live comes from the backend.

export interface PopularCountry {
  code: string;
  name: string;
  currency: string;
  method: string;
  time: string;
  details: string;
  aliases?: string[];
}

export const POPULAR: PopularCountry[] = [
  { code: 'CN', name: 'China', currency: 'CNY', method: 'Local CNY transfer', time: 'Same day', details: 'Account number, bank and CNAPS code' },
  { code: 'AE', name: 'United Arab Emirates', currency: 'AED', method: 'UAEFTS, or Aani', time: 'Same day', details: 'IBAN', aliases: ['UAE', 'Emirates'] },
  { code: 'SA', name: 'Saudi Arabia', currency: 'SAR', method: 'SARIE', time: 'Same day', details: 'IBAN' },
  { code: 'TR', name: 'Turkey', currency: 'TRY', method: 'FAST or EFT', time: 'Minutes', details: 'IBAN', aliases: ['Türkiye'] },
  { code: 'IN', name: 'India', currency: 'INR', method: 'IMPS, NEFT or RTGS', time: 'Same day', details: 'Account number and IFSC' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR', method: 'Raast or IBFT', time: 'Minutes', details: 'IBAN' },
  { code: 'VN', name: 'Vietnam', currency: 'VND', method: 'NAPAS 247', time: 'Minutes', details: 'Account number and bank' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT', method: 'BEFTN or RTGS', time: 'Next business day', details: 'Account and routing number' },
];

export const REGIONS = ['Asia', 'Middle East', 'Africa', 'Europe', 'Americas', 'Oceania'];
