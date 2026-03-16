---
title: Passing User Data to Chatbot
description: Learn how to pass customer orders, inventory, and account data to your chatbot for personalized conversations
category: chatbot-features
order: 1
---

# Passing User Data to Chatbot

Make your chatbot aware of your logged-in users and their account data. This enables personalized conversations where the chatbot can answer questions about orders, check inventory, reference account details, and more.

## Overview

When embedding the chatbot on your website, you can pass two types of data:

1. **User Profile** (`user` object) — Verified user identity (name, email, plan, etc.)
2. **User Context** (`context` object) — Any account-specific data (orders, inventory, billing, etc.)

The chatbot will use this data to provide personalized, context-aware responses without needing to query your database.

## How It Works

### 1. Pass Data When Initializing the Widget

```html
<script src="https://your-domain.com/widget/sdk.js"></script>
<script>
  ChatWidget.init({
    chatbotId: 'your-chatbot-id',
    
    // User profile (verified identity)
    user: {
      id: 'user_123',           // Required: stable user ID for cross-device memory
      name: 'John Doe',
      email: 'john@example.com',
      plan: 'Pro'
    },
    
    // User context (account data)
    context: {
      recent_orders: [
        { 
          id: 'ORD-001', 
          product: 'Widget Pro', 
          total: '$149', 
          status: 'shipped',
          tracking: 'TRK123456'
        },
        { 
          id: 'ORD-002', 
          product: 'Widget Lite', 
          total: '$49', 
          status: 'delivered' 
        }
      ],
      account_balance: '$42.50',
      loyalty_points: 1250,
      subscription: {
        plan: 'Pro',
        renewal_date: '2026-04-15',
        auto_renew: true
      }
    }
  });
</script>
```

### 2. Data is Injected into AI System Prompt

The chatbot receives this data in its system prompt as:

- **Authenticated User Profile** — User identity details
- **User Account Data** — Formatted account information

### 3. Chatbot Answers Questions Naturally

The AI is instructed to reference this data naturally when answering questions.

## Use Cases

### Customer Orders

**User:** "Where's my order?"  
**Chatbot:** "Your most recent order (ORD-001) for Widget Pro is currently shipped with tracking number TRK123456."

**User:** "When did I order Widget Lite?"  
**Chatbot:** "You ordered Widget Lite in order ORD-002, which has been delivered."

### Product Inventory

```javascript
context: {
  inventory: {
    'widget-pro': { 
      in_stock: true, 
      quantity: 45, 
      price: '$149' 
    },
    'widget-lite': { 
      in_stock: false, 
      restock_date: '2026-03-20' 
    }
  }
}
```

**User:** "Is Widget Pro in stock?"  
**Chatbot:** "Yes! Widget Pro is in stock with 45 units available at $149."

**User:** "Do you have Widget Lite?"  
**Chatbot:** "Widget Lite is currently out of stock, but we're expecting a restock on March 20th."

### Account & Billing

```javascript
context: {
  subscription: {
    plan: 'Pro',
    renewal_date: '2026-04-15',
    auto_renew: true,
    payment_method: 'Visa ending in 4242'
  },
  invoices: [
    { id: 'INV-001', date: '2026-02-15', amount: '$149', status: 'paid' }
  ]
}
```

**User:** "When does my subscription renew?"  
**Chatbot:** "Your Pro plan renews on April 15, 2026, and auto-renewal is enabled."

**User:** "What's my payment method?"  
**Chatbot:** "You're currently using a Visa ending in 4242."

### Support Tickets

```javascript
context: {
  open_tickets: [
    { 
      id: 'TKT-789', 
      subject: 'Shipping delay', 
      status: 'in_progress',
      created: '2026-03-10'
    }
  ]
}
```

**User:** "What's the status of my support ticket?"  
**Chatbot:** "Your ticket TKT-789 about the shipping delay is currently in progress. It was opened on March 10th."

## Important Details

### User ID for Cross-Device Memory

When you provide `user.id`, it becomes the visitor ID for conversation memory. This means:

- ✅ User's conversation history follows them across devices
- ✅ Chatbot remembers previous conversations
- ✅ Pre-chat form is automatically skipped

### Data Size Limit

The `context` object is capped at **8KB** to prevent prompt bloat. For most use cases (orders, inventory, account info), this is plenty.

### Pre-Chat Form Behavior

When `user` data is provided:
- ✅ Pre-chat form is automatically skipped
- ✅ User is taken directly to the chat interface
- ✅ Their identity is already verified

### Security Considerations

⚠️ **Important:** Only pass data that the logged-in user should have access to. This data is sent to the AI model, so:

- ✅ DO pass: User's own orders, account balance, subscription details
- ❌ DON'T pass: Other users' data, sensitive credentials, PII of other customers

## Example: E-commerce Integration

Here's a complete example for an e-commerce site:

```javascript
// Fetch user data from your backend
const userData = await fetch('/api/user/profile').then(r => r.json());
const orderData = await fetch('/api/user/orders').then(r => r.json());

// Initialize chatbot with user context
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  user: {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    tier: userData.membershipTier
  },
  context: {
    recent_orders: orderData.orders.slice(0, 5).map(order => ({
      id: order.id,
      date: order.created_at,
      items: order.items.map(i => i.name).join(', '),
      total: order.total,
      status: order.status,
      tracking: order.tracking_number
    })),
    cart_items: userData.cart.length,
    wishlist_count: userData.wishlist.length,
    loyalty_points: userData.points,
    next_reward: userData.nextRewardAt
  }
});
```

## Example: SaaS Platform Integration

For a SaaS platform with usage tracking:

```javascript
ChatWidget.init({
  chatbotId: 'your-chatbot-id',
  user: {
    id: currentUser.id,
    name: currentUser.name,
    email: currentUser.email,
    role: currentUser.role
  },
  context: {
    subscription: {
      plan: currentUser.plan.name,
      seats: currentUser.plan.seats,
      seats_used: currentUser.team.length,
      renewal_date: currentUser.plan.renewsAt,
      features: currentUser.plan.features
    },
    usage: {
      api_calls_this_month: currentUser.usage.apiCalls,
      api_limit: currentUser.plan.apiLimit,
      storage_used: currentUser.usage.storageGB,
      storage_limit: currentUser.plan.storageGB
    },
    team: {
      members: currentUser.team.length,
      pending_invites: currentUser.pendingInvites.length
    }
  }
});
```

## Dynamic Updates

If user data changes during the session (e.g., they place a new order), you can reinitialize the widget:

```javascript
// After user places an order
function onOrderPlaced(newOrder) {
  // Fetch updated data
  const updatedOrders = await fetch('/api/user/orders').then(r => r.json());
  
  // Reinitialize widget with fresh data
  ChatWidget.init({
    chatbotId: 'your-chatbot-id',
    user: { /* ... */ },
    context: {
      recent_orders: updatedOrders.orders.slice(0, 5)
      // ... other context
    }
  });
}
```

## Next Steps

- [Chatbot Memory & Identity Verification](chatbot-memory-verification) — Learn about OTP verification for pre-chat forms
- [Customizing Widget Appearance](customizing-widget-appearance) — Style the chatbot to match your brand
- [API Integration Guide](api-integration-guide) — Use the chat API programmatically

## Need Help?

If you have questions about implementing user data pass-through, contact support or check our [API Integration Guide](api-integration-guide).
