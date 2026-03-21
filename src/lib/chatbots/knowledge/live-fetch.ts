/**
 * Live URL Fetch Fallback — Two-Pass AI Approach
 *
 * When RAG embeddings don't confidently answer a query:
 * 1. Fetch the pinned URL(s) and extract all links from the page
 * 2. Ask the AI which link(s) would answer the user's question (Pass 1)
 * 3. Fetch those pages via Jina Reader
 * 4. Return the content for inclusion in the main AI prompt (Pass 2)
 *
 * All three stages are cached in-memory with configurable TTLs.
 */

import * as cheerio from 'cheerio';
import { extractURL, LIVE_FETCH_TIMEOUT } from './extractors/url';
import { generate } from '@/lib/ai/provider';

// Max total chars for fetched content (~10K tokens, leaves room for conversation history within 131K limit)
const MAX_CONTENT_CHARS = 40000;

// ============================================
// CACHE CONFIGURATION
// ============================================

export interface LiveFetchCacheConfig {
  /** TTL for extracted links per pinned URL (ms). Default: 10 minutes */
  linksTtlMs: number;
  /** TTL for Jina Reader content per URL (ms). Default: 30 minutes */
  contentTtlMs: number;
  /** TTL for AI link-picking results by query+URL set (ms). Default: 5 minutes */
  aiPickTtlMs: number;
}

const DEFAULT_CACHE_CONFIG: LiveFetchCacheConfig = {
  linksTtlMs: 10 * 60 * 1000,    // 10 minutes
  contentTtlMs: 30 * 60 * 1000,  // 30 minutes
  aiPickTtlMs: 5 * 60 * 1000,    // 5 minutes
};

let cacheConfig: LiveFetchCacheConfig = { ...DEFAULT_CACHE_CONFIG };

/** Override cache TTLs at runtime */
export function configureLiveFetchCache(config: Partial<LiveFetchCacheConfig>): void {
  cacheConfig = { ...cacheConfig, ...config };
}

// ============================================
// IN-MEMORY TTL CACHE
// ============================================

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class TtlCache<T> {
  private store = new Map<string, CacheEntry<T>>();

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
    // Lazy cleanup: prune expired entries when map grows large
    if (this.store.size > 500) this.prune();
  }

  private prune(): void {
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) this.store.delete(key);
    }
  }

  get size(): number { return this.store.size; }

  clear(): void { this.store.clear(); }
}

// Separate caches for each stage
const linksCache = new TtlCache<PageLink[]>();
const contentCache = new TtlCache<string | null>();
const aiPickCache = new TtlCache<string[]>();

/** Clear all live fetch caches (useful for testing) */
export function clearLiveFetchCaches(): void {
  linksCache.clear();
  contentCache.clear();
  aiPickCache.clear();
}

// ============================================
// TYPES
// ============================================

interface PageLink {
  url: string;
  text: string;
}

// ============================================
// MAIN ENTRY POINT
// ============================================

/**
 * Fetch relevant page content from pinned URLs using a two-pass AI approach.
 * Pass 1: AI picks the best link from the site. Pass 2: content is returned for the main prompt.
 * All stages are cached with configurable TTLs.
 */
export async function fetchPinnedUrlContent(
  pinnedUrls: string[],
  query: string
): Promise<string> {
  console.log(`[Live Fetch] Called with ${pinnedUrls.length} pinned URL(s):`, pinnedUrls);
  console.log(`[Live Fetch] Query: "${query}"`);
  if (pinnedUrls.length === 0) {
    console.log('[Live Fetch] No pinned URLs provided, returning empty');
    return '';
  }

  // Step 1: For each pinned URL, extract all links (cached per URL)
  const linkResults = await Promise.all(
    pinnedUrls.map((url) => getCachedLinks(url))
  );
  const allLinks: PageLink[] = linkResults.flat();

  if (allLinks.length === 0) {
    console.log('[Live Fetch] No links found on any pinned URL');
    return '';
  }

  // Deduplicate links by URL
  const seen = new Set<string>();
  const uniqueLinks = allLinks.filter((link) => {
    if (seen.has(link.url)) return false;
    seen.add(link.url);
    return true;
  });

  // Step 2: Pick which link(s) to fetch
  // For small link sets, skip the AI call entirely — just fetch them all.
  // The AI picker adds ~1-2s of latency and is only worthwhile when choosing from many links.
  const SKIP_AI_THRESHOLD = 5;
  let aiPickedUrls: string[];

  if (uniqueLinks.length <= SKIP_AI_THRESHOLD) {
    console.log(`[Live Fetch] Only ${uniqueLinks.length} links (<= ${SKIP_AI_THRESHOLD}), skipping AI picker`);
    aiPickedUrls = uniqueLinks.map((l) => l.url);
  } else {
    aiPickedUrls = await getCachedAiPick(uniqueLinks, query);
  }

  if (aiPickedUrls.length === 0) {
    console.log('[Live Fetch] No valid URLs to fetch');
    return '';
  }

  // Step 3: Fetch the picked pages via Jina Reader (cached per URL)
  const fetchResults = await Promise.all(
    aiPickedUrls.slice(0, 2).map((url) => getCachedContent(url))
  );

  // Assemble results respecting char limit
  const results: string[] = [];
  let totalChars = 0;
  for (const content of fetchResults) {
    if (!content || totalChars >= MAX_CONTENT_CHARS) continue;
    const remaining = MAX_CONTENT_CHARS - totalChars;
    const trimmed = content.length > remaining
      ? content.substring(0, remaining) + '\n[...truncated]'
      : content;
    results.push(trimmed);
    totalChars += trimmed.length;
  }

  if (results.length === 0) return '';

  console.log(`[Live Fetch] Total fetched content: ${totalChars} chars`);
  return results.join('\n\n---\n\n');
}

// ============================================
// CACHED STAGE FUNCTIONS
// ============================================

/** Stage 1: Extract links from a URL, with cache */
async function getCachedLinks(url: string): Promise<PageLink[]> {
  const cached = linksCache.get(url);
  if (cached) {
    console.log(`[Live Fetch] Links cache HIT for ${url} (${cached.length} links)`);
    return cached;
  }

  console.log(`[Live Fetch] Links cache MISS for ${url}, fetching...`);
  const links = await extractLinksFromUrl(url);
  console.log(`[Live Fetch] Found ${links.length} links on ${url}`);
  linksCache.set(url, links, cacheConfig.linksTtlMs);
  return links;
}

/** Stage 2: AI link picker, with cache keyed on query + sorted URL set */
async function getCachedAiPick(uniqueLinks: PageLink[], query: string): Promise<string[]> {
  // Cache key: hash of query + sorted link URLs
  const urlsKey = uniqueLinks.map((l) => l.url).sort().join('|');
  const cacheKey = `${simpleHash(query)}:${simpleHash(urlsKey)}`;

  const cached = aiPickCache.get(cacheKey);
  if (cached) {
    console.log(`[Live Fetch] AI pick cache HIT (${cached.length} URLs)`);
    return cached;
  }

  console.log(`[Live Fetch] AI pick cache MISS, asking AI to pick from ${uniqueLinks.length} links...`);

  const linkList = uniqueLinks
    .map((link, i) => `${i + 1}. "${link.text}" — ${link.url}`)
    .join('\n');

  const pickPrompt = `The user asked: "${query}"

Here are the links found on the website. Which link(s) would most likely contain the answer to the user's question? Reply with ONLY the URL(s), one per line, nothing else.

${linkList}`;

  console.log(`[Live Fetch] First 10 links:`);
  uniqueLinks.slice(0, 10).forEach((l, i) => console.log(`  ${i + 1}. "${l.text}" → ${l.url}`));

  let aiPickedUrls: string[] = [];
  try {
    const result = await generate(pickPrompt, {
      maxTokens: 300,
      temperature: 0,
      systemPrompt: 'You are a helpful assistant. Given a user question and a list of website links, identify which link(s) would contain the answer. Reply with ONLY the full URL(s), one per line.',
    });

    console.log(`[Live Fetch] AI raw response:`, JSON.stringify(result.content));
    console.log(`[Live Fetch] AI used ${result.tokensInput} input tokens, ${result.tokensOutput} output tokens, ${result.durationMs}ms`);

    aiPickedUrls = result.content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http'));

    console.log(`[Live Fetch] AI picked ${aiPickedUrls.length} URL(s):`, aiPickedUrls);
  } catch (err: any) {
    console.error('[Live Fetch] AI link picker failed:', err?.message || err);
    return [];
  }

  aiPickCache.set(cacheKey, aiPickedUrls, cacheConfig.aiPickTtlMs);
  return aiPickedUrls;
}

/** Stage 3: Fetch and clean content from a URL, with cache */
async function getCachedContent(url: string): Promise<string | null> {
  const cached = contentCache.get(url);
  if (cached !== undefined) {
    console.log(`[Live Fetch] Content cache HIT for ${url} (${cached?.length ?? 0} chars)`);
    return cached;
  }

  console.log(`[Live Fetch] Content cache MISS for ${url}, fetching...`);
  try {
    let content = await extractURL(url, LIVE_FETCH_TIMEOUT);
    if (!content || content.trim().length < 50) {
      contentCache.set(url, null, cacheConfig.contentTtlMs);
      return null;
    }

    console.log(`[Live Fetch] Fetched ${url}: ${content.length} chars raw`);
    content = cleanContent(content);
    console.log(`[Live Fetch] After cleaning: ${content.length} chars`);

    contentCache.set(url, content, cacheConfig.contentTtlMs);
    return content;
  } catch (err) {
    console.warn(`[Live Fetch] Failed to fetch ${url}:`, err);
    contentCache.set(url, null, cacheConfig.contentTtlMs);
    return null;
  }
}

// ============================================
// HELPERS
// ============================================

/** Simple string hash for cache keys */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return hash.toString(36);
}

/**
 * Clean extracted content by removing markdown images, excessive whitespace,
 * and other noise that doesn't help answer user questions.
 */
function cleanContent(content: string): string {
  // Remove markdown images: ![alt](url) or [![alt](url)](link)
  // Matches: [![Image 123: text](url)](link) or ![text](url)
  let cleaned = content.replace(/!?\[([^\]]*\[[^\]]*\][^\]]*)\]\([^)]+\)/g, '');
  cleaned = cleaned.replace(/!?\[([^\]]*)\]\([^)]+\)/g, '');

  // Remove empty list bullets that might be left after image removal
  cleaned = cleaned.replace(/^\s*[-*]\s*\n/gm, '');

  // Normalize multiple blank lines to single blank line
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Fetch a page and extract all meaningful links with their visible text.
 */
async function extractLinksFromUrl(url: string): Promise<PageLink[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.log(`[Live Fetch] extractLinksFromUrl: HTTP ${response.status} for ${url}`);
      return [];
    }

    const html = await response.text();
    console.log(`[Live Fetch] extractLinksFromUrl: Got ${html.length} chars of HTML from ${url}`);
    const $ = cheerio.load(html);
    const origin = new URL(url).origin;
    const links: PageLink[] = [];
    const seen = new Set<string>();

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      // Resolve relative URLs
      let fullUrl: string;
      try {
        fullUrl = new URL(href, url).href;
      } catch { return; }

      // Only same-domain links
      if (!fullUrl.startsWith(origin)) return;

      // Skip anchors, javascript, images, files
      if (href.startsWith('#') || href.startsWith('javascript:')) return;
      if (/\.(jpg|jpeg|png|gif|svg|pdf|zip|css|js)$/i.test(fullUrl)) return;

      // Normalize: remove trailing slash and fragment
      fullUrl = fullUrl.split('#')[0].replace(/\/$/, '');

      // Deduplicate
      if (seen.has(fullUrl)) return;
      seen.add(fullUrl);

      // Get visible text for this link
      const text = $(el).text().trim().replace(/\s+/g, ' ');
      if (!text || text.length < 2) return;

      links.push({ url: fullUrl, text });
    });

    return links;
  } catch (err) {
    console.warn(`[Live Fetch] Failed to extract links from ${url}:`, err);
    return [];
  }
}
