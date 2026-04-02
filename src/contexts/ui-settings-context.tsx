'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type BackdropBlurValue = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

interface UISettings {
  backdropBlur: BackdropBlurValue;
  headerBlurEnabled: boolean; // true = use blur, false = use solid background
  headerBlurUseOpacity: boolean; // true = use opacity slider, false = solid
  headerBlurOpacity: number; // 0-100, opacity of header background when blur is on and useOpacity is true
  headerBlurUseBackgroundColor: boolean; // true = show background color behind blur
  headerBlurUseGradient: boolean; // true = show gradient background behind blur
  headerBorderEnabled: boolean; // true = show header border, independent of other settings
  menuBlurEnabled: boolean; // true = use blur for mobile menu, false = use solid/gradient
  menuBlurIntensity: BackdropBlurValue;
  menuBlurUseOpacity: boolean; // true = use opacity slider, false = solid
  menuBlurOpacity: number; // 0-100, opacity of menu background when blur is on and useOpacity is true
  menuBlurUseBackgroundColor: boolean; // true = show background color behind blur
  menuBlurUseGradient: boolean; // true = show gradient background behind blur
  menuBorderEnabled: boolean; // true = show menu border, independent of other settings
  modalBlurEnabled: boolean; // true = use blur for modal backdrop, false = use solid/gradient
  modalBlurIntensity: BackdropBlurValue;
  modalBlurUseOpacity: boolean; // true = use opacity slider, false = solid
  modalBlurOpacity: number; // 0-100, opacity of modal backdrop when blur is on and useOpacity is true
}

interface UISettingsContextType {
  settings: UISettings;
  updateBackdropBlur: (value: BackdropBlurValue) => void;
  updateHeaderBlurEnabled: (enabled: boolean) => void;
  updateHeaderBlurUseOpacity: (enabled: boolean) => void;
  updateHeaderBlurOpacity: (value: number) => void;
  updateHeaderBlurUseBackgroundColor: (enabled: boolean) => void;
  updateHeaderBlurUseGradient: (enabled: boolean) => void;
  updateHeaderBorderEnabled: (enabled: boolean) => void;
  updateMenuBlurEnabled: (enabled: boolean) => void;
  updateMenuBlurIntensity: (value: BackdropBlurValue) => void;
  updateMenuBlurUseOpacity: (enabled: boolean) => void;
  updateMenuBlurOpacity: (value: number) => void;
  updateMenuBlurUseBackgroundColor: (enabled: boolean) => void;
  updateMenuBlurUseGradient: (enabled: boolean) => void;
  updateMenuBorderEnabled: (enabled: boolean) => void;
  updateModalBlurEnabled: (enabled: boolean) => void;
  updateModalBlurIntensity: (value: BackdropBlurValue) => void;
  updateModalBlurUseOpacity: (enabled: boolean) => void;
  updateModalBlurOpacity: (value: number) => void;
  getBackdropBlurClass: () => string;
  getMenuBlurClass: () => string;
  getModalBlurClass: () => string;
  resetToDefaults: () => void;
  loadSettings: (newSettings: Partial<UISettings>) => void;
}

const defaultSettings: UISettings = {
  backdropBlur: 'md', // Default matches current home page header
  headerBlurEnabled: true, // Default to blur mode
  headerBlurUseOpacity: true, // Default to use opacity slider
  headerBlurOpacity: 85, // Default to 85% opacity (0-100)
  headerBlurUseBackgroundColor: true, // Default to show color behind blur
  headerBlurUseGradient: false, // Default to no gradient
  headerBorderEnabled: true, // Default to show header border
  menuBlurEnabled: true, // Default to blur mode for menu
  menuBlurIntensity: 'md', // Match header blur intensity
  menuBlurUseOpacity: true, // Default to use opacity slider
  menuBlurOpacity: 85, // Match header opacity
  menuBlurUseBackgroundColor: true, // Default to show color behind blur
  menuBlurUseGradient: false, // Default to no gradient
  menuBorderEnabled: true, // Default to show menu border
  modalBlurEnabled: true, // Default to blur mode for modal
  modalBlurIntensity: 'md', // Match menu blur intensity
  modalBlurUseOpacity: true, // Default to use opacity slider
  modalBlurOpacity: 50, // Default to 50% opacity for modal backdrop
};

const UISettingsContext = createContext<UISettingsContextType | undefined>(undefined);

const STORAGE_KEY = 'ai-saas-ui-settings';

export function UISettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<UISettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load UI settings:', error);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save UI settings:', error);
      }
    }
  }, [settings, mounted]);

  const updateBackdropBlur = (value: BackdropBlurValue) => {
    setSettings((prev) => ({ ...prev, backdropBlur: value }));
  };

  const updateHeaderBlurEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, headerBlurEnabled: enabled }));
  };

  const updateHeaderBlurUseOpacity = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, headerBlurUseOpacity: enabled }));
  };

  const updateHeaderBlurUseBackgroundColor = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, headerBlurUseBackgroundColor: enabled }));
  };

  const updateHeaderBlurUseGradient = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, headerBlurUseGradient: enabled }));
  };

  const updateHeaderBorderEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, headerBorderEnabled: enabled }));
  };

  const updateHeaderBlurOpacity = (value: number) => {
    setSettings((prev) => ({ ...prev, headerBlurOpacity: Math.max(0, Math.min(100, value)) }));
  };

  const updateMenuBlurEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, menuBlurEnabled: enabled }));
  };

  const updateMenuBlurIntensity = (value: BackdropBlurValue) => {
    setSettings((prev) => ({ ...prev, menuBlurIntensity: value }));
  };

  const updateMenuBlurUseOpacity = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, menuBlurUseOpacity: enabled }));
  };

  const updateMenuBlurUseBackgroundColor = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, menuBlurUseBackgroundColor: enabled }));
  };

  const updateMenuBlurUseGradient = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, menuBlurUseGradient: enabled }));
  };

  const updateMenuBorderEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, menuBorderEnabled: enabled }));
  };

  const updateMenuBlurOpacity = (value: number) => {
    setSettings((prev) => ({ ...prev, menuBlurOpacity: Math.max(0, Math.min(100, value)) }));
  };

  const getBackdropBlurClass = () => {
    // If blur is disabled, return empty string
    if (!settings.headerBlurEnabled) return '';
    if (settings.backdropBlur === 'none') return '';
    return `backdrop-blur-${settings.backdropBlur}`;
  };

  const getMenuBlurClass = () => {
    // If blur is disabled, return empty string
    if (!settings.menuBlurEnabled) return '';
    if (settings.menuBlurIntensity === 'none') return '';
    return `backdrop-blur-${settings.menuBlurIntensity}`;
  };

  const updateModalBlurEnabled = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, modalBlurEnabled: enabled }));
  };

  const updateModalBlurIntensity = (value: BackdropBlurValue) => {
    setSettings((prev) => ({ ...prev, modalBlurIntensity: value }));
  };

  const updateModalBlurUseOpacity = (enabled: boolean) => {
    setSettings((prev) => ({ ...prev, modalBlurUseOpacity: enabled }));
  };

  const updateModalBlurOpacity = (value: number) => {
    setSettings((prev) => ({ ...prev, modalBlurOpacity: Math.max(0, Math.min(100, value)) }));
  };

  const getModalBlurClass = () => {
    // If blur is disabled, return empty string
    if (!settings.modalBlurEnabled) return '';
    if (settings.modalBlurIntensity === 'none') return '';
    return `backdrop-blur-${settings.modalBlurIntensity}`;
  };

  const resetToDefaults = () => {
    // Clear localStorage and reset to defaults
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear UI settings from localStorage:', error);
    }
    setSettings(defaultSettings);
  };

  const loadSettings = (newSettings: Partial<UISettings>) => {
    // Merge new settings with defaults and update state
    const merged = { ...defaultSettings, ...newSettings };
    setSettings(merged);
    // Also save to localStorage immediately
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('Failed to save loaded UI settings:', error);
    }
  };

  const value: UISettingsContextType = {
    settings,
    updateBackdropBlur,
    updateHeaderBlurEnabled,
    updateHeaderBlurUseOpacity,
    updateHeaderBlurOpacity,
    updateHeaderBlurUseBackgroundColor,
    updateHeaderBlurUseGradient,
    updateHeaderBorderEnabled,
    updateMenuBlurEnabled,
    updateMenuBlurIntensity,
    updateMenuBlurUseOpacity,
    updateMenuBlurOpacity,
    updateMenuBlurUseBackgroundColor,
    updateMenuBlurUseGradient,
    updateMenuBorderEnabled,
    updateModalBlurEnabled,
    updateModalBlurIntensity,
    updateModalBlurUseOpacity,
    updateModalBlurOpacity,
    getBackdropBlurClass,
    getMenuBlurClass,
    getModalBlurClass,
    resetToDefaults,
    loadSettings,
  };

  return (
    <UISettingsContext.Provider value={value}>
      {children}
    </UISettingsContext.Provider>
  );
}

export function useUISettings() {
  const context = useContext(UISettingsContext);
  if (context === undefined) {
    throw new Error('useUISettings must be used within a UISettingsProvider');
  }
  return context;
}
