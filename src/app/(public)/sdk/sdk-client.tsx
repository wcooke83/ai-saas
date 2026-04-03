'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/layout';
import { Footer } from '@/components/ui/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Copy,
  Check,
  Key,
  ArrowRight,
  MessageSquare,
  ExternalLink,
  Headphones,
  Terminal,
  FileCode,
  Zap,
  Globe,
  Shield,
  Webhook,
  ChevronDown,
  AlertTriangle,
  Code,
  Info,
} from 'lucide-react';

// ─── Section definitions ──────────────────────────────────────────────────────

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
  parent: (typeof GROUPS)[number];
  indent?: boolean;
}> = [
  { id: 'authentication',       label: 'Authentication',        parent: 'Quick Start' },
  { id: 'widget-embed',         label: 'Widget Embed',          parent: 'Widget Embed' },
  { id: 'widget-script',        label: 'Script Tag',            parent: 'Widget Embed', indent: true },
  { id: 'widget-nextjs',        label: 'Next.js',               parent: 'Widget Embed', indent: true },
  { id: 'widget-manual',        label: 'Manual Init',           parent: 'Widget Embed', indent: true },
  { id: 'widget-iframe',        label: 'iFrame',                parent: 'Widget Embed', indent: true },
  { id: 'widget-auth-users',    label: 'Authenticated Users',   parent: 'Widget Embed', indent: true },
  { id: 'rest-api',             label: 'REST API',              parent: 'REST API' },
  { id: 'chat-endpoint',        label: 'Chat Endpoint',         parent: 'REST API', indent: true },
  { id: 'agent-console',        label: 'Agent Console',         parent: 'Agent Console' },
  { id: 'agent-quick',          label: 'Quick Embed',           parent: 'Agent Console', indent: true },
  { id: 'agent-manual',         label: 'Manual Init',           parent: 'Agent Console', indent: true },
  { id: 'agent-iframe',         label: 'iFrame',                parent: 'Agent Console', indent: true },
  { id: 'webhooks',             label: 'Webhooks',              parent: 'Webhooks' },
  { id: 'webhook-verification', label: 'Signature Verification',parent: 'Webhooks', indent: true },
  { id: 'webhook-events',       label: 'Event Types',           parent: 'Webhooks', indent: true },
];

// Section accent colors by group
const GROUP_ACCENT: Record<(typeof GROUPS)[number], string> = {
  'Quick Start':    'text-primary-500',
  'Widget Embed':   'text-primary-500',
  'REST API':       'text-emerald-500',
  'Agent Console':  'text-orange-500',
  'Webhooks':       'text-violet-500',
};

const GROUP_ACTIVE_BORDER: Record<(typeof GROUPS)[number], string> = {
  'Quick Start':   'border-primary-500',
  'Widget Embed':  'border-primary-500',
  'REST API':      'border-emerald-500',
  'Agent Console': 'border-orange-500',
  'Webhooks':      'border-violet-500',
};

// ─── Code samples ─────────────────────────────────────────────────────────────

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

// ─── CodeBlock ────────────────────────────────────────────────────────────────

// Language display labels and dot colors
const LANG_META: Record<string, { label: string; dot: string }> = {
  html:       { label: 'HTML',       dot: 'bg-orange-400' },
  tsx:        { label: 'TSX',        dot: 'bg-sky-400' },
  javascript: { label: 'JavaScript', dot: 'bg-yellow-400' },
  bash:       { label: 'bash',       dot: 'bg-emerald-400' },
  http:       { label: 'HTTP',       dot: 'bg-violet-400' },
};

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
  const meta = LANG_META[language] ?? { label: language, dot: 'bg-secondary-400' };
  const isCopied = copied === copyId;

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
      {/* Terminal chrome bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#161b22] border-b border-white/[0.07]">
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', meta.dot)} />
          <span className="text-[11px] font-mono font-medium tracking-wide text-white/40 uppercase">
            {meta.label}
          </span>
        </div>
        <button
          onClick={() => onCopy(code, copyId)}
          className={cn(
            'flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-md transition-all',
            isCopied
              ? 'bg-emerald-500/20 text-emerald-400'
              : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
          )}
          aria-label={isCopied ? 'Copied' : 'Copy code'}
        >
          {isCopied ? (
            <><Check className="w-3 h-3" />Copied</>
          ) : (
            <><Copy className="w-3 h-3" />Copy</>
          )}
        </button>
      </div>
      {/* Code area */}
      <pre className="px-5 py-4 bg-[#0d1117] text-[13px] font-mono leading-relaxed overflow-x-auto text-[#e6edf3]">
        <code className="whitespace-pre">{code}</code>
      </pre>
    </div>
  );
}

// ─── InlineCode ───────────────────────────────────────────────────────────────

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 px-1.5 py-0.5 rounded text-[12px] font-mono">
      {children}
    </code>
  );
}

// ─── Method tabs ──────────────────────────────────────────────────────────────

type AccentColor = 'primary' | 'emerald' | 'orange';

const ACCENT_ACTIVE: Record<AccentColor, string> = {
  primary: 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-500/40',
  emerald: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/40',
  orange:  'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/40',
};

function MethodTab({
  active,
  onClick,
  icon: Icon,
  label,
  accent = 'primary',
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  accent?: AccentColor;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-all',
        active
          ? ACCENT_ACTIVE[accent]
          : 'border-secondary-200 dark:border-secondary-700 text-secondary-500 dark:text-secondary-400 hover:border-secondary-300 dark:hover:border-secondary-600 hover:text-secondary-700 dark:hover:text-secondary-200'
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ─── Section heading ──────────────────────────────────────────────────────────

function SectionLabel({ children, accent = 'primary' }: { children: React.ReactNode; accent?: string }) {
  return (
    <p className={cn('text-[11px] font-semibold uppercase tracking-[0.18em] mb-3', accent)}>
      {children}
    </p>
  );
}

// ─── Param table ──────────────────────────────────────────────────────────────

interface ParamRow {
  field: string;
  type: string;
  required?: boolean;
  desc: string;
}

function ParamTable({ rows }: { rows: ParamRow[] }) {
  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900/60">
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Field</th>
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Type</th>
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Required</th>
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800/60">
          {rows.map(({ field, type, required, desc }) => (
            <tr key={field} className="text-secondary-600 dark:text-secondary-400">
              <td className="py-2.5 px-4">
                <InlineCode>{field}</InlineCode>
              </td>
              <td className="py-2.5 px-4 text-secondary-500 dark:text-secondary-500 font-mono text-[12px]">
                {type}
              </td>
              <td className="py-2.5 px-4">
                {required !== undefined && (
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium',
                      required
                        ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                        : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-500 dark:text-secondary-400'
                    )}
                  >
                    {required ? 'Required' : 'Optional'}
                  </span>
                )}
              </td>
              <td className="py-2.5 px-4 text-[12px]">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ─── Config option table (no Required column) ─────────────────────────────────

function ConfigTable({ rows }: { rows: { opt: string; type: string; desc: string }[] }) {
  return (
    <div className="rounded-lg border border-secondary-200 dark:border-secondary-800 overflow-hidden">
      <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900/60">
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Option</th>
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Type</th>
            <th className="text-left py-2.5 px-4 font-semibold text-secondary-600 dark:text-secondary-400">Description</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-100 dark:divide-secondary-800/60">
          {rows.map(({ opt, type, desc }) => (
            <tr key={opt} className="text-secondary-600 dark:text-secondary-400">
              <td className="py-2.5 px-4"><InlineCode>{opt}</InlineCode></td>
              <td className="py-2.5 px-4 text-secondary-500 font-mono text-[12px]">{type}</td>
              <td className="py-2.5 px-4 text-[12px]">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

// ─── API Key warning banner ───────────────────────────────────────────────────

function ApiKeyBanner() {
  return (
    <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
      <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-[13px] text-amber-800 dark:text-amber-300">
        Replace <InlineCode>YOUR_API_KEY</InlineCode> with a key from the{' '}
        <Link href="/dashboard/api-keys" className="underline font-medium hover:no-underline">
          API Keys page
        </Link>
        . Keep it server-side or in a protected admin area.
      </p>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function SectionDivider() {
  return <hr className="border-secondary-200 dark:border-secondary-800" />;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SDKDocsClient() {
  const [copied, setCopied]           = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<SectionId>('authentication');

  const [embedMethod, setEmbedMethod] = useState<'script' | 'nextjs' | 'manual' | 'iframe'>('script');
  const [showAuthSection, setShowAuthSection] = useState(false);
  const [apiMethod, setApiMethod]     = useState<'curl' | 'javascript'>('curl');
  const [agentMethod, setAgentMethod] = useState<'quick' | 'agent-manual' | 'agent-iframe'>('quick');

  // Scroll to hash on mount
  useEffect(() => {
    const hash = window.location.hash.slice(1) as SectionId;
    if (hash && SECTIONS.some((s) => s.id === hash)) {
      setTimeout(() => handleNavClick(hash), 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPop = () => {
      const hash = window.location.hash.slice(1) as SectionId;
      if (hash && SECTIONS.some((s) => s.id === hash)) handleNavClick(hash);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll spy
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

  const effectiveActiveSection: SectionId = (() => {
    const passThrough: SectionId[] = ['widget-auth-users', 'chat-endpoint', 'webhook-verification', 'webhook-events'];
    if (passThrough.includes(activeSection)) return activeSection;

    const widgetZone: SectionId[] = ['widget-embed', 'widget-script', 'widget-nextjs', 'widget-manual', 'widget-iframe'];
    const agentZone: SectionId[]  = ['agent-console', 'agent-quick', 'agent-manual', 'agent-iframe'];

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

  const activeGroup = SECTIONS.find((s) => s.id === effectiveActiveSection)?.parent ?? 'Quick Start';

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-950">
      <Header
        navItems={[
          { label: 'Tools', href: '/tools' },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Docs', href: '/sdk' },
          { label: 'FAQ', href: '/faq' },
        ]}
        cta={{ label: 'Get Started', href: '/login' }}
      />

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0a0f1a] border-b border-white/[0.07]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[11px] font-semibold uppercase tracking-widest text-primary-400">
                <Terminal className="w-3 h-3" />
                Developer API
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white mb-5 leading-[1.1]">
              Build with VocUI
            </h1>
            <p className="text-lg text-white/55 max-w-xl leading-relaxed mb-10">
              Embed AI chatbots anywhere. Script tag, React component, REST API, or iFrame — choose the integration that fits your stack.
            </p>

            {/* Four integration method pills */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: Zap,          label: 'Widget Embed',   color: 'text-sky-400',    bg: 'bg-sky-400/10 border-sky-400/20',    id: 'widget-embed' as SectionId },
                { icon: Terminal,     label: 'REST API',        color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', id: 'rest-api' as SectionId },
                { icon: Headphones,   label: 'Agent Console',   color: 'text-orange-400',  bg: 'bg-orange-400/10 border-orange-400/20',  id: 'agent-console' as SectionId },
                { icon: Webhook,      label: 'Webhooks',        color: 'text-violet-400',  bg: 'bg-violet-400/10 border-violet-400/20',  id: 'webhooks' as SectionId },
              ].map(({ icon: Icon, label, color, bg, id }) => (
                <button
                  key={id}
                  onClick={() => handleNavClick(id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-2 rounded-lg border text-[13px] font-medium transition-all hover:brightness-110',
                    bg, color
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Wiki crosslink banner ─────────────────────────────────────────────── */}
      <div className="w-full border-b border-secondary-200 dark:border-secondary-800 bg-secondary-50 dark:bg-secondary-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-[13px] text-secondary-500 dark:text-secondary-400">
          Looking for user guides?{' '}
          <Link href="/wiki" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
            Browse the Documentation
          </Link>
          <ArrowRight className="w-3.5 h-3.5 text-primary-500" />
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid lg:grid-cols-[200px_1fr] xl:grid-cols-[220px_1fr] gap-10 lg:gap-16 max-w-6xl mx-auto lg:items-start">

          {/* ── Sidebar nav ────────────────────────────────────────────────── */}
          <aside className="lg:sticky lg:top-24 lg:self-start overflow-x-auto lg:overflow-x-visible">
            <nav className="flex lg:flex-col gap-1 min-w-max lg:min-w-0" aria-label="Documentation sections">
              {GROUPS.map((group) => {
                const groupSections = SECTIONS.filter((s) => s.parent === group);
                const isGroupActive = activeGroup === group;
                const accentColor = GROUP_ACCENT[group];
                const activeBorder = GROUP_ACTIVE_BORDER[group];

                return (
                  <div key={group} className="lg:mb-5 last:lg:mb-0">
                    {/* Group label */}
                    <p
                      className={cn(
                        'hidden lg:block text-[10px] font-bold uppercase tracking-[0.16em] mb-2 px-2',
                        isGroupActive ? accentColor : 'text-secondary-400 dark:text-secondary-600'
                      )}
                    >
                      {group}
                    </p>
                    {/* Section items */}
                    {groupSections.map((section) => {
                      const isActive = effectiveActiveSection === section.id;
                      return (
                        <button
                          key={section.id}
                          onClick={() => handleNavClick(section.id)}
                          className={cn(
                            'w-full text-left px-3 py-1.5 rounded-md text-[13px] transition-all whitespace-nowrap lg:whitespace-normal border-l-2',
                            section.indent ? 'lg:ml-2' : '',
                            isActive
                              ? cn(
                                  'font-medium bg-secondary-50 dark:bg-secondary-900/60',
                                  activeBorder,
                                  isGroupActive ? GROUP_ACCENT[group] : 'text-secondary-700 dark:text-secondary-200'
                                )
                              : 'border-transparent text-secondary-500 dark:text-secondary-500 hover:text-secondary-800 dark:hover:text-secondary-200 hover:bg-secondary-50 dark:hover:bg-secondary-900/40'
                          )}
                        >
                          {section.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* ── Main content ───────────────────────────────────────────────── */}
          <main className="min-w-0 space-y-0">

            {/* ════════════════════════
                QUICK START — Authentication
            ════════════════════════ */}
            <section id="authentication" className="scroll-mt-28 pb-14">
              <SectionLabel accent="text-primary-500">Quick Start</SectionLabel>
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-1">
                Authentication
              </h2>
              <p className="text-[15px] text-secondary-500 dark:text-secondary-400 mb-8">
                All API requests require an API key obtained from your dashboard.
              </p>

              {/* Hero auth moment */}
              <div className="mb-6 space-y-3">
                <div className="px-5 py-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-xl border border-secondary-200 dark:border-secondary-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary-100 dark:bg-primary-900/40">
                    <Key className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">Bearer Token</p>
                    <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                      Pass this header with every API request
                    </p>
                  </div>
                </div>
                <CodeBlock
                  code={CODE.authHeader}
                  language="http"
                  copyId="auth-header"
                  copied={copied}
                  onCopy={copyToClipboard}
                />
              </div>

              <div className="flex items-center gap-3">
                <Button asChild>
                  <Link href="/dashboard/api-keys">
                    Get your API Key
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <span className="text-[13px] text-secondary-400 dark:text-secondary-500">
                  Free account, no credit card required
                </span>
              </div>
            </section>

            <SectionDivider />

            {/* ════════════════════════
                WIDGET EMBED
            ════════════════════════ */}
            <section id="widget-embed" className="scroll-mt-28 py-14 space-y-8">
              <div>
                <SectionLabel accent="text-primary-500">Widget Embed</SectionLabel>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-1">
                  Embed the Chat Widget
                </h2>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400">
                  Add your chatbot to any website. Choose the method that fits your stack.
                </p>
              </div>

              {/* Method selector */}
              <div className="flex flex-wrap gap-2">
                {([
                  { id: 'script', label: 'Script Tag',      icon: Zap,      sectionId: 'widget-script' as SectionId },
                  { id: 'nextjs', label: 'Next.js / React', icon: FileCode,  sectionId: 'widget-nextjs' as SectionId },
                  { id: 'manual', label: 'Manual Init',     icon: Code,      sectionId: 'widget-manual' as SectionId },
                  { id: 'iframe', label: 'iFrame',          icon: Globe,     sectionId: 'widget-iframe' as SectionId },
                ] as const).map((m) => (
                  <MethodTab
                    key={m.id}
                    active={embedMethod === m.id}
                    onClick={() => setEmbedMethod(m.id)}
                    icon={m.icon}
                    label={m.label}
                    accent="primary"
                  />
                ))}
              </div>

              {/* script */}
              {embedMethod === 'script' && (
                <div id="widget-script" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.widgetScript}
                    language="html"
                    copyId="widget-script"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Paste before <InlineCode>{'</body>'}</InlineCode>. Works with any HTML site, WordPress, Shopify, Webflow, and more.
                  </p>
                </div>
              )}

              {/* nextjs */}
              {embedMethod === 'nextjs' && (
                <div id="widget-nextjs" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.widgetNextjs}
                    language="tsx"
                    copyId="widget-nextjs"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Add the <InlineCode>Script</InlineCode> component to your root layout for SSR-compatible loading.
                  </p>
                </div>
              )}

              {/* manual */}
              {embedMethod === 'manual' && (
                <div id="widget-manual" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.widgetManual}
                    language="html"
                    copyId="widget-manual"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Use when you need to control exactly when the widget initializes — for example, after a user logs in.
                  </p>
                </div>
              )}

              {/* iframe */}
              {embedMethod === 'iframe' && (
                <div id="widget-iframe" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.widgetIframe}
                    language="html"
                    copyId="widget-iframe"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Embeds the chat inline. Use when you need strict sandboxing or cannot add scripts to the page.
                  </p>
                </div>
              )}

              {/* Authenticated Users — collapsible */}
              <div
                id="widget-auth-users"
                className="scroll-mt-28 rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden"
              >
                <button
                  onClick={() => setShowAuthSection((v) => !v)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between hover:bg-secondary-50 dark:hover:bg-secondary-900/40 transition-colors"
                  aria-expanded={showAuthSection}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-md bg-violet-100 dark:bg-violet-900/30">
                      <Code className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">
                        Authenticated Users
                      </span>
                      <span className="ml-2.5 text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                        Advanced
                      </span>
                    </div>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-secondary-400 transition-transform duration-200',
                      showAuthSection && 'rotate-180'
                    )}
                  />
                </button>

                {showAuthSection && (
                  <div className="border-t border-secondary-200 dark:border-secondary-800 px-5 pt-5 pb-6 space-y-5">
                    <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                      Pass logged-in user data so the chatbot knows who they are. The user object skips the pre-chat form automatically.
                    </p>
                    <CodeBlock
                      code={CODE.widgetAuthUser}
                      language="html"
                      copyId="widget-auth"
                      copied={copied}
                      onCopy={copyToClipboard}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200 dark:border-secondary-800 space-y-1">
                        <p className="text-[12px] font-semibold text-secondary-700 dark:text-secondary-300 font-mono">
                          user object
                        </p>
                        <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                          Pass verified user identity (name, email, plan). Requires an <InlineCode>id</InlineCode> field. Skips the pre-chat form automatically.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200 dark:border-secondary-800 space-y-1">
                        <p className="text-[12px] font-semibold text-secondary-700 dark:text-secondary-300 font-mono">
                          context object
                        </p>
                        <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                          Pass account data (orders, billing, subscription). The chatbot can answer "Where's my order?" or "When does my plan renew?" using the values you provide.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>

            <SectionDivider />

            {/* ════════════════════════
                REST API
            ════════════════════════ */}
            <section id="rest-api" className="scroll-mt-28 py-14 space-y-8">
              <div>
                <SectionLabel accent="text-emerald-600 dark:text-emerald-500">REST API</SectionLabel>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-1">
                  Chat Endpoint
                </h2>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400">
                  Build custom chat UIs, backend integrations, or mobile apps.
                </p>
              </div>

              {/* Endpoint display */}
              <div id="chat-endpoint" className="scroll-mt-28">
                <div className="flex items-stretch gap-0 rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-800 shadow-sm">
                  <div className="flex items-center gap-3 px-4 bg-secondary-50 dark:bg-secondary-900/60 border-r border-secondary-200 dark:border-secondary-800">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold font-mono tracking-wide">
                      POST
                    </span>
                  </div>
                  <code className="flex-1 px-4 py-3.5 text-[13px] font-mono text-secondary-800 dark:text-secondary-200 bg-white dark:bg-secondary-950 truncate">
                    https://vocui.com/api/chat/CHATBOT_ID
                  </code>
                  <button
                    onClick={() => copyToClipboard('https://vocui.com/api/chat/CHATBOT_ID', 'endpoint-url')}
                    className="px-3.5 bg-secondary-50 dark:bg-secondary-900/60 border-l border-secondary-200 dark:border-secondary-800 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
                    aria-label="Copy endpoint URL"
                  >
                    {copied === 'endpoint-url' ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Language tabs */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <MethodTab
                    active={apiMethod === 'curl'}
                    onClick={() => setApiMethod('curl')}
                    icon={Terminal}
                    label="cURL"
                    accent="emerald"
                  />
                  <MethodTab
                    active={apiMethod === 'javascript'}
                    onClick={() => setApiMethod('javascript')}
                    icon={FileCode}
                    label="JavaScript"
                    accent="emerald"
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
                    <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
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
                    <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                      Use in Node.js or browser environments with the Fetch API.
                    </p>
                  </div>
                )}
              </div>

              {/* Request body */}
              <div className="space-y-3">
                <p className="text-[13px] font-semibold text-secondary-700 dark:text-secondary-300">
                  Request Body
                </p>
                <ParamTable
                  rows={[
                    { field: 'message',    type: 'string', required: true,  desc: 'The user message to send to the chatbot.' },
                    { field: 'session_id', type: 'string', required: false, desc: 'A stable identifier to group messages into a conversation. If omitted, a new session is created.' },
                  ]}
                />
              </div>

              <ApiKeyBanner />
            </section>

            <SectionDivider />

            {/* ════════════════════════
                AGENT CONSOLE
            ════════════════════════ */}
            <section id="agent-console" className="scroll-mt-28 py-14 space-y-8">
              <div>
                <SectionLabel accent="text-orange-600 dark:text-orange-500">Agent Console</SectionLabel>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-1">
                  Embed the Agent Console
                </h2>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400">
                  Embed a live agent console so your team can manage handoff conversations.
                </p>
              </div>

              {/* Method selector */}
              <div className="flex flex-wrap gap-2">
                <MethodTab
                  active={agentMethod === 'quick'}
                  onClick={() => setAgentMethod('quick')}
                  icon={Zap}
                  label="Quick Embed"
                  accent="orange"
                />
                <MethodTab
                  active={agentMethod === 'agent-manual'}
                  onClick={() => setAgentMethod('agent-manual')}
                  icon={Code}
                  label="Manual Init"
                  accent="orange"
                />
                <MethodTab
                  active={agentMethod === 'agent-iframe'}
                  onClick={() => setAgentMethod('agent-iframe')}
                  icon={Globe}
                  label="iFrame"
                  accent="orange"
                />
              </div>

              {agentMethod === 'quick' && (
                <div id="agent-quick" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.agentQuick}
                    language="html"
                    copyId="agent-quick"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Full-page console. Add <InlineCode>data-position=&quot;sidebar&quot;</InlineCode> for a fixed sidebar instead.
                  </p>
                </div>
              )}

              {agentMethod === 'agent-manual' && (
                <div id="agent-manual" className="scroll-mt-28 space-y-5">
                  <CodeBlock
                    code={CODE.agentManual}
                    language="html"
                    copyId="agent-manual"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Load the SDK separately and mount into a specific container element.
                  </p>
                  <div className="space-y-3">
                    <p className="text-[13px] font-semibold text-secondary-700 dark:text-secondary-300">
                      Configuration Options
                    </p>
                    <ConfigTable
                      rows={[
                        { opt: 'chatbotId',  type: 'string',           desc: 'Required. Your chatbot ID.' },
                        { opt: 'apiKey',     type: 'string',           desc: 'Required. Your API key for authentication.' },
                        { opt: 'position',   type: 'string',           desc: '"full" (default) fills the container. "sidebar" docks a 420px panel to the right.' },
                        { opt: 'container',  type: 'string | Element', desc: 'CSS selector or DOM element to mount into. Only used in "full" mode.' },
                      ]}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200 dark:border-secondary-800 space-y-1">
                      <p className="text-[12px] font-semibold text-secondary-700 dark:text-secondary-300 font-mono">position: full</p>
                      <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                        Fills the parent container or viewport. Use <InlineCode>container</InlineCode> to mount into a specific element.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200 dark:border-secondary-800 space-y-1">
                      <p className="text-[12px] font-semibold text-secondary-700 dark:text-secondary-300 font-mono">position: sidebar</p>
                      <p className="text-[12px] text-secondary-500 dark:text-secondary-400">
                        Fixed 420px sidebar docked to the right edge. Great for internal support dashboards.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {agentMethod === 'agent-iframe' && (
                <div id="agent-iframe" className="scroll-mt-28 space-y-3">
                  <CodeBlock
                    code={CODE.agentIframe}
                    language="html"
                    copyId="agent-iframe"
                    copied={copied}
                    onCopy={copyToClipboard}
                  />
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    The API key is passed via the URL hash fragment (<InlineCode>#key=...</InlineCode>) so it is not sent to the server in the request.
                  </p>
                </div>
              )}

              <ApiKeyBanner />
            </section>

            <SectionDivider />

            {/* ════════════════════════
                WEBHOOKS
            ════════════════════════ */}
            <section id="webhooks" className="scroll-mt-28 py-14 space-y-10">
              <div>
                <SectionLabel accent="text-violet-600 dark:text-violet-400">Webhooks</SectionLabel>
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50 mb-1">
                  Real-time Event Notifications
                </h2>
                <p className="text-[15px] text-secondary-500 dark:text-secondary-400">
                  Receive real-time HTTP notifications when events happen in your chatbots.
                </p>
              </div>

              {/* Signature verification */}
              <div id="webhook-verification" className="scroll-mt-28 space-y-6">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-violet-500" />
                  <h3 className="text-[15px] font-semibold text-secondary-900 dark:text-secondary-100">
                    Signature Verification
                  </h3>
                </div>

                <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                  Each request includes three headers. Compute{' '}
                  <InlineCode>{'HMAC-SHA256(timestamp + "." + body, secret)'}</InlineCode>{' '}
                  and compare the hex digest against{' '}
                  <InlineCode>X-Webhook-Signature</InlineCode>. Reject requests where the timestamp is more than 5 minutes old.
                </p>

                {/* Header grid — visual treatment instead of a table */}
                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    { header: 'X-Webhook-Signature', desc: 'HMAC-SHA256 hex digest', icon: Shield },
                    { header: 'X-Webhook-Timestamp', desc: 'Unix epoch seconds',     icon: Terminal },
                    { header: 'X-Webhook-Event',     desc: 'Event name, e.g. lead.captured', icon: Webhook },
                  ].map(({ header, desc }) => (
                    <div
                      key={header}
                      className="p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/60 border border-secondary-200 dark:border-secondary-800 space-y-1.5"
                    >
                      <code className="text-[12px] font-mono font-semibold text-violet-700 dark:text-violet-300 break-all">
                        {header}
                      </code>
                      <p className="text-[12px] text-secondary-500 dark:text-secondary-400">{desc}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <p className="text-[13px] font-semibold text-secondary-700 dark:text-secondary-300">
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
              </div>

              {/* Event types */}
              <div id="webhook-events" className="scroll-mt-28 space-y-5">
                <div>
                  <h3 className="text-[15px] font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
                    Event Types
                  </h3>
                  <p className="text-[13px] text-secondary-500 dark:text-secondary-400">
                    Subscribe to specific events or leave empty to receive all events.
                  </p>
                </div>

                <div className="rounded-xl border border-secondary-200 dark:border-secondary-800 overflow-hidden">
                  {WEBHOOK_EVENTS.map(({ event, desc }, i) => (
                    <div
                      key={event}
                      className={cn(
                        'flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 px-5 py-3.5',
                        i < WEBHOOK_EVENTS.length - 1 && 'border-b border-secondary-100 dark:border-secondary-800/60'
                      )}
                    >
                      <code className="shrink-0 text-[12px] font-mono font-medium px-2.5 py-1 rounded-md bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-100 dark:border-violet-800/40">
                        {event}
                      </code>
                      <span className="text-[13px] text-secondary-500 dark:text-secondary-400">{desc}</span>
                    </div>
                  ))}
                </div>

                {/* Warning */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50">
                  <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[13px] font-semibold text-amber-900 dark:text-amber-100 mb-0.5">
                      Save your webhook secret
                    </p>
                    <p className="text-[13px] text-amber-700 dark:text-amber-300">
                      The secret is shown only once when you create a webhook. Store it securely — you will need it to verify signatures on every incoming request.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-start">
                  <Button asChild variant="outline">
                    <Link href="/dashboard/webhooks" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Manage Webhooks
                    </Link>
                  </Button>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <div
        className="w-full py-20 lg:py-28"
        style={{
          background: 'linear-gradient(135deg, rgb(2,132,199) 0%, rgb(8,47,73) 100%)',
        }}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary-300/80 mb-4">
            Ready to integrate
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-5 tracking-tight">
            Your integration starts here.
          </h2>
          <p className="text-lg text-white/60 mb-10 leading-relaxed">
            Create your chatbot, drop in the embed snippet, and start handling real conversations. Free account, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 px-8 font-semibold"
              asChild
            >
              <Link href="/signup">Start Building Free</Link>
            </Button>
            <Button size="lg" variant="outline-light" asChild>
              <Link href="/pricing">See Plans</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
