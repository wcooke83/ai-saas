'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import {
  Code, Copy, Check, ExternalLink, Globe, Terminal,
  Info, BookOpen, FileCode, Zap, Headphones, ChevronDown, AlertTriangle,
  Eye, EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import type { Chatbot } from '@/lib/chatbots/types';

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
  const [chatbot, setChatbot] = useState<Chatbot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('widget');
  const [embedMethod, setEmbedMethod] = useState('script');
  const [agentMethod, setAgentMethod] = useState('quick');
  const [apiMethod, setApiMethod] = useState('curl');
  const [showAuthSection, setShowAuthSection] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [previewExpanded, setPreviewExpanded] = useState(false);

  useEffect(() => {
    async function fetchChatbot() {
      try {
        const response = await fetch(`/api/chatbots/${id}`);
        if (!response.ok) throw new Error('Failed to fetch chatbot');
        const data = await response.json();
        setChatbot(data.data.chatbot);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchChatbot();
    localStorage.setItem(`chatbot-tested-${id}`, 'true');
  }, [id]);

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

      {/* Unpublished blocking banner */}
      {!isPublished && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-800 dark:text-yellow-200">Chatbot not published</p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                Embed codes below won&apos;t work until you publish.{' '}
                <Link href={`/dashboard/chatbots/${chatbot.id}`} className="underline font-medium hover:text-yellow-900 dark:hover:text-yellow-100">
                  Publish now
                </Link>
              </p>
            </div>
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
                        disabled={!isPublished}
                      />
                      {!isPublished && (
                        <div className="absolute inset-0 flex items-center justify-center bg-secondary-900/60 rounded-lg">
                          <span className="text-sm font-medium text-white bg-yellow-600 px-3 py-1.5 rounded-md">
                            Publish to enable
                          </span>
                        </div>
                      )}
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
                        disabled={!isPublished}
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
                  {showPreview && (
                    <CardContent className="pt-0">
                      <div className={`bg-secondary-100 dark:bg-secondary-800 rounded-lg p-3 overflow-hidden transition-all duration-300 ${previewExpanded ? 'h-[700px]' : 'h-[520px]'}`}>
                        <iframe
                          src={`/widget/${id}`}
                          className="rounded-lg border-0 w-full h-full"
                          title="Chatbot Preview"
                        />
                      </div>
                    </CardContent>
                  )}
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
      </Tabs>
    </div>
  );
}
