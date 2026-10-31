import { Ban, Globe, Landmark } from 'lucide-react';
import type { Metadata } from 'next';
import { CountrySearch, RegionTabs } from '@/components/CountryBrowser';
import { Flag } from '@/components/Flag';
import { SiteFooter } from '@/components/SiteFooter';
import { ClosingBand, IconTile, SectionHead, Ticks } from '@/components/ui';
import { POPULAR } from '@/content/countries';

export const metadata: Metadata = {
  title: 'Where we pay · Moneystrait',
  description: 'Local transfers to 150+ countries in their own currency, and SWIFT wires to 200+ countries and territories.',
};

export default function CountriesPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <p className="eyebrow">Countries</p>
            <h1>Where we pay.</h1>
            <p className="lead">Local transfers to 150+ countries. SWIFT wires to 200+ countries and territories. To companies or people.</p>
            <CountrySearch />
          </div>
          <div className="figures">
            <article className="box figure">
              <IconTile icon={Landmark} />
              <p>
                <b>150+</b>
                <strong>countries by local transfer</strong>
                In their own currency. Often the same day.
              </p>
            </article>
            <article className="box figure">
              <IconTile icon={Globe} />
              <p>
                <b>200+</b>
                <strong>countries and territories by SWIFT</strong>
                In USD, EUR or GBP. 1 to 2 business days.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead title="Popular for business payments" lead="Big trade routes, each paid through the country’s own payment system, in its own currency." />
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Country</th>
                  <th scope="col">How we pay</th>
                  <th scope="col">Typical time</th>
                  <th scope="col">Details you need</th>
                </tr>
              </thead>
              <tbody>
                {POPULAR.map((country) => (
                  <tr key={country.code}>
                    <td data-label="Country">
                      <span className="payee">
                        <Flag code={country.code} />
                        <span>
                          <strong>{country.name}</strong>
                          <small>{country.currency}</small>
                        </span>
                      </span>
                    </td>
                    <td data-label="How we pay">{country.method}</td>
                    <td data-label="Typical time">
                      <span className="pill teal">{country.time}</span>
                    </td>
                    <td data-label="Details you need">{country.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="after-grid">Times start once your money has arrived and our checks are done. Local holidays and bank cut-off times can add a day.</p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <SectionHead title="All local transfer countries" lead="150+ countries, by region. Each is paid in its own currency." />
          <RegionTabs />
        </div>
      </section>

      <section className="section">
        <div className="container grid cols-2">
          <article className="box navy-card">
            <span className="icon-tile navy">
              <Globe size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>SWIFT wires to 200+ countries and territories</h2>
            <p>Where there’s no local option, we send a SWIFT wire in USD, EUR or GBP. SWIFT links 11,500+ banks and institutions, so it reaches almost any bank account in the world.</p>
            <Ticks
              items={[
                '1 to 2 business days',
                'We pay the bank charges, so the full amount arrives',
                'Tracked to the last step, with a bank copy',
                'Sent in ISO 20022, the global standard for payment messages',
              ]}
            />
          </article>
          <article className="box">
            <span className="icon-tile warn">
              <Ban size={22} strokeWidth={1.75} aria-hidden="true" />
            </span>
            <h2>Where we can’t pay</h2>
            <p>We don’t send money to places under full US sanctions, or to anyone on a sanctions list. Every payment is screened.</p>
            <ul className="tag-chips">
              {['Cuba', 'Iran', 'North Korea', 'Crimea, Donetsk and Luhansk regions'].map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
            <small className="muted">We follow US sanctions (OFAC). The list can change.</small>
          </article>
        </div>
      </section>

      <ClosingBand heading="Don’t see a country?" line="Ask us. Where there’s no local option, a SWIFT wire usually gets there." />
      <SiteFooter />
    </>
  );
}
