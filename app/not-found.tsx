import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { ROUTES } from '@/content/site';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="content" className="main">
        <section className="section">
          <div className="container narrow">
            <h1>We can’t find that page.</h1>
            <p className="lead">It may have moved, or the address may be wrong.</p>
            <div className="actions">
              <Link className="btn" href="/">
                Go to the homepage
              </Link>
              <Link className="btn outline" href={ROUTES.rate}>
                Get your rate
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
