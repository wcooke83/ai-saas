'use client';

import { useState, useId } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Copy,
  Check,
  Sparkles,
  Download,
  ChevronDown,
  FileText,
  FileJson,
  Megaphone,
  Search,
  Layout,
  Linkedin,
  Twitter,
  Music,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  type AdPlatform,
  type AdTone,
  type AdCopyOutput,
  type GeneratedAd,
  type AdField,
  PLATFORM_CONFIGS,
  TONE_CONFIGS,
  exportAdsAsCSV,
  copyAdAsText,
} from '@/lib/ai/prompts/ad-copy';

interface AdCopyGeneratorProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: AdCopyOutput) => void;
}

const PLATFORM_ICONS: Record<AdPlatform, React.ComponentType<{ className?: string }>> = {
  'google-search': Search,
  'google-display': Layout,
  meta: ImageIcon,
  linkedin: Linkedin,
  twitter: Twitter,
  tiktok: Music,
  pinterest: ImageIcon,
};

const PLATFORM_COLORS: Record<AdPlatform, string> = {
  'google-search': 'bg-blue-500',
  'google-display': 'bg-green-500',
  meta: 'bg-blue-600',
  linkedin: 'bg-blue-700',
  twitter: 'bg-black dark:bg-white dark:text-black',
  tiktok: 'bg-black dark:bg-white dark:text-black',
  pinterest: 'bg-red-600',
};

const PLATFORM_OPTIONS = Object.entries(PLATFORM_CONFIGS).map(([value, config]) => ({
  value,
  label: config.name,
  description: config.description,
}));

const TONE_OPTIONS = Object.entries(TONE_CONFIGS).map(([value, config]) => ({
  value,
  label: config.name,
}));

const VARIATION_OPTIONS = [
  { value: '1', label: '1 variation' },
  { value: '2', label: '2 variations' },
  { value: '3', label: '3 variations' },
];

export function AdCopyGenerator({
  className,
  apiEndpoint = '/api/tools/ad-copy',
  apiKey,
  onGenerate,
}: AdCopyGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [result, setResult] = useState<AdCopyOutput | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const formId = useId();

  const [formData, setFormData] = useState({
    platform: 'google-search' as AdPlatform,
    productName: '',
    productDescription: '',
    targetAudience: '',
    keyBenefits: '',
    tone: 'professional' as AdTone,
    ctaGoal: '',
    landingPageUrl: '',
    variationCount: 3,
  });

  // Editable ads state (separate from API result)
  const [editableAds, setEditableAds] = useState<GeneratedAd[] | null>(null);

  const updateField = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error?.message || 'Failed to generate ad copy');
      }

      setResult(data.data);
      setEditableAds(data.data.ads);
      onGenerate?.(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdField = (adIndex: number, fieldName: string, value: string) => {
    if (!editableAds) return;

    setEditableAds((prev) => {
      if (!prev) return prev;
      const updated = [...prev];
      const adFields = updated[adIndex].fields.map((f) => {
        if (f.name === fieldName) {
          const characterCount = value.length;
          return {
            ...f,
            value,
            characterCount,
            isWithinLimit: characterCount <= f.characterLimit,
          };
        }
        return f;
      });
      updated[adIndex] = {
        ...updated[adIndex],
        fields: adFields,
        allWithinLimits: adFields.every((f) => f.isWithinLimit),
      };
      return updated;
    });
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const exportCSV = () => {
    if (!editableAds) return;
    const output: AdCopyOutput = {
      platform: formData.platform,
      ads: editableAds,
    };
    const csv = exportAdsAsCSV(output);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.platform}-ads.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportJSON = () => {
    if (!editableAds) return;
    const output: AdCopyOutput = {
      platform: formData.platform,
      ads: editableAds,
    };
    const json = JSON.stringify(output, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.platform}-ads.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const copyAllAds = async () => {
    if (!editableAds) return;
    const allText = editableAds
      .map((ad) => `[Variation ${ad.variationNumber}]\n${copyAdAsText(ad)}`)
      .join('\n\n---\n\n');
    await copyToClipboard(allText, 'all');
    setShowExportMenu(false);
  };

  const isFormValid =
    formData.productName.length >= 1 &&
    formData.productDescription.length >= 10 &&
    formData.targetAudience.length >= 5 &&
    formData.keyBenefits.length >= 5 &&
    formData.ctaGoal.length >= 3;

  const getCharCountColor = (field: AdField) => {
    const ratio = field.characterCount / field.characterLimit;
    if (ratio > 1) return 'text-red-500 dark:text-red-400';
    if (ratio > 0.9) return 'text-yellow-500 dark:text-yellow-400';
    return 'text-green-500 dark:text-green-400';
  };

  const getProgressBarColor = (field: AdField) => {
    const ratio = field.characterCount / field.characterLimit;
    if (ratio > 1) return 'bg-red-500';
    if (ratio > 0.9) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const platformConfig = PLATFORM_CONFIGS[formData.platform];
  const Icon = PLATFORM_ICONS[formData.platform];

  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Create Ad Copy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Platform <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PLATFORM_OPTIONS.map((platform) => {
                const PlatformIcon = PLATFORM_ICONS[platform.value as AdPlatform];
                const isSelected = formData.platform === platform.value;
                return (
                  <button
                    key={platform.value}
                    type="button"
                    onClick={() => updateField('platform', platform.value)}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all text-center',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                        : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                    )}
                  >
                    <PlatformIcon className="h-5 w-5" />
                    <span className="text-xs font-medium">{platform.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              {platformConfig.description}
            </p>
          </div>

          {/* Product Name */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-name`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Product/Service Name <span className="text-red-500">*</span>
            </label>
            <Input
              id={`${formId}-name`}
              placeholder="e.g., TaskFlow Pro"
              value={formData.productName}
              onChange={(e) => updateField('productName', e.target.value)}
            />
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-desc`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Product Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              id={`${formId}-desc`}
              placeholder="Describe your product or service in detail..."
              value={formData.productDescription}
              onChange={(e) => updateField('productDescription', e.target.value)}
              className="min-h-[80px]"
            />
            <p className="text-xs text-secondary-500">
              {formData.productDescription.length}/1000 (min 10)
            </p>
          </div>

          {/* Target Audience */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-audience`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Target Audience <span className="text-red-500">*</span>
            </label>
            <Input
              id={`${formId}-audience`}
              placeholder="e.g., Busy project managers at tech startups"
              value={formData.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
            />
          </div>

          {/* Key Benefits */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-benefits`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Key Benefits <span className="text-red-500">*</span>
            </label>
            <Textarea
              id={`${formId}-benefits`}
              placeholder="e.g., Save 10 hours/week, AI-powered task prioritization, seamless integrations"
              value={formData.keyBenefits}
              onChange={(e) => updateField('keyBenefits', e.target.value)}
              className="min-h-[60px]"
            />
          </div>

          {/* Tone & Variations */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-tone`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Tone
              </label>
              <Select
                id={`${formId}-tone`}
                value={formData.tone}
                onChange={(e) => updateField('tone', e.target.value)}
                options={TONE_OPTIONS}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-variations`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Variations
              </label>
              <Select
                id={`${formId}-variations`}
                value={formData.variationCount.toString()}
                onChange={(e) => updateField('variationCount', parseInt(e.target.value))}
                options={VARIATION_OPTIONS}
              />
            </div>
          </div>

          {/* CTA Goal */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-cta`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              CTA Goal <span className="text-red-500">*</span>
            </label>
            <Input
              id={`${formId}-cta`}
              placeholder="e.g., Start free trial, Get a demo, Sign up now"
              value={formData.ctaGoal}
              onChange={(e) => updateField('ctaGoal', e.target.value)}
            />
          </div>

          {/* Landing Page URL */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-url`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Landing Page URL (optional)
            </label>
            <Input
              id={`${formId}-url`}
              type="url"
              placeholder="https://example.com/landing"
              value={formData.landingPageUrl}
              onChange={(e) => updateField('landingPageUrl', e.target.value)}
            />
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!isFormValid || isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                Generate Ad Copy
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary-500" aria-hidden="true" />
              Generated Ads
              {editableAds && (
                <Badge variant="secondary" className="ml-2">
                  {editableAds.length} variations
                </Badge>
              )}
            </CardTitle>
            {editableAds && (
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-white dark:bg-secondary-800 shadow-lg z-10">
                    <button
                      onClick={exportCSV}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      <FileText className="h-4 w-4" />
                      Export CSV
                    </button>
                    <button
                      onClick={exportJSON}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      <FileJson className="h-4 w-4" />
                      Export JSON
                    </button>
                    <hr className="border-secondary-200 dark:border-secondary-700" />
                    <button
                      onClick={copyAllAds}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      {copied === 'all' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      Copy All
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!editableAds ? (
            <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
              <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>Your generated ads will appear here.</p>
              <p className="text-sm mt-2">
                Fill out the form and click &quot;Generate Ad Copy&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[700px] overflow-y-auto pr-2">
              {editableAds.map((ad, adIndex) => (
                <div
                  key={ad.variationNumber}
                  className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 space-y-4"
                >
                  {/* Ad Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          'flex items-center justify-center w-8 h-8 rounded-full text-white',
                          PLATFORM_COLORS[formData.platform]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-medium">Variation {ad.variationNumber}</span>
                      {ad.allWithinLimits ? (
                        <Badge variant="success" className="text-xs">
                          <Check className="h-3 w-3 mr-1" />
                          All within limits
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Over limit
                        </Badge>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(copyAdAsText(ad), `ad-${ad.variationNumber}`)}
                    >
                      {copied === `ad-${ad.variationNumber}` ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  {/* Ad Fields */}
                  <div className="space-y-4">
                    {ad.fields.map((field) => (
                      <div key={field.name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                            {field.label}
                          </label>
                          <span className={cn('text-xs font-medium', getCharCountColor(field))}>
                            {field.characterCount}/{field.characterLimit}
                            {!field.isWithinLimit && ' ⚠️'}
                          </span>
                        </div>
                        {field.isMultiline ? (
                          <Textarea
                            value={field.value}
                            onChange={(e) => updateAdField(adIndex, field.name, e.target.value)}
                            className={cn(
                              'min-h-[60px]',
                              !field.isWithinLimit && 'border-red-500 focus:ring-red-500'
                            )}
                          />
                        ) : (
                          <Input
                            value={field.value}
                            onChange={(e) => updateAdField(adIndex, field.name, e.target.value)}
                            className={cn(
                              !field.isWithinLimit && 'border-red-500 focus:ring-red-500'
                            )}
                          />
                        )}
                        {/* Progress bar */}
                        <div className="h-1 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full transition-all', getProgressBarColor(field))}
                            style={{
                              width: `${Math.min((field.characterCount / field.characterLimit) * 100, 100)}%`,
                            }}
                          />
                        </div>
                        {/* Copy field button */}
                        <div className="flex justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-xs"
                            onClick={() =>
                              copyToClipboard(field.value, `field-${ad.variationNumber}-${field.name}`)
                            }
                          >
                            {copied === `field-${ad.variationNumber}-${field.name}` ? (
                              <>
                                <Check className="h-3 w-3 mr-1 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
