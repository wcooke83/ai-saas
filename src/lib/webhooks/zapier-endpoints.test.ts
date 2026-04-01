import { describe, it, expect } from 'vitest';
import { WEBHOOK_EVENT_NAMES, type WebhookEvent } from './types';
import { SAMPLE_PAYLOADS } from './sample-data';

// ── Event Names ──────────────────────────────────────────────────

describe('WEBHOOK_EVENT_NAMES', () => {
  const EXPECTED_EVENTS = [
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
  ];

  it('contains exactly 10 event types', () => {
    expect(WEBHOOK_EVENT_NAMES).toHaveLength(10);
  });

  it.each(EXPECTED_EVENTS)('includes %s', (event) => {
    expect(WEBHOOK_EVENT_NAMES).toContain(event);
  });
});

// ── Sample Payloads ──────────────────────────────────────────────

describe('SAMPLE_PAYLOADS', () => {
  it('has a sample for every defined event', () => {
    for (const event of WEBHOOK_EVENT_NAMES) {
      expect(SAMPLE_PAYLOADS).toHaveProperty(event);
    }
  });

  it('every sample is a non-empty array', () => {
    for (const event of WEBHOOK_EVENT_NAMES) {
      const samples = SAMPLE_PAYLOADS[event];
      expect(Array.isArray(samples)).toBe(true);
      expect(samples.length).toBeGreaterThan(0);
    }
  });

  it('every sample has the correct envelope structure', () => {
    for (const event of WEBHOOK_EVENT_NAMES) {
      for (const sample of SAMPLE_PAYLOADS[event]) {
        expect(sample).toHaveProperty('event', event);
        expect(sample).toHaveProperty('chatbot_id');
        expect(sample).toHaveProperty('timestamp');
        expect(sample).toHaveProperty('delivery_id');
        expect(sample).toHaveProperty('version', 'v1');
        expect(sample).toHaveProperty('data');
        expect(typeof sample.data).toBe('object');
      }
    }
  });

  it('conversation.started sample has required fields', () => {
    const sample = SAMPLE_PAYLOADS['conversation.started'][0];
    expect(sample.data).toHaveProperty('conversation_id');
    expect(sample.data).toHaveProperty('session_id');
    expect(sample.data).toHaveProperty('chatbot_name');
    expect(sample.data).toHaveProperty('channel');
  });

  it('message.received sample has message object with required fields', () => {
    const sample = SAMPLE_PAYLOADS['message.received'][0];
    expect(sample.data).toHaveProperty('conversation_id');
    expect(sample.data.message).toHaveProperty('id');
    expect(sample.data.message).toHaveProperty('role');
    expect(sample.data.message).toHaveProperty('content');
    expect(sample.data.message).toHaveProperty('created_at');
  });

  it('lead.captured sample has form_data', () => {
    const sample = SAMPLE_PAYLOADS['lead.captured'][0];
    expect(sample.data).toHaveProperty('lead_id');
    expect(sample.data).toHaveProperty('form_data');
    expect(typeof sample.data.form_data).toBe('object');
  });

  it('ticket.created sample has contact fields', () => {
    const sample = SAMPLE_PAYLOADS['ticket.created'][0];
    expect(sample.data).toHaveProperty('ticket_id');
    expect(sample.data).toHaveProperty('name');
    expect(sample.data).toHaveProperty('email');
    expect(sample.data).toHaveProperty('subject');
    expect(sample.data).toHaveProperty('message');
  });

  it('knowledge.updated sample has source details', () => {
    const sample = SAMPLE_PAYLOADS['knowledge.updated'][0];
    expect(sample.data).toHaveProperty('source_id');
    expect(sample.data).toHaveProperty('source_type');
    expect(sample.data).toHaveProperty('action');
    expect(['added', 'updated', 'deleted']).toContain(sample.data.action);
  });

  it('escalation.requested sample has reason', () => {
    const sample = SAMPLE_PAYLOADS['escalation.requested'][0];
    expect(sample.data).toHaveProperty('conversation_id');
    expect(sample.data).toHaveProperty('escalation_id');
    expect(sample.data).toHaveProperty('reason');
  });

  it('handoff.started sample has handoff_id', () => {
    const sample = SAMPLE_PAYLOADS['handoff.started'][0];
    expect(sample.data).toHaveProperty('handoff_id');
    expect(sample.data).toHaveProperty('reason');
  });

  it('handoff.resolved sample has resolution details', () => {
    const sample = SAMPLE_PAYLOADS['handoff.resolved'][0];
    expect(sample.data).toHaveProperty('handoff_id');
    expect(sample.data).toHaveProperty('resolved_at');
  });

  it('conversation.ended sample has duration info', () => {
    const sample = SAMPLE_PAYLOADS['conversation.ended'][0];
    expect(sample.data).toHaveProperty('message_count');
    expect(sample.data).toHaveProperty('duration_seconds');
    expect(typeof sample.data.message_count).toBe('number');
    expect(typeof sample.data.duration_seconds).toBe('number');
  });
});

// ── Type Safety ──────────────────────────────────────────────────

describe('type consistency', () => {
  it('SAMPLE_PAYLOADS keys match WEBHOOK_EVENT_NAMES exactly', () => {
    const sampleKeys = Object.keys(SAMPLE_PAYLOADS).sort();
    const eventNames = [...WEBHOOK_EVENT_NAMES].sort();
    expect(sampleKeys).toEqual(eventNames);
  });

  it('no extra keys in SAMPLE_PAYLOADS', () => {
    const sampleKeys = Object.keys(SAMPLE_PAYLOADS);
    for (const key of sampleKeys) {
      expect(WEBHOOK_EVENT_NAMES).toContain(key as WebhookEvent);
    }
  });
});
