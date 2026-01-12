'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save, RotateCcw, Check, Palette, Type, Layout, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import type { Chatbot, WidgetConfig } from '@/lib/chatbots/types';
import { DEFAULT_WIDGET_CONFIG } from '@/lib/chatbots/types';

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
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="font-mono text-sm"
          placeholder="#000000"
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
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
  ];

  return (
    <div className="space-y-2">
      <Label>Widget Position</Label>
      <div className="grid grid-cols-2 gap-2">
        {positions.map((pos) => (
          <button
            key={pos.value}
            type="button"
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
          <Link
            href={`/dashboard/chatbots/${id}`}
            className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Chatbot
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
            Customize Widget
          </h1>
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
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary-500" />
                Colors
              </CardTitle>
              <CardDescription>Set your brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General */}
              <div>
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
                </div>
              </div>

              {/* Header */}
              <div>
                <h3 className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-3">Header</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorPicker
                    label="Header Text Color"
                    value={config.headerTextColor}
                    onChange={(v) => updateConfig('headerTextColor', v)}
                  />
                </div>
              </div>

              {/* Messages */}
              <div>
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
              </div>

              {/* Input Area */}
              <div>
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
              </div>

              {/* Send Button */}
              <div>
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
              </div>
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
                <Label>Font Family</Label>
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
              <CardDescription>Configure position and size</CardDescription>
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
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="showBranding"
                  checked={config.showBranding}
                  onChange={(e) => updateConfig('showBranding', e.target.checked)}
                  className="rounded border-secondary-300 dark:border-secondary-600"
                />
                <Label htmlFor="showBranding">Show "Powered by" branding</Label>
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
              <CardDescription>Add custom styles (advanced)</CardDescription>
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
        </div>

        {/* Preview Panel */}
        <div className="lg:sticky lg:top-6 h-fit">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your widget will look</CardDescription>
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
                    color: ${config.inputPlaceholderColor} !important;
                    opacity: 1;
                  }
                `}</style>
                <div
                  className="absolute rounded-lg shadow-xl overflow-hidden"
                  style={{
                    width: `${Math.min(config.width, 380)}px`,
                    height: `${Math.min(config.height, 550)}px`,
                    bottom: '20px',
                    right: config.position === 'bottom-right' ? '20px' : 'auto',
                    left: config.position === 'bottom-left' ? '20px' : 'auto',
                    backgroundColor: config.backgroundColor,
                    fontFamily: config.fontFamily,
                    fontSize: `${config.fontSize}px`,
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex items-center gap-3"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span style={{ color: config.headerTextColor }} className="text-lg">AI</span>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: config.headerTextColor }}>{config.headerText || chatbot.name}</p>
                      <p className="text-sm" style={{ color: config.headerTextColor, opacity: 0.7 }}>Online</p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 space-y-3" style={{ height: 'calc(100% - 140px)', overflowY: 'auto' }}>
                    {/* Bot message */}
                    <div
                      className="p-3 rounded-lg max-w-[80%]"
                      style={{ backgroundColor: config.botBubbleColor, color: config.botBubbleTextColor }}
                    >
                      {chatbot.welcome_message || 'Hello! How can I help you today?'}
                    </div>

                    {/* User message */}
                    <div
                      className="p-3 rounded-lg max-w-[80%] ml-auto"
                      style={{ backgroundColor: config.userBubbleColor, color: config.userBubbleTextColor }}
                    >
                      I have a question about your services.
                    </div>

                    {/* Bot reply */}
                    <div
                      className="p-3 rounded-lg max-w-[80%]"
                      style={{ backgroundColor: config.botBubbleColor, color: config.botBubbleTextColor }}
                    >
                      Of course! I&apos;d be happy to help. What would you like to know?
                    </div>
                  </div>

                  {/* Input */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-4 border-t"
                    style={{ borderColor: `${config.inputTextColor}20`, backgroundColor: config.backgroundColor }}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={chatbot.placeholder_text || 'Type your message...'}
                        className="preview-input flex-1 px-4 py-2 rounded-full border text-sm"
                        style={{
                          backgroundColor: config.inputBackgroundColor,
                          borderColor: `${config.inputTextColor}30`,
                          color: config.inputTextColor,
                        }}
                        disabled
                      />
                      <button
                        className="p-2 rounded-full"
                        style={{ backgroundColor: config.sendButtonColor }}
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
                      <p className="text-center text-xs mt-2 opacity-50" style={{ color: config.textColor }}>
                        Powered by AI SaaS
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
