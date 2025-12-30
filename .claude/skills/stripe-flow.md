# Stripe Flow Skill

Generate Stripe integration for subscriptions, one-time payments, and usage-based billing.

## Trigger
`/stripe-flow` or `/stripe`

## Arguments
- `action`: `init` | `checkout` | `portal` | `webhook` | `usage`
- `--type`: `subscription` | `one-time` | `usage-based`

## Actions

### `init` - Initialize Stripe setup
Creates all necessary files and configurations

### `checkout` - Create checkout session
Generates checkout flow for payments

### `portal` - Customer portal
Creates billing portal redirect

### `webhook` - Webhook handler
Generates webhook endpoint for Stripe events

### `usage` - Usage-based billing
Sets up metered billing

## Instructions

When invoked:

1. **Generate files**:
   ```
   src/lib/stripe/client.ts         # Stripe client
   src/lib/stripe/plans.ts          # Plan definitions
   src/app/api/stripe/checkout/route.ts
   src/app/api/stripe/webhook/route.ts
   src/app/api/stripe/portal/route.ts
   src/components/pricing/PricingCard.tsx
   ```

2. **Configure**:
   - Set up products/prices in Stripe Dashboard
   - Add webhook endpoint in Stripe Dashboard
   - Store webhook secret in env

## File Templates

### Stripe Client (`src/lib/stripe/client.ts`)
```typescript
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
});
```

### Plan Definitions (`src/lib/stripe/plans.ts`)
```typescript
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe Price ID
  features: string[];
  limits: {
    credits: number;
    // Add more limits as needed
  };
  popular?: boolean;
}

export const PLANS: Record<string, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'For trying things out',
    price: 0,
    priceId: '', // No Stripe price for free
    features: [
      '10 generations per month',
      'Basic templates',
      'Email support',
    ],
    limits: {
      credits: 10,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      'Unlimited generations',
      'All templates',
      'Priority support',
      'API access',
      'Export options',
    ],
    limits: {
      credits: -1, // Unlimited
    },
    popular: true,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams',
    price: 99,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee',
    ],
    limits: {
      credits: -1,
    },
  },
};

export function getPlan(planId: string): Plan | undefined {
  return PLANS[planId];
}

export function getPlanByPriceId(priceId: string): Plan | undefined {
  return Object.values(PLANS).find((plan) => plan.priceId === priceId);
}
```

### Checkout Session (`src/app/api/stripe/checkout/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { PLANS } from '@/lib/stripe/plans';
import { APIError, handleAPIError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const { planId } = await req.json();
    const plan = PLANS[planId];

    if (!plan || !plan.priceId) {
      throw new APIError('Invalid plan', 400);
    }

    // Get or create Stripe customer
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID
      await supabase
        .from('subscriptions')
        .upsert({
          user_id: session.user.id,
          stripe_customer_id: customerId,
        });
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      metadata: {
        userId: session.user.id,
        plan: planId,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          plan: planId,
        },
      },
      allow_promotion_codes: true,
    });

    return NextResponse.json({
      success: true,
      data: { url: checkoutSession.url },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

### Customer Portal (`src/app/api/stripe/portal/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe/client';
import { APIError, handleAPIError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new APIError('Unauthorized', 401);
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', session.user.id)
      .single();

    if (!subscription?.stripe_customer_id) {
      throw new APIError('No subscription found', 404);
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return NextResponse.json({
      success: true,
      data: { url: portalSession.url },
    });

  } catch (error) {
    return handleAPIError(error);
  }
}
```

### Webhook Handler (`src/app/api/stripe/webhook/route.ts`)
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/admin';
import { getPlanByPriceId } from '@/lib/stripe/plans';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = createClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const planId = session.metadata?.plan;

        if (userId && planId) {
          // Update subscription
          await supabase
            .from('subscriptions')
            .upsert({
              user_id: userId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: 'active',
              plan: planId,
            });

          // Update usage limits based on plan
          const plan = getPlanByPriceId(session.metadata?.priceId || '');
          if (plan) {
            await supabase
              .from('usage')
              .update({
                credits_limit: plan.limits.credits === -1 ? 999999 : plan.limits.credits,
              })
              .eq('user_id', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          await supabase
            .from('subscriptions')
            .update({
              status: subscription.status === 'active' ? 'active' : subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              cancel_at_period_end: subscription.cancel_at_period_end,
            })
            .eq('stripe_subscription_id', subscription.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const userId = subscription.metadata?.userId;

        if (userId) {
          // Downgrade to free
          await supabase
            .from('subscriptions')
            .update({
              status: 'canceled',
              plan: 'free',
            })
            .eq('stripe_subscription_id', subscription.id);

          // Reset usage limits to free tier
          await supabase
            .from('usage')
            .update({ credits_limit: 10 })
            .eq('user_id', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        // Reset usage on successful payment (new billing period)
        if (invoice.subscription) {
          const sub = await stripe.subscriptions.retrieve(invoice.subscription as string);
          const userId = sub.metadata?.userId;

          if (userId) {
            await supabase
              .from('usage')
              .update({
                credits_used: 0,
                period_start: new Date().toISOString(),
                period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              })
              .eq('user_id', userId);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        // Handle failed payment - could send email, update status
        console.log('Payment failed for invoice:', invoice.id);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
```

### Pricing Component (`src/components/pricing/PricingCard.tsx`)
```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2 } from 'lucide-react';
import { PLANS, Plan } from '@/lib/stripe/plans';
import { cn } from '@/lib/utils';

interface PricingCardProps {
  plan: Plan;
  currentPlan?: string;
}

export function PricingCard({ plan, currentPlan }: PricingCardProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const isCurrentPlan = currentPlan === plan.id;

  const handleSubscribe = async () => {
    if (plan.id === 'free' || isCurrentPlan) return;

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      className={cn(
        'relative p-6 flex flex-col',
        plan.popular && 'border-primary-500 border-2 shadow-lg'
      )}
    >
      {plan.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-text-secondary text-sm mt-1">{plan.description}</p>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">${plan.price}</span>
        {plan.price > 0 && <span className="text-text-secondary">/month</span>}
      </div>

      <ul className="space-y-3 mb-8 flex-1">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check className="w-5 h-5 text-success-main flex-shrink-0 mt-0.5" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={handleSubscribe}
        disabled={loading || isCurrentPlan || plan.id === 'free'}
        variant={plan.popular ? 'default' : 'outline'}
        className="w-full"
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Free Forever' : 'Subscribe'}
      </Button>
    </Card>
  );
}

export function PricingGrid({ currentPlan }: { currentPlan?: string }) {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
      {Object.values(PLANS).map((plan) => (
        <PricingCard key={plan.id} plan={plan} currentPlan={currentPlan} />
      ))}
    </div>
  );
}
```

### Manage Subscription Button
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Loader2 } from 'lucide-react';

export function ManageSubscriptionButton() {
  const [loading, setLoading] = useState(false);

  const handleManage = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.data?.url) {
        window.location.href = data.data.url;
      }
    } catch (error) {
      console.error('Portal error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleManage} disabled={loading} variant="outline">
      {loading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Settings className="w-4 h-4 mr-2" />
      )}
      Manage Subscription
    </Button>
  );
}
```

## Environment Variables

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...
STRIPE_ENTERPRISE_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Example Usage

```
/stripe init
/stripe checkout --type subscription
/stripe portal
/stripe webhook
/stripe usage
```

## Checklist

- [ ] Stripe products/prices created in Dashboard
- [ ] Webhook endpoint registered in Stripe
- [ ] Environment variables set
- [ ] Customer portal configured in Stripe
- [ ] Test mode webhooks working with Stripe CLI
