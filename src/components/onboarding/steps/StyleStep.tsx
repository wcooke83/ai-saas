'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ArrowRight, Check, ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useOnboarding } from '@/components/onboarding/OnboardingContext';
import { DEFAULT_WIDGET_CONFIG, type WidgetConfig } from '@/lib/chatbots/types';

const COLOR_PRESETS = [
  { value: '#0ea5e9', name: 'Blue' },
  { value: '#8b5cf6', name: 'Purple' },
  { value: '#10b981', name: 'Green' },
  { value: '#f59e0b', name: 'Amber' },
  { value: '#ef4444', name: 'Red' },
  { value: '#ec4899', name: 'Pink' },
  { value: '#6366f1', name: 'Indigo' },
  { value: '#0f172a', name: 'Dark' },
] as const;

const POSITIONS: Array<{ value: WidgetConfig['position']; label: string }> = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' },
];

/** Returns a dot position CSS class for the position indicator visual */
function dotPosition(pos: WidgetConfig['position']): string {
  switch (pos) {
    case 'top-left':
      return 'top-1 left-1';
    case 'top-right':
      return 'top-1 right-1';
    case 'bottom-left':
      return 'bottom-1 left-1';
    case 'bottom-right':
      return 'bottom-1 right-1';
  }
}

export function StyleStep() {
  const { chatbotId, chatbot, loading: ctxLoading, goToStep, completeCurrentStep } = useOnboarding();

  const [primaryColor, setPrimaryColor] = useState(DEFAULT_WIDGET_CONFIG.primaryColor);
  const [position, setPosition] = useState<WidgetConfig['position']>(DEFAULT_WIDGET_CONFIG.position);
  const [saving, setSaving] = useState(false);
  const [customColorOpen, setCustomColorOpen] = useState(false);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Seed local state from chatbot's existing widget_config
  useEffect(() => {
    if (!chatbot?.widget_config) return;
    const wc = chatbot.widget_config;
    if (wc.primaryColor) setPrimaryColor(wc.primaryColor);
    if (wc.position) setPosition(wc.position);
  }, [chatbot?.widget_config]);

  // Notify the iframe preview whenever color/position changes
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe?.contentWindow) return;
    iframe.contentWindow.postMessage(
      { type: 'widget-config-update', config: { primaryColor, position } },
      '*'
    );
  }, [primaryColor, position]);

  const isPresetColor = COLOR_PRESETS.some((p) => p.value === primaryColor);

  const handleSaveAndNext = async () => {
    if (!chatbotId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          widget_config: {
            ...(chatbot?.widget_config || {}),
            primaryColor,
            position,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Could not save your style settings. Please try again.');
      }
      await completeCurrentStep();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not save your style settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const previewUrl =
    typeof window !== 'undefined' && chatbotId
      ? `${window.location.origin}/widget/${chatbotId}?preview=true`
      : '';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Style your widget
        </h2>
        <p className="mt-1 text-secondary-500 dark:text-secondary-400">
          Pick a color and position for the chat widget on your site. You can change this anytime.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        {/* Controls */}
        <div className="space-y-8">
          {/* Primary Color */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Widget colour
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  aria-label={preset.name}
                  aria-pressed={primaryColor === preset.value}
                  onClick={() => {
                    setPrimaryColor(preset.value);
                    setCustomColorOpen(false);
                  }}
                  className="relative h-9 w-9 rounded-full border-2 motion-safe:transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:ring-offset-secondary-900"
                  style={{
                    backgroundColor: preset.value,
                    borderColor:
                      primaryColor === preset.value
                        ? preset.value
                        : 'transparent',
                    boxShadow:
                      primaryColor === preset.value
                        ? `0 0 0 2px rgb(var(--card-bg)), 0 0 0 4px ${preset.value}`
                        : undefined,
                  }}
                >
                  {primaryColor === preset.value && (
                    <Check className="absolute inset-0 m-auto h-4 w-4 text-white drop-shadow-sm" />
                  )}
                </button>
              ))}

              {/* Custom color trigger */}
              <div className="relative">
                <button
                  type="button"
                  aria-label="Custom color"
                  aria-pressed={customColorOpen || (!isPresetColor && primaryColor !== DEFAULT_WIDGET_CONFIG.primaryColor)}
                  onClick={() => {
                    setCustomColorOpen(true);
                    // Small delay so the input renders before we try to click it
                    setTimeout(() => colorInputRef.current?.click(), 50);
                  }}
                  className="flex h-9 items-center gap-1.5 rounded-full border border-secondary-300 dark:border-secondary-600 px-3 text-xs font-medium text-secondary-600 dark:text-secondary-400 motion-safe:transition-colors hover:border-secondary-400 dark:hover:border-secondary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:ring-offset-secondary-900"
                >
                  {!isPresetColor && (
                    <span
                      className="h-4 w-4 rounded-full border border-secondary-300 dark:border-secondary-600"
                      style={{ backgroundColor: primaryColor }}
                    />
                  )}
                  Custom
                </button>
                <input
                  ref={colorInputRef}
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  aria-label="Custom color picker"
                  tabIndex={-1}
                />
              </div>
            </div>
          </div>

          {/* Widget Position */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Widget Position
            </label>
            <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Widget Position">
              {POSITIONS.map((pos) => (
                <button
                  key={pos.value}
                  type="button"
                  role="radio"
                  aria-checked={position === pos.value}
                  onClick={() => setPosition(pos.value)}
                  className={`relative flex items-center gap-3 rounded-lg border p-3 text-sm font-medium motion-safe:transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:ring-offset-secondary-900 ${
                    position === pos.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'border-secondary-200 dark:border-secondary-700 text-secondary-700 dark:text-secondary-300 hover:border-secondary-300 dark:hover:border-secondary-600'
                  }`}
                >
                  {/* Mini position indicator */}
                  <span className="relative h-7 w-7 flex-shrink-0 rounded border border-secondary-300 dark:border-secondary-600 bg-secondary-50 dark:bg-secondary-800">
                    <span
                      className={`absolute h-2 w-2 rounded-full ${dotPosition(pos.value)}`}
                      style={{
                        backgroundColor:
                          position === pos.value ? primaryColor : 'rgb(var(--text-secondary))',
                      }}
                    />
                  </span>
                  {pos.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview -- shorter on mobile, taller on larger screens */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
            Preview
          </p>
          <div className="relative overflow-hidden rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-900 h-[320px] sm:h-[400px] lg:h-[480px]">
            {previewUrl ? (
              <iframe
                ref={iframeRef}
                src={previewUrl}
                title="Widget preview"
                className="h-full w-full border-0"
                sandbox="allow-scripts allow-same-origin"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-secondary-400">
                Preview unavailable
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col gap-3 border-t border-secondary-200 dark:border-secondary-700 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="ghost"
          onClick={() => goToStep(3)}
          disabled={saving || ctxLoading}
          className="self-start"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={() => completeCurrentStep()}
            disabled={saving || ctxLoading}
            className="text-sm text-center text-secondary-500 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-200 motion-safe:transition-colors disabled:opacity-50"
          >
            Skip for now
          </button>
          <Button onClick={handleSaveAndNext} disabled={saving || ctxLoading} size="lg" className="w-full sm:w-auto">
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 motion-safe:animate-spin" />
                Saving...
              </>
            ) : (
              <>
                Next: Deploy your chatbot
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
