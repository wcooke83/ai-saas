// ─── Blog Process Visuals ──────────────────────────────────────────────────────
// Inline React visual components for how-to guide blog posts.
// Pure React + Tailwind CSS. No external chart libraries.

// ─── SVG Icons ─────────────────────────────────────────────────────────────────

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
}

function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" y1="9" x2="15" y2="9" />
      <line x1="9" y1="13" x2="13" y2="13" />
    </svg>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CodeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  );
}

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface StepFlowStep {
  /** Step number displayed inside the circle */
  number: number;
  /** Short title shown below the circle */
  title: string;
  /** Optional one-line description */
  description?: string;
}

export interface StepFlowProps {
  steps: StepFlowStep[];
  /** Optional caption rendered as a figcaption */
  caption?: string;
}

export interface ComparisonScorecardItem {
  /** The feature being compared */
  feature: string;
  /** Score for the first option (0-10) */
  score1: number;
  /** Score for the second option (0-10) */
  score2: number;
  /** Label for the first option */
  label1: string;
  /** Label for the second option */
  label2: string;
}

export interface ComparisonScorecardProps {
  items: ComparisonScorecardItem[];
  /** Optional caption rendered as a figcaption */
  caption?: string;
}

// ─── 1. StepFlow ───────────────────────────────────────────────────────────────

/**
 * A numbered step process visualization.
 * Horizontal on md+ screens, vertical stack on mobile.
 */
export function StepFlow({ steps, caption }: StepFlowProps) {
  return (
    <figure className="my-8" role="img" aria-label={`Step-by-step process with ${steps.length} steps: ${steps.map((s) => s.title).join(', ')}`}>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex items-start justify-between gap-0">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start flex-1">
            {/* Step circle + content */}
            <div className="flex flex-col items-center text-center flex-1">
              <div className="w-12 h-12 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-lg font-bold shrink-0">
                {step.number}
              </div>
              <p className="mt-2 text-sm font-semibold text-secondary-900 dark:text-secondary-100 leading-tight">
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 leading-snug max-w-[140px]">
                  {step.description}
                </p>
              )}
            </div>
            {/* Connector arrow (not after last step) */}
            {i < steps.length - 1 && (
              <div className="flex items-center pt-5 shrink-0 -mx-1" aria-hidden="true">
                <div className="w-8 h-0.5 bg-primary-300 dark:bg-primary-700" />
                <ArrowRightIcon className="w-4 h-4 text-primary-400 dark:text-primary-600 -ml-1" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="flex md:hidden flex-col gap-0">
        {steps.map((step, i) => (
          <div key={step.number} className="flex items-start gap-4">
            {/* Left rail: circle + connector */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 text-white flex items-center justify-center text-base font-bold">
                {step.number}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 h-8 bg-primary-200 dark:bg-primary-800 mt-1" aria-hidden="true" />
              )}
            </div>
            {/* Right content */}
            <div className="pt-2 pb-4">
              <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 leading-tight">
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-xs text-secondary-500 dark:text-secondary-400 leading-snug">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 text-center text-xs text-secondary-400 dark:text-secondary-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── 2. KnowledgeSourceCards ───────────────────────────────────────────────────

/**
 * A card grid showing the three knowledge source types:
 * URL, PDF/Document, and Q&A pairs.
 */
export function KnowledgeSourceCards({ caption }: { caption?: string }) {
  const sources = [
    {
      icon: GlobeIcon,
      title: 'Website URL',
      description: 'Paste a web page address and VocUI scrapes the content automatically.',
    },
    {
      icon: DocumentIcon,
      title: 'PDF / Document',
      description: 'Upload PDFs or DOCX files — product manuals, guides, or reference docs.',
    },
    {
      icon: ChatBubbleIcon,
      title: 'Q&A Pairs',
      description: 'Type questions and answers directly for precise, targeted responses.',
    },
  ];

  return (
    <figure className="my-8" role="img" aria-label="Three knowledge source types: Website URL, PDF or Document, and Q&A Pairs">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sources.map((source) => (
          <div
            key={source.title}
            className="rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/40 p-5 text-center"
          >
            <div className="mx-auto w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-3">
              <source.icon className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100 mb-1">
              {source.title}
            </p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400 leading-snug">
              {source.description}
            </p>
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-secondary-400 dark:text-secondary-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── 3. EmbedCodeVisual ────────────────────────────────────────────────────────

/**
 * A before/after diagram showing the embed code copy-paste flow
 * from VocUI Dashboard to a website.
 */
export function EmbedCodeVisual({ caption }: { caption?: string }) {
  return (
    <figure className="my-8" role="img" aria-label="Diagram showing embed code copied from VocUI Dashboard Deploy tab and pasted into your website HTML">
      <div className="flex flex-col sm:flex-row items-stretch gap-4 sm:gap-0">
        {/* Left: VocUI Dashboard */}
        <div className="flex-1 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <LayoutIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">
              VocUI Dashboard
            </span>
          </div>
          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            Deploy Tab
          </p>
          <div className="rounded-lg bg-secondary-900 dark:bg-secondary-950 px-3 py-2">
            <code className="text-[11px] text-green-400 font-mono break-all">
              {'<script src="vocui.com/widget.js" ...>'}
            </code>
          </div>
        </div>

        {/* Arrow connector */}
        <div className="flex items-center justify-center shrink-0 sm:px-3" aria-hidden="true">
          {/* Horizontal arrow on sm+ */}
          <div className="hidden sm:flex flex-col items-center gap-1">
            <span className="text-[10px] font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wider">
              copy
            </span>
            <ArrowRightIcon className="w-6 h-6 text-primary-400 dark:text-primary-500" />
          </div>
          {/* Vertical arrow on mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <svg className="w-5 h-5 text-primary-400 dark:text-primary-500 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span className="text-[10px] font-medium text-primary-500 dark:text-primary-400 uppercase tracking-wider">
              copy &amp; paste
            </span>
          </div>
        </div>

        {/* Right: Your Website */}
        <div className="flex-1 rounded-xl border border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/40 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CodeIcon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            <span className="text-xs font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">
              Your Website
            </span>
          </div>
          <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100 mb-2">
            HTML &lt;head&gt; or &lt;body&gt;
          </p>
          <div className="rounded-lg bg-secondary-900 dark:bg-secondary-950 px-3 py-2">
            <code className="text-[11px] text-green-400 font-mono break-all">
              {'<script src="vocui.com/widget.js" ...>'}
            </code>
          </div>
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-secondary-400 dark:text-secondary-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── 4. ChatbotSetupTimeline ───────────────────────────────────────────────────

/**
 * A horizontal timeline showing chatbot setup milestones over ~15 minutes.
 */
export function ChatbotSetupTimeline({ caption }: { caption?: string }) {
  const milestones = [
    { time: '0 min', label: 'Create bot', position: 0 },
    { time: '5 min', label: 'Add content', position: 33.3 },
    { time: '10 min', label: 'Test & deploy', position: 66.6 },
    { time: '15 min', label: 'Live!', position: 100 },
  ];

  return (
    <figure className="my-8" role="img" aria-label="Timeline showing chatbot setup takes approximately 15 minutes: create bot at 0 minutes, add content at 5 minutes, test and deploy at 10 minutes, live at 15 minutes">
      <div className="px-2">
        {/* Track */}
        <div className="relative h-3 rounded-full bg-secondary-200 dark:bg-secondary-700 mt-6 mb-8">
          {/* Filled portion */}
          <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-500" />

          {/* Milestone markers */}
          {milestones.map((m) => (
            <div
              key={m.time}
              className="absolute top-1/2 -translate-y-1/2"
              style={{ left: `${m.position}%` }}
            >
              {/* Dot */}
              <div className="w-5 h-5 -ml-2.5 rounded-full bg-white dark:bg-secondary-900 border-[3px] border-primary-600 dark:border-primary-400 flex items-center justify-center">
                {m.position === 100 && (
                  <CheckIcon className="w-2.5 h-2.5 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              {/* Label above */}
              <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-[10px] font-medium text-secondary-500 dark:text-secondary-400">
                  {m.time}
                </span>
              </div>
              {/* Label below */}
              <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium text-secondary-700 dark:text-secondary-300">
                  {m.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-6 text-center text-xs text-secondary-400 dark:text-secondary-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ─── 5. ComparisonScorecard ────────────────────────────────────────────────────

/**
 * A visual feature comparison showing side-by-side score bars.
 */
export function ComparisonScorecard({ items, caption }: ComparisonScorecardProps) {
  return (
    <figure className="my-8" role="img" aria-label={`Feature comparison scorecard: ${items.map((i) => i.feature).join(', ')}`}>
      <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden">
        {/* Header row */}
        <div className="grid grid-cols-[1fr_1fr] sm:grid-cols-[1fr_1fr] bg-secondary-50 dark:bg-secondary-800/60 px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
          <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300">
            {items[0]?.label1 ?? 'Option A'}
          </span>
          <span className="text-sm font-semibold text-secondary-700 dark:text-secondary-300 text-right sm:text-left">
            {items[0]?.label2 ?? 'Option B'}
          </span>
        </div>

        {/* Rows */}
        <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
          {items.map((item) => {
            const score1Wins = item.score1 >= item.score2;
            const score2Wins = item.score2 > item.score1;
            const score1Color = score1Wins ? 'bg-primary-500 dark:bg-primary-400' : 'bg-secondary-400 dark:bg-secondary-500';
            const score2Color = score2Wins ? 'bg-primary-500 dark:bg-primary-400' : 'bg-secondary-400 dark:bg-secondary-500';
            const score1TextColor = score1Wins ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400';
            const score2TextColor = score2Wins ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-500 dark:text-secondary-400';

            return (
            <div key={item.feature} className="px-4 py-4">
              {/* Feature label */}
              <p className="text-xs font-medium text-secondary-500 dark:text-secondary-400 mb-2 uppercase tracking-wide">
                {item.feature}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Score 1 */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score1Color} transition-all`}
                        style={{ width: `${(item.score1 / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${score1TextColor} tabular-nums w-10 text-right`}>
                      {item.score1}/10
                    </span>
                  </div>
                </div>

                {/* Score 2 */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-2.5 rounded-full bg-secondary-200 dark:bg-secondary-700 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score2Color} transition-all`}
                        style={{ width: `${(item.score2 / 10) * 100}%` }}
                      />
                    </div>
                    <span className={`text-xs font-semibold ${score2TextColor} tabular-nums w-10 text-right`}>
                      {item.score2}/10
                    </span>
                  </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-secondary-400 dark:text-secondary-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
