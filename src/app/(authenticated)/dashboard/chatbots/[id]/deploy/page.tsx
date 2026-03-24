'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Code, Copy, Check, ExternalLink, Globe, Terminal, MessageSquare, HelpCircle, Info, BookOpen, FileCode, Zap, Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from '@/components/ui/tooltip';
import { ChatbotPageHeader } from '@/components/chatbots/ChatbotPageHeader';
import type { Chatbot } from '@/lib/chatbots/types';

// Code block component with syntax highlighting feel and copy button
function CodeBlock({
  code,
  language,
  copyId,
  copiedCode,
  onCopy,
}: {
  code: string;
  language: string;
  copyId: string;
  copiedCode: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute top-2 left-3 flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500 dark:text-secondary-500">
          {language}
        </span>
      </div>
      <pre className="pt-8 pb-4 px-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-800 dark:border-secondary-800">
        <code>{code}</code>
      </pre>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-secondary-800 border-secondary-700 hover:bg-secondary-700 text-secondary-200"
        onClick={() => onCopy(code, copyId)}
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
  const [previewWidgetOpen, setPreviewWidgetOpen] = useState(true);

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
  }, [id]);

  // Handle close messages from Live Preview iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Handle close message from Live Preview iframe
      if (event.data && event.data.type === 'close-chat-widget') {
        console.log('[Deploy Page] Received close message from Live Preview iframe');
        // Find the Live Preview iframe
        const previewIframe = document.querySelector('iframe[title="Chatbot Preview"]') as HTMLIFrameElement;
        if (previewIframe && event.source === previewIframe.contentWindow) {
          console.log('[Deploy Page] Hiding Live Preview iframe');
          setPreviewWidgetOpen(false);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Get widget position for preview alignment
  const widgetPosition = chatbot?.widget_config?.position || 'bottom-right';
  const isLeftAligned = widgetPosition.includes('left');

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

  const sdkCode = `<script src="${baseUrl}/widget/sdk.js" data-chatbot-id="${id}"></script>`;

  const sdkManualCode = `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  ChatWidget.init({ chatbotId: '${id}' });
</script>`;

  const nextjsCode = `import Script from 'next/script';

// Add to your root layout (app/layout.tsx)
<Script
  src="${baseUrl}/widget/sdk.js"
  data-chatbot-id="${id}"
  strategy="afterInteractive"
/>`;

  const iframeWidth = chatbot.widget_config?.width || 400;
  const iframeHeight = chatbot.widget_config?.height || 600;
  const iframeCode = `<iframe
  src="${baseUrl}/widget/${id}"
  style="border:none;width:${iframeWidth}px;height:${iframeHeight}px;"
  allow="clipboard-write"
></iframe>`;

  const authenticatedUserCode = `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  // Pass your logged-in user's data to the chatbot
  ChatWidget.init({
    chatbotId: '${id}',
    user: {
      id: 'user_123',        // Required: stable user ID
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro'            // Any custom fields
    },
    context: {
      // Any data you want the chatbot to know about
      recent_orders: [
        { id: 'ORD-001', total: '$149', status: 'shipped' }
      ],
      account_balance: '$42.50',
      subscription: { plan: 'Pro', renewal: '2024-04-15' }
    }
  });
</script>`;

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <ChatbotPageHeader
        chatbotId={id}
        title="Deploy Chatbot"
        actions={
          <Link
            href="/sdk#chatbots"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Full SDK Documentation
          </Link>
        }
      />

      {/* Status */}
      {!chatbot.is_published && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Chatbot not published</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            Your chatbot needs to be published before it can be accessed.{' '}
            <Link href={`/dashboard/chatbots/${chatbot.id}`} className="underline font-medium hover:text-yellow-700 dark:hover:text-yellow-200">
              Go to overview to publish
            </Link>
          </p>
        </div>
      )}

      {/* Quick Start - One Liner */}
      <Card className="border-primary-200 dark:border-primary-800 ring-1 ring-primary-100 dark:ring-primary-900/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>Add to Your Website</CardTitle>
                  <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-[10px]">
                    One Line
                  </Badge>
                </div>
                <CardDescription>Paste this single line before <code className="text-xs">&lt;/body&gt;</code> in your HTML</CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={`/widget/${id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                Preview
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CodeBlock
            code={sdkCode}
            language="html"
            copyId="sdk"
            copiedCode={copiedCode}
            onCopy={copyToClipboard}
          />
          <p className="text-sm text-secondary-600 dark:text-secondary-400">
            That's it — a floating chat button will appear on your site. Works with any HTML website, WordPress, Shopify, Webflow, and more.
          </p>
        </CardContent>
      </Card>

      {/* Framework-Specific & Alternative Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next.js / React */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4.5 h-4.5 text-blue-500" />
              <CardTitle className="text-base">Next.js / React</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock
              code={nextjsCode}
              language="tsx"
              copyId="nextjs"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Use the <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">Script</code> component in your root layout.
            </p>
          </CardContent>
        </Card>

        {/* Manual Init */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <Code className="w-4.5 h-4.5 text-secondary-500" />
              <CardTitle className="text-base">Manual Init</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock
              code={sdkManualCode}
              language="html"
              copyId="manual"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Load the SDK separately if you need to control when it initializes.
            </p>
          </CardContent>
        </Card>

        {/* iFrame */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4.5 h-4.5 text-secondary-500" />
              <CardTitle className="text-base">iFrame Embed</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <CodeBlock
              code={iframeCode}
              language="html"
              copyId="iframe"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400">
              Embed the chat inline on a specific page instead of as a floating widget.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Authenticated Users */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
              <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Authenticated Users</CardTitle>
                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-[10px]">
                  Advanced
                </Badge>
              </div>
              <CardDescription>Pass your logged-in user data so the chatbot knows who they are</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
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
                Pass verified user identity (name, email, plan). Requires an <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">id</code> field for cross-device memory. Skips the pre-chat form automatically.
              </p>
            </div>
            <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">context object</p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">
                Pass account data (orders, billing, subscription). The chatbot can answer questions like &quot;Where&apos;s my order?&quot; or &quot;When does my plan renew?&quot;
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your chatbot looks and behaves</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 h-[500px] flex items-center overflow-hidden relative ${isLeftAligned ? 'justify-start' : 'justify-end'}`}>
            <iframe
              src={`/widget/${id}`}
              className="rounded-lg border-0"
              style={{ 
                width: '400px', 
                height: '600px', 
                maxWidth: '100%', 
                maxHeight: '100%',
                display: previewWidgetOpen ? 'block' : 'none',
                visibility: previewWidgetOpen ? 'visible' : 'hidden',
                pointerEvents: previewWidgetOpen ? 'auto' : 'none'
              }}
              title="Chatbot Preview"
            />
            {!previewWidgetOpen && (
              <button
                onClick={(e) => { e.preventDefault(); setPreviewWidgetOpen(true); }}
                className="absolute"
                style={{
                  [isLeftAligned ? 'left' : 'right']: '20px',
                  bottom: '20px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: chatbot?.widget_config?.primaryColor || '#0ea5e9',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                }}
                aria-label="Open chat preview"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Agent Console Embed */}
      <Card className="border-orange-200 dark:border-orange-800 ring-1 ring-orange-100 dark:ring-orange-900/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
              <Headphones className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle>Agent Console</CardTitle>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 text-[10px]">
                  Live Handoff
                </Badge>
              </div>
              <CardDescription>Embed the agent console on your website so your team can manage live conversations without logging into the dashboard</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* One-liner */}
          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Quick Embed
            </p>
            <CodeBlock
              code={agentConsoleOneLiner}
              language="html"
              copyId="agent-oneliner"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
            <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-2">
              Renders a full-page agent console. Add <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">data-position=&quot;sidebar&quot;</code> for a fixed sidebar instead.
            </p>
          </div>

          {/* Manual Init */}
          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              Manual Init (mount into a container)
            </p>
            <CodeBlock
              code={agentConsoleManualCode}
              language="html"
              copyId="agent-manual"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
          </div>

          {/* iFrame */}
          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              iFrame Embed
            </p>
            <CodeBlock
              code={agentConsoleIframeCode}
              language="html"
              copyId="agent-iframe"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />
          </div>

          {/* Info boxes */}
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

          {/* API Key notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Required</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                The agent console requires a valid API key for authentication. Get one from the{' '}
                <Link href="/dashboard/api-keys" className="text-amber-800 dark:text-amber-200 underline hover:no-underline font-medium">
                  API Keys page
                </Link>
                . Keep your API key server-side or in a protected admin area — never expose it to end users.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle>REST API</CardTitle>
                <CardDescription>Build custom integrations with your backend</CardDescription>
              </div>
            </div>
            <Tooltip content="Use the REST API when you need server-side integration, custom chat interfaces, or to connect the chatbot to other services like Slack, Discord, or your own app.">
              <button className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
                <HelpCircle className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* When to use */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">Custom chat UIs</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">Backend integrations</span>
            </div>
            <div className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm text-green-700 dark:text-green-300">Mobile apps</span>
            </div>
          </div>

          {/* Endpoint */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                API Endpoint
              </p>
              <Tooltip content="Send POST requests to this URL to get responses from your chatbot. Include your API key in the Authorization header.">
                <Info className="w-3.5 h-3.5 text-secondary-400" />
              </Tooltip>
            </div>
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

          {/* Code examples */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  cURL Example
                </p>
                <Tooltip content="Test from your terminal. Great for quick testing and debugging.">
                  <Info className="w-3.5 h-3.5 text-secondary-400" />
                </Tooltip>
              </div>
              <CodeBlock
                code={apiExample}
                language="bash"
                copyId="curl"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  JavaScript Example
                </p>
                <Tooltip content="Use in Node.js or browser environments. Works with fetch API.">
                  <Info className="w-3.5 h-3.5 text-secondary-400" />
                </Tooltip>
              </div>
              <CodeBlock
                code={jsApiExample}
                language="javascript"
                copyId="js"
                copiedCode={copiedCode}
                onCopy={copyToClipboard}
              />
            </div>
          </div>

          {/* API Key notice */}
          <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Required</p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Replace <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">YOUR_API_KEY</code> with
                your API key from the{' '}
                <Link href="/dashboard/api-keys" className="text-amber-800 dark:text-amber-200 underline hover:no-underline font-medium">
                  API Keys page
                </Link>
                . Keep your API key secret and never expose it in client-side code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Need More Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/sdk#chatbots"
              className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <BookOpen className="w-5 h-5 text-primary-500" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">SDK Documentation</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Full integration guide</p>
              </div>
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <Terminal className="w-5 h-5 text-green-500" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">API Keys</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Manage authentication</p>
              </div>
            </Link>
            <Link
              href={`/dashboard/chatbots/${id}`}
              className="flex items-center gap-3 p-4 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors group"
            >
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <div>
                <p className="font-medium text-secondary-900 dark:text-secondary-100 group-hover:text-primary-600 dark:group-hover:text-primary-400">Chatbot Settings</p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Configure behavior</p>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
