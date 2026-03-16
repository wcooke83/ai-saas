---
title: Chatbot Memory & Identity Verification
description: Learn how conversation memory works and how to verify returning users with email OTP verification
category: chatbot-features
order: 2
---

# Chatbot Memory & Identity Verification

Enable your chatbot to remember conversations across sessions and verify returning users through email-based identity verification.

## Overview

The chatbot includes two powerful features for personalized experiences:

1. **Conversation Memory** — Remembers key facts about users across sessions
2. **Email Verification** — Verifies returning users via one-time PIN when they use the pre-chat form

## Conversation Memory

### How It Works

When memory is enabled, the chatbot:
- Extracts key facts from conversations (name, preferences, past issues, etc.)
- Stores them securely per visitor
- Recalls them in future conversations
- Automatically cleans up expired memories based on retention settings

### Enabling Memory

1. Go to **Dashboard → Chatbots → [Your Chatbot] → Settings**
2. Click the **Memory** tab
3. Toggle **Enable Conversation Memory**
4. Set **Memory Retention Period**:
   - 7 days
   - 30 days
   - 90 days
   - 1 year
   - Unlimited

### What Gets Remembered

The AI automatically extracts and stores:
- **User preferences** — "I prefer email over phone"
- **Past issues** — "Had login problems last week"
- **Account details** — "Premium plan member since January"
- **Personal info** — "Name is Sarah, works in marketing"
- **Conversation context** — "Discussed refund policy"

### Example: Returning Visitor

**First Visit:**
```
User: Hi, I'm Sarah and I need help with my order
Bot: Hi Sarah! I'd be happy to help with your order...
```

**Second Visit (3 days later):**
```
User: Hi again
Bot: Welcome back, Sarah! How can I help you today?
User: I have another question about orders
Bot: Of course! Last time we discussed your order. What would you like to know?
```

### Privacy & Data Retention

- Memories are stored per chatbot and visitor ID
- Data is automatically deleted after the retention period
- Users can request memory deletion by contacting support
- All data follows your privacy policy

## Email Verification (OTP)

### How It Works

When a returning user fills out the pre-chat form with an email that has existing conversation history:

1. System detects the email has prior conversations
2. Asks: "We found previous conversations. Would you like to recall your chat history?"
3. If yes, sends a 6-digit OTP to their email
4. User enters the code to verify ownership
5. Previous conversation memory is loaded

### Why Email Verification?

**Security:** Prevents unauthorized access to conversation history if someone guesses or enters another person's email.

**Privacy:** Ensures only the actual email owner can access their chat history.

### User Flow

#### Step 1: Pre-Chat Form Detection
```
User fills out form:
- Name: Sarah Johnson
- Email: sarah@example.com

System checks: "This email has 3 previous conversations"
```

#### Step 2: Verification Prompt
```
┌─────────────────────────────────────┐
│ Welcome back!                        │
│                                      │
│ We found previous conversations      │
│ with this email. Would you like to   │
│ recall your chat history?            │
│                                      │
│ [Yes, Send Code]  [No, Start Fresh] │
└─────────────────────────────────────┘
```

#### Step 3: OTP Email Sent
```
To: sarah@example.com
Subject: Your Verification Code

Your verification code is: 847392

This code expires in 10 minutes.
```

#### Step 4: Code Entry
```
┌─────────────────────────────────────┐
│ Enter Verification Code              │
│                                      │
│ We sent a 6-digit code to            │
│ sarah@example.com                    │
│                                      │
│ [_] [_] [_] [_] [_] [_]             │
│                                      │
│ [Verify]                             │
│                                      │
│ Didn't receive it? [Resend Code]    │
└─────────────────────────────────────┘
```

#### Step 5: Verified & Memory Loaded
```
✓ Verified! Loading your conversation history...

Bot: Welcome back, Sarah! I see we last spoke about your 
     shipping issue. How did that work out?
```

### Rate Limiting

To prevent abuse:
- **Maximum 3 OTP requests** per email per 15 minutes
- **10-minute expiration** on each code
- Codes are single-use only

### Skipping Verification

Users can choose **"No, Start Fresh"** to:
- Skip verification
- Start a new conversation
- Not load previous memory
- Still have their new conversation remembered (if memory is enabled)

## Combining Memory with User Data Pass-Through

For authenticated users on your website, you can skip the pre-chat form entirely:

```html
<script>
  ChatWidget.init({
    chatbotId: 'your-chatbot-id',
    user: {
      id: 'user_123',        // Stable ID for memory
      name: 'Sarah Johnson',
      email: 'sarah@example.com'
    }
  });
</script>
```

**Benefits:**
- No pre-chat form needed
- Automatic memory recall (no OTP needed)
- Seamless experience for logged-in users
- Memory follows them across devices

## Technical Details

### Database Tables

**conversation_memory**
- Stores key facts extracted from conversations
- Indexed by `chatbot_id` and `visitor_id`
- Includes `last_accessed` for retention cleanup

**conversation_memory_emails**
- Maps emails to visitor IDs
- Enables OTP verification flow
- Unique constraint on `chatbot_id + email`

**memory_verification_codes**
- Stores OTP codes with expiration
- Tracks usage to prevent reuse
- Auto-cleanup of expired codes

### Memory Extraction

The system uses AI to extract key facts after each conversation:

```
Input: Full conversation transcript
Output: {
  "key_facts": [
    "User's name is Sarah Johnson",
    "Premium plan member",
    "Prefers email communication",
    "Had shipping issue with order #12345"
  ],
  "summary": "Sarah is a premium member who recently had a shipping issue..."
}
```

### Memory Recall

When a returning visitor starts a chat:

```
System prompt injection:
## Returning Visitor Context
- User's name is Sarah Johnson
- Premium plan member since January 2026
- Prefers email communication over phone
- Previously discussed shipping issue with order #12345
- Issue was resolved with expedited shipping

Use this context naturally in your responses.
```

## Best Practices

### For Memory

✅ **Enable for support chatbots** — Reduces repeated questions
✅ **Set appropriate retention** — Balance UX with privacy
✅ **Inform users** — Mention memory in your privacy policy
✅ **Test with real scenarios** — Verify memory accuracy

❌ **Don't store sensitive data** — Avoid PII in knowledge base
❌ **Don't rely on memory alone** — Always allow users to provide context
❌ **Don't keep indefinitely** — Set reasonable retention periods

### For Email Verification

✅ **Use for anonymous visitors** — When you don't have authenticated user data
✅ **Make it optional** — Allow "Start Fresh" option
✅ **Clear messaging** — Explain why verification is needed
✅ **Fast delivery** — Ensure email arrives within seconds

❌ **Don't require for authenticated users** — Use user data pass-through instead
❌ **Don't make it mandatory** — Some users prefer fresh starts
❌ **Don't spam** — Respect rate limits

## Troubleshooting

### Memory Not Working

**Check:**
1. Memory is enabled in chatbot settings
2. Visitor ID is consistent across sessions
3. Retention period hasn't expired
4. Conversation had extractable facts

### OTP Not Received

**Common causes:**
1. Email in spam folder
2. Rate limit reached (3 per 15 min)
3. Email service delay
4. Incorrect email address

**Solutions:**
- Check spam/junk folder
- Wait 15 minutes if rate limited
- Verify email address is correct
- Use "Resend Code" button

### Memory Recalls Wrong Information

**Causes:**
1. AI extraction error
2. User provided conflicting info
3. Multiple users sharing same visitor ID

**Solutions:**
- Review conversation transcripts
- Ensure unique visitor IDs per user
- Consider shorter retention periods
- User can start fresh conversation

## API Reference

### Check for Existing Memory

```javascript
POST /api/widget/{chatbotId}/memory/check
{
  "email": "sarah@example.com"
}

Response:
{
  "has_memory": true,
  "conversation_count": 3
}
```

### Send OTP

```javascript
POST /api/widget/{chatbotId}/memory/send-otp
{
  "email": "sarah@example.com"
}

Response:
{
  "success": true,
  "message": "Verification code sent"
}
```

### Verify OTP

```javascript
POST /api/widget/{chatbotId}/memory/verify-otp
{
  "email": "sarah@example.com",
  "code": "847392"
}

Response:
{
  "success": true,
  "visitor_id": "vis_abc123"
}
```

## Next Steps

- [Passing User Data to Chatbot](passing-user-data-to-chatbot) — Skip pre-chat forms for authenticated users
- [Customizing Widget Appearance](customizing-widget-appearance) — Match your brand
- [API Integration Guide](api-integration-guide) — Use the chat API programmatically

## Need Help?

Contact support if you need assistance with memory configuration or email verification setup.
