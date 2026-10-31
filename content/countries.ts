// Seed data until the CMS and the partners' final list exist (brief 5.6).

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

export const ASIA = [
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'PK', name: 'Pakistan', currency: 'PKR' },
  { code: 'BD', name: 'Bangladesh', currency: 'BDT' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'CN', name: 'China', currency: 'CNY' },
  { code: 'NP', name: 'Nepal', currency: 'NPR' },
  { code: 'LK', name: 'Sri Lanka', currency: 'LKR' },
  { code: 'VN', name: 'Vietnam', currency: 'VND' },
  { code: 'ID', name: 'Indonesia', currency: 'IDR' },
  { code: 'TH', name: 'Thailand', currency: 'THB' },
  { code: 'MY', name: 'Malaysia', currency: 'MYR' },
  { code: 'SG', name: 'Singapore', currency: 'SGD' },
  { code: 'HK', name: 'Hong Kong', currency: 'HKD' },
  { code: 'JP', name: 'Japan', currency: 'JPY' },
  { code: 'KR', name: 'South Korea', currency: 'KRW' },
  { code: 'UZ', name: 'Uzbekistan', currency: 'UZS' },
];
