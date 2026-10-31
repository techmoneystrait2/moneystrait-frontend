import type { Metadata } from 'next';
import { SiteFooter } from '@/components/SiteFooter';
import { Unavailable } from '@/components/ui';
import { ISO_27001_CERTIFICATE, publishedLicences } from '@/content/licences';

export const metadata: Metadata = {
  title: 'Licences and registrations · Moneystrait',
  description: 'The registrations and licences held by Moneystrait and its partners, and where to check each one.',
};

export default function LicencesPage() {
  return (
    <>
      <section className="section">
        <div className="container">
          <p className="eyebrow">Legal</p>
          <h1>Licences and registrations</h1>
          <p className="lead">Moneystrait and its partners are registered with, or licensed by, the bodies below. You can check each number on the body’s public register.</p>
          {publishedLicences.length ? (
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Body</th>
                    <th scope="col">What it covers</th>
                    <th scope="col">Number</th>
                    <th scope="col">Check it on</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedLicences.map((licence) => (
                    <tr key={licence.body}>
                      <td data-label="Body">
                        <strong>{licence.body}</strong>
                      </td>
                      <td data-label="What it covers">{licence.covers}</td>
                      <td data-label="Number">{licence.number}</td>
                      <td data-label="Check it on">
                        {licence.registerUrl ? (
                          <a href={licence.registerUrl} target="_blank" rel="noreferrer">
                            {licence.registerName}
                          </a>
                        ) : (
                          licence.registerName
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Unavailable>Licence details are currently unavailable.</Unavailable>
          )}
          <div className="grid cols-3 top-gap">
            <article className="box">
              <h3>Your money</h3>
              <p>Accounts are held with our partner banks. Moneystrait is not a bank, and crypto is not a bank deposit.</p>
            </article>
            <article className="box">
              <h3>Standards we follow</h3>
              <p>
                ISO 20022 for payment messages.
                {ISO_27001_CERTIFICATE && ` ISO/IEC 27001 for information security, certificate no. ${ISO_27001_CERTIFICATE}.`}
              </p>
            </article>
            <article className="box">
              <h3>Questions</h3>
              <Unavailable>Compliance contact is currently unavailable.</Unavailable>
            </article>
          </div>
        </div>
      </section>
      <SiteFooter />
    </>
  );
}
