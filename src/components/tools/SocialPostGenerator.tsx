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
  ChevronDown,
  ChevronUp,
  Download,
  Linkedin,
  Twitter,
  Instagram,
  Music,
  Hash,
  Share2,
  Smile,
  FileText,
  FileJson,
  Info,
} from 'lucide-react';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  type Platform,
  type PostTone,
  type PostType,
  type VariationCount,
  type GeneratedPost,
  type SocialPostResult,
  PLATFORM_CONFIG,
  POST_TYPE_CONFIG,
  TONE_CONFIG,
} from '@/lib/ai/prompts/social-post';

interface SocialPostGeneratorProps {
  className?: string;
  apiEndpoint?: string;
  apiKey?: string;
  onGenerate?: (result: SocialPostResult) => void;
}

const PLATFORM_ICONS: Record<Platform, React.ComponentType<{ className?: string }>> = {
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
  tiktok: Music,
};

const PLATFORM_COLORS: Record<Platform, string> = {
  linkedin: 'bg-blue-600',
  twitter: 'bg-black dark:bg-white dark:text-black',
  instagram: 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500',
  tiktok: 'bg-black dark:bg-white dark:text-black',
};

const POST_TYPES = Object.entries(POST_TYPE_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}));

const TONES = Object.entries(TONE_CONFIG).map(([value, config]) => ({
  value,
  label: config.label,
}));

const VARIATION_COUNTS = [
  { value: '1', label: '1 variation' },
  { value: '2', label: '2 variations' },
  { value: '3', label: '3 variations' },
  { value: '4', label: '4 variations' },
  { value: '5', label: '5 variations' },
];

export function SocialPostGenerator({
  className,
  apiEndpoint = '/api/tools/social-post',
  apiKey,
  onGenerate,
}: SocialPostGeneratorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [result, setResult] = useState<SocialPostResult | null>(null);
  const [showRepurpose, setShowRepurpose] = useState(false);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const formId = useId();

  const [formData, setFormData] = useState({
    topic: '',
    contentToRepurpose: '',
    keyPoints: '',
    platforms: ['linkedin', 'twitter'] as Platform[],
    variationCount: 3 as VariationCount,
    postType: 'thought-leadership' as PostType,
    tone: 'professional' as PostTone,
    includeHashtags: true,
    includeEmojis: true,
    callToAction: '',
    targetAudience: '',
  });

  const updateField = (field: string, value: string | number | boolean | Platform[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePlatform = (platform: Platform) => {
    setFormData((prev) => {
      const platforms = prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform];
      return { ...prev, platforms };
    });
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
        throw new Error(data.error?.message || 'Failed to generate posts');
      }

      setResult(data.data);
      setPlatformFilter('all');
      onGenerate?.(data.data);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAllPosts = async () => {
    if (!result) return;
    const allText = result.posts
      .map(
        (post) =>
          `[${PLATFORM_CONFIG[post.platform].label} - Variation ${post.variationNumber}]\n${post.content}\n${post.hashtags.length > 0 ? '\nHashtags: ' + post.hashtags.join(' ') : ''}`
      )
      .join('\n\n---\n\n');
    await copyToClipboard(allText, 'all');
  };

  const exportAsCSV = () => {
    if (!result) return;
    const headers = ['Platform', 'Variation', 'Content', 'Hashtags', 'Character Count', 'Within Limit'];
    const rows = result.posts.map((post) => [
      PLATFORM_CONFIG[post.platform].label,
      post.variationNumber.toString(),
      `"${post.content.replace(/"/g, '""')}"`,
      `"${post.hashtags.join(' ')}"`,
      post.characterCount.toString(),
      post.isWithinLimit ? 'Yes' : 'No',
    ]);

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social-posts.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const exportAsJSON = () => {
    if (!result) return;
    const json = JSON.stringify(result, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social-posts.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setShowExportMenu(false);
  };

  const isFormValid = formData.topic.length >= 5 && formData.platforms.length > 0;

  const filteredPosts = result?.posts.filter(
    (post) => platformFilter === 'all' || post.platform === platformFilter
  );

  const getCharacterCountColor = (post: GeneratedPost) => {
    const ratio = post.characterCount / post.characterLimit;
    if (ratio > 1) return 'text-red-500';
    if (ratio > 0.9) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getProgressBarColor = (post: GeneratedPost) => {
    const ratio = post.characterCount / post.characterLimit;
    if (ratio > 1) return 'bg-red-500';
    if (ratio > 0.9) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={cn('grid gap-6 lg:grid-cols-2', className)}>
      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary-500" aria-hidden="true" />
            Create Social Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-topic`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
            >
              Topic <span className="text-red-500">*</span>
            </label>
            <Textarea
              id={`${formId}-topic`}
              placeholder="What do you want to post about? e.g., 'Why remote work is the future of productivity'"
              value={formData.topic}
              onChange={(e) => updateField('topic', e.target.value)}
              className="min-h-[80px]"
              aria-required="true"
            />
            <p className="text-xs text-secondary-500">
              {formData.topic.length}/500 characters (min 5)
            </p>
          </div>

          {/* Content Repurpose Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setShowRepurpose(!showRepurpose)}
              className="flex items-center gap-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              {showRepurpose ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              Repurpose existing content (optional)
            </button>
            {showRepurpose && (
              <div className="mt-3 space-y-2">
                <Textarea
                  id={`${formId}-repurpose`}
                  placeholder="Paste a blog post, article, or any content you want to transform into social posts..."
                  value={formData.contentToRepurpose}
                  onChange={(e) => updateField('contentToRepurpose', e.target.value)}
                  className="min-h-[120px]"
                />
                <p className="text-xs text-secondary-500">
                  {formData.contentToRepurpose.length}/5000 characters
                </p>
              </div>
            )}
          </div>

          {/* Platforms */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
              Platforms <span className="text-red-500">*</span>
              <Tooltip content="Posts are tailored to each platform's character limits and audience style. Select multiple to generate cross-platform content.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Select platforms">
              {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((platform) => {
                const Icon = PLATFORM_ICONS[platform];
                const config = PLATFORM_CONFIG[platform];
                const isSelected = formData.platforms.includes(platform);

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    aria-pressed={isSelected}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{config.label}</span>
                  </button>
                );
              })}
            </div>
            {formData.platforms.length === 0 && (
              <p className="text-xs text-red-500">Select at least one platform</p>
            )}
          </div>

          {/* Post Type & Tone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-type`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1"
              >
                Post Type
                <Tooltip content="Shapes the content structure. Thought Leadership for insights, Educational for how-tos, Promotional for offers.">
                  <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
                </Tooltip>
              </label>
              <Select
                id={`${formId}-type`}
                value={formData.postType}
                onChange={(e) => updateField('postType', e.target.value)}
                options={POST_TYPES}
              />
            </div>
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
                options={TONES}
              />
            </div>
          </div>

          {/* Variation Count */}
          <div className="space-y-2">
            <label
              htmlFor={`${formId}-variations`}
              className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1"
            >
              Variations per platform
              <Tooltip content="Number of unique post versions generated for each selected platform. More variations give you options to test.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <Select
              id={`${formId}-variations`}
              value={formData.variationCount.toString()}
              onChange={(e) => updateField('variationCount', parseInt(e.target.value) as VariationCount)}
              options={VARIATION_COUNTS}
            />
            <p className="text-xs text-secondary-500">
              Will generate {formData.variationCount * formData.platforms.length} total posts
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300 flex items-center gap-1">
              Features
              <Tooltip content="Hashtags boost discoverability. Emojis increase engagement. Both are optimized per platform.">
                <Info className="w-3.5 h-3.5 text-secondary-400 cursor-help" />
              </Tooltip>
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeHashtags}
                  onChange={(e) => updateField('includeHashtags', e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <Hash className="h-4 w-4 text-secondary-500" />
                <span className="text-sm">Include hashtags</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.includeEmojis}
                  onChange={(e) => updateField('includeEmojis', e.target.checked)}
                  className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                />
                <Smile className="h-4 w-4 text-secondary-500" />
                <span className="text-sm">Include emojis</span>
              </label>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-audience`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Target Audience (optional)
              </label>
              <Input
                id={`${formId}-audience`}
                placeholder="e.g., 'SaaS founders, marketing managers'"
                value={formData.targetAudience}
                onChange={(e) => updateField('targetAudience', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-cta`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Call to Action (optional)
              </label>
              <Input
                id={`${formId}-cta`}
                placeholder="e.g., 'Sign up for our newsletter'"
                value={formData.callToAction}
                onChange={(e) => updateField('callToAction', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor={`${formId}-keypoints`}
                className="text-sm font-medium text-secondary-700 dark:text-secondary-300"
              >
                Key Points (optional)
              </label>
              <Textarea
                id={`${formId}-keypoints`}
                placeholder="Any specific points you want to include..."
                value={formData.keyPoints}
                onChange={(e) => updateField('keyPoints', e.target.value)}
                className="min-h-[60px]"
              />
            </div>
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
                Generate Posts
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
              Generated Posts
              {result && (
                <Badge variant="secondary" className="ml-2">
                  {result.totalPosts} posts
                </Badge>
              )}
            </CardTitle>
            {result && (
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
                      onClick={exportAsCSV}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      <FileText className="h-4 w-4" />
                      Export CSV
                    </button>
                    <button
                      onClick={exportAsJSON}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary-50 dark:hover:bg-secondary-700"
                    >
                      <FileJson className="h-4 w-4" />
                      Export JSON
                    </button>
                    <hr className="border-secondary-200 dark:border-secondary-700" />
                    <button
                      onClick={() => {
                        copyAllPosts();
                        setShowExportMenu(false);
                      }}
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

          {/* Platform Filter */}
          {result && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setPlatformFilter('all')}
                className={cn(
                  'px-3 py-1 text-sm rounded-full transition-colors',
                  platformFilter === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                )}
              >
                All ({result.totalPosts})
              </button>
              {result.platforms.map((platform) => {
                const config = PLATFORM_CONFIG[platform];
                const count = result.posts.filter((p) => p.platform === platform).length;
                return (
                  <button
                    key={platform}
                    onClick={() => setPlatformFilter(platform)}
                    className={cn(
                      'px-3 py-1 text-sm rounded-full transition-colors',
                      platformFilter === platform
                        ? 'bg-primary-500 text-white'
                        : 'bg-secondary-100 dark:bg-secondary-800 hover:bg-secondary-200 dark:hover:bg-secondary-700'
                    )}
                  >
                    {config.label} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!result ? (
            <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
              <Share2 className="h-12 w-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
              <p>Your generated posts will appear here.</p>
              <p className="text-sm mt-2">
                Fill out the form and click &quot;Generate Posts&quot; to get started.
              </p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredPosts?.map((post, index) => {
                const Icon = PLATFORM_ICONS[post.platform];
                const postId = `${post.platform}-${post.variationNumber}`;

                return (
                  <div
                    key={postId}
                    className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4 space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex items-center justify-center w-8 h-8 rounded-full text-white',
                            PLATFORM_COLORS[post.platform]
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-sm">
                          {PLATFORM_CONFIG[post.platform].label}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Variation {post.variationNumber}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(post.content, postId)}
                        aria-label={copied === postId ? 'Copied!' : 'Copy post'}
                      >
                        {copied === postId ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="text-sm whitespace-pre-wrap text-secondary-700 dark:text-secondary-300 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-3">
                      {post.content}
                    </div>

                    {/* Character Count */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={getCharacterCountColor(post)}>
                          {post.characterCount} / {post.characterLimit} characters
                        </span>
                        {!post.isWithinLimit && (
                          <span className="text-red-500 font-medium">Over limit!</span>
                        )}
                      </div>
                      <div className="h-1.5 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                        <div
                          className={cn('h-full transition-all', getProgressBarColor(post))}
                          style={{
                            width: `${Math.min((post.characterCount / post.characterLimit) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Hash className="h-4 w-4 text-secondary-400" />
                        {post.hashtags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-xs text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2"
                          onClick={() => copyToClipboard(post.hashtags.join(' '), `${postId}-hashtags`)}
                          aria-label="Copy hashtags"
                        >
                          {copied === `${postId}-hashtags` ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
