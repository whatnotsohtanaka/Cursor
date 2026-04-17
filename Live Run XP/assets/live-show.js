/* Live Run XP — seller live: show timer, viewers, chat (no bids), shop sheet */
(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) {
    return document.getElementById(id);
  }

  var showTimerEl = $('live-show-show-timer');
  var liveCountEl = $('live-show-live-count');
  var chatThread = $('live-show-chat-thread');
  var shopBtn = $('live-show-shop-btn');
  var shopRoot = $('live-shop-root');
  var shopBackdrop = $('live-shop-backdrop');
  var shopSheet = $('live-shop-sheet');
  var shopClose = $('live-shop-close');

  if (!showTimerEl || !chatThread) return;

  /* ── Show time (count up from 00:31:28) ───────────────────────────── */
  var showSec = 31 * 60 + 28;
  function pad2(n) {
    return String(n).padStart(2, '0');
  }
  function renderShowTimer() {
    var h = Math.floor(showSec / 3600);
    var m = Math.floor((showSec % 3600) / 60);
    var s = showSec % 60;
    showTimerEl.textContent = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
  }
  renderShowTimer();
  setInterval(function () {
    showSec += 1;
    renderShowTimer();
  }, 1000);

  /* ── Viewer count ─────────────────────────────────────────────────── */
  var viewerTarget = 120;
  var viewerDisplay = 120;
  function pickViewerTarget() {
    var delta = Math.floor(Math.random() * 9) - 3;
    viewerTarget = Math.max(78, Math.min(198, viewerTarget + delta));
  }
  function tickViewer() {
    if (reduceMotion) {
      liveCountEl.textContent = String(viewerTarget);
      return;
    }
    if (viewerDisplay < viewerTarget) viewerDisplay += 1;
    else if (viewerDisplay > viewerTarget) viewerDisplay -= 1;
    liveCountEl.textContent = String(viewerDisplay);
  }
  if (liveCountEl) {
    setInterval(pickViewerTarget, 2200 + Math.random() * 2800);
    setInterval(tickViewer, 180);
  }

  /* ── Lively chat (no bid amounts) ─────────────────────────────────── */
  var avatars = [
    'https://www.figma.com/api/mcp/asset/ac1abf5d-04d2-4263-84ee-fad13b72f012',
    'https://www.figma.com/api/mcp/asset/bb5f8f55-0328-48f4-829c-98cc7942810a',
    'https://www.figma.com/api/mcp/asset/ae69a14c-2f6f-4035-af69-df4690cbc685',
    'https://www.figma.com/api/mcp/asset/a1b9e0dc-8237-4aa4-8093-657f8e0cb994',
  ];
  var chatPool = [
    { u: 'solesearch', t: 'that colorway is clean 🔥' },
    { u: 'midsole_mike', t: 'going once…' },
    { u: 'laceup_lauren', t: 'ship to Canada?' },
    { u: 'grail_gabe', t: 'need these for the rotation' },
    { u: 'kicks_kira', t: 'authentic box?' },
    { u: 'fastcop', t: 'lemme get a LC real quick' },
    { u: 'sneakerfreaker', t: 'thanks for pulling up everyone' },
    { u: 'hypehaus', t: '🔥🔥🔥' },
    { u: 'size9_only', t: 'if anyone passes lmk' },
    { u: 'notstarr', t: 'my wallet is ready' },
  ];
  var chatIdx = 0;
  function appendChatMessage(user, text, accent) {
    var wrap = document.createElement('div');
    wrap.className = 'live-show__msg live-show__msg--pop';
    var av = avatars[Math.floor(Math.random() * avatars.length)];
    wrap.innerHTML =
      '<div class="live-show__msg-row">' +
      '<div class="live-show__msg-avatar"><img alt="" width="32" height="32" src="' +
      av +
      '" /></div>' +
      '<div class="live-show__msg-body">' +
      '<p class="live-show__msg-user"></p>' +
      '<p class="live-show__msg-text"></p>' +
      '</div></div>';
    wrap.querySelector('.live-show__msg-user').textContent = user;
    var tp = wrap.querySelector('.live-show__msg-text');
    tp.textContent = text;
    if (accent) tp.classList.add('live-show__msg-text--accent');
    chatThread.appendChild(wrap);
    while (chatThread.children.length > 24) chatThread.removeChild(chatThread.firstChild);
    wrap.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
  }
  if (!reduceMotion) {
    setInterval(function () {
      var row = chatPool[chatIdx % chatPool.length];
      chatIdx += 1;
      appendChatMessage(row.u, row.t, false);
    }, 2600 + Math.random() * 2400);
  }

  /* ── Shop bottom sheet ───────────────────────────────────────────── */
  var lastShopFocus = null;
  function setSheetWillChange(on) {
    if (!shopSheet || !shopSheet.style) return;
    shopSheet.style.willChange = on ? 'transform' : '';
  }
  if (shopSheet) {
    shopSheet.addEventListener(
      'transitionend',
      function (e) {
        if (e.target !== shopSheet || e.propertyName !== 'transform') return;
        shopSheet.style.willChange = '';
      },
      false
    );
  }
  function openShop() {
    if (!shopRoot || !shopSheet) return;
    lastShopFocus = document.activeElement;
    setSheetWillChange(true);
    shopRoot.classList.add('is-open');
    shopRoot.setAttribute('aria-hidden', 'false');
    /* Defer focus so the first paint is transform-only (avoids scroll/viewport nudge over video). */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        try {
          shopSheet.focus({ preventScroll: true });
        } catch (err) {
          shopSheet.focus();
        }
      });
    });
  }
  function closeShop() {
    if (!shopRoot) return;
    if (shopSheet) setSheetWillChange(true);
    shopRoot.classList.remove('is-open');
    shopRoot.setAttribute('aria-hidden', 'true');
    if (lastShopFocus && typeof lastShopFocus.focus === 'function') {
      try {
        lastShopFocus.focus({ preventScroll: true });
      } catch (err) {
        lastShopFocus.focus();
      }
    }
  }
  if (shopBtn) shopBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    openShop();
  });
  if (shopBackdrop) shopBackdrop.addEventListener('click', closeShop);
  if (shopClose) shopClose.addEventListener('click', closeShop);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && shopRoot && shopRoot.classList.contains('is-open')) {
      e.preventDefault();
      closeShop();
    }
  });

  var shopTabs = document.querySelectorAll('.live-shop-tab[data-shop-tab]');
  var shopPanels = document.querySelectorAll('.live-shop-panel');
  function activateShopTab(tabKey) {
    shopTabs.forEach(function (t) {
      var on = t.getAttribute('data-shop-tab') === tabKey;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    shopPanels.forEach(function (p) {
      var match = p.id === 'live-shop-panel-' + tabKey;
      p.hidden = !match;
      if (match) p.scrollTop = 0;
    });
  }
  shopTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var key = tab.getAttribute('data-shop-tab');
      if (!key) return;
      activateShopTab(key);
    });
  });
})();
