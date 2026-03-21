import { NextResponse } from 'next/server';

export async function GET() {
  const sdkCode = `
(function() {
  'use strict';

  // Detect base URL from script src
  var scripts = document.querySelectorAll('script[src*="agent-console/sdk.js"]');
  var scriptEl = scripts[scripts.length - 1];
  var sdkSrc = scriptEl ? scriptEl.getAttribute('src') : '';
  var baseUrl = sdkSrc && sdkSrc.indexOf('http') === 0
    ? sdkSrc.replace(/\\/agent-console\\/sdk\\.js.*$/, '')
    : window.location.origin;

  window.AgentConsole = {
    init: function(config) {
      if (!config || !config.chatbotId) {
        console.error('AgentConsole: chatbotId is required');
        return;
      }
      if (!config.apiKey) {
        console.error('AgentConsole: apiKey is required');
        return;
      }
      if (document.getElementById('agent-console-' + config.chatbotId)) return;

      var position = config.position || 'full'; // 'full' or 'sidebar'

      // Create container
      var container = document.createElement('div');
      container.id = 'agent-console-' + config.chatbotId;

      if (position === 'sidebar') {
        container.style.cssText = 'position:fixed;top:0;right:0;width:420px;height:100vh;z-index:9999;box-shadow:-4px 0 20px rgba(0,0,0,0.1);';
      } else {
        // Full mode — fills parent or viewport
        container.style.cssText = 'width:100%;height:100%;min-height:500px;';
        if (config.container) {
          var parent = typeof config.container === 'string'
            ? document.querySelector(config.container)
            : config.container;
          if (parent) {
            parent.appendChild(container);
          } else {
            document.body.appendChild(container);
          }
        }
      }

      // Create iframe
      var iframe = document.createElement('iframe');
      iframe.src = baseUrl + '/agent-console/' + config.chatbotId + '#key=' + encodeURIComponent(config.apiKey);
      iframe.style.cssText = 'border:none;width:100%;height:100%;';
      iframe.allow = 'clipboard-write';

      container.appendChild(iframe);

      if (position === 'sidebar' || !config.container) {
        document.body.appendChild(container);
      }

      // Send API key via postMessage once iframe loads
      iframe.onload = function() {
        iframe.contentWindow.postMessage({
          type: 'agent-console-auth',
          apiKey: config.apiKey
        }, '*');
      };

      // Listen for ready signal and re-send auth
      window.addEventListener('message', function(e) {
        if (e.source === iframe.contentWindow && e.data && e.data.type === 'agent-console-ready') {
          iframe.contentWindow.postMessage({
            type: 'agent-console-auth',
            apiKey: config.apiKey
          }, '*');
        }
      });

      return {
        destroy: function() {
          container.remove();
        }
      };
    }
  };

  // Auto-init from data attributes
  if (scriptEl) {
    var chatbotId = scriptEl.getAttribute('data-chatbot-id');
    var apiKey = scriptEl.getAttribute('data-api-key');
    if (chatbotId && apiKey) {
      var ready = function() {
        window.AgentConsole.init({
          chatbotId: chatbotId,
          apiKey: apiKey,
          position: scriptEl.getAttribute('data-position') || 'full',
          container: scriptEl.getAttribute('data-container') || null
        });
      };
      if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
      else ready();
    }
  }
})();
`;

  return new NextResponse(sdkCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
