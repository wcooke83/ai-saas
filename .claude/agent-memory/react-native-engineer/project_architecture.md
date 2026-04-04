---
name: VocUI Mobile Architecture Decisions
description: Navigation structure, Realtime strategy, state management, and Phase 1 implementation decisions
type: project
---

## Navigation structure
- Bottom tabs: Inbox (unified), Chatbots, Settings
- Stack within Chatbots tab: chatbot list → per-bot tabs (Conversations, Knowledge, Analytics, Settings)
- Modal stack for conversation detail + chat (file: `app/conversation/[conversationId].tsx`, receives `conversationId` + `chatbotId` as params)

## Realtime strategy
- One Supabase channel per chatbot for `telegram_handoff_sessions` — subscribed for all chatbots simultaneously when app is foregrounded
- One Supabase channel per open conversation for `messages` INSERT
- Reconnect all channels on AppState `active` transition (both `useRealtimeManager` and `useConversationRealtime` handle this)
- Zustand `chatbotsStore.chatbotIds` drives which channels open

## Auth approach (Phase 1 implemented)
- Supabase email/password. Session persisted by Supabase's own AsyncStorage adapter.
- `useAuthStore` (Zustand + persist) only persists `agentName`; session itself is NOT double-persisted.
- `useAuth` hook exposes `loading` boolean — root layout waits for loading=false before redirecting.
- `agentName` defaults to email prefix if empty; editable in Settings.

## State management
- Zustand: `useAuthStore` (user, session, agentName), `useChatbotsStore` (chatbotIds, pendingCounts), `useNotificationsStore` (expoPushToken)
- React Query: conversations list (per chatbot + status), messages (per conversation), knowledge sources, analytics, chatbot detail
- Local state: typing indicator, input text, action loading

## API integration
- `lib/api.ts` `apiFetch` reads access_token from `supabase.auth.getSession()` on every call and sends as `Authorization: Bearer <token>`
- `EXPO_PUBLIC_API_URL` defaults to `https://vocui.com`

## Conversation detail implementation
- `conversation-detail` query key fetches across all statuses to find the conversation (pending/active/resolved)
- Optimistic send: adds temp message to React Query cache, rolls back on error
- `FlatList` (not inverted) with `scrollToEnd` on `onContentSizeChange` and `onLayout`

## Agent Assignment schema needed
Table: `chatbot_agents` — columns: id, chatbot_id, user_id (agent), invited_email, role ('viewer'|'agent'|'admin'), permissions Json, status ('pending'|'active'), created_at, accepted_at
RLS: chatbot owner can CRUD; agent can read their own rows.

## Unified inbox approach
Client-side merge: React Query `useQueries` fires one `agent-conversations?status=pending` per chatbot in parallel, results merged and sorted by `last_message_at`. No new backend route needed for v1.

## Phase 2 screens (fully implemented)

- **Settings** (`[chatbotId]/settings/index.tsx`): Full edit form. `getChatbot` via React Query, `updateChatbot` via `useMutation`. `@react-native-community/slider` for temperature. Sticky save button with `KeyboardAvoidingView`. Haptics on success.
- **Knowledge** (`[chatbotId]/knowledge/index.tsx`): `getKnowledgeSources` list. `Swipeable` from `react-native-gesture-handler` for swipe-to-delete. Long-press action sheet (reprocess / toggle priority / delete). Add-source `Modal` (pageSheet) with URL/Text/Q&A tabs. FAB for open. Error message expand on tap.
- **Analytics** (`[chatbotId]/analytics/index.tsx`): 7d/30d/90d period selector. Stats grid (5 cards). `VictoryArea` chart from `victory-native` for daily conversations. Skeleton animation while loading.

### Shared components added in Phase 2
- `components/Toast.tsx` — slide-up toast, `useToast()` hook for (message, type, visible, onHide)
- `components/SectionHeader.tsx` — uppercase section label

### New packages added (Phase 2)
- `@react-native-community/slider` ^4.5.0 — temperature slider in settings
- `react-native-svg` 15.8.0 — already in Expo SDK, needed explicitly for victory-native
- `victory-native` ^41.0.0 — line/area chart for analytics

### Types
- `lib/types.ts` — `Chatbot`, `ChatbotUpdatePayload`, `KnowledgeSource`, `AddSourcePayload`, `AnalyticsSummary`
- `lib/api.ts` — imports from `lib/types.ts`; all Phase 2 API helpers added at bottom of file

### Response shape assumptions (based on API contract)
- `getChatbot` → `{ chatbot: Chatbot }` (wraps in `.chatbot`)
- `updateChatbot` PATCH → `{ chatbot: Chatbot }`
- `getKnowledgeSources` → `{ sources: KnowledgeSource[] }` (already correct shape)
- `addKnowledgeSource` → `{ source: KnowledgeSource }`
- `updateKnowledgeSource` PATCH → `{ source: KnowledgeSource }`
- `getAnalytics` → `AnalyticsSummary` directly (no wrapper)

### tsc note
Running `npx tsc --noEmit` from `mobile/` shows "Cannot find module 'react-native'" and `--jsx` flag errors across all files — these are pre-existing, caused by tsconfig not finding node_modules when run outside Expo's build toolchain. Ignore them. The only real error to watch for is TS7006 implicit-any, which was fixed.

## NativeWind v4 config
- `global.css` with @tailwind directives, imported in `app/_layout.tsx`
- `metro.config.js` uses `withNativeWind(config, { input: './global.css' })`
- `babel.config.js`: preset `['babel-preset-expo', { jsxImportSource: 'nativewind' }]` + `'nativewind/babel'` plugin
- `tailwind.config.js` must `presets: [require('nativewind/preset')]`
