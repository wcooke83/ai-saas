/**
 * URL Content Extractor
 * Scrapes and extracts main content from web pages
 */

import * as cheerio from 'cheerio';

/**
 * Extract main content from a URL
 */
export async function extractURL(url: string): Promise<string> {
  try {
    // Fetch the page
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; AIBot/1.0; +https://example.com/bot)',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    return extractContentFromHTML(html, url);
  } catch (error) {
    console.error('URL extraction error:', error);
    throw new Error(
      `Failed to extract URL content: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * Extract main content from HTML
 */
export function extractContentFromHTML(html: string, sourceUrl?: string): string {
  const $ = cheerio.load(html);

  // Remove unwanted elements
  $(
    'script, style, nav, header, footer, aside, .sidebar, .navigation, .menu, .ad, .advertisement, .cookie-banner, #cookie-banner, .popup, .modal, noscript, iframe, svg'
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
