# Chatbot Widget Deploy Page Tests

## Overview
Playwright test suite specifically for testing the chatbot widget functionality on the deploy page.

## Test File
`chatbot-widget-deploy-page.spec.ts` - 28 tests covering widget behavior on the deploy page

## Running the Tests

### Run deploy page tests
```bash
npx playwright test chatbot-widget-deploy-page
```

### Run with headed browser
```bash
npx playwright test chatbot-widget-deploy-page --headed
```

### Run specific test
```bash
npx playwright test chatbot-widget-deploy-page -g "should display chat widget button"
```

### Debug mode
```bash
npx playwright test chatbot-widget-deploy-page --debug
```

## Test Coverage

### Widget Functionality (8 tests)
- ✅ Widget button displays on deploy page
- ✅ Widget opens when button clicked
- ✅ Correct positioning (fixed, bottom-right)
- ✅ Widget doesn't interfere with page content
- ✅ Only one widget instance exists
- ✅ Widget persists during scrolling
- ✅ Widget button has gradient background
- ✅ Widget button is circular with chat icon

### Recursion Prevention (3 tests)
- ✅ No widget inside preview iframe
- ✅ No widget inside opened chat iframe
- ✅ Preview and widget iframes are separate

### Deploy Page Content (11 tests)
- ✅ Page title displays correctly
- ✅ Preview iframe shows chatbot
- ✅ SDK code examples visible
- ✅ Copy buttons functional
- ✅ JavaScript SDK section with "Recommended" badge
- ✅ Next.js integration example
- ✅ iFrame embed option
- ✅ REST API section with endpoint
- ✅ Back to chatbot link
- ✅ SDK documentation link
- ✅ Code blocks display properly

### Widget Integration (6 tests)
- ✅ Widget z-index above page content
- ✅ Widget doesn't block copy buttons
- ✅ Widget visible during page scroll
- ✅ Widget iframe has correct chatbot ID
- ✅ Widget button hover effects
- ✅ Widget dimensions correct (60x60px button, 400x600px iframe)

## Test URL
```
http://localhost:3030/dashboard/chatbots/10df2440-6aac-441a-855d-715c0ea8e506/deploy
```

## Key Assertions

### Widget Button
- Position: `fixed`
- Bottom: `20px`
- Right: `20px`
- Z-index: `≥10000`
- Size: `60px × 60px`
- Border radius: `50%` (circular)
- Background: gradient

### Widget Iframe
- Size: `400px × 600px`
- Border radius: `12px`
- Source: `/widget/10df2440-6aac-441a-855d-715c0ea8e506`
- Allow: `clipboard-write`

### Page Content
- Deploy page title contains "Deploy"
- Multiple code blocks with SDK examples
- Preview iframe shows chatbot
- Copy buttons functional
- Navigation links present

## Expected Behavior

### On Deploy Page Load
1. Page displays deploy instructions and code examples
2. Preview iframe shows chatbot in embedded view
3. Widget button appears in bottom-right corner
4. Widget button doesn't interfere with page content

### When Widget Button Clicked
1. Button hides
2. Iframe opens with chatbot
3. Iframe loads correct chatbot ID
4. No nested widgets inside iframe

### During Page Interaction
1. Widget remains visible during scroll
2. Widget doesn't block copy buttons
3. Widget stays on top of page content
4. Only one widget instance exists

## Troubleshooting

### Tests failing on deploy page
1. Ensure chatbot exists with ID: `10df2440-6aac-441a-855d-715c0ea8e506`
2. Verify user is authenticated (deploy page requires auth)
3. Check dev server running on port 3030
4. Ensure widget SDK route exists: `/widget/sdk.js`

### Widget not appearing
1. Check browser console for errors
2. Verify pathname check in ChatbotWidget component
3. Ensure SDK script loads successfully
4. Check ChatWidget.init() called with correct ID

### Recursion issues
1. Verify preview iframe doesn't contain widget button
2. Check opened widget iframe doesn't contain nested widget
3. Ensure SDK has iframe detection: `window.self !== window.top`
4. Confirm pathname exclusion for `/widget/*` paths

## Notes

- Deploy page requires authentication
- Tests use 1500ms timeout for widget initialization
- Preview iframe and widget iframe both load same chatbot but are separate instances
- Widget should not interfere with page functionality (copy buttons, navigation, etc.)
