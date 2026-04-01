'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
  Info,
  Terminal,
  FileCode,
  Zap,
  Globe,
  Shield,
  Webhook,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

// ─── Section definitions ────────────────────────────────────────────────────

// Groups for sidebar headings
const GROUPS = ['Quick Start', 'Widget Embed', 'REST API', 'Agent Console', 'Webhooks'] as const;

type SectionId =
  | 'authentication'
  | 'widget-embed'
  | 'widget-script'
  | 'widget-nextjs'
  | 'widget-manual'
  | 'widget-iframe'
  | 'widget-auth-users'
  | 'rest-api'
  | 'chat-endpoint'
  | 'agent-console'
  | 'agent-quick'
  | 'agent-manual'
  | 'agent-iframe'
  | 'webhooks'
  | 'webhook-verification'
  | 'webhook-events';

const SECTIONS: Array<{
  id: SectionId;
  label: string;
  parent: typeof GROUPS[number];
  indent?: boolean;
}> = [
  { id: 'authentication',        label: 'Authentication',         parent: 'Quick Start' },
  { id: 'widget-embed',          label: 'Widget Embed',           parent: 'Widget Embed' },
  { id: 'widget-script',         label: 'Script Tag',             parent: 'Widget Embed', indent: true },
  { id: 'widget-nextjs',         label: 'Next.js',                parent: 'Widget Embed', indent: true },
  { id: 'widget-manual',         label: 'Manual Init',            parent: 'Widget Embed', indent: true },
  { id: 'widget-iframe',         label: 'iFrame',                 parent: 'Widget Embed', indent: true },
  { id: 'widget-auth-users',     label: 'Authenticated Users',    parent: 'Widget Embed', indent: true },
  { id: 'rest-api',              label: 'REST API',               parent: 'REST API' },
  { id: 'chat-endpoint',         label: 'Chat Endpoint',          parent: 'REST API', indent: true },
  { id: 'agent-console',         label: 'Agent Console',          parent: 'Agent Console' },
  { id: 'agent-quick',           label: 'Quick Embed',            parent: 'Agent Console', indent: true },
  { id: 'agent-manual',          label: 'Manual Init',            parent: 'Agent Console', indent: true },
  { id: 'agent-iframe',          label: 'iFrame',                 parent: 'Agent Console', indent: true },
  { id: 'webhooks',              label: 'Webhooks',               parent: 'Webhooks' },
  { id: 'webhook-verification',  label: 'Signature Verification', parent: 'Webhooks', indent: true },
  { id: 'webhook-events',        label: 'Event Types',            parent: 'Webhooks', indent: true },
];

// ─── Code samples ────────────────────────────────────────────────────────────

const CODE = {
  authHeader: `Authorization: Bearer YOUR_API_KEY`,

  widgetScript: `<script src="https://vocui.com/widget/sdk.js" data-chatbot-id="CHATBOT_ID"></script>`,

  widgetNextjs: `import Script from 'next/script';

// Add to your root layout (app/layout.tsx)
<Script
  src="https://vocui.com/widget/sdk.js"
  data-chatbot-id="CHATBOT_ID"
  strategy="afterInteractive"
/>`,

  widgetManual: `<script src="https://vocui.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({ chatbotId: 'CHATBOT_ID' });
</script>`,

  widgetIframe: `<iframe
  src="https://vocui.com/widget/CHATBOT_ID"
  style="border:none;width:400px;height:600px;"
  allow="clipboard-write"
></iframe>`,

  widgetAuthUser: `<script src="https://vocui.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'CHATBOT_ID',
    user: {
      id: 'user_123',
      name: 'Jane Doe',
      email: 'jane@example.com',
      plan: 'Pro'
    },
    context: {
      recent_orders: [{ id: 'ORD-001', total: '$149', status: 'shipped' }],
      account_balance: '$42.50',
      subscription: { plan: 'Pro', renewal: '2024-04-15' }
    }
  });
</script>`,

  apiCurl: `curl -X POST "https://vocui.com/api/chat/CHATBOT_ID" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"message": "Hello!", "session_id": "unique-session-id"}'`,

  apiJs: `const res = await fetch('https://vocui.com/api/chat/CHATBOT_ID', {
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
const data = await res.json();`,

  agentQuick: `<script
  src="https://vocui.com/agent-console/sdk.js"
  data-chatbot-id="CHATBOT_ID"
  data-api-key="YOUR_API_KEY"
></script>`,

  agentManual: `<script src="https://vocui.com/agent-console/sdk.js"></script>
<script>
  AgentConsole.init({
    chatbotId: 'CHATBOT_ID',
    apiKey: 'YOUR_API_KEY',
    position: 'full',
    container: '#my-console'
  });
</script>`,

  agentIframe: `<iframe
  src="https://vocui.com/agent-console/CHATBOT_ID#key=YOUR_API_KEY"
  style="border:none;width:100%;height:700px;"
  allow="clipboard-write"
></iframe>`,

  webhookVerify: `const crypto = require('crypto');

function verifyWebhook(req, secret) {
  const sig = req.headers['x-webhook-signature'];
  const ts  = req.headers['x-webhook-timestamp'];
  const body = JSON.stringify(req.body);

  const expected = crypto
    .createHmac('sha256', secret)
    .update(ts + '.' + body)
    .digest('hex');

  const isValid = crypto.timingSafeEqual(
    Buffer.from(sig),
    Buffer.from(expected)
  );
  const isRecent = Date.now() / 1000 - Number(ts) < 300;
  return isValid && isRecent;
}`,
};

const WEBHOOK_EVENTS = [
  { event: 'conversation.started', desc: 'A new chat session has started' },
  { event: 'conversation.ended',   desc: 'A chat session ended' },
  { event: 'lead.captured',        desc: 'A lead was captured from a chatbot conversation' },
  { event: 'message.sent',         desc: 'A message was sent in a chat session' },
  { event: 'handoff.requested',    desc: 'A live handoff to a human agent was requested' },
  { event: 'handoff.accepted',     desc: 'A human agent accepted a handoff request' },
];

// ─── CodeBlock component ─────────────────────────────────────────────────────

function CodeBlock({
  code,
  language,
  copyId,
  copied,
  onCopy,
}: {
  code: string;
  language: string;
  copyId: string;
  copied: string | null;
  onCopy: (code: string, id: string) => void;
}) {
  return (
    <div className="relative group">
      <div className="absolute top-2 left-3">
        <span className="text-[10px] font-mono uppercase tracking-wider text-secondary-500 dark:text-secondary-500">
          {language}
        </span>
      </div>
      <pre className="pt-8 pb-4 px-4 bg-secondary-100 dark:bg-secondary-950 text-secondary-800 dark:text-secondary-100 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-secondary-200 dark:border-secondary-700">
        <code className="whitespace-pre">{code}</code>
      </pre>
      <Button
        size="sm"
        variant="outline"
        className="absolute top-2 right-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity bg-white dark:bg-secondary-700 border-secondary-400 dark:border-secondary-600 hover:bg-secondary-50 dark:hover:bg-secondary-600 hover:border-secondary-500 dark:hover:border-secondary-500 text-secondary-600 dark:text-secondary-200 hover:text-secondary-800 dark:hover:text-secondary-100"
        onClick={() => onCopy(code, copyId)}
      >
        {copied === copyId ? (
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

// ─── Amber warning banner ────────────────────────────────────────────────────

function ApiKeyBanner() {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
      <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">API Key Required</p>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
          Replace{' '}
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-xs font-mono">
            YOUR_API_KEY
          </code>{' '}
          with a key from the{' '}
          <Link
            href="/dashboard/api-keys"
            className="text-amber-800 dark:text-amber-200 underline hover:no-underline font-medium"
          >
            API Keys page
          </Link>
          . Keep it server-side or in a protected admin area.
        </p>
      </div>
    </div>
  );
}

// ─── Method selector button ──────────────────────────────────────────────────

function MethodBtn({
  active,
  onClick,
  icon: Icon,
  label,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  accent?: 'primary' | 'orange' | 'green';
}) {
  const accentClasses = {
    primary: 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    orange:  'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    green:   'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  };
  const inactiveClass =
    'border-secondary-200 dark:border-secondary-700 text-secondary-600 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600 hover:text-secondary-800 dark:hover:text-secondary-200';

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors',
        active ? accentClasses[accent ?? 'primary'] : inactiveClass
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ─── Info grid card ───────────────────────────────────────────────────────────

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700">
      <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-1">{title}</p>
      <p className="text-xs text-secondary-500 dark:text-secondary-400">{children}</p>
    </div>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionHeading({
  id,
  icon: Icon,
  title,
  description,
  iconBg = 'bg-primary-100 dark:bg-primary-900/50',
  iconColor = 'text-primary-600 dark:text-primary-400',
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div id={id} className="flex items-center gap-3 scroll-mt-28">
      <div className={cn('p-2.5 rounded-lg', iconBg)}>
        <Icon className={cn('w-5 h-5', iconColor)} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100">{title}</h2>
        {description && (
          <p className="text-sm text-secondary-500 dark:text-secondary-400">{description}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SDKDocsClient() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('authentication');

  // Widget embed state
  const [embedMethod, setEmbedMethod] = useState<'script' | 'nextjs' | 'manual' | 'iframe'>('script');
  const [showAuthSection, setShowAuthSection] = useState(false);

  // REST API state
  const [apiMethod, setApiMethod] = useState<'curl' | 'javascript'>('curl');

  // Agent console state
  const [agentMethod, setAgentMethod] = useState<'quick' | 'agent-manual' | 'agent-iframe'>('quick');


  // On mount: scroll to hash if present
  useEffect(() => {
    const hash = window.location.hash.slice(1) as SectionId;
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      // Small delay so the page has laid out
      setTimeout(() => handleNavClick(hash), 100);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser back/forward: scroll to section from hash
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (hash && SECTIONS.some((s) => s.id === hash)) {
        handleNavClick(hash);
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll-based active section tracking — update URL hash as user scrolls
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id as SectionId;
            setActiveSection(id);
            history.replaceState(null, '', `#${id}`);
          }
        });
      },
      { rootMargin: '-15% 0px -75% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Sidebar nav click: scroll to section AND activate the correct method tab
  const handleNavClick = (sectionId: SectionId) => {
    const embedMap: Record<string, typeof embedMethod> = {
      'widget-script': 'script',
      'widget-nextjs': 'nextjs',
      'widget-manual': 'manual',
      'widget-iframe': 'iframe',
    };
    const agentMap: Record<string, typeof agentMethod> = {
      'agent-quick':  'quick',
      'agent-manual': 'agent-manual',
      'agent-iframe': 'agent-iframe',
    };

    history.pushState(null, '', `#${sectionId}`);

    if (sectionId === 'widget-auth-users') {
      setShowAuthSection(true);
      scrollTo('widget-auth-users');
    } else if (embedMap[sectionId]) {
      setEmbedMethod(embedMap[sectionId]);
      scrollTo('widget-embed');
    } else if (agentMap[sectionId]) {
      setAgentMethod(agentMap[sectionId]);
      scrollTo('agent-console');
    } else if (sectionId === 'chat-endpoint') {
      scrollTo('rest-api');
    } else if (sectionId === 'webhook-verification' || sectionId === 'webhook-events') {
      scrollTo('webhooks');
    } else {
      scrollTo(sectionId);
    }
  };

  // Compute the effective active sidebar item, accounting for method sub-tabs
  const effectiveActiveSection: SectionId = (() => {
    // Sections with their own scroll targets pass through directly
    const passThrough: SectionId[] = ['widget-auth-users', 'chat-endpoint', 'webhook-verification', 'webhook-events'];
    if (passThrough.includes(activeSection)) return activeSection;

    const widgetZone: SectionId[] = ['widget-embed', 'widget-script', 'widget-nextjs', 'widget-manual', 'widget-iframe'];
    const agentZone: SectionId[] = ['agent-console', 'agent-quick', 'agent-manual', 'agent-iframe'];
    if (widgetZone.includes(activeSection)) {
      const map: Record<typeof embedMethod, SectionId> = {
        script: 'widget-script', nextjs: 'widget-nextjs', manual: 'widget-manual', iframe: 'widget-iframe',
      };
      return map[embedMethod];
    }
    if (agentZone.includes(activeSection)) {
      const map: Record<typeof agentMethod, SectionId> = {
        quick: 'agent-quick', 'agent-manual': 'agent-manual', 'agent-iframe': 'agent-iframe',
      };
      return map[agentMethod];
    }
    return activeSection;
  })();

  // Determine active group for sidebar group label highlighting
  const activeGroup = SECTIONS.find((s) => s.id === effectiveActiveSection)?.parent ?? 'Quick Start';

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
        title="API & SDK Documentation"
        description="Integrate AI-powered chatbots into your website or application using embeddable widgets, the REST API, or webhooks."
        breadcrumbs={[{ label: 'Documentation' }]}
        cta={{ primary: { label: 'Get API Key', href: '/signup' } }}
      />

      <div className="container mx-auto px-4 pt-4 pb-2 max-w-6xl">
        <div className="flex items-center gap-2 p-3 bg-secondary-50 dark:bg-secondary-800/50 border border-secondary-200 dark:border-secondary-700 rounded-lg text-sm text-secondary-600 dark:text-secondary-400">
          Looking for user guides?{' '}
          <Link href="/wiki" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Browse the Documentation →
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8 max-w-6xl mx-auto lg:items-start">

          {/* ── Sidebar ── */}
          <aside className="lg:sticky lg:top-24 lg:self-start overflow-x-auto lg:overflow-x-visible">
            <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0">
              {GROUPS.map((group) => {
                const groupSections = SECTIONS.filter((s) => s.parent === group);
                return (
                  <div key={group} className="md:mb-2">
                    <p
                      className={cn(
                        'hidden lg:block text-xs font-semibold uppercase tracking-wide mb-1 px-3 py-1',
                        activeGroup === group
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-secondary-400 dark:text-secondary-500'
                      )}
                    >
                      {group}
                    </p>
                    {groupSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => handleNavClick(section.id)}
                        className={cn(
                          'w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors whitespace-nowrap lg:whitespace-normal',
                          section.indent ? 'lg:pl-5' : '',
                          effectiveActiveSection === section.id
                            ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 font-medium'
                            : 'text-secondary-600 dark:text-secondary-400 hover:bg-secondary-100 dark:hover:bg-secondary-800'
                        )}
                      >
                        {section.label}
                      </button>
                    ))}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* ── Main content ── */}
          <div className="space-y-12 min-w-0">

            {/* ════════════════════════════════════════
                QUICK START — Authentication
            ════════════════════════════════════════ */}
            <section id="authentication" className="scroll-mt-28 space-y-4">
              <SectionHeading
                id="authentication-heading"
                icon={Key}
                title="Authentication"
                description="All API requests require an API key obtained from your dashboard."
              />
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Include your API key as a Bearer token in the{' '}
                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">
                      Authorization
                    </code>{' '}
                    header for every request.
                  </p>
                  <CodeBlock
                    code={CODE.authHeader}
                    language="http"
                    copyId="auth-header"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <Button asChild>
                    <Link href="/dashboard/api-keys">
                      Get API Key
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* ════════════════════════════════════════
                WIDGET EMBED
            ════════════════════════════════════════ */}
            <section id="widget-embed" className="scroll-mt-28 space-y-6">
              <SectionHeading
                id="widget-embed-heading"
                icon={MessageSquare}
                title="Widget Embed"
                description="Add your chatbot to any website. Choose the method that fits your stack."
              />

              <Card id="widget-embed-card" className="scroll-mt-28">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap gap-2 items-center">
                    <CardTitle className="text-base">Choose Embed Method</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {([
                      { id: 'script',  label: 'Script Tag',     icon: Zap,      desc: 'Universal',  sectionId: 'widget-script'  },
                      { id: 'nextjs',  label: 'Next.js / React', icon: FileCode, desc: 'SSR',        sectionId: 'widget-nextjs'  },
                      { id: 'manual',  label: 'Manual Init',     icon: Code,     desc: 'Controlled', sectionId: 'widget-manual'  },
                      { id: 'iframe',  label: 'iFrame',          icon: Globe,    desc: 'Sandboxed',  sectionId: 'widget-iframe'  },
                    ] as const).map((m) => (
                      <MethodBtn
                        key={m.id}
                        active={embedMethod === m.id}
                        onClick={() => setEmbedMethod(m.id)}
                        icon={m.icon}
                        label={m.label}
                        accent="primary"
                      />
                    ))}
                  </div>

                  {embedMethod === 'script' && (
                    <div id="widget-script-content" className="space-y-2">
                      <CodeBlock
                        code={CODE.widgetScript}
                        language="html"
                        copyId="widget-script"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Paste before{' '}
                        <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">
                          {'</body>'}
                        </code>
                        . Works with any HTML site, WordPress, Shopify, Webflow, and more.
                      </p>
                    </div>
                  )}

                  {embedMethod === 'nextjs' && (
                    <div id="widget-nextjs-content" className="space-y-2">
                      <CodeBlock
                        code={CODE.widgetNextjs}
                        language="tsx"
                        copyId="widget-nextjs"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Add the{' '}
                        <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">
                          Script
                        </code>{' '}
                        component to your root layout for SSR-compatible loading.
                      </p>
                    </div>
                  )}

                  {embedMethod === 'manual' && (
                    <div id="widget-manual-content" className="space-y-2">
                      <CodeBlock
                        code={CODE.widgetManual}
                        language="html"
                        copyId="widget-manual"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Use when you need to control exactly when the widget initializes — for
                        example, after a user logs in.
                      </p>
                    </div>
                  )}

                  {embedMethod === 'iframe' && (
                    <div id="widget-iframe-content" className="space-y-2">
                      <CodeBlock
                        code={CODE.widgetIframe}
                        language="html"
                        copyId="widget-iframe"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-sm text-secondary-500 dark:text-secondary-400">
                        Embeds the chat inline. Use when you need strict sandboxing or cannot add
                        scripts to the page.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Authenticated Users */}
              <Card id="widget-auth-users" className="scroll-mt-28">
                <button
                  onClick={() => setShowAuthSection((v) => !v)}
                  className="w-full text-left"
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
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 text-secondary-400 transition-transform',
                          showAuthSection && 'rotate-180'
                        )}
                      />
                    </div>
                    <CardDescription className="text-left mt-1">
                      Pass logged-in user data so the chatbot knows who they are
                    </CardDescription>
                  </CardHeader>
                </button>
                {showAuthSection && (
                  <CardContent className="space-y-4 pt-0">
                    <CodeBlock
                      code={CODE.widgetAuthUser}
                      language="html"
                      copyId="widget-auth"
                      copied={copied}
                      onCopy={copyToClipboard}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InfoCard title="user object">
                        Pass verified user identity (name, email, plan). Requires an{' '}
                        <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">
                          id
                        </code>{' '}
                        field. Skips the pre-chat form automatically.
                      </InfoCard>
                      <InfoCard title="context object">
                        Pass account data (orders, billing, subscription). The chatbot can answer
                        "Where's my order?" or "When does my plan renew?" using the values you
                        provide.
                      </InfoCard>
                    </div>
                  </CardContent>
                )}
              </Card>
            </section>

            {/* ════════════════════════════════════════
                REST API
            ════════════════════════════════════════ */}
            <section id="rest-api" className="scroll-mt-28 space-y-6">
              <SectionHeading
                id="rest-api-heading"
                icon={Terminal}
                title="REST API"
                description="Build custom chat UIs, backend integrations, or mobile apps."
                iconBg="bg-green-100 dark:bg-green-900/50"
                iconColor="text-green-600 dark:text-green-400"
              />

              <Card id="chat-endpoint" className="scroll-mt-28">
                <CardHeader>
                  <CardTitle className="text-base">Chat Endpoint</CardTitle>
                  <CardDescription>Send messages to your chatbot and receive responses.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Endpoint row */}
                  <div>
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Endpoint
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center gap-3 p-3 bg-secondary-100 dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-700 min-w-0">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 font-mono text-xs shrink-0">
                          POST
                        </Badge>
                        <code className="text-sm font-mono text-secondary-800 dark:text-secondary-200 truncate">
                          https://vocui.com/api/chat/CHATBOT_ID
                        </code>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(
                            'https://vocui.com/api/chat/CHATBOT_ID',
                            'endpoint-url'
                          )
                        }
                      >
                        {copied === 'endpoint-url' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Method selector */}
                  <div className="flex flex-wrap gap-2">
                    <MethodBtn
                      active={apiMethod === 'curl'}
                      onClick={() => setApiMethod('curl')}
                      icon={Terminal}
                      label="cURL"
                      accent="green"
                    />
                    <MethodBtn
                      active={apiMethod === 'javascript'}
                      onClick={() => setApiMethod('javascript')}
                      icon={FileCode}
                      label="JavaScript"
                      accent="green"
                    />
                  </div>

                  {apiMethod === 'curl' && (
                    <div className="space-y-2">
                      <CodeBlock
                        code={CODE.apiCurl}
                        language="bash"
                        copyId="api-curl"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        Test from your terminal. Great for quick testing and debugging.
                      </p>
                    </div>
                  )}

                  {apiMethod === 'javascript' && (
                    <div className="space-y-2">
                      <CodeBlock
                        code={CODE.apiJs}
                        language="javascript"
                        copyId="api-js"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        Use in Node.js or browser environments with the Fetch API.
                      </p>
                    </div>
                  )}

                  {/* Request body fields */}
                  <div>
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Request body
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-secondary-200 dark:border-secondary-700">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
                            <th className="text-left py-2 px-3 font-medium text-secondary-700 dark:text-secondary-300">Field</th>
                            <th className="text-left py-2 px-3 font-medium text-secondary-700 dark:text-secondary-300">Type</th>
                            <th className="text-left py-2 px-3 font-medium text-secondary-700 dark:text-secondary-300">Required</th>
                            <th className="text-left py-2 px-3 font-medium text-secondary-700 dark:text-secondary-300">Description</th>
                          </tr>
                        </thead>
                        <tbody className="text-secondary-600 dark:text-secondary-400 divide-y divide-secondary-100 dark:divide-secondary-800">
                          {[
                            { field: 'message',    type: 'string',  required: true,  desc: 'The user message to send to the chatbot.' },
                            { field: 'session_id', type: 'string',  required: false, desc: 'A stable identifier to group messages into a conversation. If omitted, a new session is created.' },
                          ].map(({ field, type, required, desc }) => (
                            <tr key={field}>
                              <td className="py-2 px-3">
                                <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1.5 py-0.5 rounded">
                                  {field}
                                </code>
                              </td>
                              <td className="py-2 px-3 text-xs">{type}</td>
                              <td className="py-2 px-3">
                                <Badge variant={required ? 'default' : 'secondary'} className="text-[10px]">
                                  {required ? 'Required' : 'Optional'}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-xs">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <ApiKeyBanner />
                </CardContent>
              </Card>
            </section>

            {/* ════════════════════════════════════════
                AGENT CONSOLE
            ════════════════════════════════════════ */}
            <section id="agent-console" className="scroll-mt-28 space-y-6">
              <SectionHeading
                id="agent-console-heading"
                icon={Headphones}
                title="Agent Console"
                description="Embed a live agent console so your team can manage handoff conversations."
                iconBg="bg-orange-100 dark:bg-orange-900/50"
                iconColor="text-orange-600 dark:text-orange-400"
              />

              <Card id="agent-console-card" className="scroll-mt-28">
                <CardContent className="pt-6 space-y-5">
                  {/* Method selector */}
                  <div className="flex flex-wrap gap-2">
                    <MethodBtn
                      active={agentMethod === 'quick'}
                      onClick={() => setAgentMethod('quick')}
                      icon={Zap}
                      label="Quick Embed"
                      accent="orange"
                    />
                    <MethodBtn
                      active={agentMethod === 'agent-manual'}
                      onClick={() => setAgentMethod('agent-manual')}
                      icon={Code}
                      label="Manual Init"
                      accent="orange"
                    />
                    <MethodBtn
                      active={agentMethod === 'agent-iframe'}
                      onClick={() => setAgentMethod('agent-iframe')}
                      icon={Globe}
                      label="iFrame"
                      accent="orange"
                    />
                  </div>

                  {agentMethod === 'quick' && (
                    <div className="space-y-2">
                      <CodeBlock
                        code={CODE.agentQuick}
                        language="html"
                        copyId="agent-quick"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        Full-page console. Add{' '}
                        <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">
                          data-position=&quot;sidebar&quot;
                        </code>{' '}
                        for a fixed sidebar instead.
                      </p>
                    </div>
                  )}

                  {agentMethod === 'agent-manual' && (
                    <div className="space-y-4">
                      <CodeBlock
                        code={CODE.agentManual}
                        language="html"
                        copyId="agent-manual"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        Load the SDK separately and mount into a specific container element.
                      </p>
                      {/* Config options table */}
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                          Configuration Options
                        </p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="border-b border-secondary-200 dark:border-secondary-700">
                                <th className="text-left py-2 pr-4 font-medium text-secondary-700 dark:text-secondary-300">
                                  Option
                                </th>
                                <th className="text-left py-2 pr-4 font-medium text-secondary-700 dark:text-secondary-300">
                                  Type
                                </th>
                                <th className="text-left py-2 font-medium text-secondary-700 dark:text-secondary-300">
                                  Description
                                </th>
                              </tr>
                            </thead>
                            <tbody className="text-secondary-600 dark:text-secondary-400">
                              {[
                                { opt: 'chatbotId',  type: 'string',           desc: 'Required. Your chatbot ID.' },
                                { opt: 'apiKey',     type: 'string',           desc: 'Required. Your API key for authentication.' },
                                { opt: 'position',   type: 'string',           desc: '"full" (default) fills the container. "sidebar" docks a 420px panel to the right.' },
                                { opt: 'container',  type: 'string | Element', desc: 'CSS selector or DOM element to mount into. Only used in "full" mode.' },
                              ].map(({ opt, type, desc }) => (
                                <tr key={opt} className="border-b border-secondary-100 dark:border-secondary-800 last:border-0">
                                  <td className="py-2 pr-4">
                                    <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-xs">
                                      {opt}
                                    </code>
                                  </td>
                                  <td className="py-2 pr-4 text-xs">{type}</td>
                                  <td className="py-2 text-xs">{desc}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <InfoCard title="position: full">
                          Fills the parent container or viewport. Use{' '}
                          <code className="bg-secondary-100 dark:bg-secondary-800 px-1 py-0.5 rounded text-[11px]">
                            container
                          </code>{' '}
                          to mount into a specific element.
                        </InfoCard>
                        <InfoCard title="position: sidebar">
                          Fixed 420px sidebar docked to the right edge. Great for internal support
                          dashboards.
                        </InfoCard>
                      </div>
                    </div>
                  )}

                  {agentMethod === 'agent-iframe' && (
                    <div className="space-y-2">
                      <CodeBlock
                        code={CODE.agentIframe}
                        language="html"
                        copyId="agent-iframe"
                        copied={copied}
                        onCopy={copyToClipboard}
                      />
                      <p className="text-xs text-secondary-500 dark:text-secondary-400">
                        The API key is passed via the URL hash fragment (
                        <code className="bg-secondary-100 dark:bg-secondary-800 px-1 rounded text-[11px]">
                          #key=...
                        </code>
                        ) so it is not sent to the server in the request.
                      </p>
                    </div>
                  )}

                  <ApiKeyBanner />
                </CardContent>
              </Card>
            </section>

            {/* ════════════════════════════════════════
                WEBHOOKS
            ════════════════════════════════════════ */}
            <section id="webhooks" className="scroll-mt-28 space-y-6">
              <SectionHeading
                id="webhooks-heading"
                icon={Webhook}
                title="Webhooks"
                description="Receive real-time HTTP notifications when events happen in your chatbots."
                iconBg="bg-primary-100 dark:bg-primary-900/50"
                iconColor="text-primary-600 dark:text-primary-400"
              />

              {/* Signature verification */}
              <Card id="webhook-verification" className="scroll-mt-28">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary-500" />
                    <CardTitle className="text-base">Signature Verification</CardTitle>
                  </div>
                  <CardDescription>
                    Validate incoming webhook requests using HMAC-SHA256
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm text-secondary-600 dark:text-secondary-400">
                    Each request includes three headers. Compute{' '}
                    <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">
                      {'HMAC-SHA256(timestamp + "." + body, secret)'}
                    </code>{' '}
                    and compare the hex digest against{' '}
                    <code className="text-xs font-mono bg-secondary-100 dark:bg-secondary-800 px-1 rounded">
                      X-Webhook-Signature
                    </code>
                    . Reject requests where the timestamp is more than 5 minutes old.
                  </p>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { header: 'X-Webhook-Signature', desc: 'HMAC-SHA256 hex digest' },
                      { header: 'X-Webhook-Timestamp', desc: 'Unix epoch seconds' },
                      { header: 'X-Webhook-Event',     desc: 'Event name e.g. lead.captured' },
                    ].map(({ header, desc }) => (
                      <div
                        key={header}
                        className="p-3 bg-secondary-50 dark:bg-secondary-800/50 rounded-lg border border-secondary-200 dark:border-secondary-700 space-y-1"
                      >
                        <code className="text-xs font-mono text-secondary-800 dark:text-secondary-200 break-all">
                          {header}
                        </code>
                        <p className="text-xs text-secondary-500">{desc}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-2">
                      Node.js verification example
                    </p>
                    <CodeBlock
                      code={CODE.webhookVerify}
                      language="javascript"
                      copyId="webhook-verify"
                      copied={copied}
                      onCopy={copyToClipboard}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Event types */}
              <Card id="webhook-events" className="scroll-mt-28">
                <CardHeader>
                  <CardTitle className="text-base">Event Types</CardTitle>
                  <CardDescription>
                    Subscribe to specific events or leave empty to receive all events.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {WEBHOOK_EVENTS.map(({ event, desc }) => (
                      <div
                        key={event}
                        className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 py-2 border-b border-secondary-100 dark:border-secondary-800 last:border-0"
                      >
                        <code className="text-xs font-mono text-secondary-800 dark:text-secondary-200 bg-secondary-100 dark:bg-secondary-800 px-2 py-0.5 rounded shrink-0">
                          {event}
                        </code>
                        <span className="text-sm text-secondary-500 dark:text-secondary-400">
                          {desc}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Save your webhook secret
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        The secret is shown only once when you create a webhook. Store it securely
                        — you will need it to verify signatures on every incoming request.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center justify-end">
                <Button asChild variant="outline">
                  <Link href="/dashboard/webhooks" className="gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Manage Webhooks
                  </Link>
                </Button>
              </div>
            </section>

          </div>
        </div>

        {/* ── CTA — outside the sidebar grid ── */}
        <section className="mt-24 mb-16 max-w-2xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-br from-primary-700 to-primary-800 p-12 text-white shadow-xl text-center">
            <H1 className="text-3xl font-bold mb-4 text-white">
              Your integration starts here.
            </H1>
            <p className="text-lg text-white/80 mb-8 max-w-md mx-auto">
              Create your chatbot, drop in the embed snippet, and start handling real conversations. Free account, no credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary-600 hover:bg-primary-50 px-8"
                asChild
              >
                <Link href="/signup">Start Building Free</Link>
              </Button>
              <Button size="lg" variant="outline-light" asChild>
                <Link href="/pricing">See Plans</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </PageBackground>
  );
}
