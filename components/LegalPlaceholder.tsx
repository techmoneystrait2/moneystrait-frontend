import { SiteFooter } from '@/components/SiteFooter';
import { Unavailable } from '@/components/ui';

export function LegalPlaceholder({ title }: { title: string }) {
  return (
    <>
      <section className="section">
        <div className="container narrow">
          <p className="eyebrow">Legal</p>
          <h1>{title}</h1>
          <Unavailable>This page is currently unavailable.</Unavailable>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
