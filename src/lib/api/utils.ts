/**
 * Core API Utilities
 * Error handling, response formatting, validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';

// ===================
// ERROR CLASSES
// ===================

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }

  static badRequest(message: string, code?: string) {
    return new APIError(message, 400, code || 'BAD_REQUEST');
  }

  static unauthorized(message = 'Unauthorized') {
    return new APIError(message, 401, 'UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden') {
    return new APIError(message, 403, 'FORBIDDEN');
  }

  static notFound(message = 'Not found') {
    return new APIError(message, 404, 'NOT_FOUND');
  }

  static rateLimited(message = 'Rate limit exceeded') {
    return new APIError(message, 429, 'RATE_LIMITED');
  }

  static internal(message = 'Internal server error') {
    return new APIError(message, 500, 'INTERNAL_ERROR');
  }

  static usageLimitReached(message = 'Usage limit reached. Please upgrade.') {
    return new APIError(message, 403, 'USAGE_LIMIT_REACHED');
  }
}

// ===================
// RESPONSE HELPERS
// ===================

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    requestId?: string;
    timestamp?: string;
    usage?: {
      tokensUsed?: number;
      tokensInput?: number;
      tokensOutput?: number;
      tokensRaw?: number;
      tokensBilled?: number;
      multiplier?: number;
      creditsUsed?: number;
      remaining?: number;
    };
  };
}

export function successResponse<T>(
  data: T,
  meta?: APIResponse['meta'],
  status = 200
): NextResponse<APIResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta,
      },
    },
    { status }
  );
}

export function errorResponse(
  error: APIError | Error | unknown,
  requestId?: string
): NextResponse<APIResponse> {
  // Log error for debugging
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Validation error',
          code: 'VALIDATION_ERROR',
          details: { issues: error.errors },
        },
        meta: {
          requestId,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 400 }
    );
  }

  // Generic error
  return NextResponse.json(
    {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
      meta: {
        requestId,
        timestamp: new Date().toISOString(),
      },
    },
    { status: 500 }
  );
}

// Legacy alias for compatibility
export const handleAPIError = errorResponse;

// ===================
// VALIDATION HELPERS
// ===================

export async function parseBody<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  let body: unknown;
  try {
    // Clone the request so we can read the raw text on failure
    const cloned = req.clone();
    try {
      body = await req.json();
    } catch (jsonError) {
      const rawText = await cloned.text().catch(() => '<unreadable>');
      console.error('[parseBody] Failed to parse JSON:', jsonError instanceof Error ? jsonError.message : jsonError);
      console.error('[parseBody] Content-Type:', req.headers.get('content-type'));
      console.error('[parseBody] Method:', req.method, 'URL:', req.nextUrl.pathname);
      console.error('[parseBody] Body length:', rawText.length, 'Body preview:', rawText.slice(0, 200));
      throw new APIError('Invalid JSON body', 400, 'INVALID_JSON');
    }
  } catch (e) {
    if (e instanceof APIError) throw e;
    throw new APIError('Invalid JSON body', 400, 'INVALID_JSON');
  }
  try {
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new APIError(
        `Validation error: ${error.errors.map((e) => e.message).join(', ')}`,
        400,
        'VALIDATION_ERROR',
        { issues: error.errors }
      );
    }
    throw error;
  }
}

export function parseQuery<T>(
  req: NextRequest,
  schema: ZodSchema<T>
): T {
  const params = Object.fromEntries(req.nextUrl.searchParams);
  try {
    return schema.parse(params);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new APIError(
        `Invalid query parameters: ${error.errors.map((e) => e.message).join(', ')}`,
        400,
        'VALIDATION_ERROR',
        { issues: error.errors }
      );
    }
    throw error;
  }
}

// ===================
// REQUEST HELPERS
// ===================

export function getRequestId(req: NextRequest): string {
  return req.headers.get('x-request-id') || crypto.randomUUID();
}

export function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  );
}

export function getUserAgent(req: NextRequest): string {
  return req.headers.get('user-agent') || 'unknown';
}

// ===================
// API HANDLER WRAPPER
// ===================

type APIHandler = (
  req: NextRequest,
  context: { params: Record<string, string> }
) => Promise<NextResponse>;

interface HandlerOptions {
  cors?: boolean;
  logging?: boolean;
}

/**
 * Wraps an API handler with error handling and optional CORS
 */
export function withAPIHandler(
  handler: APIHandler,
  options: HandlerOptions = {}
): APIHandler {
  return async (req, context) => {
    const requestId = getRequestId(req);
    const startTime = Date.now();

    try {
      const response = await handler(req, context);

      // Add request ID to response
      response.headers.set('x-request-id', requestId);

      // Log if enabled
      if (options.logging !== false) {
        console.log({
          requestId,
          method: req.method,
          path: req.nextUrl.pathname,
          duration: Date.now() - startTime,
          status: response.status,
        });
      }

      return response;
    } catch (error) {
      return errorResponse(error, requestId);
    }
  };
}
