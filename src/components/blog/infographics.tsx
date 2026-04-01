// ─── Blog Infographic Components ──────────────────────────────────────────────
// Shareable, screenshot-friendly visual cards for blog posts.
// Pure React + Tailwind. Server-safe (no hooks/state). Dark gradient background
// with white text — works in both light and dark mode. Optimized for ~600px width
// (the blog content column). Branded with VocUI at top, vocui.com at bottom.

// ─── Shared ───────────────────────────────────────────────────────────────────

/** VocUI logo mark for infographic headers. */
function BrandMark() {
  return (
    <div className="flex items-center gap-2 mb-6">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M12 2L21.5 7.5V16.5L12 22L2.5 16.5V7.5L12 2Z"
          fill="currentColor"
          className="text-primary-400"
          opacity="0.9"
        />
        <path
          d="M12 6L17.5 9V15L12 18L6.5 15V9L12 6Z"
          fill="currentColor"
          className="text-primary-300"
          opacity="0.6"
        />
      </svg>
      <span className="text-sm font-semibold tracking-wide text-white/70">
        VocUI
      </span>
    </div>
  );
}

/** Footer with vocui.com branding. */
function BrandFooter() {
  return (
    <div className="mt-8 pt-4 border-t border-white/10">
      <p className="text-xs text-white/55 tracking-wide">vocui.com</p>
    </div>
  );
}

/** Wrapper card with dark gradient and figure semantics. */
function InfographicCard({
  children,
  ariaLabel,
  className = '',
}: {
  children: React.ReactNode;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <figure
      className={`my-14 md:my-16 rounded-2xl bg-gradient-to-br from-primary-950 via-primary-900 to-primary-800 p-8 md:p-10 shadow-xl ${className}`}
      role="img"
      aria-label={ariaLabel}
    >
      {children}
    </figure>
  );
}

// ─── 1. NumberedListInfographic ───────────────────────────────────────────────

/** Props for each item in a numbered list infographic. */
interface InfographicItem {
  /** Short title for the item. */
  title: string;
  /** Brief supporting description. */
  description: string;
}

/** Props for the NumberedListInfographic component. */
interface NumberedListInfographicProps {
  /** Main heading displayed prominently. */
  title: string;
  /** Optional subtitle below the heading. */
  subtitle?: string;
  /** Numbered items to display. */
  items: InfographicItem[];
  /** Optional brand accent color class (defaults to primary-400). */
  brandColor?: string;
}

/**
 * A vertical "top N" infographic with numbered items, branded header, and footer.
 * Designed to look screenshot-worthy for social media sharing.
 */
export function NumberedListInfographic({
  title,
  subtitle,
  items,
  brandColor = 'text-primary-400',
}: NumberedListInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. ${items.map((item, i) => `${i + 1}. ${item.title}: ${item.description}`).join(' ')}`}
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
        {title}
      </h3>
      {subtitle && (
        <p className="text-base text-white/60 mt-2">{subtitle}</p>
      )}

      <div className="mt-8 space-y-6">
        {items.map((item, index) => (
          <div key={index} className="flex gap-4">
            <span
              className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-sm font-bold ${brandColor}`}
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-white leading-snug">
                {item.title}
              </p>
              <p className="text-sm text-white/60 mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 2. ComparisonInfographic ─────────────────────────────────────────────────

/** Props for the ComparisonInfographic component. */
interface ComparisonInfographicProps {
  /** Main heading for the comparison. */
  title: string;
  /** Label for the left column. */
  leftLabel: string;
  /** Label for the right column. */
  rightLabel: string;
  /** Row items with left and right values. */
  items: { left: string; right: string }[];
  /** Optional color class for the left column header (defaults to emerald). */
  leftColor?: string;
  /** Optional color class for the right column header (defaults to emerald-400). */
  rightColor?: string;
}

/**
 * A side-by-side comparison card with color-coded columns and divider.
 * Works well for "X vs Y" blog posts.
 */
export function ComparisonInfographic({
  title,
  leftLabel,
  rightLabel,
  items,
  leftColor = 'text-primary-400',
  rightColor = 'text-amber-400',
}: ComparisonInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. Comparing ${leftLabel} and ${rightLabel}: ${items.map((item) => `${leftLabel} — ${item.left}; ${rightLabel} — ${item.right}`).join('. ')}`}
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
        {title}
      </h3>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className={`text-sm font-bold uppercase tracking-wider ${leftColor}`}>
          {leftLabel}
        </div>
        <div className={`text-sm font-bold uppercase tracking-wider ${rightColor}`}>
          {rightLabel}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-white/20 mb-4" />

      {/* Rows */}
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-2 gap-4"
          >
            <p className="text-sm text-white/80 leading-snug">{item.left}</p>
            <p className="text-sm text-white/80 leading-snug">{item.right}</p>
          </div>
        ))}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 3. StatInfographic ───────────────────────────────────────────────────────

/** Props for the StatInfographic component. */
interface StatInfographicProps {
  /** Main heading for the stats showcase. */
  title: string;
  /** Array of stats to display in a grid. */
  stats: { value: string; label: string; highlight?: boolean }[];
}

/**
 * A bold statistics showcase with a 2-column grid of stat cards.
 * Highlighted stats get a brighter accent ring.
 */
export function StatInfographic({ title, stats }: StatInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. ${stats.map((s) => `${s.value} ${s.label}`).join(', ')}.`}
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
        {title}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`rounded-xl p-5 text-center ${
              stat.highlight
                ? 'bg-primary-700/50 ring-1 ring-primary-400/40'
                : 'bg-white/5'
            }`}
          >
            <p className="text-3xl md:text-4xl font-extrabold text-white leading-none">
              {stat.value}
            </p>
            <p className="text-xs text-white/50 mt-2 uppercase tracking-wider font-medium leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 4. TimelineInfographic ───────────────────────────────────────────────────

/** A single step in the timeline. */
interface TimelineStep {
  /** Time marker displayed on the left (e.g., "0 min", "Week 1"). */
  time: string;
  /** Step title. */
  title: string;
  /** Optional description below the title. */
  description?: string;
}

/** Props for the TimelineInfographic component. */
interface TimelineInfographicProps {
  /** Main heading for the timeline. */
  title: string;
  /** Ordered steps to display vertically. */
  steps: TimelineStep[];
}

/**
 * A vertical timeline with time markers, dots, connecting lines, and step titles.
 * The final step is highlighted with a filled dot.
 */
export function TimelineInfographic({
  title,
  steps,
}: TimelineInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. ${steps.map((s) => `${s.time}: ${s.title}${s.description ? ` — ${s.description}` : ''}`).join('. ')}.`}
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
        {title}
      </h3>

      <div className="space-y-0">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div key={index} className="flex gap-4">
              {/* Time marker */}
              <div className="shrink-0 w-16 text-right">
                <span className="text-xs font-mono text-primary-300/80 leading-none">
                  {step.time}
                </span>
              </div>

              {/* Dot + line */}
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={`w-3 h-3 rounded-full mt-0.5 ${
                    isLast
                      ? 'bg-primary-400 ring-2 ring-primary-400/30'
                      : 'bg-white/40 ring-1 ring-white/20'
                  }`}
                />
                {!isLast && (
                  <div className="w-px flex-1 bg-white/15 min-h-[2rem]" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
                <p
                  className={`font-semibold leading-snug ${
                    isLast ? 'text-primary-300' : 'text-white'
                  }`}
                >
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-sm text-white/50 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 5. ChecklistInfographic ──────────────────────────────────────────────────

/** Props for the ChecklistInfographic component. */
interface ChecklistInfographicProps {
  /** Main heading for the checklist. */
  title: string;
  /** List of checklist item labels. */
  items: string[];
  /** Number of items to show as completed (from the top). Defaults to 0. */
  completedCount?: number;
}

/**
 * A visual checklist card with completed/uncompleted states and a progress summary.
 * Good for "essential checklist" or "launch readiness" type posts.
 */
export function ChecklistInfographic({
  title,
  items,
  completedCount = 0,
}: ChecklistInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. ${completedCount} of ${items.length} complete. Items: ${items.map((item, i) => `${i < completedCount ? 'Done' : 'To do'}: ${item}`).join('. ')}.`}
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
        {title}
      </h3>

      <div className="space-y-3">
        {items.map((item, index) => {
          const isCompleted = index < completedCount;
          return (
            <div key={index} className="flex items-start gap-3">
              {/* Checkbox */}
              <span className="shrink-0 mt-0.5">
                {isCompleted ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      width="20"
                      height="20"
                      rx="4"
                      className="fill-emerald-500/20"
                    />
                    <path
                      d="M6 10L9 13L14 7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-emerald-400"
                    />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      width="20"
                      height="20"
                      rx="4"
                      className="fill-white/5 stroke-white/20"
                      strokeWidth="1"
                    />
                  </svg>
                )}
              </span>

              {/* Label */}
              <p
                className={`text-sm leading-snug ${
                  isCompleted ? 'text-white/90' : 'text-white/50'
                }`}
              >
                {item}
              </p>
            </div>
          );
        })}
      </div>

      {/* Progress summary */}
      <div className="mt-6 flex items-center gap-3">
        <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-emerald-500/60 transition-all"
            style={{
              width: `${items.length > 0 ? (completedCount / items.length) * 100 : 0}%`,
            }}
          />
        </div>
        <span className="text-xs font-medium text-white/50">
          {completedCount}/{items.length} complete
        </span>
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 6. HeadToHeadInfographic ────────────────────────────────────────────────

/**
 * Returns HSL colors for a 0-10 score with per-column color identity.
 * Column A (AI/tech) uses a cyan family; Column B (human) uses a warm amber family.
 * Higher scores produce more vivid, saturated bars; lower scores are more muted.
 */
function columnScoreColors(
  score: number,
  column: 'a' | 'b'
): { bright: string; dim: string; text: string } {
  const t = Math.max(0, Math.min(10, score)) / 10;

  if (column === 'a') {
    // Cyan family — aligns with VocUI brand primary
    return {
      bright: `hsl(195, ${40 + t * 30}%, ${35 + t * 20}%)`,
      dim: `hsl(195, 25%, 18%)`,
      text: `hsl(195, 50%, ${55 + t * 10}%)`,
    };
  }
  // Warm amber family — human/live agent association
  return {
    bright: `hsl(30, ${40 + t * 25}%, ${35 + t * 18}%)`,
    dim: `hsl(30, 25%, 18%)`,
    text: `hsl(30, 45%, ${55 + t * 10}%)`,
  };
}

/** A single comparison factor in the head-to-head infographic. */
export interface HeadToHeadFactor {
  /** Factor name displayed as the row label (e.g. "Availability"). */
  factor: string;
  /** Score for option A (0-10). Drives the colored bar width and hue. */
  scoreA: number;
  /** Score for option B (0-10). */
  scoreB: number;
  /** Brief text description for option A (e.g. "24/7/365, instant responses"). */
  textA: string;
  /** Brief text description for option B (e.g. "Business hours only"). */
  textB: string;
}

/** Props for the HeadToHeadInfographic component. */
export interface HeadToHeadInfographicProps {
  /** Main heading displayed at the top of the infographic. */
  title: string;
  /** Label for option A (displayed above column A bars). */
  labelA: string;
  /** Label for option B (displayed above column B bars). */
  labelB: string;
  /** The comparison factors to render. Each becomes a row with bars + descriptions. */
  factors: HeadToHeadFactor[];
}

/**
 * A combined head-to-head comparison infographic that merges text descriptions
 * with HSL-gradient score bars into one cohesive, branded dark card.
 *
 * Combines the roles of ComparisonInfographic (text descriptions),
 * ComparisonScorecard (visual score bars), and the HTML comparison table
 * into a single visual element.
 *
 * Server-safe: no hooks, no state, no client-side interactivity.
 * Designed for ~600px blog column width, responsive on mobile.
 */
export function HeadToHeadInfographic({
  title,
  labelA,
  labelB,
  factors,
}: HeadToHeadInfographicProps) {
  const ariaDescription = factors
    .map(
      (f) =>
        `${f.factor}: ${labelA} ${f.scoreA} out of 10 (${f.textA}), ${labelB} ${f.scoreB} out of 10 (${f.textB})`
    )
    .join('. ');

  return (
    <InfographicCard
      ariaLabel={`${title}. ${ariaDescription}`}
      className=""
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-10">
        {title}
      </h3>

      {/* Column headers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-primary-400">
          {labelA}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 text-right sm:text-left">
          {labelB}
        </div>
      </div>

      {/* Factor rows */}
      <div className="space-y-8">
        {factors.map((f) => {
          const pctA = (Math.max(0, Math.min(10, f.scoreA)) / 10) * 100;
          const pctB = (Math.max(0, Math.min(10, f.scoreB)) / 10) * 100;
          const colorsA = columnScoreColors(f.scoreA, 'a');
          const colorsB = columnScoreColors(f.scoreB, 'b');

          return (
            <div key={f.factor}>
              {/* Factor label */}
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60 mb-3">
                {f.factor}
              </p>

              {/* Score bars — side by side on sm+, stacked on mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option A — cyan family */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex-1 h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: colorsA.dim }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pctA}%`,
                          backgroundColor: colorsA.bright,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold tabular-nums w-10 text-right shrink-0"
                      style={{ color: colorsA.text }}
                    >
                      {f.scoreA}/10
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1.5 leading-snug">
                    {f.textA}
                  </p>
                </div>

                {/* Option B — amber family */}
                <div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex-1 h-3 rounded-full overflow-hidden"
                      style={{ backgroundColor: colorsB.dim }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${pctB}%`,
                          backgroundColor: colorsB.bright,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-semibold tabular-nums w-10 text-right shrink-0"
                      style={{ color: colorsB.text }}
                    >
                      {f.scoreB}/10
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-1.5 leading-snug">
                    {f.textB}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}

// ─── 7. ComparisonTableInfographic ──────────────────────────────────────────

/** A single row in a comparison table infographic. */
export interface ComparisonTableRow {
  /** Row label shown in the first column. */
  feature: string;
  /** Value for column A. */
  valueA: string;
  /** Value for column B. */
  valueB: string;
}

/** Props for the ComparisonTableInfographic component. */
export interface ComparisonTableInfographicProps {
  /** Main heading displayed at the top. */
  title: string;
  /** Label for the first value column. */
  labelA: string;
  /** Label for the second value column. */
  labelB: string;
  /** Rows of comparison data. */
  rows: ComparisonTableRow[];
}

/**
 * An infographic-style comparison table with a dark gradient card,
 * three columns (feature label + two value columns), and VocUI branding.
 * Server-safe: no hooks, no state.
 */
export function ComparisonTableInfographic({
  title,
  labelA,
  labelB,
  rows,
}: ComparisonTableInfographicProps) {
  return (
    <InfographicCard
      ariaLabel={`${title}. Comparing ${labelA} and ${labelB}: ${rows.map((r) => `${r.feature} — ${labelA}: ${r.valueA}, ${labelB}: ${r.valueB}`).join('. ')}`}
      className=""
    >
      <BrandMark />

      <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-8">
        {title}
      </h3>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-2 pb-3 border-b border-white/15">
        <span className="text-xs font-bold uppercase tracking-wider text-white/50">
          Factor
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-primary-400">
          {labelA}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {labelB}
        </span>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/10">
        {rows.map((row) => (
          <div key={row.feature} className="grid grid-cols-[1fr_1fr_1fr] gap-2 py-3.5">
            <p className="text-sm font-medium text-white/90">
              {row.feature}
            </p>
            <p className="text-sm text-white/70 leading-snug">
              {row.valueA}
            </p>
            <p className="text-sm text-white/70 leading-snug">
              {row.valueB}
            </p>
          </div>
        ))}
      </div>

      <BrandFooter />
    </InfographicCard>
  );
}
