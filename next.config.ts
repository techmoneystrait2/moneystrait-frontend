import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL;
if (!backendUrl) throw new Error('Missing environment variable: BACKEND_URL');

const isDev = process.env.NODE_ENV === 'development';

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/client${isDev ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline' https://accounts.google.com/gsi/style",
  'frame-src https://accounts.google.com/gsi/',
  `connect-src 'self' https://accounts.google.com/gsi/${isDev ? ' ws:' : ''}`,
  "img-src 'self' data:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The browser sees one origin, so the session cookie stays first-party.
  async rewrites() {
    return [{ source: '/api/:path*', destination: `${backendUrl}/api/:path*` }];
  },
  async redirects() {
    const moved: [string, string][] = [
      ['/contact', '/talk-to-us'],
      ['/get-your-rate', '/talk-to-us'],
      ['/get-started', '/talk-to-us'],
      ['/corridors', '/countries'],
      ['/compliance', '/security'],
      ['/stablecoins', '/crypto'],
      ['/desk', '/otc-desk'],
      ['/otc', '/otc-desk'],
    ];
    return moved.map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: contentSecurityPolicy },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Google's docs require the looser policy when testing over http on localhost.
          {
            key: 'Referrer-Policy',
            value: isDev ? 'no-referrer-when-downgrade' : 'strict-origin-when-cross-origin',
          },
          // Google's sign-in popup needs to report back to this window.
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
        ],
      },
    ];
  },
};

export default nextConfig;
