/**
 * Teams Bot Framework Authentication
 * Verifies JWT Bearer tokens from incoming Bot Framework webhook requests.
 *
 * Bot Framework tokens are JWTs signed by Microsoft. We verify against the
 * OpenID metadata at https://login.botframework.com/v1/.well-known/openidconfiguration
 *
 * Simplified verification:
 * - Fetch JWKS from Microsoft's published endpoint
 * - Verify signature, expiry, audience (app_id), and issuer
 * - Cache JWKS keys to avoid repeated fetches
 */

import crypto from 'crypto';

const OPENID_METADATA_URL =
  'https://login.botframework.com/v1/.well-known/openidconfiguration';

/** Valid issuers for Bot Framework tokens */
const VALID_ISSUERS = [
  'https://api.botframework.com',
  'https://sts.windows.net/d6d49420-f39b-4df7-a1dc-d59a935871db/',
  'https://login.microsoftonline.com/d6d49420-f39b-4df7-a1dc-d59a935871db/v2.0',
  'https://sts.windows.net/f8cdef31-a31e-4b4a-93e4-5f571e91255a/',
  'https://login.microsoftonline.com/f8cdef31-a31e-4b4a-93e4-5f571e91255a/v2.0',
];

// ── JWKS Cache ─────────────────────────────────────────────────────

interface JWK {
  kid: string;
  kty: string;
  n: string;
  e: string;
  x5c?: string[];
}

interface JWKSCache {
  keys: JWK[];
  fetchedAt: number;
}

let jwksCache: JWKSCache | null = null;
const JWKS_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch and cache JWKS keys from the Bot Framework OpenID configuration.
 */
async function getJWKS(): Promise<JWK[]> {
  if (jwksCache && Date.now() - jwksCache.fetchedAt < JWKS_CACHE_TTL_MS) {
    return jwksCache.keys;
  }

  try {
    // Step 1: Get OpenID config to find jwks_uri
    const configRes = await fetch(OPENID_METADATA_URL);
    if (!configRes.ok) {
      throw new Error(`Failed to fetch OpenID config: ${configRes.status}`);
    }
    const config = await configRes.json();
    const jwksUri = config.jwks_uri;

    if (!jwksUri) {
      throw new Error('No jwks_uri in OpenID configuration');
    }

    // Step 2: Fetch the actual JWKS
    const jwksRes = await fetch(jwksUri);
    if (!jwksRes.ok) {
      throw new Error(`Failed to fetch JWKS: ${jwksRes.status}`);
    }
    const jwks = await jwksRes.json();

    jwksCache = {
      keys: jwks.keys || [],
      fetchedAt: Date.now(),
    };

    return jwksCache.keys;
  } catch (error) {
    console.error('[Teams Auth] Failed to fetch JWKS:', error);
    // Return cached keys if available, even if stale
    if (jwksCache) return jwksCache.keys;
    throw error;
  }
}

// ── JWT Verification ───────────────────────────────────────────────

interface JWTHeader {
  alg: string;
  kid: string;
  typ?: string;
}

interface JWTPayload {
  iss: string;
  aud: string;
  exp: number;
  nbf?: number;
  iat?: number;
  serviceurl?: string;
  [key: string]: unknown;
}

/**
 * Base64url decode (JWT uses base64url, not standard base64).
 */
function base64urlDecode(str: string): Buffer {
  // Add padding
  const padded = str + '='.repeat((4 - (str.length % 4)) % 4);
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

/**
 * Build an RSA public key from JWK components (n, e).
 */
function jwkToPublicKey(jwk: JWK): crypto.KeyObject {
  // If x5c certificate chain is available, use it directly
  if (jwk.x5c && jwk.x5c.length > 0) {
    const cert = `-----BEGIN CERTIFICATE-----\n${jwk.x5c[0]}\n-----END CERTIFICATE-----`;
    return crypto.createPublicKey(cert);
  }

  // Otherwise build from n, e components
  const n = base64urlDecode(jwk.n);
  const e = base64urlDecode(jwk.e);

  // Build DER-encoded RSA public key
  const key = crypto.createPublicKey({
    key: {
      kty: 'RSA',
      n: jwk.n,
      e: jwk.e,
    },
    format: 'jwk',
  });

  return key;
}

/**
 * Verify a Bot Framework JWT token.
 *
 * @param authHeader - The full Authorization header value (e.g. "Bearer eyJ...")
 * @param appId - The Microsoft App ID to verify against the audience claim
 * @returns The decoded JWT payload if valid
 * @throws Error if the token is invalid or verification fails
 */
export async function verifyTeamsToken(
  authHeader: string,
  appId: string
): Promise<JWTPayload> {
  // Extract the Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header: missing Bearer prefix');
  }
  const token = authHeader.slice(7);

  // Split JWT into parts
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid JWT: expected 3 parts');
  }

  const [headerB64, payloadB64, signatureB64] = parts;

  // Decode header
  const header: JWTHeader = JSON.parse(base64urlDecode(headerB64).toString('utf8'));

  // Decode payload
  const payload: JWTPayload = JSON.parse(base64urlDecode(payloadB64).toString('utf8'));

  // ── Signature verification (must happen BEFORE trusting any claims) ──

  const jwks = await getJWKS();
  let signingKey = jwks.find((k) => k.kid === header.kid);

  if (!signingKey) {
    // Key not found — try refreshing cache once
    jwksCache = null;
    const refreshedKeys = await getJWKS();
    signingKey = refreshedKeys.find((k) => k.kid === header.kid);
    if (!signingKey) {
      throw new Error(`Signing key not found: kid=${header.kid}`);
    }
  }

  verifySignature(headerB64, payloadB64, signatureB64, signingKey, header.alg, payload);

  // ── Claim validation (only after signature is verified) ──

  const now = Math.floor(Date.now() / 1000);

  // Check expiry — reject tokens without exp claim
  if (!payload.exp || payload.exp < now) {
    throw new Error('Token expired');
  }

  // Check not-before
  if (payload.nbf && payload.nbf > now + 300) {
    // 5 min clock skew tolerance
    throw new Error('Token not yet valid');
  }

  // Check audience
  if (payload.aud !== appId) {
    throw new Error(`Invalid audience: expected ${appId}, got ${payload.aud}`);
  }

  // Check issuer
  if (!VALID_ISSUERS.includes(payload.iss)) {
    throw new Error(`Invalid issuer: ${payload.iss}`);
  }

  return payload;
}

/**
 * Verify the JWT signature against a specific key.
 */
function verifySignature(
  headerB64: string,
  payloadB64: string,
  signatureB64: string,
  jwk: JWK,
  algorithm: string,
  payload: JWTPayload
): JWTPayload {
  const publicKey = jwkToPublicKey(jwk);
  const signedData = `${headerB64}.${payloadB64}`;
  const signature = base64urlDecode(signatureB64);

  // Map JWT algorithm to Node.js algorithm
  const algMap: Record<string, string> = {
    RS256: 'RSA-SHA256',
    RS384: 'RSA-SHA384',
    RS512: 'RSA-SHA512',
  };
  const nodeAlg = algMap[algorithm];
  if (!nodeAlg) {
    throw new Error(`Unsupported JWT algorithm: ${algorithm}`);
  }

  const isValid = crypto.createVerify(nodeAlg).update(signedData).verify(publicKey, signature);

  if (!isValid) {
    throw new Error('Invalid JWT signature');
  }

  return payload;
}

/**
 * Clear the JWKS cache. Useful for testing.
 */
export function clearJWKSCache(): void {
  jwksCache = null;
}
