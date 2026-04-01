---
name: Industry Use Case Posts Differentiation
description: 10 industry blog posts rewritten from doorway-page template into structurally differentiated content (2026-03-31)
type: project
---

All 10 industry use case posts at `src/app/(public)/blog/chatbot-for-{slug}/page.tsx` were rewritten to break the doorway page pattern.

## Structural differentiation applied:
- **SaaS** (6 sections): Comparison table (wizard vs chatbot), stat callout grid for metrics, TTFV/activation rate specifics
- **Restaurants** (4 sections): Story-first opening, example chatbot conversation (allergen flow), OpenTable/Resy integration
- **Education** (7 sections): Problem-first opening, FERPA compliance deep-dive with callout box, LMS section (Canvas/Blackboard/Moodle), numbered list instead of bullets
- **Financial** (5 sections): Stat-first opening, info vs. advice distinction with warning callout, SEC/FINRA/SOX regulation specifics
- **Recruitment** (4 sections): Question-first opening, 5-step screening flow visual, ATS integration (Greenhouse/Lever/Workable)
- **Nonprofits** (4 sections): Story-first opening, donation page conversion callout, donor CRM mentions (Salesforce Nonprofit/Bloomerang/DonorPerfect)
- **Insurance** (6 sections): Stat-first opening, claims vs. policy two-column comparison, state regulation specifics (CDI/DFS/TDI/OIR), storm season surge
- **Travel** (5 sections): Story-first opening, seasonal demand table, GDS system mentions (Amadeus/Sabre/Travelport)
- **Fitness** (5 sections): Question-first opening, class schedule conversation example, member retention section, Mindbody/Gymdesk/Zen Planner mentions
- **Accounting** (6 sections): Stat-first opening, billable hours calculation box, AICPA/IRS compliance section, tax season surge

## FAQ differentiation:
Each post now has unique FAQ questions. No two posts share the same "Is it secure?" / "What content do I need?" pattern.

## JSON-LD:
All FAQPage structured data updated to match visible FAQ changes. dateModified updated to 2026-03-31.

**Why:** Google HCU flags sets of pages with ~95% structural overlap as doorway pages. Quality raters would penalize the identical template pattern.
**How to apply:** Future industry posts should follow a unique structure, not copy from an existing post. Refer to this list for what content types each post already uses to avoid re-introducing similarity.
