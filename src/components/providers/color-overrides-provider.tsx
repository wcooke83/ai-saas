'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const COLOR_STORAGE_KEY = 'theme-color-overrides-v3';
const COOKIE_NAME = 'theme-color-overrides-v2';
const GRADIENT_COOKIE_NAME = 'theme-gradient-enabled';
const CARD_GRADIENT_COOKIE_NAME = 'theme-card-gradient-enabled';

type ColorOverridesByMode = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

function getColorOverridesFromStorage(): ColorOverridesByMode {
  if (typeof window === 'undefined') return { light: {}, dark: {} };
  try {
    // First try localStorage (preferred - no size limit issues)
    const stored = localStorage.getItem(COLOR_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        light: parsed.light || {},
        dark: parsed.dark || {},
      };
    }
    // Fallback: try old cookie format for migration
    const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
    if (match) {
      const parsed = JSON.parse(decodeURIComponent(match[2]));
      const migrated = {
        light: parsed.light || {},
        dark: parsed.dark || {},
      };
      // Migrate to localStorage
      localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(migrated));
      // Clear the old cookie
      document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
      return migrated;
    }
  } catch (e) {
    console.error('Failed to parse color overrides:', e);
  }
  return { light: {}, dark: {} };
}

function getCurrentThemeMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function clearAllInlineOverrides(): void {
  if (typeof window === 'undefined') return;
  const allVarNames = [
    // Page & Layout
    '--page-bg', '--page-gradient-from', '--page-gradient-to',
    // Header
    '--header-bg', '--header-border', '--header-gradient-from', '--header-gradient-to',
    // Menu
    '--menu-bg', '--menu-border', '--menu-gradient-from', '--menu-gradient-to',
    // Footer
    '--footer-bg', '--footer-border', '--footer-gradient-from', '--footer-gradient-to',
    '--footer-text-heading', '--footer-text-primary', '--footer-text-secondary',
    // Text Colors
    '--text-heading', '--text-primary', '--text-secondary', '--text-caption',
    '--inner-text-heading', '--inner-text-primary', '--inner-text-secondary', '--inner-text-caption',
    // Primary Cards
    '--modal-bg', '--modal-border', '--card-bg', '--card-border',
    '--card-gradient-from', '--card-gradient-to',
    // Secondary Cards
    '--secondary-card-bg', '--secondary-card-bg-gradient-from', '--secondary-card-bg-gradient-to',
    '--secondary-card-border', '--secondary-card-heading', '--secondary-card-text-primary', '--secondary-card-text-secondary',
    '--secondary-card-hover-bg', '--secondary-card-hover-bg-gradient-from', '--secondary-card-hover-bg-gradient-to', '--secondary-card-hover-border',
    // Specialty Cards
    '--specialty-card-bg', '--specialty-card-bg-gradient-from', '--specialty-card-bg-gradient-to',
    '--specialty-card-border', '--specialty-card-heading', '--specialty-card-text-primary', '--specialty-card-text-secondary',
    '--specialty-card-hover-bg', '--specialty-card-hover-bg-gradient-from', '--specialty-card-hover-bg-gradient-to', '--specialty-card-hover-border',
    '--specialty-card-primary-btn-bg', '--specialty-card-primary-btn-border', '--specialty-card-primary-btn-text',
    '--specialty-card-primary-btn-hover-bg', '--specialty-card-primary-btn-hover-border', '--specialty-card-primary-btn-hover-text',
    '--specialty-card-secondary-btn-bg', '--specialty-card-secondary-btn-border', '--specialty-card-secondary-btn-text',
    '--specialty-card-secondary-btn-hover-bg', '--specialty-card-secondary-btn-hover-border', '--specialty-card-secondary-btn-hover-text',
    // Inner Cards
    '--inner-card-bg', '--inner-card-bg-gradient-from', '--inner-card-bg-gradient-to',
    '--inner-card-border', '--inner-card-text-primary', '--inner-card-text-secondary',
    '--inner-card-hover-bg', '--inner-card-hover-bg-gradient-from', '--inner-card-hover-bg-gradient-to', '--inner-card-hover-border',
    '--inner-card-primary-btn-bg', '--inner-card-primary-btn-border', '--inner-card-primary-btn-text',
    '--inner-card-primary-btn-hover-bg', '--inner-card-primary-btn-hover-border', '--inner-card-primary-btn-hover-text',
    '--inner-card-secondary-btn-bg', '--inner-card-secondary-btn-border', '--inner-card-secondary-btn-text',
    '--inner-card-secondary-btn-hover-bg', '--inner-card-secondary-btn-hover-border', '--inner-card-secondary-btn-hover-text',
    // Code Cards
    '--code-card-bg', '--code-card-bg-gradient-from', '--code-card-bg-gradient-to', '--code-card-border', '--code-card-text',
    // Status Cards
    '--info-card-bg', '--info-card-bg-gradient-from', '--info-card-bg-gradient-to', '--info-card-border', '--info-card-heading', '--info-card-text-primary', '--info-card-text-secondary',
    '--error-card-bg', '--error-card-bg-gradient-from', '--error-card-bg-gradient-to', '--error-card-border', '--error-card-heading', '--error-card-text-primary', '--error-card-text-secondary',
    '--success-card-bg', '--success-card-bg-gradient-from', '--success-card-bg-gradient-to', '--success-card-border', '--success-card-heading', '--success-card-text-primary', '--success-card-text-secondary',
    '--warning-card-bg', '--warning-card-bg-gradient-from', '--warning-card-bg-gradient-to', '--warning-card-border', '--warning-card-heading', '--warning-card-text-primary', '--warning-card-text-secondary',
    // Inner Status Cards
    '--inner-info-card-bg', '--inner-info-card-bg-gradient-from', '--inner-info-card-bg-gradient-to', '--inner-info-card-border', '--inner-info-card-heading', '--inner-info-card-text-primary', '--inner-info-card-text-secondary',
    '--inner-error-card-bg', '--inner-error-card-bg-gradient-from', '--inner-error-card-bg-gradient-to', '--inner-error-card-border', '--inner-error-card-heading', '--inner-error-card-text-primary', '--inner-error-card-text-secondary',
    '--inner-success-card-bg', '--inner-success-card-bg-gradient-from', '--inner-success-card-bg-gradient-to', '--inner-success-card-border', '--inner-success-card-heading', '--inner-success-card-text-primary', '--inner-success-card-text-secondary',
    '--inner-warning-card-bg', '--inner-warning-card-bg-gradient-from', '--inner-warning-card-bg-gradient-to', '--inner-warning-card-border', '--inner-warning-card-heading', '--inner-warning-card-text-primary', '--inner-warning-card-text-secondary',
    // Form
    '--form-element-bg',
    // Buttons
    '--primary-button-bg', '--primary-button-hover-bg',
    '--secondary-button-bg', '--secondary-button-hover-bg',
    // Theme Toggle
    '--theme-toggle-bg', '--theme-toggle-border', '--theme-toggle-button-bg',
    '--theme-toggle-button-hover-bg', '--theme-toggle-icon', '--theme-toggle-icon-active',
    // Primary Color Scale
    '--primary-50', '--primary-100', '--primary-200', '--primary-300', '--primary-400',
    '--primary-500', '--primary-600', '--primary-700', '--primary-800', '--primary-900', '--primary-950',
    // Secondary Color Scale
    '--secondary-50', '--secondary-100', '--secondary-200', '--secondary-300', '--secondary-400',
    '--secondary-500', '--secondary-600', '--secondary-700', '--secondary-800', '--secondary-825', '--secondary-900', '--secondary-950',
    // Tooltip
    '--tooltip-bg', '--tooltip-border', '--tooltip-text', '--tooltip-min-width', '--tooltip-max-width',
    // Toasts
    '--toast-success-bg', '--toast-success-text', '--toast-success-border',
    '--toast-error-bg', '--toast-error-text', '--toast-error-border',
    '--toast-warning-bg', '--toast-warning-text', '--toast-warning-border',
    '--toast-info-bg', '--toast-info-text', '--toast-info-border',
    // Accordion
    '--accordion-border', '--accordion-header-bg', '--accordion-header-hover-bg',
    '--accordion-title', '--accordion-icon', '--accordion-content-bg',
    // Subsection
    '--subsection-icon', '--subsection-title',
  ];
  allVarNames.forEach(name => {
    document.documentElement.style.removeProperty(name);
  });
}

function applyColorOverridesForMode(mode: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  // First clear all inline overrides
  clearAllInlineOverrides();
  // Then apply overrides for the current mode
  const overrides = getColorOverridesFromStorage();
  const modeOverrides = overrides[mode] || {};
  Object.entries(modeOverrides).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value);
  });
}

function getGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${GRADIENT_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse gradient cookie:', e);
  }
  return true; // Default to enabled
}

function applyGradientEnabled(): void {
  if (typeof window === 'undefined') return;
  const enabled = getGradientEnabledFromCookie();
  document.documentElement.setAttribute('data-gradient-enabled', enabled ? 'true' : 'false');
}

function getCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false; // Default to disabled
  try {
    const match = document.cookie.match(new RegExp(`(^| )${CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
    if (match) {
      return match[2] === 'true';
    }
  } catch (e) {
    console.error('Failed to parse card gradient cookie:', e);
  }
  return false; // Default to disabled
}

function applyCardGradientEnabled(): void {
  if (typeof window === 'undefined') return;
  const enabled = getCardGradientEnabledFromCookie();
  document.documentElement.setAttribute('data-card-gradient-enabled', enabled ? 'true' : 'false');
}

export function ColorOverridesProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Apply color overrides when theme changes or on initial load
    const mode = getCurrentThemeMode();
    applyColorOverridesForMode(mode);
    // Apply gradient settings
    applyGradientEnabled();
    applyCardGradientEnabled();
  }, [resolvedTheme]);

  // Also set up a MutationObserver to catch class changes on html element
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'class') {
          const mode = getCurrentThemeMode();
          applyColorOverridesForMode(mode);
          break;
        }
      }
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}
