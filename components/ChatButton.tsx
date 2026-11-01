'use client';

import { useState } from 'react';

interface ChatButtonProps {
  label?: string;
  className?: string;
  notice?: string;
}

// Chat isn't connected yet, so every chat button only says so.
export function ChatButton({ label = 'Chat with us', className = 'btn outline', notice = `${label} is currently unavailable.` }: ChatButtonProps) {
  const [clicked, setClicked] = useState(false);
  return (
    <>
      <button className={className} type="button" onClick={() => setClicked(true)}>
        {label}
      </button>
      {clicked && (
        <span className="unavailable" role="status">
          {notice}
        </span>
      )}
    </>
  );
}
