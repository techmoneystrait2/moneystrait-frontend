import type { Metadata } from 'next';
import { TalkForm } from '@/components/TalkForm';
import { Unavailable } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Get your rate · Moneystrait',
  description: 'Tell us how you pay today and book a 15-minute call. We’ll offer you a lower rate, in writing.',
};

const NEXT_STEPS = [
  ['We talk for 15 minutes', 'About what you pay today and what you need.'],
  ['You apply online', 'One application. We check your company once.'],
  ['You get your rate in writing', 'Once you’re approved. Fixed for 6 months.'],
];

export default function TalkToUsPage() {
  return (
    <div className="container form-layout">
      <TalkForm />
      <aside className="side-panel">
        <article className="box">
          <h3>What happens next</h3>
          <ol className="next-steps">
            {NEXT_STEPS.map(([title, text], index) => (
              <li key={title}>
                <i className="step-number">{index + 1}</i>
                <p>
                  <strong>{title}</strong>
                  {text}
                </p>
              </li>
            ))}
          </ol>
        </article>
        <article className="box" id="chat">
          <h3>Rather chat now?</h3>
          <Unavailable>WhatsApp and Telegram chat are currently unavailable.</Unavailable>
        </article>
      </aside>
    </div>
  );
}
