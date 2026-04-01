import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validateWebhookURL } from './url-validation';

// Mock dns/promises to avoid real DNS lookups in tests
vi.mock('dns/promises', () => ({
  resolve: vi.fn().mockResolvedValue(['93.184.216.34']),
}));

import { resolve as dnsResolve } from 'dns/promises';
const mockDnsResolve = vi.mocked(dnsResolve);

beforeEach(() => {
  mockDnsResolve.mockReset();
  mockDnsResolve.mockResolvedValue(['93.184.216.34']);
});

// ── Protocol ─────────────────────────────────────────────────────

describe('protocol enforcement', () => {
  it('accepts HTTPS URLs', async () => {
    const result = await validateWebhookURL('https://example.com/webhook');
    expect(result.valid).toBe(true);
  });

  it('rejects HTTP URLs', async () => {
    const result = await validateWebhookURL('http://example.com/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/HTTPS/i);
  });

  it('rejects FTP URLs', async () => {
    const result = await validateWebhookURL('ftp://example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('rejects invalid URL format', async () => {
    const result = await validateWebhookURL('not-a-url');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/Invalid URL/i);
  });

  it('rejects empty string', async () => {
    const result = await validateWebhookURL('');
    expect(result.valid).toBe(false);
  });
});

// ── Blocked Hostnames ────────────────────────────────────────────

describe('blocked hostnames', () => {
  it('blocks localhost', async () => {
    const result = await validateWebhookURL('https://localhost/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/not allowed/i);
  });

  it('blocks localhost.localdomain', async () => {
    const result = await validateWebhookURL('https://localhost.localdomain/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 0.0.0.0', async () => {
    const result = await validateWebhookURL('https://0.0.0.0/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks [::1]', async () => {
    const result = await validateWebhookURL('https://[::1]/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks GCP metadata hostname', async () => {
    const result = await validateWebhookURL('https://metadata.google.internal/webhook');
    expect(result.valid).toBe(false);
  });
});

// ── Private IPv4 Ranges ──────────────────────────────────────────

describe('private IPv4 blocking', () => {
  it('blocks 10.x.x.x (private)', async () => {
    const result = await validateWebhookURL('https://10.0.0.1/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/private/i);
  });

  it('blocks 172.16.x.x (private)', async () => {
    const result = await validateWebhookURL('https://172.16.0.1/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 172.31.x.x (private)', async () => {
    const result = await validateWebhookURL('https://172.31.255.255/webhook');
    expect(result.valid).toBe(false);
  });

  it('allows 172.32.x.x (public)', async () => {
    mockDnsResolve.mockResolvedValue(['172.32.0.1']);
    const result = await validateWebhookURL('https://172.32.0.1/webhook');
    expect(result.valid).toBe(true);
  });

  it('blocks 192.168.x.x (private)', async () => {
    const result = await validateWebhookURL('https://192.168.1.1/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 127.x.x.x (loopback)', async () => {
    const result = await validateWebhookURL('https://127.0.0.1/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 127.0.0.2 (loopback)', async () => {
    const result = await validateWebhookURL('https://127.0.0.2/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 169.254.x.x (link-local / cloud metadata)', async () => {
    const result = await validateWebhookURL('https://169.254.169.254/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks 100.64.x.x (carrier-grade NAT)', async () => {
    const result = await validateWebhookURL('https://100.64.0.1/webhook');
    expect(result.valid).toBe(false);
  });
});

// ── DNS Rebinding Prevention ─────────────────────────────────────

describe('DNS resolution checks', () => {
  it('blocks hostname resolving to private IP', async () => {
    mockDnsResolve.mockResolvedValue(['10.0.0.1']);
    const result = await validateWebhookURL('https://evil.example.com/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/private/i);
  });

  it('blocks hostname resolving to loopback', async () => {
    mockDnsResolve.mockResolvedValue(['127.0.0.1']);
    const result = await validateWebhookURL('https://evil.example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks hostname resolving to link-local', async () => {
    mockDnsResolve.mockResolvedValue(['169.254.169.254']);
    const result = await validateWebhookURL('https://evil.example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('allows hostname resolving to public IP', async () => {
    mockDnsResolve.mockResolvedValue(['93.184.216.34']);
    const result = await validateWebhookURL('https://example.com/webhook');
    expect(result.valid).toBe(true);
  });

  it('blocks when any resolved IP is private', async () => {
    mockDnsResolve.mockResolvedValue(['93.184.216.34', '10.0.0.1']);
    const result = await validateWebhookURL('https://mixed.example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('rejects unresolvable hostname (ENOTFOUND)', async () => {
    const err = new Error('getaddrinfo ENOTFOUND') as NodeJS.ErrnoException;
    err.code = 'ENOTFOUND';
    mockDnsResolve.mockRejectedValue(err);
    const result = await validateWebhookURL('https://nonexistent.invalid/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/could not be resolved/i);
  });

  it('fails closed on transient DNS errors', async () => {
    const err = new Error('DNS timeout') as NodeJS.ErrnoException;
    err.code = 'ETIMEOUT';
    mockDnsResolve.mockRejectedValue(err);
    const result = await validateWebhookURL('https://slow-dns.example.com/webhook');
    expect(result.valid).toBe(false);
    expect(result.error).toMatch(/DNS resolution failed/i);
  });

  it('rejects when DNS returns empty array', async () => {
    mockDnsResolve.mockResolvedValue([]);
    const result = await validateWebhookURL('https://empty-dns.example.com/webhook');
    expect(result.valid).toBe(false);
  });
});

// ── IPv6 ─────────────────────────────────────────────────────────

describe('IPv6 blocking', () => {
  it('blocks fc00::/7 (unique local)', async () => {
    mockDnsResolve.mockResolvedValue(['fc00::1']);
    const result = await validateWebhookURL('https://evil-v6.example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks fd::/8 (unique local)', async () => {
    mockDnsResolve.mockResolvedValue(['fd12::1']);
    const result = await validateWebhookURL('https://evil-v6.example.com/webhook');
    expect(result.valid).toBe(false);
  });

  it('blocks fe80::/10 (link-local)', async () => {
    mockDnsResolve.mockResolvedValue(['fe80::1']);
    const result = await validateWebhookURL('https://evil-v6.example.com/webhook');
    expect(result.valid).toBe(false);
  });
});

// ── Valid Public URLs ────────────────────────────────────────────

describe('valid public URLs', () => {
  it('accepts standard HTTPS URL', async () => {
    const result = await validateWebhookURL('https://hooks.zapier.com/hooks/catch/123/abc/');
    expect(result.valid).toBe(true);
  });

  it('accepts URL with port', async () => {
    const result = await validateWebhookURL('https://example.com:8443/webhook');
    expect(result.valid).toBe(true);
  });

  it('accepts URL with path and query', async () => {
    const result = await validateWebhookURL('https://example.com/api/v1/webhook?key=abc');
    expect(result.valid).toBe(true);
  });
});
