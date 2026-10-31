'use client';

import { Check, ChevronDown, Search, X } from 'lucide-react';
import { type KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';

const SEARCH_FROM = 9;

// Extra search words, so "UAE" finds United Arab Emirates.
const ALIASES: Record<string, string> = {
  'United Arab Emirates': 'uae emirates dubai',
  'United Kingdom': 'uk britain england',
  'United States': 'usa us america',
  Turkey: 'türkiye turkiye',
  'Saudi Arabia': 'ksa',
  'South Korea': 'korea',
};

function matches(option: string, query: string): boolean {
  const text = `${option} ${ALIASES[option] ?? ''}`.toLowerCase();
  return query.toLowerCase().split(/\s+/).every((word) => text.includes(word));
}

interface BaseProps {
  id: string;
  label: string;
  options: string[];
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
}

interface InnerProps extends BaseProps {
  multiple: boolean;
  selected: string[];
  onToggle: (option: string) => void;
}

function DropdownField({ id, label, options, required = true, hint, error, disabled, multiple, selected, onToggle }: InnerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const searchable = options.length >= SEARCH_FROM;

  const visible = useMemo(() => options.filter((option) => matches(option, query)), [options, query]);
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  useEffect(() => {
    if (!open) return;
    function closeOnOutsideClick(event: MouseEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    panel.current?.querySelector<HTMLElement>('input, [role="listbox"]')?.focus();
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [open]);

  useEffect(() => {
    if (open) panel.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [active, open]);

  function show() {
    setQuery('');
    setActive(Math.max(0, options.indexOf(selected[0] ?? '')));
    setOpen(true);
  }

  function close() {
    setOpen(false);
    button.current?.focus();
  }

  function choose(option: string) {
    onToggle(option);
    if (!multiple) close();
  }

  function handleKeys(event: KeyboardEvent) {
    const moves: Record<string, number> = {
      ArrowDown: Math.min(active + 1, visible.length - 1),
      ArrowUp: Math.max(active - 1, 0),
      Home: 0,
      End: visible.length - 1,
    };
    if (event.key in moves && !(searchable && (event.key === 'Home' || event.key === 'End'))) {
      event.preventDefault();
      setActive(moves[event.key]!);
    } else if (event.key === 'Enter' || (event.key === ' ' && !searchable)) {
      event.preventDefault();
      const option = visible[active];
      if (option) choose(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === 'Tab') {
      setOpen(false);
    }
  }

  const summary = selected.length === 0 ? 'Choose' : multiple ? `${selected.length} selected` : selected[0];
  const activeId = visible[active] ? `${id}-option-${options.indexOf(visible[active])}` : undefined;

  return (
    <div className="field dropdown" ref={root}>
      <label id={`${id}-label`} htmlFor={id}>
        {label}
        {!required && <span className="optional"> Optional</span>}
      </label>
      <button
        ref={button}
        id={id}
        className={`dropdown-button ${selected.length === 0 ? 'empty' : ''}`}
        type="button"
        disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-describedby={describedBy}
        onClick={() => (open ? setOpen(false) : show())}
        onKeyDown={(event) => {
          if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            show();
          }
        }}
      >
        <span>{summary}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {/* Lets the browser's own required check cover this custom control. */}
      <input className="dropdown-proxy" tabIndex={-1} aria-hidden="true" required={required} value={selected.join(',')} onChange={() => undefined} />

      {open && (
        <div className="dropdown-panel" ref={panel}>
          {searchable && (
            <span className="dropdown-search">
              <Search size={15} aria-hidden="true" />
              <input
                placeholder="Search"
                aria-label={`Search ${label}`}
                aria-controls={`${id}-list`}
                aria-activedescendant={activeId}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={handleKeys}
              />
            </span>
          )}
          <ul
            id={`${id}-list`}
            role="listbox"
            tabIndex={searchable ? undefined : -1}
            aria-labelledby={`${id}-label`}
            aria-multiselectable={multiple}
            aria-activedescendant={searchable ? undefined : activeId}
            onKeyDown={searchable ? undefined : handleKeys}
          >
            {visible.length === 0 && <li className="dropdown-none">No matches</li>}
            {visible.map((option, index) => {
              const on = selected.includes(option);
              return (
                <li
                  key={option}
                  id={`${id}-option-${options.indexOf(option)}`}
                  role="option"
                  aria-selected={on}
                  data-active={index === active}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => choose(option)}
                >
                  {multiple && <i className={`dropdown-box ${on ? 'on' : ''}`}>{on && <Check size={12} aria-hidden="true" />}</i>}
                  <span>{option}</span>
                  {!multiple && on && <Check size={15} aria-hidden="true" />}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {multiple && selected.length > 0 && (
        <ul className="dropdown-chips" aria-label={`Selected: ${label}`}>
          {selected.map((option) => (
            <li key={option}>
              {option}
              <button type="button" aria-label={`Remove ${option}`} disabled={disabled} onClick={() => onToggle(option)}>
                <X size={13} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {hint && (
        <p className="hint" id={`${id}-hint`}>
          {hint}
        </p>
      )}
      {error && (
        <p className="dropdown-error" id={`${id}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Dropdown({ value, onChange, ...props }: BaseProps & { value: string; onChange: (value: string) => void }) {
  return <DropdownField {...props} multiple={false} selected={value ? [value] : []} onToggle={onChange} />;
}

export function MultiDropdown({ value, onChange, ...props }: BaseProps & { value: string[]; onChange: (value: string[]) => void }) {
  return (
    <DropdownField
      {...props}
      multiple
      selected={value}
      onToggle={(option) => onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])}
    />
  );
}
