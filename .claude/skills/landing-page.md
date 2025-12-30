# Landing Page Skill

Generate conversion-optimized landing pages for AI SaaS products.

## Trigger
`/landing-page` or `/lp`

## Arguments
- `product`: Name of the SaaS product
- `niche`: Target market/industry
- `--sections`: Comma-separated list of sections to include
- `--style`: `minimal` | `bold` | `gradient` (default: minimal)

## Sections Available

| Section | Description |
|---------|-------------|
| `hero` | Main headline, subheadline, CTA, hero image/demo |
| `features` | Feature grid with icons (3-6 features) |
| `how-it-works` | Step-by-step process (3-4 steps) |
| `benefits` | Benefit-focused cards with outcomes |
| `pricing` | Pricing tiers (Free/Pro/Enterprise) |
| `testimonials` | Customer quotes with avatars |
| `faq` | Expandable FAQ accordion |
| `cta` | Final call-to-action banner |
| `comparison` | Before/after or vs competitors table |
| `demo` | Interactive demo or video embed |

Default sections: `hero,features,how-it-works,pricing,faq,cta`

## Instructions

When invoked:

1. **Read design system**: Load `src/styles/design-system.ts` for tokens

2. **Plan the page**:
   - Determine value proposition from product + niche
   - Select appropriate sections
   - Plan copy tone (professional, friendly, bold)

3. **Generate files**:
   ```
   src/app/(marketing)/[product]/page.tsx    # Main page
   src/components/landing/[Product]Hero.tsx  # Hero section
   src/components/landing/[Product]Features.tsx
   src/components/landing/[Product]Pricing.tsx
   ... (other sections)
   ```

4. **Use these patterns**:
   - shadcn/ui components (Button, Card, Accordion, Badge)
   - Framer Motion for scroll animations
   - Responsive: mobile-first with md: and lg: breakpoints
   - Import design tokens for colors/spacing

## Component Templates

### Hero Section Pattern
```tsx
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background-secondary py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Badge className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6">
            {/* Headline */}
          </h1>
          <p className="text-xl text-text-secondary mb-8">
            {/* Subheadline - max 2 lines */}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg">
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg">
              See Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
```

### Features Grid Pattern
```tsx
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Zap, Shield, Clock } from 'lucide-react';

const features = [
  { icon: Zap, title: '', description: '' },
  // ...
];

export function Features() {
  return (
    <section className="py-20 bg-background-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Features</h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            {/* Section description */}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full hover:shadow-md transition-shadow">
                <feature.icon className="w-10 h-10 text-primary-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### Pricing Pattern
```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For trying it out',
    features: ['5 generations/month', 'Basic templates'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    description: 'For professionals',
    features: ['Unlimited generations', 'All templates', 'Priority support'],
    cta: 'Go Pro',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For teams',
    features: ['Everything in Pro', 'Team collaboration', 'Custom integrations'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section className="py-20 bg-background-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-text-secondary">No hidden fees. Cancel anytime.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 ${plan.highlighted ? 'border-primary-500 border-2 shadow-lg' : ''}`}
            >
              {plan.highlighted && (
                <Badge className="mb-4">Most Popular</Badge>
              )}
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="my-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && <span className="text-text-secondary">{plan.period}</span>}
              </div>
              <p className="text-text-secondary mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success-main" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={plan.highlighted ? 'default' : 'outline'}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Copywriting Guidelines

- **Headlines**: Benefit-focused, max 10 words, use power words
- **Subheadlines**: Explain the "how" in 1-2 sentences
- **CTAs**: Action verbs ("Get", "Start", "Try"), create urgency
- **Features**: Lead with benefit, then explain feature
- **Social proof**: Specific numbers, real names, job titles

## Example Usages

```
/landing-page "EmailGenius" --niche "real estate agents"
/landing-page "ReportBot" --niche "financial advisors" --sections hero,features,demo,pricing,cta
/landing-page "ProposalAI" --niche "freelance designers" --style gradient
```

## Output Checklist

After generating, verify:
- [ ] All sections use design system tokens
- [ ] Responsive on mobile/tablet/desktop
- [ ] Framer Motion animations are subtle and performant
- [ ] CTAs stand out with proper contrast
- [ ] Page loads without hydration errors
- [ ] Images have loading="lazy" and proper alt text
- [ ] Meta tags / SEO basics included
