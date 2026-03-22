---
title: Deploying Your Chatbot
description: Learn how to embed your chatbot on any website using the JavaScript widget, iframe, or REST API
category: getting-started
order: 2
---

# Deploying Your Chatbot

Once your chatbot is configured and tested, deploy it to your website using one of several integration methods.

## Prerequisites

Before deploying, make sure:

1. Your chatbot is **published** (click the Publish button on the chatbot dashboard)
2. You've added at least one **knowledge source** so the chatbot can answer questions
3. You've tested the chatbot using the preview on the Deploy page

## JavaScript Widget (Recommended)

The easiest way to add your chatbot. Copy the embed code from the **Deploy** page:

```html
<script
  src="https://your-domain.com/widget/sdk.js"
  data-chatbot-id="your-chatbot-id"
  async
></script>
```

### Placement

Add this snippet before the closing `</body>` tag on your page. The widget will appear as a floating button in the corner you configured.

### Configuration Options

You can pass additional attributes to customize behavior:

```html
<script
  src="https://your-domain.com/widget/sdk.js"
  data-chatbot-id="your-chatbot-id"
  data-position="bottom-right"
  data-auto-open="true"
  data-auto-open-delay="3000"
  async
></script>
```

### Passing User Data

If your visitors are logged in, pass their data for personalized conversations:

```html
<script>
  window.ChatWidgetConfig = {
    chatbotId: 'your-chatbot-id',
    user: {
      name: 'John Doe',
      email: 'john@example.com',
    },
    context: {
      orderId: 'ORD-12345',
      plan: 'Premium',
    },
  };
</script>
<script src="https://your-domain.com/widget/sdk.js" async></script>
```

See [Passing User Data to Chatbot](./passing-user-data) for more details.

## Iframe Embed

For embedding the chat directly within your page layout (not as a floating widget):

```html
<iframe
  src="https://your-domain.com/widget/your-chatbot-id"
  width="400"
  height="600"
  frameborder="0"
  allow="clipboard-write"
></iframe>
```

This is useful for:
- Dedicated support pages
- In-app help panels
- Kiosk or terminal displays

## REST API

For full control, integrate directly with the chat API:

```bash
POST /api/chat/{chatbotId}
Content-Type: application/json

{
  "message": "What are your business hours?",
  "sessionId": "unique-session-id"
}
```

The API returns a streaming response. See the [API Integration Guide](./api-integration-guide) for full documentation.

## Agent Console (Live Handoff)

The agent console lets your support team manage live conversations when visitors escalate to a human agent. You can embed it directly on your website or internal admin panel — no need to log into the dashboard.

### Quick Embed

```html
<script
  src="https://your-domain.com/agent-console/sdk.js"
  data-chatbot-id="your-chatbot-id"
  data-api-key="your-api-key"
></script>
```

This renders a full-page agent console. Add `data-position="sidebar"` for a fixed 420px sidebar docked to the right.

### Manual Initialization

Mount the console into a specific container:

```html
<div id="my-console" style="height: 700px"></div>

<script src="https://your-domain.com/agent-console/sdk.js"></script>
<script>
  AgentConsole.init({
    chatbotId: 'your-chatbot-id',
    apiKey: 'your-api-key',
    position: 'full',        // 'full' or 'sidebar'
    container: '#my-console'  // CSS selector or DOM element
  });
</script>
```

### iFrame Embed

```html
<iframe
  src="https://your-domain.com/agent-console/your-chatbot-id#key=your-api-key"
  style="border:none;width:100%;height:700px;"
  allow="clipboard-write"
></iframe>
```

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `chatbotId` | string | Required. Your chatbot ID from the dashboard. |
| `apiKey` | string | Required. API key for authentication. |
| `position` | string | `"full"` (default) fills the container. `"sidebar"` docks a 420px panel to the right. |
| `container` | string \| Element | CSS selector or DOM element to mount into. Only used in `"full"` mode. |

> **Important:** The agent console requires a valid API key. Keep it server-side or in a protected admin area — never expose it to end users.

## Platform-Specific Notes

### WordPress

Paste the JavaScript widget code into a **Custom HTML** block, or add it to your theme's `footer.php` file.

### Shopify

Add the code to your theme's `theme.liquid` file, just before `</body>`.

### React / Next.js

Use a `useEffect` hook or add the script to your layout component:

```tsx
useEffect(() => {
  const script = document.createElement('script');
  script.src = 'https://your-domain.com/widget/sdk.js';
  script.dataset.chatbotId = 'your-chatbot-id';
  script.async = true;
  document.body.appendChild(script);
  return () => script.remove();
}, []);
```

### Single-Page Applications (SPA)

The widget automatically handles route changes. If you need to reinitialize after navigation, call:

```js
window.ChatWidget?.destroy();
window.ChatWidget?.init({ chatbotId: 'your-chatbot-id' });
```

## Allowed Origins (CORS)

For security, you can restrict which domains are allowed to load your chatbot widget:

1. Go to **Dashboard > Chatbots > [Your Chatbot] > Settings**
2. Find the **Allowed Origins** field
3. Add the domains where you'll embed the widget (e.g., `https://example.com`)

If no origins are specified, the widget can be loaded from any domain. When origins are set, only matching domains can use the widget.

## Verifying Deployment

After deploying:

1. Visit your website and confirm the chat button appears
2. Open the widget and send a test message
3. Check your chatbot's **Leads & Conversations** page to verify the session was recorded
4. Test on both desktop and mobile devices

## Troubleshooting

**Widget doesn't appear**
- Confirm the chatbot is published
- Check the browser console for JavaScript errors
- Verify the chatbot ID in the embed code matches your chatbot

**Widget appears but doesn't respond**
- Check that knowledge sources are processed (status: Success)
- Verify your API keys are configured in the environment
- Check the Network tab for failed API requests

**Widget looks wrong**
- Clear your browser cache — old widget styles may be cached
- Check Customize Widget settings for unintended color changes
