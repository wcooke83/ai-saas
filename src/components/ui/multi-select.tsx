'use client';

import { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  allLabel: string;
  placeholder: string;
  id?: string;
}

function MultiSelect({ options, selected, onChange, allLabel, placeholder, id }: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggle(value: string) {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  function removeTag(value: string) {
    onChange(selected.filter(v => v !== value));
  }

  const triggerLabel = selected.length === 0
    ? allLabel
    : selected.length <= 2
      ? selected.map(v => options.find(o => o.value === v)?.label ?? v).join(', ')
      : `${selected.length} ${placeholder} selected`;

  return (
    <div ref={ref} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm border border-secondary-200 dark:border-secondary-700 rounded-md px-2 py-1.5 text-secondary-900 dark:text-secondary-100 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none flex items-center justify-between gap-2 min-w-[180px] w-full text-left"
        style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
      >
        <span className={`truncate ${selected.length === 0 ? 'text-secondary-400' : ''}`}>
          {triggerLabel}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 text-secondary-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1 w-full min-w-[200px] max-h-48 overflow-y-auto rounded-md border border-secondary-200 dark:border-secondary-700 shadow-lg py-1"
          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
        >
          {options.length === 0 ? (
            <div className="px-3 py-2 text-xs text-secondary-400">No options available</div>
          ) : (
            options.map(opt => {
              const isChecked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-sm text-left hover:bg-secondary-50 dark:hover:bg-secondary-800 text-secondary-900 dark:text-secondary-100"
                >
                  <span className={`flex items-center justify-center w-4 h-4 rounded border flex-shrink-0 ${isChecked ? 'bg-primary-500 border-primary-500' : 'border-secondary-300 dark:border-secondary-600'}`}>
                    {isChecked && <Check className="w-3 h-3 text-white" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1.5">
          {selected.map(v => {
            const label = options.find(o => o.value === v)?.label ?? v;
            return (
              <span
                key={v}
                className="inline-flex items-center gap-0.5 rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-0.5 text-xs"
              >
                <span className="truncate max-w-[120px]">{label}</span>
                <button
                  type="button"
                  onClick={() => removeTag(v)}
                  className="ml-0.5 rounded-full hover:bg-primary-100 dark:hover:bg-primary-800/50 p-0.5"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { MultiSelect };
export type { MultiSelectProps };
