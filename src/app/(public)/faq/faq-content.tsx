'use client';

import { useState, useCallback, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { FaqHero } from './faq-hero';
import { FaqCategoryNav } from './faq-category-nav';
import { FaqPopular } from './faq-popular';
import { FaqCategorySection } from './faq-category-section';
import { FaqCta } from './faq-cta';
import { SearchResults } from './faq-search';
import { faqCategories, type FaqQuestion } from './faq-data';

interface SearchResult extends FaqQuestion {
  categoryId: string;
  categoryTitle: string;
}

export function FaqContent() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeCategory, setActiveCategory] = useState(faqCategories[0].id);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  /* ── Search handlers ──────────────────────────────────────────────────────── */

  const handleSearchResults = useCallback((results: SearchResult[], query: string) => {
    setSearchResults(results);
    setSearchQuery(query);
    setIsSearching(true);
  }, []);

  const handleSearchClear = useCallback(() => {
    setSearchResults([]);
    setSearchQuery('');
    setIsSearching(false);
  }, []);

  const handleSelectQuestion = useCallback(
    (categoryId: string, questionId: string) => {
      // Clear search if active
      if (isSearching) {
        handleSearchClear();
      }

      // Scroll to question
      setTimeout(() => {
        const element = document.getElementById(`question-${questionId}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Brief highlight ring
          element.style.boxShadow = '0 0 0 2px rgb(14, 165, 233)';
          element.style.borderRadius = '8px';
          setTimeout(() => {
            element.style.boxShadow = '';
          }, 2000);
        }
      }, 100);
    },
    [isSearching, handleSearchClear]
  );

  /* ── Category navigation ──────────────────────────────────────────────────── */

  const handleSelectCategory = useCallback((id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const scrollToSection = useCallback((id: string) => {
    setActiveCategory(id);
    setMobileTocOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Track active section on scroll via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    faqCategories.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* ── Render ───────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* ─── 1. Hero: full viewport, search bar ───────────────────────────── */}
      <FaqHero onSearchResults={handleSearchResults} onClear={handleSearchClear} />

      {isSearching ? (
        /* ─── Search results mode ────────────────────────────────────────── */
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <SearchResults
              results={searchResults}
              query={searchQuery}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        </section>
      ) : (
        <>
          {/* ─── 2. Category nav strip: dark, horizontal ──────────────────── */}
          <FaqCategoryNav
            activeCategory={activeCategory}
            onSelectCategory={handleSelectCategory}
          />

          {/* ─── 3. Popular questions: light, asymmetric ──────────────────── */}
          <FaqPopular onSelectQuestion={handleSelectQuestion} />

          {/* ─── Mobile TOC (sticky) ──────────────────────────────────────── */}
          <div className="lg:hidden sticky top-16 z-40">
            <Card className="mx-4 overflow-hidden rounded-lg shadow-lg">
              <button
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <span className="font-semibold text-secondary-900 dark:text-white text-sm">
                  Jump to section
                </span>
                {mobileTocOpen ? (
                  <ChevronUp className="h-4 w-4 text-secondary-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-secondary-500" />
                )}
              </button>
              {mobileTocOpen && (
                <div className="px-4 pb-4">
                  <ul className="space-y-1">
                    {faqCategories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <li key={cat.id}>
                          <button
                            onClick={() => scrollToSection(cat.id)}
                            className={`w-full text-left text-sm px-3 py-2.5 rounded-lg flex items-center gap-2.5 transition-all duration-200 ${
                              activeCategory === cat.id
                                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                                : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                            {cat.title}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </Card>
          </div>

          {/* ─── 4. Category sections: alternating light / dark ────────────── */}
          {faqCategories.map((category, index) => (
            <FaqCategorySection key={category.id} category={category} index={index} />
          ))}

          {/* ─── 5. CTA: dark, asymmetric ──────────────────────────────────── */}
          <FaqCta />
        </>
      )}
    </>
  );
}
