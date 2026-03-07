import { NextResponse } from 'next/server';

export async function GET() {
  const sdkCode = `
(function() {
  'use strict';
  
  window.ChatWidget = {
    init: async function(config) {
      console.log('[SDK] Init called with config:', config);
      
      // Prevent initialization inside iframes to avoid recursion
      if (window.self !== window.top) {
        console.log('[SDK] Inside iframe, not initializing');
        return;
      }

      if (!config || !config.chatbotId) {
        console.error('ChatWidget: chatbotId is required');
        return;
      }

      // Check if widget already exists
      if (document.getElementById('chatbot-widget-container')) {
        console.log('[SDK] Widget already exists, not re-initializing');
        return;
      }
      
      console.log('[SDK] Starting widget initialization');

      // Fetch widget configuration
      let widgetConfig = null;
      try {
        const response = await fetch(window.location.origin + '/api/widget/' + config.chatbotId + '/config');
        if (response.ok) {
          const data = await response.json();
          widgetConfig = data.data.widgetConfig;
        }
      } catch (err) {
        console.warn('Failed to fetch widget config, using defaults');
      }

      // Extract position settings
      const position = widgetConfig?.position || 'bottom-right';
      const [vertical, horizontal] = position.split('-');
      const offsetX = widgetConfig?.offsetX || 20;
      const offsetY = widgetConfig?.offsetY || 20;
      const buttonSize = widgetConfig?.buttonSize || 60;
      const primaryColor = widgetConfig?.primaryColor || '#667eea';
      const width = widgetConfig?.width || 400;
      const height = widgetConfig?.height || 600;

      // Create container
      const container = document.createElement('div');
      container.id = 'chatbot-widget-container';
      container.style.cssText = \`position: fixed; \${vertical}: \${offsetY}px; \${horizontal}: \${offsetX}px; z-index: 9999;\`;
      
      // Create iframe and preload it immediately for instant display
      const iframe = document.createElement('iframe');
      const baseUrl = window.location.origin;
      iframe.src = baseUrl + '/widget/' + config.chatbotId;
      iframe.style.cssText = \`border: none; width: \${width}px; height: \${height}px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);\`;
      iframe.allow = 'clipboard-write';
      
      // Initially hide the iframe but keep it in DOM for preloading
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      iframe.style.pointerEvents = 'none';
      
      // Create chat button
      const button = document.createElement('button');
      button.id = 'chatbot-widget-button';
      button.innerHTML = \`
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      \`;
      button.style.cssText = \`
        position: fixed;
        \${vertical}: \${offsetY}px;
        \${horizontal}: \${offsetX}px;
        width: \${buttonSize}px;
        height: \${buttonSize}px;
        border-radius: 50%;
        background: \${primaryColor};
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        transition: transform 0.2s, box-shadow 0.2s;
        z-index: 10000;
      \`;
      
      // Button hover effect
      button.onmouseenter = function() {
        button.style.transform = 'scale(1.05)';
        button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
      };
      button.onmouseleave = function() {
        button.style.transform = 'scale(1)';
        button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      };
      
      // Open chat when button clicked
      let isOpen = false;
      const widgetId = 'widget-' + config.chatbotId + '-' + Date.now();
      
      button.onclick = function() {
        isOpen = true;
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.pointerEvents = 'auto';
        button.style.display = 'none';
        
        // Send widget ID to iframe when opened
        setTimeout(function() {
          console.log('[SDK] Sending widget ID to iframe:', widgetId);
          iframe.contentWindow.postMessage({ type: 'widget-id', widgetId: widgetId }, '*');
        }, 100);
      };
      
      // Listen for close message from iframe
      console.log('[SDK] Registering message listener on window');
      window.addEventListener('message', function(event) {
        console.log('[SDK] Received ANY message:', event.data, 'from:', event.origin);
        console.log('[SDK] event.source:', event.source);
        console.log('[SDK] iframe.contentWindow:', iframe.contentWindow);
        console.log('[SDK] Source matches:', event.source === iframe.contentWindow);
        
        // Only respond to close messages from our own iframe (source validation is sufficient)
        if (event.data && event.data.type === 'close-chat-widget' && event.source === iframe.contentWindow) {
          console.log('[SDK] Closing widget - message from our iframe');
          isOpen = false;
          iframe.style.display = 'none';
          iframe.style.visibility = 'hidden';
          iframe.style.pointerEvents = 'none';
          button.style.display = 'flex';
        } else if (event.data && event.data.type === 'close-chat-widget') {
          console.log('[SDK] Close message received but source does not match our iframe');
        }
      });
      
      // Also send widget ID when iframe initially loads (for preloading)
      iframe.onload = function() {
        console.log('[SDK] iframe loaded, sending widget ID:', widgetId);
        iframe.contentWindow.postMessage({ type: 'widget-id', widgetId: widgetId }, '*');
      };
      
      // Add iframe to container immediately to start preloading
      container.appendChild(iframe);
      container.appendChild(button);
      document.body.appendChild(container);
      
      console.log('ChatWidget initialized for chatbot:', config.chatbotId);
    }
  };
})();
`;

  return new NextResponse(sdkCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  });
}
