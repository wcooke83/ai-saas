# UI/UX Code Audit Report

## CRITICAL (Blocks users or causes data loss)

**C-1. Chatbot delete uses browser `confirm()` instead of accessible dialog**
- File: `src/app/(authenticated)/dashboard/chatbots/page.tsx`, line 75
- The `handleDelete` function calls `confirm('Are you sure...')` which is a browser-native dialog that cannot be styled, does not match the design system, is not accessible to screen readers properly, and is easily dismissed. The app already has a `ConfirmDialog` component at `src/components/ui/confirm-dialog.tsx` that supports variants, loading states, and proper ARIA.
- **Fix**: Replace `confirm()` with the existing `ConfirmDialog` component using the `useConfirmDialog` hook, variant `'danger'`.

**C-2. Sidebar `aria-hidden="true"` set on desktop when sidebar is not explicitly opened**
- File: `src/app/(authenticated)/dashboard/layout.tsx`, line 232
- `aria-hidden={!sidebarOpen ? 'true' : undefined}` -- on desktop (`lg:` breakpoint and above), the sidebar is always visible via `lg:translate-x-0`, but `sidebarOpen` is `false` by default. This means the sidebar is announced as hidden to screen readers even when it is visually present. Desktop keyboard users using assistive tech cannot access the sidebar navigation at all.
- **Fix**: Only apply `aria-hidden` when the viewport is mobile-sized, or use a media query check. Same issue in admin layout at `src/app/(admin)/layout.tsx`, line 201.

**C-3. Chatbot card dropdown menu has no keyboard accessibility**
- File: `src/app/(authenticated)/dashboard/chatbots/page.tsx`, lines 234-298
- The three-dot menu button (line 234-239) has no `aria-label`, no `aria-expanded`, no `aria-haspopup`. The dropdown is a custom implementation with no focus trapping, no arrow key navigation, and no ARIA `role="menu"` or `role="menuitem"`. Keyboard users cannot navigate menu items.
- **Fix**: Add `aria-label="Chatbot actions"`, `aria-expanded`, `aria-haspopup="menu"`, and add `role="menu"`/`role="menuitem"` to dropdown items. Implement focus trapping and arrow key navigation.

---

## HIGH (Major UX friction, accessibility violations)

**H-1. Privacy and Terms pages have `<main>` content placed outside `<main>` semantically**
- File: `src/app/(public)/privacy/page.tsx`, lines 16-25
- The `ToolsHero` is rendered before `<main>`, meaning the page hero content is outside the main landmark. The actual `<main>` starts at line 25 with the prose content. Screen readers will announce the hero as outside the primary content area.
- **Fix**: Move `<ToolsHero>` inside `<main>`. Same pattern in `src/app/(public)/terms/page.tsx`.

**H-2. Tools page category filters are completely non-functional**
- File: `src/app/(public)/tools/page.tsx`, lines 150-163
- The category filter buttons render but have no `onClick` handler and no state management. The "All" category is permanently styled as active. Users clicking other categories see no change. This is a broken interaction that violates user expectations.
- **Fix**: Add state for active category and filter the `tools` array. Or remove the category buttons entirely if filtering is not intended.

**H-3. Header navigation hides all nav links behind hamburger menu on all viewports**
- File: `src/components/layout/Header.tsx`, lines 340-377
- The header shows only "Sign In", theme toggle, and a hamburger button. There are no visible nav links (Tools, Docs, Pricing, SDK, FAQ) on any viewport -- all are hidden behind the full-screen menu overlay. Desktop users must click the hamburger to discover any navigation. The `defaultNavItems` array is defined (line 20-26) but never rendered inline. This is unconventional and creates unnecessary friction.
- **Fix**: Render `navItems` inline on medium/large viewports with `hidden md:flex` and keep the hamburger for mobile only.

**H-4. Dialog component lacks focus trapping**
- File: `src/components/ui/dialog.tsx`, lines 57-94
- The `Dialog` component supports Escape key and backdrop click, but does not trap focus within the dialog. Tab key will move focus behind the dialog overlay to underlying page elements. The app uses `useFocusTrap` in the sidebar but not in the dialog.
- **Fix**: Apply `useFocusTrap` inside `DialogContent` or port focus management inline. Auto-focus the close button or first focusable element on open.

**H-5. TabsTrigger uses incorrect focus ring color**
- File: `src/components/ui/tabs.tsx`, line 69
- The `TabsTrigger` uses `focus-visible:ring-secondary-950` while every other focusable element in the entire design system uses `focus-visible:ring-primary-500`. This creates an inconsistent and confusing focus indicator.
- **Fix**: Change to `focus-visible:ring-primary-500` and `dark:focus-visible:ring-primary-400`.

**H-6. Chatbot sub-nav "More" dropdown lacks ARIA role and keyboard nav**
- File: `src/components/chatbots/ChatbotSubNav.tsx`, lines 108-157
- The "More" dropdown has `aria-expanded` and `aria-haspopup="true"` on the trigger (good), but the dropdown itself has no `role="menu"`, the items have no `role="menuitem"`, and there is no keyboard arrow navigation. With 10 items in the secondary nav, this is a significant usability concern.
- **Fix**: Add `role="menu"` to the dropdown container, `role="menuitem"` to each link, and implement arrow key navigation.

**H-7. Header debug console.log statements shipping to production**
- File: `src/components/layout/Header.tsx`, lines 190-216
- The `useEffect` for `menuOpen` contains `setTimeout` with `console.log('[Header] Backdrop element:', ...)` and `console.log('[Header] Nav element:', ...)`. These debug statements run in production for every user who opens the menu.
- **Fix**: Remove the debug logging or wrap it in a `process.env.NODE_ENV === 'development'` guard.

**H-8. Global error page lacks dark mode support**
- File: `src/app/global-error.tsx`, lines 15-43
- Uses hardcoded light-mode colors: `bg-gray-50`, `text-gray-900`, `text-gray-600`, `bg-red-100`, `bg-blue-500`. Since this renders its own `<html>` and `<body>`, it bypasses the ThemeProvider. Users on dark mode will see a jarring white flash on critical errors.
- **Fix**: Add inline dark mode styles or a minimal theme detection script since ThemeProvider is unavailable.

---

## MEDIUM (Inconsistencies, polish issues)

**M-1. Duplicated sidebar layout code between Dashboard and Admin**
- Files: `src/app/(authenticated)/dashboard/layout.tsx` (485 lines) and `src/app/(admin)/layout.tsx` (438 lines)
- These two files are nearly identical, duplicating the entire sidebar, mobile header, navigation rendering, user profile section, collapse logic, sign-out, theme toggle, and focus trap. Any bug fix or UI change must be applied in both places.
- **Fix**: Extract a shared `SidebarLayout` component that accepts `navItems` as a prop.

**M-2. Card component MutationObserver per-instance is expensive**
- File: `src/components/ui/card.tsx`, lines 42-85
- Every `Card` instance creates its own `MutationObserver` to watch for gradient/border attribute changes. A dashboard page with 20+ cards creates 20+ observers. The same pattern exists in `dialog.tsx` and `footer.tsx`.
- **Fix**: Move gradient/border state into a React context so all cards read from one source of truth, avoiding per-instance observers.

**M-3. Inconsistent empty state patterns**
- Dashboard main page (`dashboard/page.tsx`, lines 502-514) has a proper empty state with icon, title, description, and CTA.
- Chatbots list page (`chatbots/page.tsx`, lines 138-159) also has a good empty state.
- However, the Agent Console (`AgentConsoleLayout.tsx`) does not render any empty state if conversations list is empty -- it just shows an empty sidebar.
- **Fix**: Add empty states to all data-display components, particularly AgentConsoleLayout.

**M-4. Chatbot overview stats hardcoded to zero**
- File: `src/app/(authenticated)/dashboard/chatbots/[id]/page.tsx`, lines 36-40
- `stats` is initialized as `{ conversations: 0, messages: 0, satisfaction: 0 }` and never updated from any API call. The analytics fetch that populates these values appears to be missing. The stats cards always show 0.
- **Fix**: Fetch analytics data from `/api/chatbots/${id}/analytics` in the `useEffect` and update `stats`.

**M-5. Agent console sidebar is not responsive**
- File: `src/components/agent-console/AgentConsoleLayout.tsx`, line 45
- The conversation list sidebar is `w-80 flex-shrink-0` with no responsive behavior. On mobile viewports (375px), this takes up the entire width, leaving no room for the chat panel. There is no toggle or slide-over mechanism.
- **Fix**: Implement a mobile toggle where the conversation list is full-width with a "back" button pattern, revealing the chat panel when a conversation is selected.

**M-6. Login page "Or continue with" divider has hardcoded background**
- File: `src/app/(public)/login/page.tsx`, line 330
- The `<span>` has `bg-white dark:bg-secondary-800` hardcoded while the card uses `dark:bg-secondary-800`. If the card background changes via the CSS variable theming system, the divider background will mismatch.
- **Fix**: Use `bg-[rgb(var(--card-bg))]` or remove the background hack by using a different visual divider pattern.

**M-7. Embed branding link points to placeholder domain**
- File: `src/app/embed/email-writer/page.tsx`, line 66
- The "Powered by" link points to `https://yourdomain.com` instead of the actual application URL. This is a placeholder that shipped.
- **Fix**: Update to the real domain or use an environment variable.

**M-8. New chatbot wizard step validation is too lenient**
- File: `src/app/(authenticated)/dashboard/chatbots/new/page.tsx`, line 89
- Step 0 only requires `name.trim().length >= 1`, meaning a single character is valid. There is no visual validation feedback -- no error state shown if the field is blank.
- **Fix**: Add inline validation with the existing `FormField` component and a minimum length of 2-3 characters.

**M-9. Pricing page is `'use client'` but could be partially server-rendered**
- File: `src/app/(public)/pricing/page.tsx`, line 1
- The entire pricing page is a client component that fetches plans from the API on mount. This means no SEO-friendly content on initial load and a blank/loading state for the most conversion-critical page.
- **Fix**: Fetch plans server-side and render static plan cards, making only the billing toggle and checkout logic client-side.

**M-10. Knowledge page add-source form has no file upload for PDFs**
- File: `src/app/(authenticated)/dashboard/chatbots/[id]/knowledge/page.tsx`, lines 40-41
- The `addMode` type only supports `'url' | 'text' | 'qa'`. The CLAUDE.md mentions "PDF parsing, DOCX extraction" as knowledge source types, but there is no file upload UI. Users wanting to upload documents have no path to do so from this page.
- **Fix**: Add a `'file'` addMode with a file upload input accepting `.pdf` and `.docx`.

---

## LOW (Nice-to-have improvements)

**L-1. H1 heading `lg:text-10xl` class is likely invalid Tailwind**
- File: `src/components/ui/heading.tsx`, line 11
- The public variant uses `lg:text-10xl`. Standard Tailwind goes up to `text-9xl`. Unless there is a custom config extending this, this class produces no output at `lg` breakpoint.
- **Fix**: Verify tailwind config or change to `lg:text-9xl` or a custom class.

**L-2. Tooltip trigger wraps children in extra `div`**
- File: `src/components/ui/tooltip.tsx`, line 156
- The tooltip wraps children in `<div className="relative inline-flex">`. When the child is already an inline or flex element (like the `Info` icon buttons on the dashboard), this can cause subtle layout issues.
- **Fix**: Consider using `React.cloneElement` to attach handlers directly, or allow a custom `as` prop.

**L-3. Footer links to non-existent pages**
- File: `src/components/ui/footer.tsx`, lines 23-29
- Links to `/about`, `/contact`, `/careers`, and `/cookies` are rendered in both the footer and the header menu. None of these pages exist in the filesystem based on the directory listing.
- **Fix**: Either create these pages or remove the links to avoid 404 experiences.

**L-4. Skeleton component hardcodes colors instead of using CSS variables**
- File: `src/components/ui/skeleton.tsx`, line 27
- Uses `bg-secondary-200 dark:bg-secondary-700` while the rest of the theming system uses CSS variables for backgrounds. In custom-themed deployments, skeletons will look inconsistent.
- **Fix**: Use `bg-[rgb(var(--skeleton-bg))]` or similar CSS variable.

**L-5. Login skeleton card uses hardcoded dark mode color**
- File: `src/app/(public)/login/page.tsx`, line 401
- `dark:bg-[rgb(30,41,59)]` is a raw RGB value for the skeleton card. The actual login form card uses `dark:bg-secondary-800`. These may not match.
- **Fix**: Use the same class `dark:bg-secondary-800` for consistency.

**L-6. Chatbot sub-nav has 16 total nav items which is cognitively heavy**
- File: `src/components/chatbots/ChatbotSubNav.tsx`, lines 28-48
- 6 primary tabs + 10 in the "More" dropdown. While the overflow pattern is sound, the sheer number of features may overwhelm users.
- **Fix**: Consider grouping related items (e.g., "Customer Insights" for Leads/Surveys/Sentiment, "Support" for Tickets/Contact/Issues) to reduce cognitive load.

**L-7. Dashboard Quick Actions section has no visual grouping logic**
- File: `src/app/(authenticated)/dashboard/page.tsx`, lines 328-382
- Tools are split across two `flex-wrap` containers (lines 328-353 and 354-373) without clear labeling of what's in each group. The grouping appears arbitrary.
- **Fix**: Either combine into one flex group or label sections ("AI Tools" vs "Content Tools").

**L-8. Badge component uses `div` instead of `span`**
- File: `src/components/ui/badge.tsx`, line 30
- Badges render as `<div>` which is a block element. They are used inline alongside text (e.g., in `CardTitle` contexts). This creates minor semantic issues.
- **Fix**: Change to `<span>` which is the conventional inline element for badges.

---

## POSITIVE PATTERNS (What is working well -- preserve these)

**P-1. Consistent icon handling with `aria-hidden="true"`**
- Used across all pages (homepage, dashboard, admin, chatbot pages, header, footer). Decorative icons correctly marked as hidden. Actionable icon buttons have `aria-label`.

**P-2. Comprehensive loading skeletons**
- File: `src/components/ui/skeleton.tsx` provides `CardSkeleton`, `TableSkeleton`, `ProfileSkeleton`, `StatsSkeleton`, `ListSkeleton`, `DashboardSkeleton`, `BillingSkeleton`. Nearly every page uses contextual skeletons rather than generic spinners. The chatbot list, dashboard, and chatbot detail pages all have specific skeleton layouts matching their content structure.

**P-3. Design system with CSS variable theming**
- Components like `Button`, `Card`, `Input`, `Select`, `Dialog` all use CSS variables (`--card-bg`, `--form-element-bg`, `--modal-bg`) enabling runtime theming. This is architecturally sound and allows the customize page's color system to work.

**P-4. Proper form validation infrastructure**
- File: `src/components/ui/form-field.tsx` provides animated validation states, proper `aria-invalid`, `aria-describedby` linking, composable validators, and visual error/success indicators. This is a well-implemented pattern.

**P-5. Onboarding checklist for new chatbots**
- File: `src/components/chatbots/OnboardingChecklist.tsx` provides a clear 4-step progress bar with contextual links, dismissible via localStorage. Guides users through knowledge, customize, test, deploy.

**P-6. Skip-to-content links on all layouts**
- Dashboard layout (line 192), Admin layout (line 160), and Header component (line 263) all include proper skip navigation links with appropriate focus styling.

**P-7. Focus trap and Escape handling on mobile sidebar**
- File: `src/app/(authenticated)/dashboard/layout.tsx`, lines 131-136, 172-178. Mobile sidebar uses `useFocusTrap` with `onEscape` and `restoreFocus`, properly managing keyboard navigation.

**P-8. Collapsible sidebar with persistence**
- Dashboard layout saves collapsed state to `localStorage` (lines 72-77, 80-84), provides tooltip labels in collapsed mode (lines 417-421), and uses smooth transitions. This is a well-considered feature for power users.

**P-9. Consistent error handling pattern**
- The error boundary system at `src/components/error-boundary.tsx` provides `ErrorBoundary`, `InlineErrorFallback`, `CardErrorFallback`, and `PageErrorFallback` -- covering all error display contexts. The `app/error.tsx` and `app/global-error.tsx` are properly wired.

**P-10. ConfirmDialog with hook API**
- File: `src/components/ui/confirm-dialog.tsx` provides both a component API and a `useConfirmDialog` hook that returns a `confirm()` promise. Supports `danger`, `warning`, and `info` variants with matching icons and colors. Excellent DX.

---

## PRIORITIZED ACTION PLAN: Top 10 Changes by Impact vs. Effort

| Rank | Issue | Impact | Effort | Rationale |
|------|-------|--------|--------|-----------|
| 1 | **C-2**: Fix sidebar `aria-hidden` on desktop | Critical a11y | Low | One-line conditional fix, unblocks all screen reader users from dashboard navigation |
| 2 | **H-3**: Show nav links inline on desktop header | High conversion | Medium | Currently all navigation is hidden behind a hamburger on every viewport -- major discoverability problem for a SaaS marketing site |
| 3 | **C-1**: Replace `confirm()` with ConfirmDialog | Critical UX | Low | The component already exists; swap one line of code to prevent accidental chatbot deletion |
| 4 | **C-3**: Add keyboard a11y to chatbot card menu | Critical a11y | Medium | Add ARIA attributes and focus management to the dropdown |
| 5 | **H-4**: Add focus trapping to Dialog component | High a11y | Medium | Affects every dialog in the app (knowledge sources, translation review, confirm dialogs) |
| 6 | **M-4**: Fetch actual stats on chatbot overview | High value | Low | One API call addition; currently the most visited chatbot page shows all zeros |
| 7 | **H-2**: Fix or remove non-functional category filters | High trust | Low | Either wire up filtering or remove the buttons; broken UI erodes trust |
| 8 | **M-1**: Extract shared sidebar layout | Medium maintenance | Medium | Eliminates 400+ lines of duplication; all future sidebar changes need only one edit |
| 9 | **H-7**: Remove production debug logging from Header | Medium quality | Trivial | Delete ~20 lines of `console.log` debug code |
| 10 | **M-9**: Server-render pricing page | High conversion | Medium | The most conversion-critical page should not flash empty on load |
