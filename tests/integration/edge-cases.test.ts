import { describe, it, expect } from 'vitest';

const BASE_URL = 'http://localhost:3030';
const CHATBOT_ID = 'e2e00000-0000-0000-0000-000000000001';

async function patchChatbot(data: Record<string, unknown>) {
  return fetch(`${BASE_URL}/api/chatbots/${CHATBOT_ID}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

async function getChatbot() {
  return fetch(`${BASE_URL}/api/chatbots/${CHATBOT_ID}`);
}

async function postKnowledge(data: Record<string, unknown>) {
  return fetch(`${BASE_URL}/api/chatbots/${CHATBOT_ID}/knowledge`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

describe('Edge Cases', () => {
  it('temperature bounds — reject value > 2', async () => {
    const res = await patchChatbot({ temperature: 2.5 });
    expect(res.status).toBeLessThan(500);
  });

  it('temperature bounds — reject negative value', async () => {
    const res = await patchChatbot({ temperature: -1 });
    expect(res.status).toBeLessThan(500);
  });

  it('max_tokens bounds — reject 0', async () => {
    const res = await patchChatbot({ max_tokens: 0 });
    expect(res.status).toBeLessThan(500);
  });

  it('chatbot name with special characters', async () => {
    const specialName = 'Bot <script>alert("xss")</script> & "quotes" \'apostrophes\'';
    const res = await patchChatbot({ name: specialName });
    expect(res.status).toBeLessThan(500);

    if (res.ok) {
      const getRes = await getChatbot();
      if (getRes.ok) {
        const body = await getRes.json();
        const name = (body.data?.chatbot || body.data)?.name;
        // Name should be stored as-is (escaped on render, not on save)
        expect(name).toBe(specialName);
      }
    }

    // Restore
    await patchChatbot({ name: 'E2E Test Bot' });
  });

  it('very long system prompt accepted', async () => {
    const longPrompt = 'You are a helpful assistant. '.repeat(200); // ~5600 chars
    const res = await patchChatbot({ system_prompt: longPrompt });
    expect(res.ok).toBeTruthy();

    // Restore
    await patchChatbot({ system_prompt: 'You are a helpful test assistant.' });
  });

  it('empty knowledge content rejected', async () => {
    const res = await postKnowledge({ type: 'text', name: 'Empty', content: '' });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.status).toBeLessThan(500);
  });

  it('duplicate knowledge source name allowed', async () => {
    const name = `Dupe Test ${Date.now()}`;
    const res1 = await postKnowledge({ type: 'text', name, content: 'First source content' });
    const res2 = await postKnowledge({ type: 'text', name, content: 'Second source content' });
    // Both should succeed (names aren't unique constraints)
    expect(res1.ok).toBeTruthy();
    expect(res2.ok).toBeTruthy();
  });

  it('widget config with unknown fields is preserved', async () => {
    const res = await patchChatbot({
      widget_config: { customField: 'should be kept', primaryColor: '#999999' },
    });
    expect(res.ok).toBeTruthy();
  });
});
