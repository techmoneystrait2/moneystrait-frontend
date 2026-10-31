import { Check, type LucideIcon, X } from 'lucide-react';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { ROUTES } from '@/content/site';

export function HeroButtons({
  primary = 'Get your rate',
  primaryHref = ROUTES.rate,
  chat = 'Chat with us',
  children,
}: {
  primary?: string;
  primaryHref?: string;
  chat?: string;
  children?: ReactNode;
}) {
  return (
    <div className="actions">
      <Link className="btn" href={primaryHref}>
        {primary}
      </Link>
      <Link className="btn outline" href={ROUTES.chat}>
        {chat}
      </Link>
      {children}
    </div>
  );
}

export function ClosingBand({ heading = 'Pay less on every payment abroad.', line = 'Tell us what you pay today, and we’ll offer you less.' }) {
  return (
    <section className="band">
      <div className="container band-inner">
        <div>
          <h2>{heading}</h2>
          <p>{line}</p>
        </div>
        <div className="actions">
          <Link className="btn white" href={ROUTES.rate}>
            Get your rate
          </Link>
          <Link className="btn on-navy" href={ROUTES.chat}>
            Chat with us
          </Link>
        </div>
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, lead }: { eyebrow?: string; title: string; lead?: string }) {
  return (
    <div className="section-head">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {lead && <p className="lead">{lead}</p>}
    </div>
  );
}

export function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="icon-tile">
      <Icon size={22} strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

export function Ticks({ items, className = '' }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`tick-list ${className}`}>
      {items.map((item, index) => (
        <li key={index}>
          <Check size={16} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Crosses({ items }: { items: string[] }) {
  return (
    <ul className="tick-list cross">
      {items.map((item) => (
        <li key={item}>
          <X size={16} aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function NumberedSteps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className={`numbered cols-${steps.length}`}>
      {steps.map((step, index) => (
        <li key={step.title}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <h3>{step.title}</h3>
          <p>{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function FeatureCards({ items }: { items: { icon: LucideIcon; title: string; text: string }[] }) {
  return (
    <div className={`grid cols-${items.length}`}>
      {items.map((item) => (
        <article className="box" key={item.title}>
          <IconTile icon={item.icon} />
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

export function KeyValues({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="kv">
      {rows.map(([key, value]) => (
        <div key={key}>
          <dt>{key}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Unavailable({ children }: { children: ReactNode }) {
  return (
    <p className="unavailable" role="status">
      {children}
    </p>
  );
}
