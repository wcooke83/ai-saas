const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('https://windsurf.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const data = await page.evaluate(() => {
    const results = {};

    // Find the hero container with the sea shade background
    const heroWrapper = document.querySelector('.bg-sk-sea-shade') || 
                        document.querySelector('[class*="sea-shade"]');
    if (heroWrapper) {
      const s = window.getComputedStyle(heroWrapper);
      results.heroWrapper = {
        tag: heroWrapper.tagName,
        classes: heroWrapper.className,
        bg: s.backgroundColor,
        display: s.display,
        flexDirection: s.flexDirection,
        overflow: s.overflow,
      };
    }

    // Find ALL buttons with computed styles inside the hero section
    const heroSection = document.querySelector('section');
    if (heroSection) {
      const btns = heroSection.querySelectorAll('a, button');
      results.heroCTAButtons = Array.from(btns).map(b => {
        const s = window.getComputedStyle(b);
        return {
          text: b.textContent.trim().slice(0, 50),
          tag: b.tagName,
          classes: b.className.slice(0, 300),
          bg: s.backgroundColor,
          color: s.color,
          border: s.border,
          borderColor: s.borderColor,
          borderWidth: s.borderWidth,
          borderRadius: s.borderRadius,
          paddingTop: s.paddingTop,
          paddingBottom: s.paddingBottom,
          paddingLeft: s.paddingLeft,
          paddingRight: s.paddingRight,
          fontSize: s.fontSize,
          fontWeight: s.fontWeight,
          backdropFilter: s.backdropFilter,
          display: s.display,
          height: s.height,
          minWidth: s.minWidth,
        };
      });
    }

    // Get the hero inner layout container
    const heroInner = document.querySelector('.max-w-7xl');
    if (heroInner) {
      const s = window.getComputedStyle(heroInner);
      results.heroInner = {
        classes: heroInner.className,
        display: s.display,
        flexDirection: s.flexDirection,
        alignItems: s.alignItems,
        justifyContent: s.justifyContent,
        padding: s.padding,
        gap: s.gap,
        maxWidth: s.maxWidth,
      };
    }

    // Check wave container details
    const waveContainer = document.querySelector('.pointer-events-none.absolute[class*="left-[-210rem"]') ||
                          document.querySelector('[class*="-210rem"]');
    if (waveContainer) {
      const s = window.getComputedStyle(waveContainer);
      results.waveContainer = {
        classes: waveContainer.className,
        position: s.position,
        top: s.top,
        left: s.left,
        width: s.width,
        height: s.height,
        zIndex: s.zIndex,
        transform: s.transform,
      };
    }

    // Box shadow overlay
    const allDivs = Array.from(document.querySelectorAll('.bg-sk-sea-shade div')).slice(0, 50);
    results.heroChildrenWithBoxShadow = allDivs
      .filter(d => {
        const s = window.getComputedStyle(d);
        return s.boxShadow && s.boxShadow !== 'none';
      })
      .map(d => {
        const s = window.getComputedStyle(d);
        return { classes: d.className.slice(0, 200), boxShadow: s.boxShadow };
      });

    // Subheadline / tagline text
    const paragraphs = document.querySelectorAll('section p');
    results.paragraphs = Array.from(paragraphs).slice(0, 5).map(p => {
      const s = window.getComputedStyle(p);
      return {
        text: p.textContent.trim().slice(0, 100),
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        color: s.color,
        classes: p.className,
      };
    });

    return results;
  });

  fs.writeFileSync('/tmp/windsurf-buttons.json', JSON.stringify(data, null, 2));

  // Screenshot of just the hero CTA buttons area
  await page.screenshot({ 
    path: '/tmp/windsurf-cta.png', 
    clip: { x: 0, y: 200, width: 800, height: 300 } 
  });

  await browser.close();
  console.log('Done');
})();
