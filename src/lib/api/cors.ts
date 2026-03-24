/**
 * CORS Utilities
 * For enabling cross-origin access to APIs (embeddable tools)
 */

import { NextRequest, NextResponse } from 'next/server';

export interface CORSOptions {
  allowedOrigins?: string[] | '*';
  allowedMethods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultOptions: CORSOptions = {
  allowedOrigins: '*', // Configure per-environment
  allowedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-API-Key',
    'X-Request-ID',
    'X-Tool-ID',
  ],
  exposedHeaders: ['X-Request-ID', 'X-RateLimit-Remaining'],
  credentials: false,
  maxAge: 86400, // 24 hours
};

/**
 * Get CORS headers based on request origin
 */
export function getCORSHeaders(
  req: NextRequest,
  options: CORSOptions = {}
): Headers {
  const opts = { ...defaultOptions, ...options };
  const headers = new Headers();
  const origin = req.headers.get('origin');

  // Handle allowed origins
  if (opts.allowedOrigins === '*') {
    headers.set('Access-Control-Allow-Origin', '*');
  } else if (origin && opts.allowedOrigins?.includes(origin)) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Vary', 'Origin');
  }

  // Other CORS headers
  if (opts.allowedMethods) {
    headers.set('Access-Control-Allow-Methods', opts.allowedMethods.join(', '));
  }

  if (opts.allowedHeaders) {
    headers.set('Access-Control-Allow-Headers', opts.allowedHeaders.join(', '));
  }

  if (opts.exposedHeaders) {
    headers.set('Access-Control-Expose-Headers', opts.exposedHeaders.join(', '));
  }

  if (opts.credentials) {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (opts.maxAge) {
    headers.set('Access-Control-Max-Age', opts.maxAge.toString());
  }

  return headers;
}

/**
 * Handle OPTIONS preflight request
 */
export function handlePreflight(
  req: NextRequest,
  options?: CORSOptions
): NextResponse {
  const headers = getCORSHeaders(req, options);
  return new NextResponse(null, { status: 204, headers });
}

/**
 * Add CORS headers to existing response
 */
export function withCORS(
  response: NextResponse,
  req: NextRequest,
  options?: CORSOptions
): NextResponse {
  const corsHeaders = getCORSHeaders(req, options);

  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Middleware-style CORS wrapper for API routes
 */
export function corsMiddleware(options?: CORSOptions) {
  return (handler: (req: NextRequest) => Promise<NextResponse>) => {
    return async (req: NextRequest): Promise<NextResponse> => {
      // Handle preflight
      if (req.method === 'OPTIONS') {
        return handlePreflight(req, options);
      }

      // Execute handler and add CORS headers
      const response = await handler(req);
      return withCORS(response, req, options);
    };
  };
}

/**
 * Resolve CORS origin for a chatbot based on its allowed_origins config.
 * - null/undefined/empty = allow all (wildcard, backwards compatible)
 * - If request origin is in the list, reflect it back
 * - Otherwise return the first allowed origin (browser will block the mismatch)
 */
export function getChatbotCorsOrigin(
  allowedOrigins: string[] | null | undefined,
  requestOrigin: string | null
): string {
  if (!allowedOrigins || allowedOrigins.length === 0) return '*';
  if (requestOrigin && allowedOrigins.includes(requestOrigin)) return requestOrigin;
  return allowedOrigins[0];
}

/**
 * Environment-based CORS configuration
 */
export function getProductionCORSOptions(): CORSOptions {
  const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];

  return {
    ...defaultOptions,
    allowedOrigins:
      process.env.NODE_ENV === 'production' ? allowedOrigins : '*',
  };
}
