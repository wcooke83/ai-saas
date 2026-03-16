# Usage Page Audit - March 12, 2026

## Critical Issues Found

### 1. ❌ Stale Billing Period Dates
**Current State:**
- Display shows: "03/01/2026 - 02/02/2026" 
- Actual data: `period_start: "2026-01-02"`, `period_end: "2026-02-01"`
- Today: March 12, 2026

**Problem:**
- Usage period is 2 months old and hasn't been updated
- Should show current month: March 12 - April 12

**Root Cause:**
- No automatic period rollover mechanism
- Usage records are created manually but never updated

**Fix Required:**
- Implement automatic period reset on first API call of new period
- Sync with Stripe subscription billing cycle
- Add cron job or webhook to reset periods monthly

---

### 2. ❌ Duplicate Usage Records
**Current State:**
- 4 usage records for same user with overlapping periods
- IDs: e011f0b3, cecd8e6d, c40c33ee, 5e3b33bc

**Problem:**
- Database should have ONE active usage record per user
- Multiple records cause confusion and incorrect queries

**Fix Required:**
- Add unique constraint: `UNIQUE(user_id, period_start)` or use singleton pattern
- Clean up duplicate records
- Ensure only latest record is used

---

### 3. ❌ Credits Limit Mismatch
**Current State:**
- Usage table: `credits_limit: 10`
- Base plan (from subscription_plans): `credits_monthly: 500000`

**Problem:**
- Usage table has wrong limit (10 tokens vs 500,000 tokens)
- Page correctly reads from subscription_plans, but usage table is misleading

**Fix Required:**
- Remove `credits_limit` from usage table (redundant)
- Always read limit from subscription_plans table
- OR sync credits_limit on plan changes

---

### 4. ❌ Missing Stripe Subscription Period Sync
**Current State:**
- `subscriptions.current_period_start: null`
- `subscriptions.current_period_end: null`

**Problem:**
- Stripe subscription has billing periods but they're not synced to DB
- Usage period should align with Stripe billing period

**Fix Required:**
- Fetch subscription from Stripe API and update DB
- Add webhook handler for `customer.subscription.updated`
- Sync period dates when subscription is created/updated

---

### 5. ⚠️ Inconsistent Token Counting
**Current State:**
- Usage table has `credits_used: 7` (stale counter)
- Page calculates from `api_logs` table: `SUM(tokens_total)`

**Problem:**
- Two sources of truth for token usage
- Counter in usage table is never updated

**Options:**
1. Remove counter, always calculate from api_logs (current approach)
2. Keep counter and update it via trigger on api_logs insert
3. Use counter for display, recalculate periodically for accuracy

**Recommendation:** Option 1 (remove counter) - simpler and always accurate

---

## Data Quality Issues

### 6. ⚠️ Chart Data Calculation
**Current Implementation:**
```typescript
// Aggregates from both generations and api_logs tables
chartData = aggregate(generations + api_logs)
```

**Issue:**
- Potential double-counting if both tables have same data
- Generations table appears to be legacy/unused

**Fix Required:**
- Clarify which table is source of truth
- Remove or deprecate unused table

---

### 7. ⚠️ Stats Fallback Logic
**Current Implementation:**
```typescript
totalGenerations = generations.length > 0 ? generations.length : apiLogs.length
```

**Issue:**
- Complex fallback logic suggests unclear data model
- Should have single source of truth

**Fix Required:**
- Standardize on api_logs table
- Remove generations table if deprecated

---

## Missing Features (Per User Request)

### 8. ✅ TODO: Admin Analytics Page
**Requirements:**
- Yearly/quarterly metrics
- Business intelligence dashboard
- Aggregate stats across all users

**Implementation Plan:**
- New route: `/dashboard/admin/analytics`
- Metrics: Total users, total tokens, revenue, top users, usage trends
- Charts: Yearly revenue, quarterly growth, daily active users

---

### 9. ✅ TODO: CSV Export Feature
**Requirements:**
- Let users download their usage history
- Include: date, endpoint, tokens, cost, status

**Implementation Plan:**
- Add "Export CSV" button to usage page
- API route: `/api/usage/export`
- Generate CSV from api_logs table

---

### 10. ✅ TODO: Month-over-Month Trends
**Requirements:**
- Show "vs last month" comparison
- Display percentage change

**Implementation Plan:**
- Add trends card to usage page
- Calculate: current month tokens vs previous month tokens
- Show: +15% or -8% with up/down arrow

---

## Recommendations

### Immediate Actions (High Priority)
1. **Fix billing period dates** - Update usage record to current month
2. **Clean up duplicate usage records** - Keep only latest
3. **Sync Stripe subscription periods** - Fetch from Stripe API
4. **Update credits_limit** - Set to 500,000 for Base plan

### Short-term (This Week)
1. Implement automatic period rollover
2. Add CSV export feature
3. Add month-over-month trends card
4. Remove or clarify generations table usage

### Medium-term (This Month)
1. Build admin analytics page
2. Add Stripe webhook for subscription updates
3. Implement usage period sync with Stripe billing cycle
4. Add database constraints to prevent duplicate usage records

### Long-term (Nice to Have)
1. Real-time usage tracking dashboard
2. Usage alerts (80%, 90%, 100% of limit)
3. Historical usage trends (6 months, 1 year)
4. Cost breakdown by endpoint/tool

---

## Database Schema Issues

### Usage Table Cleanup Needed
```sql
-- Current schema has issues:
CREATE TABLE usage (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  credits_used INTEGER,      -- ❌ Stale counter, not updated
  credits_limit INTEGER,     -- ❌ Redundant, should read from subscription_plans
  period_start TIMESTAMPTZ,  -- ❌ Not automatically updated
  period_end TIMESTAMPTZ,    -- ❌ Not automatically updated
  ...
);

-- Recommended changes:
-- 1. Remove credits_used (calculate from api_logs)
-- 2. Remove credits_limit (read from subscription_plans)
-- 3. Add unique constraint on (user_id, period_start)
-- 4. Add trigger to auto-create new period on rollover
```

---

## Testing Checklist

After fixes are implemented:
- [ ] Billing period shows current month (March 12 - April 12)
- [ ] Only one usage record per user
- [ ] Credits limit shows 500,000 for Base plan
- [ ] Tokens used matches sum from api_logs
- [ ] CSV export downloads correct data
- [ ] Trends card shows month-over-month change
- [ ] Admin analytics page shows aggregate metrics
- [ ] No duplicate data in charts
- [ ] Stripe subscription periods sync correctly
