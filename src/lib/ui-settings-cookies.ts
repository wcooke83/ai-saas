/**
 * Client-side cookie helpers for UI settings
 * Used by Header and Footer components to read gradient preferences
 */

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

/**
 * Get header gradient enabled state from cookie
 */
export function getHeaderGradientEnabledFromCookie(): boolean {
  const value = getCookie('header-gradient-enabled');
  return value === 'true';
}

/**
 * Get menu gradient enabled state from cookie
 */
export function getMenuGradientEnabledFromCookie(): boolean {
  const value = getCookie('menu-gradient-enabled');
  return value === 'true';
}

/**
 * Get footer gradient enabled state from cookie
 */
export function getFooterGradientEnabledFromCookie(): boolean {
  const value = getCookie('footer-gradient-enabled');
  return value === 'true';
}
