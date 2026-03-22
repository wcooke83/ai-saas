---
title: Customizing Widget Appearance
description: Learn how to customize the chatbot widget to match your brand with colors, fonts, positioning, and styling options
category: chatbot-features
order: 3
---

# Customizing Widget Appearance

Make the chatbot widget match your brand by customizing colors, fonts, position, size, and behavior.

## Accessing the Customize Page

Navigate to **Dashboard > Chatbots > [Your Chatbot] > Customize**

The Customize page has two panels:
- **Left panel** — Configuration controls for colors, typography, sizing, and behavior
- **Right panel** — Live preview that updates in real-time as you make changes

## Live Preview Tabs

The preview panel has tabs that let you preview different widget states:

| Tab | What It Shows |
|-----|---------------|
| **Chat** | Main chat view with messages |
| **Pre-Chat** | Pre-chat form before conversation starts |
| **Verify** | Email OTP verification screen |
| **Post-Chat** | Post-chat survey form |
| **Feedback** | Thumbs-down feedback follow-up |
| **Report** | Escalation report view |
| **Handoff** | Live agent handoff state |

The color controls on the left automatically update to show only the colors relevant to the selected preview tab. Toggle **"Show all colors"** to see every color option at once.

## Colors

### General Colors

| Setting | What It Controls | Default |
|---------|-----------------|---------|
| **Primary Color** | Header background, send button, selected states | `#0ea5e9` |
| **Secondary Color** | Light backgrounds, hover states | `#f0f9ff` |
| **Background Color** | Widget body background | `#ffffff` |
| **Text Color** | Main body text | `#0f172a` |

### Header Colors

| Setting | What It Controls | Default |
|---------|-----------------|---------|
| **Header Text Color** | Title text in the header bar | `#ffffff` |

### Message Bubble Colors

| Setting | What It Controls | Default |
|---------|-----------------|---------|
| **User Bubble Color** | Background of visitor messages | `#0ea5e9` |
| **User Bubble Text Color** | Text inside visitor messages | `#ffffff` |
| **Bot Bubble Color** | Background of bot messages | `#f1f5f9` |
| **Bot Bubble Text Color** | Text inside bot messages | `#0f172a` |

### Input Area Colors

| Setting | What It Controls | Default |
|---------|-----------------|---------|
| **Input Background Color** | Message input field background | `#ffffff` |
| **Input Text Color** | Text typed in the input field | `#0f172a` |
| **Input Placeholder Color** | Placeholder text in the input | `#94a3b8` |

### Send Button Colors

| Setting | What It Controls | Default |
|---------|-----------------|---------|
| **Send Button Color** | Background of the send button | `#0ea5e9` |
| **Send Button Icon Color** | Arrow icon inside the send button | `#ffffff` |

### Form Colors (Pre-Chat Form & Post-Chat Survey)

| Setting | Default |
|---------|---------|
| **Form Background Color** | `#ffffff` |
| **Form Title Color** | `#0f172a` |
| **Form Description Color** | `#6b7280` |
| **Form Border Color** | `#e5e7eb` |
| **Form Label Color** | `#0f172a` |
| **Form Submit Button Text Color** | `#ffffff` |
| **Form Placeholder Color** | `#94a3b8` |
| **Form Input Background Color** | `#ffffff` |
| **Form Input Text Color** | `#0f172a` |

### Secondary Button Colors

Used for buttons like "No thanks, start fresh" on the verification screen.

| Setting | Default |
|---------|---------|
| **Secondary Button Color** | `transparent` |
| **Secondary Button Text Color** | `#374151` |
| **Secondary Button Border Color** | `#d1d5db` |

### Escalation Report Colors

| Setting | Default |
|---------|---------|
| **Report Background Color** | `#ffffff` |
| **Report Text Color** | `#0f172a` |
| **Report Reason Button Color** | `#f1f5f9` |
| **Report Reason Button Text Color** | `#0f172a` |
| **Report Reason Selected Color** | `#0ea5e9` |
| **Report Reason Selected Text Color** | `#ffffff` |
| **Report Submit Button Color** | `#0ea5e9` |
| **Report Submit Button Text Color** | `#ffffff` |
| **Report Input Background Color** | `#f1f5f9` |
| **Report Input Text Color** | `#0f172a` |
| **Report Input Border Color** | `#e2e8f0` |

### Feedback Colors

| Setting | Default |
|---------|---------|
| **Feedback Background Color** | (inherits) |
| **Feedback Text Color** | (inherits) |
| **Feedback Button Color** | (inherits) |
| **Feedback Button Text Color** | (inherits) |

## Typography

### Font Family

Choose from 24 Google Fonts. The preview updates instantly when you select a new font.

**Sans-Serif:**
Inter, Roboto, Open Sans, Poppins, Lato, Montserrat, Nunito, Raleway, Source Sans Pro, Ubuntu, DM Sans, Manrope, Plus Jakarta Sans

**Serif:**
Playfair Display, Merriweather, Lora, Source Serif Pro

**Monospace:**
JetBrains Mono, Fira Code, Source Code Pro, IBM Plex Mono

**Rounded:**
Quicksand, Comfortaa, Varela Round

Default: `Inter, system-ui, sans-serif`

### Font Size

Set the base font size in pixels. Default: `14px`.

## Sizing & Position

### Widget Dimensions

| Setting | Default | Description |
|---------|---------|-------------|
| **Width** | 380px | Widget window width |
| **Height** | 600px | Widget window height |
| **Button Size** | 60px | Floating chat button diameter |

### Widget Position

Choose which corner of the screen the widget appears in:

- **Bottom Right** (default)
- **Bottom Left**
- **Top Right**
- **Top Left**

### Offset

| Setting | Default | Description |
|---------|---------|-------------|
| **Offset X** | 20px | Horizontal distance from the edge |
| **Offset Y** | 20px | Vertical distance from the edge |

## Border Radius

Control the roundness of different widget elements:

| Setting | Default | Description |
|---------|---------|-------------|
| **Container Border Radius** | 16px | Main widget window corners |
| **Input Border Radius** | 24px | Message input field corners |
| **Button Border Radius** | 50px | Send button and chat bubble button |

## Behavior

| Setting | Default | Description |
|---------|---------|-------------|
| **Auto Open** | Off | Automatically open the widget on page load |
| **Auto Open Delay** | 3000ms | Delay before auto-opening (milliseconds) |
| **Sound Enabled** | Off | Play a sound when new messages arrive |
| **Show Branding** | On | Display "Powered by" branding in the widget footer |
| **Header Text** | "Chat with us" | Title text shown in the widget header |

## Custom CSS

For advanced styling beyond the color pickers, use the **Custom CSS** field to inject your own styles. This CSS is applied inside the widget iframe.

```css
/* Example: gradient header */
.chat-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Example: rounder message bubbles */
.message-bubble {
  border-radius: 20px;
}

/* Example: custom scrollbar */
.chat-messages::-webkit-scrollbar {
  width: 8px;
}
.chat-messages::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}
```

## Saving & Resetting

- Click **Save Changes** to persist your customizations
- Click **Reset to Default** to revert all settings to the factory defaults
- Changes are saved per-chatbot — each chatbot can have its own styling

## Best Practices

### Colors

- Use sufficient contrast between text and background colors
- Match your brand's primary color for the header and send button
- Test all preview tabs to ensure colors work across every widget state
- Keep the palette to 2–3 main colors for a cohesive look

### Positioning

- **Bottom Right** is the most common and expected position for chat widgets
- Use offsets to avoid overlapping with fixed footers or cookie banners
- Test on both desktop and mobile devices

### Typography

- Sans-serif fonts (Inter, DM Sans, Poppins) work best for chat interfaces
- Serif fonts can work for luxury or editorial brands
- Keep the font size between 13–16px for readability

### Performance

- Custom CSS is injected inline — keep it concise
- The widget loads fonts on demand from Google Fonts CDN

## Next Steps

- [Passing User Data to Chatbot](passing-user-data-to-chatbot) — Personalize conversations
- [Chatbot Memory & Identity Verification](chatbot-memory-verification) — Remember returning visitors
- [Deploying Your Chatbot](deploying-your-chatbot) — Embed the widget on your website
