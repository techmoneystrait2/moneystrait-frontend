'use client';

import { useState } from 'react';

// Chat isn't connected yet, so every chat button only says so.
export function ChatButton({ label = 'Chat with us', className = 'btn outline' }: { label?: string; className?: string }) {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <button className={className} type="button" onClick={() => setClicked(true)}>
        {label}
      </button>
      {clicked && (
        <p className="unavailable" role="status">
          {label} is currently unavailable.
        </p>
      )}
    </>
  );
}
