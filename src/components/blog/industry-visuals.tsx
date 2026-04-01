// ─── Industry Visual Components ─────────────────────────────────────────────
// Shared visual components for industry use-case blog posts.
// Pure React + Tailwind CSS. No external dependencies.

// ─── Types ────────────────────────────────────────────────────────────────────

/** A single message in a chat conversation preview. */
export interface ChatMessage {
  /** Whether the message is from the user or the bot. */
  role: 'user' | 'bot';
  /** The text content of the message. */
  text: string;
}

/** Props for the ChatPreview component. */
export interface ChatPreviewProps {
  /** Array of messages to display in the chat preview. */
  messages: ChatMessage[];
  /** Name displayed in the chat header. Defaults to "VocUI Bot". */
  botName?: string;
  /** Industry label shown as a subtitle in the header. */
  industry?: string;
}

/** A single stat displayed in the IndustryStatBar. */
export interface IndustryStat {
  /** The primary metric value, e.g. "67%" or "24/7". */
  value: string;
  /** A short label describing the metric. */
  label: string;
}

/** Props for the IndustryStatBar component. */
export interface IndustryStatBarProps {
  /** Array of 2-4 stats to display. */
  stats: IndustryStat[];
}

/** A single step in a workflow diagram. */
export interface WorkflowStep {
  /** Text label for this step. */
  label: string;
  /** When true, the step is highlighted as chatbot-assisted. */
  highlight?: boolean;
}

/** Props for the WorkflowDiagram component. */
export interface WorkflowDiagramProps {
  /** Title displayed above the workflow. */
  title: string;
  /** Array of workflow steps to render vertically. */
  steps: WorkflowStep[];
}

// ─── ChatPreview ──────────────────────────────────────────────────────────────

/**
 * A mock chat widget preview showing an example conversation.
 * Renders bot messages on the left with an avatar, user messages on the right.
 */
export function ChatPreview({ messages, botName = 'VocUI Bot', industry }: ChatPreviewProps) {
  const initials = botName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <figure className="my-8" role="img" aria-label={`Example chatbot conversation${industry ? ` for ${industry}` : ''}`}>
      <div className="rounded-2xl border border-secondary-200 dark:border-secondary-700 shadow-lg overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="bg-primary-600 dark:bg-primary-700 px-4 py-3 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{botName}</p>
            {industry && (
              <p className="text-xs text-white/70 truncate">{industry}</p>
            )}
          </div>
          <div className="ml-auto flex items-center gap-1" aria-hidden="true">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-white/70">Online</span>
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white dark:bg-secondary-900 px-4 py-4 space-y-3 min-h-[120px]">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div
                  className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-[10px] font-bold text-primary-700 dark:text-primary-300 mr-2 mt-1 flex-shrink-0"
                  aria-hidden="true"
                >
                  {initials}
                </div>
              )}
              <div
                className={`rounded-2xl px-3.5 py-2.5 max-w-[78%] ${
                  msg.role === 'user'
                    ? 'bg-primary-600 dark:bg-primary-700 text-white rounded-tr-sm'
                    : 'bg-secondary-100 dark:bg-secondary-800 text-secondary-800 dark:text-secondary-200 rounded-tl-sm'
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div className="bg-secondary-50 dark:bg-secondary-800/60 border-t border-secondary-200 dark:border-secondary-700 px-4 py-3 flex items-center gap-2">
          <div className="flex-1 bg-white dark:bg-secondary-900 border border-secondary-200 dark:border-secondary-700 rounded-full px-4 py-2 text-sm text-secondary-400 dark:text-secondary-500">
            Type a message...
          </div>
          <div
            className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-700 flex items-center justify-center flex-shrink-0"
            aria-hidden="true"
          >
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
      <figcaption className="text-center text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Example conversation powered by VocUI
      </figcaption>
    </figure>
  );
}

// ─── IndustryStatBar ──────────────────────────────────────────────────────────

/**
 * A compact stat bar showing 2-4 industry-relevant metrics in a row.
 */
export function IndustryStatBar({ stats }: IndustryStatBarProps) {
  return (
    <figure className="my-8" role="img" aria-label="Key industry metrics">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-secondary-200 dark:bg-secondary-700 rounded-xl overflow-hidden border border-secondary-200 dark:border-secondary-700">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white dark:bg-secondary-900 px-4 py-5 text-center ${
              stats.length === 3 && i === 2 ? 'col-span-2 sm:col-span-1' : ''
            }`}
          >
            <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm text-secondary-500 dark:text-secondary-400 mt-1 leading-tight">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </figure>
  );
}

// ─── WorkflowDiagram ──────────────────────────────────────────────────────────

/**
 * A vertical workflow diagram showing how a chatbot fits into an industry process.
 * Highlighted steps are styled as chatbot-assisted.
 */
export function WorkflowDiagram({ title, steps }: WorkflowDiagramProps) {
  return (
    <figure className="my-8" role="img" aria-label={title}>
      <div className="rounded-xl border border-secondary-200 dark:border-secondary-700 overflow-hidden max-w-md mx-auto">
        {/* Header */}
        <div className="bg-secondary-50 dark:bg-secondary-800/60 px-5 py-3 border-b border-secondary-200 dark:border-secondary-700">
          <p className="text-sm font-semibold text-secondary-900 dark:text-secondary-100">{title}</p>
        </div>

        {/* Steps */}
        <div className="bg-white dark:bg-secondary-900 px-5 py-5">
          <div className="relative">
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  {/* Connector line */}
                  {!isLast && (
                    <div
                      className="absolute left-[11px] top-6 w-0.5 h-full bg-secondary-200 dark:bg-secondary-700"
                      aria-hidden="true"
                    />
                  )}

                  {/* Node */}
                  <div
                    className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      step.highlight
                        ? 'bg-primary-600 dark:bg-primary-700'
                        : 'bg-secondary-300 dark:bg-secondary-600'
                    }`}
                    aria-hidden="true"
                  >
                    {step.highlight ? (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-[10px] font-bold text-white">{i + 1}</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                    <p
                      className={`text-sm leading-snug ${
                        step.highlight
                          ? 'font-semibold text-primary-700 dark:text-primary-300'
                          : 'text-secondary-700 dark:text-secondary-300'
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.highlight && (
                      <span className="inline-block mt-1 text-[10px] font-medium uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-full">
                        Chatbot-assisted
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <figcaption className="text-center text-xs text-secondary-400 dark:text-secondary-500 mt-3">
        Steps marked as chatbot-assisted are handled automatically by VocUI
      </figcaption>
    </figure>
  );
}
