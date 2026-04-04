---
name: WeCom Integration Analysis
description: Build/don't-build analysis of WeCom as a VocUI deployment channel — concluded April 2026
type: project
---

WeCom analysis concluded April 2026. Recommendation: Don't build now. Defer until there is validated inbound demand from China-market businesses.

**Core finding:** WeCom is a China-domestic platform whose external customer use cases are dominated by enterprise clienteling (luxury retail, pharma, finance) requiring CRM/SCRM infrastructure — not self-serve SMB chatbot tools. VocUI's ICP (self-serve SMB, English-speaking markets) does not overlap with WeCom's active user base.

**WeCom 5.0 threat:** Released August 2025, WeCom now has a native "Smart Robot" feature with knowledge base upload and Q&A. This is a direct analog to VocUI's core value prop, built natively into the platform. Third-party chatbot value on WeCom is shrinking.

**Group Robot (webhook) finding:** WeCom Group Robots are webhook-based, send-only bots for internal team channels. They cannot conduct two-way customer conversations. Not suitable as a customer-facing chatbot channel.

**Customer Contact API:** The API that enables external customer messaging at scale requires: (a) WeCom enterprise account for the VocUI customer, (b) customers to add the business's WeCom contact from WeChat — a friction-laden opt-in that only works inside the WeChat ecosystem. Not a fit for VocUI's typical deployment pattern (embed widget on website or connect to Slack/Telegram).

**Registration:** WeCom registration for international companies is technically possible (~$99 USD, 10-15 business day review), and simpler than WeChat Official Accounts. Not the blocking factor — market fit is.

**Demand validation test suggested:** If a VocUI customer explicitly requests WeCom support, that's the trigger to revisit. Until then, no demand signal exists.

**How to apply:** If WeCom integration is raised again, use this as the baseline. Any re-evaluation should start with: has VocUI received inbound demand from businesses serving Chinese consumers via WeCom?
