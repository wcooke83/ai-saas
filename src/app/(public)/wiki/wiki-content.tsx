'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { WikiGettingStarted } from './wiki-getting-started';
import { WikiFeaturesSection } from './wiki-features-section';
import { WikiApiBanner } from './wiki-api-banner';
import { WikiGenericSection } from './wiki-generic-section';

interface WikiPage {
  id: string;
  title: string;
  description: string;
  file: string;
  order: number;
}

interface WikiCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  pages: WikiPage[];
}

interface WikiIndex {
  categories: WikiCategory[];
}

/**
 * Resolves a Lucide icon name string to the actual component.
 * Falls back to BookOpen if the icon name isn't found.
 */
function resolveIcon(iconName: string): LucideIcon {
  const icons = LucideIcons as Record<string, unknown>;
  const Icon = icons[iconName];
  if (typeof Icon === 'function') return Icon as LucideIcon;
  return BookOpen;
}

/**
 * Maps a category ID to the appropriate section treatment.
 *
 * Known categories get specialized layouts:
 * - "getting-started" → numbered horizontal strips on dark bg
 * - "chatbot-features" → mixed card grid with featured + compact items
 * - "api-integration"  → full-bleed dark banner with large icon
 *
 * Unknown future categories fall back to the generic section with
 * alternating light/dark backgrounds for visual rhythm.
 */
function renderCategory(
  category: WikiCategory,
  index: number,
  knownIds: Set<string>,
) {
  if (category.pages.length === 0) return null;

  const Icon = resolveIcon(category.icon);

  switch (category.id) {
    case 'getting-started':
      return (
        <WikiGettingStarted
          key={category.id}
          pages={category.pages}
          icon={Icon}
        />
      );

    case 'chatbot-features':
      return (
        <WikiFeaturesSection
          key={category.id}
          title={category.title}
          description={category.description}
          pages={category.pages}
          icon={Icon}
        />
      );

    case 'api-integration':
      return (
        <WikiApiBanner
          key={category.id}
          title={category.title}
          pages={category.pages}
          icon={Icon}
        />
      );

    default: {
      // For unknown categories, alternate light/dark to maintain visual rhythm.
      // Count how many unknown categories came before this one to decide.
      const unknownIndex = index - knownIds.size;
      return (
        <WikiGenericSection
          key={category.id}
          title={category.title}
          description={category.description}
          pages={category.pages}
          icon={Icon}
          variant={unknownIndex % 2 === 0 ? 'light' : 'dark'}
        />
      );
    }
  }
}

const KNOWN_CATEGORY_IDS = new Set([
  'getting-started',
  'chatbot-features',
  'api-integration',
]);

export function WikiContent() {
  const [index, setIndex] = useState<WikiIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadIndex() {
      try {
        const res = await fetch('/api/wiki/index');
        const data = await res.json();

        if (data.success) {
          setIndex(data.data);
        } else {
          setError(data.error || 'Failed to load wiki');
        }
      } catch (err) {
        setError('Failed to load wiki index');
        console.error('Wiki index error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadIndex();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!index || index.categories.every((cat) => cat.pages.length === 0)) {
    return (
      <div className="text-center py-24">
        <BookOpen className="w-16 h-16 mx-auto text-secondary-400 mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-2">
          No documentation available yet
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400">
          Check back soon for guides and tutorials
        </p>
      </div>
    );
  }

  return (
    <>
      {index.categories.map((category, i) =>
        renderCategory(category, i, KNOWN_CATEGORY_IDS),
      )}
    </>
  );
}
