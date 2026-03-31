/**
 * Sample Webhook Payloads
 * Used by Zapier perform_list to populate field mappings.
 */

import type { WebhookEvent, WebhookPayloadMap } from './types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyEnvelope = { event: WebhookEvent; chatbot_id: string; timestamp: string; delivery_id: string; version: 'v1'; data: any };

const SAMPLE_CHATBOT_ID = '00000000-0000-0000-0000-000000000001';
const SAMPLE_CONVERSATION_ID = '00000000-0000-0000-0000-000000000002';
const SAMPLE_SESSION_ID = 'sess_abc123';
const SAMPLE_TIMESTAMP = '2026-03-31T12:00:00.000Z';

function envelope<E extends WebhookEvent>(
  event: E,
  data: WebhookPayloadMap[E],
): AnyEnvelope {
  return {
    event,
    chatbot_id: SAMPLE_CHATBOT_ID,
    timestamp: SAMPLE_TIMESTAMP,
    delivery_id: '00000000-0000-0000-0000-000000000099',
    version: 'v1',
    data,
  };
}

export const SAMPLE_PAYLOADS: Record<WebhookEvent, AnyEnvelope[]> = {
  'conversation.started': [
    envelope('conversation.started', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      session_id: SAMPLE_SESSION_ID,
      chatbot_name: 'Support Bot',
      channel: 'widget',
      visitor: { id: 'vis_123', name: 'Jane Doe', email: 'jane@example.com' },
    }),
  ],

  'conversation.ended': [
    envelope('conversation.ended', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      session_id: SAMPLE_SESSION_ID,
      message_count: 8,
      duration_seconds: 245,
    }),
  ],

  'message.received': [
    envelope('message.received', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      message: {
        id: '00000000-0000-0000-0000-000000000003',
        role: 'user',
        content: 'What are your business hours?',
        created_at: SAMPLE_TIMESTAMP,
      },
      visitor: { id: 'vis_123', name: 'Jane Doe', email: 'jane@example.com' },
    }),
  ],

  'message.sent': [
    envelope('message.sent', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      message: {
        id: '00000000-0000-0000-0000-000000000004',
        role: 'assistant',
        content: 'Our business hours are Monday through Friday, 9 AM to 5 PM EST.',
        created_at: SAMPLE_TIMESTAMP,
      },
    }),
  ],

  'escalation.requested': [
    envelope('escalation.requested', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      escalation_id: '00000000-0000-0000-0000-000000000005',
      session_id: SAMPLE_SESSION_ID,
      reason: 'need_human_help',
      details: 'I need to speak with someone about a billing issue.',
      visitor: { name: 'Jane Doe', email: 'jane@example.com' },
    }),
  ],

  'handoff.started': [
    envelope('handoff.started', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      handoff_id: '00000000-0000-0000-0000-000000000006',
      reason: 'need_human_help',
      visitor: { name: 'Jane Doe', email: 'jane@example.com' },
    }),
  ],

  'handoff.resolved': [
    envelope('handoff.resolved', {
      conversation_id: SAMPLE_CONVERSATION_ID,
      handoff_id: '00000000-0000-0000-0000-000000000006',
      agent_name: 'Alex',
      resolved_at: SAMPLE_TIMESTAMP,
    }),
  ],

  'knowledge.updated': [
    envelope('knowledge.updated', {
      source_id: '00000000-0000-0000-0000-000000000007',
      source_type: 'url',
      source_name: 'https://example.com/faq',
      action: 'updated',
      chunk_count: 42,
    }),
  ],

  'lead.captured': [
    envelope('lead.captured', {
      lead_id: '00000000-0000-0000-0000-000000000008',
      session_id: SAMPLE_SESSION_ID,
      form_data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        company: 'Acme Corp',
      },
    }),
  ],

  'ticket.created': [
    envelope('ticket.created', {
      ticket_id: '00000000-0000-0000-0000-000000000009',
      chatbot_name: 'Support Bot',
      name: 'Jane Doe',
      email: 'jane@example.com',
      subject: 'Billing question',
      message: 'I was charged twice for my subscription last month.',
    }),
  ],
};
