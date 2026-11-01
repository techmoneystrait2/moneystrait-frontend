// Served from public/flags, so listing 240 countries adds nothing to the JavaScript bundle.
export function Flag({ code }: { code: string }) {
  return (
    <span className="flag">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/flags/${code}.svg`} alt="" aria-hidden="true" />
    </span>
  );
}

export function CoinBadge({ letter }: { letter: 'T' | 'C' | 'B' | 'E' }) {
  return (
    <span className={`coin-badge coin-${letter}`} aria-hidden="true">
      {letter}
    </span>
  );
}
