import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/ui/footer';
import { fetchStatusPageData } from './StatusDataFetcher';
import { formatRelativeTime, formatDateRange } from './formatters';
import { IncidentHistoryList } from './IncidentEntry';
import type { ComponentStatus, StatusComponentWithUptime, UptimeDay } from '@/types/status';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'System Status — VocUI',
  description: 'Real-time status and uptime for all VocUI services. View current incidents, maintenance windows, and 90-day uptime history.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'System Status — VocUI',
    description: 'Real-time status and uptime for all VocUI services.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'System Status — VocUI',
    description: 'Real-time status and uptime for all VocUI services.',
  },
};

// ---------------------------------------------------------------------------
// Status helpers
// ---------------------------------------------------------------------------

type OverallStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

function deriveOverallStatus(
  components: StatusComponentWithUptime[],
  hasActiveIncident: boolean,
  hasUpcomingMaint: boolean,
): OverallStatus {
  if (hasActiveIncident) {
    const hasOutage = components.some((c) => c.status === 'outage');
    return hasOutage ? 'outage' : 'degraded';
  }
  if (hasUpcomingMaint) return 'maintenance';
  if (components.some((c) => c.status === 'outage')) return 'outage';
  if (components.some((c) => c.status === 'degraded')) return 'degraded';
  return 'operational';
}

const statusConfig: Record<
  OverallStatus,
  { dotColor: string; labelColor: string; label: string; headline: string }
> = {
  operational: {
    dotColor: 'bg-emerald-400',
    labelColor: 'text-emerald-700 dark:text-emerald-400',
    label: 'ALL SYSTEMS OPERATIONAL',
    headline: 'Everything is running.',
  },
  degraded: {
    dotColor: 'bg-amber-400',
    labelColor: 'text-amber-700 dark:text-amber-400',
    label: 'DEGRADED PERFORMANCE',
    headline: 'Degraded Performance.',
  },
  outage: {
    dotColor: 'bg-red-500',
    labelColor: 'text-red-700 dark:text-red-400',
    label: 'SERVICE DISRUPTION',
    headline: 'Service Disruption.',
  },
  maintenance: {
    dotColor: 'bg-sky-400',
    labelColor: 'text-sky-700 dark:text-sky-400',
    label: 'MAINTENANCE IN PROGRESS',
    headline: 'Scheduled Maintenance.',
  },
};

// ---------------------------------------------------------------------------
// Service icons
// ---------------------------------------------------------------------------

function ServiceIconComponent({ slug }: { slug: string }) {
  const shared = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24' as const,
    fill: 'none' as const,
    stroke: 'currentColor' as const,
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className: 'text-secondary-500 dark:text-secondary-400',
    'aria-hidden': true as const,
  };

  switch (slug) {
    case 'web-app':
      return (
        <svg {...shared}>
          <rect x="2" y="3" width="20" height="18" rx="2" />
          <path d="M2 7h20" />
          <circle cx="5.5" cy="5" r="0.5" fill="currentColor" />
          <circle cx="8" cy="5" r="0.5" fill="currentColor" />
          <circle cx="10.5" cy="5" r="0.5" fill="currentColor" />
        </svg>
      );

    case 'ai-generation-claude':
      return (
        <svg {...shared}>
          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
          <circle cx="5" cy="17" r="1.5" fill="currentColor" />
          <circle cx="19" cy="17" r="1.5" fill="currentColor" />
          <line x1="12" y1="5" x2="5" y2="17" />
          <line x1="12" y1="5" x2="19" y2="17" />
          <line x1="5" y1="17" x2="19" y2="17" />
        </svg>
      );

    case 'ai-fallback-openai':
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          <line x1="12" y1="3" x2="12" y2="8" />
          <line x1="12" y1="16" x2="12" y2="21" />
          <line x1="3" y1="12" x2="8" y2="12" />
          <line x1="16" y1="12" x2="21" y2="12" />
          <line x1="5.64" y1="5.64" x2="9.17" y2="9.17" />
          <line x1="14.83" y1="14.83" x2="18.36" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="14.83" y2="9.17" />
          <line x1="9.17" y1="14.83" x2="5.64" y2="18.36" />
        </svg>
      );

    case 'knowledge-processing':
      return (
        <svg {...shared}>
          <path d="M2 6.5A3.5 3.5 0 0 1 5.5 3H12v18H5.5A3.5 3.5 0 0 1 2 17.5v-11Z" />
          <path d="M12 3h6.5A3.5 3.5 0 0 1 22 6.5v11A3.5 3.5 0 0 1 18.5 21H12V3Z" />
          <path d="M12 9V3" />
          <polyline points="9 6 12 3 15 6" />
        </svg>
      );

    case 'chat-widget-embed':
      return (
        <svg {...shared}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          <path d="M9.5 11 12 8.5 14.5 11" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9.5 13 12 15.5 14.5 13" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'billing-stripe':
      return (
        <svg {...shared}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
          <rect x="5" y="13" width="3" height="2" rx="0.5" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'slack-integration':
      return (
        <svg {...shared}>
          <circle cx="8.5" cy="8.5" r="2.5" />
          <circle cx="15.5" cy="8.5" r="2.5" />
          <circle cx="8.5" cy="15.5" r="2.5" />
          <circle cx="15.5" cy="15.5" r="2.5" />
        </svg>
      );

    case 'calendar-booking':
      return (
        <svg {...shared}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4" />
          <path d="M3 10h18" />
          <circle cx="8" cy="15" r="0.5" fill="currentColor" />
          <circle cx="12" cy="15" r="0.5" fill="currentColor" />
          <circle cx="16" cy="15" r="0.5" fill="currentColor" />
        </svg>
      );

    case 'database-api':
      return (
        <svg {...shared}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
          <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
        </svg>
      );

    default:
      return (
        <svg {...shared}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
        </svg>
      );
  }
}

// ---------------------------------------------------------------------------
// Status chip & dot
// ---------------------------------------------------------------------------

const chipClasses: Record<ComponentStatus, string> = {
  operational: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  degraded:    'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  outage:      'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  maintenance: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400',
};

const chipLabels: Record<ComponentStatus, string> = {
  operational: 'Operational',
  degraded:    'Degraded',
  outage:      'Outage',
  maintenance: 'Maintenance',
};

const dotClasses: Record<ComponentStatus, string> = {
  operational: 'bg-emerald-400',
  degraded:    'bg-amber-400 animate-pulse',
  outage:      'bg-red-500 animate-pulse',
  maintenance: 'bg-sky-400',
};

function StatusChip({ status, name }: { status: ComponentStatus; name: string }) {
  const label = chipLabels[status];
  return (
    <span
      role="status"
      aria-label={`${name} is ${label}`}
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${chipClasses[status]}`}
    >
      {label}
    </span>
  );
}

function StatusDot({ status }: { status: ComponentStatus }) {
  return (
    <span
      aria-hidden="true"
      className={`h-2 w-2 flex-shrink-0 rounded-full ${dotClasses[status]}`}
    />
  );
}

// ---------------------------------------------------------------------------
// Uptime bar strip
// ---------------------------------------------------------------------------

const barColors: Record<UptimeDay['status'], string> = {
  operational: 'bg-emerald-400',
  degraded:    'bg-amber-300',
  outage:      'bg-red-400',
  nodata:      'bg-secondary-200 dark:bg-secondary-700',
};

function UptimeBarStrip({ days }: { days: UptimeDay[] }) {
  return (
    <div
      role="img"
      aria-label="90-day uptime history"
      className="mt-1.5 flex h-5 items-end gap-px"
    >
      {days.map((day, i) => {
        const h = Math.max(2, (day.uptimePct / 100) * 20);
        return (
          <div
            key={i}
            className={`relative flex-1 max-w-[3px] rounded-sm ${barColors[day.status]}`}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Service row
// ---------------------------------------------------------------------------

function ServiceRow({ service }: { service: StatusComponentWithUptime }) {
  return (
    <div role="listitem" className="flex items-center gap-4 py-4">
      <div
        aria-hidden="true"
        className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white dark:bg-secondary-800 ring-1 ring-secondary-100 dark:ring-secondary-700"
      >
        <ServiceIconComponent slug={service.slug} />
      </div>
      <div className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-secondary-900 dark:text-secondary-100">
          {service.name}
        </span>
        <UptimeBarStrip days={service.uptimeDays} />
        <span className="mt-1 block text-xs text-secondary-400">
          {service.uptimePct.toFixed(2)}% · 90 days
        </span>
      </div>
      <div className="flex flex-shrink-0 items-center gap-1.5">
        <StatusChip status={service.status} name={service.name} />
        <StatusDot status={service.status} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function StatusPage() {
  const { components, activeIncident, upcomingMaint, incidentHistory, stats } =
    await fetchStatusPageData();

  const overallStatus = deriveOverallStatus(
    components,
    !!activeIncident,
    upcomingMaint.length > 0,
  );

  const { dotColor, labelColor, label, headline } = statusConfig[overallStatus];

  // Split components into two columns
  const mid = Math.ceil(components.length / 2);
  const col1 = components.slice(0, mid);
  const col2 = components.slice(mid);

  return (
    <div className="min-h-screen bg-white dark:bg-secondary-950 overflow-x-hidden">
      <Header />
      <main id="main-content">
        {/* ---------------------------------------------------------------- */}
        {/* HERO                                                              */}
        {/* ---------------------------------------------------------------- */}
        <section
          aria-label="System status"
          className="relative overflow-hidden bg-white dark:bg-secondary-950 py-20 lg:py-28"
        >
          {/* Radial glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className={`h-[400px] w-[400px] rounded-full blur-3xl sm:h-[600px] sm:w-[600px] glow-${overallStatus}`}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
            {/* Pulse chip */}
            <div
              role="status"
              aria-live="polite"
              aria-label={`Current system status: ${label}`}
              className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-secondary-200 dark:border-secondary-700 bg-white/80 dark:bg-secondary-900/80 px-4 py-2 backdrop-blur-sm"
            >
              <span className="relative flex h-3 w-3" aria-hidden="true">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-50 ${dotColor}`}
                />
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-25 ${dotColor}`}
                  style={{ animationDelay: '0.4s', animationDuration: '1.4s' }}
                />
                <span className={`relative inline-flex h-3 w-3 rounded-full ${dotColor}`} />
              </span>
              <span className={`text-xs font-mono tracking-widest uppercase ${labelColor}`}>
                {label}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl font-light tracking-tight text-secondary-900 dark:text-secondary-50 lg:text-7xl">
              {headline}
            </h1>

            {/* Stats strip */}
            <p className="mt-6 text-sm text-secondary-500 dark:text-secondary-400">
              {stats.uptimePct} uptime
              <span aria-hidden="true" className="mx-2 text-secondary-300 dark:text-secondary-600">·</span>
              {stats.activeIncidents} active incident{stats.activeIncidents !== 1 ? 's' : ''}
              <span aria-hidden="true" className="mx-2 text-secondary-300 dark:text-secondary-600">·</span>
              {stats.daysSinceIncident !== null
                ? `Last incident ${stats.daysSinceIncident} day${stats.daysSinceIncident === 1 ? '' : 's'} ago`
                : 'No incidents in 90 days'}
            </p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* ACTIVE INCIDENT CALLOUT                                           */}
        {/* ---------------------------------------------------------------- */}
        {activeIncident && (
          <div
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
            className="bg-amber-50 dark:bg-amber-950/40 py-8"
          >
            <div className="mx-auto max-w-4xl border-l-[3px] border-amber-400 dark:border-amber-500 px-6 pl-5">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  aria-hidden="true"
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-500 dark:text-amber-400 flex-shrink-0"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  ACTIVE INCIDENT
                </span>
              </div>
              <p className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                {activeIncident.title}
              </p>
              <p className="mt-1 text-sm text-secondary-600 dark:text-secondary-300">
                Started {formatRelativeTime(activeIncident.started_at)}
              </p>
            </div>
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* MAINTENANCE NOTICE                                                */}
        {/* ---------------------------------------------------------------- */}
        {upcomingMaint.length > 0 && (
          <div className="mx-auto max-w-4xl px-6 pt-10">
            {upcomingMaint.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-sky-100 dark:border-sky-900 bg-sky-50/60 dark:bg-sky-950/30 px-6 py-5 mb-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    aria-hidden="true"
                    className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-900"
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-sky-600 dark:text-sky-400"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-sky-900 dark:text-sky-100">
                      {m.title}
                    </p>
                    {m.scheduled_start && m.scheduled_end && (
                      <p className="mt-0.5 text-sm text-sky-700 dark:text-sky-300">
                        {formatDateRange(m.scheduled_start, m.scheduled_end)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* SERVICES SECTION                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section
          aria-label="Service status"
          className="bg-secondary-50 dark:bg-secondary-900 py-16 lg:py-20"
        >
          <div className="mx-auto max-w-5xl px-6">
            <p
              aria-hidden="true"
              className="mb-8 text-xs uppercase tracking-widest text-secondary-400"
            >
              SERVICES
            </p>
            {components.length === 0 ? (
              <p className="text-sm text-secondary-400 italic">
                No services configured.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
                  {col1.map((s) => (
                    <ServiceRow key={s.id} service={s} />
                  ))}
                </div>
                <div className="divide-y divide-secondary-100 dark:divide-secondary-800">
                  {col2.map((s) => (
                    <ServiceRow key={s.id} service={s} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* INCIDENT HISTORY                                                  */}
        {/* ---------------------------------------------------------------- */}
        <section
          aria-label="Incident history"
          className="bg-white dark:bg-secondary-950 py-16 lg:py-24"
        >
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="mb-8 text-xs uppercase tracking-widest text-secondary-400">
              INCIDENT HISTORY
            </h2>
            {incidentHistory.length === 0 ? (
              <p className="text-sm text-secondary-400 italic">
                No incidents in the last 90 days.
              </p>
            ) : (
              <IncidentHistoryList incidents={incidentHistory} />
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
