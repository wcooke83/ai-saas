# Chatbot Widget Tests

## Overview
Comprehensive Playwright test suite for the chatbot widget functionality, including recursion prevention tests.

## Test Files

### `chatbot-widget.spec.ts`
Main test suite covering:
- Widget SDK loading
- Chat button visibility and positioning
- Widget opening/closing functionality
- Iframe dimensions and attributes
- Hover effects and styling
- Single instance verification
- Multi-page navigation
- Public and authenticated page loading

### `chatbot-widget-recursion.spec.ts`
Recursion prevention tests covering:
- Widget not appearing inside widget iframe
- SDK initialization prevention in iframe context
- Iframe detection logic
- Path-based widget exclusion (`/widget/*`)
- Rapid navigation handling
- Widget cleanup on navigation
- Multiple init call prevention
- SDK content verification

## Running the Tests

### Run all widget tests
```bash
npx playwright test chatbot-widget
```

### Run specific test file
```bash
npx playwright test tests/chatbot-widget.spec.ts
```

### Run recursion tests only
```bash
npx playwright test tests/chatbot-widget-recursion.spec.ts
```

### Run with UI mode
```bash
npx playwright test chatbot-widget --ui
```

### Run in headed mode (see browser)
```bash
npx playwright test chatbot-widget --headed
```

### Debug a specific test
```bash
npx playwright test chatbot-widget --debug
```

## Test Coverage

### Functionality Tests
- ✅ Widget button appears on pages
- ✅ Widget opens when button clicked
- ✅ Iframe loads correct chatbot
- ✅ Proper positioning (bottom-right)
- ✅ Correct dimensions (400x600px)
- ✅ Hover effects work
- ✅ Only one instance created
- ✅ Works on public and authenticated pages

### Recursion Prevention Tests
- ✅ No widget inside widget iframe
- ✅ SDK doesn't initialize in iframes
- ✅ Path exclusion works (`/widget/*`)
- ✅ Multiple init calls prevented
- ✅ Separate layout for widget pages
- ✅ No parent layout inheritance in iframe
- ✅ Proper cleanup on navigation

## Key Implementation Details

### Recursion Prevention Strategy
1. **SDK-level check**: `window.self !== window.top` prevents initialization in iframes
2. **Path-based exclusion**: Widget doesn't load on `/widget/*` paths
3. **Separate layout**: Widget pages use dedicated layout without ChatbotWidget component
4. **Single instance check**: SDK checks for existing widget before creating new one

### Widget Architecture
- **SDK Route**: `/widget/sdk.js` serves the JavaScript SDK
- **Widget Component**: `ChatbotWidget` component loads SDK and initializes
- **Widget Pages**: `/widget/[chatbotId]` displays chatbot in iframe
- **Root Layout**: Includes ChatbotWidget except on widget paths

## Expected Behavior

### On Regular Pages (/, /dashboard, etc.)
- Chat button appears in bottom-right corner
- Clicking opens iframe with chatbot
- Button hides when chat is open
- Widget persists across navigation

### On Widget Pages (/widget/*)
- No chat button appears
- No SDK script loaded
- Clean chatbot interface only
- No recursion or nested widgets

## Troubleshooting

### Widget not appearing
1. Check browser console for errors
2. Verify SDK script loads: `document.querySelector('script[src="/widget/sdk.js"]')`
3. Check ChatWidget initialized: `window.ChatWidget`
4. Ensure not on `/widget/*` path

### Recursion issues
1. Verify SDK contains iframe check: `window.self !== window.top`
2. Check widget layout uses separate html/body
3. Confirm ChatbotWidget component checks pathname
4. Ensure only one widget container exists

### Tests failing
1. Ensure dev server running on port 3030
2. Check chatbot ID exists: `10df2440-6aac-441a-855d-715c0ea8e506`
3. Clear browser cache and restart server
4. Run tests with `--headed` to see what's happening

## Future Enhancements
- Close button inside iframe
- Minimize/maximize animations
- Mobile responsive behavior
- Custom positioning options
- Theme customization
- Multiple chatbot support
