import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type {
  ComponentStatus,
  StatusComponentHistoryRow,
  StatusComponentRow,
  StatusComponentWithUptime,
  StatusIncidentRow,
  StatusIncidentUpdateRow,
  StatusIncidentWithUpdates,
  StatusPageData,
  UptimeDay,
  UptimeDayStatus,
} from '@/types/status';

// ---------------------------------------------------------------------------
// Uptime computation
// ---------------------------------------------------------------------------

function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function computeUptimeDays(
  componentId: string,
  history: StatusComponentHistoryRow[],
): UptimeDay[] {
  const rows = history.filter((r) => r.component_id === componentId);

  // Build a map of dateString -> status[]
  const byDate = new Map<string, ComponentStatus[]>();
  for (const row of rows) {
    const d = toDateString(new Date(row.recorded_at));
    const existing = byDate.get(d);
    if (existing) {
      existing.push(row.status);
    } else {
      byDate.set(d, [row.status]);
    }
  }

  const statusRank: Record<ComponentStatus, number> = {
    outage: 4,
    degraded: 3,
    maintenance: 2,
    operational: 1,
  };

  const statusToPct: Record<ComponentStatus, number> = {
    outage: 0,
    degraded: 75,
    maintenance: 100,
    operational: 100,
  };

  const days: UptimeDay[] = [];
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  for (let i = 89; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const dateStr = toDateString(d);
    const statuses = byDate.get(dateStr);

    if (!statuses || statuses.length === 0) {
      days.push({ date: dateStr, status: 'nodata', uptimePct: 100 });
    } else {
      const worst = statuses.reduce<ComponentStatus>((acc, s) => {
        return statusRank[s] > statusRank[acc] ? s : acc;
      }, 'operational');

      // UptimeDayStatus doesn't include 'maintenance' — treat it as 'operational'
      const uptimeDayStatus: UptimeDayStatus =
        worst === 'maintenance' ? 'operational' : worst;
      days.push({
        date: dateStr,
        status: uptimeDayStatus,
        uptimePct: statusToPct[worst],
      });
    }
  }

  return days;
}

function computeComponentUptime(days: UptimeDay[]): number {
  const dataDays = days.filter((d) => d.status !== 'nodata');
  if (dataDays.length === 0) return 100;
  const sum = dataDays.reduce((acc, d) => acc + d.uptimePct, 0);
  return sum / dataDays.length;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function safeFallback(): StatusPageData {
  return {
    components: [],
    activeIncident: null,
    upcomingMaint: [],
    incidentHistory: [],
    stats: {
      uptimePct: '100.00%',
      activeIncidents: 0,
      daysSinceIncident: null,
    },
  };
}

function computeDaysSinceIncident(
  incidentHistory: StatusIncidentRow[],
): number | null {
  if (incidentHistory.length === 0) return null;
  const mostRecent = incidentHistory[0];
  if (!mostRecent.resolved_at) return null;
  const resolvedAt = new Date(mostRecent.resolved_at);
  const now = new Date();
  const diffMs = now.getTime() - resolvedAt.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

// ---------------------------------------------------------------------------
// Main fetch
// ---------------------------------------------------------------------------

export async function fetchStatusPageData(): Promise<StatusPageData> {
  try {
    const supabase = await createClient();

    const [
      componentsResult,
      historyResult,
      activeIncidentResult,
      upcomingMaintResult,
      resolvedIncidentsResult,
    ] = await Promise.all([
      supabase
        .from('status_components')
        .select('*')
        .order('display_order', { ascending: true }),

      supabase
        .from('status_component_history')
        .select('*')
        .gt('recorded_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('component_id', { ascending: true })
        .order('recorded_at', { ascending: true }),

      supabase
        .from('status_incidents')
        .select('*')
        .is('resolved_at', null)
        .eq('is_maintenance', false)
        .order('started_at', { ascending: false })
        .limit(1),

      supabase
        .from('status_incidents')
        .select('*')
        .eq('is_maintenance', true)
        .gt('scheduled_end', new Date().toISOString())
        .order('scheduled_start', { ascending: true }),

      supabase
        .from('status_incidents')
        .select('*')
        .not('resolved_at', 'is', null)
        .eq('is_maintenance', false)
        .gt('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
        .order('resolved_at', { ascending: false })
        .limit(20),
    ]);

    if (
      componentsResult.error ||
      historyResult.error ||
      activeIncidentResult.error ||
      upcomingMaintResult.error ||
      resolvedIncidentsResult.error
    ) {
      console.error('Status page query error:', {
        components: componentsResult.error,
        history: historyResult.error,
        active: activeIncidentResult.error,
        maint: upcomingMaintResult.error,
        resolved: resolvedIncidentsResult.error,
      });
      return safeFallback();
    }

    const rawComponents = (componentsResult.data ?? []) as StatusComponentRow[];
    const history = (historyResult.data ?? []) as StatusComponentHistoryRow[];
    const activeIncident = (activeIncidentResult.data?.[0] ?? null) as StatusIncidentRow | null;
    const upcomingMaint = (upcomingMaintResult.data ?? []) as StatusIncidentRow[];
    const resolvedIncidents = (resolvedIncidentsResult.data ?? []) as StatusIncidentRow[];

    // Fetch updates for resolved incidents
    let incidentUpdates: StatusIncidentUpdateRow[] = [];
    if (resolvedIncidents.length > 0) {
      const incidentIds = resolvedIncidents.map((i) => i.id);
      const updatesResult = await supabase
        .from('status_incident_updates')
        .select('*')
        .in('incident_id', incidentIds)
        .order('created_at', { ascending: true });

      if (!updatesResult.error) {
        incidentUpdates = (updatesResult.data ?? []) as StatusIncidentUpdateRow[];
      }
    }

    // Build update map
    const updatesByIncident = new Map<string, StatusIncidentUpdateRow[]>();
    for (const update of incidentUpdates) {
      const existing = updatesByIncident.get(update.incident_id);
      if (existing) {
        existing.push(update);
      } else {
        updatesByIncident.set(update.incident_id, [update]);
      }
    }

    // Build components with uptime
    const components: StatusComponentWithUptime[] = rawComponents.map((c) => {
      const uptimeDays = computeUptimeDays(c.id, history);
      const uptimePct = computeComponentUptime(uptimeDays);
      return { ...c, uptimePct, uptimeDays };
    });

    // Build incident history
    const incidentHistory: StatusIncidentWithUpdates[] = resolvedIncidents.map((inc) => ({
      ...inc,
      updates: updatesByIncident.get(inc.id) ?? [],
    }));

    // Compute stats
    const overallUptimePct =
      components.length === 0
        ? 100
        : components.reduce((acc, c) => acc + c.uptimePct, 0) / components.length;

    const stats = {
      uptimePct: `${overallUptimePct.toFixed(2)}%`,
      activeIncidents: activeIncident ? 1 : 0,
      daysSinceIncident: computeDaysSinceIncident(resolvedIncidents),
    };

    return {
      components,
      activeIncident,
      upcomingMaint,
      incidentHistory,
      stats,
    };
  } catch (err) {
    console.error('fetchStatusPageData failed:', err);
    return safeFallback();
  }
}

