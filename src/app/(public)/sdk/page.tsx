'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Header } from '@/components/layout';
import { ToolsHero } from '@/components/ui/tools-hero';
import { Footer } from '@/components/ui/footer';
import { PageBackground } from '@/components/ui/page-background';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toolsConfig, toolsList } from '@/lib/constants/tools-config';
import {
  Code,
  Copy,
  Check,
  Key,
  ArrowRight,
  Mail,
  FileText,
  PenTool,
  MessageSquare,
  Megaphone,
  Share2,
  ExternalLink,
  LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Mail,
  FileText,
  PenTool,
  MessageSquare,
  Megaphone,
  Share2,
};

// Section IDs for scroll tracking
const sectionIds = ['quick-start', 'tools', 'custom-solutions'];

export default function SDKDocsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState('quick-start');
  const contentRef = useRef<HTMLDivElement>(null);

  // Track active section on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(null), 2000);
  };

  const selectedToolConfig = selectedTool ? toolsConfig[selectedTool] : null;

  // Scroll to content when tool is selected
  const handleToolSelect = (toolId: string | null) => {
    setSelectedTool(toolId);
    // Small delay to ensure state update, then scroll
    setTimeout(() => {
      if (contentRef.current) {
        const headerOffset = 96; // Account for fixed header
        const elementPosition = contentRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 0);
  };

  return (
    <PageBackground>
      <Header
        navItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Docs', href: '/sdk' },
          { label: 'FAQ', href: '/faq' },
        ]}
        cta={{ label: 'Get Started', href: '/login' }}
      />

      <ToolsHero
        badge="Developer"
        title="API & Embed Documentation"
        description="Integrate AI-powered tools into your website or application using our REST API or embeddable widgets."
        breadcrumbs={[
          { label: 'Documentation' },
        ]}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[220px_1fr] gap-8 max-w-6xl mx-auto md:items-start">
          {/* Sidebar - Tool Selection */}
          <aside className="space-y-4 md:sticky md:top-24 md:self-start">
            <div id="quick-start">
              <h2 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-3">
                Quick Start
              </h2>
              <button
                onClick={() => handleToolSelect(null)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedTool === null
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                )}
              >
                Getting Started
              </button>
            </div>

            <div id="tools">
              <h2 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-3">
                Tools
              </h2>
              <div className="space-y-1">
                {toolsList.map((tool) => {
                  const Icon = iconMap[tool.iconName] || Code;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      className={cn(
                        'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                        selectedTool === tool.id
                          ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {tool.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div id="custom-solutions">
              <h2 className="text-sm font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wide mb-3">
                Custom Solutions
              </h2>
              <button
                onClick={() => handleToolSelect('custom-chatbots')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                  selectedTool === 'custom-chatbots'
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                )}
              >
                <MessageSquare className="w-4 h-4" />
                Custom Chatbots
              </button>
            </div>
          </aside>

          {/* Main Content */}
          <div ref={contentRef} className="space-y-8 min-w-0">
            {selectedTool === null ? (
              /* Getting Started */
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="w-5 h-5 text-primary-500" />
                      Authentication
                    </CardTitle>
                    <CardDescription>
                      All API requests require an API key. Get your key from the dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button asChild>
                      <Link href="/dashboard/api-keys">
                        Get API Key
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>

                    <div>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-2">
                        Include your API key in the request header:
                      </p>
                      <div className="relative">
                        <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`Authorization: Bearer YOUR_API_KEY`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard('Authorization: Bearer YOUR_API_KEY', 'auth-header')}
                          className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                          aria-label="Copy code"
                        >
                          {copied === 'auth-header' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary-500" />
                      Embed Widgets
                    </CardTitle>
                    <CardDescription>
                      Add tools directly to your website with a simple iframe or script tag.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Embed any tool using an iframe. Replace <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">TOOL_ID</code> with the tool slug and <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">YOUR_API_KEY</code> with your key.
                    </p>
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<iframe
  src="https://yoursite.com/embed/TOOL_ID?key=YOUR_API_KEY"
  width="100%"
  height="600"
  frameborder="0"
></iframe>`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`<iframe\n  src="https://yoursite.com/embed/TOOL_ID?key=YOUR_API_KEY"\n  width="100%"\n  height="600"\n  frameborder="0"\n></iframe>`, 'embed-code')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy code"
                      >
                        {copied === 'embed-code' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Available Tools</CardTitle>
                    <CardDescription>
                      Click on a tool to view its API documentation and embed options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {toolsList.map((tool) => {
                        const Icon = iconMap[tool.iconName] || Code;
                        return (
                          <button
                            key={tool.id}
                            onClick={() => handleToolSelect(tool.id)}
                            className="flex items-start gap-3 p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors text-left"
                          >
                            <div className={cn('p-2 rounded-lg', tool.iconBg)}>
                              <Icon className={cn('w-4 h-4', tool.iconColor)} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-secondary-900 dark:text-secondary-100">
                                {tool.name}
                              </p>
                              <div className="flex gap-2 mt-1">
                                {tool.hasEmbed && (
                                  <Badge variant="outline" className="text-xs">Embed</Badge>
                                )}
                                {tool.hasApi && (
                                  <Badge variant="outline" className="text-xs">API</Badge>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-secondary-400 flex-shrink-0 mt-1" />
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : selectedTool === 'custom-chatbots' ? (
              /* Custom Chatbots documentation */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                    <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      Custom Chatbots
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      Build AI chatbots trained on your own content with RAG (Retrieval-Augmented Generation).
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Badge variant="success">Embed Available</Badge>
                  <Badge variant="success">API Available</Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary-500" />
                      Embed Your Chatbot
                    </CardTitle>
                    <CardDescription>
                      Add your custom chatbot to any website with a simple embed code.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      Replace <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded">CHATBOT_ID</code> with your chatbot's ID from the dashboard.
                    </p>
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<script
  src="https://yoursite.com/widget.js"
  data-chatbot-id="CHATBOT_ID"
  async
></script>`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`<script\n  src="https://yoursite.com/widget.js"\n  data-chatbot-id="CHATBOT_ID"\n  async\n></script>`, 'chatbot-embed')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy embed code"
                      >
                        {copied === 'chatbot-embed' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary-500" />
                      Chat API
                    </CardTitle>
                    <CardDescription>
                      Send messages to your chatbot programmatically via the API.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`POST /api/chat/CHATBOT_ID
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY

{
  "message": "Hello, how can you help?",
  "sessionId": "optional-session-id"
}`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`POST /api/chat/CHATBOT_ID\nContent-Type: application/json\nAuthorization: Bearer YOUR_API_KEY\n\n{\n  "message": "Hello, how can you help?",\n  "sessionId": "optional-session-id"\n}`, 'chatbot-api')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy API example"
                      >
                        {copied === 'chatbot-api' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          Create Your Chatbot
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Build and train custom chatbots with your own knowledge sources
                        </p>
                      </div>
                      <Button asChild>
                        <Link href="/dashboard/chatbots">
                          Go to Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : selectedToolConfig ? (
              /* Tool-specific documentation */
              <>
                <div className="flex items-center gap-3 mb-6">
                  {(() => {
                    const Icon = iconMap[selectedToolConfig.iconName] || Code;
                    return (
                      <div className={cn('p-3 rounded-lg', selectedToolConfig.iconBg)}>
                        <Icon className={cn('w-6 h-6', selectedToolConfig.iconColor)} />
                      </div>
                    );
                  })()}
                  <div>
                    <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-100">
                      {selectedToolConfig.name}
                    </h1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      {selectedToolConfig.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  {selectedToolConfig.hasEmbed && (
                    <Badge variant="success">Embed Available</Badge>
                  )}
                  {selectedToolConfig.hasApi && (
                    <Badge variant="success">API Available</Badge>
                  )}
                  {!selectedToolConfig.hasEmbed && (
                    <Badge variant="secondary">API Only</Badge>
                  )}
                </div>

                {/* API Endpoint */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary-500" />
                      API Endpoint
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        POST Request
                      </p>
                      <div className="relative">
                        <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`POST ${selectedToolConfig.apiPath}
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(`POST ${selectedToolConfig.apiPath}`, 'endpoint')}
                          className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                          aria-label="Copy endpoint"
                        >
                          {copied === 'endpoint' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        Example Request Body
                      </p>
                      <div className="relative">
                        <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{JSON.stringify(selectedToolConfig.examplePayload, null, 2)}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(selectedToolConfig.examplePayload, null, 2), 'payload')}
                          className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                          aria-label="Copy payload"
                        >
                          {copied === 'payload' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                        cURL Example
                      </p>
                      <div className="relative">
                        <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`curl -X POST \\
  https://yoursite.com${selectedToolConfig.apiPath} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '${JSON.stringify(selectedToolConfig.examplePayload)}'`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(`curl -X POST \\\n  https://yoursite.com${selectedToolConfig.apiPath} \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer YOUR_API_KEY" \\\n  -d '${JSON.stringify(selectedToolConfig.examplePayload)}'`, 'curl')}
                          className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                          aria-label="Copy cURL"
                        >
                          {copied === 'curl' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-400" />
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Embed Code */}
                {selectedToolConfig.hasEmbed && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ExternalLink className="w-5 h-5 text-primary-500" />
                        Embed Widget
                      </CardTitle>
                      <CardDescription>
                        Add this tool directly to your website with an iframe.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<iframe
  src="https://yoursite.com${selectedToolConfig.embedPath}?key=YOUR_API_KEY"
  width="100%"
  height="600"
  frameborder="0"
  allow="clipboard-write"
></iframe>`}
                        </pre>
                        <button
                          onClick={() => copyToClipboard(`<iframe\n  src="https://yoursite.com${selectedToolConfig.embedPath}?key=YOUR_API_KEY"\n  width="100%"\n  height="600"\n  frameborder="0"\n  allow="clipboard-write"\n></iframe>`, 'tool-embed')}
                          className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                          aria-label="Copy embed code"
                        >
                          {copied === 'tool-embed' ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-secondary-400" />
                          )}
                        </button>
                      </div>

                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/integrations/${selectedToolConfig.id}`}>
                          Configure in Dashboard
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {!selectedToolConfig.hasEmbed && selectedToolConfig.noEmbedReason && (
                  <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="pt-6">
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        {selectedToolConfig.noEmbedReason}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Try it out link */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          Try {selectedToolConfig.name}
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Test the tool in our interactive playground
                        </p>
                      </div>
                      <Button asChild>
                        <Link href={`/tools/${selectedToolConfig.id}`}>
                          Open Tool
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : null}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 p-12 text-white shadow-xl">
              <h2 className="text-3xl font-bold mb-4">Ready to integrate AI into your app?</h2>
              <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
                Get started with our API and embed widgets. Free tier available with generous limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-8"
                  asChild
                >
                  <Link href="/signup">
                    Get Started Free
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline-light"
                  asChild
                >
                  <Link href="/pricing">View Pricing</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
