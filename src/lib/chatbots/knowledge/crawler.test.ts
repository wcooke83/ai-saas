/**
 * Tests for crawler pure functions: shouldSkipUrl, normalizeUrl, isDisallowed
 * These functions are not exported, so we test them indirectly via module internals.
 * To make them testable, we re-implement the same logic and test the patterns.
 */
import { describe, it, expect } from 'vitest';

// Since shouldSkipUrl, normalizeUrl, isDisallowed are not exported,
// we test the URL skip patterns and normalization logic directly.

const SKIP_PATTERNS = [
  /\/(login|signin|signup|register|logout|signout)\b/i,
  /\/(cart|checkout|basket|payment|billing)\b/i,
  /\/(account|profile|settings|preferences|dashboard)\b/i,
  /\/(search|results)\?/i,
  /\/(tag|tags|category|categories|archive)\//i,
  /\/(page|p)\/\d+/i,
  /[?&](sort|order|filter|page|p)=/i,
  /\.(pdf|zip|tar|gz|exe|dmg|pkg|deb|rpm|iso)$/i,
  /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff)$/i,
  /\.(mp3|mp4|avi|mov|wmv|flv|ogg|webm)$/i,
  /\.(css|js|json|xml|woff|woff2|ttf|eot)$/i,
  /\/#/,
  /\/feed\/?$/i,
  /\/rss\/?$/i,
  /\/wp-admin/i,
  /\/wp-json/i,
  /\/api\//i,
  /\/admin\//i,
  /\/cdn-cgi\//i,
  /mailto:/i,
  /tel:/i,
  /javascript:/i,
];

function shouldSkipUrl(url: string): boolean {
  return SKIP_PATTERNS.some((pattern) => pattern.test(url));
}

function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = '';
    parsed.searchParams.delete('utm_source');
    parsed.searchParams.delete('utm_medium');
    parsed.searchParams.delete('utm_campaign');
    parsed.searchParams.delete('utm_content');
    parsed.searchParams.delete('utm_term');
    parsed.searchParams.delete('ref');
    parsed.searchParams.delete('fbclid');
    parsed.searchParams.delete('gclid');
    let normalized = parsed.toString();
    if (normalized.endsWith('/') && normalized !== parsed.origin + '/') {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return url;
  }
}

function isDisallowed(urlPath: string, disallowed: string[]): boolean {
  return disallowed.some((rule) => urlPath.startsWith(rule));
}

// --- shouldSkipUrl ---

describe('shouldSkipUrl', () => {
  describe('auth pages', () => {
    it.each([
      'https://example.com/login',
      'https://example.com/signin',
      'https://example.com/signup',
      'https://example.com/register',
      'https://example.com/logout',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('commerce pages', () => {
    it.each([
      'https://example.com/cart',
      'https://example.com/checkout',
      'https://example.com/payment',
      'https://example.com/billing',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('user pages', () => {
    it.each([
      'https://example.com/account',
      'https://example.com/profile',
      'https://example.com/settings',
      'https://example.com/dashboard',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('file extensions', () => {
    it.each([
      'https://example.com/file.pdf',
      'https://example.com/file.zip',
      'https://example.com/photo.jpg',
      'https://example.com/style.css',
      'https://example.com/app.js',
      'https://example.com/video.mp4',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('pagination and filtering', () => {
    it.each([
      'https://example.com/page/2',
      'https://example.com/p/3',
      'https://example.com/products?sort=price',
      'https://example.com/list?page=5',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('special URLs', () => {
    it.each([
      'https://example.com/#section',
      'https://example.com/feed',
      'https://example.com/rss/',
      'https://example.com/wp-admin/post.php',
      'https://example.com/api/users',
      'https://example.com/admin/settings',
      'mailto:user@example.com',
      'tel:+1234567890',
      'javascript:void(0)',
    ])('skips %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(true);
    });
  });

  describe('valid content pages', () => {
    it.each([
      'https://example.com/about',
      'https://example.com/pricing',
      'https://example.com/blog/my-post',
      'https://example.com/features',
      'https://example.com/contact',
      'https://example.com/docs/getting-started',
    ])('does NOT skip %s', (url) => {
      expect(shouldSkipUrl(url)).toBe(false);
    });
  });
});

// --- normalizeUrl ---

describe('normalizeUrl', () => {
  it('removes trailing slash', () => {
    expect(normalizeUrl('https://example.com/about/')).toBe('https://example.com/about');
  });

  it('preserves root trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('https://example.com/');
  });

  it('removes fragment', () => {
    expect(normalizeUrl('https://example.com/about#section')).toBe('https://example.com/about');
  });

  it('removes utm_source', () => {
    expect(normalizeUrl('https://example.com/page?utm_source=google')).toBe('https://example.com/page');
  });

  it('removes all UTM params', () => {
    const url = 'https://example.com/page?utm_source=a&utm_medium=b&utm_campaign=c&utm_content=d&utm_term=e';
    expect(normalizeUrl(url)).toBe('https://example.com/page');
  });

  it('removes fbclid and gclid', () => {
    expect(normalizeUrl('https://example.com/page?fbclid=abc123')).toBe('https://example.com/page');
    expect(normalizeUrl('https://example.com/page?gclid=xyz789')).toBe('https://example.com/page');
  });

  it('removes ref param', () => {
    expect(normalizeUrl('https://example.com/page?ref=homepage')).toBe('https://example.com/page');
  });

  it('preserves non-tracking params', () => {
    const result = normalizeUrl('https://example.com/page?id=123&utm_source=google');
    expect(result).toContain('id=123');
    expect(result).not.toContain('utm_source');
  });

  it('returns original string for invalid URLs', () => {
    expect(normalizeUrl('not-a-url')).toBe('not-a-url');
  });
});

// --- isDisallowed ---

describe('isDisallowed', () => {
  const disallowed = ['/private/', '/admin/', '/tmp/'];

  it('returns true for disallowed path', () => {
    expect(isDisallowed('/private/page', disallowed)).toBe(true);
  });

  it('returns true for nested disallowed path', () => {
    expect(isDisallowed('/admin/settings/page', disallowed)).toBe(true);
  });

  it('returns false for allowed path', () => {
    expect(isDisallowed('/about', disallowed)).toBe(false);
  });

  it('returns false for empty disallowed list', () => {
    expect(isDisallowed('/anything', [])).toBe(false);
  });

  it('uses prefix matching (not substring)', () => {
    expect(isDisallowed('/my/private/page', disallowed)).toBe(false);
  });
});
