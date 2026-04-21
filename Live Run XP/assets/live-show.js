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
    'assets/products/chat-avatar-male.svg',
    'assets/products/chat-avatar-2.svg',
    'assets/products/chat-avatar-3.svg',
    'assets/products/chat-avatar-malk.svg',
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
      var isQuestion = row.t.trim().endsWith('?');
      appendChatMessage(row.u, row.t, isQuestion);
    }, 2600 + Math.random() * 2400);
  }

  /* ── Shop bottom sheet (delegates to index.html openShop/closeShop when present) ── */
  function setSheetWillChange(on) {
    var sh = $('live-shop-sheet');
    if (!sh || !sh.style) return;
    sh.style.willChange = on ? 'transform' : '';
  }
  if (shopSheet) {
    shopSheet.addEventListener(
      'transitionend',
      function (e) {
        var sh = $('live-shop-sheet');
        if (!sh || e.target !== sh || e.propertyName !== 'transform') return;
        sh.style.willChange = '';
      },
      false
    );
  }
  var lastShopFocus = null;
  function openShopLocal() {
    var root = $('live-shop-root');
    var sheet = $('live-shop-sheet');
    if (!root || !sheet) return;
    lastShopFocus = document.activeElement;
    setSheetWillChange(true);
    root.classList.add('is-open');
    root.setAttribute('aria-hidden', 'false');
    var shopList = root.querySelector('.live-shop-list');
    if (shopList) shopList.scrollTop = 0;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        try {
          sheet.focus({ preventScroll: true });
        } catch (err) {
          sheet.focus();
        }
      });
    });
  }
  function closeShopLocal() {
    var root = $('live-shop-root');
    var sheet = $('live-shop-sheet');
    if (!root) return;
    if (sheet) setSheetWillChange(true);
    root.classList.remove('is-open');
    root.setAttribute('aria-hidden', 'true');
    if (lastShopFocus && typeof lastShopFocus.focus === 'function') {
      try {
        lastShopFocus.focus({ preventScroll: true });
      } catch (err) {
        lastShopFocus.focus();
      }
    }
  }
  if (shopBtn) {
    shopBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (typeof window.openShop === 'function') {
        window.openShop(e);
      } else {
        openShopLocal();
      }
    });
  }
  if (shopBackdrop) {
    shopBackdrop.addEventListener('click', function () {
      if (typeof window.closeShop === 'function') {
        window.closeShop();
      } else {
        closeShopLocal();
      }
    });
  }
  if (shopClose) {
    shopClose.addEventListener('click', function () {
      if (typeof window.closeShop === 'function') {
        window.closeShop();
      } else {
        closeShopLocal();
      }
    });
  }
  document.addEventListener('keydown', function (e) {
    var root = $('live-shop-root');
    if (e.key === 'Escape' && root && root.classList.contains('is-open')) {
      e.preventDefault();
      if (typeof window.closeShop === 'function') {
        window.closeShop();
      } else {
        closeShopLocal();
      }
    }
  });

  function activateShopTabInRoot(root, tabKey) {
    if (!root || !tabKey) return;
    root.querySelectorAll('.live-shop-tab[data-shop-tab]').forEach(function (t) {
      var on = t.getAttribute('data-shop-tab') === tabKey;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    root.querySelectorAll('.live-shop-panel').forEach(function (p) {
      var match = p.id === 'live-shop-panel-' + tabKey;
      p.hidden = !match;
      if (match) p.scrollTop = 0;
    });
  }
  document.addEventListener(
    'click',
    function (e) {
      var tab = e.target && e.target.closest && e.target.closest('.live-shop-tab[data-shop-tab]');
      if (!tab) return;
      var root = tab.closest('#live-shop-root');
      if (!root) return;
      var key = tab.getAttribute('data-shop-tab');
      if (!key) return;
      activateShopTabInRoot(root, key);
    },
    false
  );
})();
