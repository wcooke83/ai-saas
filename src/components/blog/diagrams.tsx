'use client';

/**
 * Inline SVG/React diagram components for VocUI's technical explainer blog posts.
 *
 * Each diagram is a self-contained, accessible, responsive React component that
 * renders pure SVG -- no external dependencies. Wrapped in <figure>/<figcaption>
 * with appropriate ARIA attributes for screen reader support.
 */

// ─── Shared wrapper ────────────────────────────────────────────────────────────

function DiagramContainer({
  children,
  caption,
}: {
  children: React.ReactNode;
  caption: string;
}) {
  return (
    <figure className="my-8 p-4 sm:p-6 bg-secondary-50 dark:bg-secondary-800/40 rounded-xl border border-secondary-200 dark:border-secondary-700">
      {children}
      <figcaption className="mt-3 text-center text-sm text-secondary-500 dark:text-secondary-400">
        {caption}
      </figcaption>
    </figure>
  );
}

// ─── Shared colors ─────────────────────────────────────────────────────────────

const BLUE = '#2563eb';
const BLUE_LIGHT = '#dbeafe';
const GREEN = '#16a34a';
const GREEN_LIGHT = '#dcfce7';
const PURPLE = '#9333ea';
const PURPLE_LIGHT = '#f3e8ff';
const SLATE_700 = '#334155';
const SLATE_400 = '#94a3b8';
const SLATE_100 = '#f1f5f9';
const RED = '#dc2626';
const RED_LIGHT = '#fee2e2';

// ─── 1. RAG Pipeline Diagram ───────────────────────────────────────────────────

/**
 * Horizontal flow diagram showing the full RAG pipeline from document ingestion
 * through retrieval to generation. Color-coded by phase: blue (ingestion),
 * green (retrieval), purple (generation). Wraps on mobile via CSS flex.
 */
export function RagPipelineDiagram() {
  const stages: Array<{
    label: string;
    sublabel: string;
    color: string;
    bgColor: string;
  }> = [
    { label: 'Documents', sublabel: 'URLs, PDFs, text', color: BLUE, bgColor: BLUE_LIGHT },
    { label: 'Chunking', sublabel: 'Split into sections', color: BLUE, bgColor: BLUE_LIGHT },
    { label: 'Embeddings', sublabel: 'Text to vectors', color: BLUE, bgColor: BLUE_LIGHT },
    { label: 'Vector DB', sublabel: 'Store & index', color: BLUE, bgColor: BLUE_LIGHT },
    { label: 'User Query', sublabel: 'Question asked', color: GREEN, bgColor: GREEN_LIGHT },
    { label: 'Similarity Search', sublabel: 'Find matches', color: GREEN, bgColor: GREEN_LIGHT },
    { label: 'Retrieved Chunks', sublabel: 'Top results', color: GREEN, bgColor: GREEN_LIGHT },
    { label: 'LLM + Context', sublabel: 'Generate answer', color: PURPLE, bgColor: PURPLE_LIGHT },
    { label: 'Answer', sublabel: 'Grounded response', color: PURPLE, bgColor: PURPLE_LIGHT },
  ];

  return (
    <DiagramContainer caption="The RAG pipeline: documents are ingested (blue), relevant content is retrieved at query time (green), and the LLM generates a grounded answer (purple).">
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-0">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center">
            {/* Stage box */}
            <div
              className="flex flex-col items-center justify-center rounded-lg border-2 px-3 py-2.5 sm:px-4 sm:py-3 min-w-[90px] sm:min-w-[100px] text-center"
              style={{
                borderColor: stage.color,
                backgroundColor: stage.bgColor,
              }}
            >
              <span
                className="text-xs sm:text-sm font-semibold leading-tight"
                style={{ color: stage.color }}
              >
                {stage.label}
              </span>
              <span className="text-[10px] sm:text-xs mt-0.5 leading-tight" style={{ color: SLATE_700 }}>
                {stage.sublabel}
              </span>
            </div>

            {/* Arrow between stages (not after the last one) */}
            {i < stages.length - 1 && (
              <svg
                width="24"
                height="16"
                viewBox="0 0 24 16"
                className="mx-0.5 sm:mx-1 flex-shrink-0 hidden sm:block"
                aria-hidden="true"
              >
                <path
                  d="M0 8 L18 8 M14 3 L20 8 L14 13"
                  fill="none"
                  stroke={SLATE_400}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: BLUE }} />
          <span style={{ color: SLATE_700 }}>Ingestion</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: GREEN }} />
          <span style={{ color: SLATE_700 }}>Retrieval</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: PURPLE }} />
          <span style={{ color: SLATE_700 }}>Generation</span>
        </span>
      </div>
    </DiagramContainer>
  );
}

// ─── 2. Embedding Visualization ────────────────────────────────────────────────

/**
 * Shows three text examples mapped to vector representations. The first two are
 * semantically similar (shown close together on a 2D scatter plot) while the
 * third is semantically different (shown far away).
 */
export function EmbeddingVisualizationDiagram() {
  const examples: Array<{
    text: string;
    vector: string;
    note: string;
    noteColor: string;
    dotX: number;
    dotY: number;
    dotColor: string;
    id: string;
  }> = [
    {
      text: '"How do I reset my password?"',
      vector: '[0.23, 0.87, -0.14, 0.56, ...]',
      note: '',
      noteColor: GREEN,
      dotX: 140,
      dotY: 65,
      dotColor: BLUE,
      id: 'a',
    },
    {
      text: '"I forgot my login"',
      vector: '[0.21, 0.85, -0.11, 0.54, ...]',
      note: 'Similar vectors!',
      noteColor: GREEN,
      dotX: 155,
      dotY: 80,
      dotColor: BLUE,
      id: 'b',
    },
    {
      text: '"What are your hours?"',
      vector: '[0.91, -0.32, 0.67, -0.18, ...]',
      note: 'Very different',
      noteColor: RED,
      dotX: 310,
      dotY: 210,
      dotColor: PURPLE,
      id: 'c',
    },
  ];

  return (
    <DiagramContainer caption="Similar questions produce similar vectors (close in vector space). Different questions produce distant vectors.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text to vector mapping */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: SLATE_700 }}>
            Text to vector conversion
          </p>
          {examples.map((ex) => (
            <div
              key={ex.id}
              className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 rounded-lg border px-3 py-2"
              style={{
                borderColor: ex.dotColor === BLUE ? BLUE : PURPLE,
                backgroundColor: ex.dotColor === BLUE ? BLUE_LIGHT : PURPLE_LIGHT,
              }}
            >
              <span className="text-sm font-medium" style={{ color: SLATE_700 }}>
                {ex.text}
              </span>
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                className="flex-shrink-0 hidden sm:block"
                aria-hidden="true"
              >
                <path
                  d="M0 7 L14 7 M10 2 L16 7 L10 12"
                  fill="none"
                  stroke={SLATE_400}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <code className="text-xs font-mono" style={{ color: SLATE_700 }}>
                {ex.vector}
              </code>
              {ex.note && (
                <span className="text-xs font-semibold ml-1" style={{ color: ex.noteColor }}>
                  {ex.note}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 2D scatter visualization */}
        <div className="flex items-center justify-center">
          <svg
            viewBox="0 0 380 280"
            className="w-full max-w-[380px] h-auto"
            role="img"
            aria-label="2D scatter plot showing two similar questions clustered close together and one different question far away"
          >
            {/* Background */}
            <rect x="40" y="10" width="330" height="250" rx="8" fill={SLATE_100} />

            {/* Axes */}
            <line x1="40" y1="260" x2="370" y2="260" stroke={SLATE_400} strokeWidth="1" />
            <line x1="40" y1="10" x2="40" y2="260" stroke={SLATE_400} strokeWidth="1" />

            {/* Axis labels */}
            <text x="205" y="278" textAnchor="middle" fontSize="11" fill={SLATE_400}>
              Dimension 1
            </text>
            <text
              x="12"
              y="140"
              textAnchor="middle"
              fontSize="11"
              fill={SLATE_400}
              transform="rotate(-90, 12, 140)"
            >
              Dimension 2
            </text>

            {/* Cluster circle around similar points */}
            <circle
              cx="148"
              cy="73"
              r="38"
              fill="none"
              stroke={GREEN}
              strokeWidth="1.5"
              strokeDasharray="5 3"
              opacity="0.6"
            />
            <text x="195" y="52" fontSize="10" fill={GREEN} fontWeight="600">
              Similar meaning
            </text>

            {/* Data points */}
            {examples.map((ex) => (
              <g key={ex.id}>
                <circle cx={ex.dotX} cy={ex.dotY} r="7" fill={ex.dotColor} />
                <text
                  x={ex.dotX + 12}
                  y={ex.dotY + 4}
                  fontSize="10"
                  fill={SLATE_700}
                >
                  {ex.id === 'a'
                    ? 'Reset password'
                    : ex.id === 'b'
                      ? 'Forgot login'
                      : 'Business hours'}
                </text>
              </g>
            ))}

            {/* Distance line between dissimilar point and cluster */}
            <line
              x1="155"
              y1="80"
              x2="310"
              y2="210"
              stroke={RED}
              strokeWidth="1"
              strokeDasharray="4 3"
              opacity="0.5"
            />
            <text x="250" y="155" fontSize="10" fill={RED} fontWeight="600">
              Far apart
            </text>
          </svg>
        </div>
      </div>
    </DiagramContainer>
  );
}

// ─── 3. Vector Search Comparison Diagram ───────────────────────────────────────

/**
 * Side-by-side comparison of keyword search vs. semantic/vector search,
 * showing how keyword search misses relevant results while vector search
 * finds them based on meaning.
 */
export function VectorSearchComparisonDiagram() {
  const keywordResults: Array<{ text: string; match: boolean }> = [
    { text: 'How to reset password', match: true },
    { text: 'Login troubleshooting', match: false },
    { text: 'Account recovery steps', match: false },
  ];

  const semanticResults: Array<{ text: string; match: boolean }> = [
    { text: 'How to reset password', match: true },
    { text: 'Login troubleshooting', match: true },
    { text: 'Account recovery steps', match: true },
  ];

  return (
    <DiagramContainer caption="Keyword search only finds exact word matches. Vector search finds results by meaning, even when the wording is completely different.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Keyword search column */}
        <div className="rounded-lg border-2 p-4" style={{ borderColor: SLATE_400, backgroundColor: SLATE_100 }}>
          <p className="text-sm font-bold mb-3" style={{ color: SLATE_700 }}>
            Keyword Search
          </p>
          <div
            className="rounded-md border px-3 py-2 text-sm font-mono mb-3"
            style={{ borderColor: SLATE_400, color: SLATE_700, backgroundColor: '#fff' }}
          >
            &quot;reset password&quot;
          </div>
          <p className="text-xs mb-2" style={{ color: SLATE_400 }}>
            Exact word matching
          </p>
          <div className="space-y-2">
            {keywordResults.map((r) => (
              <div key={r.text} className="flex items-center gap-2 text-sm">
                {r.match ? (
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <circle cx="9" cy="9" r="8" fill={GREEN_LIGHT} stroke={GREEN} strokeWidth="1.5" />
                    <path d="M5.5 9 L8 11.5 L12.5 6.5" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                    <circle cx="9" cy="9" r="8" fill={RED_LIGHT} stroke={RED} strokeWidth="1.5" />
                    <path d="M6 6 L12 12 M12 6 L6 12" fill="none" stroke={RED} strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                )}
                <span style={{ color: r.match ? GREEN : RED }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 font-medium" style={{ color: RED }}>
            1 of 3 relevant results found
          </p>
        </div>

        {/* Semantic/vector search column */}
        <div className="rounded-lg border-2 p-4" style={{ borderColor: GREEN, backgroundColor: GREEN_LIGHT }}>
          <p className="text-sm font-bold mb-3" style={{ color: SLATE_700 }}>
            Vector / Semantic Search
          </p>
          <div
            className="rounded-md border px-3 py-2 text-sm font-mono mb-3"
            style={{ borderColor: GREEN, color: SLATE_700, backgroundColor: '#fff' }}
          >
            &quot;I can&apos;t log in&quot;
          </div>
          <p className="text-xs mb-2" style={{ color: SLATE_400 }}>
            Meaning-based matching
          </p>
          <div className="space-y-2">
            {semanticResults.map((r) => (
              <div key={r.text} className="flex items-center gap-2 text-sm">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <circle cx="9" cy="9" r="8" fill={GREEN_LIGHT} stroke={GREEN} strokeWidth="1.5" />
                  <path d="M5.5 9 L8 11.5 L12.5 6.5" fill="none" stroke={GREEN} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span style={{ color: GREEN }}>
                  {r.text}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs mt-3 font-medium" style={{ color: GREEN }}>
            3 of 3 relevant results found
          </p>
        </div>
      </div>
    </DiagramContainer>
  );
}

// ─── 4. NLP Pipeline Diagram ───────────────────────────────────────────────────

/**
 * Vertical flow diagram showing how an AI chatbot processes a user question
 * from tokenization through to final answer generation.
 */
export function NlpPipelineDiagram() {
  const steps: Array<{
    label: string;
    detail: string;
    color: string;
    bgColor: string;
  }> = [
    {
      label: 'User Question',
      detail: '"What\'s your return policy?"',
      color: SLATE_700,
      bgColor: SLATE_100,
    },
    {
      label: 'Tokenization',
      detail: '"what\'s" "your" "return" "policy"',
      color: BLUE,
      bgColor: BLUE_LIGHT,
    },
    {
      label: 'Embedding',
      detail: '[0.34, 0.78, -0.12, 0.91, ...]',
      color: BLUE,
      bgColor: BLUE_LIGHT,
    },
    {
      label: 'Retrieval',
      detail: 'Search knowledge base for similar vectors',
      color: GREEN,
      bgColor: GREEN_LIGHT,
    },
    {
      label: 'Context Assembly',
      detail: 'Question + top matching chunks',
      color: GREEN,
      bgColor: GREEN_LIGHT,
    },
    {
      label: 'LLM Generation',
      detail: 'Claude / GPT generates answer from context',
      color: PURPLE,
      bgColor: PURPLE_LIGHT,
    },
    {
      label: 'Answer',
      detail: '"Our return policy allows returns within 30 days..."',
      color: PURPLE,
      bgColor: PURPLE_LIGHT,
    },
  ];

  return (
    <DiagramContainer caption="How an AI chatbot processes a question: from raw text through tokenization, embedding, retrieval, and generation.">
      <div className="flex flex-col items-center gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center w-full max-w-md">
            {/* Step box */}
            <div
              className="w-full rounded-lg border-2 px-4 py-3 text-center"
              style={{ borderColor: step.color, backgroundColor: step.bgColor }}
            >
              <p className="text-sm font-bold" style={{ color: step.color }}>
                {step.label}
              </p>
              <p className="text-xs mt-0.5 font-mono" style={{ color: SLATE_700 }}>
                {step.detail}
              </p>
            </div>

            {/* Down arrow between steps */}
            {i < steps.length - 1 && (
              <svg
                width="16"
                height="28"
                viewBox="0 0 16 28"
                className="my-0.5 flex-shrink-0"
                aria-hidden="true"
              >
                <path
                  d="M8 0 L8 20 M3 16 L8 22 L13 16"
                  fill="none"
                  stroke={SLATE_400}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        ))}
      </div>

      {/* Phase legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-4 text-xs sm:text-sm">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: BLUE }} />
          <span style={{ color: SLATE_700 }}>Processing</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: GREEN }} />
          <span style={{ color: SLATE_700 }}>Retrieval</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-sm" style={{ backgroundColor: PURPLE }} />
          <span style={{ color: SLATE_700 }}>Generation</span>
        </span>
      </div>
    </DiagramContainer>
  );
}

// ─── 5. Chatbot Architecture Overview ──────────────────────────────────────────

/**
 * System-level architecture diagram showing how content flows into a knowledge
 * base chatbot and how answers flow back out through various deployment channels.
 */
export function ChatbotArchitectureDiagram() {
  return (
    <DiagramContainer caption="How a knowledge base chatbot works: your content is processed and stored, then retrieved at query time to generate accurate answers across any channel.">
      <svg
        viewBox="0 0 600 380"
        className="w-full h-auto max-w-[600px] mx-auto"
        role="img"
        aria-label="Architecture diagram showing content flowing through knowledge processing into a vector database, connected to a RAG engine that serves answers to website widgets, Slack, and Telegram"
      >
        {/* ── Left column: Content sources ── */}
        <rect x="10" y="20" width="150" height="110" rx="8" fill={BLUE_LIGHT} stroke={BLUE} strokeWidth="2" />
        <text x="85" y="46" textAnchor="middle" fontSize="13" fontWeight="700" fill={BLUE}>
          Your Content
        </text>
        <text x="85" y="66" textAnchor="middle" fontSize="11" fill={SLATE_700}>URLs</text>
        <text x="85" y="82" textAnchor="middle" fontSize="11" fill={SLATE_700}>PDFs</text>
        <text x="85" y="98" textAnchor="middle" fontSize="11" fill={SLATE_700}>Documents</text>
        <text x="85" y="114" textAnchor="middle" fontSize="11" fill={SLATE_700}>Q&amp;A Pairs</text>

        {/* Arrow: Content → Processing */}
        <path d="M85 130 L85 155" fill="none" stroke={SLATE_400} strokeWidth="2" markerEnd="url(#arrowDown)" />

        {/* ── Knowledge Processing ── */}
        <rect x="10" y="160" width="150" height="70" rx="8" fill={BLUE_LIGHT} stroke={BLUE} strokeWidth="2" />
        <text x="85" y="186" textAnchor="middle" fontSize="12" fontWeight="700" fill={BLUE}>
          Knowledge Processing
        </text>
        <text x="85" y="204" textAnchor="middle" fontSize="10" fill={SLATE_700}>
          Chunk &rarr; Embed &rarr; Store
        </text>

        {/* Arrow: Processing → Vector DB */}
        <path d="M160 195 L220 195" fill="none" stroke={SLATE_400} strokeWidth="2" markerEnd="url(#arrowRight)" />

        {/* ── Center: Vector Database ── */}
        <rect x="225" y="160" width="150" height="70" rx="8" fill={GREEN_LIGHT} stroke={GREEN} strokeWidth="2" />
        <text x="300" y="186" textAnchor="middle" fontSize="12" fontWeight="700" fill={GREEN}>
          Vector Database
        </text>
        <text x="300" y="204" textAnchor="middle" fontSize="10" fill={SLATE_700}>
          Supabase + pgvector
        </text>

        {/* Double arrow: Vector DB ↔ RAG Engine */}
        <path d="M300 230 L300 260" fill="none" stroke={SLATE_400} strokeWidth="2" markerEnd="url(#arrowDown)" />
        <path d="M310 260 L310 230" fill="none" stroke={SLATE_400} strokeWidth="2" markerEnd="url(#arrowUp)" />

        {/* ── RAG Engine ── */}
        <rect x="225" y="265" width="150" height="70" rx="8" fill={PURPLE_LIGHT} stroke={PURPLE} strokeWidth="2" />
        <text x="300" y="291" textAnchor="middle" fontSize="12" fontWeight="700" fill={PURPLE}>
          RAG Engine
        </text>
        <text x="300" y="309" textAnchor="middle" fontSize="10" fill={SLATE_700}>
          Retrieve + Generate
        </text>

        {/* Arrow: RAG Engine → Deployment */}
        <path d="M375 300 L435 300" fill="none" stroke={SLATE_400} strokeWidth="2" markerEnd="url(#arrowRight)" />

        {/* ── Right column: Deployment channels ── */}
        <rect x="440" y="20" width="150" height="110" rx="8" fill={PURPLE_LIGHT} stroke={PURPLE} strokeWidth="2" />
        <text x="515" y="46" textAnchor="middle" fontSize="13" fontWeight="700" fill={PURPLE}>
          Your Channels
        </text>
        <text x="515" y="66" textAnchor="middle" fontSize="11" fill={SLATE_700}>Website Widget</text>
        <text x="515" y="82" textAnchor="middle" fontSize="11" fill={SLATE_700}>Slack</text>
        <text x="515" y="98" textAnchor="middle" fontSize="11" fill={SLATE_700}>Telegram</text>
        <text x="515" y="114" textAnchor="middle" fontSize="11" fill={SLATE_700}>API</text>

        {/* Arrow: Channels → RAG (user query goes in) */}
        <path d="M515 130 L515 300 L375 300" fill="none" stroke={SLATE_400} strokeWidth="2" strokeDasharray="6 3" />
        <text x="525" y="220" fontSize="10" fill={SLATE_400} transform="rotate(90, 525, 220)">
          User asks question
        </text>

        {/* Arrow: RAG → Channels (answer goes back) */}
        <path d="M440 275 L440 130" fill="none" stroke={PURPLE} strokeWidth="2" markerEnd="url(#arrowUpPurple)" />
        <text x="428" y="220" fontSize="10" fill={PURPLE} fontWeight="600" transform="rotate(-90, 428, 220)">
          AI response
        </text>

        {/* Arrow markers */}
        <defs>
          <marker id="arrowRight" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0 0 L8 4 L0 8" fill="none" stroke={SLATE_400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker id="arrowDown" markerWidth="8" markerHeight="8" refX="4" refY="7" orient="auto">
            <path d="M0 0 L4 8 L8 0" fill="none" stroke={SLATE_400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker id="arrowUp" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto">
            <path d="M0 8 L4 0 L8 8" fill="none" stroke={SLATE_400} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
          <marker id="arrowUpPurple" markerWidth="8" markerHeight="8" refX="4" refY="1" orient="auto">
            <path d="M0 8 L4 0 L8 8" fill="none" stroke={PURPLE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </marker>
        </defs>
      </svg>
    </DiagramContainer>
  );
}
