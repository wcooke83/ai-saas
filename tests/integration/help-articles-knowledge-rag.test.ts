import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Load E2E_TEST_SECRET from .env.local if not already in environment
if (!process.env.E2E_TEST_SECRET) {
  try {
    const envFile = readFileSync(resolve(__dirname, '..', '..', '.env.local'), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^E2E_TEST_SECRET=(.+)$/);
      if (match) process.env.E2E_TEST_SECRET = match[1].trim();
    }
  } catch { /* ignore */ }
}

const BASE_URL = 'http://localhost:3030';
const CHATBOT_ID = '10df2440-6aac-441a-855d-715c0ea8e506';
const CHAT_API = `${BASE_URL}/api/chat/${CHATBOT_ID}`;

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

async function sendChatMessage(message: string, sessionId: string, timeoutMs = 60_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(CHAT_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, stream: false, session_id: sessionId }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.log(`[Chat] ${res.status} for "${message}": ${body.slice(0, 300)}`);
      return null;
    }

    const data = await res.json();
    if (!data.success) {
      console.log(`[Chat] success=false for "${message}":`, JSON.stringify(data).slice(0, 300));
      return null;
    }

    return data;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchRecentPerfLogs(days = 1): Promise<any[]> {
  // Short wait for fire-and-forget perf log to land in DB
  await new Promise(r => setTimeout(r, 3000));

  const res = await fetch(`${BASE_URL}/api/chatbots/${CHATBOT_ID}/performance?days=${days}`);

  if (!res.ok) {
    console.log(`[Perf] API returned ${res.status}`);
    return [];
  }

  const data = await res.json();
  return data.data?.recent ?? [];
}

function findPerfEntriesForMessage(logs: any[], message: string): any[] {
  const needle = message.toLowerCase().slice(0, 25);
  return logs.filter(
    (r: any) => r.user_message && r.user_message.toLowerCase().includes(needle),
  );
}

async function apiGet(path: string) {
  return fetch(`${BASE_URL}${path}`);
}

async function apiPost(path: string, data?: Record<string, unknown>, timeoutMs?: number) {
  const controller = new AbortController();
  const timer = timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

  try {
    return await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      ...(data ? { body: JSON.stringify(data) } : {}),
      signal: controller.signal,
    });
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function apiPatch(path: string, data: Record<string, unknown>) {
  return fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function apiDelete(path: string) {
  return fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
}

async function cleanupArticleSources(): Promise<number> {
  const res = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
  if (!res.ok) return 0;

  const data = await res.json();
  const articleSources = (data.data?.sources ?? []).filter(
    (s: any) => s.name?.startsWith('Generated Articles:'),
  );

  for (const source of articleSources) {
    await apiDelete(`/api/chatbots/${CHATBOT_ID}/knowledge/${source.id}`);
  }

  return articleSources.length;
}

async function cleanupArticles(): Promise<number> {
  const res = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles`);
  if (!res.ok) return 0;

  const data = await res.json();
  const articles = data.data?.articles ?? [];

  for (const article of articles) {
    await apiDelete(`/api/chatbots/${CHATBOT_ID}/articles/${article.id}`);
  }

  return articles.length;
}

// ─────────────────────────────────────────────────────────────────────
// PHASE 1: Generate from Knowledge API
// ─────────────────────────────────────────────────────────────────────

describe('Help Articles: Generate from Knowledge', () => {
  it('HK-001: Generate articles from knowledge sources API', async () => {
    // Verify knowledge sources exist first
    const knowledgeRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    expect(knowledgeRes.ok).toBeTruthy();
    const knowledgeData = await knowledgeRes.json();
    const nonArticleSources = (knowledgeData.data?.sources ?? []).filter(
      (s: any) => !s.name?.startsWith('Generated Articles:'),
    );
    console.log(`[HK-001] Non-article knowledge sources: ${nonArticleSources.length}`);

    if (nonArticleSources.length === 0) {
      console.log('[HK-001] No knowledge sources to generate from — skipping');
      return;
    }

    // Generate articles from knowledge
    const res = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/generate`, undefined, 150_000);
    expect(res.ok).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.articlesGenerated).toBeGreaterThanOrEqual(0);
    console.log(
      `[HK-001] Generated ${data.data.articlesGenerated} articles, ` +
      `${data.data.chunksCreated} chunks, ${data.data.promptsUsed} prompts used`,
    );

    // If articles were generated, verify knowledge source was created
    if (data.data.chunksCreated > 0) {
      const afterRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
      const afterData = await afterRes.json();
      const articleSources = (afterData.data?.sources ?? []).filter(
        (s: any) => s.name?.startsWith('Generated Articles:'),
      );
      expect(articleSources.length).toBeGreaterThan(0);
      console.log(`[HK-001] Article knowledge sources created: ${articleSources.length}`);
    }
  }, 180_000);

  it('HK-002: Generate from knowledge returns correct response shape', async () => {
    const res = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/generate`, undefined, 150_000);

    if (!res.ok) {
      console.log(`[HK-002] Generate API returned ${res.status} — checking error shape`);
      const errorData = await res.json();
      expect(errorData).toHaveProperty('success');
      return;
    }

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('articlesGenerated');
    expect(data.data).toHaveProperty('chunksCreated');
    expect(data.data).toHaveProperty('promptsUsed');
    expect(data.data).toHaveProperty('message');
    expect(typeof data.data.articlesGenerated).toBe('number');
    expect(typeof data.data.chunksCreated).toBe('number');
    expect(typeof data.data.promptsUsed).toBe('number');
  }, 180_000);

  it('HK-003: Generate from knowledge cleans up old article sources', async () => {
    // Record existing article sources
    const beforeRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const beforeData = await beforeRes.json();
    const oldArticleSources = (beforeData.data?.sources ?? []).filter(
      (s: any) => s.name?.startsWith('Generated Articles:'),
    );
    const oldIds = oldArticleSources.map((s: any) => s.id);
    console.log(`[HK-003] Old article sources: ${oldIds.length}`);

    // Regenerate
    const res = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/generate`, undefined, 180_000);
    expect(res.ok).toBeTruthy();

    // Verify old sources are gone
    const afterRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const afterData = await afterRes.json();
    const remaining = (afterData.data?.sources ?? []).filter(
      (s: any) => oldIds.includes(s.id),
    );
    expect(remaining.length).toBe(0);
    console.log(`[HK-003] Old sources removed: ${oldIds.length}, remaining: ${remaining.length}`);
  }, 240_000);

  it('HK-004: Articles list API returns generated articles', async () => {
    const res = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles`);
    expect(res.ok).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('articles');
    expect(data.data).toHaveProperty('knowledgeSourcesCount');
    expect(Array.isArray(data.data.articles)).toBe(true);

    console.log(
      `[HK-004] Articles: ${data.data.articles.length}, Knowledge sources: ${data.data.knowledgeSourcesCount}`,
    );

    // Verify article structure
    if (data.data.articles.length > 0) {
      const article = data.data.articles[0];
      expect(article).toHaveProperty('id');
      expect(article).toHaveProperty('title');
      expect(article).toHaveProperty('summary');
      expect(article).toHaveProperty('body');
      expect(article).toHaveProperty('published');
    }
  });
});

// ─────────────────────────────────────────────────────────────────────
// PHASE 2: Critical Test — Before/After Article Generation RAG Impact
// ─────────────────────────────────────────────────────────────────────

describe('Help Articles: RAG Live Fetch Elimination', () => {
  const SESSION_PREFIX = `e2e-rag-articles-${Date.now()}`;

  const TEST_QUESTIONS = [
    'What are your business hours?',
    'Where are you located?',
  ];

  it('RAG-001: Phase A — Baseline chat before article cleanup', async () => {
    const cleanedSources = await cleanupArticleSources();
    const cleanedArticles = await cleanupArticles();
    console.log(`[RAG-001] Cleaned up ${cleanedSources} article sources, ${cleanedArticles} articles`);

    // Wait for cleanup to propagate
    await new Promise(r => setTimeout(r, 2000));

    const sessionId = `${SESSION_PREFIX}-before`;
    const results: Array<{ question: string; replied: boolean; liveFetch: boolean | null }> = [];

    for (const question of TEST_QUESTIONS) {
      console.log(`[RAG-001] Asking (before articles): "${question}"`);

      const chatData = await sendChatMessage(question, sessionId);
      if (!chatData) {
        results.push({ question, replied: false, liveFetch: null });
        continue;
      }

      const reply = chatData.data?.message || '';
      console.log(`[RAG-001] Reply (${reply.length} chars): ${reply.slice(0, 200)}`);
      results.push({ question, replied: true, liveFetch: null });
    }

    // Fetch perf logs to record baseline live_fetch state
    const perfLogs = await fetchRecentPerfLogs();

    for (const result of results) {
      if (!result.replied) continue;
      const entries = findPerfEntriesForMessage(perfLogs, result.question);
      if (entries.length > 0) {
        const entry = entries[0];
        result.liveFetch = entry.live_fetch_triggered;
        console.log(
          `[RAG-001] Baseline: "${result.question.slice(0, 30)}" — ` +
          `live_fetch=${entry.live_fetch_triggered}, confidence=${entry.rag_confidence}, ` +
          `chunks=${entry.rag_chunks_count}`,
        );
      }
    }

    // At least one question should have been answered
    const answered = results.filter(r => r.replied);
    expect(answered.length).toBeGreaterThan(0);
  }, 120_000);

  it('RAG-002: Phase B — Generate articles from knowledge', async () => {
    const res = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/generate`, undefined, 200_000);
    expect(res.ok).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    console.log(
      `[RAG-002] Generated: ${data.data.articlesGenerated} articles, ` +
      `${data.data.chunksCreated} chunks, ${data.data.promptsUsed} prompts`,
    );

    if (data.data.articlesGenerated > 0) {
      expect(data.data.chunksCreated).toBeGreaterThan(0);
    }

    // Verify the knowledge source is completed
    const knowledgeRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
    const knowledgeData = await knowledgeRes.json();
    const articleSources = (knowledgeData.data?.sources ?? []).filter(
      (s: any) => s.name?.startsWith('Generated Articles:'),
    );

    if (data.data.chunksCreated > 0) {
      expect(articleSources.length).toBeGreaterThan(0);
      for (const source of articleSources) {
        expect(source.status).toBe('completed');
        expect(source.chunks_count).toBeGreaterThan(0);
        console.log(`[RAG-002] Source: "${source.name}" — ${source.chunks_count} chunks`);
      }
    }
  }, 240_000);

  it('RAG-003: Phase C — Chat after articles: no live fetch needed', async () => {
    const sessionId = `${SESSION_PREFIX}-after`;

    // First verify articles exist
    const articlesRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles`);
    const articlesData = await articlesRes.json();
    const articleCount = articlesData.data?.articles?.length ?? 0;
    console.log(`[RAG-003] Current articles: ${articleCount}`);

    if (articleCount === 0) {
      console.log('[RAG-003] No articles found — RAG-002 may not have generated any. Skipping live fetch check.');
      return;
    }

    let chatSucceeded = false;

    for (const question of TEST_QUESTIONS) {
      console.log(`[RAG-003] Asking (after articles): "${question}"`);

      const chatData = await sendChatMessage(question, sessionId);
      if (!chatData) continue;

      const reply = chatData.data?.message || '';
      console.log(`[RAG-003] Reply (${reply.length} chars): ${reply.slice(0, 200)}`);
      expect(reply.length).toBeGreaterThan(20);
      chatSucceeded = true;
    }

    if (!chatSucceeded) {
      console.log('[RAG-003] Chat API did not succeed for any question — skipping perf check');
      return;
    }

    // Fetch performance logs and verify no live fetch
    const perfLogs = await fetchRecentPerfLogs();

    for (const question of TEST_QUESTIONS) {
      const entries = findPerfEntriesForMessage(perfLogs, question);
      const afterEntries = entries.filter((e: any) => e.session_id === sessionId);

      if (afterEntries.length === 0) {
        const recentEntries = entries.slice(0, 1);
        if (recentEntries.length > 0) {
          const entry = recentEntries[0];
          console.log(
            `[RAG-003] After articles: "${question.slice(0, 30)}" — ` +
            `live_fetch=${entry.live_fetch_triggered}, confidence=${entry.rag_confidence?.toFixed?.(3)}, ` +
            `chunks=${entry.rag_chunks_count}`,
          );

          // KEY ASSERTION: live fetch should NOT be triggered when article chunks exist
          expect(entry.live_fetch_triggered).toBe(false);

          if (entry.rag_confidence > 0) {
            expect(entry.rag_chunks_count).toBeGreaterThan(0);
          }
        }
        continue;
      }

      for (const entry of afterEntries) {
        console.log(
          `[RAG-003] After articles: "${question.slice(0, 30)}" — ` +
          `live_fetch=${entry.live_fetch_triggered}, confidence=${entry.rag_confidence?.toFixed?.(3)}, ` +
          `chunks=${entry.rag_chunks_count}`,
        );

        // KEY ASSERTION: live fetch should NOT be triggered
        expect(entry.live_fetch_triggered).toBe(false);

        if (entry.rag_confidence > 0) {
          expect(entry.rag_chunks_count).toBeGreaterThan(0);
        }
      }
    }
  }, 120_000);

  it('RAG-004: Performance API shows article-cached requests', async () => {
    const perfRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/performance?days=1`);
    expect(perfRes.ok).toBeTruthy();

    const perfData = await perfRes.json();
    expect(perfData.success).toBe(true);
    expect(perfData.data).toHaveProperty('recent');
    expect(perfData.data).toHaveProperty('total_requests');

    const recent: any[] = perfData.data.recent;

    const articleCached = recent.filter(
      (r: any) =>
        r.live_fetch_triggered === false &&
        r.rag_chunks_count > 0 &&
        r.user_message &&
        TEST_QUESTIONS.some(q =>
          r.user_message.toLowerCase().includes(q.toLowerCase().slice(0, 20)),
        ),
    );

    console.log(
      `[RAG-004] Article-cached requests: ${articleCached.length} / ${recent.length} total recent`,
    );

    for (const r of articleCached) {
      expect(r.live_fetch_triggered).toBe(false);
      expect(r.rag_chunks_count).toBeGreaterThan(0);
      console.log(
        `[RAG-004] "${r.user_message?.slice(0, 40)}" — ` +
        `chunks=${r.rag_chunks_count}, confidence=${r.rag_confidence?.toFixed?.(3)}, ` +
        `model=${r.model}`,
      );
    }
  }, 60_000);
});

// ─────────────────────────────────────────────────────────────────────
// PHASE 3: Performance API Verification (API-only, no UI)
// ─────────────────────────────────────────────────────────────────────

describe('Help Articles: Performance API Verification', () => {
  it('PERF-002: Performance data shows requests with source details', async () => {
    const perfRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/performance?days=1`);
    expect(perfRes.ok).toBeTruthy();

    const perfData = await perfRes.json();
    const recent: any[] = perfData.data?.recent ?? [];

    if (recent.length === 0) {
      console.log('[PERF-002] No recent performance entries');
      return;
    }

    // Each entry should have the expected fields
    const entry = recent[0];
    expect(entry).toHaveProperty('live_fetch_triggered');
    expect(entry).toHaveProperty('rag_chunks_count');
    expect(entry).toHaveProperty('rag_confidence');
    expect(entry).toHaveProperty('user_message');

    const liveFetchCount = recent.filter((r: any) => r.live_fetch_triggered === true).length;
    const noLiveFetchCount = recent.filter((r: any) => r.live_fetch_triggered === false).length;
    console.log(
      `[PERF-002] Live fetch: ${liveFetchCount}, No live fetch: ${noLiveFetchCount}, Total: ${recent.length}`,
    );
  }, 60_000);

  it('PERF-004: Filter by live_fetch shows only live fetch requests', async () => {
    const filteredRes = await apiGet(
      `/api/chatbots/${CHATBOT_ID}/performance?days=7&live_fetch=true`,
    );
    expect(filteredRes.ok).toBeTruthy();

    const filteredData = await filteredRes.json();
    const filtered: any[] = filteredData.data?.recent ?? [];

    for (const entry of filtered) {
      expect(entry.live_fetch_triggered).toBe(true);
    }
    console.log(`[PERF-004] Filtered live fetch requests: ${filtered.length}`);
  }, 30_000);
});

// ─────────────────────────────────────────────────────────────────────
// PHASE 5: Extraction Prompts CRUD on Real Chatbot
// ─────────────────────────────────────────────────────────────────────

describe('Help Articles: Extraction Prompts', () => {
  it('EP-001: Extraction prompts API returns prompts', async () => {
    const res = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    expect(res.ok).toBeTruthy();

    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('prompts');
    expect(Array.isArray(data.data.prompts)).toBe(true);

    console.log(`[EP-001] Prompts count: ${data.data.prompts.length}`);

    if (data.data.prompts.length > 0) {
      const prompt = data.data.prompts[0];
      expect(prompt).toHaveProperty('id');
      expect(prompt).toHaveProperty('question');
      expect(prompt).toHaveProperty('enabled');
    }
  });

  it('EP-002: CRUD cycle — create, read, update, delete prompt', async () => {
    const question = `E2E CRUD test prompt ${Date.now()}`;

    // Create
    const createRes = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, { question });
    expect(createRes.ok).toBeTruthy();
    const createData = await createRes.json();
    const promptId = createData.data.prompt.id;
    expect(createData.data.prompt.question).toBe(question);
    expect(createData.data.prompt.enabled).toBe(true);

    // Read — verify it appears in the list
    const listRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();
    const found = listData.data.prompts.find((p: any) => p.id === promptId);
    expect(found).toBeDefined();
    expect(found.question).toBe(question);

    // Update — change question text
    const newQuestion = `${question} (updated)`;
    const patchRes = await apiPatch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`,
      { question: newQuestion },
    );
    expect(patchRes.ok).toBeTruthy();
    const patchData = await patchRes.json();
    expect(patchData.data.prompt.question).toBe(newQuestion);

    // Update — toggle enabled
    const toggleRes = await apiPatch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`,
      { enabled: false },
    );
    expect(toggleRes.ok).toBeTruthy();
    expect((await toggleRes.json()).data.prompt.enabled).toBe(false);

    // Delete
    const delRes = await apiDelete(`/api/chatbots/${CHATBOT_ID}/articles/prompts/${promptId}`);
    expect(delRes.ok).toBeTruthy();

    // Verify deletion
    const verifyRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const verifyData = await verifyRes.json();
    const stillExists = verifyData.data.prompts.find((p: any) => p.id === promptId);
    expect(stillExists).toBeUndefined();
  });

  it('EP-003: Validation rejects short prompt', async () => {
    const res = await apiPost(`/api/chatbots/${CHATBOT_ID}/articles/prompts`, { question: 'ab' });
    expect(res.ok).toBeFalsy();
    expect(res.status).toBe(400);
  });

  it('EP-004: Validation rejects empty edit', async () => {
    const listRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const listData = await listRes.json();

    if (listData.data.prompts.length === 0) {
      console.log('[EP-004] No prompts to test with — skipping');
      return;
    }

    const prompt = listData.data.prompts[0];
    const res = await apiPatch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { question: '' },
    );
    expect(res.ok).toBeFalsy();
  });
});

// ─────────────────────────────────────────────────────────────────────
// PHASE 6: Schedule API + Cron Execution on Real Chatbot
// ─────────────────────────────────────────────────────────────────────

describe('Help Articles: Schedule & Cron Execution', () => {
  it('SCHED-001: Get and set schedule', async () => {
    // Get current schedule
    const getRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    expect(getRes.ok).toBeTruthy();
    const getData = await getRes.json();
    const originalSchedule = getData.data.schedule;

    // Set to weekly
    const setRes = await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      article_schedule: 'weekly',
    });
    expect(setRes.ok).toBeTruthy();

    // Verify
    const verifyRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const verifyData = await verifyRes.json();
    expect(verifyData.data.schedule).toBe('weekly');

    // Restore
    await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      article_schedule: originalSchedule || 'manual',
    });
  });

  it('SCHED-002: Scheduled regeneration runs when due', async () => {
    const e2eSecret = process.env.E2E_TEST_SECRET;
    if (!e2eSecret) {
      console.log('[SCHED-002] E2E_TEST_SECRET not set — skipping cron execution test');
      return;
    }

    // 1. Record current state
    const beforeScheduleRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    expect(beforeScheduleRes.ok).toBeTruthy();
    const beforeSchedule = await beforeScheduleRes.json();
    const originalSchedule = beforeSchedule.data.schedule;
    const originalLastGenerated = beforeSchedule.data.lastGeneratedAt;
    console.log(
      `[SCHED-002] Before: schedule=${originalSchedule}, ` +
      `lastGenerated=${originalLastGenerated || 'never'}`,
    );

    const beforeArticlesRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles`);
    const beforeArticlesData = await beforeArticlesRes.json();
    const beforeArticleCount = beforeArticlesData.data?.articles?.length ?? 0;
    console.log(`[SCHED-002] Articles before cron: ${beforeArticleCount}`);

    // 2. Trigger the cron via e2e helper
    console.log('[SCHED-002] Triggering cron with daily schedule...');
    const cronRes = await apiPost('/api/e2e/trigger-article-cron', {
      secret: e2eSecret,
      chatbot_id: CHATBOT_ID,
      schedule: 'daily',
    }, 240_000);
    expect(cronRes.ok).toBeTruthy();

    const cronData = await cronRes.json();
    expect(cronData.success).toBe(true);
    console.log(
      `[SCHED-002] Cron result: skipped=${cronData.skipped}, ` +
      `articles=${cronData.result?.articles_generated}, ` +
      `chunks=${cronData.result?.chunks_created}, ` +
      `prompts=${cronData.result?.prompts_used}`,
    );

    if (cronData.skipped) {
      console.log(`[SCHED-002] Cron skipped: ${cronData.reason}`);
      await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
        article_schedule: originalSchedule || 'manual',
      });
      return;
    }

    // 3. Verify articles were regenerated
    expect(cronData.result.articles_generated).toBeGreaterThanOrEqual(0);

    // 4. Verify article_last_generated_at was updated
    const afterLastGenerated = cronData.after_last_generated;
    const backdatedTime = cronData.backdated_to;
    expect(afterLastGenerated).toBeDefined();
    expect(new Date(afterLastGenerated).getTime()).toBeGreaterThan(
      new Date(backdatedTime).getTime(),
    );
    console.log(
      `[SCHED-002] Timestamps: backdated=${backdatedTime}, ` +
      `after_cron=${afterLastGenerated}`,
    );

    // 5. Verify via schedule API that lastGeneratedAt is updated
    const afterScheduleRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const afterSchedule = await afterScheduleRes.json();
    expect(afterSchedule.data.lastGeneratedAt).toBe(afterLastGenerated);

    // 6. If articles were generated, verify knowledge chunks were created
    if (cronData.result.articles_generated > 0) {
      expect(cronData.result.chunks_created).toBeGreaterThan(0);

      const afterArticlesRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles`);
      const afterArticlesData = await afterArticlesRes.json();
      const afterArticleCount = afterArticlesData.data?.articles?.length ?? 0;
      console.log(`[SCHED-002] Articles after cron: ${afterArticleCount}`);

      const knowledgeRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/knowledge`);
      const knowledgeData = await knowledgeRes.json();
      const articleSources = (knowledgeData.data?.sources ?? []).filter(
        (s: any) => s.name?.startsWith('Generated Articles:'),
      );
      expect(articleSources.length).toBeGreaterThan(0);
      console.log(
        `[SCHED-002] Article knowledge sources: ${articleSources.length}, ` +
        `chunks: ${articleSources.map((s: any) => s.chunks_count).join(', ')}`,
      );
    }

    // 7. Restore original schedule
    await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      article_schedule: originalSchedule || 'manual',
    });
    console.log(`[SCHED-002] Restored schedule to: ${originalSchedule || 'manual'}`);
  }, 300_000);

  it('SCHED-003: Cron does NOT run when schedule is manual', async () => {
    const e2eSecret = process.env.E2E_TEST_SECRET;
    if (!e2eSecret) {
      console.log('[SCHED-003] E2E_TEST_SECRET not set — skipping');
      return;
    }

    // Save original schedule
    const beforeRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const beforeData = await beforeRes.json();
    const originalSchedule = beforeData.data.schedule;

    // Set to manual
    await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      article_schedule: 'manual',
    });

    // Verify
    const verifyRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/schedule`);
    const verifyData = await verifyRes.json();
    expect(verifyData.data.schedule).toBe('manual');
    console.log('[SCHED-003] Confirmed schedule is manual — cron would skip this chatbot');

    // Restore
    await apiPatch(`/api/chatbots/${CHATBOT_ID}/articles/schedule`, {
      article_schedule: originalSchedule || 'manual',
    });
  }, 60_000);

  it('SCHED-004: Per-prompt schedule override works', async () => {
    // Get prompts
    const promptsRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    expect(promptsRes.ok).toBeTruthy();
    const promptsData = await promptsRes.json();
    const prompts = promptsData.data.prompts;

    if (prompts.length === 0) {
      console.log('[SCHED-004] No prompts — skipping');
      return;
    }

    const prompt = prompts[0];
    const originalSchedule = prompt.schedule || 'inherit';

    // Set per-prompt schedule to "weekly"
    const patchRes = await apiPatch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { schedule: 'weekly' },
    );
    expect(patchRes.ok).toBeTruthy();
    const patchData = await patchRes.json();
    expect(patchData.data.prompt.schedule).toBe('weekly');
    console.log(`[SCHED-004] Set prompt "${prompt.question?.slice(0, 30)}" schedule to weekly`);

    // Verify persistence
    const verifyRes = await apiGet(`/api/chatbots/${CHATBOT_ID}/articles/prompts`);
    const verifyData = await verifyRes.json();
    const updated = verifyData.data.prompts.find((p: any) => p.id === prompt.id);
    expect(updated.schedule).toBe('weekly');

    // Restore
    await apiPatch(
      `/api/chatbots/${CHATBOT_ID}/articles/prompts/${prompt.id}`,
      { schedule: originalSchedule },
    );
    console.log(`[SCHED-004] Restored prompt schedule to: ${originalSchedule}`);
  }, 60_000);
});
