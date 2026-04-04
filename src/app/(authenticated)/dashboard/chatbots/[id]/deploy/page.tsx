'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { toast } from 'sonner';
import {
  Code, Copy, Check, ExternalLink, Globe, Terminal,
  Info, BookOpen, FileCode, Zap, Headphones, ChevronDown, AlertTriangle,
  Eye, EyeOff, Loader2, MessageSquare, Settings, Send,
  Phone, Users, Gamepad2, Smartphone, Mail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import { useChatbot } from '@/components/chatbots/ChatbotContext';

function CodeBlock({
  code,
  language,
  copyId,
  copiedCode,
  onCopy,
  disabled,
}: {
  code: string;
  language: string;
  copyId: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative group">
      <div className="absolute top-2 left-3 flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500 dark:text-secondary-500">
          {language}
        </span>
      </div>
      <pre className={`pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800 dark:border-secondary-800 ${disabled ? 'opacity-50 select-none' : ''}`}>
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-secondary-800 border-secondary-700 hover:bg-secondary-700 text-secondary-200"
        onClick={() => onCopy(code, copyId)}
        disabled={disabled}
      >
        {copiedCode === copyId ? (
          <>
            <Check className="w-3.5 h-3.5 mr-1.5" />
            Copied
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 mr-1.5" />
            Copy
          </>
        )}
      </Button>
    </div>
  );
}

interface DeployPageProps {
  params: Promise<{ id: string }>;
}

export default function DeployPage({ params }: DeployPageProps) {
  const { id } = use(params);
  const { chatbot, loading, error, setChatbot } = useChatbot();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('widget');
  const [embedMethod, setEmbedMethod] = useState('script');
  const [agentMethod, setAgentMethod] = useState('quick');
  const [apiMethod, setApiMethod] = useState('curl');
  const [showAuthSection, setShowAuthSection] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [slackStatus, setSlackStatus] = useState<{
    connected: boolean;
    team_name?: string;
    mention_only?: boolean;
    channel_ids?: string[];
    workspace_taken_by?: { chatbot_id: string; chatbot_name: string; team_name: string } | null;
  } | null>(null);
  const [slackLoading, setSlackLoading] = useState(true);
  const [slackConnecting, setSlackConnecting] = useState(false);
  const [slackDisconnecting, setSlackDisconnecting] = useState(false);
  const [slackMentionOnly, setSlackMentionOnly] = useState(false);
  const [slackChannelIds, setSlackChannelIds] = useState('');
  const [slackConfigSaving, setSlackConfigSaving] = useState(false);

  // Telegram state
  const [telegramBotToken, setTelegramBotToken] = useState('');
  const [telegramConnecting, setTelegramConnecting] = useState(false);
  const [telegramDisconnecting, setTelegramDisconnecting] = useState(false);
  const [telegramLoading, setTelegramLoading] = useState(true);
  const [telegramConnected, setTelegramConnected] = useState(false);
  const [telegramBotUsername, setTelegramBotUsername] = useState<string | null>(null);
  const [telegramAiEnabled, setTelegramAiEnabled] = useState(false);
  const [telegramAiSaving, setTelegramAiSaving] = useState(false);

  // WhatsApp state
  const [whatsappPhoneNumberId, setWhatsappPhoneNumberId] = useState('');
  const [whatsappAccessToken, setWhatsappAccessToken] = useState('');
  const [whatsappConnecting, setWhatsappConnecting] = useState(false);
  const [whatsappDisconnecting, setWhatsappDisconnecting] = useState(false);
  const [whatsappLoading, setWhatsappLoading] = useState(true);
  const [whatsappConnected, setWhatsappConnected] = useState(false);
  const [whatsappAiEnabled, setWhatsappAiEnabled] = useState(false);
  const [whatsappAiSaving, setWhatsappAiSaving] = useState(false);

  // Teams state
  const [teamsAppId, setTeamsAppId] = useState('');
  const [teamsAppSecret, setTeamsAppSecret] = useState('');
  const [teamsConnecting, setTeamsConnecting] = useState(false);
  const [teamsDisconnecting, setTeamsDisconnecting] = useState(false);
  const [teamsLoading, setTeamsLoading] = useState(true);
  const [teamsConnected, setTeamsConnected] = useState(false);
  const [teamsBotName, setTeamsBotName] = useState<string | null>(null);
  const [teamsAiEnabled, setTeamsAiEnabled] = useState(false);
  const [teamsAiSaving, setTeamsAiSaving] = useState(false);

  // Discord state
  const [discordAppId, setDiscordAppId] = useState('');
  const [discordBotToken, setDiscordBotToken] = useState('');
  const [discordPublicKey, setDiscordPublicKey] = useState('');
  const [discordConnecting, setDiscordConnecting] = useState(false);
  const [discordDisconnecting, setDiscordDisconnecting] = useState(false);
  const [discordLoading, setDiscordLoading] = useState(true);
  const [discordConnected, setDiscordConnected] = useState(false);
  const [discordAiEnabled, setDiscordAiEnabled] = useState(false);
  const [discordAiSaving, setDiscordAiSaving] = useState(false);

  // Messenger state
  const [messengerPageId, setMessengerPageId] = useState('');
  const [messengerPageName, setMessengerPageName] = useState('');
  const [messengerAccessToken, setMessengerAccessToken] = useState('');
  const [messengerConnecting, setMessengerConnecting] = useState(false);
  const [messengerDisconnecting, setMessengerDisconnecting] = useState(false);
  const [messengerLoading, setMessengerLoading] = useState(true);
  const [messengerConnected, setMessengerConnected] = useState(false);
  const [messengerAiEnabled, setMessengerAiEnabled] = useState(false);
  const [messengerAiSaving, setMessengerAiSaving] = useState(false);

  // Instagram state
  const [instagramId, setInstagramId] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramAccessToken, setInstagramAccessToken] = useState('');
  const [instagramConnecting, setInstagramConnecting] = useState(false);
  const [instagramDisconnecting, setInstagramDisconnecting] = useState(false);
  const [instagramLoading, setInstagramLoading] = useState(true);
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [instagramAiEnabled, setInstagramAiEnabled] = useState(false);
  const [instagramAiSaving, setInstagramAiSaving] = useState(false);

  // Email state
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [emailLoading, setEmailLoading] = useState(true);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailAddress, setEmailAddress] = useState<string | null>(null);
  const [emailReplyName, setEmailReplyName] = useState('');
  const [emailAiEnabled, setEmailAiEnabled] = useState(true);

  // SMS state
  const [smsAccountSid, setSmsAccountSid] = useState('');
  const [smsAuthToken, setSmsAuthToken] = useState('');
  const [smsPhoneNumber, setSmsPhoneNumber] = useState('');
  const [smsConnecting, setSmsConnecting] = useState(false);
  const [smsDisconnecting, setSmsDisconnecting] = useState(false);
  const [smsLoading, setSmsLoading] = useState(true);
  const [smsConnected, setSmsConnected] = useState(false);
  const [smsAiEnabled, setSmsAiEnabled] = useState(false);
  const [smsAiSaving, setSmsAiSaving] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('slack_connected')) {
      toast.success('Slack connected successfully');
      window.history.replaceState({}, '', window.location.pathname);
    }
    const slackError = params.get('slack_error');
    if (slackError) {
      toast.error(`Slack connection failed: ${slackError}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
    fetch(`/api/chatbots/${id}/integrations/slack`)
      .then(r => r.json())
      .then(d => {
        setSlackStatus(d.data);
        if (d.data?.connected) {
          setSlackMentionOnly(d.data.mention_only ?? false);
          setSlackChannelIds((d.data.channel_ids ?? []).join(', '));
        }
      })
      .finally(() => setSlackLoading(false));
    // Check Telegram/WhatsApp/Teams/Discord connection status from chatbot config
    fetch(`/api/chatbots/${id}`)
      .then(r => r.json())
      .then(d => {
        const bot = d.data?.chatbot;
        // Telegram
        const tc = bot?.telegram_config;
        if (tc?.bot_token && tc?.enabled) {
          setTelegramConnected(true);
          setTelegramAiEnabled(tc.ai_responses_enabled ?? false);
          fetch(`/api/telegram/setup?chatbot_id=${id}`)
            .then(r => r.json())
            .then(info => { if (info.data?.url) setTelegramConnected(true); })
            .catch(() => {});
        }
        // WhatsApp
        const wc = bot?.whatsapp_config;
        if (wc?.phone_number_id && wc?.enabled) {
          setWhatsappConnected(true);
          setWhatsappAiEnabled(wc.ai_responses_enabled ?? false);
        }
        // Teams
        const tmc = bot?.teams_config;
        if (tmc?.app_id && tmc?.enabled) {
          setTeamsConnected(true);
          setTeamsBotName(tmc.bot_name ?? null);
          setTeamsAiEnabled(tmc.ai_responses_enabled ?? false);
        }
        // Discord
        const dc = bot?.discord_config;
        if (dc?.application_id && dc?.enabled) {
          setDiscordConnected(true);
          setDiscordAiEnabled(dc.ai_responses_enabled ?? false);
        }
        // Messenger
        const mc = bot?.messenger_config;
        if (mc?.page_id && mc?.enabled) {
          setMessengerConnected(true);
          setMessengerAiEnabled(mc.ai_responses_enabled ?? false);
        }
        // Instagram
        const ic = bot?.instagram_config;
        if (ic?.instagram_id && ic?.enabled) {
          setInstagramConnected(true);
          setInstagramAiEnabled(ic.ai_responses_enabled ?? false);
        }
        // SMS
        const sc = bot?.sms_config;
        if (sc?.account_sid && sc?.enabled) {
          setSmsConnected(true);
          setSmsAiEnabled(sc.ai_responses_enabled ?? false);
        }
        setSmsLoading(false);
        // Email
        const ec = bot?.email_config;
        if (ec?.enabled) {
          setEmailEnabled(true);
          setEmailAddress(ec.email_address || null);
          setEmailReplyName(ec.reply_name || '');
          setEmailAiEnabled(ec.ai_responses_enabled !== false);
        }
        setEmailLoading(false);
      })
      .finally(() => {
        setTelegramLoading(false);
        setWhatsappLoading(false);
        setTeamsLoading(false);
        setDiscordLoading(false);
        setMessengerLoading(false);
        setInstagramLoading(false);
        setSmsLoading(false);
      });
  }, [id]);

  const handleSlackConnect = async () => {
    setSlackConnecting(true);
    try {
      const res = await fetch(`/api/chatbots/${id}/integrations/slack`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error?.message || 'Failed to start Slack connection');
        return;
      }
      window.location.href = data.data.oauth_url;
    } catch {
      toast.error('Failed to start Slack connection');
    } finally {
      setSlackConnecting(false);
    }
  };

  const handleSlackDisconnect = async () => {
    setSlackDisconnecting(true);
    try {
      await fetch(`/api/chatbots/${id}/integrations/slack`, { method: 'DELETE' });
      setSlackStatus({ connected: false });
      toast.success('Slack disconnected');
    } catch {
      toast.error('Failed to disconnect Slack');
    } finally {
      setSlackDisconnecting(false);
    }
  };

  const handleSlackConfigSave = async () => {
    setSlackConfigSaving(true);
    try {
      const channelIdsArray = slackChannelIds
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const res = await fetch(`/api/chatbots/${id}/integrations/slack`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mention_only: slackMentionOnly, channel_ids: channelIdsArray }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to save');
      }
      toast.success('Slack settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save Slack settings');
    } finally {
      setSlackConfigSaving(false);
    }
  };

  const handleTelegramConnect = async () => {
    if (!telegramBotToken.trim()) {
      toast.error('Please enter your Telegram bot token');
      return;
    }
    setTelegramConnecting(true);
    try {
      // Step 1: Validate the token by calling Telegram's getMe
      const getMeRes = await fetch(`https://api.telegram.org/bot${telegramBotToken.trim()}/getMe`);
      const getMeData = await getMeRes.json();
      if (!getMeData.ok) {
        toast.error('Invalid bot token. Please check and try again.');
        return;
      }
      const botUsername = getMeData.result?.username || null;

      // Step 2: Save the bot token to telegram_config via chatbot PATCH API
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_config: {
            ...chatbot?.telegram_config,
            enabled: true,
            bot_token: telegramBotToken.trim(),
            bot_username: botUsername || undefined,
          },
        }),
      });
      if (!patchRes.ok) {
        const errData = await patchRes.json();
        throw new Error(errData.error?.message || 'Failed to save bot token');
      }

      // Step 3: Set up the webhook
      const setupRes = await fetch(`/api/telegram/setup?chatbot_id=${id}`, { method: 'POST' });
      const setupData = await setupRes.json();
      if (!setupRes.ok) {
        throw new Error(setupData.error || 'Failed to set up Telegram webhook');
      }

      setTelegramConnected(true);
      setTelegramBotUsername(botUsername);
      setTelegramBotToken('');
      toast.success('Telegram bot connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect Telegram bot');
    } finally {
      setTelegramConnecting(false);
    }
  };

  const handleTelegramDisconnect = async () => {
    setTelegramDisconnecting(true);
    try {
      // Step 1: Remove the webhook
      await fetch(`/api/telegram/setup?chatbot_id=${id}`, { method: 'DELETE' });

      // Step 2: Clear the bot token from telegram_config
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_config: {
            enabled: false,
            bot_token: '',
            ai_responses_enabled: false,
          },
        }),
      });

      setTelegramConnected(false);
      setTelegramBotUsername(null);
      setTelegramAiEnabled(false);
      toast.success('Telegram bot disconnected');
    } catch {
      toast.error('Failed to disconnect Telegram bot');
    } finally {
      setTelegramDisconnecting(false);
    }
  };

  const handleTelegramAiToggle = async () => {
    const newValue = !telegramAiEnabled;
    setTelegramAiEnabled(newValue);
    setTelegramAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegram_config: {
            ...chatbot?.telegram_config,
            ai_responses_enabled: newValue,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to save');
      }
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setTelegramAiEnabled(!newValue); // revert
      toast.error(err instanceof Error ? err.message : 'Failed to update AI responses setting');
    } finally {
      setTelegramAiSaving(false);
    }
  };

  // ===== WhatsApp handlers =====
  const handleWhatsappConnect = async () => {
    if (!whatsappPhoneNumberId.trim() || !whatsappAccessToken.trim()) {
      toast.error('Please enter your Phone Number ID and Access Token');
      return;
    }
    setWhatsappConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp_config: {
            enabled: true,
            phone_number_id: whatsappPhoneNumberId.trim(),
            access_token: whatsappAccessToken.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/whatsapp/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up WhatsApp webhook');
      setWhatsappConnected(true);
      setWhatsappAiEnabled(true);
      setWhatsappPhoneNumberId('');
      setWhatsappAccessToken('');
      toast.success('WhatsApp connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect WhatsApp');
    } finally {
      setWhatsappConnecting(false);
    }
  };

  const handleWhatsappDisconnect = async () => {
    setWhatsappDisconnecting(true);
    try {
      await fetch(`/api/whatsapp/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_config: { enabled: false } }),
      });
      setWhatsappConnected(false);
      setWhatsappAiEnabled(false);
      toast.success('WhatsApp disconnected');
    } catch {
      toast.error('Failed to disconnect WhatsApp');
    } finally {
      setWhatsappDisconnecting(false);
    }
  };

  const handleWhatsappAiToggle = async () => {
    const newValue = !whatsappAiEnabled;
    setWhatsappAiEnabled(newValue);
    setWhatsappAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp_config: { ...chatbot?.whatsapp_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setWhatsappAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setWhatsappAiSaving(false);
    }
  };

  // ===== Teams handlers =====
  const handleTeamsConnect = async () => {
    if (!teamsAppId.trim() || !teamsAppSecret.trim()) {
      toast.error('Please enter your App ID and App Secret');
      return;
    }
    setTeamsConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teams_config: {
            enabled: true,
            app_id: teamsAppId.trim(),
            app_secret: teamsAppSecret.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/teams/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up Teams webhook');
      setTeamsConnected(true);
      setTeamsAiEnabled(true);
      setTeamsAppId('');
      setTeamsAppSecret('');
      toast.success('Microsoft Teams connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect Teams');
    } finally {
      setTeamsConnecting(false);
    }
  };

  const handleTeamsDisconnect = async () => {
    setTeamsDisconnecting(true);
    try {
      await fetch(`/api/teams/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams_config: { enabled: false } }),
      });
      setTeamsConnected(false);
      setTeamsBotName(null);
      setTeamsAiEnabled(false);
      toast.success('Microsoft Teams disconnected');
    } catch {
      toast.error('Failed to disconnect Teams');
    } finally {
      setTeamsDisconnecting(false);
    }
  };

  const handleTeamsAiToggle = async () => {
    const newValue = !teamsAiEnabled;
    setTeamsAiEnabled(newValue);
    setTeamsAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teams_config: { ...chatbot?.teams_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setTeamsAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setTeamsAiSaving(false);
    }
  };

  // ===== Discord handlers =====
  const handleDiscordConnect = async () => {
    if (!discordAppId.trim() || !discordBotToken.trim() || !discordPublicKey.trim()) {
      toast.error('Please enter your Application ID, Bot Token, and Public Key');
      return;
    }
    setDiscordConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discord_config: {
            enabled: true,
            application_id: discordAppId.trim(),
            bot_token: discordBotToken.trim(),
            public_key: discordPublicKey.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/discord/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up Discord webhook');
      setDiscordConnected(true);
      setDiscordAiEnabled(true);
      setDiscordAppId('');
      setDiscordBotToken('');
      setDiscordPublicKey('');
      toast.success('Discord connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect Discord');
    } finally {
      setDiscordConnecting(false);
    }
  };

  const handleDiscordDisconnect = async () => {
    setDiscordDisconnecting(true);
    try {
      await fetch(`/api/discord/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_config: { enabled: false } }),
      });
      setDiscordConnected(false);
      setDiscordAiEnabled(false);
      toast.success('Discord disconnected');
    } catch {
      toast.error('Failed to disconnect Discord');
    } finally {
      setDiscordDisconnecting(false);
    }
  };

  const handleDiscordAiToggle = async () => {
    const newValue = !discordAiEnabled;
    setDiscordAiEnabled(newValue);
    setDiscordAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discord_config: { ...chatbot?.discord_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setDiscordAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setDiscordAiSaving(false);
    }
  };

  // ===== Messenger handlers =====
  const handleMessengerConnect = async () => {
    if (!messengerPageId.trim() || !messengerAccessToken.trim()) {
      toast.error('Please enter your Page ID and Access Token');
      return;
    }
    setMessengerConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messenger_config: {
            enabled: true,
            page_id: messengerPageId.trim(),
            page_name: messengerPageName.trim() || undefined,
            access_token: messengerAccessToken.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/messenger/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up Messenger webhook');
      setMessengerConnected(true);
      setMessengerAiEnabled(true);
      setMessengerPageId('');
      setMessengerPageName('');
      setMessengerAccessToken('');
      toast.success('Messenger connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect Messenger');
    } finally {
      setMessengerConnecting(false);
    }
  };

  const handleMessengerDisconnect = async () => {
    setMessengerDisconnecting(true);
    try {
      await fetch(`/api/messenger/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messenger_config: { enabled: false } }),
      });
      setMessengerConnected(false);
      setMessengerAiEnabled(false);
      toast.success('Messenger disconnected');
    } catch {
      toast.error('Failed to disconnect Messenger');
    } finally {
      setMessengerDisconnecting(false);
    }
  };

  const handleMessengerAiToggle = async () => {
    const newValue = !messengerAiEnabled;
    setMessengerAiEnabled(newValue);
    setMessengerAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messenger_config: { ...chatbot?.messenger_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setMessengerAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setMessengerAiSaving(false);
    }
  };

  // ===== Instagram handlers =====
  const handleInstagramConnect = async () => {
    if (!instagramId.trim() || !instagramAccessToken.trim()) {
      toast.error('Please enter your Instagram ID and Access Token');
      return;
    }
    setInstagramConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instagram_config: {
            enabled: true,
            instagram_id: instagramId.trim(),
            username: instagramUsername.trim() || undefined,
            access_token: instagramAccessToken.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/instagram/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up Instagram webhook');
      setInstagramConnected(true);
      setInstagramAiEnabled(true);
      setInstagramId('');
      setInstagramUsername('');
      setInstagramAccessToken('');
      toast.success('Instagram connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect Instagram');
    } finally {
      setInstagramConnecting(false);
    }
  };

  const handleInstagramDisconnect = async () => {
    setInstagramDisconnecting(true);
    try {
      await fetch(`/api/instagram/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagram_config: { enabled: false } }),
      });
      setInstagramConnected(false);
      setInstagramAiEnabled(false);
      toast.success('Instagram disconnected');
    } catch {
      toast.error('Failed to disconnect Instagram');
    } finally {
      setInstagramDisconnecting(false);
    }
  };

  const handleInstagramAiToggle = async () => {
    const newValue = !instagramAiEnabled;
    setInstagramAiEnabled(newValue);
    setInstagramAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instagram_config: { ...chatbot?.instagram_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setInstagramAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setInstagramAiSaving(false);
    }
  };

  // ===== Email handlers =====
  const handleEmailEnable = async () => {
    setEmailSaving(true);
    try {
      const res = await fetch(`/api/email/setup?chatbot_id=${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reply_name: emailReplyName, ai_responses_enabled: emailAiEnabled }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to enable email');
      setEmailEnabled(true);
      setEmailAddress(data.data.email_address);
      toast.success('Email integration enabled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to enable email integration');
    } finally {
      setEmailSaving(false);
    }
  };

  const handleEmailDisable = async () => {
    setEmailSaving(true);
    try {
      const res = await fetch(`/api/email/setup?chatbot_id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to disable email');
      setEmailEnabled(false);
      setEmailAddress(null);
      toast.success('Email integration disabled');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disable email integration');
    } finally {
      setEmailSaving(false);
    }
  };

  const handleEmailSettingsSave = async () => {
    setEmailSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email_config: {
            ...chatbot?.email_config,
            reply_name: emailReplyName,
            ai_responses_enabled: emailAiEnabled,
          },
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success('Email settings saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save email settings');
    } finally {
      setEmailSaving(false);
    }
  };

  // ===== SMS handlers =====
  const handleSmsConnect = async () => {
    if (!smsAccountSid.trim() || !smsAuthToken.trim() || !smsPhoneNumber.trim()) {
      toast.error('Please enter your Account SID, Auth Token, and phone number');
      return;
    }
    setSmsConnecting(true);
    try {
      const patchRes = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sms_config: {
            enabled: true,
            account_sid: smsAccountSid.trim(),
            auth_token: smsAuthToken.trim(),
            phone_number: smsPhoneNumber.trim(),
            ai_responses_enabled: true,
          },
        }),
      });
      if (!patchRes.ok) throw new Error((await patchRes.json()).error?.message || 'Failed to save config');
      const setupRes = await fetch(`/api/sms/setup?chatbot_id=${id}`, { method: 'POST' });
      if (!setupRes.ok) throw new Error((await setupRes.json()).error || 'Failed to set up SMS webhook');
      setSmsConnected(true);
      setSmsAiEnabled(true);
      setSmsAccountSid('');
      setSmsAuthToken('');
      setSmsPhoneNumber('');
      toast.success('SMS connected successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to connect SMS');
    } finally {
      setSmsConnecting(false);
    }
  };

  const handleSmsDisconnect = async () => {
    setSmsDisconnecting(true);
    try {
      await fetch(`/api/sms/setup?chatbot_id=${id}`, { method: 'DELETE' });
      await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms_config: { enabled: false } }),
      });
      setSmsConnected(false);
      setSmsAiEnabled(false);
      toast.success('SMS disconnected');
    } catch {
      toast.error('Failed to disconnect SMS');
    } finally {
      setSmsDisconnecting(false);
    }
  };

  const handleSmsAiToggle = async () => {
    const newValue = !smsAiEnabled;
    setSmsAiEnabled(newValue);
    setSmsAiSaving(true);
    try {
      const res = await fetch(`/api/chatbots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sms_config: { ...chatbot?.sms_config, ai_responses_enabled: newValue } }),
      });
      if (!res.ok) throw new Error((await res.json()).error?.message || 'Failed to save');
      toast.success(`AI responses ${newValue ? 'enabled' : 'disabled'}`);
    } catch (err) {
      setSmsAiEnabled(!newValue);
      toast.error(err instanceof Error ? err.message : 'Failed to update setting');
    } finally {
      setSmsAiSaving(false);
    }
  };

  // Handle expand/shrink messages from the widget iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = document.querySelector('iframe[title="Chatbot Preview"]') as HTMLIFrameElement;
      if (!iframe || event.source !== iframe.contentWindow) return;

      if (event.data?.type === 'expand-chat-widget') {
        setPreviewExpanded(true);
        iframe.contentWindow?.postMessage({ type: 'widget-expanded' }, '*');
      } else if (event.data?.type === 'shrink-chat-widget') {
        setPreviewExpanded(false);
        iframe.contentWindow?.postMessage({ type: 'widget-shrunk' }, '*');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);
  const isPublished = chatbot?.is_published ?? false;
  const handoffEnabled = chatbot?.live_handoff_config?.enabled ?? false;

  const handlePublish = async () => {
    if (!chatbot) return;
    setPublishing(true);
    try {
      const response = await fetch(`/api/chatbots/${id}/publish`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to publish chatbot');
      }
      const data = await response.json();
      setChatbot(data.data.chatbot);
      toast.success('Chatbot published \u2014 embed codes are now active');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish chatbot');
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = async (text: string, codeType: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedCode(codeType);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  if (error || !chatbot) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600 dark:text-red-400">{error || 'Chatbot not found'}</p>
      </div>
    );
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com';

  // Widget embed codes
  const embedCodes: Record<string, { code: string; language: string; hint: string }> = {
    script: {
      code: `<script src="${baseUrl}/widget/sdk.js" data-chatbot-id="${id}"></script>`,
      language: 'html',
      hint: 'Paste before </body>. Works with any HTML site, WordPress, Shopify, Webflow, and more.',
    },
    nextjs: {
      code: `import Script from 'next/script';

// Add to your root layout (app/layout.tsx)
<Script
  src="${baseUrl}/widget/sdk.js"
  data-chatbot-id="${id}"
  strategy="afterInteractive"
/>`,
      language: 'tsx',
      hint: 'Add the Script component to your root layout for SSR-compatible loading.',
    },
    manual: {
      code: `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  ChatWidget.init({ chatbotId: '${id}' });
</script>`,
      language: 'html',
      hint: 'Use when you need to control exactly when the widget initializes (e.g. after login).',
    },
    iframe: {
      code: `<iframe
  src="${baseUrl}/widget/${id}"
  style="border:none;width:${chatbot.widget_config?.width || 400}px;height:${chatbot.widget_config?.height || 600}px;"
  allow="clipboard-write"
></iframe>`,
      language: 'html',
      hint: 'Embeds the chat inline on a page. Use when you need strict sandboxing or cannot add scripts.',
    },
  };

  const authenticatedUserCode = `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: '${id}',
    user: {
      id: 'user_123',        // Required: stable user ID
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro'            // Any custom fields
    },
    context: {
      recent_orders: [
        { id: 'ORD-001', total: '$149', status: 'shipped' }
      ],
      account_balance: '$42.50',
      subscription: { plan: 'Pro', renewal: '2024-04-15' }
    }
  });
</script>`;

  // Agent console codes
  const agentConsoleOneLiner = `<script
  src="${baseUrl}/agent-console/sdk.js"
  data-chatbot-id="${id}"
  data-api-key="YOUR_API_KEY"
></script>`;

  const agentConsoleManualCode = `<script src="${baseUrl}/agent-console/sdk.js"></script>
<script>
  AgentConsole.init({
    chatbotId: '${id}',
    apiKey: 'YOUR_API_KEY',
    position: 'full',       // 'full' or 'sidebar'
    container: '#my-console' // CSS selector or DOM element
  });
</script>`;

  const agentConsoleIframeCode = `<iframe
  src="${baseUrl}/agent-console/${id}#key=YOUR_API_KEY"
  style="border:none;width:100%;height:700px;"
  allow="clipboard-write"
></iframe>`;

  // API codes
  const apiExample = `curl -X POST "${baseUrl}/api/chat/${id}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"message": "Hello!", "session_id": "unique-session-id"}'`;

  const jsApiExample = `const res = await fetch('${baseUrl}/api/chat/${id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello!',
    session_id: 'unique-session-id'
  })
});
const data = await res.json();`;

  const currentEmbed = embedCodes[embedMethod];

  return (
    <div className="space-y-6">
      <ChatbotPageHeader
        chatbotId={id}
        title="Deploy Chatbot"
        actions={
          <Link
            href="/sdk#chatbots"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            SDK Docs
          </Link>
        }
      />

      {/* Unpublished info banner */}
      {!isPublished && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Chatbot not published</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                The embed codes below are ready to add to your site. The widget will not render for visitors until you publish.
              </p>
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={handlePublish}
              disabled={publishing}
              className="flex-shrink-0"
            >
              {publishing ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : null}
              Publish now
            </Button>
          </div>
        </div>
      )}

      {/* Top-level tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="widget" className="gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Widget Embed
          </TabsTrigger>
          <TabsTrigger value="agent-console" className="gap-1.5">
            <Headphones className="w-3.5 h-3.5" />
            Agent Console
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            REST API
          </TabsTrigger>
          <TabsTrigger value="slack" className="gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Slack
          </TabsTrigger>
          <TabsTrigger value="telegram" className="gap-1.5">
            <Send className="w-3.5 h-3.5" />
            Telegram
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            WhatsApp
          </TabsTrigger>
          <TabsTrigger value="teams" className="gap-1.5">
            <Users className="w-3.5 h-3.5" />
            Teams
          </TabsTrigger>
          <TabsTrigger value="discord" className="gap-1.5">
            <Gamepad2 className="w-3.5 h-3.5" />
            Discord
          </TabsTrigger>
          <TabsTrigger value="messenger" className="gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Messenger
          </TabsTrigger>
          <TabsTrigger value="instagram" className="gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            Instagram
          </TabsTrigger>
          <TabsTrigger value="sms" className="gap-1.5">
            <Smartphone className="w-3.5 h-3.5" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            Email
          </TabsTrigger>
        </TabsList>

        {/* ========== WIDGET EMBED TAB ========== */}
        <TabsContent value="widget">
          <div className="space-y-6 mt-4">
            {/* Embed method + preview side by side on desktop */}
            <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
              {/* Left: Embed code selection */}
              <div className="xl:col-span-3 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Choose Embed Method</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Method selector */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'script', label: 'Script Tag', icon: Zap, desc: 'Universal' },
                        { id: 'nextjs', label: 'Next.js / React', icon: FileCode, desc: 'SSR' },
                        { id: 'manual', label: 'Manual Init', icon: Code, desc: 'Controlled' },
                        { id: 'iframe', label: 'iFrame', icon: Globe, desc: 'Sandboxed' },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setEmbedMethod(method.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            embedMethod === method.id
                              ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                              : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600 hover:text-secondary-800 dark:hover:text-secondary-200'
                          }`}
                        >
                          <method.icon className="w-3.5 h-3.5" />
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {/* Selected code block */}
                    <div className="relative">
                      <CodeBlock
                        code={currentEmbed.code}
                        language={currentEmbed.language}
                        copyId={embedMethod}
                        copiedCode={copiedCode}
                        onCopy={copyToClipboard}
                      />
                    </div>

                    {/* Post-copy hint */}
                    <p className="text-sm text-secondary-500 dark:text-secondary-400">
                      {copiedCode === embedMethod ? (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Copied! Paste into your site, then visit it to verify the chat icon appears.
                        </span>
                      ) : (
                        currentEmbed.hint
                      )}
                    </p>
                  </CardContent>
                </Card>

                {/* Authenticated Users - collapsible */}
                <Card>
                  <button
                    onClick={() => setShowAuthSection(!showAuthSection)}
                    className="w-full"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Code className="w-4 h-4 text-purple-500" />
                          <CardTitle className="text-base">Authenticated Users</CardTitle>
                          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-[10px]">
                            Advanced
                          </Badge>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-secondary-400 transition-transform ${showAuthSection ? 'rotate-180' : ''}`} />
                      </div>
                      <CardDescription className="text-left mt-1">Pass logged-in user data so the chatbot knows who they are</CardDescription>
                    </CardHeader>
                  </button>
                  {showAuthSection && (
                    <CardContent className="space-y-4 pt-0">
                      <CodeBlock
                        code={authenticatedUserCode}
                        language="html"
                        copyId="authenticated"
                        copiedCode={copiedCode}
                        onCopy={copyToClipboard}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">user object</p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            Pass verified user identity (name, email, plan). Requires an <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">id</code> field. Skips the pre-chat form automatically.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">context object</p>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            Pass account data (orders, billing, subscription). The chatbot can answer &quot;Where&apos;s my order?&quot; or &quot;When does my plan renew?&quot;
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              </div>

              {/* Right: Live Preview */}
              <div className="xl:col-span-2">
                <Card className="sticky top-6">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Live Preview</CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-secondary-500"
                          onClick={() => setShowPreview(!showPreview)}
                        >
                          {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </Button>
                        <Button variant="outline" size="sm" className="h-7" asChild>
                          <a href={`/widget/${id}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-3.5 h-3.5 mr-1" />
                            Open
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className={`pt-0 ${showPreview ? '' : 'hidden'}`}>
                    <div className={`bg-secondary-100 dark:bg-secondary-800 rounded-lg p-3 overflow-hidden transition-all duration-300 ${previewExpanded ? 'h-[700px]' : 'h-[520px]'}`}>
                      <iframe
                        src={`/widget/${id}?preview`}
                        className="rounded-lg border-0 w-full h-full"
                        title="Chatbot Preview"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ========== AGENT CONSOLE TAB ========== */}
        <TabsContent value="agent-console">
          <div className="space-y-6 mt-4">
            {!handoffEnabled ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Headphones className="w-10 h-10 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" />
                  <p className="text-lg font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Live handoff is not enabled
                  </p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mb-4 max-w-md mx-auto">
                    Enable live handoff in your chatbot settings to get agent console embed codes. This lets your team take over conversations from the AI in real time.
                  </p>
                  <Button asChild>
                    <Link href={`/dashboard/chatbots/${id}/settings`}>
                      Go to Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                        <Headphones className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <CardTitle>Agent Console Embed</CardTitle>
                        <CardDescription>Let your team manage live conversations without logging into the dashboard</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Method selector */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'quick', label: 'Quick Embed', icon: Zap },
                        { id: 'agent-manual', label: 'Manual Init', icon: Code },
                        { id: 'agent-iframe', label: 'iFrame', icon: Globe },
                      ].map((method) => (
                        <button
                          key={method.id}
                          onClick={() => setAgentMethod(method.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                            agentMethod === method.id
                              ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300'
                              : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600 hover:text-secondary-800 dark:hover:text-secondary-200'
                          }`}
                        >
                          <method.icon className="w-3.5 h-3.5" />
                          {method.label}
                        </button>
                      ))}
                    </div>

                    {/* Selected code block */}
                    {agentMethod === 'quick' && (
                      <div>
                        <CodeBlock
                          code={agentConsoleOneLiner}
                          language="html"
                          copyId="agent-oneliner"
                          copiedCode={copiedCode}
                          onCopy={copyToClipboard}
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                          Full-page console. Add <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">data-position=&quot;sidebar&quot;</code> for a fixed sidebar instead.
                        </p>
                      </div>
                    )}
                    {agentMethod === 'agent-manual' && (
                      <div>
                        <CodeBlock
                          code={agentConsoleManualCode}
                          language="html"
                          copyId="agent-manual"
                          copiedCode={copiedCode}
                          onCopy={copyToClipboard}
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                          Load the SDK separately and mount into a specific container element.
                        </p>
                      </div>
                    )}
                    {agentMethod === 'agent-iframe' && (
                      <div>
                        <CodeBlock
                          code={agentConsoleIframeCode}
                          language="html"
                          copyId="agent-iframe"
                          copiedCode={copiedCode}
                          onCopy={copyToClipboard}
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                          Embed via iframe when you need strict sandboxing or cannot add scripts.
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">position: full</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          Fills the parent container or viewport. Use <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">container</code> to mount into a specific element.
                        </p>
                      </div>
                      <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">position: sidebar</p>
                        <p className="text-xs text-secondary-500 dark:text-secondary-400">
                          Fixed 420px sidebar docked to the right edge. Great for internal support dashboards.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Required</p>
                        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                          Replace <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">YOUR_API_KEY</code> with a key from the{' '}
                          <Link href="/dashboard/api-keys" className="text-amber-800 dark:text-amber-200 underline hover:no-underline font-medium">
                            API Keys page
                          </Link>
                          . Keep it server-side or in a protected admin area.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </TabsContent>

        {/* ========== REST API TAB ========== */}
        <TabsContent value="api">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>REST API</CardTitle>
                    <CardDescription>Build custom chat UIs, backend integrations, or mobile apps</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Endpoint */}
                <div>
                  <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                    Endpoint
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-3 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-mono text-xs">POST</Badge>
                      <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200">{baseUrl}/api/chat/{id}</code>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(`${baseUrl}/api/chat/${id}`, 'endpoint')}
                    >
                      {copiedCode === 'endpoint' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Method selector */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'curl', label: 'cURL', icon: Terminal },
                    { id: 'javascript', label: 'JavaScript', icon: FileCode },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setApiMethod(method.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        apiMethod === method.id
                          ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                          : 'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600 hover:text-secondary-800 dark:hover:text-secondary-200'
                      }`}
                    >
                      <method.icon className="w-3.5 h-3.5" />
                      {method.label}
                    </button>
                  ))}
                </div>

                {/* Selected code block */}
                {apiMethod === 'curl' && (
                  <div>
                    <CodeBlock
                      code={apiExample}
                      language="bash"
                      copyId="curl"
                      copiedCode={copiedCode}
                      onCopy={copyToClipboard}
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                      Test from your terminal. Great for quick testing and debugging.
                    </p>
                  </div>
                )}
                {apiMethod === 'javascript' && (
                  <div>
                    <CodeBlock
                      code={jsApiExample}
                      language="javascript"
                      copyId="js"
                      copiedCode={copiedCode}
                      onCopy={copyToClipboard}
                    />
                    <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
                      Use in Node.js or browser environments with the fetch API.
                    </p>
                  </div>
                )}

                {/* API Key notice */}
                <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Required</p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Replace <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">YOUR_API_KEY</code> with a key from the{' '}
                      <Link href="/dashboard/api-keys" className="text-amber-800 dark:text-amber-200 underline hover:no-underline font-medium">
                        API Keys page
                      </Link>
                      . Never expose your API key in client-side code.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== SLACK TAB ========== */}
        <TabsContent value="slack">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <CardTitle>Slack</CardTitle>
                    <CardDescription>Deploy this chatbot to your Slack workspace so your team can query its knowledge base directly in channels or DMs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {slackLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : slackStatus?.connected ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Slack</p>
                          {slackStatus.team_name && (
                            <p className="text-xs text-green-700 dark:text-green-300">Workspace: {slackStatus.team_name}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSlackDisconnect}
                        disabled={slackDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {slackDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Mention the bot in any channel or send it a DM to get answers from your knowledge base. The bot responds in-thread.
                      </p>
                    </div>

                    {/* Slack Configuration */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        {/* Mention only toggle */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Mention only mode</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              When enabled, the bot only responds when @mentioned. It won&apos;t respond to direct messages.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={slackMentionOnly}
                            onClick={() => setSlackMentionOnly(!slackMentionOnly)}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              slackMentionOnly ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', slackMentionOnly ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>

                        {/* Channel IDs input */}
                        <div>
                          <label htmlFor="slack-channel-ids" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                            Restrict to channels
                          </label>
                          <input
                            id="slack-channel-ids"
                            type="text"
                            value={slackChannelIds}
                            onChange={(e) => setSlackChannelIds(e.target.value)}
                            placeholder="C01ABC123, C04XYZ789"
                            className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                            Comma-separated channel IDs to restrict the bot to. Leave empty to allow all channels.
                          </p>
                        </div>

                        {/* Save button */}
                        <Button
                          size="sm"
                          onClick={handleSlackConfigSave}
                          disabled={slackConfigSaving}
                        >
                          {slackConfigSaving ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : null}
                          Save settings
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {slackStatus?.workspace_taken_by && (
                      <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Workspace already connected</p>
                          <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                            <span className="font-medium">{slackStatus.workspace_taken_by.team_name}</span> is already connected to <span className="font-medium">{slackStatus.workspace_taken_by.chatbot_name}</span>. Only one chatbot can be connected per workspace.
                          </p>
                          <Link
                            href={`/dashboard/chatbots/${slackStatus.workspace_taken_by.chatbot_id}/deploy`}
                            className="inline-flex items-center gap-1 text-xs text-amber-800 dark:text-amber-200 underline hover:no-underline mt-2"
                          >
                            View {slackStatus.workspace_taken_by.chatbot_name}
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>
                    )}
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Connect your Slack workspace to deploy this chatbot. Once connected, your team can @mention the bot or DM it to query your knowledge base.
                    </p>
                    {!slackStatus?.workspace_taken_by && (
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        One Slack workspace per account. Connecting here will use your plan&apos;s Slack integration slot.
                      </p>
                    )}
                    <Button onClick={handleSlackConnect} disabled={slackConnecting} className="gap-2">
                      {slackConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      {slackConnecting ? 'Redirecting to Slack...' : 'Connect to Slack'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== TELEGRAM TAB ========== */}
        <TabsContent value="telegram">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Send className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Telegram</CardTitle>
                    <CardDescription>Deploy this chatbot as a Telegram bot that responds to messages with AI-powered answers from your knowledge base</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {telegramLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : telegramConnected ? (
                  <>
                    {/* Connected banner */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Telegram</p>
                          {telegramBotUsername && (
                            <p className="text-xs text-green-700 dark:text-green-300">Bot: @{telegramBotUsername}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTelegramDisconnect}
                        disabled={telegramDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {telegramDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>

                    {/* Bot Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        {/* AI Responses toggle */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              When enabled, the bot responds to messages with AI-powered answers from your knowledge base.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={telegramAiEnabled}
                            onClick={handleTelegramAiToggle}
                            disabled={telegramAiSaving}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              telegramAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600',
                              telegramAiSaving && 'opacity-50'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', telegramAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Behavior info */}
                    <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1.5">
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">In private chats:</span> responds to all messages
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">In group chats:</span> responds when @mentioned
                        </p>
                      </div>
                    </div>

                    {/* Link to handoff settings */}
                    <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Need live handoff to a human agent via Telegram?{' '}
                        <Link
                          href={`/dashboard/chatbots/${id}/settings`}
                          className="text-primary-600 dark:text-primary-400 underline hover:no-underline font-medium"
                        >
                          Configure handoff settings
                        </Link>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Setup guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Connect a Telegram bot to deploy this chatbot. Follow these steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">1</span>
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Create a bot</p>
                          </div>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            Open Telegram and message{' '}
                            <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 underline hover:no-underline font-medium">
                              @BotFather
                            </a>
                            . Send <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">/newbot</code> and follow the prompts.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">2</span>
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Copy the token</p>
                          </div>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            BotFather will give you an API token. Copy it and paste it below.
                          </p>
                        </div>
                        <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">3</span>
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Connect</p>
                          </div>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">
                            Click &quot;Connect to Telegram&quot; to register the webhook and start receiving messages.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bot token input */}
                    <div>
                      <label htmlFor="telegram-bot-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">
                        Bot Token
                      </label>
                      <input
                        id="telegram-bot-token"
                        type="password"
                        value={telegramBotToken}
                        onChange={(e) => setTelegramBotToken(e.target.value)}
                        placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                        className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        The HTTP API token you received from @BotFather. This is stored securely and encrypted at rest.
                      </p>
                    </div>

                    {/* Connect button */}
                    <Button onClick={handleTelegramConnect} disabled={telegramConnecting || !telegramBotToken.trim()} className="gap-2">
                      {telegramConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {telegramConnecting ? 'Connecting...' : 'Connect to Telegram'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== WHATSAPP TAB ========== */}
        <TabsContent value="whatsapp">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <CardTitle>WhatsApp</CardTitle>
                    <CardDescription>Deploy this chatbot on WhatsApp to respond to incoming messages with AI-powered answers from your knowledge base</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {whatsappLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : whatsappConnected ? (
                  <>
                    {/* Connected banner */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to WhatsApp</p>
                          {chatbot?.whatsapp_config?.phone_number_id && (
                            <p className="text-xs text-green-700 dark:text-green-300">Phone Number ID: {chatbot.whatsapp_config.phone_number_id}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleWhatsappDisconnect}
                        disabled={whatsappDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {whatsappDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>

                    {/* Bot Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              The bot responds to all incoming WhatsApp messages with AI-powered answers from your knowledge base.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={whatsappAiEnabled}
                            onClick={handleWhatsappAiToggle}
                            disabled={whatsappAiSaving}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              whatsappAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600',
                              whatsappAiSaving && 'opacity-50'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', whatsappAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Webhook URL</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/whatsapp/webhook?chatbot_id={id}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${baseUrl}/api/whatsapp/webhook?chatbot_id=${id}`, 'whatsapp-webhook')}
                        >
                          {copiedCode === 'whatsapp-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        Paste this URL in your Meta app&apos;s webhook configuration settings.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Setup guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Connect your WhatsApp Business account to deploy this chatbot. Follow these steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { n: '1', title: 'Create a Meta Business app', desc: 'Set up a Meta Business account and create a WhatsApp Business app in the Meta Developer Dashboard.' },
                          { n: '2', title: 'Get your credentials', desc: 'Copy your Phone Number ID and generate a permanent access token from the Meta Developer Dashboard.' },
                          { n: '3', title: 'Enter credentials below', desc: 'Paste your Phone Number ID and access token in the fields below and click Connect.' },
                          { n: '4', title: 'Configure webhook', desc: 'After connecting, copy the webhook URL displayed here and add it to your Meta app\'s webhook settings.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="whatsapp-phone-id" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Phone Number ID</label>
                        <input
                          id="whatsapp-phone-id"
                          type="text"
                          value={whatsappPhoneNumberId}
                          onChange={(e) => setWhatsappPhoneNumberId(e.target.value)}
                          placeholder="123456789012345"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="whatsapp-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Access Token</label>
                        <input
                          id="whatsapp-token"
                          type="password"
                          value={whatsappAccessToken}
                          onChange={(e) => setWhatsappAccessToken(e.target.value)}
                          placeholder="Your permanent access token"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          Your permanent access token from the Meta Developer Dashboard. Stored securely and encrypted at rest.
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleWhatsappConnect} disabled={whatsappConnecting || !whatsappPhoneNumberId.trim() || !whatsappAccessToken.trim()} className="gap-2">
                      {whatsappConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      {whatsappConnecting ? 'Connecting...' : 'Connect to WhatsApp'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== MICROSOFT TEAMS TAB ========== */}
        <TabsContent value="teams">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg">
                    <Users className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <CardTitle>Microsoft Teams</CardTitle>
                    <CardDescription>Deploy this chatbot to Microsoft Teams so your team can chat with it in 1:1 conversations or @mention it in channels</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {teamsLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : teamsConnected ? (
                  <>
                    {/* Connected banner */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Microsoft Teams</p>
                          {teamsBotName && (
                            <p className="text-xs text-green-700 dark:text-green-300">Bot: {teamsBotName}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTeamsDisconnect}
                        disabled={teamsDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {teamsDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>

                    {/* Bot Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              When enabled, the bot responds to messages with AI-powered answers from your knowledge base.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={teamsAiEnabled}
                            onClick={handleTeamsAiToggle}
                            disabled={teamsAiSaving}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              teamsAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600',
                              teamsAiSaving && 'opacity-50'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', teamsAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Behavior info */}
                    <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-1.5">
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">In 1:1 chats:</span> responds to all messages
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          <span className="font-medium text-secondary-900 dark:text-secondary-100">In channels:</span> responds when @mentioned
                        </p>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Messaging Endpoint</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/teams/webhook?chatbot_id={id}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${baseUrl}/api/teams/webhook?chatbot_id=${id}`, 'teams-webhook')}
                        >
                          {copiedCode === 'teams-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        Set this as the messaging endpoint in the Azure Bot Framework portal.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Setup guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Connect a Microsoft Teams bot to deploy this chatbot. Follow these steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { n: '1', title: 'Register a bot', desc: 'Create a bot registration in the Azure Bot Framework portal.' },
                          { n: '2', title: 'Get your credentials', desc: 'Copy your App ID and App Secret from the Azure portal.' },
                          { n: '3', title: 'Enter credentials below', desc: 'Paste your credentials and click Connect.' },
                          { n: '4', title: 'Set messaging endpoint', desc: 'After connecting, copy the webhook URL and set it as the messaging endpoint in Azure.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="teams-app-id" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">App ID</label>
                        <input
                          id="teams-app-id"
                          type="text"
                          value={teamsAppId}
                          onChange={(e) => setTeamsAppId(e.target.value)}
                          placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="teams-app-secret" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">App Secret</label>
                        <input
                          id="teams-app-secret"
                          type="password"
                          value={teamsAppSecret}
                          onChange={(e) => setTeamsAppSecret(e.target.value)}
                          placeholder="Your app secret"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          Your app secret from the Azure Bot Framework portal. Stored securely and encrypted at rest.
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleTeamsConnect} disabled={teamsConnecting || !teamsAppId.trim() || !teamsAppSecret.trim()} className="gap-2">
                      {teamsConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                      {teamsConnecting ? 'Connecting...' : 'Connect to Teams'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== DISCORD TAB ========== */}
        <TabsContent value="discord">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                    <Gamepad2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <CardTitle>Discord</CardTitle>
                    <CardDescription>Deploy this chatbot to Discord so users can interact with it using slash commands</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {discordLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : discordConnected ? (
                  <>
                    {/* Connected banner */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Discord</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDiscordDisconnect}
                        disabled={discordDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {discordDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>

                    {/* Bot Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              When enabled, the bot responds to slash commands with AI-powered answers from your knowledge base.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={discordAiEnabled}
                            onClick={handleDiscordAiToggle}
                            disabled={discordAiSaving}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              discordAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600',
                              discordAiSaving && 'opacity-50'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', discordAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Behavior info */}
                    <div className="flex items-start gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <Info className="w-5 h-5 text-secondary-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Users interact with the bot using the <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px] font-mono">/ask</code> command. Example: <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px] font-mono">/ask What are your business hours?</code>
                      </p>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Interactions Endpoint URL</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/discord/webhook/{id}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${baseUrl}/api/discord/webhook/${id}`, 'discord-webhook')}
                        >
                          {copiedCode === 'discord-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        Set this as the Interactions Endpoint URL in your Discord application settings.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Setup guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Connect a Discord bot to deploy this chatbot. Follow these steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { n: '1', title: 'Create a Discord app', desc: <>Go to <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-violet-600 dark:text-violet-400 underline hover:no-underline font-medium">discord.com/developers</a> and create a new application.</> },
                          { n: '2', title: 'Create a bot user', desc: 'Navigate to the Bot section, create a bot user, and copy the bot token.' },
                          { n: '3', title: 'Copy credentials', desc: 'Copy the Application ID and Public Key from the General Information page.' },
                          { n: '4', title: 'Enter credentials', desc: 'Paste your credentials below and click Connect.' },
                          { n: '5', title: 'Set endpoint URL', desc: 'Copy the webhook URL and set it as the Interactions Endpoint URL in your app settings.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="discord-app-id" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Application ID</label>
                        <input
                          id="discord-app-id"
                          type="text"
                          value={discordAppId}
                          onChange={(e) => setDiscordAppId(e.target.value)}
                          placeholder="123456789012345678"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="discord-bot-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Bot Token</label>
                        <input
                          id="discord-bot-token"
                          type="password"
                          value={discordBotToken}
                          onChange={(e) => setDiscordBotToken(e.target.value)}
                          placeholder="Your bot token"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="discord-public-key" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Public Key</label>
                        <input
                          id="discord-public-key"
                          type="text"
                          value={discordPublicKey}
                          onChange={(e) => setDiscordPublicKey(e.target.value)}
                          placeholder="Your application public key"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          Credentials are stored securely and encrypted at rest.
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleDiscordConnect} disabled={discordConnecting || !discordAppId.trim() || !discordBotToken.trim() || !discordPublicKey.trim()} className="gap-2">
                      {discordConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gamepad2 className="w-4 h-4" />}
                      {discordConnecting ? 'Connecting...' : 'Connect to Discord'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        {/* ========== SMS TAB ========== */}
        <TabsContent value="sms">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Smartphone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>SMS via Twilio</CardTitle>
                    <CardDescription>Connect your Twilio phone number so customers can text it and receive AI-powered replies from your knowledge base</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {smsLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : smsConnected ? (
                  <>
                    {/* Connected banner */}
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Twilio SMS</p>
                          {chatbot?.sms_config?.phone_number && (
                            <p className="text-xs text-green-700 dark:text-green-300">Phone: {chatbot.sms_config.phone_number}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSmsDisconnect}
                        disabled={smsDisconnecting}
                        className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        {smsDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>

                    {/* A2P 10DLC warning */}
                    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">A2P 10DLC Required for US SMS</p>
                        <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                          Your Twilio number must be registered for A2P 10DLC brand + campaign registration to send SMS to US numbers. Complete this in your Twilio Console. Unregistered numbers face delivery failures.
                        </p>
                      </div>
                    </div>

                    {/* Bot Settings */}
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">
                              The bot responds to all incoming SMS messages with AI-powered answers from your knowledge base.
                            </p>
                          </div>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={smsAiEnabled}
                            onClick={handleSmsAiToggle}
                            disabled={smsAiSaving}
                            className={cn(
                              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0',
                              smsAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600',
                              smsAiSaving && 'opacity-50'
                            )}
                          >
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', smsAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Webhook URL */}
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Webhook URL</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/sms/webhook/{id}</code>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(`${baseUrl}/api/sms/webhook/${id}`, 'sms-webhook')}
                        >
                          {copiedCode === 'sms-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                        Set this as the webhook URL in your Twilio Console under Phone Numbers &rarr; Active Numbers &rarr; Messaging Configuration.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Setup guide */}
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        Connect your Twilio phone number to deploy this chatbot via SMS. Follow these steps:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { n: '1', title: 'Get a Twilio account', desc: 'Sign up at twilio.com and purchase a phone number that supports SMS in your region.' },
                          { n: '2', title: 'Copy your credentials', desc: 'Find your Account SID and Auth Token on the Twilio Console dashboard home page.' },
                          { n: '3', title: 'Enter credentials below', desc: 'Paste your Account SID, Auth Token, and the E.164 phone number (e.g. +14155551234).' },
                          { n: '4', title: 'Configure webhook', desc: 'After connecting, paste the webhook URL shown here into your Twilio number\'s Messaging Configuration.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Input fields */}
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="sms-account-sid" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Account SID</label>
                        <input
                          id="sms-account-sid"
                          type="text"
                          value={smsAccountSid}
                          onChange={(e) => setSmsAccountSid(e.target.value)}
                          placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="sms-auth-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Auth Token</label>
                        <input
                          id="sms-auth-token"
                          type="password"
                          value={smsAuthToken}
                          onChange={(e) => setSmsAuthToken(e.target.value)}
                          placeholder="Your Twilio Auth Token"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          Your Twilio Auth Token. Stored securely and encrypted at rest.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="sms-phone-number" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Phone Number</label>
                        <input
                          id="sms-phone-number"
                          type="text"
                          value={smsPhoneNumber}
                          onChange={(e) => setSmsPhoneNumber(e.target.value)}
                          placeholder="+14155551234"
                          className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                          Your Twilio phone number in E.164 format, e.g. +14155551234.
                        </p>
                      </div>
                    </div>

                    <Button onClick={handleSmsConnect} disabled={smsConnecting || !smsAccountSid.trim() || !smsAuthToken.trim() || !smsPhoneNumber.trim()} className="gap-2">
                      {smsConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Smartphone className="w-4 h-4" />}
                      {smsConnecting ? 'Connecting...' : 'Connect SMS'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== MESSENGER TAB ========== */}
        <TabsContent value="messenger">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Facebook Messenger</CardTitle>
                    <CardDescription>Deploy this chatbot on Messenger to respond to incoming messages with AI-powered answers from your knowledge base</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {messengerLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : messengerConnected ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Messenger</p>
                          {chatbot?.messenger_config?.page_name && (
                            <p className="text-xs text-green-700 dark:text-green-300">Page: {chatbot.messenger_config.page_name}</p>
                          )}
                          {chatbot?.messenger_config?.page_id && (
                            <p className="text-xs text-green-700 dark:text-green-300">Page ID: {chatbot.messenger_config.page_id}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleMessengerDisconnect} disabled={messengerDisconnecting} className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        {messengerDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">The bot responds to all incoming Messenger messages with AI-powered answers from your knowledge base.</p>
                          </div>
                          <button type="button" role="switch" aria-checked={messengerAiEnabled} onClick={handleMessengerAiToggle} disabled={messengerAiSaving} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0', messengerAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600', messengerAiSaving && 'opacity-50')}>
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', messengerAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Webhook URL</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/messenger/webhook</code>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${baseUrl}/api/messenger/webhook`, 'messenger-webhook')}>
                          {copiedCode === 'messenger-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Paste this URL in your Meta app&apos;s Messenger webhook configuration.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Connect your Facebook Page to deploy this chatbot on Messenger. Follow these steps:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { n: '1', title: 'Create a Meta app', desc: 'Set up a Meta Developer account and create an app with the Messenger product in the Meta Developer Dashboard.' },
                          { n: '2', title: 'Get your credentials', desc: 'Copy your Facebook Page ID and generate a permanent Page Access Token (system user token) from the Meta Developer Dashboard.' },
                          { n: '3', title: 'Enter credentials below', desc: 'Paste your Page ID and access token in the fields below and click Connect.' },
                          { n: '4', title: 'Configure webhook', desc: 'After connecting, copy the webhook URL shown here and add it to your Meta app\'s Messenger webhook settings.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="messenger-page-id" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Page ID</label>
                        <input id="messenger-page-id" type="text" value={messengerPageId} onChange={(e) => setMessengerPageId(e.target.value)} placeholder="123456789012345" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="messenger-page-name" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Page Name <span className="text-secondary-400 font-normal">(optional)</span></label>
                        <input id="messenger-page-name" type="text" value={messengerPageName} onChange={(e) => setMessengerPageName(e.target.value)} placeholder="My Business Page" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="messenger-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Access Token</label>
                        <input id="messenger-token" type="password" value={messengerAccessToken} onChange={(e) => setMessengerAccessToken(e.target.value)} placeholder="Your permanent Page Access Token" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Your permanent Page Access Token from the Meta Developer Dashboard. Stored securely and encrypted at rest.</p>
                      </div>
                    </div>
                    <Button onClick={handleMessengerConnect} disabled={messengerConnecting || !messengerPageId.trim() || !messengerAccessToken.trim()} className="gap-2">
                      {messengerConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquare className="w-4 h-4" />}
                      {messengerConnecting ? 'Connecting...' : 'Connect to Messenger'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== INSTAGRAM TAB ========== */}
        <TabsContent value="instagram">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-pink-100 dark:bg-pink-900/50 rounded-lg">
                    <Phone className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <CardTitle>Instagram DMs</CardTitle>
                    <CardDescription>Deploy this chatbot on Instagram to respond to incoming Direct Messages with AI-powered answers from your knowledge base</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {instagramLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : instagramConnected ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm font-medium text-green-900 dark:text-green-100">Connected to Instagram</p>
                          {chatbot?.instagram_config?.username && (
                            <p className="text-xs text-green-700 dark:text-green-300">@{chatbot.instagram_config.username}</p>
                          )}
                          {chatbot?.instagram_config?.instagram_id && (
                            <p className="text-xs text-green-700 dark:text-green-300">ID: {chatbot.instagram_config.instagram_id}</p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleInstagramDisconnect} disabled={instagramDisconnecting} className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        {instagramDisconnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disconnect'}
                      </Button>
                    </div>
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Bot Settings</p>
                      </div>
                      <div className="p-4 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">The bot responds to all incoming Instagram DMs with AI-powered answers from your knowledge base.</p>
                          </div>
                          <button type="button" role="switch" aria-checked={instagramAiEnabled} onClick={handleInstagramAiToggle} disabled={instagramAiSaving} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0', instagramAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600', instagramAiSaving && 'opacity-50')}>
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', instagramAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Webhook URL</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{baseUrl}/api/instagram/webhook</code>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(`${baseUrl}/api/instagram/webhook`, 'instagram-webhook')}>
                          {copiedCode === 'instagram-webhook' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Paste this URL in your Meta app&apos;s Instagram webhook configuration.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">Connect your Instagram Professional account to deploy this chatbot on Instagram DMs. Follow these steps:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                          { n: '1', title: 'Create a Meta app', desc: 'Set up a Meta Developer account and create an app with the Instagram product in the Meta Developer Dashboard.' },
                          { n: '2', title: 'Get your credentials', desc: 'Copy your Instagram Account ID and generate a permanent access token (system user token) from the Meta Developer Dashboard.' },
                          { n: '3', title: 'Enter credentials below', desc: 'Paste your Instagram ID and access token in the fields below and click Connect.' },
                          { n: '4', title: 'Configure webhook', desc: 'After connecting, copy the webhook URL shown here and add it to your Meta app\'s Instagram webhook settings.' },
                        ].map((step) => (
                          <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300 text-xs font-bold">{step.n}</span>
                              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                            </div>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="instagram-id" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Instagram Account ID</label>
                        <input id="instagram-id" type="text" value={instagramId} onChange={(e) => setInstagramId(e.target.value)} placeholder="123456789012345" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="instagram-username" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Username <span className="text-secondary-400 font-normal">(optional)</span></label>
                        <input id="instagram-username" type="text" value={instagramUsername} onChange={(e) => setInstagramUsername(e.target.value)} placeholder="mybusiness" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="instagram-token" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Access Token</label>
                        <input id="instagram-token" type="password" value={instagramAccessToken} onChange={(e) => setInstagramAccessToken(e.target.value)} placeholder="Your permanent access token" className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Your permanent access token from the Meta Developer Dashboard. Stored securely and encrypted at rest.</p>
                      </div>
                    </div>
                    <Button onClick={handleInstagramConnect} disabled={instagramConnecting || !instagramId.trim() || !instagramAccessToken.trim()} className="gap-2">
                      {instagramConnecting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Phone className="w-4 h-4" />}
                      {instagramConnecting ? 'Connecting...' : 'Connect to Instagram'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ========== EMAIL TAB ========== */}
        <TabsContent value="email">
          <div className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <CardTitle>Email Inbound</CardTitle>
                    <CardDescription>Forward your support inbox to the chatbot address below. The AI replies automatically using your knowledge base.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {emailLoading ? (
                  <Skeleton className="h-20 w-full" />
                ) : emailEnabled ? (
                  <>
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm font-medium text-green-900 dark:text-green-100">Email integration active</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleEmailDisable} disabled={emailSaving} className="text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20">
                        {emailSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Disable'}
                      </Button>
                    </div>
                    {emailAddress && (
                      <div>
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Your inbound email address</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700">
                            <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 break-all">{emailAddress}</code>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(emailAddress, 'email-address')}>
                            {copiedCode === 'email-address' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                      <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                        <p className="font-medium">How to route emails to your chatbot:</p>
                        <p><span className="font-medium">Option A — Email forwarding:</span> In your email provider settings, set up an automatic forward from your support address to the address above.</p>
                        <p><span className="font-medium">Option B — MX record:</span> Update the MX record of a subdomain (e.g. <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">support.yourdomain.com</code>) to point to <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded text-xs">inbound.vocui.com</code>.</p>
                      </div>
                    </div>
                    <div className="border border-secondary-200 dark:border-secondary-700 rounded-lg">
                      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                        <Settings className="w-4 h-4 text-secondary-500" />
                        <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">Reply Settings</p>
                      </div>
                      <div className="p-4 space-y-4">
                        <div>
                          <label htmlFor="email-reply-name" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Sender name</label>
                          <input id="email-reply-name" type="text" value={emailReplyName} onChange={(e) => setEmailReplyName(e.target.value)} placeholder={chatbot?.name || 'Support'} className="w-full px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                          <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">Shown in the From: field of outgoing replies.</p>
                        </div>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">AI Responses</p>
                            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-0.5">Automatically reply to inbound emails with AI-powered answers from your knowledge base.</p>
                          </div>
                          <button type="button" role="switch" aria-checked={emailAiEnabled} onClick={() => setEmailAiEnabled(!emailAiEnabled)} className={cn('relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0', emailAiEnabled ? 'bg-primary-600' : 'bg-secondary-300 dark:bg-secondary-600')}>
                            <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform', emailAiEnabled ? 'translate-x-6' : 'translate-x-1')} />
                          </button>
                        </div>
                        <Button size="sm" onClick={handleEmailSettingsSave} disabled={emailSaving}>
                          {emailSaving ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
                          Save settings
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">Enable email inbound to let customers email your chatbot directly. Each chatbot gets a dedicated email address — no shared credentials required.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        { n: '1', title: 'Enable below', desc: 'Click "Enable Email Integration" to activate your dedicated inbound address.' },
                        { n: '2', title: 'Forward your inbox', desc: 'Set up a forward from your support email (or point an MX record) to the address shown after enabling.' },
                        { n: '3', title: 'AI replies automatically', desc: 'Incoming emails are answered by your AI chatbot. The reply threads correctly so customers can continue the conversation.' },
                      ].map((step) => (
                        <div key={step.n} className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold">{step.n}</span>
                            <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{step.title}</p>
                          </div>
                          <p className="text-xs text-secondary-500 dark:text-secondary-400">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label htmlFor="email-reply-name-setup" className="block text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">Sender name <span className="text-secondary-400 font-normal">(optional)</span></label>
                      <input id="email-reply-name-setup" type="text" value={emailReplyName} onChange={(e) => setEmailReplyName(e.target.value)} placeholder={chatbot?.name || 'Support'} className="w-full max-w-sm px-3 py-2 text-sm border border-secondary-200 dark:border-secondary-700 rounded-lg bg-white dark:bg-secondary-900 text-secondary-900 dark:text-secondary-100 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                    </div>
                    <Button onClick={handleEmailEnable} disabled={emailSaving} className="gap-2">
                      {emailSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                      {emailSaving ? 'Enabling...' : 'Enable Email Integration'}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      {/* Load the widget SDK for this chatbot as a live demo on the deploy page */}
      <Script src="/widget/sdk.js" data-chatbot-id={id} strategy="afterInteractive" />
    </div>
  );
}
