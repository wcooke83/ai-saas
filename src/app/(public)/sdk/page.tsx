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
import { H1 } from '@/components/ui/heading';
import { cn } from '@/lib/utils';
import {
  Code,
  Copy,
  Check,
  Key,
  ArrowRight,
  MessageSquare,
  ExternalLink,
  Headphones,
} from 'lucide-react';

// Section IDs for scroll tracking
const sectionIds = ['quick-start', 'custom-solutions'];

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
              <button
                onClick={() => handleToolSelect('agent-console')}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                  selectedTool === 'agent-console'
                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                )}
              >
                <Headphones className="w-4 h-4" />
                Agent Console
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
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          Create Your Chatbot
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Build and deploy custom chatbots from your dashboard
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
            ) : selectedTool === 'custom-chatbots' ? (
              /* Custom Chatbots documentation */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary-100 dark:bg-primary-900/50">
                    <MessageSquare className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <H1 className="text-2xl">
                      Custom Chatbots
                    </H1>
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
            ) : selectedTool === 'agent-console' ? (
              /* Agent Console documentation */
              <>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/50">
                    <Headphones className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <H1 className="text-2xl">
                      Agent Console
                    </H1>
                    <p className="text-secondary-600 dark:text-secondary-400">
                      Embed a live agent console on your website so your team can manage handoff conversations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mb-6">
                  <Badge variant="success">Embed Available</Badge>
                  <Badge variant="success">API Key Auth</Badge>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="w-5 h-5 text-primary-500" />
                      Quick Embed
                    </CardTitle>
                    <CardDescription>
                      Add the agent console to any page with a single script tag.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<script
  src="https://yoursite.com/agent-console/sdk.js"
  data-chatbot-id="CHATBOT_ID"
  data-api-key="YOUR_API_KEY"
></script>`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`<script\n  src="https://yoursite.com/agent-console/sdk.js"\n  data-chatbot-id="CHATBOT_ID"\n  data-api-key="YOUR_API_KEY"\n></script>`, 'agent-quick')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy embed code"
                      >
                        {copied === 'agent-quick' ? (
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
                      Manual Initialization
                    </CardTitle>
                    <CardDescription>
                      Mount the console into a specific container with full control over options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<div id="my-console" style="height:700px"></div>

<script src="https://yoursite.com/agent-console/sdk.js"></script>
<script>
  AgentConsole.init({
    chatbotId: 'CHATBOT_ID',
    apiKey: 'YOUR_API_KEY',
    position: 'full',        // 'full' or 'sidebar'
    container: '#my-console'  // CSS selector or DOM element
  });
</script>`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`<div id="my-console" style="height:700px"></div>\n\n<script src="https://yoursite.com/agent-console/sdk.js"></script>\n<script>\n  AgentConsole.init({\n    chatbotId: 'CHATBOT_ID',\n    apiKey: 'YOUR_API_KEY',\n    position: 'full',\n    container: '#my-console'\n  });\n</script>`, 'agent-manual')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy manual init code"
                      >
                        {copied === 'agent-manual' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-400" />
                        )}
                      </button>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">Configuration Options</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-secondary-200 dark:border-secondary-700">
                              <th className="text-left py-2 pr-4 font-medium text-secondary-700 dark:text-secondary-300">Option</th>
                              <th className="text-left py-2 pr-4 font-medium text-secondary-700 dark:text-secondary-300">Type</th>
                              <th className="text-left py-2 font-medium text-secondary-700 dark:text-secondary-300">Description</th>
                            </tr>
                          </thead>
                          <tbody className="text-secondary-600 dark:text-secondary-400">
                            <tr className="border-b border-secondary-100 dark:border-secondary-800">
                              <td className="py-2 pr-4"><code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">chatbotId</code></td>
                              <td className="py-2 pr-4">string</td>
                              <td className="py-2">Required. Your chatbot ID.</td>
                            </tr>
                            <tr className="border-b border-secondary-100 dark:border-secondary-800">
                              <td className="py-2 pr-4"><code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">apiKey</code></td>
                              <td className="py-2 pr-4">string</td>
                              <td className="py-2">Required. Your API key for authentication.</td>
                            </tr>
                            <tr className="border-b border-secondary-100 dark:border-secondary-800">
                              <td className="py-2 pr-4"><code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">position</code></td>
                              <td className="py-2 pr-4">string</td>
                              <td className="py-2"><code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">&quot;full&quot;</code> (default) fills the container. <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">&quot;sidebar&quot;</code> docks a 420px panel to the right.</td>
                            </tr>
                            <tr>
                              <td className="py-2 pr-4"><code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">container</code></td>
                              <td className="py-2 pr-4">string | Element</td>
                              <td className="py-2">CSS selector or DOM element to mount into. Only used in <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">&quot;full&quot;</code> mode.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-primary-500" />
                      iFrame Embed
                    </CardTitle>
                    <CardDescription>
                      Embed the console directly via iframe for simpler integrations.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <pre className="text-sm bg-secondary-900 text-secondary-100 p-4 rounded-lg overflow-x-auto">
{`<iframe
  src="https://yoursite.com/agent-console/CHATBOT_ID#key=YOUR_API_KEY"
  style="border:none;width:100%;height:700px;"
  allow="clipboard-write"
></iframe>`}
                      </pre>
                      <button
                        onClick={() => copyToClipboard(`<iframe\n  src="https://yoursite.com/agent-console/CHATBOT_ID#key=YOUR_API_KEY"\n  style="border:none;width:100%;height:700px;"\n  allow="clipboard-write"\n></iframe>`, 'agent-iframe')}
                        className="absolute top-2 right-2 p-2 hover:bg-secondary-700 rounded"
                        aria-label="Copy iframe code"
                      >
                        {copied === 'agent-iframe' ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <Copy className="w-4 h-4 text-secondary-400" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400">
                      The API key is passed via the URL hash fragment (<code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">#key=...</code>) so it is not sent to the server in the request.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-secondary-900 dark:text-secondary-100">
                          Manage Your Chatbots
                        </p>
                        <p className="text-sm text-secondary-600 dark:text-secondary-400">
                          Create chatbots and get your chatbot ID and API key from the dashboard
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
            ) : null}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-64 mb-48">
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
