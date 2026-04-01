/**
 * Webhook URL Validation
 * Prevents SSRF by enforcing HTTPS, blocking private/reserved IPs,
 * and resolving DNS to detect rebinding attacks.
 */

import { resolve as dnsResolve } from 'dns/promises';

// ── Private / Reserved IP Ranges ──────────────────────────────────

/**
 * Returns true if the IPv4 address falls within a private or reserved range.
 * Checked ranges:
 *   - 0.0.0.0/8        (current network)
 *   - 10.0.0.0/8       (private)
 *   - 127.0.0.0/8      (loopback)
 *   - 169.254.0.0/16   (link-local / cloud metadata)
 *   - 172.16.0.0/12    (private)
 *   - 192.168.0.0/16   (private)
 *   - 100.64.0.0/10    (carrier-grade NAT)
 *   - 192.0.0.0/24     (IETF protocol assignments)
 *   - 192.0.2.0/24     (TEST-NET-1)
 *   - 198.51.100.0/24  (TEST-NET-2)
 *   - 203.0.113.0/24   (TEST-NET-3)
 *   - 224.0.0.0/4      (multicast)
 *   - 240.0.0.0/4      (reserved)
 *   - 255.255.255.255  (broadcast)
 */
function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some((p) => isNaN(p) || p < 0 || p > 255)) {
    return true; // Malformed — block
  }

  const [a, b] = parts;

  if (a === 0) return true;                              // 0.0.0.0/8
  if (a === 10) return true;                             // 10.0.0.0/8
  if (a === 127) return true;                            // 127.0.0.0/8
  if (a === 169 && b === 254) return true;               // 169.254.0.0/16
  if (a === 172 && b >= 16 && b <= 31) return true;      // 172.16.0.0/12
  if (a === 192 && b === 168) return true;               // 192.168.0.0/16
  if (a === 100 && b >= 64 && b <= 127) return true;     // 100.64.0.0/10
  if (a === 192 && b === 0 && parts[2] === 0) return true; // 192.0.0.0/24
  if (a === 192 && b === 0 && parts[2] === 2) return true; // 192.0.2.0/24
  if (a === 198 && b === 51 && parts[2] === 100) return true; // 198.51.100.0/24
  if (a === 203 && b === 0 && parts[2] === 113) return true;  // 203.0.113.0/24
  if (a >= 224) return true;                             // 224.0.0.0/4 + 240.0.0.0/4

  return false;
}

/**
 * Returns true if the IPv6 address is loopback or within private/reserved ranges.
 */
function isPrivateIPv6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1') return true;                   // loopback
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true; // fc00::/7 (ULA)
  if (normalized.startsWith('fe80')) return true;          // fe80::/10 (link-local)
  if (normalized === '::' || normalized === '::0') return true; // unspecified
  // IPv4-mapped IPv6 (::ffff:x.x.x.x)
  const v4Mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4Mapped) return isPrivateIPv4(v4Mapped[1]);
  return false;
}

/**
 * Returns true if an IP (v4 or v6) is private/reserved.
 */
function isPrivateIP(ip: string): boolean {
  if (ip.includes(':')) return isPrivateIPv6(ip);
  return isPrivateIPv4(ip);
}

// ── Blocked Hostnames ─────────────────────────────────────────────

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  '0.0.0.0',
  '[::1]',
  'metadata.google.internal',      // GCP metadata
  'metadata.internal',
]);

// ── Public API ────────────────────────────────────────────────────

export interface URLValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validates a webhook destination URL for SSRF safety.
 *
 * Checks:
 * 1. HTTPS protocol required
 * 2. No private/reserved hostnames
 * 3. DNS resolution — all resolved IPs must be public
 * 4. No cloud metadata endpoints (169.254.169.254 etc.)
 *
 * @param url - The URL string to validate
 * @returns Validation result with error message if invalid
 */
export async function validateWebhookURL(url: string): Promise<URLValidationResult> {
  // Parse URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }

  // Enforce HTTPS
  if (parsed.protocol !== 'https:') {
    return { valid: false, error: 'Webhook URL must use HTTPS' };
  }

  // Block known-bad hostnames
  const hostname = parsed.hostname.toLowerCase();
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return { valid: false, error: 'Webhook URL hostname is not allowed' };
  }

  // If hostname is an IP literal, check it directly
  const ipLiteral = hostname.replace(/^\[/, '').replace(/\]$/, '');
  if (isIPLiteral(hostname)) {
    if (isPrivateIP(ipLiteral)) {
      return { valid: false, error: 'Webhook URL must not point to a private or reserved IP address' };
    }
    return { valid: true };
  }

  // Resolve DNS and check all resulting IPs
  try {
    const addresses = await dnsResolve(hostname);
    if (!addresses.length) {
      return { valid: false, error: 'Webhook URL hostname did not resolve to any IP address' };
    }
    for (const addr of addresses) {
      if (isPrivateIP(addr)) {
        return {
          valid: false,
          error: 'Webhook URL hostname resolves to a private or reserved IP address',
        };
      }
    }
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOTFOUND' || code === 'ENODATA') {
      return { valid: false, error: 'Webhook URL hostname could not be resolved' };
    }
    // For transient DNS errors, fail closed (block)
    return { valid: false, error: 'DNS resolution failed for webhook URL' };
  }

  return { valid: true };
}

/**
 * Simple check for whether a hostname string is an IP literal (v4 or bracketed v6).
 */
function isIPLiteral(hostname: string): boolean {
  // IPv6 bracket notation
  if (hostname.startsWith('[') && hostname.endsWith(']')) return true;
  // IPv4: all digits and dots
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) return true;
  return false;
}
