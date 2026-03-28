'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Palette,
  Type,
  Layout,
  MousePointer,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Check,
  Accessibility,
  Smartphone,
  Code,
  FileText,
  Sparkles,
  Key,
  Mail,
  Bell,
  Settings,
  PanelTop,
  Menu,
  ChevronDown,
  RotateCcw,
  Download,
  Upload,
  Sun,
  Moon,
  MessageSquare,
  Globe,
  Terminal,
  Zap,
  ExternalLink,
  HelpCircle,
  BookOpen,
  FileCode,
  ScrollText,
} from 'lucide-react';
import { toast } from 'sonner';
import { Tooltip } from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useUISettings, BackdropBlurValue } from '@/contexts/ui-settings-context';

// ============================================================================
// Cookie Constants
// ============================================================================
const COOKIE_NAME = 'theme-color-overrides-v2';
const COLOR_STORAGE_KEY = 'theme-color-overrides-v3'; // Match provider's localStorage key
const COOKIE_MAX_AGE = 31536000; // 1 year
const GRADIENT_COOKIE_NAME = 'theme-gradient-enabled';
const CARD_GRADIENT_COOKIE_NAME = 'theme-card-gradient-enabled';
const CARD_BORDER_COOKIE_NAME = 'theme-card-border-enabled';
const HEADER_GRADIENT_COOKIE_NAME = 'header-gradient-enabled';
const MENU_GRADIENT_COOKIE_NAME = 'menu-gradient-enabled';
const FOOTER_GRADIENT_COOKIE_NAME = 'footer-gradient-enabled';
const FOOTER_BORDER_COOKIE_NAME = 'theme-footer-border-enabled';
const PAGE_BG_COLOR_COOKIE_NAME = 'theme-page-bg-color-enabled';
const FOOTER_BG_COLOR_COOKIE_NAME = 'theme-footer-bg-color-enabled';
const CARD_BG_COLOR_COOKIE_NAME = 'theme-card-bg-color-enabled';

// Modal toggle cookies
const MODAL_BORDER_COOKIE_NAME = 'theme-modal-border-enabled';
const MODAL_GRADIENT_COOKIE_NAME = 'theme-modal-gradient-enabled';
const MODAL_BG_COLOR_COOKIE_NAME = 'theme-modal-bg-color-enabled';

// Secondary Card toggle cookies
const SECONDARY_CARD_BORDER_COOKIE_NAME = 'theme-secondary-card-border-enabled';
const SECONDARY_CARD_GRADIENT_COOKIE_NAME = 'theme-secondary-card-gradient-enabled';
const SECONDARY_CARD_BG_COLOR_COOKIE_NAME = 'theme-secondary-card-bg-color-enabled';

// Specialty Card toggle cookies
const SPECIALTY_CARD_BORDER_COOKIE_NAME = 'theme-specialty-card-border-enabled';
const SPECIALTY_CARD_GRADIENT_COOKIE_NAME = 'theme-specialty-card-gradient-enabled';
const SPECIALTY_CARD_BG_COLOR_COOKIE_NAME = 'theme-specialty-card-bg-color-enabled';

// Inner Card toggle cookies
const INNER_CARD_BORDER_COOKIE_NAME = 'theme-inner-card-border-enabled';
const INNER_CARD_GRADIENT_COOKIE_NAME = 'theme-inner-card-gradient-enabled';
const INNER_CARD_BG_COLOR_COOKIE_NAME = 'theme-inner-card-bg-color-enabled';

// Code Card toggle cookies
const CODE_CARD_BORDER_COOKIE_NAME = 'theme-code-card-border-enabled';
const CODE_CARD_GRADIENT_COOKIE_NAME = 'theme-code-card-gradient-enabled';
const CODE_CARD_BG_COLOR_COOKIE_NAME = 'theme-code-card-bg-color-enabled';

// Semantic Card toggle cookies
const INFO_CARD_BORDER_COOKIE_NAME = 'theme-info-card-border-enabled';
const INFO_CARD_GRADIENT_COOKIE_NAME = 'theme-info-card-gradient-enabled';
const INFO_CARD_BG_COLOR_COOKIE_NAME = 'theme-info-card-bg-color-enabled';

const ERROR_CARD_BORDER_COOKIE_NAME = 'theme-error-card-border-enabled';
const ERROR_CARD_GRADIENT_COOKIE_NAME = 'theme-error-card-gradient-enabled';
const ERROR_CARD_BG_COLOR_COOKIE_NAME = 'theme-error-card-bg-color-enabled';

const SUCCESS_CARD_BORDER_COOKIE_NAME = 'theme-success-card-border-enabled';
const SUCCESS_CARD_GRADIENT_COOKIE_NAME = 'theme-success-card-gradient-enabled';
const SUCCESS_CARD_BG_COLOR_COOKIE_NAME = 'theme-success-card-bg-color-enabled';

const WARNING_CARD_BORDER_COOKIE_NAME = 'theme-warning-card-border-enabled';
const WARNING_CARD_GRADIENT_COOKIE_NAME = 'theme-warning-card-gradient-enabled';
const WARNING_CARD_BG_COLOR_COOKIE_NAME = 'theme-warning-card-bg-color-enabled';

// Inner Semantic Card toggle cookies
const INNER_INFO_CARD_BORDER_COOKIE_NAME = 'theme-inner-info-card-border-enabled';
const INNER_INFO_CARD_GRADIENT_COOKIE_NAME = 'theme-inner-info-card-gradient-enabled';
const INNER_INFO_CARD_BG_COLOR_COOKIE_NAME = 'theme-inner-info-card-bg-color-enabled';

const INNER_ERROR_CARD_BORDER_COOKIE_NAME = 'theme-inner-error-card-border-enabled';
const INNER_ERROR_CARD_GRADIENT_COOKIE_NAME = 'theme-inner-error-card-gradient-enabled';
const INNER_ERROR_CARD_BG_COLOR_COOKIE_NAME = 'theme-inner-error-card-bg-color-enabled';

const INNER_SUCCESS_CARD_BORDER_COOKIE_NAME = 'theme-inner-success-card-border-enabled';
const INNER_SUCCESS_CARD_GRADIENT_COOKIE_NAME = 'theme-inner-success-card-gradient-enabled';
const INNER_SUCCESS_CARD_BG_COLOR_COOKIE_NAME = 'theme-inner-success-card-bg-color-enabled';

const INNER_WARNING_CARD_BORDER_COOKIE_NAME = 'theme-inner-warning-card-border-enabled';
const INNER_WARNING_CARD_GRADIENT_COOKIE_NAME = 'theme-inner-warning-card-gradient-enabled';
const INNER_WARNING_CARD_BG_COLOR_COOKIE_NAME = 'theme-inner-warning-card-bg-color-enabled';

// Action Card toggle cookies
const ACTION_CARD_BORDER_COOKIE_NAME = 'theme-action-card-border-enabled';
const ACTION_CARD_GRADIENT_COOKIE_NAME = 'theme-action-card-gradient-enabled';
const ACTION_CARD_BG_COLOR_COOKIE_NAME = 'theme-action-card-bg-color-enabled';

// Bubble Preview style storage
const BUBBLE_STYLE_STORAGE_KEY = 'bubble-preview-style';

interface BubbleStyleConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  darkBgColor: string;
  darkTextColor: string;
  darkBorderColor: string;
  borderWidth: number;
  borderRadius: number;
  shadow: 'none' | 'sm' | 'md' | 'lg';
  fontSize: number;
  maxWidth: number;
}

const DEFAULT_BUBBLE_STYLE: BubbleStyleConfig = {
  bgColor: '#ffffff',
  textColor: '#0f172a',
  borderColor: '#e2e8f0',
  darkBgColor: '#0f172a',
  darkTextColor: '#f8fafc',
  darkBorderColor: '#334155',
  borderWidth: 1,
  borderRadius: 12,
  shadow: 'md',
  fontSize: 14,
  maxWidth: 280,
};

const BUBBLE_SHADOW_OPTIONS: { value: BubbleStyleConfig['shadow']; label: string; css: string }[] = [
  { value: 'none', label: 'None', css: 'none' },
  { value: 'sm', label: 'Small', css: '0 2px 8px rgba(0,0,0,0.1)' },
  { value: 'md', label: 'Medium', css: '0 4px 16px rgba(0,0,0,0.15)' },
  { value: 'lg', label: 'Large', css: '0 8px 32px rgba(0,0,0,0.2)' },
];

// ============================================================================
// Theme Color Variables Definition
// ============================================================================
type ColorOverridesByMode = {
  light: Record<string, string>;
  dark: Record<string, string>;
};

interface ColorVariable {
  name: string;
  label: string;
  defaultValue: string;
  isSize?: boolean;
}

const themeColorVariables = {
  light: {
    // Page & Layout
    page: [
      { name: '--page-bg', label: 'Page Background', defaultValue: '248 250 252' },
    ],
    gradient: [
      { name: '--page-gradient-from', label: 'Gradient Start', defaultValue: '248 250 252' },
      { name: '--page-gradient-to', label: 'Gradient End', defaultValue: '241 245 249' },
    ],
    header: [
      { name: '--header-bg', label: 'Header Background', defaultValue: '255 255 255' },
      { name: '--header-border', label: 'Header Border', defaultValue: '226 232 240' },
    ],
    headerGradient: [
      { name: '--header-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--header-gradient-to', label: 'Gradient End', defaultValue: '248 250 252' },
    ],
    menu: [
      { name: '--menu-bg', label: 'Menu Background', defaultValue: '255 255 255' },
      { name: '--menu-border', label: 'Menu Border', defaultValue: '226 232 240' },
    ],
    menuGradient: [
      { name: '--menu-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--menu-gradient-to', label: 'Gradient End', defaultValue: '248 250 252' },
    ],
    footer: [
      { name: '--footer-bg', label: 'Footer Background', defaultValue: '248 250 252' },
      { name: '--footer-border', label: 'Footer Border', defaultValue: '226 232 240' },
    ],
    footerGradient: [
      { name: '--footer-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--footer-gradient-to', label: 'Gradient End', defaultValue: '241 245 249' },
    ],
    footerText: [
      { name: '--footer-text-heading', label: 'Footer Heading', defaultValue: '15 23 42' },
      { name: '--footer-text-primary', label: 'Footer Primary Text', defaultValue: '71 85 105' },
      { name: '--footer-text-secondary', label: 'Footer Secondary Text', defaultValue: '100 116 139' },
    ],
    // Text Colors
    text: [
      { name: '--text-heading', label: 'Heading Text', defaultValue: '15 23 42' },
      { name: '--text-primary', label: 'Primary Text', defaultValue: '51 65 85' },
      { name: '--text-secondary', label: 'Secondary Text', defaultValue: '100 116 139' },
      { name: '--text-caption', label: 'Caption/Helper Text', defaultValue: '148 163 184' },
    ],
    innerText: [
      { name: '--inner-text-heading', label: 'Inner Heading', defaultValue: '15 23 42' },
      { name: '--inner-text-primary', label: 'Inner Primary Text', defaultValue: '51 65 85' },
      { name: '--inner-text-secondary', label: 'Inner Secondary Text', defaultValue: '100 116 139' },
      { name: '--inner-text-caption', label: 'Inner Caption Text', defaultValue: '148 163 184' },
    ],
    // Cards
    card: [
      { name: '--card-bg', label: 'Card Background', defaultValue: '255 255 255' },
      { name: '--card-border', label: 'Card Border', defaultValue: '226 232 240' },
    ],
    cardGradient: [
      { name: '--card-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--card-gradient-to', label: 'Gradient End', defaultValue: '248 250 252' },
    ],
    // Secondary Card
    secondaryCard: [
      { name: '--secondary-card-bg', label: 'Background', defaultValue: '248 250 252' },
      { name: '--secondary-card-border', label: 'Border', defaultValue: '226 232 240' },
      { name: '--secondary-card-heading', label: 'Heading', defaultValue: '15 23 42' },
      { name: '--secondary-card-text-primary', label: 'Primary Text', defaultValue: '51 65 85' },
      { name: '--secondary-card-text-secondary', label: 'Secondary Text', defaultValue: '100 116 139' },
    ],
    secondaryCardGradient: [
      { name: '--secondary-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--secondary-card-bg-gradient-to', label: 'Gradient End', defaultValue: '241 245 249' },
    ],
    secondaryCardHover: [
      { name: '--secondary-card-hover-bg', label: 'Hover Background', defaultValue: '241 245 249' },
      { name: '--secondary-card-hover-border', label: 'Hover Border', defaultValue: '203 213 225' },
    ],
    secondaryCardHoverGradient: [
      { name: '--secondary-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '248 250 252' },
      { name: '--secondary-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '226 232 240' },
    ],
    // Specialty Card
    specialtyCard: [
      { name: '--specialty-card-bg', label: 'Background', defaultValue: '79 70 229' },
      { name: '--specialty-card-border', label: 'Border', defaultValue: '129 140 248' },
      { name: '--specialty-card-heading', label: 'Heading', defaultValue: '255 255 255' },
      { name: '--specialty-card-text-primary', label: 'Primary Text', defaultValue: '224 231 255' },
      { name: '--specialty-card-text-secondary', label: 'Secondary Text', defaultValue: '199 210 254' },
    ],
    specialtyCardGradient: [
      { name: '--specialty-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '99 102 241' },
      { name: '--specialty-card-bg-gradient-to', label: 'Gradient End', defaultValue: '67 56 202' },
    ],
    specialtyCardHover: [
      { name: '--specialty-card-hover-bg', label: 'Hover Background', defaultValue: '67 56 202' },
      { name: '--specialty-card-hover-border', label: 'Hover Border', defaultValue: '165 180 252' },
    ],
    specialtyCardHoverGradient: [
      { name: '--specialty-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '79 70 229' },
      { name: '--specialty-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '55 48 163' },
    ],
    specialtyCardPrimaryBtn: [
      { name: '--specialty-card-primary-btn-bg', label: 'Primary Btn Background', defaultValue: '255 255 255' },
      { name: '--specialty-card-primary-btn-border', label: 'Primary Btn Border', defaultValue: '255 255 255' },
      { name: '--specialty-card-primary-btn-text', label: 'Primary Btn Text', defaultValue: '67 56 202' },
      { name: '--specialty-card-primary-btn-hover-bg', label: 'Primary Btn Hover Bg', defaultValue: '238 242 255' },
      { name: '--specialty-card-primary-btn-hover-border', label: 'Primary Btn Hover Border', defaultValue: '238 242 255' },
      { name: '--specialty-card-primary-btn-hover-text', label: 'Primary Btn Hover Text', defaultValue: '55 48 163' },
    ],
    specialtyCardSecondaryBtn: [
      { name: '--specialty-card-secondary-btn-bg', label: 'Secondary Btn Background', defaultValue: '0 0 0' },
      { name: '--specialty-card-secondary-btn-border', label: 'Secondary Btn Border', defaultValue: '199 210 254' },
      { name: '--specialty-card-secondary-btn-text', label: 'Secondary Btn Text', defaultValue: '255 255 255' },
      { name: '--specialty-card-secondary-btn-hover-bg', label: 'Secondary Btn Hover Bg', defaultValue: '67 56 202' },
      { name: '--specialty-card-secondary-btn-hover-border', label: 'Secondary Btn Hover Border', defaultValue: '255 255 255' },
      { name: '--specialty-card-secondary-btn-hover-text', label: 'Secondary Btn Hover Text', defaultValue: '255 255 255' },
    ],
    // Inner Card
    innerCard: [
      { name: '--inner-card-bg', label: 'Background', defaultValue: '241 245 249' },
      { name: '--inner-card-border', label: 'Border', defaultValue: '226 232 240' },
      { name: '--inner-card-text-primary', label: 'Primary Text', defaultValue: '51 65 85' },
      { name: '--inner-card-text-secondary', label: 'Secondary Text', defaultValue: '100 116 139' },
    ],
    innerCardGradient: [
      { name: '--inner-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '248 250 252' },
      { name: '--inner-card-bg-gradient-to', label: 'Gradient End', defaultValue: '226 232 240' },
    ],
    innerCardHover: [
      { name: '--inner-card-hover-bg', label: 'Hover Background', defaultValue: '226 232 240' },
      { name: '--inner-card-hover-border', label: 'Hover Border', defaultValue: '203 213 225' },
    ],
    innerCardHoverGradient: [
      { name: '--inner-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '241 245 249' },
      { name: '--inner-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '203 213 225' },
    ],
    innerCardPrimaryBtn: [
      { name: '--inner-card-primary-btn-bg', label: 'Primary Btn Background', defaultValue: '14 165 233' },
      { name: '--inner-card-primary-btn-border', label: 'Primary Btn Border', defaultValue: '14 165 233' },
      { name: '--inner-card-primary-btn-text', label: 'Primary Btn Text', defaultValue: '255 255 255' },
      { name: '--inner-card-primary-btn-hover-bg', label: 'Primary Btn Hover Bg', defaultValue: '2 132 199' },
      { name: '--inner-card-primary-btn-hover-border', label: 'Primary Btn Hover Border', defaultValue: '2 132 199' },
      { name: '--inner-card-primary-btn-hover-text', label: 'Primary Btn Hover Text', defaultValue: '255 255 255' },
    ],
    innerCardSecondaryBtn: [
      { name: '--inner-card-secondary-btn-bg', label: 'Secondary Btn Background', defaultValue: '255 255 255' },
      { name: '--inner-card-secondary-btn-border', label: 'Secondary Btn Border', defaultValue: '226 232 240' },
      { name: '--inner-card-secondary-btn-text', label: 'Secondary Btn Text', defaultValue: '51 65 85' },
      { name: '--inner-card-secondary-btn-hover-bg', label: 'Secondary Btn Hover Bg', defaultValue: '248 250 252' },
      { name: '--inner-card-secondary-btn-hover-border', label: 'Secondary Btn Hover Border', defaultValue: '203 213 225' },
      { name: '--inner-card-secondary-btn-hover-text', label: 'Secondary Btn Hover Text', defaultValue: '15 23 42' },
    ],
    // Action Card (clickable/linkable cards)
    actionCard: [
      { name: '--action-card-bg', label: 'Background', defaultValue: '255 255 255' },
      { name: '--action-card-border', label: 'Border', defaultValue: '226 232 240' },
      { name: '--action-card-heading', label: 'Heading', defaultValue: '15 23 42' },
      { name: '--action-card-text-primary', label: 'Primary Text', defaultValue: '71 85 105' },
      { name: '--action-card-text-secondary', label: 'Secondary Text', defaultValue: '100 116 139' },
    ],
    actionCardGradient: [
      { name: '--action-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--action-card-bg-gradient-to', label: 'Gradient End', defaultValue: '248 250 252' },
    ],
    actionCardHover: [
      { name: '--action-card-hover-bg', label: 'Hover Background', defaultValue: '240 249 255' },
      { name: '--action-card-hover-border', label: 'Hover Border', defaultValue: '14 165 233' },
    ],
    actionCardHoverGradient: [
      { name: '--action-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '248 250 252' },
      { name: '--action-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '240 249 255' },
    ],
    actionCardIcon: [
      { name: '--action-card-icon-bg', label: 'Icon Background', defaultValue: '241 245 249' },
      { name: '--action-card-icon-color', label: 'Icon Color', defaultValue: '100 116 139' },
      { name: '--action-card-icon-hover-bg', label: 'Icon Hover Background', defaultValue: '224 242 254' },
      { name: '--action-card-icon-hover-color', label: 'Icon Hover Color', defaultValue: '14 165 233' },
    ],
    actionCardRadius: [
      { name: '--action-card-radius', label: 'Border Radius', defaultValue: '0.75rem', isSize: true },
    ],
    // Code Card
    codeCard: [
      { name: '--code-card-bg', label: 'Background', defaultValue: '15 23 42' },
      { name: '--code-card-border', label: 'Border', defaultValue: '51 65 85' },
      { name: '--code-card-text', label: 'Text', defaultValue: '226 232 240' },
    ],
    codeCardGradient: [
      { name: '--code-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '15 23 42' },
      { name: '--code-card-bg-gradient-to', label: 'Gradient End', defaultValue: '30 41 59' },
    ],
    // Info Card
    infoCard: [
      { name: '--info-card-bg', label: 'Background', defaultValue: '239 246 255' },
      { name: '--info-card-border', label: 'Border', defaultValue: '147 197 253' },
      { name: '--info-card-heading', label: 'Heading', defaultValue: '30 64 175' },
      { name: '--info-card-text-primary', label: 'Primary Text', defaultValue: '29 78 216' },
      { name: '--info-card-text-secondary', label: 'Secondary Text', defaultValue: '59 130 246' },
    ],
    infoCardGradient: [
      { name: '--info-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '239 246 255' },
      { name: '--info-card-bg-gradient-to', label: 'Gradient End', defaultValue: '224 242 254' },
    ],
    // Error Card
    errorCard: [
      { name: '--error-card-bg', label: 'Background', defaultValue: '254 242 242' },
      { name: '--error-card-border', label: 'Border', defaultValue: '252 165 165' },
      { name: '--error-card-heading', label: 'Heading', defaultValue: '153 27 27' },
      { name: '--error-card-text-primary', label: 'Primary Text', defaultValue: '185 28 28' },
      { name: '--error-card-text-secondary', label: 'Secondary Text', defaultValue: '220 38 38' },
    ],
    errorCardGradient: [
      { name: '--error-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '254 242 242' },
      { name: '--error-card-bg-gradient-to', label: 'Gradient End', defaultValue: '254 226 226' },
    ],
    // Success Card
    successCard: [
      { name: '--success-card-bg', label: 'Background', defaultValue: '240 253 244' },
      { name: '--success-card-border', label: 'Border', defaultValue: '134 239 172' },
      { name: '--success-card-heading', label: 'Heading', defaultValue: '21 128 61' },
      { name: '--success-card-text-primary', label: 'Primary Text', defaultValue: '22 163 74' },
      { name: '--success-card-text-secondary', label: 'Secondary Text', defaultValue: '34 197 94' },
    ],
    successCardGradient: [
      { name: '--success-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '240 253 244' },
      { name: '--success-card-bg-gradient-to', label: 'Gradient End', defaultValue: '220 252 231' },
    ],
    // Warning Card
    warningCard: [
      { name: '--warning-card-bg', label: 'Background', defaultValue: '255 251 235' },
      { name: '--warning-card-border', label: 'Border', defaultValue: '253 224 71' },
      { name: '--warning-card-heading', label: 'Heading', defaultValue: '161 98 7' },
      { name: '--warning-card-text-primary', label: 'Primary Text', defaultValue: '180 83 9' },
      { name: '--warning-card-text-secondary', label: 'Secondary Text', defaultValue: '217 119 6' },
    ],
    warningCardGradient: [
      { name: '--warning-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '255 251 235' },
      { name: '--warning-card-bg-gradient-to', label: 'Gradient End', defaultValue: '254 243 199' },
    ],
    // Inner Info Card
    innerInfoCard: [
      { name: '--inner-info-card-bg', label: 'Background', defaultValue: '239 246 255' },
      { name: '--inner-info-card-border', label: 'Border', defaultValue: '147 197 253' },
      { name: '--inner-info-card-heading', label: 'Heading', defaultValue: '30 64 175' },
      { name: '--inner-info-card-text-primary', label: 'Primary Text', defaultValue: '29 78 216' },
      { name: '--inner-info-card-text-secondary', label: 'Secondary Text', defaultValue: '59 130 246' },
    ],
    innerInfoCardGradient: [
      { name: '--inner-info-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '239 246 255' },
      { name: '--inner-info-card-bg-gradient-to', label: 'Gradient End', defaultValue: '219 234 254' },
    ],
    // Inner Error Card
    innerErrorCard: [
      { name: '--inner-error-card-bg', label: 'Background', defaultValue: '254 242 242' },
      { name: '--inner-error-card-border', label: 'Border', defaultValue: '252 165 165' },
      { name: '--inner-error-card-heading', label: 'Heading', defaultValue: '153 27 27' },
      { name: '--inner-error-card-text-primary', label: 'Primary Text', defaultValue: '185 28 28' },
      { name: '--inner-error-card-text-secondary', label: 'Secondary Text', defaultValue: '220 38 38' },
    ],
    innerErrorCardGradient: [
      { name: '--inner-error-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '254 242 242' },
      { name: '--inner-error-card-bg-gradient-to', label: 'Gradient End', defaultValue: '254 226 226' },
    ],
    // Inner Success Card
    innerSuccessCard: [
      { name: '--inner-success-card-bg', label: 'Background', defaultValue: '240 253 244' },
      { name: '--inner-success-card-border', label: 'Border', defaultValue: '134 239 172' },
      { name: '--inner-success-card-heading', label: 'Heading', defaultValue: '21 128 61' },
      { name: '--inner-success-card-text-primary', label: 'Primary Text', defaultValue: '22 163 74' },
      { name: '--inner-success-card-text-secondary', label: 'Secondary Text', defaultValue: '34 197 94' },
    ],
    innerSuccessCardGradient: [
      { name: '--inner-success-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '240 253 244' },
      { name: '--inner-success-card-bg-gradient-to', label: 'Gradient End', defaultValue: '220 252 231' },
    ],
    // Inner Warning Card
    innerWarningCard: [
      { name: '--inner-warning-card-bg', label: 'Background', defaultValue: '255 251 235' },
      { name: '--inner-warning-card-border', label: 'Border', defaultValue: '253 224 71' },
      { name: '--inner-warning-card-heading', label: 'Heading', defaultValue: '161 98 7' },
      { name: '--inner-warning-card-text-primary', label: 'Primary Text', defaultValue: '180 83 9' },
      { name: '--inner-warning-card-text-secondary', label: 'Secondary Text', defaultValue: '217 119 6' },
    ],
    innerWarningCardGradient: [
      { name: '--inner-warning-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '255 251 235' },
      { name: '--inner-warning-card-bg-gradient-to', label: 'Gradient End', defaultValue: '254 243 199' },
    ],
    modal: [
      { name: '--modal-bg', label: 'Modal Background', defaultValue: '255 255 255' },
      { name: '--modal-border', label: 'Modal Border', defaultValue: '226 232 240' },
    ],
    modalGradient: [
      { name: '--modal-gradient-from', label: 'Gradient Start', defaultValue: '255 255 255' },
      { name: '--modal-gradient-to', label: 'Gradient End', defaultValue: '248 250 252' },
    ],
    // Form
    form: [
      { name: '--form-bg', label: 'Form Background', defaultValue: '255 255 255' },
      { name: '--form-border', label: 'Form Border', defaultValue: '226 232 240' },
      { name: '--form-text', label: 'Form Text', defaultValue: '15 23 42' },
      { name: '--form-placeholder', label: 'Placeholder Text', defaultValue: '148 163 184' },
      { name: '--form-focus-border', label: 'Focus Border', defaultValue: '14 165 233' },
      { name: '--form-focus-ring', label: 'Focus Ring', defaultValue: '56 189 248' },
    ],
    // Buttons
    button: [
      { name: '--button-primary-bg', label: 'Primary Background', defaultValue: '14 165 233' },
      { name: '--button-primary-border', label: 'Primary Border', defaultValue: '14 165 233' },
      { name: '--button-primary-text', label: 'Primary Text', defaultValue: '255 255 255' },
      { name: '--button-primary-hover-bg', label: 'Primary Hover Bg', defaultValue: '2 132 199' },
      { name: '--button-secondary-bg', label: 'Secondary Background', defaultValue: '255 255 255' },
      { name: '--button-secondary-border', label: 'Secondary Border', defaultValue: '226 232 240' },
      { name: '--button-secondary-text', label: 'Secondary Text', defaultValue: '51 65 85' },
      { name: '--button-secondary-hover-bg', label: 'Secondary Hover Bg', defaultValue: '248 250 252' },
    ],
    // Tooltip
    tooltip: [
      { name: '--tooltip-bg', label: 'Background', defaultValue: '15 23 42' },
      { name: '--tooltip-border', label: 'Border', defaultValue: '51 65 85' },
      { name: '--tooltip-text', label: 'Text', defaultValue: '241 245 249' },
    ],
    // Toast
    toastSuccess: [
      { name: '--toast-success-bg', label: 'Background', defaultValue: '240 253 244' },
      { name: '--toast-success-border', label: 'Border', defaultValue: '134 239 172' },
      { name: '--toast-success-text', label: 'Text', defaultValue: '21 128 61' },
      { name: '--toast-success-icon', label: 'Icon', defaultValue: '34 197 94' },
    ],
    toastError: [
      { name: '--toast-error-bg', label: 'Background', defaultValue: '254 242 242' },
      { name: '--toast-error-border', label: 'Border', defaultValue: '252 165 165' },
      { name: '--toast-error-text', label: 'Text', defaultValue: '153 27 27' },
      { name: '--toast-error-icon', label: 'Icon', defaultValue: '220 38 38' },
    ],
    toastWarning: [
      { name: '--toast-warning-bg', label: 'Background', defaultValue: '255 251 235' },
      { name: '--toast-warning-border', label: 'Border', defaultValue: '253 224 71' },
      { name: '--toast-warning-text', label: 'Text', defaultValue: '161 98 7' },
      { name: '--toast-warning-icon', label: 'Icon', defaultValue: '217 119 6' },
    ],
    toastInfo: [
      { name: '--toast-info-bg', label: 'Background', defaultValue: '239 246 255' },
      { name: '--toast-info-border', label: 'Border', defaultValue: '147 197 253' },
      { name: '--toast-info-text', label: 'Text', defaultValue: '30 64 175' },
      { name: '--toast-info-icon', label: 'Icon', defaultValue: '59 130 246' },
    ],
    // Primary Color Scale
    primary: [
      { name: '--primary-50', label: 'Primary 50', defaultValue: '238 242 255' },
      { name: '--primary-100', label: 'Primary 100', defaultValue: '224 231 255' },
      { name: '--primary-500', label: 'Primary 500', defaultValue: '99 102 241' },
      { name: '--primary-600', label: 'Primary 600', defaultValue: '79 70 229' },
      { name: '--primary-700', label: 'Primary 700', defaultValue: '67 56 202' },
    ],
    // Secondary Color Scale
    secondary: [
      { name: '--secondary-50', label: 'Secondary 50', defaultValue: '248 250 252' },
      { name: '--secondary-100', label: 'Secondary 100', defaultValue: '241 245 249' },
      { name: '--secondary-200', label: 'Secondary 200', defaultValue: '226 232 240' },
      { name: '--secondary-500', label: 'Secondary 500', defaultValue: '100 116 139' },
      { name: '--secondary-700', label: 'Secondary 700', defaultValue: '51 65 85' },
      { name: '--secondary-900', label: 'Secondary 900', defaultValue: '15 23 42' },
    ],
  },
  dark: {
    // Page & Layout
    page: [
      { name: '--page-bg', label: 'Page Background', defaultValue: '3 7 18' },
    ],
    gradient: [
      { name: '--page-gradient-from', label: 'Gradient Start', defaultValue: '3 7 18' },
      { name: '--page-gradient-to', label: 'Gradient End', defaultValue: '10 15 30' },
    ],
    header: [
      { name: '--header-bg', label: 'Header Background', defaultValue: '3 7 18' },
      { name: '--header-border', label: 'Header Border', defaultValue: '30 41 59' },
    ],
    headerGradient: [
      { name: '--header-gradient-from', label: 'Gradient Start', defaultValue: '3 7 18' },
      { name: '--header-gradient-to', label: 'Gradient End', defaultValue: '10 15 30' },
    ],
    menu: [
      { name: '--menu-bg', label: 'Menu Background', defaultValue: '3 7 18' },
      { name: '--menu-border', label: 'Menu Border', defaultValue: '30 41 59' },
    ],
    menuGradient: [
      { name: '--menu-gradient-from', label: 'Gradient Start', defaultValue: '3 7 18' },
      { name: '--menu-gradient-to', label: 'Gradient End', defaultValue: '15 23 42' },
    ],
    footer: [
      { name: '--footer-bg', label: 'Footer Background', defaultValue: '3 7 18' },
      { name: '--footer-border', label: 'Footer Border', defaultValue: '30 41 59' },
    ],
    footerGradient: [
      { name: '--footer-gradient-from', label: 'Gradient Start', defaultValue: '10 15 30' },
      { name: '--footer-gradient-to', label: 'Gradient End', defaultValue: '3 7 18' },
    ],
    footerText: [
      { name: '--footer-text-heading', label: 'Footer Heading', defaultValue: '241 245 249' },
      { name: '--footer-text-primary', label: 'Footer Primary Text', defaultValue: '148 163 184' },
      { name: '--footer-text-secondary', label: 'Footer Secondary Text', defaultValue: '100 116 139' },
    ],
    // Text Colors
    text: [
      { name: '--text-heading', label: 'Heading Text', defaultValue: '248 250 252' },
      { name: '--text-primary', label: 'Primary Text', defaultValue: '203 213 225' },
      { name: '--text-secondary', label: 'Secondary Text', defaultValue: '148 163 184' },
      { name: '--text-caption', label: 'Caption/Helper Text', defaultValue: '100 116 139' },
    ],
    innerText: [
      { name: '--inner-text-heading', label: 'Inner Heading', defaultValue: '248 250 252' },
      { name: '--inner-text-primary', label: 'Inner Primary Text', defaultValue: '203 213 225' },
      { name: '--inner-text-secondary', label: 'Inner Secondary Text', defaultValue: '148 163 184' },
      { name: '--inner-text-caption', label: 'Inner Caption Text', defaultValue: '100 116 139' },
    ],
    // Cards
    card: [
      { name: '--card-bg', label: 'Card Background', defaultValue: '15 23 42' },
      { name: '--card-border', label: 'Card Border', defaultValue: '51 65 85' },
    ],
    cardGradient: [
      { name: '--card-gradient-from', label: 'Gradient Start', defaultValue: '15 23 42' },
      { name: '--card-gradient-to', label: 'Gradient End', defaultValue: '23 32 52' },
    ],
    // Secondary Card
    secondaryCard: [
      { name: '--secondary-card-bg', label: 'Background', defaultValue: '10 15 30' },
      { name: '--secondary-card-border', label: 'Border', defaultValue: '51 65 85' },
      { name: '--secondary-card-heading', label: 'Heading', defaultValue: '248 250 252' },
      { name: '--secondary-card-text-primary', label: 'Primary Text', defaultValue: '203 213 225' },
      { name: '--secondary-card-text-secondary', label: 'Secondary Text', defaultValue: '148 163 184' },
    ],
    secondaryCardGradient: [
      { name: '--secondary-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '15 23 42' },
      { name: '--secondary-card-bg-gradient-to', label: 'Gradient End', defaultValue: '10 15 30' },
    ],
    secondaryCardHover: [
      { name: '--secondary-card-hover-bg', label: 'Hover Background', defaultValue: '23 32 52' },
      { name: '--secondary-card-hover-border', label: 'Hover Border', defaultValue: '71 85 105' },
    ],
    secondaryCardHoverGradient: [
      { name: '--secondary-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '30 41 59' },
      { name: '--secondary-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '15 23 42' },
    ],
    // Specialty Card
    specialtyCard: [
      { name: '--specialty-card-bg', label: 'Background', defaultValue: '67 56 202' },
      { name: '--specialty-card-border', label: 'Border', defaultValue: '99 102 241' },
      { name: '--specialty-card-heading', label: 'Heading', defaultValue: '255 255 255' },
      { name: '--specialty-card-text-primary', label: 'Primary Text', defaultValue: '224 231 255' },
      { name: '--specialty-card-text-secondary', label: 'Secondary Text', defaultValue: '199 210 254' },
    ],
    specialtyCardGradient: [
      { name: '--specialty-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '79 70 229' },
      { name: '--specialty-card-bg-gradient-to', label: 'Gradient End', defaultValue: '49 46 129' },
    ],
    specialtyCardHover: [
      { name: '--specialty-card-hover-bg', label: 'Hover Background', defaultValue: '55 48 163' },
      { name: '--specialty-card-hover-border', label: 'Hover Border', defaultValue: '129 140 248' },
    ],
    specialtyCardHoverGradient: [
      { name: '--specialty-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '67 56 202' },
      { name: '--specialty-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '30 27 75' },
    ],
    specialtyCardPrimaryBtn: [
      { name: '--specialty-card-primary-btn-bg', label: 'Primary Btn Background', defaultValue: '255 255 255' },
      { name: '--specialty-card-primary-btn-border', label: 'Primary Btn Border', defaultValue: '255 255 255' },
      { name: '--specialty-card-primary-btn-text', label: 'Primary Btn Text', defaultValue: '55 48 163' },
      { name: '--specialty-card-primary-btn-hover-bg', label: 'Primary Btn Hover Bg', defaultValue: '238 242 255' },
      { name: '--specialty-card-primary-btn-hover-border', label: 'Primary Btn Hover Border', defaultValue: '238 242 255' },
      { name: '--specialty-card-primary-btn-hover-text', label: 'Primary Btn Hover Text', defaultValue: '49 46 129' },
    ],
    specialtyCardSecondaryBtn: [
      { name: '--specialty-card-secondary-btn-bg', label: 'Secondary Btn Background', defaultValue: '0 0 0' },
      { name: '--specialty-card-secondary-btn-border', label: 'Secondary Btn Border', defaultValue: '165 180 252' },
      { name: '--specialty-card-secondary-btn-text', label: 'Secondary Btn Text', defaultValue: '255 255 255' },
      { name: '--specialty-card-secondary-btn-hover-bg', label: 'Secondary Btn Hover Bg', defaultValue: '49 46 129' },
      { name: '--specialty-card-secondary-btn-hover-border', label: 'Secondary Btn Hover Border', defaultValue: '199 210 254' },
      { name: '--specialty-card-secondary-btn-hover-text', label: 'Secondary Btn Hover Text', defaultValue: '255 255 255' },
    ],
    // Inner Card
    innerCard: [
      { name: '--inner-card-bg', label: 'Background', defaultValue: '23 32 52' },
      { name: '--inner-card-border', label: 'Border', defaultValue: '51 65 85' },
      { name: '--inner-card-text-primary', label: 'Primary Text', defaultValue: '203 213 225' },
      { name: '--inner-card-text-secondary', label: 'Secondary Text', defaultValue: '148 163 184' },
    ],
    innerCardGradient: [
      { name: '--inner-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '30 41 59' },
      { name: '--inner-card-bg-gradient-to', label: 'Gradient End', defaultValue: '15 23 42' },
    ],
    innerCardHover: [
      { name: '--inner-card-hover-bg', label: 'Hover Background', defaultValue: '30 41 59' },
      { name: '--inner-card-hover-border', label: 'Hover Border', defaultValue: '71 85 105' },
    ],
    innerCardHoverGradient: [
      { name: '--inner-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '51 65 85' },
      { name: '--inner-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '23 32 52' },
    ],
    innerCardPrimaryBtn: [
      { name: '--inner-card-primary-btn-bg', label: 'Primary Btn Background', defaultValue: '14 165 233' },
      { name: '--inner-card-primary-btn-border', label: 'Primary Btn Border', defaultValue: '14 165 233' },
      { name: '--inner-card-primary-btn-text', label: 'Primary Btn Text', defaultValue: '255 255 255' },
      { name: '--inner-card-primary-btn-hover-bg', label: 'Primary Btn Hover Bg', defaultValue: '2 132 199' },
      { name: '--inner-card-primary-btn-hover-border', label: 'Primary Btn Hover Border', defaultValue: '2 132 199' },
      { name: '--inner-card-primary-btn-hover-text', label: 'Primary Btn Hover Text', defaultValue: '255 255 255' },
    ],
    innerCardSecondaryBtn: [
      { name: '--inner-card-secondary-btn-bg', label: 'Secondary Btn Background', defaultValue: '30 41 59' },
      { name: '--inner-card-secondary-btn-border', label: 'Secondary Btn Border', defaultValue: '71 85 105' },
      { name: '--inner-card-secondary-btn-text', label: 'Secondary Btn Text', defaultValue: '203 213 225' },
      { name: '--inner-card-secondary-btn-hover-bg', label: 'Secondary Btn Hover Bg', defaultValue: '51 65 85' },
      { name: '--inner-card-secondary-btn-hover-border', label: 'Secondary Btn Hover Border', defaultValue: '100 116 139' },
      { name: '--inner-card-secondary-btn-hover-text', label: 'Secondary Btn Hover Text', defaultValue: '248 250 252' },
    ],
    // Action Card (clickable/linkable cards)
    actionCard: [
      { name: '--action-card-bg', label: 'Background', defaultValue: '15 23 42' },
      { name: '--action-card-border', label: 'Border', defaultValue: '51 65 85' },
      { name: '--action-card-heading', label: 'Heading', defaultValue: '241 245 249' },
      { name: '--action-card-text-primary', label: 'Primary Text', defaultValue: '203 213 225' },
      { name: '--action-card-text-secondary', label: 'Secondary Text', defaultValue: '148 163 184' },
    ],
    actionCardGradient: [
      { name: '--action-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '15 23 42' },
      { name: '--action-card-bg-gradient-to', label: 'Gradient End', defaultValue: '23 32 52' },
    ],
    actionCardHover: [
      { name: '--action-card-hover-bg', label: 'Hover Background', defaultValue: '23 32 52' },
      { name: '--action-card-hover-border', label: 'Hover Border', defaultValue: '56 189 248' },
    ],
    actionCardHoverGradient: [
      { name: '--action-card-hover-bg-gradient-from', label: 'Hover Gradient Start', defaultValue: '23 32 52' },
      { name: '--action-card-hover-bg-gradient-to', label: 'Hover Gradient End', defaultValue: '30 41 59' },
    ],
    actionCardIcon: [
      { name: '--action-card-icon-bg', label: 'Icon Background', defaultValue: '30 41 59' },
      { name: '--action-card-icon-color', label: 'Icon Color', defaultValue: '148 163 184' },
      { name: '--action-card-icon-hover-bg', label: 'Icon Hover Background', defaultValue: '7 89 133' },
      { name: '--action-card-icon-hover-color', label: 'Icon Hover Color', defaultValue: '125 211 252' },
    ],
    actionCardRadius: [
      { name: '--action-card-radius', label: 'Border Radius', defaultValue: '0.75rem', isSize: true },
    ],
    // Code Card
    codeCard: [
      { name: '--code-card-bg', label: 'Background', defaultValue: '2 6 14' },
      { name: '--code-card-border', label: 'Border', defaultValue: '30 41 59' },
      { name: '--code-card-text', label: 'Text', defaultValue: '226 232 240' },
    ],
    codeCardGradient: [
      { name: '--code-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '3 7 18' },
      { name: '--code-card-bg-gradient-to', label: 'Gradient End', defaultValue: '10 15 30' },
    ],
    // Info Card
    infoCard: [
      { name: '--info-card-bg', label: 'Background', defaultValue: '23 37 84' },
      { name: '--info-card-border', label: 'Border', defaultValue: '59 130 246' },
      { name: '--info-card-heading', label: 'Heading', defaultValue: '191 219 254' },
      { name: '--info-card-text-primary', label: 'Primary Text', defaultValue: '147 197 253' },
      { name: '--info-card-text-secondary', label: 'Secondary Text', defaultValue: '96 165 250' },
    ],
    infoCardGradient: [
      { name: '--info-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '30 58 138' },
      { name: '--info-card-bg-gradient-to', label: 'Gradient End', defaultValue: '23 37 84' },
    ],
    // Error Card
    errorCard: [
      { name: '--error-card-bg', label: 'Background', defaultValue: '69 10 10' },
      { name: '--error-card-border', label: 'Border', defaultValue: '239 68 68' },
      { name: '--error-card-heading', label: 'Heading', defaultValue: '254 202 202' },
      { name: '--error-card-text-primary', label: 'Primary Text', defaultValue: '252 165 165' },
      { name: '--error-card-text-secondary', label: 'Secondary Text', defaultValue: '248 113 113' },
    ],
    errorCardGradient: [
      { name: '--error-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '127 29 29' },
      { name: '--error-card-bg-gradient-to', label: 'Gradient End', defaultValue: '69 10 10' },
    ],
    // Success Card
    successCard: [
      { name: '--success-card-bg', label: 'Background', defaultValue: '5 46 22' },
      { name: '--success-card-border', label: 'Border', defaultValue: '34 197 94' },
      { name: '--success-card-heading', label: 'Heading', defaultValue: '187 247 208' },
      { name: '--success-card-text-primary', label: 'Primary Text', defaultValue: '134 239 172' },
      { name: '--success-card-text-secondary', label: 'Secondary Text', defaultValue: '74 222 128' },
    ],
    successCardGradient: [
      { name: '--success-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '20 83 45' },
      { name: '--success-card-bg-gradient-to', label: 'Gradient End', defaultValue: '5 46 22' },
    ],
    // Warning Card
    warningCard: [
      { name: '--warning-card-bg', label: 'Background', defaultValue: '69 26 3' },
      { name: '--warning-card-border', label: 'Border', defaultValue: '245 158 11' },
      { name: '--warning-card-heading', label: 'Heading', defaultValue: '254 243 199' },
      { name: '--warning-card-text-primary', label: 'Primary Text', defaultValue: '253 224 71' },
      { name: '--warning-card-text-secondary', label: 'Secondary Text', defaultValue: '250 204 21' },
    ],
    warningCardGradient: [
      { name: '--warning-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '120 53 15' },
      { name: '--warning-card-bg-gradient-to', label: 'Gradient End', defaultValue: '69 26 3' },
    ],
    // Inner Info Card
    innerInfoCard: [
      { name: '--inner-info-card-bg', label: 'Background', defaultValue: '23 37 84' },
      { name: '--inner-info-card-border', label: 'Border', defaultValue: '59 130 246' },
      { name: '--inner-info-card-heading', label: 'Heading', defaultValue: '191 219 254' },
      { name: '--inner-info-card-text-primary', label: 'Primary Text', defaultValue: '147 197 253' },
      { name: '--inner-info-card-text-secondary', label: 'Secondary Text', defaultValue: '96 165 250' },
    ],
    innerInfoCardGradient: [
      { name: '--inner-info-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '30 58 138' },
      { name: '--inner-info-card-bg-gradient-to', label: 'Gradient End', defaultValue: '23 37 84' },
    ],
    // Inner Error Card
    innerErrorCard: [
      { name: '--inner-error-card-bg', label: 'Background', defaultValue: '69 10 10' },
      { name: '--inner-error-card-border', label: 'Border', defaultValue: '239 68 68' },
      { name: '--inner-error-card-heading', label: 'Heading', defaultValue: '254 202 202' },
      { name: '--inner-error-card-text-primary', label: 'Primary Text', defaultValue: '252 165 165' },
      { name: '--inner-error-card-text-secondary', label: 'Secondary Text', defaultValue: '248 113 113' },
    ],
    innerErrorCardGradient: [
      { name: '--inner-error-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '127 29 29' },
      { name: '--inner-error-card-bg-gradient-to', label: 'Gradient End', defaultValue: '69 10 10' },
    ],
    // Inner Success Card
    innerSuccessCard: [
      { name: '--inner-success-card-bg', label: 'Background', defaultValue: '5 46 22' },
      { name: '--inner-success-card-border', label: 'Border', defaultValue: '34 197 94' },
      { name: '--inner-success-card-heading', label: 'Heading', defaultValue: '187 247 208' },
      { name: '--inner-success-card-text-primary', label: 'Primary Text', defaultValue: '134 239 172' },
      { name: '--inner-success-card-text-secondary', label: 'Secondary Text', defaultValue: '74 222 128' },
    ],
    innerSuccessCardGradient: [
      { name: '--inner-success-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '20 83 45' },
      { name: '--inner-success-card-bg-gradient-to', label: 'Gradient End', defaultValue: '5 46 22' },
    ],
    // Inner Warning Card
    innerWarningCard: [
      { name: '--inner-warning-card-bg', label: 'Background', defaultValue: '69 26 3' },
      { name: '--inner-warning-card-border', label: 'Border', defaultValue: '245 158 11' },
      { name: '--inner-warning-card-heading', label: 'Heading', defaultValue: '254 243 199' },
      { name: '--inner-warning-card-text-primary', label: 'Primary Text', defaultValue: '253 224 71' },
      { name: '--inner-warning-card-text-secondary', label: 'Secondary Text', defaultValue: '250 204 21' },
    ],
    innerWarningCardGradient: [
      { name: '--inner-warning-card-bg-gradient-from', label: 'Gradient Start', defaultValue: '120 53 15' },
      { name: '--inner-warning-card-bg-gradient-to', label: 'Gradient End', defaultValue: '69 26 3' },
    ],
    modal: [
      { name: '--modal-bg', label: 'Modal Background', defaultValue: '15 23 42' },
      { name: '--modal-border', label: 'Modal Border', defaultValue: '51 65 85' },
    ],
    modalGradient: [
      { name: '--modal-gradient-from', label: 'Gradient Start', defaultValue: '15 23 42' },
      { name: '--modal-gradient-to', label: 'Gradient End', defaultValue: '23 32 52' },
    ],
    // Form
    form: [
      { name: '--form-bg', label: 'Form Background', defaultValue: '15 23 42' },
      { name: '--form-border', label: 'Form Border', defaultValue: '51 65 85' },
      { name: '--form-text', label: 'Form Text', defaultValue: '248 250 252' },
      { name: '--form-placeholder', label: 'Placeholder Text', defaultValue: '100 116 139' },
      { name: '--form-focus-border', label: 'Focus Border', defaultValue: '56 189 248' },
      { name: '--form-focus-ring', label: 'Focus Ring', defaultValue: '14 165 233' },
    ],
    // Buttons
    button: [
      { name: '--button-primary-bg', label: 'Primary Background', defaultValue: '14 165 233' },
      { name: '--button-primary-border', label: 'Primary Border', defaultValue: '14 165 233' },
      { name: '--button-primary-text', label: 'Primary Text', defaultValue: '255 255 255' },
      { name: '--button-primary-hover-bg', label: 'Primary Hover Bg', defaultValue: '2 132 199' },
      { name: '--button-secondary-bg', label: 'Secondary Background', defaultValue: '30 41 59' },
      { name: '--button-secondary-border', label: 'Secondary Border', defaultValue: '51 65 85' },
      { name: '--button-secondary-text', label: 'Secondary Text', defaultValue: '203 213 225' },
      { name: '--button-secondary-hover-bg', label: 'Secondary Hover Bg', defaultValue: '51 65 85' },
    ],
    // Tooltip
    tooltip: [
      { name: '--tooltip-bg', label: 'Background', defaultValue: '30 41 59' },
      { name: '--tooltip-border', label: 'Border', defaultValue: '71 85 105' },
      { name: '--tooltip-text', label: 'Text', defaultValue: '248 250 252' },
    ],
    // Toast
    toastSuccess: [
      { name: '--toast-success-bg', label: 'Background', defaultValue: '5 46 22' },
      { name: '--toast-success-border', label: 'Border', defaultValue: '34 197 94' },
      { name: '--toast-success-text', label: 'Text', defaultValue: '187 247 208' },
      { name: '--toast-success-icon', label: 'Icon', defaultValue: '74 222 128' },
    ],
    toastError: [
      { name: '--toast-error-bg', label: 'Background', defaultValue: '69 10 10' },
      { name: '--toast-error-border', label: 'Border', defaultValue: '239 68 68' },
      { name: '--toast-error-text', label: 'Text', defaultValue: '254 202 202' },
      { name: '--toast-error-icon', label: 'Icon', defaultValue: '248 113 113' },
    ],
    toastWarning: [
      { name: '--toast-warning-bg', label: 'Background', defaultValue: '69 26 3' },
      { name: '--toast-warning-border', label: 'Border', defaultValue: '245 158 11' },
      { name: '--toast-warning-text', label: 'Text', defaultValue: '254 243 199' },
      { name: '--toast-warning-icon', label: 'Icon', defaultValue: '250 204 21' },
    ],
    toastInfo: [
      { name: '--toast-info-bg', label: 'Background', defaultValue: '23 37 84' },
      { name: '--toast-info-border', label: 'Border', defaultValue: '59 130 246' },
      { name: '--toast-info-text', label: 'Text', defaultValue: '191 219 254' },
      { name: '--toast-info-icon', label: 'Icon', defaultValue: '96 165 250' },
    ],
    // Primary Color Scale
    primary: [
      { name: '--primary-50', label: 'Primary 50', defaultValue: '238 242 255' },
      { name: '--primary-100', label: 'Primary 100', defaultValue: '224 231 255' },
      { name: '--primary-500', label: 'Primary 500', defaultValue: '99 102 241' },
      { name: '--primary-600', label: 'Primary 600', defaultValue: '79 70 229' },
      { name: '--primary-700', label: 'Primary 700', defaultValue: '67 56 202' },
    ],
    // Secondary Color Scale
    secondary: [
      { name: '--secondary-50', label: 'Secondary 50', defaultValue: '248 250 252' },
      { name: '--secondary-100', label: 'Secondary 100', defaultValue: '241 245 249' },
      { name: '--secondary-200', label: 'Secondary 200', defaultValue: '226 232 240' },
      { name: '--secondary-500', label: 'Secondary 500', defaultValue: '100 116 139' },
      { name: '--secondary-700', label: 'Secondary 700', defaultValue: '51 65 85' },
      { name: '--secondary-900', label: 'Secondary 900', defaultValue: '15 23 42' },
    ],
  },
};

// ============================================================================
// Storage Helper Functions (using localStorage to match provider and avoid cookie size limits)
// ============================================================================
function getColorOverridesFromCookie(): ColorOverridesByMode {
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

function saveColorOverridesToCookie(overrides: ColorOverridesByMode): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(overrides));
}

function getCurrentThemeMode(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function applyColorOverride(name: string, value: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(name, value);
}

function removeColorOverride(name: string): void {
  if (typeof window === 'undefined') return;
  document.documentElement.style.removeProperty(name);
}

function applyColorOverridesForMode(mode: 'light' | 'dark'): void {
  if (typeof window === 'undefined') return;
  const overrides = getColorOverridesFromCookie();
  const modeOverrides = overrides[mode] || {};
  Object.entries(modeOverrides).forEach(([name, value]) => {
    applyColorOverride(name, value);
  });
}

// Gradient toggle functions
function getGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function saveGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-gradient-enabled', String(enabled));
}

function getCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}

function saveCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-card-gradient-enabled', String(enabled));
}

function getCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function saveCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-card-border-enabled', String(enabled));
}

function getHeaderGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${HEADER_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}

function saveHeaderGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${HEADER_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-header-gradient-enabled', String(enabled));
}

function getMenuGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${MENU_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}

function saveMenuGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${MENU_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-menu-gradient-enabled', String(enabled));
}

function getFooterGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${FOOTER_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}

function saveFooterGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${FOOTER_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-footer-gradient-enabled', String(enabled));
}

function getFooterBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${FOOTER_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function saveFooterBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${FOOTER_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-footer-border-enabled', String(enabled));
}

function getPageBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${PAGE_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function savePageBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${PAGE_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-page-bg-color-enabled', String(enabled));
}

function getFooterBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${FOOTER_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function saveFooterBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${FOOTER_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-footer-bg-color-enabled', String(enabled));
}

function getCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}

function saveCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-card-bg-color-enabled', String(enabled));
}

// Modal cookie helpers
function getModalBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${MODAL_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveModalBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${MODAL_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-modal-border-enabled', String(enabled));
}
function getModalGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${MODAL_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveModalGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${MODAL_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-modal-gradient-enabled', String(enabled));
}
function getModalBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${MODAL_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveModalBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${MODAL_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-modal-bg-color-enabled', String(enabled));
}

// Secondary Card cookie helpers
function getSecondaryCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SECONDARY_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSecondaryCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SECONDARY_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-secondary-card-border-enabled', String(enabled));
}
function getSecondaryCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${SECONDARY_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveSecondaryCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SECONDARY_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-secondary-card-gradient-enabled', String(enabled));
}
function getSecondaryCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SECONDARY_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSecondaryCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SECONDARY_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-secondary-card-bg-color-enabled', String(enabled));
}

// Specialty Card cookie helpers
function getSpecialtyCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SPECIALTY_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSpecialtyCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SPECIALTY_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-specialty-card-border-enabled', String(enabled));
}
function getSpecialtyCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${SPECIALTY_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveSpecialtyCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SPECIALTY_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-specialty-card-gradient-enabled', String(enabled));
}
function getSpecialtyCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SPECIALTY_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSpecialtyCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SPECIALTY_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-specialty-card-bg-color-enabled', String(enabled));
}

// Inner Card cookie helpers
function getInnerCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-card-border-enabled', String(enabled));
}
function getInnerCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInnerCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-card-gradient-enabled', String(enabled));
}
function getInnerCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-card-bg-color-enabled', String(enabled));
}

// Action Card cookie helpers
function getActionCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${ACTION_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveActionCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ACTION_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-action-card-border-enabled', String(enabled));
}
function getActionCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${ACTION_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveActionCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ACTION_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-action-card-gradient-enabled', String(enabled));
}
function getActionCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${ACTION_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveActionCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ACTION_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-action-card-bg-color-enabled', String(enabled));
}

// Code Card cookie helpers
function getCodeCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${CODE_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveCodeCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CODE_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-code-card-border-enabled', String(enabled));
}
function getCodeCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${CODE_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveCodeCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CODE_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-code-card-gradient-enabled', String(enabled));
}
function getCodeCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${CODE_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveCodeCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${CODE_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-code-card-bg-color-enabled', String(enabled));
}

// Info Card cookie helpers
function getInfoCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INFO_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInfoCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INFO_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-info-card-border-enabled', String(enabled));
}
function getInfoCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INFO_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInfoCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INFO_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-info-card-gradient-enabled', String(enabled));
}
function getInfoCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INFO_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInfoCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INFO_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-info-card-bg-color-enabled', String(enabled));
}

// Error Card cookie helpers
function getErrorCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${ERROR_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveErrorCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ERROR_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-error-card-border-enabled', String(enabled));
}
function getErrorCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${ERROR_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveErrorCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ERROR_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-error-card-gradient-enabled', String(enabled));
}
function getErrorCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${ERROR_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveErrorCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${ERROR_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-error-card-bg-color-enabled', String(enabled));
}

// Success Card cookie helpers
function getSuccessCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SUCCESS_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSuccessCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SUCCESS_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-success-card-border-enabled', String(enabled));
}
function getSuccessCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${SUCCESS_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveSuccessCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SUCCESS_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-success-card-gradient-enabled', String(enabled));
}
function getSuccessCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${SUCCESS_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveSuccessCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${SUCCESS_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-success-card-bg-color-enabled', String(enabled));
}

// Warning Card cookie helpers
function getWarningCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${WARNING_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveWarningCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${WARNING_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-warning-card-border-enabled', String(enabled));
}
function getWarningCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${WARNING_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveWarningCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${WARNING_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-warning-card-gradient-enabled', String(enabled));
}
function getWarningCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${WARNING_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveWarningCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${WARNING_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-warning-card-bg-color-enabled', String(enabled));
}

// Inner Info Card cookie helpers
function getInnerInfoCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_INFO_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerInfoCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_INFO_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-info-card-border-enabled', String(enabled));
}
function getInnerInfoCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_INFO_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInnerInfoCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_INFO_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-info-card-gradient-enabled', String(enabled));
}
function getInnerInfoCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_INFO_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerInfoCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_INFO_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-info-card-bg-color-enabled', String(enabled));
}

// Inner Error Card cookie helpers
function getInnerErrorCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_ERROR_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerErrorCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_ERROR_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-error-card-border-enabled', String(enabled));
}
function getInnerErrorCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_ERROR_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInnerErrorCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_ERROR_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-error-card-gradient-enabled', String(enabled));
}
function getInnerErrorCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_ERROR_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerErrorCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_ERROR_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-error-card-bg-color-enabled', String(enabled));
}

// Inner Success Card cookie helpers
function getInnerSuccessCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_SUCCESS_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerSuccessCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_SUCCESS_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-success-card-border-enabled', String(enabled));
}
function getInnerSuccessCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_SUCCESS_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInnerSuccessCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_SUCCESS_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-success-card-gradient-enabled', String(enabled));
}
function getInnerSuccessCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_SUCCESS_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerSuccessCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_SUCCESS_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-success-card-bg-color-enabled', String(enabled));
}

// Inner Warning Card cookie helpers
function getInnerWarningCardBorderEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_WARNING_CARD_BORDER_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerWarningCardBorderEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_WARNING_CARD_BORDER_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-warning-card-border-enabled', String(enabled));
}
function getInnerWarningCardGradientEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_WARNING_CARD_GRADIENT_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : false;
}
function saveInnerWarningCardGradientEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_WARNING_CARD_GRADIENT_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-warning-card-gradient-enabled', String(enabled));
}
function getInnerWarningCardBgColorEnabledFromCookie(): boolean {
  if (typeof window === 'undefined') return true;
  const match = document.cookie.match(new RegExp(`(^| )${INNER_WARNING_CARD_BG_COLOR_COOKIE_NAME}=([^;]+)`));
  return match ? match[2] === 'true' : true;
}
function saveInnerWarningCardBgColorEnabledToCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  document.cookie = `${INNER_WARNING_CARD_BG_COLOR_COOKIE_NAME}=${enabled}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  document.documentElement.setAttribute('data-inner-warning-card-bg-color-enabled', String(enabled));
}

// Bubble Preview style helpers
function getBubbleStyleFromStorage(): BubbleStyleConfig {
  if (typeof window === 'undefined') return DEFAULT_BUBBLE_STYLE;
  try {
    const stored = localStorage.getItem(BUBBLE_STYLE_STORAGE_KEY);
    if (stored) return { ...DEFAULT_BUBBLE_STYLE, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return DEFAULT_BUBBLE_STYLE;
}

function saveBubbleStyleToStorage(style: BubbleStyleConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BUBBLE_STYLE_STORAGE_KEY, JSON.stringify(style));
}

function getBubbleShadowCss(shadow: BubbleStyleConfig['shadow']): string {
  return BUBBLE_SHADOW_OPTIONS.find(o => o.value === shadow)?.css || 'none';
}

// ============================================================================
// Color Variable Editor Component
// ============================================================================
interface ColorVariableEditorProps {
  name: string;
  label: string;
  defaultValue: string;
  mode: 'light' | 'dark';
  onUpdate: () => void;
}

function ColorVariableEditor({ name, label, defaultValue, mode, onUpdate }: ColorVariableEditorProps) {
  const [value, setValue] = useState(defaultValue);
  const [isOverridden, setIsOverridden] = useState(false);

  useEffect(() => {
    const overrides = getColorOverridesFromCookie();
    const override = overrides[mode]?.[name];
    if (override) {
      setValue(override);
      setIsOverridden(true);
    } else {
      setValue(defaultValue);
      setIsOverridden(false);
    }
  }, [name, defaultValue, mode]);

  const handleChange = (newValue: string) => {
    setValue(newValue);
    setIsOverridden(newValue !== defaultValue);

    // Save to cookie
    const overrides = getColorOverridesFromCookie();
    if (newValue === defaultValue) {
      delete overrides[mode][name];
    } else {
      overrides[mode][name] = newValue;
    }
    saveColorOverridesToCookie(overrides);

    // Apply if current mode
    if (getCurrentThemeMode() === mode) {
      if (newValue === defaultValue) {
        removeColorOverride(name);
      } else {
        applyColorOverride(name, newValue);
      }
    }
    onUpdate();
  };

  const handleReset = () => {
    handleChange(defaultValue);
  };

  // Convert RGB string to hex for color picker
  const rgbToHex = (rgb: string): string => {
    const parts = rgb.split(' ').map(Number);
    if (parts.length !== 3) return '#000000';
    return '#' + parts.map(n => n.toString(16).padStart(2, '0')).join('');
  };

  // Convert hex to RGB string
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return value;
    return `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`;
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <input
          type="color"
          value={rgbToHex(value)}
          onChange={(e) => handleChange(hexToRgb(e.target.value))}
          className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 cursor-pointer"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 truncate">{label}</p>
          <p className="text-xs font-mono text-secondary-500 dark:text-secondary-400">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Input
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          className="w-32 h-8 text-xs font-mono"
          placeholder="R G B"
        />
        {isOverridden && (
          <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 w-8 p-0">
            <RotateCcw className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// UI Components for Settings
// ============================================================================
interface SubsectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  onReset?: () => void;
}

function Subsection({ title, icon: Icon, children, onReset }: SubsectionProps) {
  return (
    <div className="space-y-3 pt-6 first:pt-0 border-t border-secondary-200/60 dark:border-secondary-700/60 first:border-t-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Icon className="w-5 h-5 text-secondary-700 dark:text-secondary-200" />
          <h4 className="text-base font-medium text-secondary-700 dark:text-secondary-200">
            {title}
          </h4>
        </div>
        {onReset && (
          <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={onReset}>
            Reset
          </Button>
        )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

interface SectionGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SectionGroup({ title, children, defaultOpen = true }: SectionGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-800/50 hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
      >
        <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">
          {title}
        </h3>
        <ChevronDown className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="p-4 space-y-4 bg-white dark:bg-secondary-900">
          {children}
        </div>
      )}
    </div>
  );
}

interface DualModeVariablesProps {
  lightVars: ColorVariable[];
  darkVars: ColorVariable[];
  updateKey: number;
  onUpdate: () => void;
}

function DualModeVariables({ lightVars, darkVars, updateKey, onUpdate }: DualModeVariablesProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Light Mode */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-secondary-200 dark:border-secondary-700">
          <Sun className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Light Mode</span>
        </div>
        {lightVars.map((v) => (
          <ColorVariableEditor
            key={`${v.name}-light-${updateKey}`}
            name={v.name}
            label={v.label}
            defaultValue={v.defaultValue}
            mode="light"
            onUpdate={onUpdate}
          />
        ))}
      </div>
      {/* Dark Mode */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 pb-2 border-b border-secondary-200 dark:border-secondary-700">
          <Moon className="w-4 h-4 text-indigo-500" />
          <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Dark Mode</span>
        </div>
        {darkVars.map((v) => (
          <ColorVariableEditor
            key={`${v.name}-dark-${updateKey}`}
            name={v.name}
            label={v.label}
            defaultValue={v.defaultValue}
            mode="dark"
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

// Toggle Switch Component
interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleSwitch({ label, checked, onChange }: ToggleSwitchProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div className={cn(
          "w-10 h-6 rounded-full transition-colors",
          checked ? "bg-primary-500" : "bg-secondary-300 dark:bg-secondary-600"
        )} />
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow",
          checked ? "translate-x-5" : "translate-x-1"
        )} />
      </div>
      <span className="text-sm text-secondary-700 dark:text-secondary-300">{label}</span>
    </label>
  );
}

// Animated Collapse Component for smooth expand/collapse
interface AnimatedCollapseProps {
  isOpen: boolean;
  children: React.ReactNode;
}

function AnimatedCollapse({ isOpen, children }: AnimatedCollapseProps) {
  const [height, setHeight] = useState<number | 'auto'>(isOpen ? 'auto' : 0);
  const [isAnimating, setIsAnimating] = useState(false);
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (node && isOpen) {
      setHeight(node.scrollHeight);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Small delay to ensure the height is set before animation starts
      const timer = setTimeout(() => {
        setHeight('auto');
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(true);
      setHeight(0);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <div
      ref={contentRef}
      style={{
        height: isAnimating && height !== 'auto' ? height : (isOpen ? 'auto' : 0),
        overflow: 'hidden',
        transition: 'height 300ms ease-in-out, opacity 300ms ease-in-out',
        opacity: isOpen ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}

// ============================================================================
// Tabs Definition
// ============================================================================
const tabs = [
  { id: 'design-system', label: 'Design System', icon: Palette },
  { id: 'components', label: 'UI Components', icon: Layout },
  { id: 'patterns', label: 'Patterns', icon: Code },
  { id: 'chatbots', label: 'Chatbot SDK', icon: MessageSquare },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'ui-settings', label: 'UI Settings', icon: Settings },
];

// ============================================================================
// Main Component
// ============================================================================
export function SDKTabs() {
  const [activeTab, setActiveTab] = useState('design-system');
  const [copied, setCopied] = useState<string | null>(null);
  const [updateKey, setUpdateKey] = useState(0);
  const [pageScrollOpen, setPageScrollOpen] = useState(false);

  // UI Settings (blur/opacity)
  const {
    settings: uiSettings,
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
    resetToDefaults: resetUISettingsToDefaults,
    loadSettings: loadUISettings,
  } = useUISettings();

  // Gradient and background toggle states
  const [pageGradientEnabled, setPageGradientEnabled] = useState(true);
  const [pageBgColorEnabled, setPageBgColorEnabled] = useState(true);
  const [cardGradientEnabled, setCardGradientEnabled] = useState(false);
  const [cardBgColorEnabled, setCardBgColorEnabled] = useState(true);
  const [cardBorderEnabled, setCardBorderEnabled] = useState(true);
  const [headerGradientEnabled, setHeaderGradientEnabled] = useState(false);
  const [menuGradientEnabled, setMenuGradientEnabled] = useState(false);
  const [footerGradientEnabled, setFooterGradientEnabled] = useState(false);
  const [footerBgColorEnabled, setFooterBgColorEnabled] = useState(true);
  const [footerBorderEnabled, setFooterBorderEnabled] = useState(true);

  // Modal toggle states
  const [modalBorderEnabled, setModalBorderEnabled] = useState(true);
  const [modalGradientEnabled, setModalGradientEnabled] = useState(false);
  const [modalBgColorEnabled, setModalBgColorEnabled] = useState(true);

  // Secondary Card toggle states
  const [secondaryCardBorderEnabled, setSecondaryCardBorderEnabled] = useState(true);
  const [secondaryCardGradientEnabled, setSecondaryCardGradientEnabled] = useState(false);
  const [secondaryCardBgColorEnabled, setSecondaryCardBgColorEnabled] = useState(true);

  // Specialty Card toggle states
  const [specialtyCardBorderEnabled, setSpecialtyCardBorderEnabled] = useState(true);
  const [specialtyCardGradientEnabled, setSpecialtyCardGradientEnabled] = useState(false);
  const [specialtyCardBgColorEnabled, setSpecialtyCardBgColorEnabled] = useState(true);

  // Inner Card toggle states
  const [innerCardBorderEnabled, setInnerCardBorderEnabled] = useState(true);
  const [innerCardGradientEnabled, setInnerCardGradientEnabled] = useState(false);
  const [innerCardBgColorEnabled, setInnerCardBgColorEnabled] = useState(true);

  // Action Card toggle states
  const [actionCardBorderEnabled, setActionCardBorderEnabled] = useState(true);
  const [actionCardGradientEnabled, setActionCardGradientEnabled] = useState(false);
  const [actionCardBgColorEnabled, setActionCardBgColorEnabled] = useState(true);

  // Code Card toggle states
  const [codeCardBorderEnabled, setCodeCardBorderEnabled] = useState(true);
  const [codeCardGradientEnabled, setCodeCardGradientEnabled] = useState(false);
  const [codeCardBgColorEnabled, setCodeCardBgColorEnabled] = useState(true);

  // Semantic Card toggle states
  const [infoCardBorderEnabled, setInfoCardBorderEnabled] = useState(true);
  const [infoCardGradientEnabled, setInfoCardGradientEnabled] = useState(false);
  const [infoCardBgColorEnabled, setInfoCardBgColorEnabled] = useState(true);

  const [errorCardBorderEnabled, setErrorCardBorderEnabled] = useState(true);
  const [errorCardGradientEnabled, setErrorCardGradientEnabled] = useState(false);
  const [errorCardBgColorEnabled, setErrorCardBgColorEnabled] = useState(true);

  const [successCardBorderEnabled, setSuccessCardBorderEnabled] = useState(true);
  const [successCardGradientEnabled, setSuccessCardGradientEnabled] = useState(false);
  const [successCardBgColorEnabled, setSuccessCardBgColorEnabled] = useState(true);

  const [warningCardBorderEnabled, setWarningCardBorderEnabled] = useState(true);
  const [warningCardGradientEnabled, setWarningCardGradientEnabled] = useState(false);
  const [warningCardBgColorEnabled, setWarningCardBgColorEnabled] = useState(true);

  // Inner Semantic Card toggle states
  const [innerInfoCardBorderEnabled, setInnerInfoCardBorderEnabled] = useState(true);
  const [innerInfoCardGradientEnabled, setInnerInfoCardGradientEnabled] = useState(false);
  const [innerInfoCardBgColorEnabled, setInnerInfoCardBgColorEnabled] = useState(true);

  const [innerErrorCardBorderEnabled, setInnerErrorCardBorderEnabled] = useState(true);
  const [innerErrorCardGradientEnabled, setInnerErrorCardGradientEnabled] = useState(false);
  const [innerErrorCardBgColorEnabled, setInnerErrorCardBgColorEnabled] = useState(true);

  const [innerSuccessCardBorderEnabled, setInnerSuccessCardBorderEnabled] = useState(true);
  const [innerSuccessCardGradientEnabled, setInnerSuccessCardGradientEnabled] = useState(false);
  const [innerSuccessCardBgColorEnabled, setInnerSuccessCardBgColorEnabled] = useState(true);

  const [innerWarningCardBorderEnabled, setInnerWarningCardBorderEnabled] = useState(true);
  const [innerWarningCardGradientEnabled, setInnerWarningCardGradientEnabled] = useState(false);
  const [innerWarningCardBgColorEnabled, setInnerWarningCardBgColorEnabled] = useState(true);

  // Bubble Preview style state
  const [bubbleStyle, setBubbleStyle] = useState<BubbleStyleConfig>(DEFAULT_BUBBLE_STYLE);

  const updateBubbleStyle = useCallback((updates: Partial<BubbleStyleConfig>) => {
    setBubbleStyle(prev => {
      const next = { ...prev, ...updates };
      saveBubbleStyleToStorage(next);
      return next;
    });
  }, []);

  const lightVars = themeColorVariables.light;
  const darkVars = themeColorVariables.dark;

  // Load gradient and background states on mount
  useEffect(() => {
    setPageGradientEnabled(getGradientEnabledFromCookie());
    setPageBgColorEnabled(getPageBgColorEnabledFromCookie());
    setCardGradientEnabled(getCardGradientEnabledFromCookie());
    setCardBgColorEnabled(getCardBgColorEnabledFromCookie());
    setCardBorderEnabled(getCardBorderEnabledFromCookie());
    setHeaderGradientEnabled(getHeaderGradientEnabledFromCookie());
    setMenuGradientEnabled(getMenuGradientEnabledFromCookie());
    setFooterGradientEnabled(getFooterGradientEnabledFromCookie());
    setFooterBgColorEnabled(getFooterBgColorEnabledFromCookie());
    setFooterBorderEnabled(getFooterBorderEnabledFromCookie());

    // Modal
    setModalBorderEnabled(getModalBorderEnabledFromCookie());
    setModalGradientEnabled(getModalGradientEnabledFromCookie());
    setModalBgColorEnabled(getModalBgColorEnabledFromCookie());

    // Secondary Card
    setSecondaryCardBorderEnabled(getSecondaryCardBorderEnabledFromCookie());
    setSecondaryCardGradientEnabled(getSecondaryCardGradientEnabledFromCookie());
    setSecondaryCardBgColorEnabled(getSecondaryCardBgColorEnabledFromCookie());

    // Specialty Card
    setSpecialtyCardBorderEnabled(getSpecialtyCardBorderEnabledFromCookie());
    setSpecialtyCardGradientEnabled(getSpecialtyCardGradientEnabledFromCookie());
    setSpecialtyCardBgColorEnabled(getSpecialtyCardBgColorEnabledFromCookie());

    // Inner Card
    setInnerCardBorderEnabled(getInnerCardBorderEnabledFromCookie());
    setInnerCardGradientEnabled(getInnerCardGradientEnabledFromCookie());
    setInnerCardBgColorEnabled(getInnerCardBgColorEnabledFromCookie());

    // Action Card
    setActionCardBorderEnabled(getActionCardBorderEnabledFromCookie());
    setActionCardGradientEnabled(getActionCardGradientEnabledFromCookie());
    setActionCardBgColorEnabled(getActionCardBgColorEnabledFromCookie());

    // Code Card
    setCodeCardBorderEnabled(getCodeCardBorderEnabledFromCookie());
    setCodeCardGradientEnabled(getCodeCardGradientEnabledFromCookie());
    setCodeCardBgColorEnabled(getCodeCardBgColorEnabledFromCookie());

    // Semantic Cards
    setInfoCardBorderEnabled(getInfoCardBorderEnabledFromCookie());
    setInfoCardGradientEnabled(getInfoCardGradientEnabledFromCookie());
    setInfoCardBgColorEnabled(getInfoCardBgColorEnabledFromCookie());

    setErrorCardBorderEnabled(getErrorCardBorderEnabledFromCookie());
    setErrorCardGradientEnabled(getErrorCardGradientEnabledFromCookie());
    setErrorCardBgColorEnabled(getErrorCardBgColorEnabledFromCookie());

    setSuccessCardBorderEnabled(getSuccessCardBorderEnabledFromCookie());
    setSuccessCardGradientEnabled(getSuccessCardGradientEnabledFromCookie());
    setSuccessCardBgColorEnabled(getSuccessCardBgColorEnabledFromCookie());

    setWarningCardBorderEnabled(getWarningCardBorderEnabledFromCookie());
    setWarningCardGradientEnabled(getWarningCardGradientEnabledFromCookie());
    setWarningCardBgColorEnabled(getWarningCardBgColorEnabledFromCookie());

    // Inner Semantic Cards
    setInnerInfoCardBorderEnabled(getInnerInfoCardBorderEnabledFromCookie());
    setInnerInfoCardGradientEnabled(getInnerInfoCardGradientEnabledFromCookie());
    setInnerInfoCardBgColorEnabled(getInnerInfoCardBgColorEnabledFromCookie());

    setInnerErrorCardBorderEnabled(getInnerErrorCardBorderEnabledFromCookie());
    setInnerErrorCardGradientEnabled(getInnerErrorCardGradientEnabledFromCookie());
    setInnerErrorCardBgColorEnabled(getInnerErrorCardBgColorEnabledFromCookie());

    setInnerSuccessCardBorderEnabled(getInnerSuccessCardBorderEnabledFromCookie());
    setInnerSuccessCardGradientEnabled(getInnerSuccessCardGradientEnabledFromCookie());
    setInnerSuccessCardBgColorEnabled(getInnerSuccessCardBgColorEnabledFromCookie());

    setInnerWarningCardBorderEnabled(getInnerWarningCardBorderEnabledFromCookie());
    setInnerWarningCardGradientEnabled(getInnerWarningCardGradientEnabledFromCookie());
    setInnerWarningCardBgColorEnabled(getInnerWarningCardBgColorEnabledFromCookie());

    // Bubble Preview
    setBubbleStyle(getBubbleStyleFromStorage());
  }, []);

  const forceUpdate = useCallback(() => {
    setUpdateKey((k) => k + 1);
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleResetGroup = (groupName: string, lightGroup: ColorVariable[], darkGroup: ColorVariable[]) => {
    const overrides = getColorOverridesFromCookie();
    lightGroup.forEach((v) => delete overrides.light[v.name]);
    darkGroup.forEach((v) => delete overrides.dark[v.name]);
    saveColorOverridesToCookie(overrides);

    // Clear inline styles
    const mode = getCurrentThemeMode();
    const group = mode === 'light' ? lightGroup : darkGroup;
    group.forEach((v) => removeColorOverride(v.name));

    forceUpdate();
    toast.success(`${groupName} colors reset to defaults`);
  };

  const handleResetAll = () => {
    saveColorOverridesToCookie({ light: {}, dark: {} });

    // Remove all inline overrides
    Object.values(lightVars).flat().forEach((v) => removeColorOverride(v.name));
    Object.values(darkVars).flat().forEach((v) => removeColorOverride(v.name));

    // Reset gradient and background toggles
    setPageGradientEnabled(true);
    setPageBgColorEnabled(true);
    setCardGradientEnabled(false);
    setCardBgColorEnabled(true);
    setCardBorderEnabled(true);
    setHeaderGradientEnabled(false);
    setMenuGradientEnabled(false);
    setFooterGradientEnabled(false);
    setFooterBgColorEnabled(true);
    setFooterBorderEnabled(true);

    saveGradientEnabledToCookie(true);
    savePageBgColorEnabledToCookie(true);
    saveCardGradientEnabledToCookie(false);
    saveCardBgColorEnabledToCookie(true);
    saveCardBorderEnabledToCookie(true);
    saveHeaderGradientEnabledToCookie(false);
    saveMenuGradientEnabledToCookie(false);
    saveFooterGradientEnabledToCookie(false);
    saveFooterBgColorEnabledToCookie(true);
    saveFooterBorderEnabledToCookie(true);

    // Reset blur/opacity settings
    resetUISettingsToDefaults();

    forceUpdate();
    toast.success('All settings reset to defaults');
  };

  // Helper function to get all CSS variable values for a mode
  const getAllColorValues = (mode: 'light' | 'dark'): Record<string, string> => {
    const result: Record<string, string> = {};
    const vars = mode === 'light' ? lightVars : darkVars;
    const overrides = getColorOverridesFromCookie();
    const modeOverrides = overrides[mode] || {};

    // Collect all color variables from theme definition
    Object.values(vars).flat().forEach((variable) => {
      // Use override if exists, otherwise use default
      result[variable.name] = modeOverrides[variable.name] || variable.defaultValue;
    });

    return result;
  };

  const handleExportSettings = () => {
    const settings = {
      version: 1,
      exportedAt: new Date().toISOString(),
      name: 'Custom Theme',
      description: 'Exported from UI Settings',
      colorOverrides: getColorOverridesFromCookie(),
      allColors: {
        light: getAllColorValues('light'),
        dark: getAllColorValues('dark'),
      },
      gradientToggles: {
        pageGradient: pageGradientEnabled,
        pageBgColor: pageBgColorEnabled,
        cardGradient: cardGradientEnabled,
        cardBgColor: cardBgColorEnabled,
        cardBorder: cardBorderEnabled,
        headerGradient: headerGradientEnabled,
        menuGradient: menuGradientEnabled,
        footerGradient: footerGradientEnabled,
        footerBgColor: footerBgColorEnabled,
        footerBorder: footerBorderEnabled,
        modalBorder: modalBorderEnabled,
        modalGradient: modalGradientEnabled,
        modalBgColor: modalBgColorEnabled,
        secondaryCardBorder: secondaryCardBorderEnabled,
        secondaryCardGradient: secondaryCardGradientEnabled,
        secondaryCardBgColor: secondaryCardBgColorEnabled,
        specialtyCardBorder: specialtyCardBorderEnabled,
        specialtyCardGradient: specialtyCardGradientEnabled,
        specialtyCardBgColor: specialtyCardBgColorEnabled,
        innerCardBorder: innerCardBorderEnabled,
        innerCardGradient: innerCardGradientEnabled,
        innerCardBgColor: innerCardBgColorEnabled,
        codeCardBorder: codeCardBorderEnabled,
        codeCardGradient: codeCardGradientEnabled,
        codeCardBgColor: codeCardBgColorEnabled,
        infoCardBorder: infoCardBorderEnabled,
        infoCardGradient: infoCardGradientEnabled,
        infoCardBgColor: infoCardBgColorEnabled,
        errorCardBorder: errorCardBorderEnabled,
        errorCardGradient: errorCardGradientEnabled,
        errorCardBgColor: errorCardBgColorEnabled,
        successCardBorder: successCardBorderEnabled,
        successCardGradient: successCardGradientEnabled,
        successCardBgColor: successCardBgColorEnabled,
        warningCardBorder: warningCardBorderEnabled,
        warningCardGradient: warningCardGradientEnabled,
        warningCardBgColor: warningCardBgColorEnabled,
        innerInfoCardBorder: innerInfoCardBorderEnabled,
        innerInfoCardGradient: innerInfoCardGradientEnabled,
        innerInfoCardBgColor: innerInfoCardBgColorEnabled,
        innerErrorCardBorder: innerErrorCardBorderEnabled,
        innerErrorCardGradient: innerErrorCardGradientEnabled,
        innerErrorCardBgColor: innerErrorCardBgColorEnabled,
        innerSuccessCardBorder: innerSuccessCardBorderEnabled,
        innerSuccessCardGradient: innerSuccessCardGradientEnabled,
        innerSuccessCardBgColor: innerSuccessCardBgColorEnabled,
        innerWarningCardBorder: innerWarningCardBorderEnabled,
        innerWarningCardGradient: innerWarningCardGradientEnabled,
        innerWarningCardBgColor: innerWarningCardBgColorEnabled,
      },
      uiSettings: {
        backdropBlur: uiSettings.backdropBlur,
        headerBlurEnabled: uiSettings.headerBlurEnabled,
        headerBlurUseOpacity: uiSettings.headerBlurUseOpacity,
        headerBlurOpacity: uiSettings.headerBlurOpacity,
        headerBlurUseBackgroundColor: uiSettings.headerBlurUseBackgroundColor,
        headerBlurUseGradient: uiSettings.headerBlurUseGradient,
        headerBorderEnabled: uiSettings.headerBorderEnabled,
        menuBlurEnabled: uiSettings.menuBlurEnabled,
        menuBlurIntensity: uiSettings.menuBlurIntensity,
        menuBlurUseOpacity: uiSettings.menuBlurUseOpacity,
        menuBlurOpacity: uiSettings.menuBlurOpacity,
        menuBlurUseBackgroundColor: uiSettings.menuBlurUseBackgroundColor,
        menuBlurUseGradient: uiSettings.menuBlurUseGradient,
        menuBorderEnabled: uiSettings.menuBorderEnabled,
        modalBlurEnabled: uiSettings.modalBlurEnabled,
        modalBlurIntensity: uiSettings.modalBlurIntensity,
        modalBlurUseOpacity: uiSettings.modalBlurUseOpacity,
        modalBlurOpacity: uiSettings.modalBlurOpacity,
      },
      // Keep blurSettings for backward compatibility
      blurSettings: {
        backdropBlur: uiSettings.backdropBlur,
        headerBlurEnabled: uiSettings.headerBlurEnabled,
        headerBlurUseOpacity: uiSettings.headerBlurUseOpacity,
        headerBlurOpacity: uiSettings.headerBlurOpacity,
        headerBlurUseBackgroundColor: uiSettings.headerBlurUseBackgroundColor,
        headerBlurUseGradient: uiSettings.headerBlurUseGradient,
        menuBlurEnabled: uiSettings.menuBlurEnabled,
        menuBlurIntensity: uiSettings.menuBlurIntensity,
        menuBlurUseOpacity: uiSettings.menuBlurUseOpacity,
        menuBlurOpacity: uiSettings.menuBlurOpacity,
        menuBlurUseBackgroundColor: uiSettings.menuBlurUseBackgroundColor,
        menuBlurUseGradient: uiSettings.menuBlurUseGradient,
        modalBlurEnabled: uiSettings.modalBlurEnabled,
        modalBlurIntensity: uiSettings.modalBlurIntensity,
        modalBlurUseOpacity: uiSettings.modalBlurUseOpacity,
        modalBlurOpacity: uiSettings.modalBlurOpacity,
      },
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theme-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Theme exported');
  };

  const handleImportSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const settings = JSON.parse(text);

        // Handle allColors format (theme file format)
        if (settings.allColors) {
          const newOverrides: ColorOverridesByMode = { light: {}, dark: {} };

          // Import all colors from the theme file
          if (settings.allColors.light) {
            Object.entries(settings.allColors.light).forEach(([name, value]) => {
              if (typeof value === 'string' && !name.includes('width')) {
                newOverrides.light[name] = value;
                // Apply to DOM if in light mode
                if (getCurrentThemeMode() === 'light') {
                  applyColorOverride(name, value);
                }
              }
            });
          }
          if (settings.allColors.dark) {
            Object.entries(settings.allColors.dark).forEach(([name, value]) => {
              if (typeof value === 'string' && !name.includes('width')) {
                newOverrides.dark[name] = value;
                // Apply to DOM if in dark mode
                if (getCurrentThemeMode() === 'dark') {
                  applyColorOverride(name, value);
                }
              }
            });
          }

          saveColorOverridesToCookie(newOverrides);
        } else if (settings.colorOverrides) {
          // Legacy format support
          saveColorOverridesToCookie(settings.colorOverrides);
          applyColorOverridesForMode(getCurrentThemeMode());
        }

        // Handle gradient toggles
        if (settings.gradientToggles) {
          const gt = settings.gradientToggles;

          // Page & Layout toggles
          if (gt.pageGradient !== undefined) {
            setPageGradientEnabled(gt.pageGradient);
            saveGradientEnabledToCookie(gt.pageGradient);
          }
          if (gt.pageBgColor !== undefined) {
            setPageBgColorEnabled(gt.pageBgColor);
            savePageBgColorEnabledToCookie(gt.pageBgColor);
          }
          if (gt.cardGradient !== undefined) {
            setCardGradientEnabled(gt.cardGradient);
            saveCardGradientEnabledToCookie(gt.cardGradient);
          }
          if (gt.cardBgColor !== undefined) {
            setCardBgColorEnabled(gt.cardBgColor);
            saveCardBgColorEnabledToCookie(gt.cardBgColor);
          }
          if (gt.cardBorder !== undefined) {
            setCardBorderEnabled(gt.cardBorder);
            saveCardBorderEnabledToCookie(gt.cardBorder);
          }
          if (gt.headerGradient !== undefined) {
            setHeaderGradientEnabled(gt.headerGradient);
            saveHeaderGradientEnabledToCookie(gt.headerGradient);
          }
          if (gt.menuGradient !== undefined) {
            setMenuGradientEnabled(gt.menuGradient);
            saveMenuGradientEnabledToCookie(gt.menuGradient);
          }
          if (gt.footerGradient !== undefined) {
            setFooterGradientEnabled(gt.footerGradient);
            saveFooterGradientEnabledToCookie(gt.footerGradient);
          }
          if (gt.footerBgColor !== undefined) {
            setFooterBgColorEnabled(gt.footerBgColor);
            saveFooterBgColorEnabledToCookie(gt.footerBgColor);
          }
          if (gt.footerBorder !== undefined) {
            setFooterBorderEnabled(gt.footerBorder);
            saveFooterBorderEnabledToCookie(gt.footerBorder);
          }

          // Modal toggles
          if (gt.modalBorder !== undefined) {
            setModalBorderEnabled(gt.modalBorder);
            saveModalBorderEnabledToCookie(gt.modalBorder);
          }
          if (gt.modalGradient !== undefined) {
            setModalGradientEnabled(gt.modalGradient);
            saveModalGradientEnabledToCookie(gt.modalGradient);
          }
          if (gt.modalBgColor !== undefined) {
            setModalBgColorEnabled(gt.modalBgColor);
            saveModalBgColorEnabledToCookie(gt.modalBgColor);
          }

          // Secondary Card toggles
          if (gt.secondaryCardBorder !== undefined) {
            setSecondaryCardBorderEnabled(gt.secondaryCardBorder);
            saveSecondaryCardBorderEnabledToCookie(gt.secondaryCardBorder);
          }
          if (gt.secondaryCardGradient !== undefined) {
            setSecondaryCardGradientEnabled(gt.secondaryCardGradient);
            saveSecondaryCardGradientEnabledToCookie(gt.secondaryCardGradient);
          }
          if (gt.secondaryCardBgColor !== undefined) {
            setSecondaryCardBgColorEnabled(gt.secondaryCardBgColor);
            saveSecondaryCardBgColorEnabledToCookie(gt.secondaryCardBgColor);
          }

          // Specialty Card toggles
          if (gt.specialtyCardBorder !== undefined) {
            setSpecialtyCardBorderEnabled(gt.specialtyCardBorder);
            saveSpecialtyCardBorderEnabledToCookie(gt.specialtyCardBorder);
          }
          if (gt.specialtyCardGradient !== undefined) {
            setSpecialtyCardGradientEnabled(gt.specialtyCardGradient);
            saveSpecialtyCardGradientEnabledToCookie(gt.specialtyCardGradient);
          }
          if (gt.specialtyCardBgColor !== undefined) {
            setSpecialtyCardBgColorEnabled(gt.specialtyCardBgColor);
            saveSpecialtyCardBgColorEnabledToCookie(gt.specialtyCardBgColor);
          }

          // Inner Card toggles
          if (gt.innerCardBorder !== undefined) {
            setInnerCardBorderEnabled(gt.innerCardBorder);
            saveInnerCardBorderEnabledToCookie(gt.innerCardBorder);
          }
          if (gt.innerCardGradient !== undefined) {
            setInnerCardGradientEnabled(gt.innerCardGradient);
            saveInnerCardGradientEnabledToCookie(gt.innerCardGradient);
          }
          if (gt.innerCardBgColor !== undefined) {
            setInnerCardBgColorEnabled(gt.innerCardBgColor);
            saveInnerCardBgColorEnabledToCookie(gt.innerCardBgColor);
          }

          // Code Card toggles
          if (gt.codeCardBorder !== undefined) {
            setCodeCardBorderEnabled(gt.codeCardBorder);
            saveCodeCardBorderEnabledToCookie(gt.codeCardBorder);
          }
          if (gt.codeCardGradient !== undefined) {
            setCodeCardGradientEnabled(gt.codeCardGradient);
            saveCodeCardGradientEnabledToCookie(gt.codeCardGradient);
          }
          if (gt.codeCardBgColor !== undefined) {
            setCodeCardBgColorEnabled(gt.codeCardBgColor);
            saveCodeCardBgColorEnabledToCookie(gt.codeCardBgColor);
          }

          // Semantic Card toggles (Info, Error, Success, Warning)
          if (gt.infoCardBorder !== undefined) {
            setInfoCardBorderEnabled(gt.infoCardBorder);
            saveInfoCardBorderEnabledToCookie(gt.infoCardBorder);
          }
          if (gt.infoCardGradient !== undefined) {
            setInfoCardGradientEnabled(gt.infoCardGradient);
            saveInfoCardGradientEnabledToCookie(gt.infoCardGradient);
          }
          if (gt.infoCardBgColor !== undefined) {
            setInfoCardBgColorEnabled(gt.infoCardBgColor);
            saveInfoCardBgColorEnabledToCookie(gt.infoCardBgColor);
          }

          if (gt.errorCardBorder !== undefined) {
            setErrorCardBorderEnabled(gt.errorCardBorder);
            saveErrorCardBorderEnabledToCookie(gt.errorCardBorder);
          }
          if (gt.errorCardGradient !== undefined) {
            setErrorCardGradientEnabled(gt.errorCardGradient);
            saveErrorCardGradientEnabledToCookie(gt.errorCardGradient);
          }
          if (gt.errorCardBgColor !== undefined) {
            setErrorCardBgColorEnabled(gt.errorCardBgColor);
            saveErrorCardBgColorEnabledToCookie(gt.errorCardBgColor);
          }

          if (gt.successCardBorder !== undefined) {
            setSuccessCardBorderEnabled(gt.successCardBorder);
            saveSuccessCardBorderEnabledToCookie(gt.successCardBorder);
          }
          if (gt.successCardGradient !== undefined) {
            setSuccessCardGradientEnabled(gt.successCardGradient);
            saveSuccessCardGradientEnabledToCookie(gt.successCardGradient);
          }
          if (gt.successCardBgColor !== undefined) {
            setSuccessCardBgColorEnabled(gt.successCardBgColor);
            saveSuccessCardBgColorEnabledToCookie(gt.successCardBgColor);
          }

          if (gt.warningCardBorder !== undefined) {
            setWarningCardBorderEnabled(gt.warningCardBorder);
            saveWarningCardBorderEnabledToCookie(gt.warningCardBorder);
          }
          if (gt.warningCardGradient !== undefined) {
            setWarningCardGradientEnabled(gt.warningCardGradient);
            saveWarningCardGradientEnabledToCookie(gt.warningCardGradient);
          }
          if (gt.warningCardBgColor !== undefined) {
            setWarningCardBgColorEnabled(gt.warningCardBgColor);
            saveWarningCardBgColorEnabledToCookie(gt.warningCardBgColor);
          }

          // Inner Semantic Card toggles
          if (gt.innerInfoCardBorder !== undefined) {
            setInnerInfoCardBorderEnabled(gt.innerInfoCardBorder);
            saveInnerInfoCardBorderEnabledToCookie(gt.innerInfoCardBorder);
          }
          if (gt.innerInfoCardGradient !== undefined) {
            setInnerInfoCardGradientEnabled(gt.innerInfoCardGradient);
            saveInnerInfoCardGradientEnabledToCookie(gt.innerInfoCardGradient);
          }
          if (gt.innerInfoCardBgColor !== undefined) {
            setInnerInfoCardBgColorEnabled(gt.innerInfoCardBgColor);
            saveInnerInfoCardBgColorEnabledToCookie(gt.innerInfoCardBgColor);
          }

          if (gt.innerErrorCardBorder !== undefined) {
            setInnerErrorCardBorderEnabled(gt.innerErrorCardBorder);
            saveInnerErrorCardBorderEnabledToCookie(gt.innerErrorCardBorder);
          }
          if (gt.innerErrorCardGradient !== undefined) {
            setInnerErrorCardGradientEnabled(gt.innerErrorCardGradient);
            saveInnerErrorCardGradientEnabledToCookie(gt.innerErrorCardGradient);
          }
          if (gt.innerErrorCardBgColor !== undefined) {
            setInnerErrorCardBgColorEnabled(gt.innerErrorCardBgColor);
            saveInnerErrorCardBgColorEnabledToCookie(gt.innerErrorCardBgColor);
          }

          if (gt.innerSuccessCardBorder !== undefined) {
            setInnerSuccessCardBorderEnabled(gt.innerSuccessCardBorder);
            saveInnerSuccessCardBorderEnabledToCookie(gt.innerSuccessCardBorder);
          }
          if (gt.innerSuccessCardGradient !== undefined) {
            setInnerSuccessCardGradientEnabled(gt.innerSuccessCardGradient);
            saveInnerSuccessCardGradientEnabledToCookie(gt.innerSuccessCardGradient);
          }
          if (gt.innerSuccessCardBgColor !== undefined) {
            setInnerSuccessCardBgColorEnabled(gt.innerSuccessCardBgColor);
            saveInnerSuccessCardBgColorEnabledToCookie(gt.innerSuccessCardBgColor);
          }

          if (gt.innerWarningCardBorder !== undefined) {
            setInnerWarningCardBorderEnabled(gt.innerWarningCardBorder);
            saveInnerWarningCardBorderEnabledToCookie(gt.innerWarningCardBorder);
          }
          if (gt.innerWarningCardGradient !== undefined) {
            setInnerWarningCardGradientEnabled(gt.innerWarningCardGradient);
            saveInnerWarningCardGradientEnabledToCookie(gt.innerWarningCardGradient);
          }
          if (gt.innerWarningCardBgColor !== undefined) {
            setInnerWarningCardBgColorEnabled(gt.innerWarningCardBgColor);
            saveInnerWarningCardBgColorEnabledToCookie(gt.innerWarningCardBgColor);
          }
        }

        // Import UI settings (theme file format) or blur settings (legacy format)
        const rawUISettings = settings.uiSettings || settings.blurSettings;
        if (rawUISettings) {
          // Normalize property names for backwards compatibility
          const normalizedSettings: Partial<typeof uiSettings> = {
            ...rawUISettings,
          };

          // Handle legacy naming: headerBlurUseColor -> headerBlurUseBackgroundColor
          if ('headerBlurUseColor' in rawUISettings && !('headerBlurUseBackgroundColor' in rawUISettings)) {
            normalizedSettings.headerBlurUseBackgroundColor = rawUISettings.headerBlurUseColor;
          }
          // Handle legacy naming: menuBlurUseColor -> menuBlurUseBackgroundColor
          if ('menuBlurUseColor' in rawUISettings && !('menuBlurUseBackgroundColor' in rawUISettings)) {
            normalizedSettings.menuBlurUseBackgroundColor = rawUISettings.menuBlurUseColor;
          }

          // If opacity values exist but useOpacity flags don't, infer them
          if (rawUISettings.headerBlurOpacity !== undefined && rawUISettings.headerBlurUseOpacity === undefined) {
            normalizedSettings.headerBlurUseOpacity = rawUISettings.headerBlurOpacity > 0;
          }
          if (rawUISettings.menuBlurOpacity !== undefined && rawUISettings.menuBlurUseOpacity === undefined) {
            normalizedSettings.menuBlurUseOpacity = rawUISettings.menuBlurOpacity > 0;
          }
          if (rawUISettings.modalBlurOpacity !== undefined && rawUISettings.modalBlurUseOpacity === undefined) {
            normalizedSettings.modalBlurUseOpacity = rawUISettings.modalBlurOpacity > 0;
          }

          loadUISettings(normalizedSettings);
        }

        forceUpdate();
        const themeName = settings.name ? `"${settings.name}"` : 'Theme';
        toast.success(`${themeName} imported successfully`);
      } catch (err) {
        toast.error('Failed to import theme');
        console.error(err);
      }
    };
    input.click();
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-secondary-200 dark:border-secondary-800 mb-8 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t',
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 hover:border-secondary-300 dark:hover:border-secondary-600'
              )}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {activeTab === 'design-system' && (
          <div className="space-y-8">
            {/* Colors */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Color Palette
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Primary Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Primary Colors</CardTitle>
                    <CardDescription>Used for CTAs, links, and interactive elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'primary-50', color: 'bg-primary-50', text: 'text-primary-900' },
                        { name: 'primary-100', color: 'bg-primary-100', text: 'text-primary-900' },
                        { name: 'primary-500', color: 'bg-primary-500', text: 'text-white' },
                        { name: 'primary-600', color: 'bg-primary-600', text: 'text-white' },
                        { name: 'primary-700', color: 'bg-primary-700', text: 'text-white' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={cn('flex items-center justify-between p-3 rounded-md', item.color, item.text)}
                        >
                          <span className="font-mono text-sm">{item.name}</span>
                          <button
                            onClick={() => copyToClipboard(item.name, item.name)}
                            className="p-1 hover:bg-white/20 rounded"
                            aria-label={`Copy ${item.name}`}
                          >
                            {copied === item.name ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Secondary Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Secondary (Neutral) Colors</CardTitle>
                    <CardDescription>Used for text, borders, and backgrounds</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {[
                        { name: 'secondary-50', color: 'bg-secondary-50', text: 'text-secondary-900' },
                        { name: 'secondary-100', color: 'bg-secondary-100', text: 'text-secondary-900' },
                        { name: 'secondary-200', color: 'bg-secondary-200', text: 'text-secondary-900' },
                        { name: 'secondary-500', color: 'bg-secondary-500', text: 'text-white' },
                        { name: 'secondary-600', color: 'bg-secondary-600', text: 'text-white' },
                        { name: 'secondary-900', color: 'bg-secondary-900', text: 'text-white' },
                      ].map((item) => (
                        <div
                          key={item.name}
                          className={cn('flex items-center justify-between p-3 rounded-md', item.color, item.text)}
                        >
                          <span className="font-mono text-sm">{item.name}</span>
                          <button
                            onClick={() => copyToClipboard(item.name, item.name)}
                            className="p-1 hover:bg-white/20 rounded"
                            aria-label={`Copy ${item.name}`}
                          >
                            {copied === item.name ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Semantic Colors */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Semantic Colors</CardTitle>
                    <CardDescription>Used for status indicators and feedback</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Success</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-green-50 border border-green-200" />
                          <div className="w-10 h-10 rounded bg-green-500" />
                          <div className="w-10 h-10 rounded bg-green-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Warning</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-yellow-50 border border-yellow-200" />
                          <div className="w-10 h-10 rounded bg-yellow-500" />
                          <div className="w-10 h-10 rounded bg-yellow-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Error</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-red-50 border border-red-200" />
                          <div className="w-10 h-10 rounded bg-red-500" />
                          <div className="w-10 h-10 rounded bg-red-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Info</p>
                        <div className="flex gap-2">
                          <div className="w-10 h-10 rounded bg-blue-50 border border-blue-200" />
                          <div className="w-10 h-10 rounded bg-blue-500" />
                          <div className="w-10 h-10 rounded bg-blue-700" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Typography */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Type className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Typography
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h1 className="text-4xl font-bold">Heading 1</h1>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-4xl font-bold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h2 className="text-3xl font-bold">Heading 2</h2>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-3xl font-bold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <h3 className="text-2xl font-semibold">Heading 3</h3>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-2xl font-semibold</code>
                    </div>
                    <div className="flex items-baseline justify-between border-b border-secondary-100 dark:border-secondary-800 pb-4">
                      <p className="text-base">Body Text (Base)</p>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-base</code>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <p className="text-xs text-secondary-500">Caption / Helper Text</p>
                      <code className="text-xs bg-secondary-100 dark:bg-secondary-800 dark:text-secondary-300 px-2 py-1 rounded">text-xs text-secondary-500</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'components' && (
          <div className="space-y-8">
            {/* Buttons */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <MousePointer className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Buttons
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Button Variants</CardTitle>
                  <CardDescription>Use appropriate variants based on action priority</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <Button>Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button size="sm">Small</Button>
                      <Button size="default">Default</Button>
                      <Button size="lg">Large</Button>
                      <Button size="xl">Extra Large</Button>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button disabled>Disabled</Button>
                      <Button>
                        <Mail className="w-4 h-4 mr-2" aria-hidden="true" />
                        With Icon
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Badges */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Badges</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-wrap gap-4">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Form Inputs */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Form Inputs</h2>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="example-input">Input Label</Label>
                      <Input id="example-input" placeholder="Enter text..." />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Helper text goes here</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="example-input-error">Input with Error</Label>
                      <Input
                        id="example-input-error"
                        placeholder="Invalid input"
                        className="border-red-500 focus-visible:ring-red-500"
                        aria-invalid="true"
                      />
                      <p className="text-xs text-red-600 dark:text-red-400">This field is required</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="example-textarea">Textarea</Label>
                    <Textarea id="example-textarea" placeholder="Enter longer text..." rows={3} />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Page Scroll Modal */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Page Scroll Modal
              </h2>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-6">
                For modals with tall content that exceeds the viewport height. Uses the browser&apos;s native scrollbar on the page edge instead of an internal scrollbar. Works correctly in Firefox.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2 mb-3">
                      <ScrollText className="w-5 h-5 text-primary-500" />
                      <h3 className="font-semibold text-secondary-900 dark:text-secondary-100">Scrollable Modal Demo</h3>
                    </div>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">
                      Opens a modal with content taller than the viewport. Scrollbar appears on the right edge of the browser window. Click outside to close.
                    </p>
                    <Button className="w-full" onClick={() => setPageScrollOpen(true)}>
                      <ScrollText className="w-4 h-4" />
                      Open Page Scroll Modal
                    </Button>
                    <Dialog open={pageScrollOpen} onOpenChange={setPageScrollOpen} pageScroll>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Page Scroll Modal Example
                          </DialogTitle>
                          <DialogDescription>
                            This modal demonstrates the pageScroll pattern for tall content.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 1: Overview</h4>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                              The pageScroll prop changes how the modal handles overflow. Instead of scrolling inside the modal, the entire page becomes scrollable with the scrollbar on the browser edge.
                            </p>
                          </div>

                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 2: How It Works</h4>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                              The Dialog container becomes a fixed, full-screen scrollable container. The actual modal card is centered inside with min-h-screen on the wrapper.
                            </p>
                            <ul className="text-sm text-secondary-500 dark:text-secondary-400 space-y-1 list-disc list-inside">
                              <li>Fixed container with inset-0 and overflow-y-auto</li>
                              <li>Inner wrapper uses min-h-screen for proper scrolling</li>
                              <li>Body scroll stays enabled instead of locked</li>
                              <li>Click outside modal to close (stopPropagation on card)</li>
                            </ul>
                          </div>

                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 3: When to Use</h4>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                              Use pageScroll for forms with many fields, settings panels, or any modal where content naturally exceeds viewport height. This provides better UX than internal scrolling, especially on Firefox where overlay scrollbars can be hidden.
                            </p>
                          </div>

                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 4: Form Example</h4>
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Name</label>
                                <Input placeholder="Enter name" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Email</label>
                                <Input type="email" placeholder="your@email.com" />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Description</label>
                                <Textarea rows={3} placeholder="Enter description" />
                              </div>
                            </div>
                          </div>

                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 5: Additional Content</h4>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400">
                              This section exists to ensure there&apos;s enough content to require scrolling. The scrollbar should appear on the right edge of the viewport, not inside the modal.
                            </p>
                          </div>

                          <div className="p-4 bg-secondary-50 dark:bg-secondary-800 rounded-lg">
                            <h4 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-2">Section 6: Even More Content</h4>
                            <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                              Scroll down to see the action buttons at the bottom. The scrollbar should be clearly visible in all browsers including Firefox.
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-white dark:bg-secondary-900 rounded text-center">
                                <div className="text-2xl font-bold text-primary-500">42</div>
                                <div className="text-xs text-secondary-500 dark:text-secondary-400">Items</div>
                              </div>
                              <div className="p-3 bg-white dark:bg-secondary-900 rounded text-center">
                                <div className="text-2xl font-bold text-primary-500">100%</div>
                                <div className="text-xs text-secondary-500 dark:text-secondary-400">Complete</div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                            <Button variant="outline" onClick={() => setPageScrollOpen(false)} className="flex-1">
                              Cancel
                            </Button>
                            <Button onClick={() => { toast.success("Saved!"); setPageScrollOpen(false); }} className="flex-1">
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-3">Implementation</h3>
                    <pre className="text-xs bg-secondary-50 dark:bg-secondary-800 p-3 rounded overflow-x-auto whitespace-pre-wrap text-secondary-700 dark:text-secondary-300">
{`<Dialog pageScroll>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
    </DialogHeader>
    {/* Tall content here */}
  </DialogContent>
</Dialog>`}
                    </pre>
                    <div className="mt-4 p-3 bg-secondary-50 dark:bg-secondary-800 rounded">
                      <h4 className="font-medium text-sm text-secondary-900 dark:text-secondary-100 mb-2">Key Features:</h4>
                      <ul className="text-xs text-secondary-500 dark:text-secondary-400 space-y-1">
                        <li>- Browser-native scrollbar on viewport edge</li>
                        <li>- Works correctly in Firefox</li>
                        <li>- Click outside to close</li>
                        <li>- Keyboard accessible (Esc to close)</li>
                        <li>- No custom CSS required</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-8">
            {/* Loading States */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Loading States</h2>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skeleton Loading</CardTitle>
                  <CardDescription>Use skeletons to indicate loading content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 animate-pulse">
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-3/4" />
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-1/2" />
                    <div className="h-4 bg-secondary-200 dark:bg-secondary-700 rounded w-5/6" />
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Empty States */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4">Empty States</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-12 border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg">
                    <div className="mx-auto w-12 h-12 bg-secondary-100 dark:bg-secondary-800 rounded-full flex items-center justify-center mb-4">
                      <FileText className="w-6 h-6 text-secondary-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-1">No items yet</h3>
                    <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4">Get started by creating your first item</p>
                    <Button>
                      <Sparkles className="w-4 h-4 mr-2" aria-hidden="true" />
                      Create Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'chatbots' && (
          <div className="space-y-8" id="chatbots">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Chatbot Integration SDK
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    Embed AI-powered chatbots on any website with our JavaScript SDK. The SDK provides a
                    floating chat widget that handles conversations, session management, and responsive
                    behavior automatically.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <Zap className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Quick Setup</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">Add 2 lines of code to any website</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Globe className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Fully Responsive</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">Works on desktop, tablet, and mobile</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Settings className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100 text-sm">Customizable</p>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">Match your brand colors and style</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* JavaScript SDK */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary-500" aria-hidden="true" />
                JavaScript SDK
                <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-xs">
                  Recommended
                </Badge>
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Basic Installation</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'YOUR_CHATBOT_ID'
  });
</script>`, 'chatbot-basic')}
                        className="h-7"
                      >
                        {copied === 'chatbot-basic' ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">html</span>
                      </div>
                      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                        <code>{`<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'YOUR_CHATBOT_ID'
  });
</script>`}</code>
                      </pre>
                    </div>
                    <div className="mt-3 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                      <div className="flex items-start gap-2">
                        <FileCode className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Where to place this code</p>
                          <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                            Add these script tags just before the closing <code className="bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded text-[11px]">&lt;/body&gt;</code> tag
                            in your HTML file. This ensures the page loads before the widget initializes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">With Custom Options</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'YOUR_CHATBOT_ID',
    position: 'bottom-right',     // or 'bottom-left'
    primaryColor: '#6366f1',      // Match your brand
    greeting: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    autoOpen: false,              // Don't open on page load
    showOnMobile: true,           // Show on mobile devices
    zIndex: 9999                  // CSS z-index value
  });
</script>`, 'chatbot-advanced')}
                        className="h-7"
                      >
                        {copied === 'chatbot-advanced' ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">html</span>
                      </div>
                      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                        <code>{`<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'YOUR_CHATBOT_ID',
    position: 'bottom-right',     // or 'bottom-left'
    primaryColor: '#6366f1',      // Match your brand
    greeting: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
    autoOpen: false,              // Don't open on page load
    showOnMobile: true,           // Show on mobile devices
    zIndex: 9999                  // CSS z-index value
  });
</script>`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Configuration Options Table */}
                  <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Configuration Options</p>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-secondary-200 dark:border-secondary-700">
                            <th className="text-left py-2 pr-4 font-medium text-secondary-900 dark:text-secondary-100">Option</th>
                            <th className="text-left py-2 pr-4 font-medium text-secondary-900 dark:text-secondary-100">Type</th>
                            <th className="text-left py-2 pr-4 font-medium text-secondary-900 dark:text-secondary-100">Default</th>
                            <th className="text-left py-2 font-medium text-secondary-900 dark:text-secondary-100">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800">
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">chatbotId</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">string</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">Required</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Your chatbot's unique identifier</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">position</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">string</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">'bottom-right'</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Widget position: 'bottom-right' or 'bottom-left'</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">primaryColor</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">string</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">'#6366f1'</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Hex color for the chat button and accents</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">greeting</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">string</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">null</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Initial greeting message shown to users</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">autoOpen</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">boolean</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">false</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Automatically open chat on page load</td>
                          </tr>
                          <tr>
                            <td className="py-2 pr-4"><code className="text-xs bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">showOnMobile</code></td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">boolean</td>
                            <td className="py-2 pr-4 text-secondary-600 dark:text-secondary-400">true</td>
                            <td className="py-2 text-secondary-600 dark:text-secondary-400">Display widget on mobile devices</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* iFrame Embed */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-secondary-500" aria-hidden="true" />
                iFrame Embed
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Use an iFrame when you want to embed the chat in a specific location on your page,
                    such as a dedicated support section, rather than as a floating widget.
                  </p>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">html</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`<iframe
  src="https://your-domain.com/widget/YOUR_CHATBOT_ID"
  style="border:none;position:fixed;bottom:20px;right:20px;width:400px;height:600px;z-index:9999;"
  allow="clipboard-write"
></iframe>`, 'chatbot-iframe')}
                        className="h-7"
                      >
                        {copied === 'chatbot-iframe' ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <pre className="pt-4 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                      <code>{`<iframe
  src="https://your-domain.com/widget/YOUR_CHATBOT_ID"
  style="border:none;position:fixed;bottom:20px;right:20px;width:400px;height:600px;z-index:9999;"
  allow="clipboard-write"
></iframe>`}</code>
                    </pre>
                  </div>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Tip:</strong> Remove <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs">position:fixed</code> from
                        the style attribute to embed the chat inline within your page layout.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* REST API */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-500" aria-hidden="true" />
                REST API
              </h3>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Use the REST API for server-side integrations, custom chat interfaces, mobile apps,
                    or to connect your chatbot to other services like Slack or Discord.
                  </p>

                  {/* Endpoint */}
                  <div>
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">API Endpoint</p>
                    <div className="flex items-center gap-3 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-mono text-xs">POST</Badge>
                      <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200">https://your-domain.com/api/chat/YOUR_CHATBOT_ID</code>
                    </div>
                  </div>

                  {/* Request Body */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Request Body</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`{
  "message": "Hello, I have a question",
  "session_id": "unique-session-id"
}`, 'chatbot-request')}
                        className="h-7"
                      >
                        {copied === 'chatbot-request' ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">json</span>
                      </div>
                      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                        <code>{`{
  "message": "Hello, I have a question",
  "session_id": "unique-session-id"
}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* cURL Example */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">cURL Example</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(`curl -X POST "https://your-domain.com/api/chat/YOUR_CHATBOT_ID" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hello, I have a question",
    "session_id": "unique-session-id"
  }'`, 'chatbot-curl')}
                        className="h-7"
                      >
                        {copied === 'chatbot-curl' ? (
                          <><Check className="w-3.5 h-3.5 mr-1.5" /> Copied</>
                        ) : (
                          <><Copy className="w-3.5 h-3.5 mr-1.5" /> Copy</>
                        )}
                      </Button>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">bash</span>
                      </div>
                      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                        <code>{`curl -X POST "https://your-domain.com/api/chat/YOUR_CHATBOT_ID" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hello, I have a question",
    "session_id": "unique-session-id"
  }'`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Response</p>
                    </div>
                    <div className="relative">
                      <div className="absolute top-2 left-3">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500">json</span>
                      </div>
                      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800">
                        <code>{`{
  "success": true,
  "data": {
    "message": "I'd be happy to help! What would you like to know?",
    "session_id": "unique-session-id"
  }
}`}</code>
                      </pre>
                    </div>
                  </div>

                  {/* API Key Warning */}
                  <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Security</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        Never expose your API key in client-side code. The API is designed for server-to-server
                        communication. For browser-based integrations, use the JavaScript SDK instead.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Platform Integration Guides */}
            <section>
              <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" aria-hidden="true" />
                Platform Integration Guides
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100">WordPress</h4>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Add to theme footer or use a plugin</p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Add the SDK code to your theme's <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-xs">footer.php</code> file,
                      or use a plugin like "Insert Headers and Footers" to inject the scripts.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 0 1-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 0 0-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 0 0-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 0 1-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 0 1-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 0 1 .174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 0 0 4.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 0 0 2.466-2.163 11.944 11.944 0 0 0 2.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 0 0-2.499-.523A33.119 33.119 0 0 0 11.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 0 1 .237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 0 1 .233-.296c.096-.05.13-.054.5-.054z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Next.js / React</h4>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Add via Script component</p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Use Next.js <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-xs">Script</code> component in your
                      layout or _app file with <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-xs">strategy="lazyOnload"</code>.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Shopify</h4>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Add to theme.liquid</p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      In your Shopify admin, go to Online Store → Themes → Edit code, then add the SDK
                      scripts before <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-xs">&lt;/body&gt;</code> in theme.liquid.
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary-300 dark:hover:border-primary-700 transition-colors">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                        <svg className="w-5 h-5 text-orange-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M11.77 11.24H9.956V8.202h2.152c1.17 0 1.834.522 1.834 1.466 0 1.008-.773 1.572-2.174 1.572zm.324 1.206H9.957v3.348h2.231c1.459 0 2.232-.585 2.232-1.685s-.795-1.663-2.326-1.663zM24 11.39v1.218c-1.128.108-1.817.944-2.226 2.268-.407 1.319-.463 2.937-.42 4.186.045 1.3-.968 2.5-2.337 2.5H4.985c-1.37 0-2.383-1.2-2.337-2.5.043-1.249-.013-2.867-.42-4.186-.41-1.324-1.1-2.16-2.228-2.268V11.39c1.128-.108 1.819-.944 2.227-2.268.408-1.319.464-2.937.42-4.186-.045-1.3.968-2.5 2.338-2.5h14.032c1.37 0 2.382 1.2 2.337 2.5-.043 1.249.013 2.867.42 4.186.409 1.324 1.098 2.16 2.226 2.268zm-7.927 2.817c0-1.354-.953-2.333-2.368-2.488v-.057c1.04-.169 1.856-1.135 1.856-2.213 0-1.537-1.213-2.538-3.062-2.538h-4.16v10.172h4.181c2.218 0 3.553-1.086 3.553-2.876z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-secondary-900 dark:text-secondary-100">Webflow</h4>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Use custom code embed</p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Go to Project Settings → Custom Code → Footer Code, and paste the SDK scripts.
                      Or use an Embed element on specific pages.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'accessibility' && (
          <div className="space-y-8">
            {/* Overview */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Accessibility Standards
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-secondary-600 dark:text-secondary-400 mb-4">
                    We follow WCAG 2.1 AA guidelines. All components must meet these requirements:
                  </p>
                  <ul className="space-y-2">
                    {[
                      'Color contrast ratio >= 4.5:1 for normal text',
                      'Color contrast ratio >= 3:1 for large text (18px+ or 14px bold)',
                      'Interactive elements have visible focus states',
                      'Touch targets minimum 44x44px',
                      'Color is not the only indicator of state',
                      'All images have alt text',
                      'Forms have associated labels',
                      'Error messages use aria-live regions',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            {/* Mobile */}
            <section>
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100 mb-4 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary-500" aria-hidden="true" />
                Mobile Considerations
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <ul className="space-y-2">
                    {[
                      'Touch targets minimum 44x44px (min-h-[44px] min-w-[44px])',
                      'Adequate spacing between interactive elements',
                      'Responsive layouts that work on all screen sizes',
                      'No horizontal scrolling on mobile viewports',
                      'Forms work with mobile keyboards (correct input types)',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-secondary-700 dark:text-secondary-300">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>
          </div>
        )}

        {activeTab === 'ui-settings' && (
          <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 dark:text-secondary-100">
                  UI Settings
                </h2>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Customize colors, gradients, and visual effects
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportSettings}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Theme
                </Button>
                <Button variant="outline" size="sm" onClick={handleImportSettings}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Theme
                </Button>
                <Button variant="outline" size="sm" onClick={handleResetAll}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset All
                </Button>
              </div>
            </div>

            {/* Page & Layout */}
            <SectionGroup title="Page & Layout">
              {/* Page Background Section */}
              <Subsection
                title="Page Background"
                icon={Layout}
                onReset={() => {
                  handleResetGroup('Page', lightVars.page, darkVars.page);
                  handleResetGroup('Page Gradient', lightVars.gradient, darkVars.gradient);
                  setPageGradientEnabled(true);
                  saveGradientEnabledToCookie(true);
                  setPageBgColorEnabled(true);
                  savePageBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                {/* Use Background Gradient Toggle with inline color pickers */}
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Use Background Gradient</Label>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to page background</p>
                    </div>
                    <ToggleSwitch
                      label=""
                      checked={pageGradientEnabled}
                      onChange={(v) => {
                        setPageGradientEnabled(v);
                        saveGradientEnabledToCookie(v);
                      }}
                    />
                  </div>
                  <AnimatedCollapse isOpen={pageGradientEnabled}>
                    <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                        Gradient Colors
                      </p>
                      <DualModeVariables lightVars={lightVars.gradient} darkVars={darkVars.gradient} updateKey={updateKey} onUpdate={forceUpdate} />
                    </div>
                  </AnimatedCollapse>
                </div>

                {/* Use Background Color Toggle with inline color picker */}
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm">Use Background Color</Label>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to page background</p>
                    </div>
                    <ToggleSwitch
                      label=""
                      checked={pageBgColorEnabled}
                      onChange={(v) => {
                        setPageBgColorEnabled(v);
                        savePageBgColorEnabledToCookie(v);
                      }}
                    />
                  </div>
                  <AnimatedCollapse isOpen={pageBgColorEnabled}>
                    <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                        Background Color
                      </p>
                      <DualModeVariables lightVars={lightVars.page} darkVars={darkVars.page} updateKey={updateKey} onUpdate={forceUpdate} />
                    </div>
                  </AnimatedCollapse>
                </div>
                </div>
              </Subsection>

              {/* Header Toolbar Section */}
              <Subsection
                title="Header Toolbar"
                icon={PanelTop}
                onReset={() => {
                  handleResetGroup('Header', lightVars.header, darkVars.header);
                  handleResetGroup('Header Gradient', lightVars.headerGradient, darkVars.headerGradient);
                  updateHeaderBlurEnabled(true);
                  updateBackdropBlur('md');
                  updateHeaderBlurUseOpacity(true);
                  updateHeaderBlurOpacity(85);
                  updateHeaderBlurUseBackgroundColor(true);
                  updateHeaderBlurUseGradient(false);
                  updateHeaderBorderEnabled(true);
                }}
              >
                {/* Header Blur Settings */}
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Blur Preview - Always visible */}
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-purple-500 to-pink-500">
                      <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-full" />
                        <div className="w-16 h-16 bg-white/20 rounded-lg rotate-12" />
                        <div className="w-10 h-10 bg-white/25 rounded-full" />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "absolute inset-x-0 top-0 h-12 flex items-center justify-center text-xs font-medium",
                        uiSettings.headerBlurEnabled && uiSettings.backdropBlur !== 'none' && (
                          uiSettings.backdropBlur === 'sm' ? 'backdrop-blur-sm' :
                          uiSettings.backdropBlur === 'md' ? 'backdrop-blur-md' :
                          uiSettings.backdropBlur === 'lg' ? 'backdrop-blur-lg' :
                          uiSettings.backdropBlur === 'xl' ? 'backdrop-blur-xl' :
                          uiSettings.backdropBlur === '2xl' ? 'backdrop-blur-2xl' :
                          'backdrop-blur-3xl'
                        ),
                        'text-white'
                      )}
                      style={(() => {
                        const opacity = uiSettings.headerBlurUseOpacity ? uiSettings.headerBlurOpacity / 100 : 0;
                        if (uiSettings.headerBlurUseGradient) {
                          return {
                            backgroundImage: `linear-gradient(to right, rgba(99, 102, 241, ${opacity}), rgba(168, 85, 247, ${opacity}))`,
                            backgroundColor: 'transparent',
                          };
                        }
                        const bgColor = uiSettings.headerBlurUseBackgroundColor
                          ? `rgba(99, 102, 241, ${opacity})`
                          : `rgba(255, 255, 255, ${opacity})`;
                        return {
                          backgroundImage: 'none',
                          backgroundColor: bgColor,
                        };
                      })()}
                    >
                      Header Preview {uiSettings.headerBlurEnabled ? `(blur: ${uiSettings.backdropBlur})` : '(no blur)'}
                    </div>
                  </div>

                  {/* Blur Intensity with toggle on right */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Blur Intensity</Label>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.headerBlurEnabled}
                        onChange={updateHeaderBlurEnabled}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.headerBlurEnabled}>
                      <div className="flex flex-wrap gap-2">
                        {(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as BackdropBlurValue[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => updateBackdropBlur(level)}
                            className={cn(
                              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                              uiSettings.backdropBlur === level
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Opacity Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Opacity</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply opacity to background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.headerBlurUseOpacity}
                        onChange={updateHeaderBlurUseOpacity}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.headerBlurUseOpacity}>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Opacity</Label>
                          <span className="text-sm font-mono text-secondary-500 dark:text-secondary-400">{uiSettings.headerBlurOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={uiSettings.headerBlurOpacity}
                          onChange={(e) => updateHeaderBlurOpacity(Number(e.target.value))}
                          className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-secondary-400 mt-1">
                          <span>Transparent</span>
                          <span>Opaque</span>
                        </div>
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show bottom border on header</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.headerBorderEnabled}
                        onChange={updateHeaderBorderEnabled}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.headerBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.header.filter(v => v.name === '--header-border')}
                          darkVars={darkVars.header.filter(v => v.name === '--header-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show gradient behind blur</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.headerBlurUseGradient}
                        onChange={updateHeaderBlurUseGradient}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.headerBlurUseGradient}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.headerGradient}
                          darkVars={darkVars.headerGradient}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show theme color behind blur</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.headerBlurUseBackgroundColor}
                        onChange={updateHeaderBlurUseBackgroundColor}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.headerBlurUseBackgroundColor}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.header.filter(v => v.name === '--header-bg')}
                          darkVars={darkVars.header.filter(v => v.name === '--header-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>
                </div>
              </Subsection>

              {/* Menu Section */}
              <Subsection
                title="Hamburger Menu"
                icon={Menu}
                onReset={() => {
                  handleResetGroup('Menu', lightVars.menu, darkVars.menu);
                  handleResetGroup('Menu Gradient', lightVars.menuGradient, darkVars.menuGradient);
                  updateMenuBlurEnabled(true);
                  updateMenuBlurIntensity('md');
                  updateMenuBlurUseOpacity(true);
                  updateMenuBlurOpacity(85);
                  updateMenuBlurUseBackgroundColor(true);
                  updateMenuBlurUseGradient(false);
                  updateMenuBorderEnabled(true);
                }}
              >
                {/* Menu Blur Settings */}
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Blur Preview - Always visible */}
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500">
                      <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-full" />
                        <div className="w-16 h-16 bg-white/20 rounded-lg rotate-12" />
                        <div className="w-10 h-10 bg-white/25 rounded-full" />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 w-1/2 flex items-center justify-center text-xs font-medium",
                        uiSettings.menuBlurEnabled && uiSettings.menuBlurIntensity !== 'none' && (
                          uiSettings.menuBlurIntensity === 'sm' ? 'backdrop-blur-sm' :
                          uiSettings.menuBlurIntensity === 'md' ? 'backdrop-blur-md' :
                          uiSettings.menuBlurIntensity === 'lg' ? 'backdrop-blur-lg' :
                          uiSettings.menuBlurIntensity === 'xl' ? 'backdrop-blur-xl' :
                          uiSettings.menuBlurIntensity === '2xl' ? 'backdrop-blur-2xl' :
                          'backdrop-blur-3xl'
                        ),
                        'text-white'
                      )}
                      style={(() => {
                        const opacity = uiSettings.menuBlurUseOpacity ? uiSettings.menuBlurOpacity / 100 : 0;
                        if (uiSettings.menuBlurUseGradient) {
                          return {
                            backgroundImage: `linear-gradient(to bottom, rgba(16, 185, 129, ${opacity}), rgba(6, 182, 212, ${opacity}))`,
                            backgroundColor: 'transparent',
                          };
                        }
                        const bgColor = uiSettings.menuBlurUseBackgroundColor
                          ? `rgba(16, 185, 129, ${opacity})`
                          : `rgba(255, 255, 255, ${opacity})`;
                        return {
                          backgroundImage: 'none',
                          backgroundColor: bgColor,
                        };
                      })()}
                    >
                      Menu Preview {uiSettings.menuBlurEnabled ? `(blur: ${uiSettings.menuBlurIntensity})` : '(no blur)'}
                    </div>
                  </div>

                  {/* Blur Intensity with toggle on right */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Blur Intensity</Label>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.menuBlurEnabled}
                        onChange={updateMenuBlurEnabled}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.menuBlurEnabled}>
                      <div className="flex flex-wrap gap-2">
                        {(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as BackdropBlurValue[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => updateMenuBlurIntensity(level)}
                            className={cn(
                              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                              uiSettings.menuBlurIntensity === level
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Opacity Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Opacity</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply opacity to background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.menuBlurUseOpacity}
                        onChange={updateMenuBlurUseOpacity}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.menuBlurUseOpacity}>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Opacity</Label>
                          <span className="text-sm font-mono text-secondary-500 dark:text-secondary-400">{uiSettings.menuBlurOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={uiSettings.menuBlurOpacity}
                          onChange={(e) => updateMenuBlurOpacity(Number(e.target.value))}
                          className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-secondary-400 mt-1">
                          <span>Transparent</span>
                          <span>Opaque</span>
                        </div>
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show bottom border on menu</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.menuBorderEnabled}
                        onChange={updateMenuBorderEnabled}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.menuBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.menu.filter(v => v.name === '--menu-border')}
                          darkVars={darkVars.menu.filter(v => v.name === '--menu-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show gradient behind blur</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.menuBlurUseGradient}
                        onChange={updateMenuBlurUseGradient}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.menuBlurUseGradient}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.menuGradient}
                          darkVars={darkVars.menuGradient}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Show theme color behind blur</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.menuBlurUseBackgroundColor}
                        onChange={updateMenuBlurUseBackgroundColor}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.menuBlurUseBackgroundColor}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.menu.filter(v => v.name === '--menu-bg')}
                          darkVars={darkVars.menu.filter(v => v.name === '--menu-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>
                </div>
              </Subsection>

              {/* Footer Section */}
              <Subsection
                title="Footer"
                icon={Layout}
                onReset={() => {
                  handleResetGroup('Footer', lightVars.footer, darkVars.footer);
                  handleResetGroup('Footer Gradient', lightVars.footerGradient, darkVars.footerGradient);
                  setFooterGradientEnabled(false);
                  saveFooterGradientEnabledToCookie(false);
                  setFooterBgColorEnabled(true);
                  saveFooterBgColorEnabledToCookie(true);
                  setFooterBorderEnabled(true);
                  saveFooterBorderEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border at top of footer</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={footerBorderEnabled}
                        onChange={(v) => {
                          setFooterBorderEnabled(v);
                          saveFooterBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={footerBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.footer.filter(v => v.name === '--footer-border')}
                          darkVars={darkVars.footer.filter(v => v.name === '--footer-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to footer background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={footerGradientEnabled}
                        onChange={(v) => {
                          setFooterGradientEnabled(v);
                          saveFooterGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={footerGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables lightVars={lightVars.footerGradient} darkVars={darkVars.footerGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to footer background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={footerBgColorEnabled}
                        onChange={(v) => {
                          setFooterBgColorEnabled(v);
                          saveFooterBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={footerBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.footer.filter(v => v.name === '--footer-bg')}
                          darkVars={darkVars.footer.filter(v => v.name === '--footer-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Text */}
            <SectionGroup title="Text">
              <Subsection
                title="Text Colors"
                icon={Type}
                onReset={() => handleResetGroup('Text', lightVars.text, darkVars.text)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.text} darkVars={darkVars.text} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Inner Text Colors"
                icon={Type}
                onReset={() => handleResetGroup('Inner Text', lightVars.innerText, darkVars.innerText)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.innerText} darkVars={darkVars.innerText} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Footer Text Colors"
                icon={Type}
                onReset={() => handleResetGroup('Footer Text', lightVars.footerText, darkVars.footerText)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.footerText} darkVars={darkVars.footerText} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>
            </SectionGroup>

            {/* Cards */}
            <SectionGroup title="Cards">
              {/* Card Section */}
              <Subsection
                title="Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Card', lightVars.card, darkVars.card);
                  handleResetGroup('Card Gradient', lightVars.cardGradient, darkVars.cardGradient);
                  setCardGradientEnabled(false);
                  saveCardGradientEnabledToCookie(false);
                  setCardBgColorEnabled(true);
                  saveCardBgColorEnabledToCookie(true);
                  setCardBorderEnabled(true);
                  saveCardBorderEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={cardBorderEnabled}
                        onChange={(v) => {
                          setCardBorderEnabled(v);
                          saveCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={cardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.card.filter(v => v.name === '--card-border')}
                          darkVars={darkVars.card.filter(v => v.name === '--card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={cardGradientEnabled}
                        onChange={(v) => {
                          setCardGradientEnabled(v);
                          saveCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={cardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables lightVars={lightVars.cardGradient} darkVars={darkVars.cardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={cardBgColorEnabled}
                        onChange={(v) => {
                          setCardBgColorEnabled(v);
                          saveCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={cardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.card.filter(v => v.name === '--card-bg')}
                          darkVars={darkVars.card.filter(v => v.name === '--card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Modals */}
            <SectionGroup title="Modals">
              <Subsection
                title="Modal"
                icon={Layout}
                onReset={() => {
                  handleResetGroup('Modal', lightVars.modal, darkVars.modal);
                  handleResetGroup('Modal Gradient', lightVars.modalGradient, darkVars.modalGradient);
                  updateModalBlurEnabled(true);
                  updateModalBlurIntensity('md');
                  updateModalBlurUseOpacity(true);
                  updateModalBlurOpacity(50);
                  setModalBorderEnabled(true);
                  saveModalBorderEnabledToCookie(true);
                  setModalGradientEnabled(false);
                  saveModalGradientEnabledToCookie(false);
                  setModalBgColorEnabled(true);
                  saveModalBgColorEnabledToCookie(true);
                }}
              >
                {/* Modal Blur Settings */}
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Blur Preview - Always visible */}
                  <div className="relative h-24 rounded-lg overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500">
                      <div className="absolute inset-0 flex items-center justify-center gap-4">
                        <div className="w-12 h-12 bg-white/30 rounded-full" />
                        <div className="w-16 h-16 bg-white/20 rounded-lg rotate-12" />
                        <div className="w-10 h-10 bg-white/25 rounded-full" />
                      </div>
                    </div>
                    <div
                      className={cn(
                        "absolute inset-4 rounded-lg flex items-center justify-center text-xs font-medium",
                        uiSettings.modalBlurEnabled && uiSettings.modalBlurIntensity !== 'none' && (
                          uiSettings.modalBlurIntensity === 'sm' ? 'backdrop-blur-sm' :
                          uiSettings.modalBlurIntensity === 'md' ? 'backdrop-blur-md' :
                          uiSettings.modalBlurIntensity === 'lg' ? 'backdrop-blur-lg' :
                          uiSettings.modalBlurIntensity === 'xl' ? 'backdrop-blur-xl' :
                          uiSettings.modalBlurIntensity === '2xl' ? 'backdrop-blur-2xl' :
                          'backdrop-blur-3xl'
                        ),
                        'text-white'
                      )}
                      style={(() => {
                        const opacity = uiSettings.modalBlurUseOpacity ? uiSettings.modalBlurOpacity / 100 : 0;
                        return {
                          backgroundImage: 'none',
                          backgroundColor: `rgba(0, 0, 0, ${opacity})`,
                        };
                      })()}
                    >
                      Modal Backdrop Preview {uiSettings.modalBlurEnabled ? `(blur: ${uiSettings.modalBlurIntensity})` : '(no blur)'}
                    </div>
                  </div>

                  {/* Blur Intensity with toggle on right */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm">Blur Intensity</Label>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.modalBlurEnabled}
                        onChange={updateModalBlurEnabled}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.modalBlurEnabled}>
                      <div className="flex flex-wrap gap-2">
                        {(['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as BackdropBlurValue[]).map((level) => (
                          <button
                            key={level}
                            onClick={() => updateModalBlurIntensity(level)}
                            className={cn(
                              'px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                              uiSettings.modalBlurIntensity === level
                                ? 'bg-primary-500 text-white'
                                : 'bg-secondary-100 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-400 hover:bg-secondary-200 dark:hover:bg-secondary-600'
                            )}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Opacity Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Background Opacity</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply opacity to modal backdrop</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={uiSettings.modalBlurUseOpacity}
                        onChange={updateModalBlurUseOpacity}
                      />
                    </div>
                    <AnimatedCollapse isOpen={uiSettings.modalBlurUseOpacity}>
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm">Opacity</Label>
                          <span className="text-sm font-mono text-secondary-500 dark:text-secondary-400">{uiSettings.modalBlurOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={uiSettings.modalBlurOpacity}
                          onChange={(e) => updateModalBlurOpacity(Number(e.target.value))}
                          className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                        />
                        <div className="flex justify-between text-xs text-secondary-400 mt-1">
                          <span>Transparent</span>
                          <span>Opaque</span>
                        </div>
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around modal</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={modalBorderEnabled}
                        onChange={(v) => {
                          setModalBorderEnabled(v);
                          saveModalBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={modalBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.modal.filter(v => v.name === '--modal-border')}
                          darkVars={darkVars.modal.filter(v => v.name === '--modal-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to modal background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={modalGradientEnabled}
                        onChange={(v) => {
                          setModalGradientEnabled(v);
                          saveModalGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={modalGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables lightVars={lightVars.modalGradient} darkVars={darkVars.modalGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to modal background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={modalBgColorEnabled}
                        onChange={(v) => {
                          setModalBgColorEnabled(v);
                          saveModalBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={modalBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.modal.filter(v => v.name === '--modal-bg')}
                          darkVars={darkVars.modal.filter(v => v.name === '--modal-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Secondary Card */}
            <SectionGroup title="Secondary Card">
              <Subsection
                title="Secondary Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Secondary Card', lightVars.secondaryCard, darkVars.secondaryCard);
                  handleResetGroup('Secondary Card Gradient', lightVars.secondaryCardGradient, darkVars.secondaryCardGradient);
                  handleResetGroup('Secondary Card Hover', lightVars.secondaryCardHover, darkVars.secondaryCardHover);
                  handleResetGroup('Secondary Card Hover Gradient', lightVars.secondaryCardHoverGradient, darkVars.secondaryCardHoverGradient);
                  setSecondaryCardBorderEnabled(true);
                  saveSecondaryCardBorderEnabledToCookie(true);
                  setSecondaryCardGradientEnabled(false);
                  saveSecondaryCardGradientEnabledToCookie(false);
                  setSecondaryCardBgColorEnabled(true);
                  saveSecondaryCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around secondary cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={secondaryCardBorderEnabled}
                        onChange={(v) => {
                          setSecondaryCardBorderEnabled(v);
                          saveSecondaryCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={secondaryCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.secondaryCard.filter(v => v.name === '--secondary-card-border')}
                          darkVars={darkVars.secondaryCard.filter(v => v.name === '--secondary-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={secondaryCardGradientEnabled}
                        onChange={(v) => {
                          setSecondaryCardGradientEnabled(v);
                          saveSecondaryCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={secondaryCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables lightVars={lightVars.secondaryCardGradient} darkVars={darkVars.secondaryCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={secondaryCardBgColorEnabled}
                        onChange={(v) => {
                          setSecondaryCardBgColorEnabled(v);
                          saveSecondaryCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={secondaryCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.secondaryCard.filter(v => v.name === '--secondary-card-bg')}
                          darkVars={darkVars.secondaryCard.filter(v => v.name === '--secondary-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.secondaryCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      darkVars={darkVars.secondaryCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>

                  {/* Hover States */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover States</p>
                    <DualModeVariables lightVars={lightVars.secondaryCardHover} darkVars={darkVars.secondaryCardHover} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover Gradient</p>
                    <DualModeVariables lightVars={lightVars.secondaryCardHoverGradient} darkVars={darkVars.secondaryCardHoverGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Specialty Card */}
            <SectionGroup title="Specialty Card">
              <Subsection
                title="Specialty Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Specialty Card', lightVars.specialtyCard, darkVars.specialtyCard);
                  handleResetGroup('Specialty Card Gradient', lightVars.specialtyCardGradient, darkVars.specialtyCardGradient);
                  handleResetGroup('Specialty Card Hover', lightVars.specialtyCardHover, darkVars.specialtyCardHover);
                  handleResetGroup('Specialty Card Hover Gradient', lightVars.specialtyCardHoverGradient, darkVars.specialtyCardHoverGradient);
                  handleResetGroup('Specialty Card Primary Btn', lightVars.specialtyCardPrimaryBtn, darkVars.specialtyCardPrimaryBtn);
                  handleResetGroup('Specialty Card Secondary Btn', lightVars.specialtyCardSecondaryBtn, darkVars.specialtyCardSecondaryBtn);
                  setSpecialtyCardBorderEnabled(true);
                  saveSpecialtyCardBorderEnabledToCookie(true);
                  setSpecialtyCardGradientEnabled(false);
                  saveSpecialtyCardGradientEnabledToCookie(false);
                  setSpecialtyCardBgColorEnabled(true);
                  saveSpecialtyCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around specialty cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={specialtyCardBorderEnabled}
                        onChange={(v) => {
                          setSpecialtyCardBorderEnabled(v);
                          saveSpecialtyCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={specialtyCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Border Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.specialtyCard.filter(v => v.name === '--specialty-card-border')}
                          darkVars={darkVars.specialtyCard.filter(v => v.name === '--specialty-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle with inline color pickers */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={specialtyCardGradientEnabled}
                        onChange={(v) => {
                          setSpecialtyCardGradientEnabled(v);
                          saveSpecialtyCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={specialtyCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Gradient Colors
                        </p>
                        <DualModeVariables lightVars={lightVars.specialtyCardGradient} darkVars={darkVars.specialtyCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle with inline color picker */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={specialtyCardBgColorEnabled}
                        onChange={(v) => {
                          setSpecialtyCardBgColorEnabled(v);
                          saveSpecialtyCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={specialtyCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">
                          Background Color
                        </p>
                        <DualModeVariables
                          lightVars={lightVars.specialtyCard.filter(v => v.name === '--specialty-card-bg')}
                          darkVars={darkVars.specialtyCard.filter(v => v.name === '--specialty-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.specialtyCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      darkVars={darkVars.specialtyCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>

                  {/* Hover States */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover States</p>
                    <DualModeVariables lightVars={lightVars.specialtyCardHover} darkVars={darkVars.specialtyCardHover} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover Gradient</p>
                    <DualModeVariables lightVars={lightVars.specialtyCardHoverGradient} darkVars={darkVars.specialtyCardHoverGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Primary Button</p>
                    <DualModeVariables lightVars={lightVars.specialtyCardPrimaryBtn} darkVars={darkVars.specialtyCardPrimaryBtn} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Secondary Button</p>
                    <DualModeVariables lightVars={lightVars.specialtyCardSecondaryBtn} darkVars={darkVars.specialtyCardSecondaryBtn} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Inner Card */}
            <SectionGroup title="Inner Card">
              <Subsection
                title="Inner Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Inner Card', lightVars.innerCard, darkVars.innerCard);
                  handleResetGroup('Inner Card Gradient', lightVars.innerCardGradient, darkVars.innerCardGradient);
                  handleResetGroup('Inner Card Hover', lightVars.innerCardHover, darkVars.innerCardHover);
                  handleResetGroup('Inner Card Hover Gradient', lightVars.innerCardHoverGradient, darkVars.innerCardHoverGradient);
                  handleResetGroup('Inner Card Primary Btn', lightVars.innerCardPrimaryBtn, darkVars.innerCardPrimaryBtn);
                  handleResetGroup('Inner Card Secondary Btn', lightVars.innerCardSecondaryBtn, darkVars.innerCardSecondaryBtn);
                  setInnerCardBorderEnabled(true);
                  saveInnerCardBorderEnabledToCookie(true);
                  setInnerCardGradientEnabled(false);
                  saveInnerCardGradientEnabledToCookie(false);
                  setInnerCardBgColorEnabled(true);
                  saveInnerCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around inner cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerCardBorderEnabled}
                        onChange={(v) => {
                          setInnerCardBorderEnabled(v);
                          saveInnerCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerCard.filter(v => v.name === '--inner-card-border')}
                          darkVars={darkVars.innerCard.filter(v => v.name === '--inner-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerCardGradientEnabled}
                        onChange={(v) => {
                          setInnerCardGradientEnabled(v);
                          saveInnerCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.innerCardGradient} darkVars={darkVars.innerCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerCardBgColorEnabled}
                        onChange={(v) => {
                          setInnerCardBgColorEnabled(v);
                          saveInnerCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerCard.filter(v => v.name === '--inner-card-bg')}
                          darkVars={darkVars.innerCard.filter(v => v.name === '--inner-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.innerCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.innerCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>

                  {/* Hover States */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover States</p>
                    <DualModeVariables lightVars={lightVars.innerCardHover} darkVars={darkVars.innerCardHover} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover Gradient</p>
                    <DualModeVariables lightVars={lightVars.innerCardHoverGradient} darkVars={darkVars.innerCardHoverGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Primary Button</p>
                    <DualModeVariables lightVars={lightVars.innerCardPrimaryBtn} darkVars={darkVars.innerCardPrimaryBtn} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Secondary Button</p>
                    <DualModeVariables lightVars={lightVars.innerCardSecondaryBtn} darkVars={darkVars.innerCardSecondaryBtn} updateKey={updateKey} onUpdate={forceUpdate} />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Action Card */}
            <SectionGroup title="Action Card">
              <Subsection
                title="Action Card"
                icon={MousePointer}
                onReset={() => {
                  handleResetGroup('Action Card', lightVars.actionCard, darkVars.actionCard);
                  handleResetGroup('Action Card Gradient', lightVars.actionCardGradient, darkVars.actionCardGradient);
                  handleResetGroup('Action Card Hover', lightVars.actionCardHover, darkVars.actionCardHover);
                  handleResetGroup('Action Card Hover Gradient', lightVars.actionCardHoverGradient, darkVars.actionCardHoverGradient);
                  handleResetGroup('Action Card Icon', lightVars.actionCardIcon, darkVars.actionCardIcon);
                  handleResetGroup('Action Card Radius', lightVars.actionCardRadius, darkVars.actionCardRadius);
                  setActionCardBorderEnabled(true);
                  saveActionCardBorderEnabledToCookie(true);
                  setActionCardGradientEnabled(false);
                  saveActionCardGradientEnabledToCookie(false);
                  setActionCardBgColorEnabled(true);
                  saveActionCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around action cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={actionCardBorderEnabled}
                        onChange={(v) => {
                          setActionCardBorderEnabled(v);
                          saveActionCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={actionCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.actionCard.filter(v => v.name === '--action-card-border')}
                          darkVars={darkVars.actionCard.filter(v => v.name === '--action-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={actionCardGradientEnabled}
                        onChange={(v) => {
                          setActionCardGradientEnabled(v);
                          saveActionCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={actionCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.actionCardGradient} darkVars={darkVars.actionCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={actionCardBgColorEnabled}
                        onChange={(v) => {
                          setActionCardBgColorEnabled(v);
                          saveActionCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={actionCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.actionCard.filter(v => v.name === '--action-card-bg')}
                          darkVars={darkVars.actionCard.filter(v => v.name === '--action-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div>
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.actionCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      darkVars={darkVars.actionCard.filter(v => v.name.includes('heading') || v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>

                {/* Hover States */}
                <div className="mt-4 p-4 bg-primary-50/50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                  <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-3">Hover States</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover Background & Border</p>
                      <DualModeVariables lightVars={lightVars.actionCardHover} darkVars={darkVars.actionCardHover} updateKey={updateKey} onUpdate={forceUpdate} />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Hover Gradient</p>
                      <DualModeVariables lightVars={lightVars.actionCardHoverGradient} darkVars={darkVars.actionCardHoverGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                    </div>
                  </div>
                </div>

                {/* Icon Colors */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Icon Colors</p>
                  <DualModeVariables lightVars={lightVars.actionCardIcon} darkVars={darkVars.actionCardIcon} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>

                {/* Border Radius */}
                <div className="mt-4">
                  <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Radius</p>
                  <DualModeVariables lightVars={lightVars.actionCardRadius} darkVars={darkVars.actionCardRadius} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>
            </SectionGroup>

            {/* Code Card */}
            <SectionGroup title="Code Card">
              <Subsection
                title="Code Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Code Card', lightVars.codeCard, darkVars.codeCard);
                  handleResetGroup('Code Card Gradient', lightVars.codeCardGradient, darkVars.codeCardGradient);
                  setCodeCardBorderEnabled(true);
                  saveCodeCardBorderEnabledToCookie(true);
                  setCodeCardGradientEnabled(false);
                  saveCodeCardGradientEnabledToCookie(false);
                  setCodeCardBgColorEnabled(true);
                  saveCodeCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around code cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={codeCardBorderEnabled}
                        onChange={(v) => {
                          setCodeCardBorderEnabled(v);
                          saveCodeCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={codeCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.codeCard.filter(v => v.name === '--code-card-border')}
                          darkVars={darkVars.codeCard.filter(v => v.name === '--code-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={codeCardGradientEnabled}
                        onChange={(v) => {
                          setCodeCardGradientEnabled(v);
                          saveCodeCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={codeCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.codeCardGradient} darkVars={darkVars.codeCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={codeCardBgColorEnabled}
                        onChange={(v) => {
                          setCodeCardBgColorEnabled(v);
                          saveCodeCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={codeCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.codeCard.filter(v => v.name === '--code-card-bg')}
                          darkVars={darkVars.codeCard.filter(v => v.name === '--code-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Color */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Color</p>
                    <DualModeVariables
                      lightVars={lightVars.codeCard.filter(v => v.name === '--code-card-text')}
                      darkVars={darkVars.codeCard.filter(v => v.name === '--code-card-text')}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Semantic Cards */}
            <SectionGroup title="Semantic Cards">
              <Subsection
                title="Info Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Info Card', lightVars.infoCard, darkVars.infoCard);
                  handleResetGroup('Info Card Gradient', lightVars.infoCardGradient, darkVars.infoCardGradient);
                  setInfoCardBorderEnabled(true);
                  saveInfoCardBorderEnabledToCookie(true);
                  setInfoCardGradientEnabled(false);
                  saveInfoCardGradientEnabledToCookie(false);
                  setInfoCardBgColorEnabled(true);
                  saveInfoCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around info cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={infoCardBorderEnabled}
                        onChange={(v) => {
                          setInfoCardBorderEnabled(v);
                          saveInfoCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={infoCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.infoCard.filter(v => v.name === '--info-card-border')}
                          darkVars={darkVars.infoCard.filter(v => v.name === '--info-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={infoCardGradientEnabled}
                        onChange={(v) => {
                          setInfoCardGradientEnabled(v);
                          saveInfoCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={infoCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.infoCardGradient} darkVars={darkVars.infoCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={infoCardBgColorEnabled}
                        onChange={(v) => {
                          setInfoCardBgColorEnabled(v);
                          saveInfoCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={infoCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.infoCard.filter(v => v.name === '--info-card-bg')}
                          darkVars={darkVars.infoCard.filter(v => v.name === '--info-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.infoCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.infoCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Error Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Error Card', lightVars.errorCard, darkVars.errorCard);
                  handleResetGroup('Error Card Gradient', lightVars.errorCardGradient, darkVars.errorCardGradient);
                  setErrorCardBorderEnabled(true);
                  saveErrorCardBorderEnabledToCookie(true);
                  setErrorCardGradientEnabled(false);
                  saveErrorCardGradientEnabledToCookie(false);
                  setErrorCardBgColorEnabled(true);
                  saveErrorCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around error cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={errorCardBorderEnabled}
                        onChange={(v) => {
                          setErrorCardBorderEnabled(v);
                          saveErrorCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={errorCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.errorCard.filter(v => v.name === '--error-card-border')}
                          darkVars={darkVars.errorCard.filter(v => v.name === '--error-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={errorCardGradientEnabled}
                        onChange={(v) => {
                          setErrorCardGradientEnabled(v);
                          saveErrorCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={errorCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.errorCardGradient} darkVars={darkVars.errorCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={errorCardBgColorEnabled}
                        onChange={(v) => {
                          setErrorCardBgColorEnabled(v);
                          saveErrorCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={errorCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.errorCard.filter(v => v.name === '--error-card-bg')}
                          darkVars={darkVars.errorCard.filter(v => v.name === '--error-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.errorCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.errorCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Success Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Success Card', lightVars.successCard, darkVars.successCard);
                  handleResetGroup('Success Card Gradient', lightVars.successCardGradient, darkVars.successCardGradient);
                  setSuccessCardBorderEnabled(true);
                  saveSuccessCardBorderEnabledToCookie(true);
                  setSuccessCardGradientEnabled(false);
                  saveSuccessCardGradientEnabledToCookie(false);
                  setSuccessCardBgColorEnabled(true);
                  saveSuccessCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around success cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={successCardBorderEnabled}
                        onChange={(v) => {
                          setSuccessCardBorderEnabled(v);
                          saveSuccessCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={successCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.successCard.filter(v => v.name === '--success-card-border')}
                          darkVars={darkVars.successCard.filter(v => v.name === '--success-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={successCardGradientEnabled}
                        onChange={(v) => {
                          setSuccessCardGradientEnabled(v);
                          saveSuccessCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={successCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.successCardGradient} darkVars={darkVars.successCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={successCardBgColorEnabled}
                        onChange={(v) => {
                          setSuccessCardBgColorEnabled(v);
                          saveSuccessCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={successCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.successCard.filter(v => v.name === '--success-card-bg')}
                          darkVars={darkVars.successCard.filter(v => v.name === '--success-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.successCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.successCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Warning Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Warning Card', lightVars.warningCard, darkVars.warningCard);
                  handleResetGroup('Warning Card Gradient', lightVars.warningCardGradient, darkVars.warningCardGradient);
                  setWarningCardBorderEnabled(true);
                  saveWarningCardBorderEnabledToCookie(true);
                  setWarningCardGradientEnabled(false);
                  saveWarningCardGradientEnabledToCookie(false);
                  setWarningCardBgColorEnabled(true);
                  saveWarningCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around warning cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={warningCardBorderEnabled}
                        onChange={(v) => {
                          setWarningCardBorderEnabled(v);
                          saveWarningCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={warningCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.warningCard.filter(v => v.name === '--warning-card-border')}
                          darkVars={darkVars.warningCard.filter(v => v.name === '--warning-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={warningCardGradientEnabled}
                        onChange={(v) => {
                          setWarningCardGradientEnabled(v);
                          saveWarningCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={warningCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.warningCardGradient} darkVars={darkVars.warningCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={warningCardBgColorEnabled}
                        onChange={(v) => {
                          setWarningCardBgColorEnabled(v);
                          saveWarningCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={warningCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.warningCard.filter(v => v.name === '--warning-card-bg')}
                          darkVars={darkVars.warningCard.filter(v => v.name === '--warning-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.warningCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.warningCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Inner Semantic Cards */}
            <SectionGroup title="Inner Semantic Cards">
              <Subsection
                title="Inner Info Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Inner Info Card', lightVars.innerInfoCard, darkVars.innerInfoCard);
                  handleResetGroup('Inner Info Card Gradient', lightVars.innerInfoCardGradient, darkVars.innerInfoCardGradient);
                  setInnerInfoCardBorderEnabled(true);
                  saveInnerInfoCardBorderEnabledToCookie(true);
                  setInnerInfoCardGradientEnabled(false);
                  saveInnerInfoCardGradientEnabledToCookie(false);
                  setInnerInfoCardBgColorEnabled(true);
                  saveInnerInfoCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around inner info cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerInfoCardBorderEnabled}
                        onChange={(v) => {
                          setInnerInfoCardBorderEnabled(v);
                          saveInnerInfoCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerInfoCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerInfoCard.filter(v => v.name === '--inner-info-card-border')}
                          darkVars={darkVars.innerInfoCard.filter(v => v.name === '--inner-info-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerInfoCardGradientEnabled}
                        onChange={(v) => {
                          setInnerInfoCardGradientEnabled(v);
                          saveInnerInfoCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerInfoCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.innerInfoCardGradient} darkVars={darkVars.innerInfoCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerInfoCardBgColorEnabled}
                        onChange={(v) => {
                          setInnerInfoCardBgColorEnabled(v);
                          saveInnerInfoCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerInfoCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerInfoCard.filter(v => v.name === '--inner-info-card-bg')}
                          darkVars={darkVars.innerInfoCard.filter(v => v.name === '--inner-info-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.innerInfoCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.innerInfoCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Inner Error Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Inner Error Card', lightVars.innerErrorCard, darkVars.innerErrorCard);
                  handleResetGroup('Inner Error Card Gradient', lightVars.innerErrorCardGradient, darkVars.innerErrorCardGradient);
                  setInnerErrorCardBorderEnabled(true);
                  saveInnerErrorCardBorderEnabledToCookie(true);
                  setInnerErrorCardGradientEnabled(false);
                  saveInnerErrorCardGradientEnabledToCookie(false);
                  setInnerErrorCardBgColorEnabled(true);
                  saveInnerErrorCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around inner error cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerErrorCardBorderEnabled}
                        onChange={(v) => {
                          setInnerErrorCardBorderEnabled(v);
                          saveInnerErrorCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerErrorCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerErrorCard.filter(v => v.name === '--inner-error-card-border')}
                          darkVars={darkVars.innerErrorCard.filter(v => v.name === '--inner-error-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerErrorCardGradientEnabled}
                        onChange={(v) => {
                          setInnerErrorCardGradientEnabled(v);
                          saveInnerErrorCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerErrorCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.innerErrorCardGradient} darkVars={darkVars.innerErrorCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerErrorCardBgColorEnabled}
                        onChange={(v) => {
                          setInnerErrorCardBgColorEnabled(v);
                          saveInnerErrorCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerErrorCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerErrorCard.filter(v => v.name === '--inner-error-card-bg')}
                          darkVars={darkVars.innerErrorCard.filter(v => v.name === '--inner-error-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.innerErrorCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.innerErrorCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Inner Success Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Inner Success Card', lightVars.innerSuccessCard, darkVars.innerSuccessCard);
                  handleResetGroup('Inner Success Card Gradient', lightVars.innerSuccessCardGradient, darkVars.innerSuccessCardGradient);
                  setInnerSuccessCardBorderEnabled(true);
                  saveInnerSuccessCardBorderEnabledToCookie(true);
                  setInnerSuccessCardGradientEnabled(false);
                  saveInnerSuccessCardGradientEnabledToCookie(false);
                  setInnerSuccessCardBgColorEnabled(true);
                  saveInnerSuccessCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around inner success cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerSuccessCardBorderEnabled}
                        onChange={(v) => {
                          setInnerSuccessCardBorderEnabled(v);
                          saveInnerSuccessCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerSuccessCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerSuccessCard.filter(v => v.name === '--inner-success-card-border')}
                          darkVars={darkVars.innerSuccessCard.filter(v => v.name === '--inner-success-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerSuccessCardGradientEnabled}
                        onChange={(v) => {
                          setInnerSuccessCardGradientEnabled(v);
                          saveInnerSuccessCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerSuccessCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.innerSuccessCardGradient} darkVars={darkVars.innerSuccessCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerSuccessCardBgColorEnabled}
                        onChange={(v) => {
                          setInnerSuccessCardBgColorEnabled(v);
                          saveInnerSuccessCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerSuccessCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerSuccessCard.filter(v => v.name === '--inner-success-card-bg')}
                          darkVars={darkVars.innerSuccessCard.filter(v => v.name === '--inner-success-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.innerSuccessCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.innerSuccessCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>

              <Subsection
                title="Inner Warning Card"
                icon={FileText}
                onReset={() => {
                  handleResetGroup('Inner Warning Card', lightVars.innerWarningCard, darkVars.innerWarningCard);
                  handleResetGroup('Inner Warning Card Gradient', lightVars.innerWarningCardGradient, darkVars.innerWarningCardGradient);
                  setInnerWarningCardBorderEnabled(true);
                  saveInnerWarningCardBorderEnabledToCookie(true);
                  setInnerWarningCardGradientEnabled(false);
                  saveInnerWarningCardGradientEnabledToCookie(false);
                  setInnerWarningCardBgColorEnabled(true);
                  saveInnerWarningCardBgColorEnabledToCookie(true);
                }}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Show Border Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Show Border</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Display border around inner warning cards</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerWarningCardBorderEnabled}
                        onChange={(v) => {
                          setInnerWarningCardBorderEnabled(v);
                          saveInnerWarningCardBorderEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerWarningCardBorderEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Border Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerWarningCard.filter(v => v.name === '--inner-warning-card-border')}
                          darkVars={darkVars.innerWarningCard.filter(v => v.name === '--inner-warning-card-border')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Gradient Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Gradient</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply gradient to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerWarningCardGradientEnabled}
                        onChange={(v) => {
                          setInnerWarningCardGradientEnabled(v);
                          saveInnerWarningCardGradientEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerWarningCardGradientEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Gradient Colors</p>
                        <DualModeVariables lightVars={lightVars.innerWarningCardGradient} darkVars={darkVars.innerWarningCardGradient} updateKey={updateKey} onUpdate={forceUpdate} />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Use Background Color Toggle */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm">Use Background Color</Label>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">Apply solid color to card background</p>
                      </div>
                      <ToggleSwitch
                        label=""
                        checked={innerWarningCardBgColorEnabled}
                        onChange={(v) => {
                          setInnerWarningCardBgColorEnabled(v);
                          saveInnerWarningCardBgColorEnabledToCookie(v);
                        }}
                      />
                    </div>
                    <AnimatedCollapse isOpen={innerWarningCardBgColorEnabled}>
                      <div className="mt-3 pl-4 border-l-2 border-secondary-200 dark:border-secondary-700">
                        <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Background Color</p>
                        <DualModeVariables
                          lightVars={lightVars.innerWarningCard.filter(v => v.name === '--inner-warning-card-bg')}
                          darkVars={darkVars.innerWarningCard.filter(v => v.name === '--inner-warning-card-bg')}
                          updateKey={updateKey}
                          onUpdate={forceUpdate}
                        />
                      </div>
                    </AnimatedCollapse>
                  </div>

                  {/* Text Colors */}
                  <div className="mt-4">
                    <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-2">Text Colors</p>
                    <DualModeVariables
                      lightVars={lightVars.innerWarningCard.filter(v => v.name.includes('text'))}
                      darkVars={darkVars.innerWarningCard.filter(v => v.name.includes('text'))}
                      updateKey={updateKey}
                      onUpdate={forceUpdate}
                    />
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Form & Buttons */}
            <SectionGroup title="Form & Buttons">
              <Subsection
                title="Form Elements"
                icon={FileText}
                onReset={() => handleResetGroup('Form', lightVars.form, darkVars.form)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.form} darkVars={darkVars.form} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Buttons"
                icon={MousePointer}
                onReset={() => handleResetGroup('Button', lightVars.button, darkVars.button)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.button} darkVars={darkVars.button} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>
            </SectionGroup>

            {/* Tooltips & Toasts */}
            <SectionGroup title="Tooltips & Toasts">
              <Subsection
                title="Tooltip"
                icon={Layout}
                onReset={() => handleResetGroup('Tooltip', lightVars.tooltip, darkVars.tooltip)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  {/* Tooltip Preview */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-secondary-600 dark:text-secondary-400">Preview:</span>
                    <Tooltip content="Tooltip using theme colors: bg, border, and text">
                      <button
                        type="button"
                        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-200 dark:bg-secondary-700 text-secondary-600 dark:text-secondary-300 hover:bg-secondary-300 dark:hover:bg-secondary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                        aria-label="Show tooltip"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                  <DualModeVariables lightVars={lightVars.tooltip} darkVars={darkVars.tooltip} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Success Toast"
                icon={Layout}
                onReset={() => handleResetGroup('Success Toast', lightVars.toastSuccess, darkVars.toastSuccess)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.toastSuccess} darkVars={darkVars.toastSuccess} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Error Toast"
                icon={Layout}
                onReset={() => handleResetGroup('Error Toast', lightVars.toastError, darkVars.toastError)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.toastError} darkVars={darkVars.toastError} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Warning Toast"
                icon={Layout}
                onReset={() => handleResetGroup('Warning Toast', lightVars.toastWarning, darkVars.toastWarning)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.toastWarning} darkVars={darkVars.toastWarning} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Info Toast"
                icon={Layout}
                onReset={() => handleResetGroup('Info Toast', lightVars.toastInfo, darkVars.toastInfo)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.toastInfo} darkVars={darkVars.toastInfo} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>
            </SectionGroup>

            {/* Bubble Preview — disabled, configured per-chatbot */}
            <SectionGroup title="Bubble Preview">
              <Subsection
                title="Proactive Message Bubble"
                icon={MessageSquare}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        Configured per chatbot
                      </p>
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Bubble appearance settings (colors, border, radius, shadow, etc.) are configured individually for each chatbot
                        under <strong>Chatbot Settings → Proactive Messages → Bubble Appearance</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </Subsection>
            </SectionGroup>

            {/* Color Scale */}
            <SectionGroup title="Color Scale">
              <Subsection
                title="Primary Colors"
                icon={Palette}
                onReset={() => handleResetGroup('Primary', lightVars.primary, darkVars.primary)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.primary} darkVars={darkVars.primary} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>

              <Subsection
                title="Secondary Colors"
                icon={Palette}
                onReset={() => handleResetGroup('Secondary', lightVars.secondary, darkVars.secondary)}
              >
                <div className="mb-4 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg space-y-4">
                  <DualModeVariables lightVars={lightVars.secondary} darkVars={darkVars.secondary} updateKey={updateKey} onUpdate={forceUpdate} />
                </div>
              </Subsection>
            </SectionGroup>
          </div>
        )}
      </div>
    </div>
  );
}
