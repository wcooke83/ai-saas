'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Code, Copy, Check, ExternalLink, Globe, Terminal, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Chatbot } from '@/lib/chatbots/types';

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
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
          Deploy Chatbot
        </h1>
        <p className="text-secondary-600 dark:text-secondary-400 mt-1">
          Get embed code and API access for your chatbot
        </p>
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
        {/* iFrame Embed */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                <Code className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <CardTitle>iFrame Embed</CardTitle>
                <CardDescription>Simple embed with an iframe</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                {iframeCode}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(iframeCode, 'iframe')}
              >
                {copiedCode === 'iframe' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-secondary-500 mt-3">
              Add this code to your website's HTML, just before the closing {`</body>`} tag.
            </p>
          </CardContent>
        </Card>

        {/* SDK Embed */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle>JavaScript SDK</CardTitle>
                <CardDescription>More control with our SDK</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                {sdkCode}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(sdkCode, 'sdk')}
              >
                {copiedCode === 'sdk' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-sm text-secondary-500 mt-3">
              Use the SDK for more control over positioning and behavior.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Access */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
              <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <CardTitle>REST API</CardTitle>
              <CardDescription>Integrate with your own applications</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              API Endpoint
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg text-sm">
                POST {baseUrl}/api/chat/{id}
              </code>
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

          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              cURL Example
            </p>
            <div className="relative">
              <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                {apiExample}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(apiExample, 'curl')}
              >
                {copiedCode === 'curl' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
              JavaScript Example
            </p>
            <div className="relative">
              <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                {jsApiExample}
              </pre>
              <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(jsApiExample, 'js')}
              >
                {copiedCode === 'js' ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-secondary-500 dark:text-secondary-400">
            Replace <code className="bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded text-xs">YOUR_API_KEY</code> with
            your API key from the{' '}
            <Link href="/dashboard/api-keys" className="text-primary-500 hover:underline">
              API Keys page
            </Link>
            . The Authorization header is required to use your preferred AI model settings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
