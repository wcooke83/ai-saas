# API Route Skill

Scaffold Next.js API routes with auth, validation, rate limiting, and error handling.

## Trigger
`/api-route` or `/api`

## Arguments
- `name`: Route name (e.g., "generate", "webhook/stripe")
- `--method`: `GET` | `POST` | `PUT` | `PATCH` | `DELETE` (default: POST)
- `--auth`: `required` | `optional` | `none` (default: required)
- `--rate-limit`: requests per minute (default: 60)
- `--type`: `standard` | `webhook` | `streaming` | `upload`

## Instructions

When invoked:

1. **Generate route file**:
   ```
   src/app/api/[name]/route.ts
   ```

2. **Include middleware**:
   - Auth verification (Supabase)
   - Rate limiting (upstash or in-memory)
   - Input validation (zod)
   - Error handling wrapper

3. **Generate types**:
   ```
   src/types/api/[name].ts
   ```

## Route Templates

### Standard Protected Route
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { rateLimit } from '@/lib/rate-limit';
import { APIError, handleAPIError } from '@/lib/api-utils';

// Input validation schema
const requestSchema = z.object({
  // Define your input schema
  prompt: z.string().min(1).max(5000),
  options: z.object({
    tone: z.enum(['professional', 'casual', 'friendly']).optional(),
  }).optional(),
});

// Response type
export type GenerateResponse = {
  success: boolean;
  data?: {
    result: string;
    tokensUsed: number;
  };
  error?: string;
};

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const { success: withinLimit } = await rateLimit(ip, 60); // 60 req/min

    if (!withinLimit) {
      throw new APIError('Rate limit exceeded', 429);
    }

    // 2. Auth check
    const supabase = createClient();
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      throw new APIError('Unauthorized', 401);
    }

    // 3. Parse and validate input
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      throw new APIError(`Invalid input: ${parsed.error.message}`, 400);
    }

    const { prompt, options } = parsed.data;

    // 4. Check usage limits
    const { data: usage } = await supabase
      .from('usage')
      .select('credits_used, credits_limit')
      .eq('user_id', session.user.id)
      .single();

    if (usage && usage.credits_used >= usage.credits_limit) {
      throw new APIError('Usage limit reached. Please upgrade.', 403);
    }

    // 5. Business logic here
    // const result = await generateContent(prompt, options);

    // 6. Update usage
    await supabase
      .from('usage')
      .update({ credits_used: (usage?.credits_used || 0) + 1 })
      .eq('user_id', session.user.id);

    // 7. Return response
    return NextResponse.json({
      success: true,
      data: {
        result: 'Generated content here',
        tokensUsed: 100,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

### Streaming Route (for AI responses)
```tsx
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { StreamingTextResponse } from 'ai';
import { anthropic } from '@/lib/ai/anthropic';

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { prompt, systemPrompt } = await req.json();

  // Create streaming response
  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    stream: true,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  // Return streaming response
  return new StreamingTextResponse(response);
}
```

### Webhook Route (Stripe example)
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed');
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      // Update user subscription
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.metadata?.userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          plan: session.metadata?.plan,
        });
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      // Handle failed payment - notify user, update status
      break;
    }
  }

  return NextResponse.json({ received: true });
}
```

### File Upload Route
```tsx
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { APIError, handleAPIError } from '@/lib/api-utils';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'text/csv'];

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      throw new APIError('No file provided', 400);
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new APIError('File too large. Max 10MB.', 400);
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new APIError('Invalid file type', 400);
    }

    // Upload to Supabase Storage
    const fileName = `${session.user.id}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file);

    if (error) {
      throw new APIError('Upload failed', 500);
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(fileName);

    return NextResponse.json({
      success: true,
      data: {
        path: data.path,
        url: publicUrl,
      },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

## Utility Files to Generate

### API Utils (`src/lib/api-utils.ts`)
```tsx
import { NextResponse } from 'next/server';

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleAPIError(error: unknown) {
  console.error('API Error:', error);

  if (error instanceof APIError) {
    return NextResponse.json(
      { success: false, error: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  return NextResponse.json(
    { success: false, error: 'Internal server error' },
    { status: 500 }
  );
}
```

### Rate Limiter (`src/lib/rate-limit.ts`)
```tsx
// Simple in-memory rate limiter (use Upstash for production)
const requests = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now();
  const record = requests.get(identifier);

  if (!record || now > record.resetTime) {
    requests.set(identifier, { count: 1, resetTime: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}
```

## Example Usage

```
/api-route generate --method POST --auth required --rate-limit 30
/api-route webhook/stripe --type webhook --auth none
/api-route chat --type streaming --auth required
/api-route upload --type upload --auth required
/api-route users/[id] --method GET --auth required
```

## Output Checklist

- [ ] Zod schema for input validation
- [ ] TypeScript types for request/response
- [ ] Auth middleware applied
- [ ] Rate limiting configured
- [ ] Error handling with APIError
- [ ] Usage tracking if applicable
- [ ] Proper HTTP status codes
- [ ] Request logging (optional)
