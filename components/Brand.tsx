import { BRAND } from '@/content/brandPaths';

export function Wordmark({ dark = false }: { dark?: boolean }) {
  return (
    <svg className="wordmark-svg" viewBox="0 -750 8790 750" aria-hidden="true">
      <path d={BRAND.wordmarkMoney} fill={dark ? 'var(--ms-cream)' : 'var(--ms-navy)'} />
      <path d={BRAND.wordmarkStrait} fill={dark ? 'var(--ms-gold-light)' : 'var(--ms-gold-word)'} />
    </svg>
  );
}

export function CoinMark({ dark = false }: { dark?: boolean }) {
  const face = dark ? 'var(--ms-gold)' : 'var(--ms-navy)';
  const strait = dark ? 'var(--ms-navy)' : 'var(--ms-gold)';
  return (
    <svg className="coin-mark" viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill={face} />
      <path d="M21 4 C18 12 15 13 13 18 C12 22 11 25 9 28 L12 29 C15 25 16 21 18 17 C20 13 22 10 24 6 Z" fill={strait} />
    </svg>
  );
}

function River({ data, className }: { data: { w: number; h: number; fill: string; highlight: string }; className: string }) {
  const ripples = 'ripples' in data ? (data.ripples as readonly string[]) : [];
  const id = `river-${className}`;
  return (
    <svg className={className} viewBox={`0 0 ${data.w} ${data.h}`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#DDB66B" />
          <stop offset="0.5" stopColor="#C79E55" />
          <stop offset="1" stopColor="#B3873F" />
        </linearGradient>
      </defs>
      {ripples.map((d, index) => (
        <path key={d} d={d} fill="none" stroke="#C29A52" strokeOpacity={0.16 + index * 0.06} vectorEffect="non-scaling-stroke" />
      ))}
      <path d={data.fill} fill={`url(#${id})`} />
      <path d={data.highlight} fill="none" stroke="#FFFFFF" strokeOpacity="0.22" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function HomeRiver() {
  return (
    <div className="river" aria-hidden="true">
      <River data={BRAND.riverDesktop} className="river-desktop" />
      <River data={BRAND.riverPhone} className="river-phone" />
      <span className="river-coin dollar">$</span>
      <span className="river-coin euro">€</span>
    </div>
  );
}
