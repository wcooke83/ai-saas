'use client';

import { useState, useEffect, use } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Code,
  Globe,
  Terminal,
  Copy,
  Check,
  ExternalLink,
  Key,
  AlertCircle,
  Info,
  Mail,
  FileText,
  PenTool,
  MessageSquare,
  Megaphone,
  Share2,
  LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { H1 } from '@/components/ui/heading';
import { toolsConfig } from '@/lib/constants/tools-config';

// Map icon names to actual icon components
const iconMap: Record<string, LucideIcon> = {
  Mail,
  FileText,
  PenTool,
  MessageSquare,
  Megaphone,
  Share2,
};

interface APIKey {
  id: string;
  name: string;
  key_prefix: string;
}

interface ToolIntegrationPageProps {
  params: Promise<{ tool: string }>;
}

export default function ToolIntegrationPage({ params }: ToolIntegrationPageProps) {
  const { tool } = use(params);
  const router = useRouter();
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState('https://your-domain.com');

  const config = toolsConfig[tool];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  useEffect(() => {
    if (!config) {
      router.push('/dashboard/integrations');
      return;
    }

    async function fetchApiKeys() {
      try {
        const response = await fetch('/api/keys');
        if (response.ok) {
          const data = await response.json();
          setApiKeys(data.data || []);
        } else {
          setHasError(true);
          toast.error('Failed to load API keys');
        }
      } catch (err) {
        console.error('Failed to fetch API keys:', err);
        setHasError(true);
        toast.error('Failed to load API keys. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchApiKeys();
  }, [config, router]);

  const copyToClipboard = async (text: string, codeType: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(codeType);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-secondary-400 mx-auto mb-4" />
          <h2 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
            Tool not found
          </h2>
          <p className="text-secondary-600 dark:text-secondary-400 mt-1">
            The requested tool does not exist.
          </p>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/integrations">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Integrations
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    );
  }

  const Icon = iconMap[config.iconName] || Code;
  const fullApiKeyPlaceholder = apiKeys.length > 0 ? 'sk_live_xxxxx' : 'YOUR_API_KEY';

  // Generate embed code
  const iframeCode = `<iframe
  src="${baseUrl}${config.embedPath}?key=${fullApiKeyPlaceholder}"
  width="100%"
  height="600"
  frameborder="0"
  allow="clipboard-write"
  style="border: none; border-radius: 8px;"
></iframe>`;

  // Generate API examples
  const curlExample = `curl -X POST "${baseUrl}${config.apiPath}" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${fullApiKeyPlaceholder}" \\
  -d '${JSON.stringify(config.examplePayload, null, 2)}'`;

  const jsExample = `const response = await fetch("${baseUrl}${config.apiPath}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${fullApiKeyPlaceholder}"
  },
  body: JSON.stringify(${JSON.stringify(config.examplePayload, null, 2)})
});

const data = await response.json();
console.log(data);`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/integrations"
          className="inline-flex items-center text-sm text-secondary-600 dark:text-secondary-400 hover:text-secondary-900 dark:hover:text-secondary-100 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" aria-hidden="true" />
          Back to Integrations
        </Link>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${config.iconBg}`}>
            <Icon className={`w-6 h-6 ${config.iconColor}`} aria-hidden="true" />
          </div>
          <div>
            <H1 variant="dashboard">
              {config.name} Integration
            </H1>
            <p className="text-secondary-600 dark:text-secondary-400">
              {config.description}
            </p>
          </div>
        </div>
      </div>

      {/* API Key Notice */}
      {!hasError && apiKeys.length === 0 && (
        <Card className="border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-medium text-secondary-900 dark:text-secondary-100">
                  You need an API key to use this integration
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  Create an API key to get your personalized embed code and API access.
                </p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link href={`/dashboard/api-keys?return=/dashboard/integrations/${tool}`}>
                    <Key className="w-4 h-4 mr-2" aria-hidden="true" />
                    Create API Key
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Embed Notice */}
      {!config.hasEmbed && config.noEmbedReason && (
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/30">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex-1">
                <p className="font-medium text-secondary-900 dark:text-secondary-100">
                  Embed not available for this tool
                </p>
                <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                  {config.noEmbedReason}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Live Preview */}
      {config.hasEmbed && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 dark:bg-primary-900/50 rounded-lg">
                  <Globe className="w-5 h-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle>Live Preview</CardTitle>
                  <CardDescription>See how the embed looks on your site</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/tools/${tool}`} target="_blank">
                  <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
                  Open Full Page
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-secondary-100 dark:bg-secondary-800 rounded-lg p-4">
              {apiKeys.length > 0 ? (
                <iframe
                  src={`${config.embedPath}?key=${apiKeys[0].key_prefix}`}
                  width="100%"
                  height="400"
                  className="rounded-lg border-0"
                  title={`${config.name} Preview`}
                />
              ) : (
                <div className="h-[400px] flex items-center justify-center text-center">
                  <div>
                    <Key className="w-12 h-12 text-secondary-300 dark:text-secondary-600 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-secondary-600 dark:text-secondary-400 font-medium">
                      Create an API key to see a live preview
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" asChild>
                      <Link href={`/dashboard/api-keys?return=/dashboard/integrations/${tool}`}>
                        Create API Key
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Integration Methods */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* iFrame Embed */}
        {config.hasEmbed && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle>iFrame Embed</CardTitle>
                  <CardDescription>Copy and paste into your HTML</CardDescription>
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
                  className="absolute top-2 right-2 bg-secondary-800 hover:bg-secondary-700 border-secondary-600 dark:text-secondary-300"
                  onClick={() => copyToClipboard(iframeCode, 'iframe')}
                  aria-label={copiedCode === 'iframe' ? 'Copied iFrame code' : 'Copy iFrame code to clipboard'}
                >
                  {copiedCode === 'iframe' ? (
                    <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
              <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-3">
                {apiKeys.length > 0 ? (
                  <>Replace <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">sk_live_xxxxx</code> with your actual API key from the <Link href="/dashboard/api-keys" className="text-primary-500 hover:underline">API Keys page</Link>.</>
                ) : (
                  <>Replace <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">YOUR_API_KEY</code> with your API key after creating one.</>
                )}
              </p>
              <div className="flex items-start gap-2 text-xs text-secondary-500 dark:text-secondary-400 bg-secondary-50 dark:bg-secondary-800/50 p-2 rounded mt-3">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>Both the embed and API use the same API key for authentication.</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* REST API */}
        <Card className={!config.hasEmbed ? 'lg:col-span-2' : ''}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Terminal className="w-5 h-5 text-green-600 dark:text-green-400" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>REST API</CardTitle>
                <CardDescription>Integrate with your backend</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endpoint */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                  POST
                </Badge>
                <code className="text-sm text-secondary-700 dark:text-secondary-300">
                  {baseUrl}{config.apiPath}
                </code>
              </div>
            </div>

            {/* cURL Example */}
            <div>
              <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                cURL
              </h4>
              <div className="relative">
                <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                  {curlExample}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-secondary-800 hover:bg-secondary-700 border-secondary-600 dark:text-secondary-300"
                  onClick={() => copyToClipboard(curlExample, 'curl')}
                  aria-label={copiedCode === 'curl' ? 'Copied cURL example' : 'Copy cURL example to clipboard'}
                >
                  {copiedCode === 'curl' ? (
                    <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>

            {/* JavaScript Example */}
            <div>
              <h4 className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
                JavaScript
              </h4>
              <div className="relative">
                <pre className="p-4 bg-secondary-900 dark:bg-secondary-950 text-secondary-100 rounded-lg text-sm overflow-x-auto">
                  {jsExample}
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 bg-secondary-800 hover:bg-secondary-700 border-secondary-600 dark:text-secondary-300"
                  onClick={() => copyToClipboard(jsExample, 'js')}
                  aria-label={copiedCode === 'js' ? 'Copied JavaScript example' : 'Copy JavaScript example to clipboard'}
                >
                  {copiedCode === 'js' ? (
                    <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary-100 dark:bg-secondary-800 rounded-lg">
              <Key className="w-5 h-5 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-secondary-900 dark:text-secondary-100">
                Need to manage your API keys?
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400">
                Create, view, or revoke API keys from the API Keys page.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/dashboard/api-keys">
                Manage API Keys
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Copied notification for screen readers */}
      <div aria-live="polite" className="sr-only">
        {copiedCode && `${copiedCode} code copied to clipboard`}
      </div>
    </div>
  );
}
