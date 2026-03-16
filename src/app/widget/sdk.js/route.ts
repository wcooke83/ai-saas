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

  // Track custom events from outside
  var _customEventHandlers = [];

  window.ChatWidget = {
    init: function(config) {
      if (!config || !config.chatbotId) {
        console.error('ChatWidget: chatbotId is required');
        return;
      }
      if (document.getElementById('chatbot-widget-' + config.chatbotId)) return;

      var userData = config.user || null;
      var userContext = config.context || null;

      // Fetch config and build widget
      fetch(baseUrl + '/api/widget/' + config.chatbotId + '/config?_t=' + Date.now())
        .then(function(r) { return r.ok ? r.json() : null; })
        .then(function(data) {
          var wc = data ? data.data.widgetConfig : null;
          var pc = data ? data.data.proactiveMessagesConfig : null;
          build(config.chatbotId, wc, pc, userData, userContext);
        })
        .catch(function() { build(config.chatbotId, null, null, userData, userContext); });
    },
    track: function(eventName) {
      _customEventHandlers.forEach(function(h) { h(eventName); });
    }
  };

  function build(chatbotId, wc, proactiveConfig, userData, userContext) {
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

    // ========================================
    // Proactive Messaging - Bubble UI
    // ========================================
    var bubble = null;
    var bubbleClose = null;
    var activeBubbleRuleId = null;
    var widgetIsOpen = false;

    // Bubble style from config (with defaults)
    var bs = (proactiveConfig && proactiveConfig.bubbleStyle) || {};
    var isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var bsBg = isDark ? (bs.darkBgColor || '#0f172a') : (bs.bgColor || '#ffffff');
    var bsColor = isDark ? (bs.darkTextColor || '#f8fafc') : (bs.textColor || '#0f172a');
    var bsBorderColor = isDark ? (bs.darkBorderColor || '#334155') : (bs.borderColor || '#e2e8f0');
    var bsBorderWidth = (bs.borderWidth != null ? bs.borderWidth : 1);
    var bsBorder = bsBorderWidth > 0 ? (bsBorderWidth + 'px solid ' + bsBorderColor) : 'none';
    var bsRadius = (bs.borderRadius != null ? bs.borderRadius : 12) + 'px';
    var bsFontSize = (bs.fontSize || 14) + 'px';
    var bsMaxWidth = (bs.maxWidth || 280) + 'px';
    var shadowMap = { none: 'none', sm: '0 2px 8px rgba(0,0,0,0.1)', md: '0 4px 16px rgba(0,0,0,0.15)', lg: '0 8px 32px rgba(0,0,0,0.2)' };
    var bsShadow = shadowMap[bs.shadow] || shadowMap.md;

    function getBubbleStyles(position) {
      // Parse position (e.g., 'top-left' -> ['top', 'left'])
      var posParts = (position || 'bottom-right').split('-');
      var vPos = posParts[0] || 'bottom';
      var hPos = posParts[1] || 'right';
      
      var btnW = btnSize;
      var btnH = btnSize;
      var gap = 12; // gap between button and bubble
      
      // Base styles
      var styles = {
        position: 'fixed',
        zIndex: '10002',
        maxWidth: bsMaxWidth,
        background: bsBg,
        color: bsColor,
        border: bsBorder,
        padding: '12px 36px 12px 14px',
        borderRadius: bsRadius,
        boxShadow: bsShadow,
        fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif',
        fontSize: bsFontSize,
        lineHeight: '1.4',
        cursor: 'pointer',
        display: 'none',
        animation: 'cwBubbleIn .3s ease-out'
      };
      
      // Calculate position based on combination
      if (vPos === 'top') {
        styles.top = offY + 'px';
      } else if (vPos === 'bottom') {
        styles.bottom = offY + 'px';
      } else if (vPos === 'middle') {
        styles.top = '50%';
        styles.transform = 'translateY(-50%)';
      }
      
      if (hPos === 'left') {
        styles.left = (offX + btnW + gap) + 'px';
      } else if (hPos === 'right') {
        styles.right = (offX + btnW + gap) + 'px';
      } else if (hPos === 'middle') {
        styles.left = '50%';
        styles.transform = (styles.transform || '') + ' translateX(-50%)';
      }
      
      return styles;
    }

    function createBubble(position) {
      if (bubble) return;
      var styles = getBubbleStyles(position);
      var styleStr = Object.keys(styles).map(function(k) { return k + ':' + styles[k] + ';'; }).join('');
      
      bubble = document.createElement('div');
      bubble.style.cssText = styleStr;
      bubbleClose = document.createElement('button');
      bubbleClose.innerHTML = '&times;';
      bubbleClose.style.cssText = 'position:absolute;top:4px;right:8px;background:none;border:none;font-size:18px;color:#999;cursor:pointer;padding:2px 4px;line-height:1;';
      bubbleClose.onclick = function(e) { e.stopPropagation(); hideBubble(); };
      bubble.appendChild(bubbleClose);

      // Inject animation keyframes once
      if (!document.getElementById('cw-bubble-style')) {
        var st = document.createElement('style');
        st.id = 'cw-bubble-style';
        st.textContent = '@keyframes cwBubbleIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';
        document.head.appendChild(st);
      }
      document.body.appendChild(bubble);
    }

    function showBubble(message, ruleId, position) {
      if (widgetIsOpen) return;
      createBubble(position);
      // Set text (insert before close button)
      var txt = bubble.querySelector('.cw-bubble-text');
      if (!txt) {
        txt = document.createElement('span');
        txt.className = 'cw-bubble-text';
        bubble.insertBefore(txt, bubbleClose);
      }
      txt.textContent = message;
      activeBubbleRuleId = ruleId;
      bubble.style.display = 'block';
      bubble.onclick = function() {
        hideBubble();
        openWithProactive(ruleId, message);
      };
    }

    function hideBubble() {
      if (bubble) { bubble.style.display = 'none'; activeBubbleRuleId = null; }
    }

    // ========================================
    // Open / Close
    // ========================================
    function open() {
      widgetIsOpen = true;
      hideBubble();
      fr.style.display = 'block'; fr.style.visibility = 'visible'; fr.style.pointerEvents = 'auto';
      dh.style.display = 'block'; btn.style.display = 'none';
      setTimeout(function() { fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-id', widgetId: wid }, '*'); }, 100);
    }
    function close() {
      widgetIsOpen = false;
      fr.style.display = 'none'; fr.style.visibility = 'hidden'; fr.style.pointerEvents = 'none';
      dh.style.display = 'none'; btn.style.display = 'flex';
    }

    function openWithProactive(ruleId, message) {
      open();
      // Tell iframe to show this proactive message
      setTimeout(function() {
        fr.contentWindow && fr.contentWindow.postMessage({
          type: 'proactive-trigger',
          ruleId: ruleId,
          message: message,
          displayMode: 'open_widget'
        }, '*');
      }, 200);
    }

    btn.onclick = open;
    fr.onload = function() {
      fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-id', widgetId: wid }, '*');
      if (userData || userContext) {
        fr.contentWindow && fr.contentWindow.postMessage({ type: 'user-context', user: userData, context: userContext }, '*');
      }
    };

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
      if (e.source === fr.contentWindow && e.data && e.data.type === 'widget-ready') {
        if (userData || userContext) {
          fr.contentWindow && fr.contentWindow.postMessage({ type: 'user-context', user: userData, context: userContext }, '*');
        }
      }
    });

    // Assemble
    ct.appendChild(fr); ct.appendChild(dh); ct.appendChild(btn);
    document.body.appendChild(ct);

    // ========================================
    // Proactive Messaging - Behavior Tracker
    // ========================================
    if (proactiveConfig && proactiveConfig.enabled && proactiveConfig.rules && proactiveConfig.rules.length > 0) {
      startProactiveTracking(proactiveConfig.rules, fr, function(rule) {
        if (rule.displayMode === 'bubble') {
          showBubble(rule.message, rule.id, rule.bubblePosition);
        } else {
          // open_widget mode
          if (widgetIsOpen) {
            // Widget already open, just send message to iframe
            fr.contentWindow && fr.contentWindow.postMessage({
              type: 'proactive-trigger',
              ruleId: rule.id,
              message: rule.message,
              displayMode: 'open_widget'
            }, '*');
          } else {
            openWithProactive(rule.id, rule.message);
          }
        }
      });
    }
  }

  // ========================================
  // Proactive Messaging - Tracking Engine
  // ========================================
  function startProactiveTracking(rules, iframe, onTrigger) {
    var firedCounts = {};  // ruleId -> count fired this session
    var timers = [];
    var pageStartTime = Date.now();
    var siteStartKey = 'cw_site_start';
    var pageViewKey = 'cw_page_views';

    // Site start time (persists across page navigations in sessionStorage)
    if (!sessionStorage.getItem(siteStartKey)) {
      sessionStorage.setItem(siteStartKey, String(Date.now()));
    }
    var siteStartTime = parseInt(sessionStorage.getItem(siteStartKey), 10);

    // Page view counter
    var pvCount = parseInt(sessionStorage.getItem(pageViewKey) || '0', 10) + 1;
    sessionStorage.setItem(pageViewKey, String(pvCount));

    // Idle tracking
    var lastActivity = Date.now();
    function resetIdle() { lastActivity = Date.now(); }
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('scroll', resetIdle);
    document.addEventListener('click', resetIdle);

    // Sort rules by priority (lower = higher priority)
    var sorted = rules.filter(function(r) { return r.enabled; }).sort(function(a, b) { return (a.priority || 0) - (b.priority || 0); });

    function canFire(rule) {
      var count = firedCounts[rule.id] || 0;
      if (rule.maxShowCount > 0 && count >= rule.maxShowCount) return false;
      return true;
    }

    function fireRule(rule) {
      if (!canFire(rule)) return;
      firedCounts[rule.id] = (firedCounts[rule.id] || 0) + 1;
      var delay = rule.delay || 0;
      if (delay > 0) {
        var t = setTimeout(function() { onTrigger(rule); }, delay);
        timers.push(t);
      } else {
        onTrigger(rule);
      }
    }

    // URL match helper
    function matchUrl(pattern, matchType) {
      var url = window.location.href;
      var path = window.location.pathname;
      if (matchType === 'exact') return url === pattern || path === pattern;
      if (matchType === 'regex') {
        try { return new RegExp(pattern).test(url); } catch(e) { return false; }
      }
      // default: contains
      return url.indexOf(pattern) !== -1 || path.indexOf(pattern) !== -1;
    }

    // Process each rule
    sorted.forEach(function(rule) {
      var cfg = rule.triggerConfig || {};

      switch (rule.triggerType) {
        case 'page_url':
          if (matchUrl(cfg.urlPattern || '', cfg.matchType || 'contains')) {
            fireRule(rule);
          }
          break;

        case 'time_on_page':
          var topMs = (cfg.seconds || 5) * 1000;
          var t1 = setTimeout(function() { fireRule(rule); }, topMs);
          timers.push(t1);
          break;

        case 'time_on_site':
          var elapsed = Date.now() - siteStartTime;
          var tosMs = (cfg.seconds || 30) * 1000;
          var remaining = tosMs - elapsed;
          if (remaining <= 0) {
            fireRule(rule);
          } else {
            var t2 = setTimeout(function() { fireRule(rule); }, remaining);
            timers.push(t2);
          }
          break;

        case 'scroll_depth':
          var targetPct = cfg.percent || 50;
          var scrollFired = false;
          var scrollHandler = function() {
            if (scrollFired) return;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            if (docHeight <= 0) return;
            var pct = (scrollTop / docHeight) * 100;
            if (pct >= targetPct) {
              scrollFired = true;
              fireRule(rule);
              window.removeEventListener('scroll', scrollHandler);
            }
          };
          window.addEventListener('scroll', scrollHandler);
          break;

        case 'exit_intent':
          var exitFired = false;
          var exitHandler = function(e) {
            if (exitFired) return;
            if (e.clientY <= 0) {
              exitFired = true;
              fireRule(rule);
              document.removeEventListener('mouseleave', exitHandler);
            }
          };
          document.addEventListener('mouseleave', exitHandler);
          break;

        case 'page_view_count':
          var targetViews = cfg.count || 3;
          if (pvCount >= targetViews) {
            fireRule(rule);
          }
          break;

        case 'idle_timeout':
          var idleSec = (cfg.seconds || 30) * 1000;
          var idleCheck = setInterval(function() {
            if (Date.now() - lastActivity >= idleSec) {
              if (canFire(rule)) {
                fireRule(rule);
              }
            }
          }, 1000);
          timers.push(idleCheck);
          break;

        case 'custom_event':
          var evtName = cfg.eventName || '';
          if (evtName) {
            _customEventHandlers.push(function(name) {
              if (name === evtName) fireRule(rule);
            });
          }
          break;
      }
    });
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
