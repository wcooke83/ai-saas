// ─── Blog Chart Components ─────────────────────────────────────────────────────
// Pure React + Tailwind inline chart visualizations for data-driven blog posts.
// No charting library dependencies. All components are server-safe (no hooks/state).

// ─── Shared wrapper ────────────────────────────────────────────────────────────

const chartWrapper =
  'my-8 p-6 bg-secondary-50 dark:bg-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700';

// ─── 1. CostComparisonBar ──────────────────────────────────────────────────────

/** Horizontal bar chart comparing human vs AI support cost per ticket. */
export function CostComparisonBar() {
  return (
    <figure className={chartWrapper} role="img" aria-label="Cost comparison: human support tickets cost $6 to $15 each while AI chatbot interactions cost $0.50 to $0.70 each, saving up to 95% per interaction.">
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        Cost Per Interaction: Human Support vs AI Chatbot
      </figcaption>

      <div className="space-y-4">
        {/* Human cost bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary-700 dark:text-secondary-300 font-medium">Human support</span>
            <span className="font-bold text-red-600 dark:text-red-400">$6 &ndash; $15 per ticket</span>
          </div>
          <div className="h-8 rounded-md bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-red-400 to-red-600 dark:from-red-500 dark:to-red-700 flex items-center justify-end pr-3"
              style={{ width: '100%' }}
            >
              <span className="text-xs font-semibold text-white">$15</span>
            </div>
          </div>
        </div>

        {/* AI cost bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary-700 dark:text-secondary-300 font-medium">AI chatbot</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">$0.50 &ndash; $0.70 per interaction</span>
          </div>
          <div className="h-8 rounded-md bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-end pr-3"
              style={{ width: '5%', minWidth: '2.5rem' }}
            >
              <span className="text-xs font-semibold text-white">$0.70</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings annotation */}
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          Up to 95% savings per interaction with AI
        </p>
      </div>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Source: DemandSage chatbot statistics, 2024
      </p>
    </figure>
  );
}

// ─── 2. StatHighlightGrid ──────────────────────────────────────────────────────

interface StatItem {
  /** The headline number or percentage, e.g. "30%" */
  value: string;
  /** Short description beneath the number */
  label: string;
  /** Optional Tailwind text-color class for the value, e.g. "text-primary-600" */
  color?: string;
}

interface StatHighlightGridProps {
  stats: StatItem[];
  caption?: string;
}

/** A responsive grid of large stat cards. Accepts 4-6 items. */
export function StatHighlightGrid({ stats, caption }: StatHighlightGridProps) {
  return (
    <figure
      className={chartWrapper}
      role="img"
      aria-label={`Key statistics: ${stats.map((s) => `${s.value} ${s.label}`).join(', ')}.`}
    >
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        {caption ?? 'Key AI Customer Service Statistics'}
      </figcaption>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.value + stat.label}
            className="rounded-lg border border-secondary-200 dark:border-secondary-600 bg-white dark:bg-secondary-800/60 p-4 text-center"
          >
            <p
              className={`text-3xl sm:text-4xl font-extrabold leading-none mb-1.5 ${stat.color ?? 'text-primary-600 dark:text-primary-400'}`}
            >
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-secondary-600 dark:text-secondary-400 leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Sources: IBM, Tidio, HubSpot, Freshworks, DemandSage
      </p>
    </figure>
  );
}

// ─── 3. ROICalculatorVisual ────────────────────────────────────────────────────

/** A calculator-style visualization of the chatbot ROI formula with an example. */
export function ROICalculatorVisual() {
  return (
    <figure
      className={chartWrapper}
      role="img"
      aria-label="ROI formula: monthly tickets times deflection rate times cost per ticket equals monthly savings. Example: 1,000 tickets times 40% deflection times $12 per ticket equals $4,800 per month in savings."
    >
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        Chatbot ROI Formula
      </figcaption>

      {/* Formula */}
      <div className="rounded-lg border-2 border-dashed border-secondary-300 dark:border-secondary-600 bg-white dark:bg-secondary-800/60 p-5 sm:p-6">
        <p className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-wider font-medium mb-3">
          Formula
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm sm:text-base text-secondary-800 dark:text-secondary-200">
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded font-semibold">Monthly&nbsp;Tickets</span>
          <span className="text-secondary-400">&times;</span>
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded font-semibold">Deflection&nbsp;Rate</span>
          <span className="text-secondary-400">&times;</span>
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded font-semibold">Cost&nbsp;Per&nbsp;Ticket</span>
          <span className="text-secondary-400">=</span>
          <span className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded font-bold">Monthly&nbsp;Savings</span>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-200 dark:border-secondary-600 my-4" />

        {/* Example */}
        <p className="text-sm text-secondary-500 dark:text-secondary-400 uppercase tracking-wider font-medium mb-3">
          Example
        </p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-sm sm:text-base text-secondary-800 dark:text-secondary-200">
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">1,000</span>
          <span className="text-secondary-400">&times;</span>
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">40%</span>
          <span className="text-secondary-400">&times;</span>
          <span className="bg-primary-50 dark:bg-primary-900/30 px-2 py-1 rounded">$12</span>
          <span className="text-secondary-400">=</span>
          <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-3 py-1.5 rounded-lg font-bold text-base sm:text-lg">
            $4,800/month
          </span>
        </div>
      </div>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Subtract your chatbot subscription cost for net monthly savings.
      </p>
    </figure>
  );
}

// ─── 4. ConversionFunnelChart ──────────────────────────────────────────────────

const funnelSteps = [
  { label: 'Website Visitors', pct: 100, color: 'bg-primary-200 dark:bg-primary-800' },
  { label: 'Widget Seen', pct: 40, color: 'bg-primary-300 dark:bg-primary-700' },
  { label: 'Conversation Started', pct: 12, color: 'bg-primary-400 dark:bg-primary-600' },
  { label: 'Lead Captured', pct: 5, color: 'bg-primary-500 dark:bg-primary-500' },
  { label: 'Converted', pct: 2, color: 'bg-primary-700 dark:bg-primary-400' },
] as const;

/** A horizontal funnel chart showing the chatbot conversion funnel. */
export function ConversionFunnelChart() {
  return (
    <figure
      className={chartWrapper}
      role="img"
      aria-label="Chatbot conversion funnel: 100% website visitors, 40% widget seen, 12% conversation started, 5% lead captured, 2% converted."
    >
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        Chatbot Conversion Funnel
      </figcaption>

      <div className="space-y-3">
        {funnelSteps.map((step) => (
          <div key={step.label} className="flex items-center gap-3">
            <span className="w-[130px] sm:w-[160px] shrink-0 text-xs sm:text-sm text-secondary-700 dark:text-secondary-300 text-right font-medium">
              {step.label}
            </span>
            <div className="flex-1 h-7 rounded bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
              <div
                className={`h-full rounded ${step.color} flex items-center px-2.5 transition-all`}
                style={{ width: `${step.pct}%`, minWidth: '2rem' }}
              >
                <span className="text-xs font-bold text-white dark:text-white drop-shadow-sm">
                  {step.pct}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-3 italic">
        Example funnel — actual rates vary by industry, traffic source, and implementation.
      </p>
    </figure>
  );
}

// ─── 5. LeadResponseTimeChart ──────────────────────────────────────────────────

const responseRows = [
  { time: '< 5 minutes', multiplier: '21x', pct: 100, color: 'bg-emerald-500 dark:bg-emerald-500' },
  { time: '5 - 30 minutes', multiplier: '4x', pct: 19, color: 'bg-yellow-500 dark:bg-yellow-500' },
  { time: '30 - 60 minutes', multiplier: '2x', pct: 10, color: 'bg-orange-500 dark:bg-orange-500' },
  { time: '> 60 minutes', multiplier: '1x', pct: 5, color: 'bg-red-500 dark:bg-red-500' },
] as const;

/** Horizontal bars showing how lead response time affects conversion (21x at 5 min). */
export function LeadResponseTimeChart() {
  return (
    <figure
      className={chartWrapper}
      role="img"
      aria-label="Lead response time impact: responding in under 5 minutes qualifies leads 21 times better than waiting 30 minutes. Faster response equals dramatically higher conversion."
    >
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        Response Time vs Lead Qualification (Conversion Multiplier)
      </figcaption>

      <div className="space-y-3">
        {responseRows.map((row) => (
          <div key={row.time} className="flex items-center gap-3">
            <span className="w-[110px] sm:w-[130px] shrink-0 text-xs sm:text-sm text-secondary-700 dark:text-secondary-300 text-right font-medium">
              {row.time}
            </span>
            <div className="flex-1 h-7 rounded bg-secondary-100 dark:bg-secondary-700 overflow-hidden">
              <div
                className={`h-full rounded ${row.color} flex items-center px-2.5 transition-all`}
                style={{ width: `${row.pct}%`, minWidth: '1rem' }}
              >
                <span className="text-xs font-bold text-white drop-shadow-sm">{row.multiplier}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Source: MIT/InsideSales.com Lead Response Management Study. Chatbots respond in under 5 seconds.
      </p>
    </figure>
  );
}

// ─── 6. OnboardingTimeComparison ───────────────────────────────────────────────

/** Before/after horizontal bar comparing traditional vs AI-assisted onboarding. */
export function OnboardingTimeComparison() {
  return (
    <figure
      className={chartWrapper}
      role="img"
      aria-label="Onboarding time comparison: traditional onboarding takes approximately 12 weeks while AI-assisted onboarding takes approximately 7 weeks, a 40% reduction."
    >
      <figcaption className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-5">
        Time to Productivity: Traditional vs AI-Assisted Onboarding
      </figcaption>

      <div className="space-y-4">
        {/* Traditional bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary-700 dark:text-secondary-300 font-medium">Traditional onboarding</span>
            <span className="font-bold text-secondary-800 dark:text-secondary-200">~12 weeks</span>
          </div>
          <div className="h-8 rounded-md bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-secondary-400 to-secondary-500 dark:from-secondary-500 dark:to-secondary-600 flex items-center justify-end pr-3"
              style={{ width: '100%' }}
            >
              <span className="text-xs font-semibold text-white">12 weeks</span>
            </div>
          </div>
        </div>

        {/* AI-assisted bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-secondary-700 dark:text-secondary-300 font-medium">With AI knowledge bot</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">~7 weeks</span>
          </div>
          <div className="h-8 rounded-md bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
            <div
              className="h-full rounded-md bg-gradient-to-r from-emerald-400 to-emerald-600 dark:from-emerald-500 dark:to-emerald-700 flex items-center justify-end pr-3"
              style={{ width: '58%' }}
            >
              <span className="text-xs font-semibold text-white">7 weeks</span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings annotation */}
      <div className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3">
        <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
          40% faster time-to-productivity with an AI knowledge bot
        </p>
      </div>

      <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Source: SuperAGI, AI onboarding case studies, 2025
      </p>
    </figure>
  );
}
