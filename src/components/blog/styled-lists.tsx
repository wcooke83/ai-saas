// ─── Styled List Components for Blog Posts ──────────────────────────────────
// Polished numbered and bullet lists with custom badges/icons.
// Server-safe (no hooks/state). Dark-mode-first styling.

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ──────────────────────────────────────────────────────────────────

type ListItemWithTitle = { title: ReactNode; description: ReactNode };
type ListItem = ReactNode | ListItemWithTitle;

function isItemWithTitle(item: ListItem): item is ListItemWithTitle {
  return (
    typeof item === 'object' &&
    item !== null &&
    !Array.isArray(item) &&
    'title' in (item as object)
  );
}

// ─── Styled Numbered List ───────────────────────────────────────────────────

interface StyledNumberedListProps {
  items: ListItem[];
  className?: string;
}

export function StyledNumberedList({ items, className }: StyledNumberedListProps) {
  return (
    <ol className={cn('mt-4 space-y-4', className)} role="list">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3.5">
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary-500/15 text-sm font-semibold text-primary-400"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <div className="pt-0.5">
            {isItemWithTitle(item) ? (
              <>
                <span className="font-semibold text-secondary-800 dark:text-secondary-200">
                  {item.title}
                </span>{' '}
                <span className="text-secondary-600 dark:text-secondary-400">
                  {item.description}
                </span>
              </>
            ) : (
              <span className="text-secondary-600 dark:text-secondary-400">{item}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

// ─── Styled Bullet List ─────────────────────────────────────────────────────

interface StyledBulletListProps {
  items: ListItem[];
  className?: string;
}

export function StyledBulletList({ items, className }: StyledBulletListProps) {
  return (
    <ul className={cn('mt-4 space-y-3 pl-2', className)} role="list">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3">
          <span
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400"
            aria-hidden="true"
          />
          <div>
            {isItemWithTitle(item) ? (
              <>
                <span className="font-semibold text-secondary-800 dark:text-secondary-200">
                  {item.title}
                </span>
                {' '}&mdash;{' '}
                <span className="text-secondary-600 dark:text-secondary-400">
                  {item.description}
                </span>
              </>
            ) : (
              <span className="text-secondary-600 dark:text-secondary-400">{item}</span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
