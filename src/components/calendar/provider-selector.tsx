'use client';

import { cn } from '@/lib/utils';
import { CalendarDays, Link2, ExternalLink } from 'lucide-react';
import type { CalendarProvider } from '@/lib/calendar/types';

const providers = [
  {
    id: 'hosted_calcom' as CalendarProvider,
    name: 'Hosted Calendar',
    description: 'We manage the calendar for you. Simplest setup.',
    icon: CalendarDays,
  },
  {
    id: 'customer_calcom' as CalendarProvider,
    name: 'Your Cal.com',
    description: 'Connect your own Cal.com account (cloud or self-hosted).',
    icon: Link2,
  },
  {
    id: 'calendly' as CalendarProvider,
    name: 'Calendly',
    description: 'Connect your existing Calendly account.',
    icon: ExternalLink,
  },
];

interface ProviderSelectorProps {
  selected: CalendarProvider | null;
  connectedProvider?: CalendarProvider | null;
  onSelect: (provider: CalendarProvider) => void;
}

export function ProviderSelector({ selected, connectedProvider, onSelect }: ProviderSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Calendar provider">
      {providers.map((provider) => {
        const Icon = provider.icon;
        const isSelected = selected === provider.id;
        const isConnected = connectedProvider === provider.id;
        const isDisabledOther = connectedProvider && connectedProvider !== provider.id;
        return (
          <button
            key={provider.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(provider.id)}
            disabled={!!isDisabledOther}
            title={isDisabledOther ? 'Disconnect current provider first' : undefined}
            className={cn(
              'relative flex flex-col items-start p-4 rounded-lg border-2 transition-all text-left focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none',
              isSelected
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 ring-1 ring-primary-500'
                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600',
              isDisabledOther && 'opacity-50 cursor-not-allowed hover:border-secondary-200 dark:hover:border-secondary-700'
            )}
          >
            <Icon className={cn('w-6 h-6 mb-2', isSelected ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500')} />
            <span className={cn('text-sm font-semibold', isSelected ? 'text-primary-700 dark:text-primary-300' : 'text-secondary-900 dark:text-secondary-100')}>
              {provider.name}
            </span>
            <span className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
              {provider.description}
            </span>
            {isConnected && (
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                Connected
              </div>
            )}
            {isSelected && !isConnected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
