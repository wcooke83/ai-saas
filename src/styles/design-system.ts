/**
 * AI SaaS Design System
 * Central source of truth for all design tokens
 */

export const designSystem = {
  // ===================
  // COLORS
  // ===================
  colors: {
    // Primary - Used for CTAs, links, key actions
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Main
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },

    // Secondary - Supporting UI elements
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b', // Main
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },

    // Accent - Highlights, badges, special elements
    accent: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Main
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6b21a8',
      900: '#581c87',
    },

    // Semantic colors
    success: {
      light: '#dcfce7',
      main: '#22c55e',
      dark: '#15803d',
    },
    warning: {
      light: '#fef3c7',
      main: '#f59e0b',
      dark: '#b45309',
    },
    error: {
      light: '#fee2e2',
      main: '#ef4444',
      dark: '#b91c1c',
    },
    info: {
      light: '#dbeafe',
      main: '#3b82f6',
      dark: '#1d4ed8',
    },

    // Backgrounds
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      inverse: '#0f172a',
    },

    // Text
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#94a3b8',
      inverse: '#ffffff',
      link: '#0ea5e9',
    },

    // Borders
    border: {
      light: '#e2e8f0',
      default: '#cbd5e1',
      dark: '#94a3b8',
    },
  },

  // ===================
  // TYPOGRAPHY
  // ===================
  typography: {
    // Font families
    fontFamily: {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
      display: 'Cal Sans, Inter, sans-serif', // For headlines
    },

    // Font sizes (rem)
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
    },

    // Font weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },

    // Line heights
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75',
    },

    // Letter spacing
    letterSpacing: {
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
    },
  },

  // ===================
  // SPACING
  // ===================
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
  },

  // ===================
  // BORDERS
  // ===================
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // ===================
  // SHADOWS
  // ===================
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },

  // ===================
  // ANIMATIONS
  // ===================
  animation: {
    duration: {
      fast: '150ms',
      default: '200ms',
      slow: '300ms',
      slower: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },

  // ===================
  // BREAKPOINTS
  // ===================
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // ===================
  // Z-INDEX
  // ===================
  zIndex: {
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400,
    toast: 1500,
  },

  // ===================
  // COMPONENT PATTERNS
  // ===================
  components: {
    // Button variants
    button: {
      primary: 'bg-primary-500 hover:bg-primary-600 text-white',
      secondary: 'bg-secondary-100 hover:bg-secondary-200 text-secondary-900',
      outline: 'border border-border-default hover:bg-secondary-50 text-secondary-700',
      ghost: 'hover:bg-secondary-100 text-secondary-700',
    },

    // Card styles
    card: {
      default: 'bg-white border border-border-light rounded-lg shadow-sm',
      elevated: 'bg-white rounded-xl shadow-lg',
      interactive: 'bg-white border border-border-light rounded-lg shadow-sm hover:shadow-md transition-shadow',
    },

    // Input styles
    input: {
      default: 'border border-border-default rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
    },
  },
} as const;

// Tailwind CSS variable mapping for easy integration
export const tailwindConfig = {
  extend: {
    colors: {
      primary: designSystem.colors.primary,
      secondary: designSystem.colors.secondary,
      accent: designSystem.colors.accent,
    },
    fontFamily: {
      sans: [designSystem.typography.fontFamily.sans],
      mono: [designSystem.typography.fontFamily.mono],
      display: [designSystem.typography.fontFamily.display],
    },
  },
};

export type DesignSystem = typeof designSystem;
