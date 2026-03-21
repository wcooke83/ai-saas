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
    ct.style.cssText = 'position:fixed;' + vert + ':' + offY + 'px;' + horiz + ':' + offX + 'px;z-index:9999;transition:top .3s ease,left .3s ease,right .3s ease,bottom .3s ease;';

    // Iframe
    var fr = document.createElement('iframe');
    fr.src = baseUrl + '/widget/' + chatbotId;
    fr.style.cssText = 'border:none;width:' + w + 'px;height:' + h + 'px;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15);display:none;visibility:hidden;pointer-events:none;transition:width .3s ease,height .3s ease,border-radius .3s ease;';
    fr.allow = 'clipboard-write';

    // Button
    var btn = document.createElement('button');
    btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>';
    btn.style.cssText = 'position:fixed;' + vert + ':' + offY + 'px;' + horiz + ':' + offX + 'px;width:' + btnSize + 'px;height:' + btnSize + 'px;border-radius:50%;background:' + color + ';border:none;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;color:#fff;transition:transform .2s,box-shadow .2s;z-index:10000;';
    btn.onmouseenter = function() { btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)'; };
    btn.onmouseleave = function() { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'; };

    // Drag handle (transparent overlay on header area)
    var dh = document.createElement('div');
    dh.style.cssText = 'position:absolute;top:0;left:0;right:180px;height:50px;cursor:grab;z-index:10001;display:none;border-radius:12px 0 0 0;';

    // Widget ID for iframe communication
    var wid = 'w-' + chatbotId + '-' + Date.now();

    // ========================================
    // Proactive Messaging - Bubble UI
    // ========================================
    var bubble = null;
    var bubbleClose = null;

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
      var styleStr = Object.keys(styles).map(function(k) {
        var cssProp = k.replace(/([A-Z])/g, '-$1').toLowerCase();
        return cssProp + ':' + styles[k] + ';';
      }).join('');
      
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

    function showBubble(message, ruleId, position, rule) {
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
      activeBubbleRule = rule; // Store the rule for navigation behavior
      bubble.style.display = 'block';
      bubble.onclick = function() {
        hideBubble();
        openWithProactive(ruleId, message, rule);
      };
    }

    function hideBubble() {
      if (bubble) { 
        bubble.style.display = 'none'; 
        activeBubbleRuleId = null;
        activeBubbleRule = null;
      }
    }

    // ========================================
    // Open / Close / Expand / Shrink
    // ========================================
    var widgetExpanded = false;

    function expand() {
      widgetExpanded = true;
      fr.style.width = '100vw'; fr.style.height = '100vh'; fr.style.borderRadius = '0';
      ct.style.top = '0'; ct.style.left = '0'; ct.style.right = 'auto'; ct.style.bottom = 'auto';
      ct.style[vert] = ''; ct.style[horiz] = '';
      dh.style.display = 'none';
      fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-expanded' }, '*');
    }
    function shrink() {
      widgetExpanded = false;
      fr.style.width = w + 'px'; fr.style.height = h + 'px'; fr.style.borderRadius = '12px';
      ct.style.top = ''; ct.style.left = ''; ct.style.right = ''; ct.style.bottom = '';
      ct.style[vert] = offY + 'px'; ct.style[horiz] = offX + 'px';
      dh.style.display = 'block';
      fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-shrunk' }, '*');
    }

    function open() {
      widgetIsOpen = true;
      hideBubble();
      fr.style.display = 'block'; fr.style.visibility = 'visible'; fr.style.pointerEvents = 'auto';
      dh.style.display = 'block'; btn.style.display = 'none';
      setTimeout(function() { fr.contentWindow && fr.contentWindow.postMessage({ type: 'widget-id', widgetId: wid }, '*'); }, 100);
      // Auto-expand on mobile and notify widget to hide expand button
      if (window.innerWidth <= 768) {
        expand();
        setTimeout(function() { fr.contentWindow && fr.contentWindow.postMessage({ type: 'mobile-mode' }, '*'); }, 150);
      }
    }
    function close() {
      widgetIsOpen = false;
      if (widgetExpanded) { shrink(); }
      fr.style.display = 'none'; fr.style.visibility = 'hidden'; fr.style.pointerEvents = 'none';
      dh.style.display = 'none'; btn.style.display = 'flex';
      
      // If widget was opened by proactive trigger, clear the chat state
      if (proactiveWidgetRule) {
        console.log('[ChatWidget] Clearing proactive widget state on close');
        fr.contentWindow && fr.contentWindow.postMessage({ type: 'clear-proactive-state' }, '*');
        proactiveWidgetRule = null;
      }
    }

    function openWithProactive(ruleId, message, rule) {
      open();
      proactiveWidgetRule = rule; // Track the rule for navigation behavior
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

    // Listen for messages from iframe
    window.addEventListener('message', function(e) {
      if (e.source !== fr.contentWindow || !e.data) return;
      if (e.data.type === 'close-chat-widget') close();
      if (e.data.type === 'expand-chat-widget') expand();
      if (e.data.type === 'shrink-chat-widget') shrink();
      if (e.data.type === 'widget-ready') {
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
          showBubble(rule.message, rule.id, rule.bubblePosition, rule);
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
            openWithProactive(rule.id, rule.message, rule);
          }
        }
      });
    }
  }

  // ========================================
  // Proactive Messaging - Tracking Engine
  // ========================================
  var CW_LOG_PREFIX = '[ChatWidget:Proactive]';
  var activeBubbleRuleId = null;
  var activeBubbleRule = null;
  var widgetIsOpen = false;
  var proactiveWidgetRule = null;

  function startProactiveTracking(rules, iframe, onTrigger) {
    var timers = [];
    var pageStartTime = Date.now();
    var siteStartKey = 'cw_site_start';
    var pageViewKey = 'cw_page_views';
    var firedCountsKey = 'cw_fired_counts';
    var urlFiredCountsKey = 'cw_url_fired_counts';
    var lastCheckedUrl = window.location.href;

    // Site start time (persists across page navigations in sessionStorage)
    if (!sessionStorage.getItem(siteStartKey)) {
      sessionStorage.setItem(siteStartKey, String(Date.now()));
    }
    var siteStartTime = parseInt(sessionStorage.getItem(siteStartKey), 10);

    // Page view counter
    var pvCount = parseInt(sessionStorage.getItem(pageViewKey) || '0', 10) + 1;
    sessionStorage.setItem(pageViewKey, String(pvCount));

    // Load persisted show counts from sessionStorage
    var firedCounts = {};  // ruleId -> count fired this session
    var urlFiredCounts = {};  // ruleId -> { url -> count } for page_url triggers
    try {
      var storedCounts = sessionStorage.getItem(firedCountsKey);
      if (storedCounts) firedCounts = JSON.parse(storedCounts);
      var storedUrlCounts = sessionStorage.getItem(urlFiredCountsKey);
      if (storedUrlCounts) urlFiredCounts = JSON.parse(storedUrlCounts);
    } catch (e) {
      console.warn(CW_LOG_PREFIX, 'Failed to load persisted counts:', e);
    }

    // Helper to persist counts to sessionStorage
    function saveCounts() {
      try {
        sessionStorage.setItem(firedCountsKey, JSON.stringify(firedCounts));
        sessionStorage.setItem(urlFiredCountsKey, JSON.stringify(urlFiredCounts));
      } catch (e) {
        console.warn(CW_LOG_PREFIX, 'Failed to save counts:', e);
      }
    }

    console.log(CW_LOG_PREFIX, 'Tracking started', {
      enabledRules: rules.filter(function(r) { return r.enabled; }).length,
      totalRules: rules.length,
      pageViews: pvCount,
      siteTimeElapsed: Math.round((Date.now() - siteStartTime) / 1000) + 's',
      currentUrl: window.location.href,
      loadedCounts: Object.keys(firedCounts).length > 0 || Object.keys(urlFiredCounts).length > 0 ? { firedCounts: firedCounts, urlFiredCounts: urlFiredCounts } : 'none'
    });

    // Idle tracking
    var lastActivity = Date.now();
    function resetIdle() { lastActivity = Date.now(); }
    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('scroll', resetIdle);
    document.addEventListener('click', resetIdle);

    // Sort rules by priority (lower = higher priority)
    var sorted = rules.filter(function(r) { return r.enabled; }).sort(function(a, b) { return (a.priority || 0) - (b.priority || 0); });

    sorted.forEach(function(rule) {
      console.log(CW_LOG_PREFIX, 'Rule registered:', {
        id: rule.id,
        name: rule.name || '(unnamed)',
        triggerType: rule.triggerType,
        displayMode: rule.displayMode,
        delay: (rule.delay || 0) + 'ms',
        maxShowCount: rule.maxShowCount || 'unlimited',
        priority: rule.priority || 0,
        config: rule.triggerConfig
      });
    });

    function canFire(rule, currentUrl) {
      var count;
      // For page_url triggers, track shows per URL (not globally)
      if (rule.triggerType === 'page_url' && currentUrl) {
        if (!urlFiredCounts[rule.id]) urlFiredCounts[rule.id] = {};
        count = urlFiredCounts[rule.id][currentUrl] || 0;
      } else {
        count = firedCounts[rule.id] || 0;
      }
      if (rule.maxShowCount > 0 && count >= rule.maxShowCount) {
        console.log(CW_LOG_PREFIX, 'Rule blocked (max shows reached):', rule.name || rule.id, { shows: count, max: rule.maxShowCount, url: currentUrl || 'N/A' });
        return false;
      }
      return true;
    }

    function fireRule(rule, currentUrl) {
      if (!canFire(rule, currentUrl)) return;
      
      var delay = rule.delay || 0;
      var currentCount = (rule.triggerType === 'page_url' && currentUrl) 
        ? (urlFiredCounts[rule.id] && urlFiredCounts[rule.id][currentUrl] || 0)
        : (firedCounts[rule.id] || 0);
      
      console.log(CW_LOG_PREFIX, 'Rule ready to fire:', {
        id: rule.id,
        name: rule.name || '(unnamed)',
        triggerType: rule.triggerType,
        displayMode: rule.displayMode,
        currentShowCount: currentCount + '/' + (rule.maxShowCount || 'unlimited'),
        delay: delay + 'ms',
        url: currentUrl || 'N/A',
        message: rule.message ? rule.message.substring(0, 60) + (rule.message.length > 60 ? '...' : '') : ''
      });
      
      // Wrapper function that increments count when trigger actually displays
      var triggerWithIncrement = function() {
        // Increment appropriate counter
        if (rule.triggerType === 'page_url' && currentUrl) {
          if (!urlFiredCounts[rule.id]) urlFiredCounts[rule.id] = {};
          urlFiredCounts[rule.id][currentUrl] = (urlFiredCounts[rule.id][currentUrl] || 0) + 1;
        } else {
          firedCounts[rule.id] = (firedCounts[rule.id] || 0) + 1;
        }
        // Persist counts to sessionStorage
        saveCounts();
        
        var newCount = (rule.triggerType === 'page_url' && currentUrl) ? urlFiredCounts[rule.id][currentUrl] : firedCounts[rule.id];
        console.log(CW_LOG_PREFIX, 'Rule TRIGGERED (count incremented):', {
          id: rule.id,
          name: rule.name || '(unnamed)',
          showCount: newCount + '/' + (rule.maxShowCount || 'unlimited'),
          url: currentUrl || 'N/A'
        });
        
        onTrigger(rule);
      };
      
      if (delay > 0) {
        console.log(CW_LOG_PREFIX, 'Delaying trigger by', delay + 'ms for rule:', rule.name || rule.id);
        var t = setTimeout(function() {
          console.log(CW_LOG_PREFIX, 'Delay complete, showing:', rule.name || rule.id);
          triggerWithIncrement();
        }, delay);
        timers.push(t);
      } else {
        triggerWithIncrement();
      }
    }

    // URL match helper
    function matchUrl(pattern, matchType) {
      var url = window.location.href;
      var path = window.location.pathname;
      var matched = false;
      if (matchType === 'exact') matched = url === pattern || path === pattern;
      else if (matchType === 'regex') {
        try { matched = new RegExp(pattern).test(url); } catch(e) { matched = false; }
      } else {
        // default: contains
        matched = url.indexOf(pattern) !== -1 || path.indexOf(pattern) !== -1;
      }
      return matched;
    }

    // Evaluate page_url rules (called on init and on SPA navigation)
    function evaluatePageUrlRules() {
      var currentUrl = window.location.href;
      console.log(CW_LOG_PREFIX, 'Evaluating page_url rules for:', currentUrl);
      sorted.forEach(function(rule) {
        if (rule.triggerType !== 'page_url') return;
        var cfg = rule.triggerConfig || {};
        var pattern = cfg.urlPattern || '';
        var matchType = cfg.matchType || 'contains';
        var matched = matchUrl(pattern, matchType);
        console.log(CW_LOG_PREFIX, 'page_url check:', {
          rule: rule.name || rule.id,
          pattern: pattern,
          matchType: matchType,
          url: currentUrl,
          matched: matched,
          canFire: canFire(rule, currentUrl)
        });
        if (matched) {
          fireRule(rule, currentUrl);
        }
      });
    }

    // ========================================
    // SPA Navigation Detection
    // ========================================
    function onUrlChange() {
      var newUrl = window.location.href;
      if (newUrl === lastCheckedUrl) return;
      console.log(CW_LOG_PREFIX, 'URL changed (SPA navigation):', { from: lastCheckedUrl, to: newUrl });
      lastCheckedUrl = newUrl;

      // Check if bubble should close on navigation
      if (activeBubbleRule && bubble && bubble.style.display !== 'none') {
        var shouldClose = activeBubbleRule.closeOnNavigate !== false; // Default to true
        if (shouldClose) {
          console.log(CW_LOG_PREFIX, 'Closing bubble on navigation (closeOnNavigate=true)');
          hideBubble();
        } else {
          console.log(CW_LOG_PREFIX, 'Keeping bubble visible on navigation (closeOnNavigate=false)');
        }
      }

      // Check if proactive auto-open widget should close on navigation
      if (proactiveWidgetRule && widgetIsOpen) {
        var shouldCloseWidget = proactiveWidgetRule.closeOnNavigate !== false; // Default to true
        if (shouldCloseWidget) {
          console.log(CW_LOG_PREFIX, 'Closing proactive widget on navigation (closeOnNavigate=true)');
          close();
        } else {
          console.log(CW_LOG_PREFIX, 'Keeping proactive widget open on navigation (closeOnNavigate=false)');
        }
      }

      // Increment page view count on SPA navigation
      pvCount = parseInt(sessionStorage.getItem(pageViewKey) || '0', 10) + 1;
      sessionStorage.setItem(pageViewKey, String(pvCount));
      console.log(CW_LOG_PREFIX, 'Page view count updated:', pvCount);

      // Re-evaluate page_url rules
      evaluatePageUrlRules();

      // Re-evaluate page_view_count rules
      sorted.forEach(function(rule) {
        if (rule.triggerType !== 'page_view_count') return;
        var targetViews = (rule.triggerConfig || {}).count || 3;
        console.log(CW_LOG_PREFIX, 'page_view_count check:', { rule: rule.name || rule.id, current: pvCount, target: targetViews, met: pvCount >= targetViews });
        if (pvCount >= targetViews) {
          fireRule(rule);
        }
      });
    }

    // Intercept pushState and replaceState for SPA navigation
    var origPushState = history.pushState;
    var origReplaceState = history.replaceState;
    history.pushState = function() {
      origPushState.apply(this, arguments);
      setTimeout(onUrlChange, 0);
    };
    history.replaceState = function() {
      origReplaceState.apply(this, arguments);
      setTimeout(onUrlChange, 0);
    };
    window.addEventListener('popstate', function() {
      setTimeout(onUrlChange, 0);
    });

    // Process each rule (initial evaluation)
    console.log(CW_LOG_PREFIX, 'Running initial rule evaluation...');
    sorted.forEach(function(rule) {
      var cfg = rule.triggerConfig || {};

      switch (rule.triggerType) {
        case 'page_url':
          // Handled by evaluatePageUrlRules below
          break;

        case 'time_on_page':
          var topMs = (cfg.seconds || 5) * 1000;
          console.log(CW_LOG_PREFIX, 'time_on_page timer set:', { rule: rule.name || rule.id, seconds: cfg.seconds || 5 });
          var t1 = setTimeout(function() {
            console.log(CW_LOG_PREFIX, 'time_on_page elapsed:', rule.name || rule.id);
            fireRule(rule);
          }, topMs);
          timers.push(t1);
          break;

        case 'time_on_site':
          var elapsed = Date.now() - siteStartTime;
          var tosMs = (cfg.seconds || 30) * 1000;
          var remaining = tosMs - elapsed;
          console.log(CW_LOG_PREFIX, 'time_on_site:', { rule: rule.name || rule.id, targetSeconds: cfg.seconds || 30, elapsedMs: elapsed, remainingMs: Math.max(0, remaining) });
          if (remaining <= 0) {
            fireRule(rule);
          } else {
            var t2 = setTimeout(function() {
              console.log(CW_LOG_PREFIX, 'time_on_site elapsed:', rule.name || rule.id);
              fireRule(rule);
            }, remaining);
            timers.push(t2);
          }
          break;

        case 'scroll_depth':
          var targetPct = cfg.percent || 50;
          var scrollFired = false;
          console.log(CW_LOG_PREFIX, 'scroll_depth listener set:', { rule: rule.name || rule.id, targetPercent: targetPct });
          var scrollHandler = function() {
            if (scrollFired) return;
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight) - window.innerHeight;
            if (docHeight <= 0) return;
            var pct = (scrollTop / docHeight) * 100;
            if (pct >= targetPct) {
              scrollFired = true;
              console.log(CW_LOG_PREFIX, 'scroll_depth reached:', { rule: rule.name || rule.id, scrollPercent: Math.round(pct), target: targetPct });
              fireRule(rule);
              window.removeEventListener('scroll', scrollHandler);
            }
          };
          window.addEventListener('scroll', scrollHandler);
          break;

        case 'exit_intent':
          var exitFired = false;
          console.log(CW_LOG_PREFIX, 'exit_intent listener set:', { rule: rule.name || rule.id });
          var exitHandler = function(e) {
            if (exitFired) return;
            if (e.clientY <= 0) {
              exitFired = true;
              console.log(CW_LOG_PREFIX, 'exit_intent detected:', rule.name || rule.id);
              fireRule(rule);
              document.removeEventListener('mouseleave', exitHandler);
            }
          };
          document.addEventListener('mouseleave', exitHandler);
          break;

        case 'page_view_count':
          var targetViews = cfg.count || 3;
          console.log(CW_LOG_PREFIX, 'page_view_count check:', { rule: rule.name || rule.id, currentViews: pvCount, targetViews: targetViews, met: pvCount >= targetViews });
          if (pvCount >= targetViews) {
            fireRule(rule);
          }
          break;

        case 'idle_timeout':
          var idleSec = (cfg.seconds || 30) * 1000;
          console.log(CW_LOG_PREFIX, 'idle_timeout monitor set:', { rule: rule.name || rule.id, idleSeconds: cfg.seconds || 30 });
          var idleCheck = setInterval(function() {
            if (Date.now() - lastActivity >= idleSec) {
              if (canFire(rule)) {
                console.log(CW_LOG_PREFIX, 'idle_timeout reached:', { rule: rule.name || rule.id, idleMs: Date.now() - lastActivity });
                fireRule(rule);
              }
            }
          }, 1000);
          timers.push(idleCheck);
          break;

        case 'custom_event':
          var evtName = cfg.eventName || '';
          if (evtName) {
            console.log(CW_LOG_PREFIX, 'custom_event listener set:', { rule: rule.name || rule.id, eventName: evtName });
            _customEventHandlers.push(function(name) {
              if (name === evtName) {
                console.log(CW_LOG_PREFIX, 'custom_event received:', { rule: rule.name || rule.id, eventName: name });
                fireRule(rule);
              }
            });
          }
          break;
      }
    });

    // Run initial page_url evaluation
    evaluatePageUrlRules();
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
