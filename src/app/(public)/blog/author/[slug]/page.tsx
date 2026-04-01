import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { ArrowRight } from 'lucide-react';
import {
  AUTHORS,
  getAuthorBySlug,
  getPostSlugsForAuthor,
} from '@/lib/blog/authors';
import { getPostBySlug } from '@/lib/blog/posts';

// ─── Static Params ────────────────────────────────────────────────────────────

export function generateStaticParams() {
  return Object.values(AUTHORS).map((author) => ({
    slug: author.slug,
  }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = getAuthorBySlug(slug);
  if (!result) return {};

  const { author } = result;
  const title = `${author.name} | VocUI Blog`;
  const description = author.extendedBio;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://vocui.com/blog/author/${author.slug}`,
      siteName: 'VocUI',
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: { canonical: `https://vocui.com/blog/author/${author.slug}` },
    robots: { index: true, follow: true },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = getAuthorBySlug(slug);
  if (!result) notFound();

  const { key, author } = result;
  const postSlugs = getPostSlugsForAuthor(key);
  const posts = postSlugs
    .map((s) => getPostBySlug(s))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const initials = author.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  // ─── JSON-LD Person Schema ────────────────────────────────────────────────

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    url: `https://vocui.com/blog/author/${author.slug}`,
    jobTitle: author.title,
    description: author.extendedBio,
    knowsAbout: author.expertise,
    worksFor: {
      '@type': 'Organization',
      name: 'VocUI',
      url: 'https://vocui.com',
    },
  };

  return (
    <PageBackground>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Header />

      <main id="main-content" className="container mx-auto px-4 py-10 md:py-16 max-w-3xl">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 flex-wrap">
            <li>
              <Link href="/" className="hover:text-primary-500 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/blog" className="hover:text-primary-500 transition-colors">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-secondary-900 dark:text-secondary-100 font-medium">
              {author.name}
            </li>
          </ol>
        </nav>

        {/* Author header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xl font-semibold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
                {author.name}
              </h1>
              <p className="text-secondary-600 dark:text-secondary-400">
                {author.title}
              </p>
            </div>
          </div>
          <p className="text-secondary-700 dark:text-secondary-300 leading-relaxed max-w-2xl">
            {author.extendedBio}
          </p>
          {author.expertise.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {author.expertise.map((topic) => (
                <span
                  key={topic}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-400"
                >
                  {topic}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Post list */}
        {posts.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-6">
              Articles by {author.name}
            </h2>
            <div className="divide-y divide-secondary-200 dark:divide-secondary-700">
              {posts.map((post) => (
                <article key={post.slug} className="py-6 group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                        {post.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-secondary-600 dark:text-secondary-400 text-sm leading-relaxed mb-2">
                      {post.description}
                    </p>
                    <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 gap-1 group-hover:gap-2 transition-all">
                      Read article
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {posts.length === 0 && (
          <p className="text-secondary-500 dark:text-secondary-400">
            No articles published yet.
          </p>
        )}
      </main>

      <Footer />
    </PageBackground>
  );
}
