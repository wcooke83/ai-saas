import { describe, it, expect } from 'vitest';
import { extractContentFromHTML } from './url';

describe('extractContentFromHTML', () => {
  it('extracts text from article element', () => {
    const html = `
      <html>
        <body>
          <nav>Navigation links</nav>
          <article>
            <h1>Article Title</h1>
            <p>This is the main content of the article that should be extracted properly for the knowledge base.</p>
            <p>It contains multiple paragraphs with enough content to pass the 200 character threshold for selection.</p>
          </article>
          <footer>Footer content</footer>
        </body>
      </html>`;
    const result = extractContentFromHTML(html);
    expect(result).toContain('Article Title');
    expect(result).toContain('main content');
    expect(result).not.toContain('Navigation links');
    expect(result).not.toContain('Footer content');
  });

  it('removes script and style elements', () => {
    const html = `
      <html>
        <head><style>.foo { color: red; }</style></head>
        <body>
          <script>console.log("should not appear")</script>
          <main><p>Actual content that we want to extract from this page for embedding and knowledge base purposes. This needs to be long enough.</p></main>
        </body>
      </html>`;
    const result = extractContentFromHTML(html);
    expect(result).not.toContain('console.log');
    expect(result).not.toContain('.foo');
    expect(result).toContain('Actual content');
  });

  it('removes nav, header, footer, aside', () => {
    const html = `
      <html><body>
        <header>Header stuff</header>
        <aside>Sidebar content</aside>
        <main><p>Main body content that is long enough to be selected as the primary content area for extraction over two hundred chars definitely.</p></main>
        <footer>Copyright</footer>
      </body></html>`;
    const result = extractContentFromHTML(html);
    expect(result).not.toContain('Header stuff');
    expect(result).not.toContain('Sidebar content');
    expect(result).not.toContain('Copyright');
    expect(result).toContain('Main body content');
  });

  it('falls back to body when content selectors have < 200 chars', () => {
    const html = `
      <html><body>
        <article>Short.</article>
        <div>This body-level content is the main content of the page and should be extracted when article is too short to use and we need fallback behavior here with more text.</div>
      </body></html>`;
    const result = extractContentFromHTML(html);
    expect(result).toContain('body-level content');
  });

  it('prepends title', () => {
    const html = `
      <html>
        <head><title>Page Title</title></head>
        <body><p>Some content text.</p></body>
      </html>`;
    const result = extractContentFromHTML(html);
    expect(result).toContain('# Page Title');
  });

  it('prepends source URL when provided', () => {
    const html = '<html><body><p>Content</p></body></html>';
    const result = extractContentFromHTML(html, 'https://example.com/page');
    expect(result).toContain('Source: https://example.com/page');
  });

  it('does not prepend source when not provided', () => {
    const html = '<html><body><p>Content</p></body></html>';
    const result = extractContentFromHTML(html);
    expect(result).not.toContain('Source:');
  });

  it('uses h1 as title when no <title> tag', () => {
    // When h1 text already starts the body text, the function won't prepend it again.
    // Use a case where body text starts differently from the h1.
    const html = `
      <html><body>
        <div>Introduction paragraph that comes before the heading in DOM order.</div>
        <h1>Heading Title</h1>
        <p>Some paragraph content here.</p>
      </body></html>`;
    const result = extractContentFromHTML(html);
    expect(result).toContain('# Heading Title');
  });

  it('normalizes whitespace', () => {
    const html = `
      <html><body>
        <p>Text    with    lots     of     spaces.</p>
      </body></html>`;
    const result = extractContentFromHTML(html);
    expect(result).not.toContain('    ');
  });
});
