// ── Database enum mirrors ────────────────────────────────────────────────────

export type ComponentStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';
export type IncidentStatus  = 'investigating' | 'identified' | 'monitoring' | 'resolved';
export type UpdateStatus    = 'Investigating' | 'Identified' | 'Monitoring' | 'Resolved';

// ── Raw DB row types ─────────────────────────────────────────────────────────

export interface StatusComponentRow {
  id:            string;
  name:          string;
  slug:          string;
  category:      string;
  display_order: number;
  status:        ComponentStatus;
  updated_at:    string;
}

export interface StatusComponentHistoryRow {
  id:           string;
  component_id: string;
  status:       ComponentStatus;
  recorded_at:  string;
}

export interface StatusIncidentRow {
  id:                  string;
  title:               string;
  status:              IncidentStatus;
  is_maintenance:      boolean;
  affected_components: string[];
  scheduled_start:     string | null;
  scheduled_end:       string | null;
  started_at:          string;
  resolved_at:         string | null;
  created_at:          string;
  updated_at:          string;
}

export interface StatusIncidentUpdateRow {
  id:          string;
  incident_id: string;
  message:     string;
  status:      UpdateStatus;
  created_at:  string;
}

// ── Enriched view types (used by public status page) ─────────────────────────

export type UptimeDayStatus = 'operational' | 'degraded' | 'outage' | 'nodata';

export interface UptimeDay {
  date:        string; // 'YYYY-MM-DD'
  status:      UptimeDayStatus;
  uptimePct:   number; // 0–100 for height variation in breath bars
}

export interface StatusComponentWithUptime extends StatusComponentRow {
  uptimePct:  number;      // 0–100, computed from last 90 days of history
  uptimeDays: UptimeDay[]; // 90 entries, oldest first
}

export interface StatusIncidentWithUpdates extends StatusIncidentRow {
  updates: StatusIncidentUpdateRow[];
}

// ── Page data bundle ─────────────────────────────────────────────────────────

export interface StatusPageData {
  components:      StatusComponentWithUptime[];
  activeIncident:  StatusIncidentRow | null;
  upcomingMaint:   StatusIncidentRow[];
  incidentHistory: StatusIncidentWithUpdates[];
  stats: {
    uptimePct:        string; // e.g. "99.97%"
    activeIncidents:  number;
    daysSinceIncident: number | null; // null if no incidents in 90 days
  };
}

// ── Admin form input types ───────────────────────────────────────────────────

export interface CreateIncidentInput {
  title:               string;
  affected_components: string[];
  initial_message:     string;
  initial_status:      UpdateStatus;
}

export interface AddIncidentUpdateInput {
  message: string;
  status:  UpdateStatus;
}

export interface CreateMaintenanceInput {
  title:               string;
  description:         string;
  affected_components: string[];
  scheduled_start:     string; // ISO datetime string
  scheduled_end:       string; // ISO datetime string
}
