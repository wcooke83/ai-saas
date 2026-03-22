'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Save, RotateCcw, Check, Palette, Type, Layout, Code, MousePointerClick, Flag, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { H1 } from '@/components/ui/heading';
import type { Chatbot, WidgetConfig } from '@/lib/chatbots/types';
import { DEFAULT_WIDGET_CONFIG } from '@/lib/chatbots/types';
import { getTranslations } from '@/lib/chatbots/translations';

// Google Fonts mapping for preview
const GOOGLE_FONTS: Record<string, string> = {
  'Inter': 'Inter:wght@400;500;600;700',
  'Roboto': 'Roboto:wght@400;500;700',
  'Open Sans': 'Open+Sans:wght@400;500;600;700',
  'Poppins': 'Poppins:wght@400;500;600;700',
  'Lato': 'Lato:wght@400;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Nunito': 'Nunito:wght@400;500;600;700',
  'Raleway': 'Raleway:wght@400;500;600;700',
  'Source Sans Pro': 'Source+Sans+Pro:wght@400;600;700',
  'Ubuntu': 'Ubuntu:wght@400;500;700',
  'DM Sans': 'DM+Sans:wght@400;500;600;700',
  'Manrope': 'Manrope:wght@400;500;600;700',
  'Plus Jakarta Sans': 'Plus+Jakarta+Sans:wght@400;500;600;700',
  'Playfair Display': 'Playfair+Display:wght@400;500;600;700',
  'Merriweather': 'Merriweather:wght@400;700',
  'Lora': 'Lora:wght@400;500;600;700',
  'Source Serif Pro': 'Source+Serif+Pro:wght@400;600;700',
  'JetBrains Mono': 'JetBrains+Mono:wght@400;500;700',
  'Fira Code': 'Fira+Code:wght@400;500;700',
  'Source Code Pro': 'Source+Code+Pro:wght@400;500;700',
  'IBM Plex Mono': 'IBM+Plex+Mono:wght@400;500;700',
  'Quicksand': 'Quicksand:wght@400;500;600;700',
  'Comfortaa': 'Comfortaa:wght@400;500;700',
  'Varela Round': 'Varela+Round',
};

function loadGoogleFont(fontFamily: string): void {
  const fontName = fontFamily.match(/^([^,]+)/)?.[1]?.trim().replace(/['"]/g, '');
  if (!fontName || !GOOGLE_FONTS[fontName]) return;

  const fontId = `google-font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;
  if (document.getElementById(fontId)) return;

  const link = document.createElement('link');
  link.id = fontId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${GOOGLE_FONTS[fontName]}&display=swap`;
  document.head.appendChild(link);
}

interface CustomizePageProps {
  params: Promise<{ id: string }>;
}

// Color picker component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm">{label}</Label>
      <div className="flex items-center gap-2">
        <div
          className="w-10 h-10 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer overflow-hidden"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full opacity-0 cursor-pointer"
            aria-label={`${label} color picker`}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
          aria-label={`${label} hex value`}
        />
      </div>
    </div>
  );
}

// Position selector component
function PositionSelector({
  value,
  onChange,
}: {
  value: WidgetConfig['position'];
  onChange: (value: WidgetConfig['position']) => void;
}) {
  const positions: Array<{ value: WidgetConfig['position']; label: string }> = [
    { value: 'top-left', label: 'Top Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <div className="space-y-2">
      <Label>Widget Position</Label>
      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Widget Position">
        {positions.map((pos) => (
          <button
            key={pos.value}
            type="button"
            role="radio"
            aria-checked={value === pos.value}
            onClick={() => onChange(pos.value)}
            className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
              value === pos.value
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
            }`}
          >
            {pos.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function CustomizePage({ params }: CustomizePageProps) {
  const { id } = use(params);
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [config, setConfig] = useState<WidgetConfig>(DEFAULT_WIDGET_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'chat' | 'form' | 'verify' | 'survey' | 'feedback' | 'escalation' | 'handoff'>('form');
  const [selectedReportReason, setSelectedReportReason] = useState<string | null>(null);
  const [showAllColors, setShowAllColors] = useState(false);
  const t = getTranslations(chatbot?.language || 'en');

  const TAB_LABELS: Record<string, string> = {
    chat: 'Chat',
    form: 'Pre-Chat',
    verify: 'Verify',
    survey: 'Post-Chat',
    feedback: 'Feedback',
    escalation: 'Report',
    handoff: 'Handoff',
  };

  const COLOR_SECTIONS_BY_TAB: Record<string, string[]> = {
    chat:       ['general', 'header', 'messages', 'inputArea', 'sendButton'],
    form:       ['general', 'header', 'formColors'],
    verify:     ['general', 'header', 'formColors', 'secondaryButton'],
    survey:     ['general', 'header', 'formColors', 'secondaryButton'],
    feedback:   ['general', 'feedbackColors'],
    escalation: ['general', 'header', 'escalationReport'],
    handoff:    ['general', 'header', 'escalationReport', 'secondaryButton'],
  };

  const visibleSections = showAllColors
    ? ['general', 'header', 'messages', 'inputArea', 'sendButton', 'secondaryButton', 'formColors', 'feedbackColors', 'escalationReport']
    : COLOR_SECTIONS_BY_TAB[previewMode] || [];

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        if (!response.ok) throw new Error('Failed to fetch chatbot');
        const data = await response.json();
        setChatbot(data.data.chatbot);
        setConfig({
          ...DEFAULT_WIDGET_CONFIG,
          ...(data.data.chatbot.widget_config || {}),
        });
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbot();
  }, [id]);

  // Load Google Font for preview when font family changes
  useEffect(() => {
    if (config.fontFamily) {
      loadGoogleFont(config.fontFamily);
    }
  }, [config.fontFamily]);

  const handleSave = async () => {
    setSaving(true);

    try {
      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ widget_config: config }),
      });

      if (!response.ok) throw new Error('Failed to save configuration');

      toast.success('Widget configuration saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_WIDGET_CONFIG);
  };

  const updateConfig = (key: keyof WidgetConfig, value: unknown) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (loadError || !chatbot) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{loadError || 'Chatbot not found'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <H1 variant="dashboard">
            Customize Widget
          </H1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            Personalize the look and feel of your chatbot widget
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-6">
          {/* Colors */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-primary-500" />
                    Colors
                  </CardTitle>
                  <CardDescription>
                    Showing colors for <span className="font-medium text-secondary-700 dark:text-secondary-300">{TAB_LABELS[previewMode]}</span> view
                  </CardDescription>
                </div>
                <label className="flex items-center gap-2 text-xs text-secondary-500 dark:text-secondary-400 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showAllColors}
                    onChange={(e) => setShowAllColors(e.target.checked)}
                    className="rounded border-secondary-300 dark:border-secondary-600"
                  />
                  Show all
                </label>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General */}
              {visibleSections.includes('general') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">General</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Primary Color"
                    value={config.primaryColor}
                    onChange={(v) => updateConfig('primaryColor', v)}
                  />
                  <ColorPicker
                    label="Background Color"
                    value={config.backgroundColor}
                    onChange={(v) => updateConfig('backgroundColor', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.textColor}
                    onChange={(v) => updateConfig('textColor', v)}
                  />
                </div>
              </div>)}

              {/* Header */}
              {visibleSections.includes('header') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Header</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Header Text Color"
                    value={config.headerTextColor}
                    onChange={(v) => updateConfig('headerTextColor', v)}
                  />
                </div>
              </div>)}

              {/* Messages */}
              {visibleSections.includes('messages') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Messages</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="User Bubble Color"
                    value={config.userBubbleColor}
                    onChange={(v) => updateConfig('userBubbleColor', v)}
                  />
                  <ColorPicker
                    label="User Text Color"
                    value={config.userBubbleTextColor}
                    onChange={(v) => updateConfig('userBubbleTextColor', v)}
                  />
                  <ColorPicker
                    label="Bot Bubble Color"
                    value={config.botBubbleColor}
                    onChange={(v) => updateConfig('botBubbleColor', v)}
                  />
                  <ColorPicker
                    label="Bot Text Color"
                    value={config.botBubbleTextColor}
                    onChange={(v) => updateConfig('botBubbleTextColor', v)}
                  />
                </div>
              </div>)}

              {/* Input Area */}
              {visibleSections.includes('inputArea') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Input Area</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Input Background"
                    value={config.inputBackgroundColor}
                    onChange={(v) => updateConfig('inputBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Input Text Color"
                    value={config.inputTextColor}
                    onChange={(v) => updateConfig('inputTextColor', v)}
                  />
                  <ColorPicker
                    label="Placeholder Color"
                    value={config.inputPlaceholderColor}
                    onChange={(v) => updateConfig('inputPlaceholderColor', v)}
                  />
                </div>
              </div>)}

              {/* Secondary Button */}
              {visibleSections.includes('secondaryButton') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Secondary Button</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Used for actions like &quot;No thanks, start fresh&quot;</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Background Color"
                    value={config.secondaryButtonColor || 'transparent'}
                    onChange={(v) => updateConfig('secondaryButtonColor', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.secondaryButtonTextColor || '#374151'}
                    onChange={(v) => updateConfig('secondaryButtonTextColor', v)}
                  />
                  <ColorPicker
                    label="Border Color"
                    value={config.secondaryButtonBorderColor || '#d1d5db'}
                    onChange={(v) => updateConfig('secondaryButtonBorderColor', v)}
                  />
                </div>
              </div>)}

              {/* Send Button */}
              {visibleSections.includes('sendButton') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Send Button</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Button Background"
                    value={config.sendButtonColor}
                    onChange={(v) => updateConfig('sendButtonColor', v)}
                  />
                  <ColorPicker
                    label="Button Icon Color"
                    value={config.sendButtonIconColor}
                    onChange={(v) => updateConfig('sendButtonIconColor', v)}
                  />
                </div>
              </div>)}

              {/* Form Colors (Pre-Chat & Survey) */}
              {visibleSections.includes('formColors') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Form Colors</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Form Background"
                    value={config.formBackgroundColor || config.backgroundColor}
                    onChange={(v) => updateConfig('formBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Form Title Color"
                    value={config.formTitleColor || config.textColor}
                    onChange={(v) => updateConfig('formTitleColor', v)}
                  />
                  <ColorPicker
                    label="Form Border Color"
                    value={config.formBorderColor || '#e5e7eb'}
                    onChange={(v) => updateConfig('formBorderColor', v)}
                  />
                  <ColorPicker
                    label="Label Color"
                    value={config.formLabelColor || config.textColor}
                    onChange={(v) => updateConfig('formLabelColor', v)}
                  />
                  <ColorPicker
                    label="Description Color"
                    value={config.formDescriptionColor || '#6b7280'}
                    onChange={(v) => updateConfig('formDescriptionColor', v)}
                  />
                  <ColorPicker
                    label="Form Input Background"
                    value={config.formInputBackgroundColor || config.inputBackgroundColor}
                    onChange={(v) => updateConfig('formInputBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Form Input Text"
                    value={config.formInputTextColor || config.inputTextColor}
                    onChange={(v) => updateConfig('formInputTextColor', v)}
                  />
                  <ColorPicker
                    label="Form Placeholder Color"
                    value={config.formPlaceholderColor || config.inputPlaceholderColor}
                    onChange={(v) => updateConfig('formPlaceholderColor', v)}
                  />
                  <ColorPicker
                    label="Submit Button Text"
                    value={config.formSubmitButtonTextColor || '#ffffff'}
                    onChange={(v) => updateConfig('formSubmitButtonTextColor', v)}
                  />
                </div>
              </div>)}
              {/* Escalation / Report Colors */}
              {visibleSections.includes('escalationReport') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Report Colors</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Colors for the &quot;Report an issue&quot; overlay</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Background"
                    value={config.reportBackgroundColor || '#ffffff'}
                    onChange={(v) => updateConfig('reportBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.reportTextColor || '#0f172a'}
                    onChange={(v) => updateConfig('reportTextColor', v)}
                  />
                  <ColorPicker
                    label="Reason Button"
                    value={config.reportReasonButtonColor || '#f1f5f9'}
                    onChange={(v) => updateConfig('reportReasonButtonColor', v)}
                  />
                  <ColorPicker
                    label="Reason Button Text"
                    value={config.reportReasonButtonTextColor || '#0f172a'}
                    onChange={(v) => updateConfig('reportReasonButtonTextColor', v)}
                  />
                  <ColorPicker
                    label="Selected Reason"
                    value={config.reportReasonSelectedColor || config.primaryColor}
                    onChange={(v) => updateConfig('reportReasonSelectedColor', v)}
                  />
                  <ColorPicker
                    label="Selected Reason Text"
                    value={config.reportReasonSelectedTextColor || '#ffffff'}
                    onChange={(v) => updateConfig('reportReasonSelectedTextColor', v)}
                  />
                  <ColorPicker
                    label="Submit Button"
                    value={config.reportSubmitButtonColor || config.primaryColor}
                    onChange={(v) => updateConfig('reportSubmitButtonColor', v)}
                  />
                  <ColorPicker
                    label="Submit Button Text"
                    value={config.reportSubmitButtonTextColor || '#ffffff'}
                    onChange={(v) => updateConfig('reportSubmitButtonTextColor', v)}
                  />
                  <ColorPicker
                    label="Input Background"
                    value={config.reportInputBackgroundColor || '#f1f5f9'}
                    onChange={(v) => updateConfig('reportInputBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Input Text"
                    value={config.reportInputTextColor || config.textColor}
                    onChange={(v) => updateConfig('reportInputTextColor', v)}
                  />
                  <ColorPicker
                    label="Input Border"
                    value={config.reportInputBorderColor || '#e2e8f0'}
                    onChange={(v) => updateConfig('reportInputBorderColor', v)}
                  />
                </div>
              </div>)}

              {visibleSections.includes('feedbackColors') && (<div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Feedback Colors</h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mb-3">Colors for the thumbs-down follow-up prompt</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Background"
                    value={config.feedbackBackgroundColor || config.botBubbleColor}
                    onChange={(v) => updateConfig('feedbackBackgroundColor', v)}
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.feedbackTextColor || config.botBubbleTextColor}
                    onChange={(v) => updateConfig('feedbackTextColor', v)}
                  />
                  <ColorPicker
                    label="Button Color"
                    value={config.feedbackButtonColor || config.backgroundColor}
                    onChange={(v) => updateConfig('feedbackButtonColor', v)}
                  />
                  <ColorPicker
                    label="Button Text"
                    value={config.feedbackButtonTextColor || config.textColor}
                    onChange={(v) => updateConfig('feedbackButtonTextColor', v)}
                  />
                </div>
              </div>)}
            </CardContent>
          </Card>

          {/* Typography */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary-500" />
                Typography
              </CardTitle>
              <CardDescription>Customize fonts and text</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Font Family
                  <Tooltip content="Google Fonts are loaded automatically. System fonts load instantly with no network request.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </Label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => updateConfig('fontFamily', e.target.value)}
                  className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                >
                  <optgroup label="System Fonts">
                    <option value="system-ui, -apple-system, sans-serif">System Default</option>
                    <option value="-apple-system, BlinkMacSystemFont, sans-serif">Apple System</option>
                    <option value="Segoe UI, sans-serif">Segoe UI (Windows)</option>
                  </optgroup>
                  <optgroup label="Sans-Serif">
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Open Sans, sans-serif">Open Sans</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                    <option value="Lato, sans-serif">Lato</option>
                    <option value="Montserrat, sans-serif">Montserrat</option>
                    <option value="Nunito, sans-serif">Nunito</option>
                    <option value="Raleway, sans-serif">Raleway</option>
                    <option value="Source Sans Pro, sans-serif">Source Sans Pro</option>
                    <option value="Ubuntu, sans-serif">Ubuntu</option>
                    <option value="DM Sans, sans-serif">DM Sans</option>
                    <option value="Manrope, sans-serif">Manrope</option>
                    <option value="Plus Jakarta Sans, sans-serif">Plus Jakarta Sans</option>
                  </optgroup>
                  <optgroup label="Serif">
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Playfair Display, serif">Playfair Display</option>
                    <option value="Merriweather, serif">Merriweather</option>
                    <option value="Lora, serif">Lora</option>
                    <option value="Source Serif Pro, serif">Source Serif Pro</option>
                  </optgroup>
                  <optgroup label="Monospace">
                    <option value="JetBrains Mono, monospace">JetBrains Mono</option>
                    <option value="Fira Code, monospace">Fira Code</option>
                    <option value="Source Code Pro, monospace">Source Code Pro</option>
                    <option value="IBM Plex Mono, monospace">IBM Plex Mono</option>
                  </optgroup>
                  <optgroup label="Rounded">
                    <option value="Quicksand, sans-serif">Quicksand</option>
                    <option value="Comfortaa, cursive">Comfortaa</option>
                    <option value="Varela Round, sans-serif">Varela Round</option>
                  </optgroup>
                </select>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">
                  Google Fonts will be loaded automatically for non-system fonts.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Font Size: {config.fontSize}px</Label>
                <input
                  type="range"
                  min="12"
                  max="18"
                  value={config.fontSize}
                  onChange={(e) => updateConfig('fontSize', parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Font size"
                />
              </div>
              <div className="space-y-2">
                <Label>Header Text</Label>
                <Input
                  value={config.headerText}
                  onChange={(e) => updateConfig('headerText', e.target.value)}
                  placeholder="Chat with us"
                />
              </div>
            </CardContent>
          </Card>

          {/* Layout */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary-500" />
                Layout
              </CardTitle>
              <CardDescription>Configure position, size, and shape</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PositionSelector
                value={config.position}
                onChange={(v) => updateConfig('position', v)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Width: {config.width}px</Label>
                  <input
                    type="range"
                    min="300"
                    max="500"
                    step="10"
                    value={config.width}
                    onChange={(e) => updateConfig('width', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Widget width"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Height: {config.height}px</Label>
                  <input
                    type="range"
                    min="400"
                    max="700"
                    step="10"
                    value={config.height}
                    onChange={(e) => updateConfig('height', parseInt(e.target.value))}
                    aria-label="Widget height"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Container Border Radius: {config.containerBorderRadius}px
                  <Tooltip content="Rounds the corners of the entire chat widget container.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </Label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="2"
                  value={config.containerBorderRadius}
                  onChange={(e) => updateConfig('containerBorderRadius', parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Container border radius"
                />
              </div>
              <div className="space-y-2">
                <Label>Input Border Radius: {config.inputBorderRadius}px</Label>
                <input
                  type="range"
                  min="0"
                  max="32"
                  step="2"
                  value={config.inputBorderRadius}
                  onChange={(e) => updateConfig('inputBorderRadius', parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Input border radius"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Button Border Radius: {config.buttonBorderRadius}%
                  <Tooltip content="Controls how round the send button appears. 50% creates a perfect circle.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </Label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={config.buttonBorderRadius}
                  onChange={(e) => updateConfig('buttonBorderRadius', parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Button border radius"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showBranding"
                  checked={config.showBranding}
                  onChange={(e) => updateConfig('showBranding', e.target.checked)}
                  className="rounded border-secondary-300 dark:border-secondary-600"
                />
                <Label htmlFor="showBranding" className="flex items-center gap-1">
                  Show &quot;Powered by&quot; branding
                  <Tooltip content="Displays a small 'Powered by AI SaaS' link at the bottom of the widget.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5 text-primary-500" />
                Custom CSS
              </CardTitle>
              <div className="flex items-center gap-1 text-sm text-secondary-500 dark:text-secondary-400">
                Add custom styles (advanced)
                <Tooltip content="Override any widget style with CSS. Use .chat-widget-container as the root selector.">
                  <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <textarea
                value={config.customCss}
                onChange={(e) => updateConfig('customCss', e.target.value)}
                placeholder={`/* Add custom CSS here */
.chat-widget-container {

}`}
                className="w-full h-32 rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 font-mono text-sm"
                style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
              />
            </CardContent>
          </Card>

          {/* Widget Behavior */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MousePointerClick className="w-5 h-5 text-primary-500" />
                Widget Behavior
              </CardTitle>
              <CardDescription>Control how the widget behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Auto Open */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoOpen" className="flex items-center gap-1">
                      Auto Open
                      <Tooltip content="Automatically opens the chat widget after the specified delay. Only triggers once per visitor session.">
                        <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                      </Tooltip>
                    </Label>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Automatically open the widget after a delay
                    </p>
                  </div>
                  <button
                    id="autoOpen"
                    type="button"
                    role="switch"
                    aria-checked={config.autoOpen}
                    onClick={() => updateConfig('autoOpen', !config.autoOpen)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                      config.autoOpen ? 'bg-primary-500' : 'bg-secondary-200 dark:bg-secondary-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                        config.autoOpen ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Open Delay - only shown when autoOpen is enabled */}
                {config.autoOpen && (
                  <div className="space-y-2 pl-1 border-l-2 border-primary-200 dark:border-primary-800 ml-1">
                    <div className="pl-3">
                      <Label>Auto Open Delay: {(config.autoOpenDelay / 1000).toFixed(1)}s</Label>
                      <input
                        type="range"
                        min="500"
                        max="10000"
                        step="500"
                        value={config.autoOpenDelay}
                        onChange={(e) => updateConfig('autoOpenDelay', parseInt(e.target.value))}
                        aria-label="Auto open delay"
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-secondary-400">
                        <span>0.5s</span>
                        <span>10s</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Sound Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="soundEnabled" className="flex items-center gap-1">
                    Sound Notifications
                    <Tooltip content="Plays an audio chime when the bot sends a new message. Requires browser audio permission.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </Label>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    Play a sound when new messages arrive
                  </p>
                </div>
                <button
                  id="soundEnabled"
                  type="button"
                  role="switch"
                  aria-checked={config.soundEnabled}
                  onClick={() => updateConfig('soundEnabled', !config.soundEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                    config.soundEnabled ? 'bg-primary-500' : 'bg-secondary-200 dark:bg-secondary-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
                      config.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Button Size */}
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Button Size: {config.buttonSize}px
                  <Tooltip content="The size of the floating chat button that visitors click to open the widget.">
                    <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                  </Tooltip>
                </Label>
                <input
                  type="range"
                  min="40"
                  max="80"
                  step="2"
                  value={config.buttonSize}
                  onChange={(e) => updateConfig('buttonSize', parseInt(e.target.value))}
                  className="w-full"
                  aria-label="Button size"
                />
                <div className="flex justify-between text-xs text-secondary-400">
                  <span>40px</span>
                  <span>80px</span>
                </div>
              </div>

              {/* Position Offsets */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Offset X: {config.offsetX}px
                    <Tooltip content="Horizontal distance from the edge of the screen to the widget button.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.offsetX}
                    onChange={(e) => updateConfig('offsetX', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Horizontal offset"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1">
                    Offset Y: {config.offsetY}px
                    <Tooltip content="Vertical distance from the edge of the screen to the widget button.">
                      <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                    </Tooltip>
                  </Label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={config.offsetY}
                    onChange={(e) => updateConfig('offsetY', parseInt(e.target.value))}
                    className="w-full"
                    aria-label="Vertical offset"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>See how your widget will look</CardDescription>
                <div className="mt-3">
                  <select
                    value={previewMode}
                    onChange={(e) => setPreviewMode(e.target.value as typeof previewMode)}
                    className="w-full px-3 py-2 text-sm font-medium rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    aria-label="Preview mode"
                  >
                    {(['chat', 'form', 'verify', 'survey', 'feedback', 'escalation', 'handoff'] as const).map((mode) => (
                      <option key={mode} value={mode}>
                        {TAB_LABELS[mode]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="relative rounded-lg overflow-hidden"
                style={{
                  backgroundColor: '#f5f5f5',
                  height: '600px',
                }}
              >
                {/* Widget Preview */}
                <style>{`
                  .preview-input::placeholder {
                    color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    -webkit-text-fill-color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    opacity: 1 !important;
                  }
                  .preview-form-input::placeholder {
                    color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    -webkit-text-fill-color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    opacity: 1 !important;
                  }
                  .preview-report-input::placeholder {
                    color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    -webkit-text-fill-color: ${config.formPlaceholderColor || config.inputPlaceholderColor} !important;
                    opacity: 0.6 !important;
                  }
                `}</style>
                <div
                  className="absolute shadow-xl overflow-hidden"
                  style={{
                    width: `${Math.min(config.width, 380)}px`,
                    height: `${Math.min(config.height, 550)}px`,
                    bottom: config.position.startsWith('bottom') ? '20px' : 'auto',
                    top: config.position.startsWith('top') ? '20px' : 'auto',
                    right: config.position.endsWith('right') ? '20px' : 'auto',
                    left: config.position.endsWith('left') ? '20px' : 'auto',
                    backgroundColor: config.backgroundColor,
                    fontFamily: config.fontFamily,
                    fontSize: `${config.fontSize}px`,
                    borderRadius: `${config.containerBorderRadius}px`,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      backgroundColor: config.primaryColor,
                      color: config.headerTextColor,
                      padding: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>
                        {config.headerText === 'Chat with us' || !config.headerText ? t.headerTitle : config.headerText}
                      </span>
                      <span style={{ fontSize: 12, opacity: 0.9, lineHeight: 1 }}>{t.online}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* Flag icon */}
                      <span style={{ padding: 4, borderRadius: 4, marginRight: 4, display: 'flex' }} title="Report">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
                      </span>
                      {/* Headset icon */}
                      <span style={{ padding: 4, borderRadius: 4, marginRight: 4, display: 'flex' }} title="Handoff">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
                      </span>
                      {/* Expand icon */}
                      <span style={{ padding: 4, borderRadius: 4, marginRight: 4, display: 'flex' }} title="Expand">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                      </span>
                      {/* Close icon */}
                      <span style={{ padding: 4, borderRadius: 4, display: 'flex' }} title="Close">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </span>
                    </div>
                  </div>

                  {previewMode === 'survey' ? (
                    /* Post-Chat Survey Preview */
                    <div
                      className="p-4 space-y-4 flex flex-col"
                      style={{
                        height: 'calc(100% - 72px)',
                        overflowY: 'auto',
                        backgroundColor: config.formBackgroundColor || config.backgroundColor,
                      }}
                    >
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: config.formTitleColor || config.textColor }}
                        >
                          {t.postChatTitle}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: config.formDescriptionColor || '#6b7280' }}
                        >
                          {t.postChatDescription}
                        </p>
                      </div>
                      <div className="space-y-3 flex-1">
                        {/* Rating question */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: config.formLabelColor || config.textColor }}
                          >
                            {t.postChatTitle === 'How did we do?' ? 'How would you rate your experience?' : t.postChatTitle} <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className="text-xl cursor-default"
                                style={{ color: star <= 4 ? '#f59e0b' : '#d1d5db' }}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Text question */}
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: config.formLabelColor || config.textColor }}
                          >
                            Any additional feedback?
                          </label>
                          <textarea
                            placeholder={t.surveyPlaceholder}
                            disabled
                            className="w-full px-3 py-2 text-sm rounded-lg resize-none preview-form-input"
                            rows={3}
                            style={{
                              backgroundColor: config.formInputBackgroundColor || config.inputBackgroundColor,
                              color: config.formInputTextColor || config.inputTextColor,
                              border: `1px solid ${config.formBorderColor || '#e5e7eb'}`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: config.primaryColor,
                            color: config.formSubmitButtonTextColor || '#ffffff',
                          }}
                          disabled
                        >
                          {t.postChatSubmit}
                        </button>
                        <button
                          className="w-full py-2 px-4 rounded-lg text-sm"
                          style={{
                            backgroundColor: 'transparent',
                            color: '#6b7280',
                            border: 'none',
                          }}
                          disabled
                        >
                          {t.skip}
                        </button>
                      </div>
                      {config.showBranding && (
                        <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                          {t.poweredBy} AI SaaS
                        </div>
                      )}
                    </div>
                  ) : previewMode === 'verify' ? (
                    /* Verify Email Preview */
                    <div
                      className="p-4 space-y-4 flex flex-col"
                      style={{
                        height: 'calc(100% - 72px)',
                        overflowY: 'auto',
                        backgroundColor: config.formBackgroundColor || config.backgroundColor,
                      }}
                    >
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: config.formTitleColor || config.textColor }}
                        >
                          {t.memoryWelcomeBack}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: config.formDescriptionColor || '#6b7280' }}
                          dangerouslySetInnerHTML={{ __html: t.memoryFoundContext.replace('{email}', 'user@example.com') }}
                        />
                      </div>
                      <div className="space-y-3 flex-1">
                        <button
                          className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: config.primaryColor,
                            color: config.formSubmitButtonTextColor || '#ffffff',
                          }}
                          disabled
                        >
                          {t.memoryVerifyIdentity}
                        </button>
                        <button
                          className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: config.secondaryButtonColor || 'transparent',
                            color: config.secondaryButtonTextColor || '#374151',
                            border: `1px solid ${config.secondaryButtonBorderColor || '#d1d5db'}`,
                          }}
                          disabled
                        >
                          {t.memoryStartFresh}
                        </button>
                      </div>
                      {config.showBranding && (
                        <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                          {t.poweredBy} AI SaaS
                        </div>
                      )}
                    </div>
                  ) : previewMode === 'form' ? (
                    /* Pre-Chat Form Preview */
                    <div
                      className="p-4 space-y-4 flex flex-col"
                      style={{
                        height: 'calc(100% - 72px)',
                        overflowY: 'auto',
                        backgroundColor: config.formBackgroundColor || config.backgroundColor,
                      }}
                    >
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: config.formTitleColor || config.textColor }}
                        >
                          {t.preChatTitle}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: config.formDescriptionColor || '#6b7280' }}
                        >
                          {t.preChatDescription}
                        </p>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: config.formLabelColor || config.textColor }}
                          >
                            {t.fieldNameLabel} <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="text"
                            placeholder={t.fieldNamePlaceholder}
                            disabled
                            className="w-full px-3 py-2 text-sm rounded-lg preview-form-input"
                            style={{
                              backgroundColor: config.formInputBackgroundColor || config.inputBackgroundColor,
                              color: config.formInputTextColor || config.inputTextColor,
                              border: `1px solid ${config.formBorderColor || '#e5e7eb'}`,
                            }}
                          />
                        </div>
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: config.formLabelColor || config.textColor }}
                          >
                            {t.fieldEmailLabel} <span style={{ color: '#ef4444' }}>*</span>
                          </label>
                          <input
                            type="email"
                            placeholder={t.fieldEmailPlaceholder}
                            disabled
                            className="w-full px-3 py-2 text-sm rounded-lg preview-form-input"
                            style={{
                              backgroundColor: config.formInputBackgroundColor || config.inputBackgroundColor,
                              color: config.formInputTextColor || config.inputTextColor,
                              border: `1px solid ${config.formBorderColor || '#e5e7eb'}`,
                            }}
                          />
                        </div>
                      </div>
                      <button
                        className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                        style={{
                          backgroundColor: config.primaryColor,
                          color: config.formSubmitButtonTextColor || '#ffffff',
                        }}
                        disabled
                      >
                        {t.preChatSubmit}
                      </button>
                      {config.showBranding && (
                        <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                          {t.poweredBy} AI SaaS
                        </div>
                      )}
                    </div>
                  ) : previewMode === 'feedback' ? (
                    /* Feedback Follow-Up Preview */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100% - 72px)',
                        backgroundColor: config.backgroundColor,
                        padding: '16px',
                        gap: 12,
                      }}
                    >
                      {/* Bot message */}
                      <div style={{ maxWidth: '85%' }}>
                        <div style={{
                          backgroundColor: config.botBubbleColor,
                          color: config.botBubbleTextColor,
                          padding: '10px 14px',
                          borderRadius: `2px ${config.containerBorderRadius || 16}px ${config.containerBorderRadius || 16}px ${config.containerBorderRadius || 16}px`,
                          fontSize: config.fontSize || 14,
                          fontFamily: config.fontFamily || 'inherit',
                        }}>
                          {t.previewBotReply}
                        </div>
                        {/* Feedback buttons */}
                        <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
                          <span style={{ padding: 6, color: '#9ca3af', lineHeight: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
                          </span>
                          <span style={{ padding: 6, color: '#ef4444', lineHeight: 0 }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
                          </span>
                        </div>
                        {/* Follow-up prompt */}
                        <div style={{
                          marginTop: 6,
                          background: config.feedbackBackgroundColor || config.botBubbleColor,
                          borderRadius: 12,
                          padding: '10px 14px',
                          boxShadow: '0 0 0 1px rgba(0,0,0,0.04), 0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08)',
                          position: 'relative',
                        }}>
                          <div style={{
                            position: 'absolute', top: 6, right: 6, width: 20, height: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: '50%', color: config.feedbackTextColor || config.botBubbleTextColor || '#374151', opacity: 0.4,
                          }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: config.feedbackTextColor || config.botBubbleTextColor || '#374151', opacity: 0.7, marginBottom: 8 }}>
                            {t.feedbackWhatWentWrong}
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                            {[t.feedbackIncorrect, t.feedbackNotRelevant, t.feedbackTooVague, t.feedbackOther].map((label) => (
                              <span key={label} style={{
                                background: config.feedbackButtonColor || config.backgroundColor,
                                color: config.feedbackButtonTextColor || config.textColor,
                                border: '1px solid transparent',
                                borderRadius: 16,
                                padding: '5px 12px',
                                fontSize: 12,
                                fontWeight: 500,
                              }}>
                                {label}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : previewMode === 'escalation' ? (
                    /* Escalation Report Preview — full-view replacement matching actual widget */
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: 'calc(100% - 72px)',
                        backgroundColor: config.reportBackgroundColor || config.formBackgroundColor || config.backgroundColor,
                      }}
                    >
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 16px 0' }}>
                        <span
                          style={{ fontSize: 15, fontWeight: 600, color: config.reportTextColor || config.textColor }}
                        >
                          {t.reportIssue}
                        </span>
                        <span
                          className="cursor-default"
                          style={{ color: config.reportTextColor || config.textColor, opacity: 0.4 }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        </span>
                      </div>

                      {/* Body */}
                      <div style={{ flex: 1, padding: 16, overflowY: 'auto' }}>
                        {/* 3-reason grid */}
                        <div className="grid grid-cols-2 gap-2" style={{ marginBottom: 12 }}>
                          {[
                            { key: 'wrong_answer', label: t.reportWrongAnswer },
                            { key: 'offensive_content', label: t.reportOffensiveContent },
                            { key: 'other', label: t.reportOther },
                          ].map((reason) => (
                            <button
                              key={reason.key}
                              onClick={() => setSelectedReportReason(selectedReportReason === reason.key ? null : reason.key)}
                              className="px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-center"
                              style={{
                                backgroundColor: selectedReportReason === reason.key
                                  ? (config.reportReasonSelectedColor || config.primaryColor)
                                  : (config.reportReasonButtonColor || config.backgroundColor),
                                color: selectedReportReason === reason.key
                                  ? (config.reportReasonSelectedTextColor || '#ffffff')
                                  : (config.reportReasonButtonTextColor || config.textColor),
                                border: `1px solid ${selectedReportReason === reason.key
                                  ? (config.reportReasonSelectedColor || config.primaryColor)
                                  : (config.reportInputBorderColor || config.formBorderColor || '#e5e7eb')}`,
                              }}
                            >
                              {reason.label}
                            </button>
                          ))}
                        </div>

                        {/* Textarea */}
                        <textarea
                          placeholder={
                            selectedReportReason === 'wrong_answer' ? (t.reportDetailsWrongAnswer || 'What was incorrect?')
                            : selectedReportReason === 'offensive_content' ? (t.reportDetailsOffensive || 'What was offensive?')
                            : selectedReportReason === 'need_human_help' ? (t.reportDetailsHumanHelp || 'Briefly describe what you need help with...')
                            : t.reportDetailsPlaceholder
                          }
                          rows={3}
                          className="w-full px-3 py-2.5 text-sm rounded-lg resize-none preview-report-input"
                          disabled
                          style={{
                            backgroundColor: config.reportInputBackgroundColor || config.formInputBackgroundColor || config.inputBackgroundColor,
                            color: config.reportInputTextColor || config.textColor,
                            border: `1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'}`,
                            marginBottom: 0,
                          }}
                        />
                      </div>

                      {/* Footer */}
                      <div style={{ padding: '0 16px 16px' }}>
                        <button
                          className="w-full py-2.5 px-4 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: config.reportSubmitButtonColor || config.primaryColor,
                            color: config.reportSubmitButtonTextColor || '#ffffff',
                            opacity: selectedReportReason ? 1 : 0.5,
                          }}
                          disabled
                        >
                          {selectedReportReason === 'wrong_answer' ? (t.reportSubmitWrongAnswer || 'Report wrong answer')
                            : selectedReportReason === 'offensive_content' ? (t.reportSubmitOffensive || 'Report offensive content')
                            : t.reportSubmit}
                        </button>
                        {config.showBranding && (
                          <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                            {t.poweredBy} AI SaaS
                          </div>
                        )}
                      </div>
                    </div>
                  ) : previewMode === 'handoff' ? (
                    /* Handoff / Chat with a person Preview — form layout matching other tabs */
                    <div
                      className="p-4 space-y-4 flex flex-col"
                      style={{
                        height: 'calc(100% - 72px)',
                        overflowY: 'auto',
                        backgroundColor: config.reportBackgroundColor || config.formBackgroundColor || config.backgroundColor,
                      }}
                    >
                      <div>
                        <h3
                          className="font-semibold mb-1"
                          style={{ color: config.reportTextColor || config.formTitleColor || config.textColor }}
                        >
                          {t.reportConnectToHuman || 'Chat with a person'}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: config.reportTextColor || config.formDescriptionColor || '#6b7280' }}
                        >
                          {t.handoffConfirmDescription || 'A team member will join this conversation and can see your messages so far.'}
                        </p>
                      </div>
                      <div className="space-y-3 flex-1">
                        <div>
                          <label
                            className="block text-sm font-medium mb-1"
                            style={{ color: config.reportTextColor || config.formLabelColor || config.textColor }}
                          >
                            {t.reportDetailsHumanHelp || 'What can we help with? (optional)'}
                          </label>
                          <textarea
                            placeholder={t.reportDetailsHumanHelp || 'What can we help with? (optional)'}
                            rows={3}
                            className="w-full px-3 py-2 text-sm rounded-lg resize-none preview-report-input"
                            disabled
                            style={{
                              backgroundColor: config.reportInputBackgroundColor || config.formInputBackgroundColor || config.inputBackgroundColor,
                              color: config.reportInputTextColor || config.formInputTextColor || config.inputTextColor,
                              border: `1px solid ${config.reportInputBorderColor || config.formBorderColor || '#e5e7eb'}`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <button
                          className="w-full py-2 px-4 rounded-lg font-medium text-sm"
                          style={{
                            backgroundColor: config.reportSubmitButtonColor || config.primaryColor,
                            color: config.reportSubmitButtonTextColor || config.formSubmitButtonTextColor || '#ffffff',
                          }}
                          disabled
                        >
                          {t.reportSubmitHumanHelp || 'Connect to support'}
                        </button>
                        <button
                          className="w-full py-2 px-4 rounded-lg text-sm"
                          style={{
                            backgroundColor: config.secondaryButtonColor || 'transparent',
                            color: config.secondaryButtonTextColor || config.reportTextColor || config.textColor,
                            border: `1px solid ${config.secondaryButtonBorderColor || config.reportInputBorderColor || '#d1d5db'}`,
                          }}
                          disabled
                        >
                          {t.cancelLabel || 'Cancel'}
                        </button>
                      </div>
                      {config.showBranding && (
                        <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                          {t.poweredBy} AI SaaS
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Chat Preview */
                    <>
                      {/* Messages */}
                      <div className="p-4 space-y-3" style={{ height: 'calc(100% - 140px)', overflowY: 'auto' }}>
                        {/* Bot message */}
                        <div
                          className="p-3 max-w-[80%]"
                          style={{ backgroundColor: config.botBubbleColor, color: config.botBubbleTextColor, borderRadius: '8px 8px 8px 4px' }}
                        >
                          {chatbot.welcome_message || 'Hello! How can I help you today?'}
                        </div>

                        {/* User message */}
                        <div
                          className="p-3 max-w-[80%] ml-auto"
                          style={{ backgroundColor: config.userBubbleColor, color: config.userBubbleTextColor, borderRadius: '8px 8px 4px 8px' }}
                        >
                          {t.previewUserMessage}
                        </div>

                        {/* Bot reply */}
                        <div
                          className="p-3 max-w-[80%]"
                          style={{ backgroundColor: config.botBubbleColor, color: config.botBubbleTextColor, borderRadius: '8px 8px 8px 4px' }}
                        >
                          {t.previewBotReply}
                        </div>
                      </div>

                      {/* Input */}
                      <div
                        className="absolute bottom-0 left-0 right-0 p-4 border-t"
                        style={{ borderColor: '#e5e7eb', backgroundColor: config.backgroundColor }}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder={chatbot.placeholder_text || t.typePlaceholder}
                            className="preview-input flex-1 px-4 py-2 border text-sm"
                            style={{
                              backgroundColor: config.inputBackgroundColor,
                              borderColor: '#e5e7eb',
                              color: config.inputTextColor,
                              borderRadius: `${config.inputBorderRadius}px`,
                            }}
                            disabled
                          />
                          <button
                            className="p-2"
                            style={{ 
                              backgroundColor: config.sendButtonColor,
                              borderRadius: `${config.buttonBorderRadius}%`,
                            }}
                            disabled
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke={config.sendButtonIconColor}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                              />
                            </svg>
                          </button>
                        </div>
                        {config.showBranding && (
                          <div className="text-center text-xs pt-2 pb-2" style={{ color: '#9ca3af', borderTop: '1px solid #e5e7eb' }}>
                            {t.poweredBy} AI SaaS
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
