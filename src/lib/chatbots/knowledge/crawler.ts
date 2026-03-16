/**
 * Web Crawler
 * Discovers pages on a website via sitemap.xml and BFS link crawling.
 * Respects robots.txt, stays on-domain, and filters out low-value pages.
 */

import * as cheerio from 'cheerio';

const CRAWL_TIMEOUT = 15000; // 15s per page
const CRAWL_DELAY_MS = 1000; // 1s between requests (be polite)
const USER_AGENT = 'Mozilla/5.0 (compatible; AIBot/1.0; +https://example.com/bot)';

export interface CrawlOptions {
  maxPages: number;       // Max pages to discover (default 25)
  stayOnDomain: boolean;  // Only follow same-domain links (default true)
}

export interface CrawledPage {
  url: string;
  title: string;
  depth: number;
}

// URL patterns that are unlikely to contain useful knowledge content
const SKIP_PATTERNS = [
  /\/(login|signin|signup|register|logout|signout)\b/i,
  /\/(cart|checkout|basket|payment|billing)\b/i,
  /\/(account|profile|settings|preferences|dashboard)\b/i,
  /\/(search|results)\?/i,
  /\/(tag|tags|category|categories|archive)\//i,
  /\/(page|p)\/\d+/i,  // pagination
  /[?&](sort|order|filter|page|p)=/i,
  /\.(pdf|zip|tar|gz|exe|dmg|pkg|deb|rpm|iso)$/i,
  /\.(jpg|jpeg|png|gif|svg|webp|ico|bmp|tiff)$/i,
  /\.(mp3|mp4|avi|mov|wmv|flv|ogg|webm)$/i,
  /\.(css|js|json|xml|woff|woff2|ttf|eot)$/i,
  /\/#/,  // fragment-only links
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

/**
 * Crawl a website to discover pages with useful content.
 * Tries sitemap.xml first, then falls back to BFS link crawling.
 */
export async function crawlWebsite(
  startUrl: string,
  options: Partial<CrawlOptions> = {}
): Promise<CrawledPage[]> {
  const { maxPages = 25, stayOnDomain = true } = options;

  const baseUrl = new URL(startUrl);
  const domain = baseUrl.hostname;

  console.log(`[Crawler] Starting crawl of ${domain} (max ${maxPages} pages)`);

  // Check robots.txt
  const disallowed = await fetchRobotsTxt(baseUrl.origin);
  console.log(`[Crawler] robots.txt: ${disallowed.length} disallowed paths`);

  // Try sitemap.xml first (faster, more reliable)
  let pages = await discoverFromSitemap(baseUrl.origin, domain, maxPages, disallowed);

  if (pages.length >= 5) {
    console.log(`[Crawler] Found ${pages.length} pages from sitemap`);
    return pages.slice(0, maxPages);
  }

  // Fall back to BFS link crawling
  console.log(`[Crawler] Sitemap insufficient (${pages.length} pages), falling back to BFS crawl`);
  pages = await bfsCrawl(startUrl, domain, maxPages, stayOnDomain, disallowed);

  console.log(`[Crawler] Discovered ${pages.length} pages total`);
  return pages;
}

/**
 * Parse robots.txt and return list of disallowed paths
 */
async function fetchRobotsTxt(origin: string): Promise<string[]> {
  try {
    const response = await fetch(`${origin}/robots.txt`, {
      headers: { 'User-Agent': USER_AGENT },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return [];

    const text = await response.text();
    const disallowed: string[] = [];
    let relevantSection = false;

    for (const line of text.split('\n')) {
      const trimmed = line.trim().toLowerCase();

      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.replace('user-agent:', '').trim();
        relevantSection = agent === '*' || agent === 'aibot';
      }

      if (relevantSection && trimmed.startsWith('disallow:')) {
        const path = line.trim().replace(/^disallow:\s*/i, '').trim();
        if (path) disallowed.push(path);
      }
    }

    return disallowed;
  } catch {
    return [];
  }
}

/**
 * Check if a URL path is disallowed by robots.txt
 */
function isDisallowed(urlPath: string, disallowed: string[]): boolean {
  return disallowed.some((rule) => urlPath.startsWith(rule));
}

/**
 * Check if a URL should be skipped based on patterns
 */
function shouldSkipUrl(url: string): boolean {
  return SKIP_PATTERNS.some((pattern) => pattern.test(url));
}

/**
 * Normalize a URL for deduplication
 */
function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    // Remove trailing slash, fragment, and common tracking params
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

/**
 * Discover pages from sitemap.xml
 */
async function discoverFromSitemap(
  origin: string,
  domain: string,
  maxPages: number,
  disallowed: string[]
): Promise<CrawledPage[]> {
  const sitemapUrls = [
    `${origin}/sitemap.xml`,
    `${origin}/sitemap_index.xml`,
    `${origin}/sitemap-index.xml`,
  ];

  const pages: CrawledPage[] = [];
  const seen = new Set<string>();

  for (const sitemapUrl of sitemapUrls) {
    if (pages.length >= maxPages) break;

    try {
      const response = await fetch(sitemapUrl, {
        headers: { 'User-Agent': USER_AGENT },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) continue;

      const xml = await response.text();
      const $ = cheerio.load(xml, { xml: true });

      // Check for sitemap index (contains links to other sitemaps)
      const sitemapLinks = $('sitemap > loc').map((_, el) => $(el).text().trim()).get();
      if (sitemapLinks.length > 0) {
        // Recursively fetch child sitemaps (limit to first 3)
        for (const childUrl of sitemapLinks.slice(0, 3)) {
          if (pages.length >= maxPages) break;
          try {
            const childResp = await fetch(childUrl, {
              headers: { 'User-Agent': USER_AGENT },
              signal: AbortSignal.timeout(10000),
            });
            if (!childResp.ok) continue;
            const childXml = await childResp.text();
            const child$ = cheerio.load(childXml, { xml: true });
            child$('url > loc').each((_, el) => {
              if (pages.length >= maxPages) return;
              const url = child$(el).text().trim();
              addPageIfValid(url, domain, disallowed, seen, pages, 0);
            });
          } catch {
            // Skip failed child sitemaps
          }
        }
      }

      // Direct URL entries
      $('url > loc').each((_, el) => {
        if (pages.length >= maxPages) return;
        const url = $(el).text().trim();
        addPageIfValid(url, domain, disallowed, seen, pages, 0);
      });
    } catch {
      // Try next sitemap URL
    }
  }

  return pages;
}

/**
 * Add a page to the discovered list if it passes all filters
 */
function addPageIfValid(
  url: string,
  domain: string,
  disallowed: string[],
  seen: Set<string>,
  pages: CrawledPage[],
  depth: number
): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== domain) return false;

    const normalized = normalizeUrl(url);
    if (seen.has(normalized)) return false;

    if (shouldSkipUrl(url)) return false;
    if (isDisallowed(parsed.pathname, disallowed)) return false;

    seen.add(normalized);
    pages.push({
      url: normalized,
      title: '', // Will be populated during content extraction
      depth,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * BFS link crawling - follows links from the start URL
 */
async function bfsCrawl(
  startUrl: string,
  domain: string,
  maxPages: number,
  stayOnDomain: boolean,
  disallowed: string[]
): Promise<CrawledPage[]> {
  const pages: CrawledPage[] = [];
  const seen = new Set<string>();
  const queue: { url: string; depth: number }[] = [{ url: startUrl, depth: 0 }];

  seen.add(normalizeUrl(startUrl));
  pages.push({ url: normalizeUrl(startUrl), title: '', depth: 0 });

  while (queue.length > 0 && pages.length < maxPages) {
    const { url, depth } = queue.shift()!;

    // Don't crawl too deep (max 3 levels from start)
    if (depth > 3) continue;

    try {
      // Polite delay between requests
      if (pages.length > 1) {
        await new Promise((resolve) => setTimeout(resolve, CRAWL_DELAY_MS));
      }

      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html',
        },
        signal: AbortSignal.timeout(CRAWL_TIMEOUT),
        redirect: 'follow',
      });

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('text/html')) continue;

      const html = await response.text();
      const $ = cheerio.load(html);

      // Extract all links
      $('a[href]').each((_, el) => {
        if (pages.length >= maxPages) return;

        const href = $(el).attr('href');
        if (!href) return;

        try {
          const absoluteUrl = new URL(href, url).toString();
          const parsed = new URL(absoluteUrl);

          // Stay on domain
          if (stayOnDomain && parsed.hostname !== domain) return;

          addPageIfValid(absoluteUrl, domain, disallowed, seen, pages, depth + 1);

          // Also add to crawl queue for deeper discovery
          const normalized = normalizeUrl(absoluteUrl);
          if (depth + 1 <= 3) {
            queue.push({ url: normalized, depth: depth + 1 });
          }
        } catch {
          // Invalid URL, skip
        }
      });
    } catch {
      // Failed to fetch page, continue with others
    }
  }

  return pages;
}
