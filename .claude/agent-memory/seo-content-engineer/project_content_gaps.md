---
name: Content gaps & landing pages
description: Landing pages created, keywords targeted, content gaps remaining for VocUI SEO
type: project
---

## Pages created

### /chatbot-booking
- File: `src/app/(public)/chatbot-booking/page.tsx`
- Title: "AI Chatbot for Appointment Booking | VocUI"
- Primary keywords: "AI chatbot appointment booking", "chatbot scheduling", "AI booking chatbot for small business"
- Target persona: Service businesses (clinics, law firms, salons, coaches, consultants)
- Schema: `SoftwareApplication`
- Sections: Hero → Trust bar → Problem → How It Works → Features → Who It's For → CTA
- Added to Header Product menu as "Appointment Booking"

## Homepage keywords already targeted

The homepage (`src/app/(public)/page.tsx`) targets: AI customer support, knowledge base chatbot, chatbot builder, embeddable widget, Slack chatbot, lead capture, support ticketing.

The homepage mentions booking in the hero subheadline and in the differentiators section (first card) but does not rank for booking keywords — no dedicated SEO treatment.

## Keyword gaps / recommended pages to create

High priority (commercial intent, clear differentiator):
- `/chatbot-for-slack` — "Slack chatbot builder", "custom Slack bot" — Slack integration is a real feature
- `/knowledge-base-chatbot` — "train chatbot on documents", "PDF chatbot" — core use case not isolated
- `/embeddable-chat-widget` — "website chat widget", "embed chatbot on website" — deployment use case

Medium priority (vertical targeting):
- `/chatbot-for-saas` — B2B SaaS support deflection
- `/chatbot-for-ecommerce` — e-commerce Q&A + support

Lower priority (informational, top-of-funnel):
- Blog: "How to reduce support tickets with AI chatbots"
- Blog: "AI appointment scheduling: what it is and how it works"

## Blog post strategy (fully specced 2026-03-31, not yet built)

Five posts. Specs cover: target keyword, secondary keywords, intent, difficulty, slug, title, meta description, H1, H2 outline, word count, internal links, JSON-LD schema type.

1. `/blog/how-to-add-chatbot-to-website`
   - Primary: "how to add a chatbot to your website"
   - Schema: HowTo + FAQPage
   - Word count: 1,400–1,800
   - Internal links: /knowledge-base-chatbot, /chatbot-for-customer-support, /chatbot-for-lead-capture, /pricing

2. `/blog/how-to-train-chatbot-on-your-own-data`
   - Primary: "how to train a chatbot on your own data"
   - Schema: HowTo + FAQPage
   - Word count: 1,600–2,000
   - Internal links: /knowledge-base-chatbot, post 5, /chatbot-for-lawyers, /pricing

3. `/blog/chatbase-alternatives`
   - Primary: "Chatbase alternatives"
   - Schema: Article + ItemList
   - Word count: 2,000–2,400
   - Internal links: /vs-tidio, /vs-intercom, /slack-chatbot, /knowledge-base-chatbot, /pricing

4. `/blog/how-to-reduce-customer-support-tickets`
   - Primary: "how to reduce customer support tickets"
   - Schema: Article + FAQPage
   - Word count: 1,800–2,200
   - Internal links: /chatbot-for-customer-support (×2), /knowledge-base-chatbot, post 1, /pricing
   - Note: highest-conversion post in the set

5. `/blog/what-is-a-knowledge-base-chatbot`
   - Primary: "what is a knowledge base chatbot"
   - Schema: FAQPage + Article
   - Word count: 1,400–1,700
   - Internal links: /knowledge-base-chatbot, post 2, /chatbot-for-lawyers, /chatbot-for-healthcare, /chatbot-for-real-estate
   - Note: featured-snippet optimized; direct-answer paragraph immediately after H1

Posts 2 and 5 cross-link to each other and both funnel to /knowledge-base-chatbot.
Post 3 funnels to /vs-tidio and /vs-intercom to reinforce comparison cluster.
Post 4 is the strongest conversion post; primary CTA to /chatbot-for-customer-support (appears twice).
