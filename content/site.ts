export const ROUTES = {
  rate: '/talk-to-us',
  login: '/login',
  signup: '/signup',
};

export const UNAVAILABLE = 'Currently unavailable';

export const HEADER_LINKS = [
  { href: '/payments', label: 'Payments' },
  { href: '/crypto', label: 'Crypto' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/security', label: 'Security' },
];

export const MENU_ROWS = [
  { href: '/payments', label: 'Payments', text: 'Pay anyone in 150+ countries' },
  { href: '/crypto', label: 'Crypto', text: 'Buy and sell USDT, USDC, BTC and ETH' },
  { href: '/otc-desk', label: 'OTC desk', text: 'One firm price from $25,000' },
  { href: '/pricing', label: 'Pricing', text: 'Your own rate, lower than today' },
  { href: '/security', label: 'Security', text: 'How we protect your money' },
];

export const FOOTER_COLUMNS = [
  {
    title: 'Services',
    links: [
      { href: '/payments', label: 'Payments' },
      { href: '/crypto', label: 'Crypto' },
      { href: '/otc-desk', label: 'OTC desk' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/countries', label: 'Countries' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/security', label: 'Security' },
      { href: ROUTES.rate, label: 'Contact' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/licences', label: 'Licences' },
      { href: '/legal/terms', label: 'Terms' },
      { href: '/legal/privacy', label: 'Privacy' },
      { href: '/legal/aml-and-sanctions', label: 'AML and sanctions policy' },
      { href: '/complaints', label: 'Complaints' },
    ],
  },
];

export const COMPACT_FOOTER_LINKS = [
  { href: '/payments', label: 'Payments' },
  { href: '/crypto', label: 'Crypto' },
  { href: '/otc-desk', label: 'OTC desk' },
  { href: '/countries', label: 'Countries' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/security', label: 'Security' },
  { href: '/licences', label: 'Licences' },
  { href: ROUTES.rate, label: 'Contact' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/aml-and-sanctions', label: 'AML and sanctions policy' },
  { href: '/complaints', label: 'Complaints' },
];

export const SMALL_FOOTER_LINKS = [
  { href: '/legal/privacy', label: 'Privacy' },
  { href: '/legal/terms', label: 'Terms' },
  { href: '/security', label: 'Security' },
  { href: '/licences', label: 'Licences' },
];
