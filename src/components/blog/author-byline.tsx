import Link from 'next/link';
import { type BlogAuthor, getAuthorForPost } from '@/lib/blog/authors';

interface AuthorBylineProps {
  /** Pass a post slug to auto-resolve the author */
  postSlug?: string;
  /** Or pass an author object directly */
  author?: BlogAuthor;
  /** Legacy props for backward compatibility */
  name?: string;
  role?: string;
  className?: string;
}

export function AuthorByline({
  postSlug,
  author: authorProp,
  name,
  role,
  className,
}: AuthorBylineProps) {
  // Resolve author: explicit author > postSlug lookup > legacy name/role > default
  const resolved: { name: string; title: string; slug: string | null } = (() => {
    if (authorProp) {
      return { name: authorProp.name, title: authorProp.title, slug: authorProp.slug };
    }
    if (postSlug) {
      const a = getAuthorForPost(postSlug);
      return { name: a.name, title: a.title, slug: a.slug };
    }
    if (name) {
      return { name, title: role || '', slug: null };
    }
    // Default fallback (backward-compatible with existing usage)
    return { name: 'Will Cooke', title: 'Founder at VocUI', slug: 'will-cooke' };
  })();

  const initials = resolved.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  const nameElement = resolved.slug ? (
    <Link
      href={`/blog/author/${resolved.slug}`}
      className="font-medium text-secondary-700 dark:text-secondary-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
    >
      {resolved.name}
    </Link>
  ) : (
    <span className="font-medium text-secondary-700 dark:text-secondary-300">
      {resolved.name}
    </span>
  );

  return (
    <div className={`flex items-center gap-3${className ? ` ${className}` : ''}`}>
      <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-xs font-semibold flex items-center justify-center">
        {initials}
      </div>
      <p className="text-sm text-secondary-600 dark:text-secondary-400">
        Written by {nameElement}
        {resolved.title && (
          <>
            {' \u00B7 '}
            {resolved.title}
          </>
        )}
      </p>
    </div>
  );
}
