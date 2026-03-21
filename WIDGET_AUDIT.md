# Chatbot Widget Customization Audit

## Files Analyzed

- **Customize page (Live Preview)**: `src/app/(authenticated)/dashboard/chatbots/[id]/customize/page.tsx`
- **Actual widget**: `src/components/widget/ChatWidget.tsx`
- **Types/defaults**: `src/lib/chatbots/types.ts`
- **Translations**: `src/lib/chatbots/translations.ts`
- **Config API**: `src/app/api/widget/[chatbotId]/config/route.ts`
- **Settings page**: `src/app/(authenticated)/dashboard/chatbots/[id]/settings/page.tsx`

---

## Part 1: Code-Level Audit — Preview vs Actual Widget

### 1. Chat Tab

#### Color Discrepancies

| Element | Preview | Widget | Severity |
|---------|---------|--------|----------|
| Header status opacity | `opacity: 0.7` (line 1036) | `opacity: 0.9` (CSS line 2912) | Minor |
| Input border color | `${config.inputTextColor}30` (line 1498) | Hardcoded `#e5e7eb` (CSS line 3081) | Minor |
| Input area separator | `${config.inputTextColor}20` (line 1489) | Hardcoded `#e5e7eb` (CSS line 3072) | Minor |
| Send button sizing | `className="p-2"` — padding only (line 1505) | `width: 40px; height: 40px` — explicit (CSS line 3111) | Minor |

#### Structural Discrepancies

- **Header**: Preview shows only title + status. Widget shows logo (if set), flag icon, headset icon, transcript icon, expand button, close button. **Major** — admin cannot see what header really looks like.
- **File upload button**: Widget shows paperclip icon when `fileUploadConfig.enabled`. Preview does not show it.
- **Message bubble border radius**: Widget applies asymmetric radius (`border-bottom-right-radius: 4px` on user, `border-bottom-left-radius: 4px` on bot). Preview uses uniform `rounded-lg`.

#### Branding

- Preview: `config.textColor` at `opacity: 0.5`, inline `<p>` tag, no border.
- Widget: Hardcoded `#9ca3af`, `border-top: 1px solid #e5e7eb`, rendered as `<div>` with link.

#### Translation Strings

- **Header title**: Preview uses `config.headerText === 'Chat with us' ? t.headerTitle : config.headerText`. Widget uses `translateDefault()` with fallback to `chatbot.name` then `'Chat'`.
- **Placeholder**: Widget overrides custom placeholder when language changes mid-conversation. Preview always shows custom placeholder.

---

### 2. Pre-Chat Tab

#### Colors — All Match

`formBackgroundColor`, `formTitleColor`, `formDescriptionColor`, `formLabelColor`, `formInputBackgroundColor`, `formInputTextColor`, `formBorderColor`, `formSubmitButtonTextColor` — all use identical fallback chains.

#### Structural Discrepancies

- **Form field gap**: Preview uses `space-y-3` (12px). Widget uses `gap: 14px`. **Minor**.
- **Branding position**: Preview renders branding inline within scrollable form content. Widget renders branding fixed at the very bottom of the container, outside all views, with a `border-top`.

#### Translation Strings

- **Title/Description/Submit text**: Preview uses `t.preChatTitle`, `t.preChatDescription`, `t.preChatSubmit` directly. Widget uses `translateDefault(preChatFormConfig.title, DEFAULT_..., t.preChatTitle)` to respect user-customized text. Preview always shows translated default, ignoring customized titles/descriptions.

---

### 3. Verify Tab

#### Colors — All Match

Same fallback chains as Pre-Chat for shared properties.

#### Structural Discrepancies

- **Missing OTP step**: Preview only shows the initial verify/skip state. Widget has full OTP flow with code input, verify button, resend link. Preview represents only half the flow.

---

### 4. Post-Chat Tab

#### Color Discrepancies

| Element | Preview | Widget | Severity |
|---------|---------|--------|----------|
| Star rating color | `config.primaryColor` (line 1078) | Hardcoded `#f59e0b` amber (CSS line 3471) | **Critical** |
| Skip button | Styled with `secondaryButtonColor/TextColor/BorderColor` (lines 1117-1127) | Plain text link: `background: transparent`, `color: #6b7280`, no border (CSS lines 3435-3450) | **Critical** |

**Star rating**: Admins who customize `primaryColor` will see it applied to stars in the preview, but the actual widget always shows amber stars.

**Skip button**: The `secondaryButtonColor`, `secondaryButtonTextColor`, `secondaryButtonBorderColor` settings have NO effect on the actual survey skip button. Preview shows a fully styled bordered button; widget shows a simple text link.

#### Translation Strings

- Same pattern as Pre-Chat — preview ignores user-customized survey title/description/submit text.
- Rating label: Preview hardcodes reconstructed label based on translation matching. Widget uses `question.label` from config.

#### Missing Question Types

Preview only shows `rating` (stars) and `text` (textarea). Widget supports `single_choice` (radio) and `multi_choice` (checkboxes) as well.

---

### 5. Report (Escalation) Tab

#### Color Discrepancies

| Element | Preview | Widget | Severity |
|---------|---------|--------|----------|
| Reason button bg fallback | `config.reportReasonButtonColor \|\| '#f1f5f9'` (line 1308) | `config.reportReasonButtonColor \|\| config.backgroundColor` (CSS line 3737) | **Major** |
| Textarea bg fallback | `config.reportInputBackgroundColor \|\| '#f1f5f9'` (line 1334) | `config.reportInputBackgroundColor \|\| config.formInputBackgroundColor \|\| config.inputBackgroundColor` (CSS line 3769) | **Major** |
| Unselected reason border fallback | `config.reportInputBorderColor \|\| '#e2e8f0'` (line 1312) | `config.reportInputBorderColor \|\| config.formBorderColor \|\| '#e5e7eb'` (CSS line 3735) | Minor |
| Textarea border fallback | `config.reportInputBorderColor \|\| '#e2e8f0'` (line 1336) | `config.reportInputBorderColor \|\| config.formBorderColor \|\| '#e5e7eb'` (CSS line 3762) | Minor |

**Dark theme impact**: If a user sets a dark `backgroundColor` without setting `reportReasonButtonColor`, the widget shows dark reason buttons (inheriting bg) while the preview shows light gray `#f1f5f9` ones.

#### Structural Discrepancies

- **Close button**: Preview uses `×` character with `opacity: 0.4`. Widget uses SVG X icon.
- **Reason button sizing**: Preview: `px-3 py-2.5`, `text-xs` (12px). Widget: `font-size: 13px`, `padding: 10px 12px`.
- **Missing "Connect to human" button**: Widget shows a dashed-border handoff button (`.chat-widget-report-human-btn`) when `liveHandoffConfig.enabled`. Preview omits this entirely. **Major**.

---

### 6. Handoff Tab

#### Colors — All Match

All color fallback chains match between preview and widget:
- Cancel button: `secondaryButtonColor`, `secondaryButtonTextColor`, `secondaryButtonBorderColor` — match.
- Connect button: `reportSubmitButtonColor || primaryColor`, `reportSubmitButtonTextColor || formSubmitButtonTextColor || '#ffffff'` — match.
- Icon circle, title, description, textarea — all match.

#### Structural Discrepancies

- **Branding**: Preview uses inline `<p>` with `config.reportTextColor || config.textColor` at `opacity-50`. Widget uses `.chat-widget-branding` class with hardcoded `#9ca3af` and `border-top`.

---

### 7. Cross-Cutting Issues

#### 7.1 Branding Inconsistency (All Tabs) — Major

| Aspect | Preview | Widget |
|--------|---------|--------|
| Color | `config.textColor` at `opacity: 0.5` (varies by tab) | Hardcoded `#9ca3af` |
| Border | None | `border-top: 1px solid #e5e7eb` |
| Position | Inline within each tab's content (scrolls away) | Fixed at bottom of container, outside all views |
| Element | Plain text `<p>` | `<div>` with `<a href="/" target="_blank">` link |
| Link color | N/A | `config.primaryColor` |

#### 7.2 Height Calculation — Minor

Preview uses hardcoded `calc(100% - 72px)` or `calc(100% - 140px)`. Widget uses `flex: 1`. If header height changes (e.g., with logo), preview breaks.

#### 7.3 `textColor` Has No Color Picker — Major

`config.textColor` is defined in the interface and used extensively as a fallback for many properties, but there is NO ColorPicker for it. Users cannot change it through the UI.

#### 7.4 `reportInputTextColor` Has No Color Picker — Minor

Defined in types, used in widget CSS and preview, but no picker exposed in the Escalation Report color section.

#### 7.5 `secondaryColor` Is Essentially Unused — Minor

Only used once: handoff cancel hover state fallback. No picker exposed. Consider removing from interface.

#### 7.6 Form Input Font Size — Minor

Widget explicitly forces `font-size: 13px` for form inputs. Preview inherits container's `config.fontSize` (default 14px). 1px difference.

#### 7.7 Config API — No Issues

Both customize page and config API use the same `{ ...DEFAULT_WIDGET_CONFIG, ...(chatbot.widget_config || {}) }` merge pattern. No transformation discrepancies.

---

## Part 2: UX Audit

### Severity: Critical

#### A1. Color picker inputs lack accessible labels

The native `<input type="color">` (line 82) has `opacity: 0` and no `aria-label`. The hex text input (line 88) also lacks an explicit `aria-label` or `htmlFor`/`id` pair. Screen reader users encounter unlabeled inputs.

**Fix**: Add `aria-label={label}` to both the color and text inputs.

---

### Severity: Major

#### B1. Survey "Skip" button mismatch

Preview shows a fully styled bordered button with secondary button colors. Actual widget shows a plain text link with hardcoded gray. The secondary button color settings have zero effect on the actual skip button.

**Fix**: Either update widget skip button to use secondary button config values, or update preview to match the unstyled text link.

#### B2. `textColor` not exposed in UI

`textColor` is a key fallback for many properties (form labels, descriptions, timestamps, handoff text) but has no color picker.

**Fix**: Add a "Text Color" picker to the General section.

#### B3. Header icons missing from preview

Preview header shows only title + status. Actual widget shows 3-5 icons. Admin has no idea what their header really looks like.

**Fix**: Add simplified placeholder icons in the preview header styled with `headerTextColor`.

#### B4. Tab wrapping risk on narrow viewports

Six tabs with `flex-wrap` in a container ~350-450px wide. Tabs may wrap to a second row, breaking the pill-style background.

**Fix**: Use `overflow-x-auto flex-nowrap` or shorter tab labels.

#### B5. Tab buttons lack ARIA roles

No `role="tab"`, `aria-selected`, or `role="tablist"`. Screen readers cannot identify these as tabs.

**Fix**: Add proper ARIA tab roles.

#### B6. Widget header icons are under-discoverable

Flag and headset icons are 16px with no background, relying on `title` hover text. For critical features (report, handoff), these are too subtle.

**Fix**: Consider 20px icons, hover tooltips, or subtle background circles.

#### B7. Border radius controls misplaced under Typography

Container/input/button border radius are layout/shape concerns, not typography. The Typography card description says "Customize fonts and text."

**Fix**: Move border radius controls to the Layout card.

---

### Severity: Minor

#### C1. Branding placement inconsistent across tabs

Each tab places branding differently (inline, in footer, in scrollable area). Widget uses a consistent fixed-bottom approach.

#### C2. Rating star colors differ

Preview uses `primaryColor`; widget uses hardcoded amber `#f59e0b`.

#### C3. Message bubble border radius asymmetry missing in preview

Widget applies chat-tail style asymmetric corners. Preview uses uniform rounding.

#### C4. Terminology inconsistency

Color section says "Escalation Report", tab says "Report", `TAB_LABELS` says "Escalation", settings page says "Escalation Reporting".

**Fix**: Standardize. Use `TAB_LABELS[mode]` for tab button text.

#### C5. "Show all" checkbox is easy to overlook

Uses `text-xs text-secondary-500`. Admins may not discover it.

#### C6. Settings sidebar uses `telegram` id for Live Handoff section

Leftover naming: `{ id: 'telegram', label: 'Live Handoff' }`.

#### C7. Settings uses Send (paper plane) icon for Live Handoff

Widget uses headset icon. Settings sidebar should match.

#### C8. Handoff timeout zero-state unclear

Setting to 0 shows just "0 minutes" with no visual indicator it's disabled.

#### C9. Range sliders lack ARIA labels

Font size, border radius, width/height, button size, offset sliders have no `aria-label` or `htmlFor`/`id` connection.

#### C10. Position selector buttons lack aria-pressed

Selected state is visual only, not communicated to assistive technology.

#### C11. Preview clamps width/height with Math.min

Admin changes width slider from 380 to 500 and sees no visual change. No indication that preview is capped.

#### C12. Disabled inputs in preview affect visual appearance

`disabled` attribute applies browser opacity dimming, making colors appear different from live widget. Consider `readOnly` instead.

#### C13. Translation strings not using `translateDefault()` in preview

Preview always shows `t.*` translations directly. Widget respects user-customized text via `translateDefault()`. Affects Pre-Chat, Post-Chat title/description/submit text.

---

### Severity: Suggestion

#### D1. No per-field color reset

Color fallback chains are opaque. Once an admin sets a form-specific color, changing the general color no longer cascades. No way to "unset" an override back to "inherit."

**Fix**: Add a "Reset to default" button next to form-specific color pickers.

#### D2. No undo for individual changes

"Reset to Default" resets ALL configuration. No per-change undo.

#### D3. "Require Agent Online" code uses double negative

`require_agent_online !== false` is functionally correct but confusing for maintainers.

---

### Positive Findings

- Tab-scoped color filtering (`COLOR_SECTIONS_BY_TAB`) is well designed
- Escalation vs Live Handoff distinction is clear in settings page with good cross-referencing
- Flag icon fill toggle provides good active state feedback
- Star preview pre-filled to 4/5 is a good preview pattern
- Report reason buttons are interactive in preview
- Handoff dialog has proper keyboard support (`role="dialog"`, Escape key, `aria-labelledby`)
- Toggle switches properly use `role="switch"` and `aria-checked`

---

## Summary

| Severity | Count | Key Examples |
|----------|-------|-------------|
| Critical | 3 | Star color mismatch, skip button mismatch, color picker a11y |
| Major | 9 | textColor not exposed, header icons missing, report fallback chains, "Connect to human" missing from report preview, tab ARIA, border radius misplaced |
| Minor | 13 | Branding inconsistency, terminology, translation handling, preview clamping, form font size |
| Suggestion | 3 | Per-field reset, undo support, code clarity |
| Positive | 7 | Color filtering, settings clarity, interactive states, keyboard support |
