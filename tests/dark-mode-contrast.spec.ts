import { test, expect, Page } from '@playwright/test';

const pages = [
  { url: '/', name: 'Home' },
  { url: '/tools', name: 'Tools Index' },
  { url: '/tools/email-writer', name: 'Email Writer' },
  { url: '/tools/email-sequence', name: 'Email Sequence' },
  { url: '/tools/proposal-generator', name: 'Proposal Generator' },
  { url: '/pricing', name: 'Pricing' },
  { url: '/login', name: 'Login' },
  { url: '/signup', name: 'Signup' },
];

interface ContrastIssue {
  element: string;
  selector: string;
  foreground: string;
  background: string;
  contrastRatio: number;
  wcagLevel: string;
  text?: string;
}

// Calculate relative luminance
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio between two colors
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Parse color string to RGB
function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  if (!color || color === 'transparent') return null;

  // Handle rgba
  const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1]),
      g: parseInt(rgbaMatch[2]),
      b: parseInt(rgbaMatch[3]),
      a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
    };
  }

  return null;
}

async function checkContrastIssues(page: Page): Promise<ContrastIssue[]> {
  return await page.evaluate(() => {
    const issues: ContrastIssue[] = [];

    function getLuminance(r: number, g: number, b: number): number {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    function getContrastRatio(l1: number, l2: number): number {
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
      if (!color || color === 'transparent') return null;
      const rgbaMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        return {
          r: parseInt(rgbaMatch[1]),
          g: parseInt(rgbaMatch[2]),
          b: parseInt(rgbaMatch[3]),
          a: rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1
        };
      }
      return null;
    }

    function getEffectiveBackground(element: Element): { r: number; g: number; b: number } | null {
      let current: Element | null = element;
      while (current) {
        const style = window.getComputedStyle(current);
        const bg = parseColor(style.backgroundColor);
        if (bg && bg.a > 0.1) {
          return { r: bg.r, g: bg.g, b: bg.b };
        }
        current = current.parentElement;
      }
      // Default to dark background in dark mode
      const isDark = document.documentElement.classList.contains('dark');
      return isDark ? { r: 9, g: 9, b: 11 } : { r: 255, g: 255, b: 255 };
    }

    function getSelector(element: Element): string {
      if (element.id) return `#${element.id}`;
      if (element.className && typeof element.className === 'string') {
        const classes = element.className.split(' ').filter(c => c && !c.startsWith('_')).slice(0, 2);
        if (classes.length) return `${element.tagName.toLowerCase()}.${classes.join('.')}`;
      }
      return element.tagName.toLowerCase();
    }

    // Check all text elements
    const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li, td, th, div, input, textarea');

    textElements.forEach(element => {
      const style = window.getComputedStyle(element);
      const text = element.textContent?.trim();

      // Skip elements with no visible text
      if (!text || text.length === 0) return;
      if (style.display === 'none' || style.visibility === 'hidden') return;
      if (parseFloat(style.opacity) < 0.1) return;

      const fgColor = parseColor(style.color);
      if (!fgColor || fgColor.a < 0.1) return;

      const bgColor = getEffectiveBackground(element);
      if (!bgColor) return;

      const fgLum = getLuminance(fgColor.r, fgColor.g, fgColor.b);
      const bgLum = getLuminance(bgColor.r, bgColor.g, bgColor.b);
      const ratio = getContrastRatio(fgLum, bgLum);

      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight);
      const isLargeText = fontSize >= 24 || (fontSize >= 18.67 && fontWeight >= 700);

      // WCAG AA: 4.5:1 for normal text, 3:1 for large text
      // WCAG AAA: 7:1 for normal text, 4.5:1 for large text
      const minRatio = isLargeText ? 3 : 4.5;

      if (ratio < minRatio) {
        issues.push({
          element: element.tagName.toLowerCase(),
          selector: getSelector(element),
          foreground: style.color,
          background: `rgb(${bgColor.r}, ${bgColor.g}, ${bgColor.b})`,
          contrastRatio: Math.round(ratio * 100) / 100,
          wcagLevel: isLargeText ? 'AA (large text: 3:1)' : 'AA (normal text: 4.5:1)',
          text: text.substring(0, 50) + (text.length > 50 ? '...' : '')
        });
      }
    });

    // Deduplicate by selector and similar contrast ratio
    const seen = new Set<string>();
    return issues.filter(issue => {
      const key = `${issue.selector}-${Math.round(issue.contrastRatio)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  });
}

async function checkMissingDarkModeStyles(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const issues: string[] = [];
    const isDark = document.documentElement.classList.contains('dark');
    if (!isDark) return issues;

    // Check for white or very light backgrounds that should be dark
    const elements = document.querySelectorAll('div, section, main, article, aside, header, footer, nav');
    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      const bg = style.backgroundColor;
      const match = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (match) {
        const [, r, g, b] = match.map(Number);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        // If brightness > 200, it's likely a light background that should be dark
        if (brightness > 200 && style.display !== 'none') {
          const rect = element.getBoundingClientRect();
          if (rect.width > 50 && rect.height > 50) {
            const className = element.className?.toString().split(' ').slice(0, 2).join(' ') || '';
            issues.push(`Light background found: ${element.tagName.toLowerCase()}${className ? '.' + className.replace(/\s+/g, '.') : ''} (bg: rgb(${r},${g},${b}))`);
          }
        }
      }
    });

    return [...new Set(issues)].slice(0, 10); // Limit to 10 unique issues
  });
}

test.describe('Dark Mode Contrast Testing', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} - Dark mode contrast check`, async ({ page }) => {
      // Navigate to page
      await page.goto(`http://localhost:3030${pageInfo.url}`, { waitUntil: 'networkidle' });

      // Enable dark mode
      await page.evaluate(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      });

      // Wait for styles to apply
      await page.waitForTimeout(500);

      // Take screenshot
      await page.screenshot({
        path: `tests/screenshots/${pageInfo.name.toLowerCase().replace(/\s+/g, '-')}-dark.png`,
        fullPage: true
      });

      // Check contrast issues
      const contrastIssues = await checkContrastIssues(page);
      const missingDarkStyles = await checkMissingDarkModeStyles(page);

      // Log results
      console.log(`\n=== ${pageInfo.name} (${pageInfo.url}) ===`);
      console.log(`Dark mode enabled: ${await page.evaluate(() => document.documentElement.classList.contains('dark'))}`);

      if (contrastIssues.length === 0) {
        console.log('No contrast issues found!');
      } else {
        console.log(`\nContrast Issues (${contrastIssues.length}):`);
        contrastIssues.forEach((issue, i) => {
          console.log(`  ${i + 1}. ${issue.selector}`);
          console.log(`     Text: "${issue.text}"`);
          console.log(`     Foreground: ${issue.foreground}`);
          console.log(`     Background: ${issue.background}`);
          console.log(`     Contrast: ${issue.contrastRatio}:1 (Required: ${issue.wcagLevel})`);
        });
      }

      if (missingDarkStyles.length > 0) {
        console.log(`\nPotential Missing Dark Mode Styles:`);
        missingDarkStyles.forEach((issue, i) => {
          console.log(`  ${i + 1}. ${issue}`);
        });
      }

      // Store results for report
      test.info().annotations.push({
        type: 'contrast-issues',
        description: JSON.stringify({ page: pageInfo.name, issues: contrastIssues, missingStyles: missingDarkStyles })
      });
    });
  }
});
