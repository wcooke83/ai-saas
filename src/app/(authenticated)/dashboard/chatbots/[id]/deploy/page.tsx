'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Copy, Check, ExternalLink, Globe, Terminal, MessageSquare, HelpCircle, Info, BookOpen, FileCode, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, InfoTooltip } from '@/components/ui/tooltip';
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
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-secondary-800 border-secondary-700 hover:bg-secondary-700 text-secondary-200"
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

// Placement instruction component
function PlacementInstruction({
  icon: Icon,
  title,
  description,
  recommended,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  recommended?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
      <div className="flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-primary-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-secondary-900 dark:text-secondary-100">{title}</span>
          {recommended && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Recommended</Badge>
          )}
        </div>
        <p className="text-xs text-secondary-600 dark:text-secondary-400 mt-0.5">{description}</p>
      </div>
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

  const iframeCode = `<iframe
  src="${baseUrl}/widget/${id}"
  style="border:none;position:fixed;bottom:20px;right:20px;width:400px;height:600px;z-index:9999;"
  allow="clipboard-write"
></iframe>`;

  const sdkCode = `<script src="${baseUrl}/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: '${id}'
  });
</script>`;

  const apiExample = `curl -X POST "${baseUrl}/api/chat/${id}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{
    "message": "Hello, I have a question",
    "session_id": "unique-session-id"
  }'`;

  const jsApiExample = `fetch('${baseUrl}/api/chat/${id}', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    message: 'Hello, I have a question',
    session_id: 'unique-session-id'
  })
})
.then(res => res.json())
.then(data => console.log(data.data.message));`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/chatbots/${id}`}
          className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Chatbot
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
              Deploy Chatbot
            </h1>
            <p className="text-secondary-600 dark:text-secondary-400 mt-1">
              Add your chatbot to any website with just a few lines of code
            </p>
          </div>
          <Link
            href="/sdk#chatbots"
            className="inline-flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
          >
            <BookOpen className="w-4 h-4" />
            Full SDK Documentation
          </Link>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-primary-900 dark:text-primary-100">Quick Start</h3>
            <p className="text-sm text-primary-700 dark:text-primary-300 mt-1">
              Choose an integration method below. The <strong>JavaScript SDK</strong> is recommended for most websites
              as it provides the best user experience with a floating chat widget. For custom integrations,
              use the <strong>REST API</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Status */}
      {!chatbot.is_published && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">Chatbot not published</span>
          </div>
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
            Your chatbot needs to be published before it can be accessed. Go to the chatbot overview to publish it.
          </p>
        </div>
      )}

      {/* Widget Preview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>See how your chatbot looks</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <a href={`/widget/${id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Open in New Tab
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4 h-[400px] overflow-hidden">
            <iframe
              src={`/widget/${id}`}
              className="w-full h-full rounded-lg border-0"
              title="Chatbot Preview"
            />
          </div>
        </CardContent>
      </Card>

      {/* Embed Options */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SDK Embed - Primary/Recommended */}
        <Card className="border-primary-200 dark:border-primary-800 ring-1 ring-primary-100 dark:ring-primary-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                  <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>JavaScript SDK</CardTitle>
                    <Badge className="bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 text-[10px]">
                      Recommended
                    </Badge>
                  </div>
                  <CardDescription>Best experience with a floating chat widget</CardDescription>
                </div>
              </div>
              <Tooltip content="The SDK creates a floating chat button that expands into a full chat interface. It handles positioning, animations, and mobile responsiveness automatically.">
                <button className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </Tooltip>
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

            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                Where to add this code
              </p>
              <PlacementInstruction
                icon={FileCode}
                title="Before closing </body> tag"
                description="Add the script tags just before </body> in your HTML file. This ensures the page loads before the widget initializes."
                recommended
              />
              <PlacementInstruction
                icon={Code}
                title="Or in your template footer"
                description="If using a CMS like WordPress, add to your theme's footer.php or use a plugin to inject scripts."
              />
            </div>

            <div className="text-sm text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-lg">
              <strong className="text-secondary-900 dark:text-secondary-100">What happens:</strong> A chat button appears in the bottom-right corner.
              Users click to open the chat, and conversations are automatically saved.
            </div>
          </CardContent>
        </Card>

        {/* iFrame Embed */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
                  <Code className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                </div>
                <div>
                  <CardTitle>iFrame Embed</CardTitle>
                  <CardDescription>Simple inline embed for specific locations</CardDescription>
                </div>
              </div>
              <Tooltip content="iFrames are useful when you want the chat in a specific location on your page rather than a floating widget. Good for dedicated support pages.">
                <button className="p-1 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-300">
                  <HelpCircle className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <CodeBlock
              code={iframeCode}
              language="html"
              copyId="iframe"
              copiedCode={copiedCode}
              onCopy={copyToClipboard}
            />

            <div className="space-y-2">
              <p className="text-xs font-medium text-secondary-700 dark:text-secondary-300 uppercase tracking-wider">
                Where to add this code
              </p>
              <PlacementInstruction
                icon={FileCode}
                title="Anywhere in your HTML body"
                description="Place the iframe where you want the chat to appear. The default styles position it as a floating widget."
              />
            </div>

            <div className="text-sm text-secondary-600 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 p-3 rounded-lg">
              <strong className="text-secondary-900 dark:text-secondary-100">Tip:</strong> Modify the <code className="bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded text-xs">style</code> attribute
              to change size and position, or remove <code className="bg-secondary-200 dark:bg-secondary-700 px-1 py-0.5 rounded text-xs">position:fixed</code> to embed inline.
            </div>
          </CardContent>
        </Card>
      </div>

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
