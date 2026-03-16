/**
 * Live URL Fetch Fallback — Two-Pass AI Approach
 *
 * When RAG embeddings don't confidently answer a query:
 * 1. Fetch the pinned URL(s) and extract all links from the page
 * 2. Ask the AI which link(s) would answer the user's question (Pass 1)
 * 3. Fetch those pages via Jina Reader
 * 4. Return the content for inclusion in the main AI prompt (Pass 2)
 */

import * as cheerio from 'cheerio';
import { extractURL } from './extractors/url';
import { generate } from '@/lib/ai/provider';

// Max total chars for fetched content (~10K tokens, leaves room for conversation history within 131K limit)
const MAX_CONTENT_CHARS = 40000;

interface PageLink {
  url: string;
  text: string;
}

/**
 * Fetch relevant page content from pinned URLs using a two-pass AI approach.
 * Pass 1: AI picks the best link from the site. Pass 2: content is returned for the main prompt.
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

  // Step 1: For each pinned URL, extract all links from the page
  const allLinks: PageLink[] = [];

  for (const url of pinnedUrls) {
    console.log(`[Live Fetch] Extracting links from pinned URL: ${url}`);
    const links = await extractLinksFromUrl(url);
    if (links.length > 0) {
      console.log(`[Live Fetch] Found ${links.length} links on ${url}`);
      allLinks.push(...links);
    } else {
      console.log(`[Live Fetch] No links found on ${url}`);
    }
  }

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

  // Step 2: Ask the AI which link(s) would answer the user's question
  const linkList = uniqueLinks
    .map((link, i) => `${i + 1}. "${link.text}" — ${link.url}`)
    .join('\n');

  const pickPrompt = `The user asked: "${query}"

Here are the links found on the website. Which link(s) would most likely contain the answer to the user's question? Reply with ONLY the URL(s), one per line, nothing else.

${linkList}`;

  console.log(`[Live Fetch] Asking AI to pick best link(s) from ${uniqueLinks.length} options...`);
  console.log(`[Live Fetch] First 10 links:`);
  uniqueLinks.slice(0, 10).forEach((l, i) => console.log(`  ${i + 1}. "${l.text}" → ${l.url}`));
  console.log(`[Live Fetch] Pick prompt length: ${pickPrompt.length} chars`);

  let aiPickedUrls: string[] = [];
  try {
    const result = await generate(pickPrompt, {
      maxTokens: 300,
      temperature: 0,
      systemPrompt: 'You are a helpful assistant. Given a user question and a list of website links, identify which link(s) would contain the answer. Reply with ONLY the full URL(s), one per line.',
    });

    console.log(`[Live Fetch] AI raw response:`, JSON.stringify(result.content));
    console.log(`[Live Fetch] AI used ${result.tokensInput} input tokens, ${result.tokensOutput} output tokens, ${result.durationMs}ms`);

    // Parse URLs from the AI's response
    aiPickedUrls = result.content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('http'));

    console.log(`[Live Fetch] AI picked ${aiPickedUrls.length} URL(s):`, aiPickedUrls);
  } catch (err: any) {
    console.error('[Live Fetch] AI link picker failed:', err?.message || err);
    console.error('[Live Fetch] Full error:', JSON.stringify(err, null, 2));
    return '';
  }

  if (aiPickedUrls.length === 0) {
    console.log('[Live Fetch] AI did not pick any valid URLs');
    return '';
  }

  // Step 3: Fetch the picked pages via Jina Reader — send full page to AI
  const results: string[] = [];
  let totalChars = 0;

  for (const url of aiPickedUrls.slice(0, 2)) {
    if (totalChars >= MAX_CONTENT_CHARS) break;

    try {
      let content = await extractURL(url);
      if (!content || content.trim().length < 50) continue;

      console.log(`[Live Fetch] Fetched ${url}: ${content.length} chars raw`);

      // Clean content: remove markdown images and excessive whitespace
      content = cleanContent(content);
      console.log(`[Live Fetch] After cleaning: ${content.length} chars`);

      // Cap to stay within limits
      const remaining = MAX_CONTENT_CHARS - totalChars;
      if (content.length > remaining) {
        content = content.substring(0, remaining) + '\n[...truncated]';
      }

      results.push(content);
      totalChars += content.length;
    } catch (err) {
      console.warn(`[Live Fetch] Failed to fetch ${url}:`, err);
    }
  }

  if (results.length === 0) return '';

  console.log(`[Live Fetch] Total fetched content: ${totalChars} chars`);
  return results.join('\n\n---\n\n');
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
