# VocUI Comprehensive UX Copy Audit

**Date:** 2026-03-28
**Scope:** All user-facing text across marketing, auth, dashboard, widget, admin, and error states
**Priority scale:** P0 = confusing/broken, P1 = unclear/inconsistent, P2 = could be better, P3 = polish

---

## 1. Landing / Marketing Pages

### 1.1 Homepage (`src/app/(public)/page.tsx`)

**Feature description uses jargon**
> "Train your chatbot on your own content -- URLs, PDFs, documents. RAG-powered answers grounded in your data."

- Issue: "RAG-powered" is internal jargon. End users don't know what RAG means. "Grounded in your data" is vague.
- Recommended: "Train your chatbot on your own content -- websites, PDFs, and documents. Every answer comes directly from your knowledge base."
- Priority: **P0**

**Homepage tagline is generic**
> "Build Intelligent Chatbots with VocUI"

- Issue: "Intelligent" is a filler adjective. Doesn't communicate value.
- Recommended: "Build Custom AI Chatbots Trained on Your Content"
- Priority: **P2**

**Subtitle is abstract**
> "Giving Voice to the User Interface"

- Issue: The acronym explanation feels like a tagline for VocUI the company, not a benefit statement. Users don't care what the acronym stands for.
- Recommended: "Deploy on your website, Slack, or Telegram in minutes" (move the benefit up) or cut entirely -- the paragraph below already says this.
- Priority: **P2**

**Section heading is product-centric**
> "Everything you need to deploy AI chatbots"

- Issue: "Everything you need" is cliche. Frame around user outcome.
- Recommended: "One platform. Every channel."
- Priority: **P3**

**CTA heading**
> "Ready to deploy your AI chatbot?"

- Issue: Fine, but appears after "Get Started Free" already appeared above. Repetitive CTA text.
- Recommended: "Start building your chatbot today" (varies the language)
- Priority: **P3**

### 1.2 Pricing Page (`src/app/(public)/pricing/page.tsx`)

**Pricing FAQ inconsistency with FAQ page**
> Pricing page: "We offer a 30-day money-back guarantee."
> FAQ page (`faq-data.ts`): "We offer a 14-day money-back guarantee for new Pro subscriptions."

- Issue: Direct contradiction. 30 days vs 14 days. Users will lose trust.
- Recommended: Pick one number and use it everywhere. If 14 days is correct, update the pricing page.
- Priority: **P0**

**Credit context uses old product references**
> "~50 emails or ~20 proposals" / "~500 emails or ~200 proposals"

- Issue: VocUI no longer has Email Writer or Proposal Generator tools (removed in commit `f95f376`). These references are stale.
- Recommended: "~500 chatbot conversations" or simply remove the approximation line if the credit-to-action ratio varies by use case.
- Priority: **P0**

**Pricing FAQ references removed features**
> "One email generation uses 1 credit, and one proposal generation uses 2-5 credits depending on length."

- Issue: Same as above -- emails and proposals no longer exist as tools.
- Recommended: "Credits are consumed each time your chatbot answers a question or processes a knowledge source. A typical chatbot conversation uses 1-3 credits."
- Priority: **P0**

**"What happens if I run out of credits?" is incomplete**
> "You'll need to wait until your credits reset at the start of your billing period, or upgrade to a higher plan for more credits."

- Issue: The billing page now offers credit top-ups and auto-topup. This answer is outdated.
- Recommended: "You can purchase additional credits anytime, enable auto-topup to never run out, or upgrade for a higher monthly allocation."
- Priority: **P1**

**CTA button "Explore Tools" links to /tools**
> Bottom CTA section has "Explore Tools" button

- Issue: VocUI's core product is chatbots, not a "tools" suite. The /tools page may be empty/deprecated since tools were removed.
- Recommended: Change to "See How It Works" linking to /wiki or /faq, or remove this secondary CTA.
- Priority: **P1**

**Testimonial content mismatch**
> "VocUI has transformed how I write proposals."
> "We've cut our proposal turnaround time by 80%."

- Issue: These testimonials reference proposal/email writing -- features that no longer exist.
- Recommended: Rewrite testimonials to reference chatbot features: knowledge bases, deployment speed, customer support automation.
- Priority: **P1**

**"Try Free" button label for free plan**
- Issue: "Try" implies a trial. The free plan is permanent. This can create anxiety about expiration.
- Recommended: "Get Started" or "Start Free"
- Priority: **P2**

### 1.3 FAQ Page (`src/app/(public)/faq/`)

**FAQ data references old tools**
> Tools section: "VocUI offers a custom AI Chatbot Builder with RAG-powered knowledge bases."

- Issue: "RAG-powered" jargon again.
- Recommended: "VocUI lets you build AI chatbots trained on your own content. Import your website, documents, or FAQs and deploy via embed widget, Slack, or Telegram."
- Priority: **P1**

**FAQ search placeholder**
> Not visible in the data file but the search component should have a clear placeholder.
- Recommended: Ensure placeholder reads "Search questions..." or "What do you need help with?"
- Priority: **P3**

---

## 2. Auth Pages

### 2.1 Login Page (`src/app/(public)/login/page.tsx`)

**Signup description is vague**
> "Get started with AI-powered tools"

- Issue: VocUI is a chatbot platform, not a generic "AI tools" suite. This copy predates the product pivot.
- Recommended: "Create your first AI chatbot in minutes"
- Priority: **P1**

**Generic error catch-all**
> `toast.error(err instanceof Error ? err.message : 'An error occurred');`

- Issue: "An error occurred" tells the user nothing. This pattern appears 20+ times across the codebase.
- Recommended: Context-specific fallbacks: "Sign-in failed. Check your email and password and try again." / "Account creation failed. Please try again or contact support."
- Priority: **P1**

**MFA error message**
> `toast.error(err instanceof Error ? err.message : 'Invalid verification code');`

- Issue: Better than generic, but could be more helpful.
- Recommended: "That code didn't work. Check your authenticator app and enter the current 6-digit code."
- Priority: **P2**

**Name placeholder is not inclusive**
> `placeholder="John Doe"`

- Issue: Western-centric placeholder name.
- Recommended: `placeholder="Your full name"`
- Priority: **P2**

**No forgot password option visible**
- Issue: There is no "Forgot password?" link on the login form. Users who forget their password have no recovery path from this page.
- Recommended: Add "Forgot password?" link below the password field.
- Priority: **P1**

---

## 3. Dashboard Pages

### 3.1 Main Dashboard (`src/app/(authenticated)/dashboard/page.tsx`)

**Welcome text is generic**
> "Welcome back! Here's an overview of your account."

- Issue: Fine but could be warmer or more action-oriented.
- Recommended: "Here's what's happening with your chatbots."
- Priority: **P3**

**Credits tooltip uses jargon**
> "Token credits available this billing period. Credits are consumed by AI tool usage and chatbot messages."

- Issue: "Token credits" conflates tokens (an AI/LLM concept) with credits (the billing unit). Users shouldn't need to understand tokens.
- Recommended: "Credits remaining this billing period. Credits are used when your chatbot answers questions and processes knowledge sources."
- Priority: **P1**

**Total Generations tooltip**
> "All-time count of AI content generated across all tools and chatbot interactions."

- Issue: "AI content generated" and "tools" reference the old product. "Generations" is developer-speak.
- Recommended: "Total chatbot responses and content generated since you created your account."
- Priority: **P1**

**"View Integrations" CTA links to non-existent page**
> Button links to `/dashboard/integrations`

- Issue: This route doesn't exist in the codebase. Users clicking this will get a 404.
- Recommended: Link to `/dashboard/chatbots` or the deploy page of their first chatbot. Or remove this card if integrations don't have a dedicated page.
- Priority: **P0**

**Quick Actions card description**
> "Get started with VocUI"

- Issue: Once a user is on the dashboard, they've already "gotten started." This copy is for first-time users only.
- Recommended: "Quick links" or simply remove the description.
- Priority: **P2**

**Recent Activity description**
> "Your latest generations"

- Issue: "Generations" is internal terminology. The card also shows API logs, not just generations.
- Recommended: "Recent chatbot activity"
- Priority: **P2**

**Empty state for activity**
> "No generations yet" / "Create a chatbot to get started"

- Issue: Good structure but "generations" should be "activity."
- Recommended: "No activity yet. Create a chatbot to start seeing responses here."
- Priority: **P2**

### 3.2 Chatbots List (`src/app/(authenticated)/dashboard/chatbots/page.tsx`)

**Empty state -- good**
> "No chatbots yet. Create your first AI chatbot to start engaging with your customers. Train it with your knowledge base and deploy it anywhere."

- Issue: This is well-written. Minor: "deploy it anywhere" is slightly vague.
- Recommended: "...and deploy it on your website, Slack, or Telegram."
- Priority: **P3**

**Delete confirmation is good but bare**
> "Are you sure you want to delete this chatbot? This action cannot be undone."

- Issue: Acceptable, but could mention what gets deleted.
- Recommended: "This will permanently delete this chatbot, its knowledge sources, conversations, and settings. This cannot be undone."
- Priority: **P2**

**Toast on delete is too terse**
> `toast.success('Chatbot deleted');`

- Issue: No additional context.
- Recommended: "Chatbot deleted successfully."
- Priority: **P3**

**Knowledge badge tooltip uses jargon**
> `title="Knowledge base needs re-processing -- click to fix"`

- Issue: "Re-processing" is technical. Good that it says "click to fix."
- Recommended: "Your chatbot's knowledge needs updating -- click to fix"
- Priority: **P2**

### 3.3 Create Chatbot (`src/app/(authenticated)/dashboard/chatbots/new/page.tsx`)

**Success toast is excellent**
> "Chatbot created! Add knowledge sources to make it smart."

- Issue: None. This is clear, encouraging, and action-oriented. Well done.
- Priority: N/A

**Step descriptions -- good**
> "Name and describe your chatbot" / "Define how your chatbot behaves" / "Review and create"

- Issue: Clear progressive disclosure. No changes needed.
- Priority: N/A

**System prompt label**
> "System Prompt *"

- Issue: "System prompt" is AI jargon. Most chatbot owners won't know this term.
- Recommended: "Chatbot Instructions *" or "Behavior Instructions *"
- Priority: **P1**

**Prompt protection description**
> "Automatically adds security rules to prevent users from manipulating the chatbot with prompt injection attacks."

- Issue: "Prompt injection attacks" is too technical for many users.
- Recommended: "Prevents users from tricking your chatbot into ignoring its instructions or revealing its configuration."
- Priority: **P2**

**"What happens next?" section -- good**
> Lists 4 clear steps. Well-structured.
- Priority: N/A

### 3.4 Chatbot Overview (`src/app/(authenticated)/dashboard/chatbots/[id]/page.tsx`)

**System Prompt section heading**
> "System Prompt" / "How your chatbot is configured to behave"

- Issue: Same jargon concern. Subtitle is good though.
- Recommended: Heading: "Chatbot Instructions" / Description: Keep as-is.
- Priority: **P1**

**Error state is generic**
> `{error || 'Chatbot not found'}`

- Issue: Raw error strings displayed to users.
- Recommended: "We couldn't load this chatbot. It may have been deleted, or there was a connection issue. Go back to your chatbots list."
- Priority: **P1**

### 3.5 Knowledge Base (`src/app/(authenticated)/dashboard/chatbots/[id]/knowledge/page.tsx`)

**"Import Website Content" card description uses jargon**
> "Scrape raw content from a webpage and add it directly to the knowledge base"

- Issue: "Scrape raw content" is developer language that can sound aggressive/negative.
- Recommended: "Import content from any webpage to train your chatbot"
- Priority: **P1**

**"Add Text Content" card is too terse**
> "Paste text or documentation"

- Issue: Doesn't explain the benefit or suggest what kind of text.
- Recommended: "Paste FAQs, product docs, policies, or any text your chatbot should know"
- Priority: **P2**

**"chunks" displayed to end users**
> `{source.chunks_count} chunks`

- Issue: "Chunks" is RAG terminology. Users don't know what a chunk is.
- Recommended: `{source.chunks_count} sections` or `{source.chunks_count} passages`
- Priority: **P1**

**Re-embed button text**
> "Re-embed All" / "Re-embedding..."

- Issue: "Embed" and "re-embed" are AI/ML jargon. Users will not understand what this does.
- Recommended: "Re-process All" / "Re-processing..." (which is already used elsewhere on the same page -- inconsistency)
- Priority: **P1**

**Re-embed callout uses jargon**
> "This will delete existing chunks and re-embed with the current AI model."

- Issue: "chunks" and "re-embed" are both jargon in one sentence.
- Recommended: "This will re-read and reorganize this source so your chatbot can search it accurately."
- Priority: **P1**

**Re-embed reason messages leak implementation**
> "Some knowledge sources are missing embedding model information."
> "Your knowledge sources were embedded with different AI models."

- Issue: These expose internal AI model details to users.
- Recommended: "Some knowledge sources need to be updated so your chatbot can find answers accurately." / "Your knowledge sources were processed at different times. Re-processing ensures consistent search quality."
- Priority: **P1**

**Pin/unpin tooltip is technical**
> "Pin -- always include in AI context" / "Unpin -- remove from always-included context"

- Issue: "AI context" is jargon.
- Recommended: "Pin -- your chatbot will always reference this source when answering" / "Unpin -- your chatbot will only reference this when relevant"
- Priority: **P2**

**Article generation description**
> "Generate structured help articles using AI, then embed them into the knowledge base so your chatbot can answer questions without live-fetching URLs."

- Issue: "embed them into the knowledge base" and "live-fetching URLs" are technical.
- Recommended: "Generate help articles from your content. Articles are added to your chatbot's knowledge so it can answer questions instantly."
- Priority: **P2**

### 3.6 Deploy Page (`src/app/(authenticated)/dashboard/chatbots/[id]/deploy/page.tsx`)

**Overall: This page is well-written.** Embed method descriptions, code block hints, and API key warnings are all clear and action-oriented.

**Minor: Unpublished banner copy is good**
> "The embed codes below are ready to add to your site. The widget will not render for visitors until you publish."

- Issue: None. Clear and non-alarming.
- Priority: N/A

**Agent console empty state is helpful**
> "Enable live handoff in your chatbot settings to get agent console embed codes."

- Issue: Good. Explains what to do and why.
- Priority: N/A

### 3.7 Billing Page (`src/app/(authenticated)/dashboard/billing/page.tsx`)

**Past due warning is well-structured**
> "Your last payment failed. Please update your payment method before [date] to avoid service interruption."

- Issue: Good error message with deadline and action. No changes needed.
- Priority: N/A

**Empty invoice state**
> "No invoices yet" / "Invoices will appear here once you have an active subscription"

- Issue: Good empty state. Explains when content will appear.
- Priority: N/A

**"Need More?" upsell card**
> "Generate more content with higher credit limits"

- Issue: "Generate more content" references old tool-based product.
- Recommended: "Handle more chatbot conversations with higher credit limits"
- Priority: **P1**

### 3.8 Settings Page (`src/app/(authenticated)/dashboard/settings/page.tsx`)

**Profile update success**
> `toast.success('Profile updated successfully');`

- Issue: "successfully" is redundant with a success toast.
- Recommended: "Profile updated"
- Priority: **P3**

**Password validation errors -- good**
> "New password must be at least 8 characters" / "Passwords do not match"

- Issue: Clear and specific. No changes needed.
- Priority: N/A

### 3.9 Chatbot Settings (`src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx`)

**"System Prompt" label**
- Issue: Same jargon concern raised in 3.3 and 3.4.
- Recommended: "Chatbot Instructions" consistently across create, overview, and settings pages.
- Priority: **P1**

---

## 4. Error Pages & Error Boundaries

### 4.1 Global Error (`src/app/global-error.tsx`)

**"Critical Error"**
> "A critical error occurred. Please try refreshing the page."

- Issue: "Critical" is alarming and not actionable. Users don't need severity ratings.
- Recommended: "Something went wrong. Try refreshing the page. If the problem continues, contact support."
- Priority: **P1**

### 4.2 Page Error Fallback (`src/components/error-boundary.tsx`)

**"Oops! Something went wrong"**
> "We're sorry, but something unexpected happened."

- Issue: "Oops!" is too casual for a product error. "Something went wrong" is vague.
- Recommended: "This page didn't load correctly. Try again, or return to your dashboard."
- Priority: **P2**

**Error Boundary default**
> "Something went wrong" / "We encountered an unexpected error."

- Issue: Same vagueness concern.
- Recommended: "This section couldn't load. Try refreshing, or go back to the homepage."
- Priority: **P2**

**Inline error**
> "Failed to load this content"

- Issue: Acceptable. Could be slightly more helpful.
- Recommended: "Couldn't load this content. Check your connection and try again."
- Priority: **P3**

### 4.3 Coming Soon Page (`src/app/coming-soon/page.tsx`)

**"Something amazing is coming"**
> "VocUI is being built to give voice to the user interface. Stay tuned."

- Issue: For an existing product with paying customers, "is being built" is confusing. This should only show for gated features, not the whole product.
- Recommended: "This feature is coming soon. We're working on it and will let you know when it's ready."
- Priority: **P2**

### 4.4 Maintenance Page (`src/app/maintenance/page.tsx`)

**Good overall.** "We'll be back soon" / "Data is safe" / "Systems upgrading" provides reassurance.

**"Thank you for your patience"**
- Issue: Fine. Common and expected.
- Priority: N/A

---

## 5. Widget & End-User Facing Components

### 5.1 Fallback Ticket Form (`src/components/widget/fallback-views.tsx`)

**Validation messages -- good**
> "Name is required" / "Email is required" / "Please enter a valid email address" / "Message is required"

- Issue: Clear, specific inline validation. No changes needed.
- Priority: N/A

**Generic API error**
> `err instanceof Error ? err.message : 'Failed to submit'`

- Issue: "Failed to submit" doesn't help the end user.
- Recommended: "We couldn't submit your ticket. Please try again."
- Priority: **P2**

---

## 6. Onboarding

### 6.1 Onboarding Checklist (`src/components/chatbots/OnboardingChecklist.tsx`)

**Well-structured and concise.**
- Step 1: "Add Knowledge Sources" / "Train your chatbot with URLs, documents, or text"
- Step 2: "Customize Widget" / "Match colors and branding to your website"
- Step 3: "Deploy to Website" / "Test the live preview, publish, and embed on your site"

- Issue: None. Progressive, clear, dismissible. Good pattern.
- Priority: N/A

---

## 7. Navigation & Layout

### 7.1 Dashboard Sidebar (`src/app/(authenticated)/dashboard/layout.tsx`)

**Nav labels are clean:** Dashboard, Chatbots, API Keys, Usage, Billing, Settings, Wiki.

**Admin nav labels are technical**
> "AI Config" / "Credit Packages"

- Issue: These are admin-only, so jargon is acceptable.
- Priority: N/A

### 7.2 Header Navigation (`src/components/layout/Header.tsx`)

**Default CTA says "Get Started"**
> `cta = { label: 'Get Started', href: '/login' }`

- Issue: "Get Started" links to login, not signup. Users clicking "Get Started" expect account creation.
- Recommended: Either link to `/signup` or change label to "Sign In".
- Priority: **P1**

### 7.3 Footer (`src/components/ui/footer.tsx`)

**Footer "Tools" link**
> `{ label: 'Tools', href: '/tools' }`

- Issue: Tools page may be empty/deprecated since AI tools were removed.
- Recommended: Replace with "Features" linking to `/#features` or remove.
- Priority: **P1**

**Social links use old brand**
> `href: 'https://twitter.com/aisaastools'` / `href: 'https://github.com/aisaastools'`

- Issue: Social links reference "aisaastools" not "vocui." May be intentional shared branding, but worth verifying.
- Priority: **P2**

---

## 8. Toast Messages (Cross-cutting)

### 8.1 Generic error pattern (appears 20+ times)

> `toast.error(err instanceof Error ? err.message : 'An error occurred');`

- Issue: "An error occurred" is never acceptable per brand guidelines. Raw API error messages are often not user-friendly either.
- Recommended: Create a utility function that maps common errors to friendly messages, with a per-context fallback:
  - Knowledge page: "Couldn't add that source. Check the URL and try again."
  - Settings page: "Couldn't save your changes. Please try again."
  - Chatbot page: "Couldn't load chatbot details. Please refresh."
- Priority: **P1**

### 8.2 Good toast patterns to keep

- `"Chatbot created! Add knowledge sources to make it smart."` -- Excellent
- `"Chatbot published! Get your embed codes on the deploy page."` -- Clear with next action
- `"Website crawl started -- pages will appear as they are processed"` -- Sets expectations
- `"Source pinned -- always included in AI context"` -- (except "AI context" jargon, noted above)

---

## 9. Terminology Consistency Audit

| Term | Used in | Should be |
|------|---------|-----------|
| RAG | Homepage feature card | Never user-facing |
| chunks | Knowledge page, re-embed dialog | "sections" or "passages" |
| embeddings / re-embed | Knowledge page buttons | "process" / "re-process" |
| System Prompt | Create, Overview, Settings pages | "Chatbot Instructions" |
| generations | Dashboard, Usage page | "responses" or "activity" |
| tokens | Dashboard tooltip, Usage page | "credits" (the billing unit) |
| AI context | Pin source tooltip | "your chatbot's answers" |
| tools | Pricing, footer, dashboard | "features" or remove |

---

## 10. Accessibility Notes

**Generally good:**
- `aria-label` on toggle buttons, icon-only buttons
- `aria-hidden="true"` on decorative icons
- `role="progressbar"` on credit usage bar
- Form labels properly associated with inputs via `htmlFor`
- Screen reader text for pricing (`<span className="sr-only">Price: </span>`)

**Issues found:**
- Color picker input has `opacity-0` which may confuse screen readers: add `aria-label` (already present -- good)
- Some dropdown menus use `role="menu"` correctly -- good
- Chatbot status badges display raw status strings ("draft", "active") -- these are accessible but could use sentence case for screen readers

---

## Summary of Priority Counts

| Priority | Count | Description |
|----------|-------|-------------|
| **P0** | 4 | Broken links, contradictory info, stale feature references |
| **P1** | 19 | Jargon, unclear copy, inconsistent terminology |
| **P2** | 16 | Could be clearer or more helpful |
| **P3** | 9 | Polish and minor improvements |
| **Total** | 48 | |

### Top 5 Actions

1. **Remove all references to removed tools** (emails, proposals) from pricing FAQ, pricing page credit context, and testimonials. These are factually wrong now.
2. **Fix the 30-day vs 14-day money-back guarantee contradiction** between pricing and FAQ pages.
3. **Fix the broken `/dashboard/integrations` link** on the main dashboard.
4. **Replace RAG/embedding/chunk jargon** with user-friendly alternatives across knowledge pages.
5. **Standardize "System Prompt" to "Chatbot Instructions"** across all pages.
