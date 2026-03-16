/**
 * URL Content Extractor
 * Scrapes and extracts main content from web pages
 * Uses Jina AI Reader for JS-rendered pages, falls back to direct fetch + cheerio
 */

import * as cheerio from 'cheerio';

const JINA_READER_PREFIX = 'https://r.jina.ai/';
const FETCH_TIMEOUT = 30000; // 30 seconds

/**
 * Extract main content from a URL
 * Tries Jina AI Reader first (handles JS rendering), falls back to direct scraping
 */
export async function extractURL(url: string): Promise<string> {
  // Try Jina AI Reader first (free, no API key, handles JS rendering)
  try {
    console.log(`[URL Extractor] Trying Jina Reader for: ${url}`);
    const content = await extractWithJina(url);
    if (content && content.trim().length > 100) {
      console.log(`[URL Extractor] Jina Reader succeeded: ${content.length} chars`);
      return content;
    }
    console.log('[URL Extractor] Jina Reader returned insufficient content, trying direct fetch');
  } catch (error) {
    console.warn('[URL Extractor] Jina Reader failed, falling back to direct fetch:', error);
  }

  // Fallback: direct fetch + cheerio (works for static HTML pages)
  try {
    console.log(`[URL Extractor] Trying direct fetch for: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIBot/1.0; +https://example.com/bot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    const content = extractContentFromHTML(html, url);
    console.log(`[URL Extractor] Direct fetch succeeded: ${content.length} chars`);
    return content;
  } catch (error) {
    console.error('[URL Extractor] Direct fetch also failed:', error);
    throw new Error(
      `Failed to extract URL content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract content using Jina AI Reader (handles JavaScript-rendered pages)
 */
async function extractWithJina(url: string): Promise<string> {
  const jinaUrl = `${JINA_READER_PREFIX}${url}`;

  const response = await fetch(jinaUrl, {
    headers: {
      Accept: 'text/plain',
    },
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(`Jina Reader returned ${response.status}: ${response.statusText}`);
  }

  const text = await response.text();

  // Jina returns markdown — prepend source URL
  return `Source: ${url}\n\n${text.trim()}`;
}

/**
 * Extract main content from HTML
 */
export function extractContentFromHTML(html: string, sourceUrl?: string): string {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $(
    'script, style, nav, header, footer, aside, .sidebar, .navigation, .menu, .ad, .advertisement, .cookie-banner, #cookie-banner, .popup, .modal, noscript, iframe, svg, img, figure, picture'
  ).remove();

  // Try to find main content area
  let mainContent = '';

  // Priority: article > main > [role="main"] > .content > #content > body
  const contentSelectors = [
    'article',
    'main',
    '[role="main"]',
    '.content',
    '.post-content',
    '.article-content',
    '.entry-content',
    '#content',
    '#main-content',
    '.main-content',
  ];

  for (const selector of contentSelectors) {
    const element = $(selector);
    if (element.length > 0) {
      mainContent = element.first().text();
      if (mainContent.trim().length > 200) {
        break;
      }
    }
  }

  // Fall back to body content
  if (!mainContent || mainContent.trim().length < 200) {
    mainContent = $('body').text();
  }

  // Clean up the text
  let text = mainContent
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();

  // Extract title
  const title = $('title').text().trim() || $('h1').first().text().trim();

  // Prepend title if available
  if (title && !text.startsWith(title)) {
    text = `# ${title}\n\n${text}`;
  }

  // Add source URL as metadata
  if (sourceUrl) {
    text = `Source: ${sourceUrl}\n\n${text}`;
  }

  return text;
}
