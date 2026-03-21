'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  Bot,
  Shield,
  MessageSquare,
  ClipboardList,
  Star,
  Plus,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  Brain,
  Cpu,
  Paperclip,
  Zap,
  Mail,
  Palette,
  Flag,
  Send,
  Headphones,
  ExternalLink,
  Users,
  Upload,
  X,
  Image,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import {
  SYSTEM_PROMPT_TEMPLATES,
  DEFAULT_PRE_CHAT_FORM_CONFIG,
  DEFAULT_POST_CHAT_SURVEY_CONFIG,
  DEFAULT_FILE_UPLOAD_CONFIG,
  DEFAULT_PROACTIVE_MESSAGES_CONFIG,
  DEFAULT_TRANSCRIPT_CONFIG,
  DEFAULT_ESCALATION_CONFIG,
  DEFAULT_TELEGRAM_CONFIG,
  DEFAULT_LIVE_HANDOFF_CONFIG,
} from '@/lib/chatbots/types';
import { SUPPORTED_LANGUAGES, getLanguageName, getDefaultTextsForLanguage } from '@/lib/chatbots/translations';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { TranslationReviewModal, hasCustomText } from '@/components/chatbots/TranslationReviewModal';
import type {
  Chatbot,
  PreChatFormConfig,
  PreChatFormField,
  PreChatFieldType,
  PostChatSurveyConfig,
  SurveyQuestion,
  SurveyQuestionType,
} from '@/lib/chatbots/types';
import type { FileUploadConfig, ProactiveMessagesConfig, ProactiveMessageRule, ProactiveTriggerType, ProactiveDisplayMode, ProactiveBubblePosition, ProactiveBubbleStyle, TranscriptConfig, EscalationConfig, LiveHandoffConfig, TelegramConfig } from '@/lib/chatbots/types';
import { DEFAULT_BUBBLE_STYLE } from '@/lib/chatbots/types';
import { H1 } from '@/components/ui/heading';

// Compute whether translation warnings should show based on DB timestamps
function computeWarningsFromBot(bot: Chatbot): boolean {
  if (bot.language === 'en') return false;
  // If language was changed more recently than text was updated, show warnings
  if (!bot.language_updated_at) return false;
  if (!bot.custom_text_updated_at) return true;
  return new Date(bot.custom_text_updated_at) < new Date(bot.language_updated_at);
}

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatbotSettingsPage({ params }: SettingsPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('general');
  const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);
  const [translateModalSection, setTranslateModalSection] = useState<'pre-chat' | 'post-chat' | 'general' | 'both'>('both');

  // Per-section translation warning state
  // Warnings appear when language changes, disappear when that section's text is updated
  const [showGeneralWarning, setShowGeneralWarning] = useState(false);
  const [showPreChatWarning, setShowPreChatWarning] = useState(false);
  const [showPostChatWarning, setShowPostChatWarning] = useState(false);

  // Language change confirm dialog state
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  // Ref to carry translated values from onApply to handleSave (avoids stale closure)
  const saveOverridesRef = useRef<Record<string, unknown> | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [enablePromptProtection, setEnablePromptProtection] = useState(true);
  const [placeholderText, setPlaceholderText] = useState('');
  const [language, setLanguage] = useState('en');
  const [preChatConfig, setPreChatConfig] = useState<PreChatFormConfig>(DEFAULT_PRE_CHAT_FORM_CONFIG);
  const [postChatConfig, setPostChatConfig] = useState<PostChatSurveyConfig>(DEFAULT_POST_CHAT_SURVEY_CONFIG);
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [memoryDays, setMemoryDays] = useState(30);
  const [sessionTtlHours, setSessionTtlHours] = useState(24);
  const [fileUploadConfig, setFileUploadConfig] = useState<FileUploadConfig>(DEFAULT_FILE_UPLOAD_CONFIG);
  const [proactiveConfig, setProactiveConfig] = useState<ProactiveMessagesConfig>(DEFAULT_PROACTIVE_MESSAGES_CONFIG);
  const [transcriptConfig, setTranscriptConfig] = useState<TranscriptConfig>(DEFAULT_TRANSCRIPT_CONFIG);
  const [escalationConfig, setEscalationConfig] = useState<EscalationConfig>(DEFAULT_ESCALATION_CONFIG);
  const [liveHandoffConfig, setLiveHandoffConfig] = useState<LiveHandoffConfig>(DEFAULT_LIVE_HANDOFF_CONFIG);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>(DEFAULT_TELEGRAM_CONFIG);
  const [telegramWebhookStatus, setTelegramWebhookStatus] = useState<string | null>(null);
  const [settingUpWebhook, setSettingUpWebhook] = useState(false);
  const [modelTier, setModelTier] = useState<'fast' | 'balanced' | 'powerful'>('fast');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(1024);
  const [liveFetchThreshold, setLiveFetchThreshold] = useState(0.80);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            router.push('/dashboard/chatbots');
            return;
          }
          throw new Error('Failed to fetch chatbot');
        }
        const data = await response.json();
        const bot = data.data.chatbot as Chatbot;
        setChatbot(bot);
        setName(bot.name);
        setDescription(bot.description || '');
        setWelcomeMessage(bot.welcome_message || '');
        setSystemPrompt(bot.system_prompt || '');
        setEnablePromptProtection(bot.enable_prompt_protection ?? true);
        setPlaceholderText(bot.placeholder_text || '');
        setLanguage(bot.language || 'en');
        setPreChatConfig(bot.pre_chat_form_config || DEFAULT_PRE_CHAT_FORM_CONFIG);
        setPostChatConfig(bot.post_chat_survey_config || DEFAULT_POST_CHAT_SURVEY_CONFIG);
        setMemoryEnabled(bot.memory_enabled ?? false);
        setMemoryDays(bot.memory_days ?? 30);
        setSessionTtlHours((bot as any).session_ttl_hours ?? 24);
        setFileUploadConfig(bot.file_upload_config ? { ...DEFAULT_FILE_UPLOAD_CONFIG, ...bot.file_upload_config } as FileUploadConfig : DEFAULT_FILE_UPLOAD_CONFIG);
        setProactiveConfig(bot.proactive_messages_config ? { ...DEFAULT_PROACTIVE_MESSAGES_CONFIG, ...bot.proactive_messages_config } as ProactiveMessagesConfig : DEFAULT_PROACTIVE_MESSAGES_CONFIG);
        setTranscriptConfig(bot.transcript_config ? { ...DEFAULT_TRANSCRIPT_CONFIG, ...bot.transcript_config } as TranscriptConfig : DEFAULT_TRANSCRIPT_CONFIG);
        setEscalationConfig(bot.escalation_config ? { ...DEFAULT_ESCALATION_CONFIG, ...bot.escalation_config } as EscalationConfig : DEFAULT_ESCALATION_CONFIG);
        setLiveHandoffConfig(bot.live_handoff_config ? { ...DEFAULT_LIVE_HANDOFF_CONFIG, ...bot.live_handoff_config } as LiveHandoffConfig : DEFAULT_LIVE_HANDOFF_CONFIG);
        setTelegramConfig(bot.telegram_config ? { ...DEFAULT_TELEGRAM_CONFIG, ...bot.telegram_config } as TelegramConfig : DEFAULT_TELEGRAM_CONFIG);
        // Initialize AI model settings
        const model = (bot as any).model || '';
        if (model.includes('opus') || model === 'powerful') setModelTier('powerful');
        else if (model.includes('sonnet') || model === 'balanced') setModelTier('balanced');
        else if (model.includes('haiku') || model === 'fast') setModelTier('fast');
        else setModelTier('fast');
        setTemperature((bot as any).temperature ?? 0.7);
        setMaxTokens((bot as any).max_tokens ?? 1024);
        setLiveFetchThreshold((bot as any).live_fetch_threshold ?? 0.80);
        setLogoUrl(bot.logo_url || null);
        // Initialize translation warnings from DB timestamps
        const needsWarning = computeWarningsFromBot(bot);
        setShowGeneralWarning(needsWarning);
        setShowPreChatWarning(needsWarning);
        setShowPostChatWarning(needsWarning);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbot();
  }, [id, router]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error('Chatbot name is required');
      return;
    }
    if (systemPrompt.trim().length < 10) {
      toast.error('System prompt must be at least 10 characters');
      return;
    }

    setSaving(true);
    try {
      // Use ref overrides if available (from translate modal Apply & Save)
      const overrides = saveOverridesRef.current;
      saveOverridesRef.current = null;

      const response = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          welcome_message: ((overrides?.welcome_message as string) ?? welcomeMessage).trim(),
          system_prompt: systemPrompt.trim(),
          enable_prompt_protection: enablePromptProtection,
          placeholder_text: ((overrides?.placeholder_text as string) ?? placeholderText).trim(),
          language,
          memory_enabled: memoryEnabled,
          memory_days: memoryDays,
          session_ttl_hours: sessionTtlHours,
          pre_chat_form_config: (overrides?.pre_chat_form_config as PreChatFormConfig) ?? preChatConfig,
          post_chat_survey_config: (overrides?.post_chat_survey_config as PostChatSurveyConfig) ?? postChatConfig,
          file_upload_config: fileUploadConfig,
          proactive_messages_config: proactiveConfig,
          transcript_config: transcriptConfig,
          escalation_config: escalationConfig,
          live_handoff_config: liveHandoffConfig,
          telegram_config: telegramConfig,
          model: modelTier,
          temperature,
          max_tokens: maxTokens,
          live_fetch_threshold: liveFetchThreshold,
          logo_url: logoUrl,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || 'Failed to save settings');
      }

      const data = await response.json();
      setChatbot(data.data.chatbot);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="w-12 h-12 rounded-lg" />
          <div>
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-5 w-20 mt-1" />
          </div>
        </div>
        <div className="lg:flex lg:gap-8">
          <Skeleton className="hidden lg:block w-56 h-80 rounded-lg flex-shrink-0" />
          <Skeleton className="flex-1 h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error || 'Chatbot not found'}</p>
        <Button variant="outline" asChild className="mt-4">
          <Link href="/dashboard/chatbots">Back to Chatbots</Link>
        </Button>
      </div>
    );
  }

  const hasPlaceholderWarning = !preChatConfig.enabled && /\{\{\w+\}\}/.test(welcomeMessage);

  const sections = [
    { id: 'general', label: 'General', icon: Bot, warning: hasPlaceholderWarning },
    { id: 'prompt', label: 'System Prompt', icon: MessageSquare },
    { id: 'ai-model', label: 'AI Model', icon: Cpu },
    { id: 'memory', label: 'Memory', icon: Brain },
    { id: 'pre-chat', label: 'Pre-Chat Form', icon: ClipboardList },
    { id: 'post-chat', label: 'Post-Chat Survey', icon: Star },
    { id: 'file-uploads', label: 'File Uploads', icon: Paperclip },
    { id: 'proactive', label: 'Proactive', icon: Zap },
    { id: 'transcripts', label: 'Transcripts', icon: Mail },
    { id: 'escalations', label: 'Reporting', icon: Flag },
    { id: 'handoff', label: 'Live Handoff', icon: Headphones },
  ];

  const statusColors: Record<string, string> = {
    draft: 'bg-secondary-100 text-secondary-700 dark:bg-secondary-800 dark:text-secondary-300',
    active: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    paused: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300',
    archived: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/dashboard/chatbots/${id}`}
            className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to {chatbot.name}
          </Link>
          <div className="flex items-center gap-4">
            {chatbot.logo_url ? (
              <img
                src={chatbot.logo_url}
                alt={chatbot.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div>
              <H1 variant="dashboard">
                Settings
              </H1>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={statusColors[chatbot.status]}>
                  {chatbot.status}
                </Badge>
                {chatbot.is_published && (
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
                    Published
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Mobile section nav */}
      <div className="lg:hidden overflow-x-auto -mx-1 px-1 pb-1">
        <div className="flex gap-1 p-1 bg-secondary-100 dark:bg-secondary-800 rounded-lg min-w-max">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap',
                activeSection === section.id
                  ? 'bg-white dark:bg-secondary-700 text-secondary-900 dark:text-secondary-100 shadow-sm'
                  : 'text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100'
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
              {'warning' in section && section.warning && (
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div className="lg:flex lg:gap-8">
        {/* Desktop sidebar nav */}
        <nav className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-6 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  activeSection === section.id
                    ? 'bg-primary-50 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800 hover:text-secondary-900 dark:hover:text-secondary-100'
                )}
              >
                <section.icon className="w-4 h-4 flex-shrink-0" />
                {section.label}
                {'warning' in section && section.warning && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">

      {/* General Settings */}
      {activeSection === 'general' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary-500" />
              General Settings
            </CardTitle>
            <CardDescription className="pb-3">
              Basic information about your chatbot
            </CardDescription>
            {/* Translation Warning for General Text */}
            {showGeneralWarning && (
              <div className="mt-6 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-amber-800 dark:text-amber-200">
                    You have custom text (welcome message or placeholder) but the chatbot language is{' '}
                    <strong>{getLanguageName(language)}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setTranslateModalSection('general');
                      setIsTranslateModalOpen(true);
                    }}
                    className="mt-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
                  >
                    Translate to {getLanguageName(language)}
                  </button>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Chatbot Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My Support Bot"
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    if (newLang !== language) {
                      setPendingLanguage(newLang);
                      setIsLanguageDialogOpen(true);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.name})
                    </option>
                  ))}
                </select>
                <p className="text-xs text-secondary-500">
                  Controls both the widget UI text and the language the AI responds in
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description">Description</Label>
                <Tooltip content="A brief description of what your chatbot does. This helps you identify the chatbot in your dashboard.">
                  <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                </Tooltip>
              </div>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A helpful chatbot for answering customer questions..."
                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                maxLength={500}
              />
              <p className="text-xs text-secondary-500">
                {description.length}/500 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {logoUrl ? (
                  <div className="relative group">
                    <img src={logoUrl} alt="Logo" className="w-16 h-16 rounded-lg object-cover border border-secondary-200 dark:border-secondary-700" />
                    <button
                      type="button"
                      onClick={() => setLogoUrl(null)}
                      className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-secondary-100 dark:bg-secondary-800 rounded-lg flex items-center justify-center border-2 border-dashed border-secondary-300 dark:border-secondary-600">
                    <Image className="w-6 h-6 text-secondary-400" />
                  </div>
                )}
                <div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 2 * 1024 * 1024) {
                          toast.error('Logo must be under 2MB');
                          return;
                        }
                        setUploadingLogo(true);
                        try {
                          const { getClient } = await import('@/lib/supabase/client');
                          const supabase = getClient();
                          const ext = file.name.split('.').pop() || 'png';
                          const path = `logos/${id}.${ext}`;
                          const { error: uploadError } = await supabase.storage
                            .from('chat-attachments')
                            .upload(path, file, { upsert: true });
                          if (uploadError) throw uploadError;
                          const { data: urlData } = supabase.storage
                            .from('chat-attachments')
                            .getPublicUrl(path);
                          setLogoUrl(urlData.publicUrl);
                          toast.success('Logo uploaded — click Save to apply');
                        } catch (err) {
                          toast.error(err instanceof Error ? err.message : 'Upload failed');
                        } finally {
                          setUploadingLogo(false);
                          e.target.value = '';
                        }
                      }}
                    />
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-secondary-300 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-800 transition-colors">
                      {uploadingLogo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
                    </span>
                  </label>
                  <p className="text-xs text-secondary-500 mt-1">PNG, JPG, WebP, or SVG. Max 2MB.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="welcome_message">Welcome Message</Label>
                  <Tooltip content="The first message your chatbot sends when a visitor opens the chat. Use {{name}}, {{email}}, {{company_name}}, or any other field label from your pre-chat form to personalize the message.">
                    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  id="welcome_message"
                  value={welcomeMessage}
                  onChange={(e) => { setWelcomeMessage(e.target.value); setShowGeneralWarning(false); }}
                  placeholder="Hi! How can I help you today?"
                  maxLength={500}
                />
                <p className="text-xs text-secondary-500">
                  The first message visitors see when they open the chat.
                  Use {'{{name}}'}, {'{{email}}'}, or {'{{company_name}}'} to personalize.
                </p>
                {!preChatConfig.enabled && /\{\{\w+\}\}/.test(welcomeMessage) && (
                  <div className="flex gap-1 text-xs text-amber-600 dark:text-amber-400 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <p>
                      Placeholders require the{' '}
                      <span
                        className="underline whitespace-nowrap cursor-pointer hover:text-amber-700 dark:hover:text-amber-300"
                        onClick={() => setActiveSection('pre-chat')}
                      >
                        pre-chat form
                      </span>{' '}
                      to be enabled.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="placeholder_text">Input Placeholder Text</Label>
                  <Tooltip content="The placeholder text shown in the message input field before the visitor starts typing.">
                    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                  </Tooltip>
                </div>
                <Input
                  id="placeholder_text"
                  value={placeholderText}
                  onChange={(e) => { setPlaceholderText(e.target.value); setShowGeneralWarning(false); }}
                  placeholder="Type your message..."
                  maxLength={200}
                />
                <p className="text-xs text-secondary-500">
                  Placeholder text shown in the message input field
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* System Prompt */}
      {activeSection === 'prompt' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-500" />
                System Prompt
              </CardTitle>
              <CardDescription>
                Define how your chatbot behaves and responds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="mb-3 block">Quick Templates</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                  {SYSTEM_PROMPT_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSystemPrompt(template.prompt)}
                      className={cn(
                        'p-3 text-left rounded-lg border transition-colors',
                        systemPrompt === template.prompt
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                      )}
                    >
                      <p className="font-medium text-sm text-secondary-900 dark:text-secondary-100">
                        {template.name}
                      </p>
                      <p className="text-xs text-secondary-500 mt-1">
                        {template.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="system_prompt">System Prompt *</Label>
                <textarea
                  id="system_prompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full min-h-[250px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono text-sm resize-y"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  placeholder="You are a helpful AI assistant..."
                />
                <p className="text-xs text-secondary-500">
                  {systemPrompt.length}/5000 characters. Be specific about tone, capabilities, and limitations.
                </p>
              </div>

              <div className="flex items-start space-x-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <input
                  type="checkbox"
                  id="enable_prompt_protection"
                  checked={enablePromptProtection}
                  onChange={(e) => setEnablePromptProtection(e.target.checked)}
                  className="mt-1 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                />
                <div className="flex-1">
                  <Label htmlFor="enable_prompt_protection" className="cursor-pointer font-medium text-secondary-900 dark:text-secondary-100">
                    <Shield className="w-4 h-4 inline mr-1" />
                    Enable Prompt Injection Protection
                  </Label>
                  <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                    Adds security rules to prevent users from manipulating the chatbot with prompt injection attacks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Model Settings */}
      {activeSection === 'ai-model' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary-500" />
              AI Model
            </CardTitle>
            <CardDescription>
              Configure the AI model, creativity, and response length for your chatbot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="model_tier">Model Tier</Label>
              <select
                id="model_tier"
                value={modelTier}
                onChange={(e) => setModelTier(e.target.value as 'fast' | 'balanced' | 'powerful')}
                className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
              >
                <option value="fast">Fast (Claude Haiku) — Quick responses, lower cost</option>
                <option value="balanced">Balanced (Claude Sonnet) — Good mix of speed and quality</option>
                <option value="powerful">Powerful (Claude Opus) — Best quality, slower</option>
              </select>
              <p className="text-xs text-secondary-500">
                Choose the AI model tier based on your needs for speed, quality, and cost
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="temperature">Temperature</Label>
                <span className="text-sm font-mono text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded">
                  {temperature.toFixed(1)}
                </span>
              </div>
              <input
                id="temperature"
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-secondary-400">
                <span>Focused (0)</span>
                <span>Creative (2)</span>
              </div>
              <p className="text-xs text-secondary-500">
                Controls response randomness. Lower values are more focused, higher values more creative.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="max_tokens">Max Tokens</Label>
                <span className="text-sm font-mono text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded">
                  {maxTokens}
                </span>
              </div>
              <input
                id="max_tokens"
                type="range"
                min={100}
                max={4096}
                step={100}
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-secondary-400">
                <span>Short (100)</span>
                <span>Long (4096)</span>
              </div>
              <p className="text-xs text-secondary-500">
                Maximum length of each response.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="live_fetch_threshold">Live Fetch Threshold</Label>
                <span className="text-sm font-mono text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded">
                  {liveFetchThreshold.toFixed(2)}
                </span>
              </div>
              <input
                id="live_fetch_threshold"
                type="range"
                min={0.5}
                max={0.95}
                step={0.05}
                value={liveFetchThreshold}
                onChange={(e) => setLiveFetchThreshold(parseFloat(e.target.value))}
                className="w-full accent-primary-500"
              />
              <div className="flex justify-between text-xs text-secondary-400">
                <span>Lenient (0.50)</span>
                <span>Strict (0.95)</span>
              </div>
              <p className="text-xs text-secondary-500">
                When knowledge base confidence is below this threshold, the chatbot will fetch live content from pinned URLs. Lower values reduce live fetches (faster responses). Higher values trigger live fetch more often (more thorough answers).
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Memory Settings */}
      {activeSection === 'memory' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary-500" />
                  Conversation Memory
                </CardTitle>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Remember returning visitors and personalize conversations based on past interactions
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={memoryEnabled}
                  onChange={(e) => setMemoryEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {memoryEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </CardHeader>
          {memoryEnabled && (
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">How it works</h4>
                <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                  <li>- The chatbot extracts key facts (name, preferences, needs) from each conversation</li>
                  <li>- When a visitor returns, their context is automatically loaded into the conversation</li>
                  <li>- The AI references prior interactions naturally, creating a personalized experience</li>
                  <li>- Visitors are identified by their browser (visitor ID) or pre-chat form data</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="memory_days">Memory Retention</Label>
                  <Tooltip content="How long to remember visitor context. Set to 0 for unlimited retention. Memory is automatically cleaned up after this period.">
                    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3 max-w-xs">
                  <select
                    id="memory_days"
                    value={memoryDays}
                    onChange={(e) => setMemoryDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                    <option value={60}>60 days</option>
                    <option value={90}>90 days</option>
                    <option value={180}>180 days</option>
                    <option value={365}>1 year</option>
                    <option value={0}>Unlimited</option>
                  </select>
                </div>
                <p className="text-xs text-secondary-500">
                  {memoryDays === 0
                    ? 'Visitor context will be stored indefinitely'
                    : `Visitor context will be remembered for ${memoryDays} days since their last interaction`}
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-800 dark:text-amber-200">
                    Memory extraction uses a small AI call after each conversation exchange. This adds minimal cost but ensures context is always up to date.
                  </p>
                </div>
              </div>
            </CardContent>
          )}

          {/* Session Duration — always visible regardless of memory toggle */}
          <CardContent className="space-y-4 border-secondary-200 dark:border-secondary-700">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="session_ttl_hours">Session Duration</Label>
                <Tooltip content="How long a chat session stays active. When a session expires, the visitor starts a new conversation. Previous conversations still appear as history if memory is enabled.">
                  <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                </Tooltip>
              </div>
              <div className="flex items-center gap-3 max-w-xs">
                <select
                  id="session_ttl_hours"
                  value={sessionTtlHours}
                  onChange={(e) => setSessionTtlHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                >
                  <option value={1}>1 hour</option>
                  <option value={2}>2 hours</option>
                  <option value={4}>4 hours</option>
                  <option value={8}>8 hours</option>
                  <option value={12}>12 hours</option>
                  <option value={24}>24 hours</option>
                  <option value={48}>2 days</option>
                  <option value={72}>3 days</option>
                  <option value={168}>7 days</option>
                  <option value={336}>14 days</option>
                  <option value={720}>30 days</option>
                </select>
              </div>
              <p className="text-xs text-secondary-500">
                {sessionTtlHours < 24
                  ? `Sessions expire after ${sessionTtlHours} hour${sessionTtlHours === 1 ? '' : 's'} of inactivity`
                  : sessionTtlHours === 24
                    ? 'Sessions expire after 24 hours (default)'
                    : `Sessions expire after ${sessionTtlHours / 24} day${sessionTtlHours / 24 === 1 ? '' : 's'}`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pre-Chat Form */}
      {activeSection === 'pre-chat' && (
        <PreChatFormEditor
          config={preChatConfig}
          onChange={(config) => { setPreChatConfig(config); setShowPreChatWarning(false); }}
          language={language}
          shouldShowWarning={showPreChatWarning}
          onOpenTranslate={() => {
            setTranslateModalSection('pre-chat');
            setIsTranslateModalOpen(true);
          }}
        />
      )}

      {/* Post-Chat Survey */}
      {activeSection === 'post-chat' && (
        <PostChatSurveyEditor
          config={postChatConfig}
          onChange={(config) => { setPostChatConfig(config); setShowPostChatWarning(false); }}
          language={language}
          shouldShowWarning={showPostChatWarning}
          onOpenTranslate={() => {
            setTranslateModalSection('post-chat');
            setIsTranslateModalOpen(true);
          }}
        />
      )}

      {/* File Uploads Settings */}
      {activeSection === 'file-uploads' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="w-5 h-5 text-primary-500" />
                  File Uploads
                </CardTitle>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Allow visitors to share files and images in chat conversations
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={fileUploadConfig.enabled}
                  onChange={(e) => setFileUploadConfig({ ...fileUploadConfig, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  {fileUploadConfig.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </CardHeader>
          {fileUploadConfig.enabled && (
            <CardContent className="space-y-6">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
                <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">How it works</h4>
                <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                  <li>- Visitors can attach files to their chat messages using an upload button</li>
                  <li>- Images are automatically analyzed by the AI using vision capabilities</li>
                  <li>- Documents and other files are displayed as downloadable attachments</li>
                  <li>- Files are securely stored in Supabase Storage</li>
                </ul>
              </div>

              <div className="space-y-3">
                <Label>Allowed File Types</Label>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { key: 'images' as const, label: 'Images', desc: 'JPG, PNG, GIF, WebP' },
                    { key: 'documents' as const, label: 'Documents', desc: 'PDF, DOC, DOCX, TXT' },
                    { key: 'spreadsheets' as const, label: 'Spreadsheets', desc: 'XLS, XLSX, CSV' },
                    { key: 'archives' as const, label: 'Archives', desc: 'ZIP, RAR, 7Z' },
                  ].map((type) => (
                    <label
                      key={type.key}
                      className={cn(
                        'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                        fileUploadConfig.allowed_types[type.key]
                          ? 'border-primary-300 dark:border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-secondary-200 dark:border-secondary-700 hover:border-secondary-300 dark:hover:border-secondary-600'
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={fileUploadConfig.allowed_types[type.key]}
                        onChange={(e) =>
                          setFileUploadConfig({
                            ...fileUploadConfig,
                            allowed_types: {
                              ...fileUploadConfig.allowed_types,
                              [type.key]: e.target.checked,
                            },
                          })
                        }
                        className="mt-0.5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                          {type.label}
                        </span>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">{type.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2 max-w-xs">
                <div className="flex items-center gap-2">
                  <Label htmlFor="max_file_size">Maximum File Size</Label>
                  <Tooltip content="The maximum file size visitors can upload per file.">
                    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  id="max_file_size"
                  value={fileUploadConfig.max_file_size_mb}
                  onChange={(e) =>
                    setFileUploadConfig({
                      ...fileUploadConfig,
                      max_file_size_mb: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                >
                  <option value={2}>2 MB</option>
                  <option value={5}>5 MB</option>
                  <option value={10}>10 MB</option>
                  <option value={20}>20 MB</option>
                  <option value={50}>50 MB</option>
                </select>
                <p className="text-xs text-secondary-500">
                  Files larger than {fileUploadConfig.max_file_size_mb}MB will be rejected
                </p>
              </div>

              <div className="space-y-2 max-w-xs">
                <div className="flex items-center gap-2">
                  <Label htmlFor="max_files_per_message">Files Per Message</Label>
                  <Tooltip content="The maximum number of files a visitor can attach to a single message.">
                    <Info className="w-4 h-4 text-secondary-400 cursor-help" />
                  </Tooltip>
                </div>
                <select
                  id="max_files_per_message"
                  value={fileUploadConfig.max_files_per_message ?? 3}
                  onChange={(e) =>
                    setFileUploadConfig({
                      ...fileUploadConfig,
                      max_files_per_message: Number(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                >
                  <option value={1}>1 file</option>
                  <option value={2}>2 files</option>
                  <option value={3}>3 files</option>
                  <option value={5}>5 files</option>
                  <option value={10}>10 files</option>
                </select>
                <p className="text-xs text-secondary-500">
                  Visitors can attach up to {fileUploadConfig.max_files_per_message ?? 3} file(s) per message
                </p>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Proactive Messages */}
      {activeSection === 'proactive' && (
        <ProactiveMessagesEditor
          config={proactiveConfig}
          onChange={setProactiveConfig}
        />
      )}

      {/* Transcripts */}
      {activeSection === 'transcripts' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email Transcripts
                </CardTitle>
                <CardDescription>
                  Allow visitors to email themselves a copy of their conversation.
                </CardDescription>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={transcriptConfig.enabled}
                onClick={() => setTranscriptConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  transcriptConfig.enabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    transcriptConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </CardHeader>
          {transcriptConfig.enabled && (
            <CardContent className="space-y-6">
              {/* Delivery Channels */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Delivery Channels</Label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-secondary-900 dark:text-secondary-100">Header icon</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        Show a mail icon in the chat header so visitors can request a transcript anytime.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={transcriptConfig.show_header_icon !== false}
                      onClick={() => setTranscriptConfig(prev => ({ ...prev, show_header_icon: !prev.show_header_icon }))}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3',
                        transcriptConfig.show_header_icon !== false ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', transcriptConfig.show_header_icon !== false ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </label>
                  <label className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <div>
                      <div className="font-medium text-sm text-secondary-900 dark:text-secondary-100">In-chat prompt</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        Offer a transcript via an in-chat message after the conversation goes idle.
                      </div>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={transcriptConfig.show_chat_prompt !== false}
                      onClick={() => setTranscriptConfig(prev => ({ ...prev, show_chat_prompt: !prev.show_chat_prompt }))}
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ml-3',
                        transcriptConfig.show_chat_prompt !== false ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                      )}
                    >
                      <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', transcriptConfig.show_chat_prompt !== false ? 'translate-x-6' : 'translate-x-1')} />
                    </button>
                  </label>
                </div>
              </div>

              {/* Email Collection Method */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Email Collection Method</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <input
                      type="radio"
                      name="email_mode"
                      value="ask"
                      checked={transcriptConfig.email_mode === 'ask'}
                      onChange={() => setTranscriptConfig(prev => ({ ...prev, email_mode: 'ask' }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm text-secondary-900 dark:text-secondary-100">Always ask for email</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        Prompt the visitor to enter their email address each time they request a transcript.
                      </div>
                    </div>
                  </label>
                  <label className="flex items-start gap-3 p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors">
                    <input
                      type="radio"
                      name="email_mode"
                      value="pre_chat"
                      checked={transcriptConfig.email_mode === 'pre_chat'}
                      onChange={() => setTranscriptConfig(prev => ({ ...prev, email_mode: 'pre_chat' }))}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium text-sm text-secondary-900 dark:text-secondary-100">Use pre-chat form / SDK email</div>
                      <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                        Automatically use the email from the pre-chat form or SDK user data. Falls back to asking if no email is available.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">How it works</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-blue-700 dark:text-blue-400">
                      <li>The email includes a branded, formatted copy of the entire conversation</li>
                      <li>Enable one or both delivery channels above</li>
                      <li>In-chat prompts appear after 2 minutes of inactivity once the visitor has sent at least 2 messages</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {activeSection === 'escalations' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between mb-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Flag className="w-5 h-5" />
                  Issue Reporting
                </CardTitle>
                <CardDescription>
                  Allow visitors to report issues such as wrong answers or offensive content.
                </CardDescription>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={escalationConfig.enabled}
                onClick={() => setEscalationConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  escalationConfig.enabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    escalationConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </CardHeader>
          {escalationConfig.enabled && (
            <CardContent className="space-y-4">
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800 dark:text-blue-300 space-y-2">
                    <p>
                      A flag button will appear in the chat widget header, allowing visitors to report wrong answers, offensive content, or other issues.
                    </p>
                    <p>
                      Reports are tracked in the <strong>Reports</strong> tab. To let visitors transfer to a live agent, enable <strong>Live Handoff</strong> separately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {activeSection === 'handoff' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5" />
                  Live Handoff
                </CardTitle>
                <CardDescription>
                  Let visitors request a transfer to a human agent. A headset icon will appear in the chat widget.
                </CardDescription>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={liveHandoffConfig.enabled}
                onClick={() => setLiveHandoffConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                  liveHandoffConfig.enabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    liveHandoffConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>
          </CardHeader>
          {liveHandoffConfig.enabled && (
          <CardContent className="space-y-4">
            {/* Handoff timeout */}
            <div>
              <Label htmlFor="handoff-timeout-live" className="text-sm font-medium">
                Handoff Inactivity Timeout
              </Label>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5 mb-2">
                Auto-close conversations after visitor inactivity. Set to 0 to disable.
              </p>
              <div className="flex items-center gap-2">
                <Input
                  id="handoff-timeout-live"
                  type="number"
                  min={0}
                  max={30}
                  value={liveHandoffConfig.handoff_timeout_minutes ?? 5}
                  onChange={(e) => setLiveHandoffConfig(prev => ({
                    ...prev,
                    handoff_timeout_minutes: Math.max(0, Math.min(30, parseInt(e.target.value) || 0)),
                  }))}
                  className="w-20"
                />
                <span className="text-sm text-secondary-500">minutes</span>
              </div>
            </div>

            {/* Require agent online */}
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Require Agent Online</Label>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                  Only show the handoff button when an agent is online in the Agent Console or Telegram is configured. Turn off to always show it.
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={liveHandoffConfig.require_agent_online !== false}
                onClick={() => setLiveHandoffConfig(prev => ({ ...prev, require_agent_online: prev.require_agent_online === false ? true : false }))}
                className={cn(
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                  liveHandoffConfig.require_agent_online !== false ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                )}
              >
                <span
                  className={cn(
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    liveHandoffConfig.require_agent_online !== false ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            {/* Agent Console — always on */}
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20">
                    <Users className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Agent Console</p>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-300 dark:text-green-400 dark:border-green-700">
                        Always on
                      </Badge>
                    </div>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                      Handoff requests always appear here. Agents can take over, reply, and resolve conversations.
                    </p>
                  </div>
                </div>
                <Link
                  href={`/dashboard/chatbots/${id}/conversations`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex-shrink-0"
                >
                  View conversations
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Telegram Notifications — optional */}
            <div className="rounded-lg border border-secondary-200 dark:border-secondary-700 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Telegram Notifications</p>
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                      Send a notification to your Telegram group when a visitor requests human help.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-label="Enable Telegram notifications for handoff requests"
                  aria-checked={telegramConfig.enabled}
                  onClick={() => setTelegramConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={cn(
                    'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                    telegramConfig.enabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                  )}
                >
                  <span
                    className={cn(
                      'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                      telegramConfig.enabled ? 'translate-x-6' : 'translate-x-1'
                    )}
                  />
                </button>
              </div>

              {telegramConfig.enabled && (
                <div className="space-y-4 mt-4 pt-4 border-t border-secondary-200 dark:border-secondary-700">
                  {/* Setup instructions */}
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
                        <p className="font-medium">Setup steps:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Create a Telegram bot via @BotFather and copy the bot token</li>
                          <li>Create a Telegram group for support and add the bot as admin</li>
                          <li>Get the group Chat ID (forward a message to @userinfobot)</li>
                          <li>Enter the details below and save, then click &quot;Setup Webhook&quot;</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  {/* Bot Token */}
                  <div className="space-y-2">
                    <Label htmlFor="telegram-bot-token">Bot Token</Label>
                    <Input
                      id="telegram-bot-token"
                      type="password"
                      placeholder="Paste your Telegram bot token"
                      value={telegramConfig.bot_token || ''}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, bot_token: e.target.value }))}
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      Get this from @BotFather on Telegram
                    </p>
                  </div>

                  {/* Chat ID */}
                  <div className="space-y-2">
                    <Label htmlFor="telegram-chat-id">Support Group Chat ID</Label>
                    <Input
                      id="telegram-chat-id"
                      placeholder="-1001234567890"
                      value={telegramConfig.chat_id || ''}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, chat_id: e.target.value }))}
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400">
                      The Telegram group where handoff messages will be sent
                    </p>
                  </div>

                  {/* Webhook Secret (optional) */}
                  <div className="space-y-2">
                    <Label htmlFor="telegram-webhook-secret">Webhook Secret (optional)</Label>
                    <Input
                      id="telegram-webhook-secret"
                      type="password"
                      placeholder="Optional secret for webhook verification"
                      value={telegramConfig.webhook_secret || ''}
                      onChange={(e) => setTelegramConfig(prev => ({ ...prev, webhook_secret: e.target.value }))}
                    />
                  </div>

                  {/* Webhook setup button */}
                  {telegramConfig.bot_token && telegramConfig.chat_id && (
                    <div className="border-t border-secondary-200 dark:border-secondary-700 pt-4">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={settingUpWebhook}
                          onClick={async () => {
                            setSettingUpWebhook(true);
                            try {
                              await handleSave();
                              const res = await fetch(`/api/telegram/setup?chatbot_id=${id}`, { method: 'POST' });
                              const data = await res.json();
                              if (data.success) {
                                setTelegramWebhookStatus('active');
                                toast.success('Telegram webhook configured successfully');
                              } else {
                                toast.error(data.error || 'Failed to setup webhook');
                              }
                            } catch {
                              toast.error('Failed to setup webhook');
                            } finally {
                              setSettingUpWebhook(false);
                            }
                          }}
                        >
                          {settingUpWebhook ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4 mr-2" />
                          )}
                          Setup Webhook
                        </Button>
                        {telegramWebhookStatus === 'active' && (
                          <Badge variant="outline" className="text-green-600 border-green-300 dark:text-green-400 dark:border-green-700">
                            Webhook Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                        Save settings first, then click to configure the Telegram webhook.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
          )}
        </Card>
      )}

        {/* Sticky bottom save bar */}
        <div className="sticky bottom-0 pt-4 pb-6 mt-6 flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        </div>
      </div>

      {/* Language Change Confirm Dialog */}
      <Dialog
        open={isLanguageDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsLanguageDialogOpen(false);
            setPendingLanguage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change language to {pendingLanguage ? getLanguageName(pendingLanguage) : ''}?</DialogTitle>
            <DialogDescription className="pb-5">
              Would you like to update your text inputs (welcome message, placeholder, form labels) to {pendingLanguage ? getLanguageName(pendingLanguage) : ''} defaults?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (pendingLanguage) {
                  setLanguage(pendingLanguage);
                  if (pendingLanguage !== 'en') {
                    setShowGeneralWarning(true);
                    setShowPreChatWarning(true);
                    setShowPostChatWarning(true);
                  } else {
                    setShowGeneralWarning(false);
                    setShowPreChatWarning(false);
                    setShowPostChatWarning(false);
                  }
                }
                setIsLanguageDialogOpen(false);
                setPendingLanguage(null);
              }}
            >
              Keep current text
            </Button>
            <Button
              onClick={async () => {
                if (pendingLanguage) {
                  const defaults = getDefaultTextsForLanguage(pendingLanguage);
                  const newLanguage = pendingLanguage;
                  const newWelcomeMessage = defaults.welcomeMessage;
                  const newPlaceholderText = defaults.placeholderText;
                  
                  // Update pre-chat form defaults (preserve enabled state and custom fields)
                  const newPreChatConfig: PreChatFormConfig = {
                    ...preChatConfig,
                    title: defaults.preChatConfig.title,
                    description: defaults.preChatConfig.description,
                    submitButtonText: defaults.preChatConfig.submitButtonText,
                    fields: preChatConfig.fields.map((field) => {
                      const defaultField = defaults.preChatConfig.fields.find((f) => f.id === field.id);
                      if (defaultField) {
                        return { ...field, label: defaultField.label, placeholder: defaultField.placeholder };
                      }
                      return field;
                    }),
                  };
                  
                  // Update post-chat survey defaults (preserve enabled state and custom questions)
                  const newPostChatConfig: PostChatSurveyConfig = {
                    ...postChatConfig,
                    title: defaults.postChatConfig.title,
                    description: defaults.postChatConfig.description,
                    submitButtonText: defaults.postChatConfig.submitButtonText,
                    thankYouMessage: defaults.postChatConfig.thankYouMessage,
                    questions: postChatConfig.questions.map((q) => {
                      const defaultQ = defaults.postChatConfig.questions.find((dq) => dq.id === q.id);
                      if (defaultQ) {
                        return { ...q, label: defaultQ.label };
                      }
                      return q;
                    }),
                  };
                  
                  // Update state
                  setLanguage(newLanguage);
                  setWelcomeMessage(newWelcomeMessage);
                  setPlaceholderText(newPlaceholderText);
                  setPreChatConfig(newPreChatConfig);
                  setPostChatConfig(newPostChatConfig);
                  setShowGeneralWarning(false);
                  setShowPreChatWarning(false);
                  setShowPostChatWarning(false);
                  setIsLanguageDialogOpen(false);
                  setPendingLanguage(null);
                  
                  // Auto-save to immediately apply language change
                  setSaving(true);
                  try {
                    const response = await fetch(`/api/chatbots/${id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: name.trim(),
                        description: description.trim() || null,
                        welcome_message: newWelcomeMessage.trim(),
                        system_prompt: systemPrompt.trim(),
                        enable_prompt_protection: enablePromptProtection,
                        placeholder_text: newPlaceholderText.trim(),
                        language: newLanguage,
                        memory_enabled: memoryEnabled,
                        memory_days: memoryDays,
                        session_ttl_hours: sessionTtlHours,
                        pre_chat_form_config: newPreChatConfig,
                        post_chat_survey_config: newPostChatConfig,
                      }),
                    });
                    if (!response.ok) throw new Error('Failed to save language change');
                    const data = await response.json();
                    setChatbot(data.data.chatbot);
                    toast.success('Language updated successfully');
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Failed to save language change');
                  } finally {
                    setSaving(false);
                  }
                }
              }}
            >
              Update to {pendingLanguage ? getLanguageName(pendingLanguage) : ''} defaults
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Translation Review Modal */}
      <TranslationReviewModal
        isOpen={isTranslateModalOpen}
        onClose={() => setIsTranslateModalOpen(false)}
        section={translateModalSection}
        language={language}
        currentValues={{
          welcomeMessage,
          placeholderText,
          preChatConfig,
          postChatConfig,
        }}
        onApply={(updates) => {
          if (updates.welcomeMessage !== undefined) {
            setWelcomeMessage(updates.welcomeMessage);
            setShowGeneralWarning(false);
          }
          if (updates.placeholderText !== undefined) {
            setPlaceholderText(updates.placeholderText);
            setShowGeneralWarning(false);
          }
          if (updates.preChatConfig !== undefined) {
            setPreChatConfig(updates.preChatConfig);
            setShowPreChatWarning(false);
          }
          if (updates.postChatConfig !== undefined) {
            setPostChatConfig(updates.postChatConfig);
            setShowPostChatWarning(false);
          }
        }}
        onApplyAndSave={async (updates) => {
          // Store overrides in ref so handleSave can access them
          saveOverridesRef.current = updates;
          await handleSave();
        }}
      />
    </div>
  );
}

// ============================================
// PRE-CHAT FORM EDITOR
// ============================================

const PRE_CHAT_FIELD_TYPES: { value: PreChatFieldType; label: string }[] = [
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'custom', label: 'Custom Field' },
];

function createDefaultField(id: string): PreChatFormField {
  return {
    id,
    type: 'name',
    label: '',
    placeholder: '',
    required: true,
  };
}

interface PreChatFormEditorProps {
  config: PreChatFormConfig;
  onChange: (config: PreChatFormConfig) => void;
  language: string;
  shouldShowWarning: boolean;
  onOpenTranslate: () => void;
}

function PreChatFormEditor({ config, onChange, language, shouldShowWarning, onOpenTranslate }: PreChatFormEditorProps) {
  const updateConfig = <K extends keyof PreChatFormConfig>(key: K, value: PreChatFormConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const addField = () => {
    const id = `field_${Date.now()}`;
    updateConfig('fields', [...config.fields, createDefaultField(id)]);
  };

  const removeField = (fieldId: string) => {
    updateConfig('fields', config.fields.filter((f) => f.id !== fieldId));
  };

  const updateField = (fieldId: string, updates: Partial<PreChatFormField>) => {
    updateConfig(
      'fields',
      config.fields.map((f) => (f.id === fieldId ? { ...f, ...updates } : f))
    );
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newFields = [...config.fields];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newFields.length) return;
    [newFields[index], newFields[swapIndex]] = [newFields[swapIndex], newFields[index]];
    updateConfig('fields', newFields);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-primary-500" />
              Pre-Chat Form
            </CardTitle>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              Collect visitor information before they start chatting
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {config.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        {/* Translation Warning */}
        {shouldShowWarning && language !== 'en' && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-800 dark:text-amber-200">
                You have custom pre-chat form text but the chatbot language is <strong>{language}</strong>.
              </p>
              <button
                onClick={onOpenTranslate}
                className="mt-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Translate to {language}
              </button>
            </div>
          </div>
        )}
      </CardHeader>
      {config.enabled && (
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">How it works</h4>
            <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
              <li>- Visitors must fill out this form before they can send messages</li>
              <li>- Collected data is passed to the AI as context for personalized responses</li>
              <li>- Use {'{{field_label}}'} in your system prompt or welcome message</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_title">Form Title</Label>
            <Input
              id="form_title"
              value={config.title}
              onChange={(e) => { updateConfig('title', e.target.value); }}
              placeholder="Before we start..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="form_description">Form Description</Label>
            <Input
              id="form_description"
              value={config.description}
              onChange={(e) => { updateConfig('description', e.target.value); }}
              placeholder="Please provide some information so we can better assist you."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Form Fields</Label>
              <Button variant="outline" size="sm" onClick={addField}>
                <Plus className="w-4 h-4 mr-1" />
                Add Field
              </Button>
            </div>

            {config.fields.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg">
                <ClipboardList className="w-8 h-8 mx-auto text-secondary-400 mb-2" />
                <p className="text-sm text-secondary-500">No form fields yet</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={addField}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Field
                </Button>
              </div>
            )}

            {config.fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary-500">Field #{index + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveField(index, 'down')}
                      disabled={index === config.fields.length - 1}
                      className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeField(field.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Field Type</Label>
                    <select
                      value={field.type}
                      onChange={(e) => updateField(field.id, { type: e.target.value as PreChatFieldType })}
                      className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                      style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    >
                      {PRE_CHAT_FIELD_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="e.g. Full Name"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Placeholder</Label>
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <span className="text-sm text-secondary-700 dark:text-secondary-300">Required</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 max-w-xs">
            <Label htmlFor="submit_button">Submit Button Text</Label>
            <Input
              id="submit_button"
              value={config.submitButtonText}
              onChange={(e) => { updateConfig('submitButtonText', e.target.value); }}
              placeholder="Start Chat"
            />
          </div>

          <div className="pt-2">
            <Link
              href="./leads"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View collected leads &rarr;
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// POST-CHAT SURVEY EDITOR
// ============================================

const SURVEY_QUESTION_TYPES: { value: SurveyQuestionType; label: string }[] = [
  { value: 'rating', label: 'Star Rating' },
  { value: 'text', label: 'Text Feedback' },
  { value: 'single_choice', label: 'Single Choice' },
  { value: 'multi_choice', label: 'Multiple Choice' },
];

function createDefaultQuestion(id: string): SurveyQuestion {
  return {
    id,
    type: 'rating',
    label: '',
    required: true,
    minRating: 1,
    maxRating: 5,
  };
}

interface PostChatSurveyEditorProps {
  config: PostChatSurveyConfig;
  onChange: (config: PostChatSurveyConfig) => void;
  language: string;
  shouldShowWarning: boolean;
  onOpenTranslate: () => void;
}

function PostChatSurveyEditor({ config, onChange, language, shouldShowWarning, onOpenTranslate }: PostChatSurveyEditorProps) {
  const updateConfig = <K extends keyof PostChatSurveyConfig>(key: K, value: PostChatSurveyConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const addQuestion = () => {
    const id = `q_${Date.now()}`;
    updateConfig('questions', [...config.questions, createDefaultQuestion(id)]);
  };

  const removeQuestion = (questionId: string) => {
    updateConfig('questions', config.questions.filter((q) => q.id !== questionId));
  };

  const updateQuestion = (questionId: string, updates: Partial<SurveyQuestion>) => {
    updateConfig(
      'questions',
      config.questions.map((q) => (q.id === questionId ? { ...q, ...updates } : q))
    );
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const newQuestions = [...config.questions];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newQuestions.length) return;
    [newQuestions[index], newQuestions[swapIndex]] = [newQuestions[swapIndex], newQuestions[index]];
    updateConfig('questions', newQuestions);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary-500" />
              Post-Chat Survey
            </CardTitle>
            <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
              Collect feedback after conversations end
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={(e) => updateConfig('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
              {config.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        </div>
        {/* Translation Warning */}
        {shouldShowWarning && language !== 'en' && (
          <div className="mt-2 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-amber-800 dark:text-amber-200">
                You have custom post-chat survey text but the chatbot language is <strong>{language}</strong>.
              </p>
              <button
                onClick={onOpenTranslate}
                className="mt-2 text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Translate to {language}
              </button>
            </div>
          </div>
        )}
      </CardHeader>
      {config.enabled && (
        <CardContent className="space-y-6">
          <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
            <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">How it works</h4>
            <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
              <li>- Survey appears after a conversation ends or when the visitor closes the chat</li>
              <li>- Results are stored and can be viewed in your dashboard</li>
              <li>- Helps you understand customer satisfaction and improve your chatbot</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="survey_title">Survey Title</Label>
            <Input
              id="survey_title"
              value={config.title}
              onChange={(e) => { updateConfig('title', e.target.value); }}
              placeholder="How was your experience?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="survey_description">Survey Description</Label>
            <Input
              id="survey_description"
              value={config.description}
              onChange={(e) => { updateConfig('description', e.target.value); }}
              placeholder="Your feedback helps us improve our service."
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Questions</Label>
              <Button variant="outline" size="sm" onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-1" />
                Add Question
              </Button>
            </div>

            {config.questions.length === 0 && (
              <div className="p-8 text-center border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg">
                <Star className="w-8 h-8 mx-auto text-secondary-400 mb-2" />
                <p className="text-sm text-secondary-500">No questions yet</p>
                <Button variant="outline" size="sm" className="mt-3" onClick={addQuestion}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Question
                </Button>
              </div>
            )}

            {config.questions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 border border-secondary-200 dark:border-secondary-700 rounded-lg space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-secondary-400" />
                    <span className="text-sm font-medium text-secondary-500">Question #{index + 1}</span>
                    {question.required && (
                      <Badge variant="secondary" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveQuestion(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveQuestion(index, 'down')}
                      disabled={index === config.questions.length - 1}
                      className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeQuestion(question.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Question</Label>
                    <Input
                      value={question.label}
                      onChange={(e) => updateQuestion(question.id, { label: e.target.value })}
                      placeholder="Your question..."
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Type</Label>
                    <select
                      value={question.type}
                      onChange={(e) => updateQuestion(question.id, { type: e.target.value as SurveyQuestionType })}
                      className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                      style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    >
                      {SURVEY_QUESTION_TYPES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-secondary-700 dark:text-secondary-300">Required</span>
                  </label>
                </div>

                {question.type === 'rating' && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">Min Rating</Label>
                      <Input
                        type="number"
                        value={question.minRating || 1}
                        onChange={(e) => updateQuestion(question.id, { minRating: parseInt(e.target.value) || 1 })}
                        min={1}
                        max={question.maxRating || 5}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Max Rating</Label>
                      <Input
                        type="number"
                        value={question.maxRating || 5}
                        onChange={(e) => updateQuestion(question.id, { maxRating: parseInt(e.target.value) || 5 })}
                        min={question.minRating || 1}
                        max={10}
                      />
                    </div>
                  </div>
                )}

                {(question.type === 'single_choice' || question.type === 'multi_choice') && (
                  <div className="space-y-1">
                    <Label className="text-xs">Options (one per line)</Label>
                    <textarea
                      value={(question.options || []).join('\n')}
                      onChange={(e) =>
                        updateQuestion(question.id, {
                          options: e.target.value.split('\n').filter((o) => o.trim()),
                        })
                      }
                      placeholder="Option 1&#10;Option 2&#10;Option 3"
                      className="w-full min-h-[80px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 text-sm resize-none"
                      style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Preview */}
          {config.questions.length > 0 && (
            <div className="border-t border-secondary-200 dark:border-secondary-700 pt-6">
              <Label className="mb-3 block">Preview</Label>
              <div className="p-6 bg-secondary-50 dark:bg-secondary-800 rounded-lg max-w-sm mx-auto">
                <h3 className="font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                  {config.title}
                </h3>
                <p className="text-sm text-secondary-500 mb-4">{config.description}</p>
                <div className="space-y-4">
                  {config.questions.map((q) => (
                    <div key={q.id} className="space-y-1">
                      <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                        {q.label}
                        {q.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      {q.type === 'rating' && (
                        <div className="flex gap-1">
                          {Array.from({ length: (q.maxRating || 5) - (q.minRating || 1) + 1 }).map((_, i) => (
                            <Star
                              key={i}
                              className="w-6 h-6 text-yellow-400 cursor-pointer"
                              fill={i < 3 ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                      )}
                      {q.type === 'text' && (
                        <textarea
                          disabled
                          placeholder="Type your feedback..."
                          className="w-full rounded-md border border-secondary-300 dark:border-secondary-600 px-3 py-2 text-sm opacity-60 min-h-[60px]"
                          style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                        />
                      )}
                      {q.type === 'single_choice' && (
                        <div className="space-y-2">
                          {(q.options || []).map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm text-secondary-600">
                              <input type="radio" disabled name={q.id} className="w-4 h-4" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === 'multi_choice' && (
                        <div className="space-y-2">
                          {(q.options || []).map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm text-secondary-600">
                              <input type="checkbox" disabled className="w-4 h-4" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    disabled
                    className="w-full py-2 px-4 rounded-md text-white text-sm font-medium bg-primary-500 opacity-80"
                  >
                    {config.submitButtonText}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="./surveys"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              View survey results &rarr;
            </Link>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// PROACTIVE MESSAGES EDITOR
// ============================================

const TRIGGER_TYPE_OPTIONS: { value: ProactiveTriggerType; label: string; description: string }[] = [
  { value: 'page_url', label: 'Page URL', description: 'When visitor is on a specific page' },
  { value: 'time_on_page', label: 'Time on Page', description: 'After spending time on current page' },
  { value: 'time_on_site', label: 'Time on Site', description: 'After spending time on the site' },
  { value: 'scroll_depth', label: 'Scroll Depth', description: 'When visitor scrolls to a percentage' },
  { value: 'exit_intent', label: 'Exit Intent', description: 'When mouse leaves the viewport' },
  { value: 'page_view_count', label: 'Page Views', description: 'After visiting a number of pages' },
  { value: 'idle_timeout', label: 'Idle Timeout', description: 'After visitor is idle for a duration' },
  { value: 'custom_event', label: 'Custom Event', description: 'Triggered by ChatWidget.track()' },
];

const DISPLAY_MODE_OPTIONS: { value: ProactiveDisplayMode; label: string }[] = [
  { value: 'bubble', label: 'Bubble preview' },
  { value: 'open_widget', label: 'Auto-open widget' },
];

const BUBBLE_POSITION_OPTIONS: { value: ProactiveBubblePosition; label: string; description: string }[] = [
  { value: 'top-left', label: 'Top Left', description: 'Above the button, to the left' },
  { value: 'top-middle', label: 'Top Middle', description: 'Above the button, centered' },
  { value: 'top-right', label: 'Top Right', description: 'Above the button, to the right' },
  { value: 'middle-left', label: 'Middle Left', description: 'Beside the button, to the left' },
  { value: 'middle-right', label: 'Middle Right', description: 'Beside the button, to the right' },
  { value: 'bottom-left', label: 'Bottom Left', description: 'Below the button, to the left' },
  { value: 'bottom-middle', label: 'Bottom Middle', description: 'Below the button, centered' },
  { value: 'bottom-right', label: 'Bottom Right', description: 'Below the button, to the right' },
];

function createDefaultRule(): ProactiveMessageRule {
  return {
    id: `rule_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    enabled: true,
    name: '',
    message: '',
    triggerType: 'time_on_page',
    triggerConfig: { seconds: 10 },
    displayMode: 'bubble',
    bubblePosition: 'bottom-left',
    closeOnNavigate: true,
    delay: 0,
    maxShowCount: 1,
    priority: 0,
  };
}

interface ProactiveMessagesEditorProps {
  config: ProactiveMessagesConfig;
  onChange: (config: ProactiveMessagesConfig) => void;
}

function ProactiveMessagesEditor({ config, onChange }: ProactiveMessagesEditorProps) {
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);
  const [showBubbleStyle, setShowBubbleStyle] = useState(false);

  const updateConfig = <K extends keyof ProactiveMessagesConfig>(key: K, value: ProactiveMessagesConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const addRule = () => {
    const rule = createDefaultRule();
    updateConfig('rules', [...config.rules, rule]);
    setExpandedRuleId(rule.id);
  };

  const removeRule = (ruleId: string) => {
    updateConfig('rules', config.rules.filter((r) => r.id !== ruleId));
    if (expandedRuleId === ruleId) setExpandedRuleId(null);
  };

  const updateRule = (ruleId: string, updates: Partial<ProactiveMessageRule>) => {
    updateConfig(
      'rules',
      config.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r))
    );
  };

  const moveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...config.rules];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= newRules.length) return;
    [newRules[index], newRules[swapIndex]] = [newRules[swapIndex], newRules[index]];
    updateConfig('rules', newRules);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-3">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-500" />
                Proactive Messages
              </CardTitle>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                Trigger messages based on visitor behavior
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => updateConfig('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer dark:bg-secondary-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-secondary-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
              <span className="ml-2 text-sm font-medium text-secondary-700 dark:text-secondary-300">
                {config.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </label>
          </div>
        </CardHeader>
        {config.enabled && (
          <CardContent className="space-y-6">
            <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800">
              <h4 className="font-medium text-secondary-900 dark:text-secondary-100 mb-2">How it works</h4>
              <ul className="text-sm text-secondary-600 dark:text-secondary-400 space-y-1">
                <li>- Define trigger rules that fire based on visitor behavior on the host page</li>
                <li>- Each rule can show a bubble preview next to the chat button, or auto-open the widget</li>
                <li>- Triggers run in priority order (lower number = higher priority)</li>
                <li>- Use <code className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded text-xs">ChatWidget.track(&apos;event_name&apos;)</code> for custom events</li>
              </ul>
            </div>

            {/* Bubble Appearance — collapsible */}
            <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden">
              <button
                type="button"
                className="w-full flex items-center justify-between p-3 hover:bg-secondary-50 dark:hover:bg-secondary-800/50 transition-colors"
                onClick={() => setShowBubbleStyle(!showBubbleStyle)}
              >
                <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary-500" />
                  Bubble Appearance
                </h4>
                <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform ${showBubbleStyle ? 'rotate-180' : ''}`} />
              </button>
              {showBubbleStyle && (
                <div className="p-4 pt-0 space-y-4">
                  {/* Preview */}
                  <div className="p-4 rounded-lg bg-secondary-100 dark:bg-secondary-800 flex items-center justify-center min-h-[80px]">
                    <div
                      style={{
                        background: config.bubbleStyle?.bgColor || '#ffffff',
                        color: config.bubbleStyle?.textColor || '#0f172a',
                        border: (config.bubbleStyle?.borderWidth ?? 1) > 0
                          ? `${config.bubbleStyle?.borderWidth ?? 1}px solid ${config.bubbleStyle?.borderColor || '#e2e8f0'}`
                          : 'none',
                        borderRadius: `${config.bubbleStyle?.borderRadius ?? 12}px`,
                        boxShadow: config.bubbleStyle?.shadow === 'none' ? 'none'
                          : config.bubbleStyle?.shadow === 'sm' ? '0 2px 8px rgba(0,0,0,0.1)'
                          : config.bubbleStyle?.shadow === 'lg' ? '0 8px 32px rgba(0,0,0,0.2)'
                          : '0 4px 16px rgba(0,0,0,0.15)',
                        fontSize: `${config.bubbleStyle?.fontSize ?? 14}px`,
                        maxWidth: `${config.bubbleStyle?.maxWidth ?? 280}px`,
                        padding: '12px 36px 12px 14px',
                        lineHeight: '1.4',
                        fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
                        position: 'relative' as const,
                      }}
                    >
                      <span>Hi there! Need help?</span>
                      <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '18px', color: '#999', lineHeight: '1' }}>&times;</span>
                    </div>
                  </div>

                  {/* Colors: Background, Text, Border */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Background</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.bubbleStyle?.bgColor || '#ffffff'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, bgColor: e.target.value } })}
                          className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 cursor-pointer"
                        />
                        <Input
                          value={config.bubbleStyle?.bgColor || '#ffffff'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, bgColor: e.target.value } })}
                          className="h-8 text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Text</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.bubbleStyle?.textColor || '#0f172a'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, textColor: e.target.value } })}
                          className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 cursor-pointer"
                        />
                        <Input
                          value={config.bubbleStyle?.textColor || '#0f172a'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, textColor: e.target.value } })}
                          className="h-8 text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Border</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={config.bubbleStyle?.borderColor || '#e2e8f0'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, borderColor: e.target.value } })}
                          className="w-8 h-8 rounded border border-secondary-300 dark:border-secondary-600 cursor-pointer"
                        />
                        <Input
                          value={config.bubbleStyle?.borderColor || '#e2e8f0'}
                          onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, borderColor: e.target.value } })}
                          className="h-8 text-xs font-mono flex-1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sliders & selects */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Border Width ({config.bubbleStyle?.borderWidth ?? 1}px)</Label>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={config.bubbleStyle?.borderWidth ?? 1}
                        onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, borderWidth: Number(e.target.value) } })}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Border Radius ({config.bubbleStyle?.borderRadius ?? 12}px)</Label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={config.bubbleStyle?.borderRadius ?? 12}
                        onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, borderRadius: Number(e.target.value) } })}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Font Size ({config.bubbleStyle?.fontSize ?? 14}px)</Label>
                      <input
                        type="range"
                        min="12"
                        max="18"
                        value={config.bubbleStyle?.fontSize ?? 14}
                        onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, fontSize: Number(e.target.value) } })}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Max Width ({config.bubbleStyle?.maxWidth ?? 280}px)</Label>
                      <input
                        type="range"
                        min="200"
                        max="400"
                        step="10"
                        value={config.bubbleStyle?.maxWidth ?? 280}
                        onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, maxWidth: Number(e.target.value) } })}
                        className="w-full h-2 bg-secondary-200 dark:bg-secondary-700 rounded-lg appearance-none cursor-pointer accent-primary-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Box Shadow</Label>
                      <select
                        value={config.bubbleStyle?.shadow || 'md'}
                        onChange={(e) => onChange({ ...config, bubbleStyle: { ...DEFAULT_BUBBLE_STYLE, ...config.bubbleStyle, shadow: e.target.value as ProactiveBubbleStyle['shadow'] } })}
                        className="w-full h-8 rounded-md border border-secondary-200 dark:border-secondary-700 px-2 text-xs text-secondary-900 dark:text-secondary-100"
                        style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                      >
                        <option value="none">None</option>
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                      </select>
                    </div>
                  </div>

                  {/* Reset */}
                  <button
                    type="button"
                    onClick={() => onChange({ ...config, bubbleStyle: DEFAULT_BUBBLE_STYLE })}
                    className="text-xs text-secondary-500 hover:text-secondary-700 dark:hover:text-secondary-300 underline"
                  >
                    Reset to defaults
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Trigger Rules</Label>
                <Button variant="outline" size="sm" onClick={addRule}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Rule
                </Button>
              </div>

              {config.rules.length === 0 && (
                <div className="p-8 text-center border-2 border-dashed border-secondary-200 dark:border-secondary-700 rounded-lg">
                  <Zap className="w-8 h-8 mx-auto text-secondary-400 mb-2" />
                  <p className="text-sm text-secondary-500">No trigger rules yet</p>
                  <Button variant="outline" size="sm" className="mt-3" onClick={addRule}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add First Rule
                  </Button>
                </div>
              )}

              {config.rules.map((rule, index) => {
                const isExpanded = expandedRuleId === rule.id;
                const triggerLabel = TRIGGER_TYPE_OPTIONS.find((t) => t.value === rule.triggerType)?.label || rule.triggerType;
                return (
                  <div
                    key={rule.id}
                    className="border border-secondary-200 dark:border-secondary-700 rounded-lg overflow-hidden"
                  >
                    <div
                      className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary-50 dark:hover:bg-secondary-800/50"
                      onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <GripVertical className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                        <label className="flex items-center flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={rule.enabled}
                            onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                            className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                        </label>
                        <div className="min-w-0">
                          <span className={cn('text-sm font-medium truncate block', !rule.enabled && 'opacity-50')}>
                            {rule.name || 'Untitled rule'}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="secondary" className="text-xs">{triggerLabel}</Badge>
                            <Badge variant="secondary" className="text-xs">
                              {rule.displayMode === 'bubble' ? 'Bubble' : 'Auto-open'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); moveRule(index, 'up'); }}
                          disabled={index === 0}
                          className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); moveRule(index, 'down'); }}
                          disabled={index === config.rules.length - 1}
                          className="p-1 text-secondary-400 hover:text-secondary-600 disabled:opacity-30"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeRule(rule.id); }}
                          className="p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="border-t border-secondary-200 dark:border-secondary-700 p-4 space-y-4 bg-secondary-50/50 dark:bg-secondary-800/30">
                        <div className="space-y-1">
                          <Label className="text-xs">Rule Name</Label>
                          <Input
                            value={rule.name}
                            onChange={(e) => updateRule(rule.id, { name: e.target.value })}
                            placeholder="e.g. Pricing page helper"
                          />
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Message</Label>
                          <textarea
                            value={rule.message}
                            onChange={(e) => updateRule(rule.id, { message: e.target.value })}
                            placeholder="The message to show visitors..."
                            className="w-full min-h-[80px] px-3 py-2 rounded-md border border-secondary-300 dark:border-secondary-600 text-secondary-900 dark:text-secondary-100 text-sm resize-none"
                            style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Trigger Type</Label>
                            <select
                              value={rule.triggerType}
                              onChange={(e) => {
                                const newType = e.target.value as ProactiveTriggerType;
                                const defaultConfigs: Record<ProactiveTriggerType, Record<string, unknown>> = {
                                  page_url: { urlPattern: '', matchType: 'contains' },
                                  time_on_page: { seconds: 10 },
                                  time_on_site: { seconds: 30 },
                                  scroll_depth: { percent: 50 },
                                  exit_intent: {},
                                  page_view_count: { count: 3 },
                                  idle_timeout: { seconds: 30 },
                                  custom_event: { eventName: '' },
                                };
                                updateRule(rule.id, { triggerType: newType, triggerConfig: defaultConfigs[newType] });
                              }}
                              className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                              style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            >
                              {TRIGGER_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <p className="text-xs text-secondary-500">
                              {TRIGGER_TYPE_OPTIONS.find((t) => t.value === rule.triggerType)?.description}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <Label className="text-xs">Display Mode</Label>
                            <select
                              value={rule.displayMode}
                              onChange={(e) => updateRule(rule.id, { displayMode: e.target.value as ProactiveDisplayMode })}
                              className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                              style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            >
                              {DISPLAY_MODE_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <p className="text-xs text-secondary-500">
                              {rule.displayMode === 'bubble' ? 'Shows a speech bubble next to the chat button' : 'Opens the chat widget automatically'}
                            </p>
                          </div>
                        </div>

                        {/* Bubble Position - only shown for bubble display mode */}
                        {rule.displayMode === 'bubble' && (
                          <div className="space-y-1 max-w-xs">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">Bubble Position</Label>
                              <Tooltip content="Where the bubble preview appears relative to the chat button">
                                <Info className="w-3 h-3 text-secondary-400 cursor-help" />
                              </Tooltip>
                            </div>
                            <select
                              value={rule.bubblePosition || 'bottom-left'}
                              onChange={(e) => updateRule(rule.id, { bubblePosition: e.target.value as ProactiveBubblePosition })}
                              className="w-full rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                              style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
                            >
                              {BUBBLE_POSITION_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                            <p className="text-xs text-secondary-500">
                              {BUBBLE_POSITION_OPTIONS.find((p) => p.value === (rule.bubblePosition || 'bottom-left'))?.description}
                            </p>
                          </div>
                        )}

                        {/* Navigation Behavior - shown for all display modes */}
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            id={`close-on-navigate-${rule.id}`}
                            checked={rule.closeOnNavigate ?? true}
                            onChange={(e) => updateRule(rule.id, { closeOnNavigate: e.target.checked })}
                            className="mt-0.5 w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                          />
                          <div className="flex-1">
                            <label htmlFor={`close-on-navigate-${rule.id}`} className="text-xs font-medium text-secondary-700 dark:text-secondary-300 cursor-pointer">
                              Close {rule.displayMode === 'bubble' ? 'bubble' : 'widget'} on navigation
                            </label>
                            <p className="text-xs text-secondary-500 mt-0.5">
                              {rule.displayMode === 'bubble' 
                                ? 'Automatically close the bubble when the user navigates to another page. Uncheck to keep the bubble visible across page navigation.'
                                : 'Automatically close the widget when the user navigates to another page. Uncheck to keep the widget open across page navigation.'}
                            </p>
                          </div>
                        </div>

                        <TriggerConfigFields
                          triggerType={rule.triggerType}
                          triggerConfig={rule.triggerConfig}
                          onChange={(tc) => updateRule(rule.id, { triggerConfig: tc })}
                        />

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">Delay (ms)</Label>
                              <Tooltip content="Wait this many milliseconds after the trigger fires before showing the message.">
                                <Info className="w-3 h-3 text-secondary-400 cursor-help" />
                              </Tooltip>
                            </div>
                            <Input
                              type="number"
                              value={rule.delay}
                              onChange={(e) => updateRule(rule.id, { delay: Math.max(0, parseInt(e.target.value) || 0) })}
                              min={0}
                              step={500}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">Max Shows</Label>
                              <Tooltip content="Maximum times this rule can fire per visitor session. 0 = unlimited.">
                                <Info className="w-3 h-3 text-secondary-400 cursor-help" />
                              </Tooltip>
                            </div>
                            <Input
                              type="number"
                              value={rule.maxShowCount}
                              onChange={(e) => updateRule(rule.id, { maxShowCount: Math.max(0, parseInt(e.target.value) || 0) })}
                              min={0}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <Label className="text-xs">Priority</Label>
                              <Tooltip content="Lower number = higher priority. When multiple rules fire, higher-priority rules are evaluated first.">
                                <Info className="w-3 h-3 text-secondary-400 cursor-help" />
                              </Tooltip>
                            </div>
                            <Input
                              type="number"
                              value={rule.priority}
                              onChange={(e) => updateRule(rule.id, { priority: parseInt(e.target.value) || 0 })}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// ============================================
// REGEX TESTER COMPONENT
// ============================================

interface RegexTesterProps {
  pattern: string;
  matchUrl: (testUrl: string, pattern: string, matchType: string) => { matched: boolean; error?: string };
}

function RegexTester({ pattern, matchUrl }: RegexTesterProps) {
  const [testUrl, setTestUrl] = useState('https://example.com/pricing');
  const result = matchUrl(testUrl, pattern, 'regex');

  return (
    <div className="p-3 rounded-lg border border-secondary-200 dark:border-secondary-700 bg-secondary-50/50 dark:bg-secondary-800/30 space-y-2">
      <div className="flex items-center gap-2 text-xs font-medium text-secondary-700 dark:text-secondary-300">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Regex Tester
        </span>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-secondary-600 dark:text-secondary-400">Test URL</Label>
        <Input
          value={testUrl}
          onChange={(e) => setTestUrl(e.target.value)}
          placeholder="https://example.com/page"
          className="h-9 text-sm font-mono"
        />
      </div>
      <div className="flex items-center gap-2 text-xs">
        {result.error ? (
          <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{result.error}</span>
          </div>
        ) : result.matched ? (
          <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Match! This URL would trigger the rule.</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-secondary-500 dark:text-secondary-400">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>No match. This URL would not trigger the rule.</span>
          </div>
        )}
      </div>
      <div className="text-xs text-secondary-500 dark:text-secondary-400 pt-1 border-t border-secondary-200 dark:border-secondary-700">
        <strong>Tip:</strong> Test with multiple URLs to ensure your pattern works as expected. The regex is tested against the full URL.
      </div>
    </div>
  );
}

// ============================================
// TRIGGER CONFIG FIELDS (per trigger type)
// ============================================

interface TriggerConfigFieldsProps {
  triggerType: ProactiveTriggerType;
  triggerConfig: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}

function TriggerConfigFields({ triggerType, triggerConfig, onChange }: TriggerConfigFieldsProps) {
  const update = (key: string, value: unknown) => {
    onChange({ ...triggerConfig, [key]: value });
  };

  // URL matching logic (same as SDK)
  const matchUrl = (testUrl: string, pattern: string, matchType: string): { matched: boolean; error?: string } => {
    if (!pattern) return { matched: false };
    try {
      const url = testUrl;
      const path = new URL(testUrl).pathname;
      let matched = false;
      if (matchType === 'exact') {
        matched = url === pattern || path === pattern;
      } else if (matchType === 'regex') {
        try {
          matched = new RegExp(pattern).test(url);
        } catch (e) {
          return { matched: false, error: e instanceof Error ? e.message : 'Invalid regex' };
        }
      } else {
        // contains
        matched = url.includes(pattern) || path.includes(pattern);
      }
      return { matched };
    } catch (e) {
      return { matched: false, error: 'Invalid URL format' };
    }
  };

  switch (triggerType) {
    case 'page_url':
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-xs">URL Pattern</Label>
              <Input
                value={(triggerConfig.urlPattern as string) || ''}
                onChange={(e) => update('urlPattern', e.target.value)}
                placeholder="e.g. /pricing or https://example.com/pricing"
                className="h-10"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Match Type</Label>
              <select
                value={(triggerConfig.matchType as string) || 'contains'}
                onChange={(e) => update('matchType', e.target.value)}
                className="w-full h-10 rounded-md border border-secondary-200 dark:border-secondary-700 px-3 py-2 text-sm text-secondary-900 dark:text-secondary-100"
                style={{ backgroundColor: 'rgb(var(--form-element-bg))' }}
              >
                <option value="contains">Contains</option>
                <option value="exact">Exact match</option>
                <option value="regex">Regex</option>
              </select>
            </div>
          </div>
          
          {/* Regex Tester */}
          {(triggerConfig.matchType as string) === 'regex' && (triggerConfig.urlPattern as string) && (
            <RegexTester
              pattern={(triggerConfig.urlPattern as string)}
              matchUrl={matchUrl}
            />
          )}
        </div>
      );

    case 'time_on_page':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Seconds on page</Label>
          <Input
            type="number"
            value={(triggerConfig.seconds as number) || 10}
            onChange={(e) => update('seconds', Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
        </div>
      );

    case 'time_on_site':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Seconds on site</Label>
          <Input
            type="number"
            value={(triggerConfig.seconds as number) || 30}
            onChange={(e) => update('seconds', Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
        </div>
      );

    case 'scroll_depth':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Scroll depth (%)</Label>
          <Input
            type="number"
            value={(triggerConfig.percent as number) || 50}
            onChange={(e) => update('percent', Math.min(100, Math.max(1, parseInt(e.target.value) || 50)))}
            min={1}
            max={100}
          />
        </div>
      );

    case 'exit_intent':
      return (
        <p className="text-xs text-secondary-500 italic">
          No additional configuration needed. Triggers when the mouse cursor leaves the top of the viewport (desktop only).
        </p>
      );

    case 'page_view_count':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Number of page views</Label>
          <Input
            type="number"
            value={(triggerConfig.count as number) || 3}
            onChange={(e) => update('count', Math.max(1, parseInt(e.target.value) || 1))}
            min={1}
          />
        </div>
      );

    case 'idle_timeout':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Idle seconds</Label>
          <Input
            type="number"
            value={(triggerConfig.seconds as number) || 30}
            onChange={(e) => update('seconds', Math.max(5, parseInt(e.target.value) || 5))}
            min={5}
          />
        </div>
      );

    case 'custom_event':
      return (
        <div className="space-y-1 max-w-xs">
          <Label className="text-xs">Event name</Label>
          <Input
            value={(triggerConfig.eventName as string) || ''}
            onChange={(e) => update('eventName', e.target.value)}
            placeholder="e.g. added_to_cart"
          />
          <p className="text-xs text-secondary-500">
            Fire with: <code className="px-1 py-0.5 bg-secondary-100 dark:bg-secondary-800 rounded">ChatWidget.track(&apos;{(triggerConfig.eventName as string) || 'event_name'}&apos;)</code>
          </p>
        </div>
      );

    default:
      return null;
  }
}
