import { NextResponse } from 'next/server';

export async function GET() {
  const sdkCode = `
(function() {
  'use strict';

  if (window.self !== window.top) return;

  // Detect base URL from script src (supports cross-origin embedding)
  var scripts = document.querySelectorAll('script[src*="widget/sdk.js"]');
  var scriptEl = scripts[scripts.length - 1];
  var sdkSrc = scriptEl ? scriptEl.getAttribute('src') : '';
  var baseUrl = sdkSrc && sdkSrc.indexOf('http') === 0
    ? sdkSrc.replace(/\\/widget\\/sdk\\.js.*$/, '')
    : window.location.origin;

  window.ChatWidget = {
    init: function(config) {
      if (!config || !config.chatbotId) {
        console.error('ChatWidget: chatbotId is required');
        return;
      }
      if (document.getElementById('chatbot-widget-' + config.chatbotId)) return;

      // Fetch config and build widget
      fetch(baseUrl + '/api/widget/' + config.chatbotId + '/config')
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) { build(config.chatbotId, data ? data.data.widgetConfig : null); })
        .catch(function() { build(config.chatbotId, null); });
    }
  };

  function build(chatbotId, wc) {
    var pos = (wc && wc.position) || 'bottom-right';
    var parts = pos.split('-');
    var vert = parts[0], horiz = parts[1];
    var offX = (wc && wc.offsetX) || 20;
    var offY = (wc && wc.offsetY) || 20;
    var btnSize = (wc && wc.buttonSize) || 60;
    var color = (wc && wc.primaryColor) || '#667eea';
    var w = (wc && wc.width) || 400;
    var h = (wc && wc.height) || 600;

    // Container
    var ct = document.createElement('div');
    ct.id = 'chatbot-widget-' + chatbotId;
    ct.style.cssText = 'position:fixed;' + vert + ':' + offY + 'px;' + horiz + ':' + offX + 'px;z-index:9999;';

    // Iframe
    var fr = document.createElement('iframe');
    fr.src = baseUrl + '/widget/' + chatbotId;
    fr.style.cssText = 'border:none;width:' + w + 'px;height:' + h + 'px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:none;visibility:hidden;pointer-events:none;';
    fr.allow = 'clipboard-write';

    // Button
    var btn = document.createElement('button');
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    btn.style.cssText = 'position:fixed;' + vert + ':' + offY + 'px;' + horiz + ':' + offX + 'px;width:' + btnSize + 'px;height:' + btnSize + 'px;border-radius:50%;background:' + color + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;color:#fff;transition:transform .2s,box-shadow .2s;z-index:10000;';
    btn.onmouseenter = function() { btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; };

    // Drag handle (transparent overlay on header area)
    var dh = document.createElement('div');
    dh.style.cssText = 'position:absolute;top:0;left:0;right:40px;height:50px;cursor:grab;z-index:10001;display:none;border-radius:12px 0 0 0;';

    // Widget ID for iframe communication
    var wid = 'w-' + chatbotId + '-' + Date.now();

    // Open / close
    function open() {
      fr.style.display = 'block'; fr.style.visibility = 'visible'; fr.style.pointerEvents = 'auto';
      dh.style.display = 'block'; btn.style.display = 'none';
      setTimeout(function() { fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-id', widgetId: wid }, '*'); }, 100);
    }
    function close() {
      fr.style.display = 'none'; fr.style.visibility = 'hidden'; fr.style.pointerEvents = 'none';
      dh.style.display = 'none'; btn.style.display = 'flex';
    }

    btn.onclick = open;
    fr.onload = function() { fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-id', widgetId: wid }, '*'); };

    // Drag system
    var dx = 0, dy = 0, dragging = false, ov = null;
    function mkOverlay() {
      ov = document.createElement('div');
      ov.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;cursor:grabbing;';
      document.body.appendChild(ov);
      ov.addEventListener('mousemove', onMove);
      ov.addEventListener('mouseup', onUp);
    }
    function rmOverlay() {
      if (ov) { ov.removeEventListener('mousemove', onMove); ov.removeEventListener('mouseup', onUp); ov.remove(); ov = null; }
    }
    function onMove(e) {
      if (!dragging) return;
      e.preventDefault();
      var nx = Math.max(0, Math.min(e.clientX - dx, window.innerWidth - ct.offsetWidth));
      var ny = Math.max(0, Math.min(e.clientY - dy, window.innerHeight - ct.offsetHeight));
      ct.style.left = nx + 'px'; ct.style.top = ny + 'px'; ct.style.right = 'auto'; ct.style.bottom = 'auto';
    }
    function onUp() {
      if (!dragging) return;
      dragging = false; fr.style.pointerEvents = 'auto'; dh.style.cursor = 'grab'; rmOverlay();
    }
    dh.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var r = ct.getBoundingClientRect();
      dx = e.clientX - r.left; dy = e.clientY - r.top;
      dragging = true; fr.style.pointerEvents = 'none'; dh.style.cursor = 'grabbing'; mkOverlay();
    });

    // Listen for close from iframe
    window.addEventListener('message', function(e) {
      if (e.source === fr.contentWindow && e.data && e.data.type === 'close-chat-widget') close();
    });

    // Assemble
    ct.appendChild(fr); ct.appendChild(dh); ct.appendChild(btn);
    document.body.appendChild(ct);
  }

  // Auto-init from data attribute: <script src="...sdk.js" data-chatbot-id="xxx">
  if (scriptEl && scriptEl.getAttribute('data-chatbot-id')) {
    var ready = function() { window.ChatWidget.init({ chatbotId: scriptEl.getAttribute('data-chatbot-id') }); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
    else ready();
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
