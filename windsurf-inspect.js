const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  console.log('Navigating to windsurf.com...');
  await page.goto('https://windsurf.com', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Full page screenshot
  await page.screenshot({ path: '/tmp/windsurf-full.png', fullPage: false });
  console.log('Full screenshot saved.');

  // Inspect hero section computed styles
  const heroData = await page.evaluate(() => {
    const results = {};

    // Find hero/first section
    const hero = document.querySelector('section') || document.querySelector('[class*="hero"]') || document.querySelector('header') || document.body.children[0];
    if (hero) {
      const s = window.getComputedStyle(hero);
      results.hero = {
        tag: hero.tagName,
        classes: hero.className,
        bg: s.backgroundColor,
        bgImage: s.backgroundImage,
        height: s.height,
        minHeight: s.minHeight,
        display: s.display,
        flexDirection: s.flexDirection,
        position: s.position,
        width: s.width,
      };
    }

    // Find the main headline (h1 or h2)
    const h1 = document.querySelector('h1') || document.querySelector('h2');
    if (h1) {
      const s = window.getComputedStyle(h1);
      results.headline = {
        text: h1.textContent.trim().slice(0, 100),
        tag: h1.tagName,
        classes: h1.className,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        lineHeight: s.lineHeight,
        letterSpacing: s.letterSpacing,
        color: s.color,
        fontFamily: s.fontFamily,
      };
    }

    // Find all buttons in first 2000px
    const btns = Array.from(document.querySelectorAll('a[href], button')).slice(0, 10);
    results.buttons = btns.map(b => {
      const s = window.getComputedStyle(b);
      return {
        text: b.textContent.trim().slice(0, 40),
        tag: b.tagName,
        classes: b.className.slice(0, 200),
        bg: s.backgroundColor,
        color: s.color,
        border: s.border,
        borderColor: s.borderColor,
        borderRadius: s.borderRadius,
        padding: s.padding,
        paddingTop: s.paddingTop,
        paddingBottom: s.paddingBottom,
        paddingLeft: s.paddingLeft,
        paddingRight: s.paddingRight,
        fontSize: s.fontSize,
        fontWeight: s.fontWeight,
        backdropFilter: s.backdropFilter,
      };
    });

    // Find SVG, canvas, or background-image wave elements
    const svgs = document.querySelectorAll('svg');
    results.svgs = Array.from(svgs).slice(0, 5).map(svg => ({
      classes: svg.className.baseVal || svg.getAttribute('class') || '',
      width: svg.getAttribute('width'),
      height: svg.getAttribute('height'),
      viewBox: svg.getAttribute('viewBox'),
      parentClasses: svg.parentElement ? svg.parentElement.className : '',
    }));

    const canvases = document.querySelectorAll('canvas');
    results.canvases = Array.from(canvases).map(c => ({
      width: c.width, height: c.height, classes: c.className
    }));

    // Check for absolutely positioned wave containers
    const allDivs = Array.from(document.querySelectorAll('div')).slice(0, 200);
    results.absoluteElements = allDivs
      .filter(d => {
        const s = window.getComputedStyle(d);
        return s.position === 'absolute' && (d.className.includes('wave') || d.className.includes('bg') || d.className.includes('hero') || d.className.includes('gradient'));
      })
      .slice(0, 5)
      .map(d => {
        const s = window.getComputedStyle(d);
        return {
          classes: d.className.slice(0, 200),
          top: s.top, left: s.left, right: s.right, bottom: s.bottom,
          zIndex: s.zIndex,
          width: s.width, height: s.height,
          bg: s.backgroundColor,
          bgImage: s.backgroundImage,
          overflow: s.overflow,
        };
      });

    // Get body background
    const body = window.getComputedStyle(document.body);
    results.bodyBg = body.backgroundColor;

    // Check for CSS custom properties on :root
    const rootStyles = window.getComputedStyle(document.documentElement);
    const vars = ['--background', '--color-bg', '--hero-bg', '--primary', '--foreground'];
    results.cssVars = {};
    vars.forEach(v => { results.cssVars[v] = rootStyles.getPropertyValue(v).trim(); });

    return results;
  });

  fs.writeFileSync('/tmp/windsurf-data.json', JSON.stringify(heroData, null, 2));
  console.log('DOM data saved.');

  // Get the exact background color of the page root / first section
  const bgColor = await page.evaluate(() => {
    // Walk up from h1 to find the hero container with a non-transparent background
    let el = document.querySelector('h1');
    while (el && el !== document.body) {
      const bg = window.getComputedStyle(el).backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
        return { element: el.tagName + '.' + el.className.slice(0, 100), bg };
      }
      el = el.parentElement;
    }
    return { element: 'body', bg: window.getComputedStyle(document.body).backgroundColor };
  });
  console.log('Hero BG color:', JSON.stringify(bgColor));

  // Scroll to capture wave section and screenshot
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({ path: '/tmp/windsurf-hero.png', clip: { x: 0, y: 0, width: 1440, height: 900 } });
  console.log('Hero screenshot saved.');

  // Get the wave/background element details more deeply
  const waveData = await page.evaluate(() => {
    // Look for any element that might be the wave
    const candidates = Array.from(document.querySelectorAll('*')).filter(el => {
      const cls = (el.className || '').toString().toLowerCase();
      const s = window.getComputedStyle(el);
      return cls.includes('wave') || cls.includes('hero') || 
             (s.backgroundImage !== 'none' && s.backgroundImage.includes('gradient')) ||
             el.tagName === 'SVG';
    }).slice(0, 20);

    return candidates.map(el => {
      const s = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id,
        classes: (el.className || '').toString().slice(0, 200),
        bg: s.backgroundColor,
        bgImage: s.backgroundImage.slice(0, 300),
        position: s.position,
        top: s.top, left: s.left,
        width: s.width, height: s.height,
        zIndex: s.zIndex,
        opacity: s.opacity,
        transform: s.transform !== 'none' ? s.transform.slice(0, 100) : 'none',
        animation: s.animation !== 'none' && s.animation !== '' ? s.animation.slice(0, 100) : 'none',
      };
    });
  });
  fs.writeFileSync('/tmp/windsurf-wave.json', JSON.stringify(waveData, null, 2));
  console.log('Wave data saved.');

  // Also get the raw HTML of the hero section
  const heroHTML = await page.evaluate(() => {
    const first = document.querySelector('main') || document.querySelector('[class*="hero"]') || document.body;
    return first.innerHTML.slice(0, 8000);
  });
  fs.writeFileSync('/tmp/windsurf-hero.html', heroHTML);
  console.log('Hero HTML saved.');

  await browser.close();
  console.log('Done.');
})();
