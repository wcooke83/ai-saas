---
title: Customizing Widget Appearance
description: Learn how to customize the chatbot widget to match your brand with colors, positioning, and styling options
category: chatbot-features
order: 3
---

# Customizing Widget Appearance

Make the chatbot widget match your brand by customizing colors, position, size, and behavior.

## Overview

The chatbot widget can be customized in two ways:

1. **Dashboard Settings** — Visual editor for common customizations
2. **SDK Configuration** — Advanced options via JavaScript

## Dashboard Customization

Navigate to **Dashboard → Chatbots → [Your Chatbot] → Settings → Appearance**

### Primary Color

Controls the main accent color used throughout the widget:
- Header background
- Send button
- Links and highlights
- Loading indicators

**Example:**
```
Primary Color: #0ea5e9 (Sky Blue)
```

### Widget Position

Choose where the widget appears on your page:

- **Bottom Right** (default) — Standard position for most websites
- **Bottom Left** — Alternative for RTL languages or design preference
- **Top Right** — For apps with bottom navigation
- **Top Left** — Rare, but available

### Widget Size

Control the chat window dimensions:

- **Small** — 320px × 450px (mobile-friendly)
- **Medium** — 380px × 550px (default, balanced)
- **Large** — 450px × 650px (desktop-focused)

### Chat Bubble

Customize the floating chat button:

**Icon Options:**
- Message bubble (default)
- Chat dots
- Headset
- Robot
- Custom image URL

**Bubble Color:**
- Inherits primary color by default
- Can be set independently

**Bubble Size:**
- Small (48px)
- Medium (56px, default)
- Large (64px)

### Welcome Message

Set the initial message users see when opening the widget:

```
Default: "Hi! How can I help you today?"
Custom: "Welcome to Acme Support! Ask me anything about our products."
```

### Placeholder Text

Customize the input field placeholder:

```
Default: "Type your message..."
Custom: "Ask a question..."
```

## SDK Configuration

For advanced customization, use the SDK initialization options:

### Basic Customization

```html
<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'your-chatbot-id',
    
    // Colors
    primaryColor: '#0ea5e9',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    
    // Position
    position: 'bottom-right', // 'bottom-left', 'top-right', 'top-left'
    
    // Size
    width: 380,
    height: 550,
    
    // Bubble
    bubbleIcon: 'message', // 'chat', 'headset', 'robot', or URL
    bubbleSize: 56,
    bubbleColor: '#0ea5e9',
    
    // Text
    welcomeMessage: 'Hi! How can I help you today?',
    placeholder: 'Type your message...',
  });
</script>
```

### Advanced Options

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  // Behavior
  autoOpen: false,              // Auto-open on page load
  autoOpenDelay: 3000,          // Delay before auto-open (ms)
  showOnMobile: true,           // Show on mobile devices
  showOnDesktop: true,          // Show on desktop
  
  // Animations
  enableAnimations: true,       // Enable slide/fade animations
  animationDuration: 300,       // Animation speed (ms)
  
  // Branding
  showBranding: true,           // Show "Powered by AI SaaS"
  brandingText: 'Custom Text',  // Custom branding text
  
  // Pre-chat form
  skipPreChat: false,           // Skip pre-chat form
  preChatFields: ['name', 'email'], // Required fields
  
  // Advanced styling
  customCSS: `
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .message-bubble {
      border-radius: 20px;
    }
  `,
});
```

## Color Customization

### Using Brand Colors

Match your website's color scheme:

```javascript
// Example: Purple brand
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  primaryColor: '#7c3aed',      // Purple-600
  backgroundColor: '#faf5ff',    // Purple-50
  textColor: '#581c87',          // Purple-900
  bubbleColor: '#7c3aed',
});
```

```javascript
// Example: Green brand
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  primaryColor: '#10b981',      // Emerald-500
  backgroundColor: '#ecfdf5',    // Emerald-50
  textColor: '#064e3b',          // Emerald-900
  bubbleColor: '#10b981',
});
```

### Dark Mode Support

The widget automatically adapts to dark mode, but you can customize:

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  darkMode: 'auto', // 'auto', 'light', 'dark'
  
  // Dark mode colors
  darkModeColors: {
    primaryColor: '#38bdf8',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
  },
});
```

## Positioning Examples

### Bottom Right (Default)

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  position: 'bottom-right',
  offset: {
    bottom: 20,  // 20px from bottom
    right: 20,   // 20px from right
  },
});
```

### Bottom Left

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  position: 'bottom-left',
  offset: {
    bottom: 20,
    left: 20,
  },
});
```

### Custom Positioning

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  position: 'custom',
  customPosition: {
    bottom: '80px',   // Above a fixed footer
    right: '20px',
  },
});
```

## Responsive Design

### Mobile Optimization

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  // Desktop settings
  width: 380,
  height: 550,
  
  // Mobile overrides
  mobileWidth: '100%',      // Full width on mobile
  mobileHeight: '100%',     // Full height on mobile
  mobilePosition: 'bottom', // Slide up from bottom
});
```

### Breakpoint Customization

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  breakpoints: {
    mobile: 768,   // Mobile below 768px
    tablet: 1024,  // Tablet 768-1024px
    desktop: 1024, // Desktop above 1024px
  },
  
  // Different sizes per breakpoint
  responsive: {
    mobile: { width: '100%', height: '100%' },
    tablet: { width: 360, height: 500 },
    desktop: { width: 380, height: 550 },
  },
});
```

## Custom Branding

### Logo in Header

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  headerLogo: 'https://your-domain.com/logo.png',
  headerLogoSize: 32, // Height in pixels
  headerLogoPosition: 'left', // 'left', 'center', 'right'
});
```

### Custom Avatar

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  botAvatar: 'https://your-domain.com/bot-avatar.png',
  userAvatar: 'https://your-domain.com/user-avatar.png',
  
  showAvatars: true,
  avatarSize: 32,
});
```

### Footer Branding

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  showBranding: true,
  brandingText: 'Powered by Acme AI',
  brandingLink: 'https://acme.com',
  brandingPosition: 'center', // 'left', 'center', 'right'
});
```

## Animation Options

### Entrance Animations

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  entranceAnimation: 'slide-up', // 'slide-up', 'fade', 'scale', 'none'
  exitAnimation: 'slide-down',
  animationDuration: 300,
  animationEasing: 'ease-in-out',
});
```

### Message Animations

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  messageAnimation: 'fade-in', // 'fade-in', 'slide-in', 'none'
  typingIndicator: true,
  typingSpeed: 50, // Characters per second
});
```

## Pre-Chat Form Customization

### Custom Fields

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  preChatForm: {
    enabled: true,
    title: 'Welcome! Let us know who you are',
    fields: [
      {
        name: 'name',
        label: 'Your Name',
        type: 'text',
        required: true,
        placeholder: 'John Doe',
      },
      {
        name: 'email',
        label: 'Email Address',
        type: 'email',
        required: true,
        placeholder: 'john@example.com',
      },
      {
        name: 'company',
        label: 'Company',
        type: 'text',
        required: false,
        placeholder: 'Acme Inc',
      },
      {
        name: 'topic',
        label: 'What can we help with?',
        type: 'select',
        required: true,
        options: [
          'Sales Question',
          'Technical Support',
          'Billing Issue',
          'Other',
        ],
      },
    ],
    submitText: 'Start Chat',
  },
});
```

### Skip Pre-Chat for Authenticated Users

```javascript
// For logged-in users
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  user: {
    id: 'user_123',
    name: 'John Doe',
    email: 'john@example.com',
  },
  
  // Pre-chat form automatically skipped
});
```

## Custom CSS

### Inline Styles

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  
  customCSS: `
    /* Header gradient */
    .chat-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    
    /* Rounded messages */
    .message-bubble {
      border-radius: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    /* Custom scrollbar */
    .chat-messages::-webkit-scrollbar {
      width: 8px;
    }
    .chat-messages::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
    
    /* Larger send button */
    .send-button {
      width: 48px;
      height: 48px;
      border-radius: 24px;
    }
  `,
});
```

### External Stylesheet

```html
<link rel="stylesheet" href="/chatbot-custom.css">
<script>
  ChatWidget.init({
    chatbotId: 'your-chatbot-id',
    customStylesheet: '/chatbot-custom.css',
  });
</script>
```

## Complete Example

Here's a fully customized widget:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Acme Support</title>
</head>
<body>
  <script src="https://your-domain.com/widget/sdk.js"></script>
  <script>
    ChatWidget.init({
      chatbotId: 'your-chatbot-id',
      
      // Branding
      primaryColor: '#7c3aed',
      headerLogo: 'https://acme.com/logo.png',
      botAvatar: 'https://acme.com/bot.png',
      
      // Layout
      position: 'bottom-right',
      width: 400,
      height: 600,
      
      // Bubble
      bubbleIcon: 'https://acme.com/chat-icon.svg',
      bubbleSize: 64,
      bubbleColor: '#7c3aed',
      
      // Messages
      welcomeMessage: 'Welcome to Acme Support! How can we help you today?',
      placeholder: 'Ask us anything...',
      
      // Behavior
      autoOpen: false,
      enableAnimations: true,
      
      // Pre-chat
      preChatForm: {
        enabled: true,
        title: 'Let\'s get started',
        fields: [
          { name: 'name', label: 'Name', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
        ],
      },
      
      // Custom styling
      customCSS: `
        .chat-header {
          background: linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%);
        }
        .message-bubble {
          border-radius: 18px;
        }
      `,
    });
  </script>
</body>
</html>
```

## Best Practices

### Colors

✅ **Use sufficient contrast** — Ensure text is readable
✅ **Match your brand** — Use your primary brand colors
✅ **Test dark mode** — Verify colors work in both modes
✅ **Limit color palette** — Stick to 2-3 main colors

❌ **Don't use low contrast** — Avoid light text on light backgrounds
❌ **Don't clash with site** — Widget should complement, not compete
❌ **Don't overuse colors** — Too many colors looks unprofessional

### Positioning

✅ **Consider mobile** — Ensure widget doesn't block content
✅ **Avoid conflicts** — Check for overlapping elements
✅ **Test on all pages** — Widget should work everywhere
✅ **Respect user space** — Don't be too intrusive

❌ **Don't block CTAs** — Keep important buttons accessible
❌ **Don't auto-open aggressively** — Respect user intent
❌ **Don't cover content** — Especially on mobile

### Performance

✅ **Optimize images** — Compress logos and avatars
✅ **Lazy load** — Widget loads after page content
✅ **Minimize CSS** — Keep custom styles lean
✅ **Test load time** — Ensure fast initialization

❌ **Don't use huge images** — Keep under 50KB
❌ **Don't block rendering** — Widget should be async
❌ **Don't add heavy fonts** — Use system fonts when possible

## Troubleshooting

### Widget Not Showing

**Check:**
1. SDK script is loaded
2. `chatbotId` is correct
3. No JavaScript errors in console
4. Widget isn't hidden by CSS

### Styling Not Applied

**Check:**
1. Custom CSS syntax is valid
2. Selectors match widget elements
3. No conflicting site styles
4. CSS specificity is sufficient

### Position Issues

**Check:**
1. No fixed elements blocking widget
2. Z-index is high enough (default: 9999)
3. Offset values are correct
4. Viewport is large enough

## Next Steps

- [Passing User Data to Chatbot](passing-user-data-to-chatbot) — Personalize conversations
- [Chatbot Memory & Identity Verification](chatbot-memory-verification) — Remember users
- [API Integration Guide](api-integration-guide) — Use the chat API programmatically

## Need Help?

Contact support if you need assistance with widget customization or have specific design requirements.
