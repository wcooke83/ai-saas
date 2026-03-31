/**
 * Webhook Type Definitions
 * Defines event types, payload shapes, and subscription types.
 */

// ── Event Names ────────────────────────────────────────────────────

export const WEBHOOK_EVENT_NAMES = [
  'conversation.started',
  'conversation.ended',
  'message.received',
  'message.sent',
  'escalation.requested',
  'handoff.started',
  'handoff.resolved',
  'knowledge.updated',
  'lead.captured',
  'ticket.created',
] as const;

export type WebhookEvent = (typeof WEBHOOK_EVENT_NAMES)[number];

// ── Payload Envelope ───────────────────────────────────────────────

export interface WebhookEnvelope<T = Record<string, unknown>> {
  event: WebhookEvent;
  chatbot_id: string;
  timestamp: string;
  delivery_id: string;
  version: 'v1';
  data: T;
}

// ── Event-Specific Data Shapes ─────────────────────────────────────

export interface ConversationStartedData {
  conversation_id: string;
  session_id: string;
  chatbot_name: string;
  channel: string;
  visitor?: { id?: string; name?: string; email?: string };
}

export interface ConversationEndedData {
  conversation_id: string;
  session_id: string;
  message_count: number;
  duration_seconds: number;
}

export interface MessageData {
  conversation_id: string;
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  };
  visitor?: { id?: string; name?: string; email?: string };
}

export interface EscalationRequestedData {
  conversation_id: string;
  escalation_id: string;
  session_id: string;
  reason: string;
  details?: string;
  visitor?: { name?: string; email?: string };
}

export interface HandoffStartedData {
  conversation_id: string;
  handoff_id: string;
  reason: string;
  visitor?: { name?: string; email?: string };
}

export interface HandoffResolvedData {
  conversation_id: string;
  handoff_id: string;
  agent_name: string | null;
  resolved_at: string;
}

export interface KnowledgeUpdatedData {
  source_id: string;
  source_type: string;
  source_name: string;
  action: 'added' | 'updated' | 'deleted';
  chunk_count?: number;
}

export interface LeadCapturedData {
  lead_id: string;
  session_id: string | null;
  form_data: Record<string, string>;
}

export interface TicketCreatedData {
  ticket_id: string;
  chatbot_name: string;
  name: string;
  email: string;
  subject: string;
  message: string;
}

// ── Payload Type Map ───────────────────────────────────────────────

export interface WebhookPayloadMap {
  'conversation.started': ConversationStartedData;
  'conversation.ended': ConversationEndedData;
  'message.received': MessageData;
  'message.sent': MessageData;
  'escalation.requested': EscalationRequestedData;
  'handoff.started': HandoffStartedData;
  'handoff.resolved': HandoffResolvedData;
  'knowledge.updated': KnowledgeUpdatedData;
  'lead.captured': LeadCapturedData;
  'ticket.created': TicketCreatedData;
}

// ── Subscription ───────────────────────────────────────────────────

export interface WebhookSubscription {
  id: string;
  user_id: string;
  chatbot_id: string | null;
  url: string;
  secret: string;
  events: WebhookEvent[];
  is_active: boolean;
  failure_count: number;
  last_triggered_at: string | null;
  created_at: string;
  updated_at: string | null;
}

// ── Delivery Result ────────────────────────────────────────────────

export interface DeliveryResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  attempts: number;
  deliveryId: string;
}
