import { MessageCircle, Phone, Send } from 'lucide-react';
import { Unavailable } from '@/components/ui';

const USES = ['Pay suppliers', 'Pay staff or freelancers', 'Payouts for our clients', 'Buy or sell crypto', 'Deals over $25,000'];
const CHANNELS = [
  { label: 'Phone call', icon: Phone },
  { label: 'WhatsApp', icon: MessageCircle },
  { label: 'Telegram', icon: Send },
];

function Field({ label }: { label: string }) {
  const id = label.toLowerCase().replaceAll(' ', '-');
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input id={id} />
    </div>
  );
}

function ListField({ label }: { label: string }) {
  const id = label.toLowerCase().replaceAll(' ', '-');
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select id={id} defaultValue="">
        <option value="">Choose</option>
      </select>
    </div>
  );
}

// Everything here is switched off until the booking backend exists.
export function TalkForm() {
  return (
    <div className="box talk-form">
      <p className="eyebrow">Get your rate</p>
      <h1>Let’s talk about your rate</h1>
      <p className="lead">Tell us who you are and how you pay today, so your manager comes to the call prepared. Two minutes, no documents.</p>
      <Unavailable>Booking a call is currently unavailable.</Unavailable>

      <fieldset disabled className="form-off">
        <fieldset>
          <legend>
            <i className="step-number navy">1</i> About you
          </legend>
          <div className="form-grid">
            <Field label="Full name" />
            <ListField label="Your role" />
            <Field label="Work email" />
            <Field label="Phone or WhatsApp" />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <i className="step-number navy">2</i> Your company
          </legend>
          <div className="form-grid">
            <Field label="Company name" />
            <ListField label="Registered in" />
            <Field label="Website or social page" />
            <ListField label="What your company does" />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <i className="step-number navy">3</i> Your payments
          </legend>
          <p className="group-label">What will you use Moneystrait for?</p>
          <div className="option-chips">
            {USES.map((use) => (
              <button key={use} type="button">
                {use}
              </button>
            ))}
          </div>
          <div className="form-grid">
            <ListField label="Each month, about" />
            <ListField label="How you pay today" />
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <i className="step-number navy">4</i> How should we talk?
          </legend>
          <div className="channels">
            {CHANNELS.map((item) => (
              <button key={item.label} type="button">
                <item.icon size={16} aria-hidden="true" /> {item.label}
              </button>
            ))}
          </div>
        </fieldset>

        <button className="btn" type="button">
          Book my call
        </button>
      </fieldset>
    </div>
  );
}
