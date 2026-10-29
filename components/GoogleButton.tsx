'use client';

import Script from 'next/script';
import { useRef } from 'react';

interface GoogleIdentity {
  accounts: {
    id: {
      initialize(config: {
        client_id: string;
        callback: (response: { credential: string }) => void;
      }): void;
      renderButton(parent: HTMLElement, options: Record<string, string | number>): void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleIdentity;
  }
}

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

interface Props {
  text: 'signup_with' | 'signin_with';
  onCredential: (credential: string) => void;
}

export function GoogleButton({ text, onCredential }: Props) {
  const container = useRef<HTMLDivElement>(null);

  if (!clientId) {
    return <p className="hint">Google sign-in isn&apos;t configured yet.</p>;
  }

  function renderButton() {
    if (!window.google || !container.current || !clientId) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onCredential(response.credential),
    });
    window.google.accounts.id.renderButton(container.current, {
      theme: 'outline',
      size: 'large',
      text,
      width: 320,
    });
  }

  return (
    <>
      <Script src="https://accounts.google.com/gsi/client" onReady={renderButton} />
      <div className="google" ref={container} />
    </>
  );
}
