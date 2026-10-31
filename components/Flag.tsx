import { AE, AU, BD, CA, CH, CN, EU, GB, HK, ID, IN, JP, KR, LK, MY, NP, PH, PK, SA, SG, TH, TR, US, UZ, VN } from 'country-flag-icons/react/3x2';

const FLAGS = { AE, AU, BD, CA, CH, CN, EU, GB, HK, ID, IN, JP, KR, LK, MY, NP, PH, PK, SA, SG, TH, TR, US, UZ, VN };

export function Flag({ code }: { code: string }) {
  const Icon = FLAGS[code as keyof typeof FLAGS];
  return <span className="flag">{Icon ? <Icon aria-hidden="true" /> : null}</span>;
}

export function CoinBadge({ letter }: { letter: 'T' | 'C' | 'B' | 'E' }) {
  return (
    <span className={`coin-badge coin-${letter}`} aria-hidden="true">
      {letter}
    </span>
  );
}
