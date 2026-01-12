'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { FaqSearch, SearchResults } from './faq-search';
import { PopularQuestions } from './popular-questions';
import { faqCategories, FaqQuestion } from './faq-data';

interface SearchResult extends FaqQuestion {
  categoryId: string;
  categoryTitle: string;
}

// Icon color mapping for each category
const categoryIconColors: Record<string, string> = {
  credits: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  billing: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
  api: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  security: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  tools: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
  account: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
};

// TOC items configuration
const tocItems = [
  { id: 'credits', title: 'Credits & Usage' },
  { id: 'billing', title: 'Billing & Subscriptions' },
  { id: 'api', title: 'API & Integration' },
  { id: 'security', title: 'Security & Privacy' },
  { id: 'tools', title: 'AI Tools' },
  { id: 'account', title: 'Account & Support' },
];

export function FaqContent() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [tocOpen, setTocOpen] = useState(false);

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

  const handleSelectQuestion = useCallback((categoryId: string, questionId: string) => {
    // Clear search
    handleSearchClear();

    // Scroll to question
    setTimeout(() => {
      const element = document.getElementById(`question-${questionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Brief highlight effect
        element.style.boxShadow = '0 0 0 2px rgb(var(--primary-500))';
        setTimeout(() => {
          element.style.boxShadow = '';
        }, 2000);
      }
    }, 100);
  }, [handleSearchClear]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setTocOpen(false);
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="pt-8 pb-8 md:pt-12 md:pb-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                >
                  Home
                </Link>
              </li>
              <li className="text-secondary-400" aria-hidden="true">
                /
              </li>
              <li className="text-secondary-900 dark:text-secondary-100 font-medium">
                FAQ
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl mx-auto text-center mb-8">
            <Badge variant="outline" className="mb-4">
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
              Help Center
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-secondary-600 dark:text-secondary-400">
              Find answers to common questions about AI SaaS Tools
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <FaqSearch
              onSearchResults={handleSearchResults}
              onClear={handleSearchClear}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 pb-16">
        {isSearching ? (
          /* Search Results - Centered */
          <div className="max-w-4xl mx-auto">
            <SearchResults
              results={searchResults}
              query={searchQuery}
              onSelectQuestion={handleSelectQuestion}
            />
          </div>
        ) : (
          <>
            {/* Popular Questions - Centered above TOC */}
            <div className="max-w-4xl mx-auto">
              <PopularQuestions onSelectQuestion={handleSelectQuestion} />
            </div>

            {/* FAQ Sections with TOC */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-8 max-w-6xl mx-auto mt-12">
              {/* Table of Contents - Desktop */}
              <aside className="hidden lg:block lg:w-64 flex-shrink-0 sticky top-24 self-start">
                <Card className="p-6">
                  <h3 className="font-semibold text-secondary-900 dark:text-white mb-4">Table of Contents</h3>
                  <ul className="space-y-2">
                    {tocItems.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => scrollToSection(item.id)}
                          className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-200 ${
                            activeSection === item.id
                              ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-medium'
                              : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/50'
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </Card>
              </aside>

              {/* Table of Contents - Mobile (Sticky) */}
              <div className="lg:hidden sticky top-16 z-40 mb-6">
                <Card className="overflow-hidden">
                  <button
                    onClick={() => setTocOpen(!tocOpen)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <span className="font-semibold text-secondary-900 dark:text-white">Jump to Section</span>
                    {tocOpen ? (
                      <ChevronUp className="h-5 w-5 text-secondary-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-secondary-500" />
                    )}
                  </button>
                  {tocOpen && (
                    <div className="px-4 pb-4">
                      <ul className="space-y-1">
                        {tocItems.map((item) => (
                          <li key={item.id}>
                            <button
                              onClick={() => scrollToSection(item.id)}
                              className="w-full text-left text-sm px-3 py-2 rounded-lg text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-white hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                            >
                              {item.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              </div>

              {/* FAQ Sections */}
              <div className="flex-1 min-w-0 space-y-8">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  const iconColorClass = categoryIconColors[category.id] || 'bg-primary-50 dark:bg-primary-900/50 text-primary-500';
                  return (
                    <Card
                      key={category.id}
                      id={category.id}
                      className="scroll-mt-24 p-6 sm:p-8"
                    >
                      {/* Category Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconColorClass}`}>
                          <Icon
                            className="h-6 w-6"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-secondary-500 dark:text-secondary-400">
                            {category.questions.length} questions
                          </p>
                          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                            {category.title}
                          </h2>
                        </div>
                      </div>

                      {/* Questions List */}
                      <div className="space-y-8">
                        {category.questions.map((q, index) => (
                          <div
                            key={q.id}
                            id={`question-${q.id}`}
                            className={index < category.questions.length - 1 ? 'pb-8 border-b border-secondary-200 dark:border-secondary-700' : ''}
                          >
                            <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-3">
                              {q.question}
                            </h3>
                            <p className="text-secondary-600 dark:text-secondary-400 leading-relaxed">
                              {q.answer}
                            </p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>

      {/* CTA Section - removed border-t */}
      <section>
        <div className="container mx-auto px-4 py-16 pb-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-900/50 mb-6">
              <HelpCircle className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100 mb-4">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-secondary-600 dark:text-secondary-400 mb-8">
              Our support team is here to help. Reach out and we&apos;ll get back
              to you within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg">
                <Link href="/help">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild size="lg">
                <Link href="/sdk">View Documentation</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
