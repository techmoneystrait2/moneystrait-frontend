// Stands in for the CMS licence records until a CMS exists (brief 5.9, 7.1).
// A body appears anywhere on the site only while `published` is true.
// Set it to true only once the real number is filled in and the evidence is on file.

export interface Licence {
  body: string;
  covers: string;
  securityCovers: string;
  number: string;
  registerName: string;
  registerUrl?: string;
  published: boolean;
}

export const LICENCES: Licence[] = [
  {
    body: 'FinCEN',
    covers: 'Money services business (MSB)',
    securityCovers: 'Money services business (MSB)',
    number: '[MSB registration no.]',
    registerName: 'FinCEN MSB search',
    registerUrl: 'https://www.fincen.gov/financial_institutions/msb/msbstateselector.html',
    published: false,
  },
  {
    body: 'State regulators',
    covers: 'Money transmitter licences in [states]',
    securityCovers: '',
    number: 'NMLS ID [number]',
    registerName: 'NMLS Consumer Access',
    registerUrl: 'https://www.nmlsconsumeraccess.org',
    published: false,
  },
  {
    body: 'FINTRAC',
    covers: 'Money services business (MSB)',
    securityCovers: 'Money services business (MSB)',
    number: '[MSB registration no.]',
    registerName: 'FINTRAC MSB registry',
    registerUrl: 'https://www.fintrac-canafe.canada.ca/msb-esm/reg-eng',
    published: false,
  },
  {
    body: 'VARA',
    covers: 'Virtual asset service provider (VASP)',
    securityCovers: 'Virtual asset service provider (VASP)',
    number: '[Licence no.]',
    registerName: 'VARA public register',
    registerUrl: 'https://www.vara.ae/en/licenses-and-register/public-register/',
    published: false,
  },
  {
    body: 'MiCA',
    covers: 'Crypto-asset services, authorised by [regulator]',
    securityCovers: 'Crypto-asset service provider (CASP)',
    number: '[Authorisation no.]',
    registerName: 'ESMA register',
    published: false,
  },
];

// Shows the ISO/IEC 27001 item. Turn on only with a real certificate.
export const ISO_27001_CERTIFICATE: string | null = null;

export const publishedLicences = LICENCES.filter((licence) => licence.published);

// The bodies named in short lists; state regulators appear only on /licences.
export const publishedBodies = publishedLicences
  .filter((licence) => licence.securityCovers)
  .map((licence) => licence.body);

function joinWithAnd(items: string[]): string {
  if (items.length < 2) return items.join('');
  return `${items.slice(0, -1).join(', ')} and ${items[items.length - 1]}`;
}

// "FinCEN, FINTRAC and VARA, and under MiCA", built from the published rows.
export function regulatorSentence(): string | null {
  if (publishedBodies.length === 0) return null;
  const others = publishedBodies.filter((body) => body !== 'MiCA');
  const withOthers = others.length ? `with ${joinWithAnd(others)}` : '';
  const underMica = publishedBodies.includes('MiCA') ? 'under MiCA' : '';
  const place = [withOthers, underMica].filter(Boolean).join(', and ');
  return `Moneystrait and its partners hold registrations and licences ${place}.`;
}
