/* Flow switching + starred default + /new-prototype null state (mobile boilerplate) */
(function () {
  var flowOpts = document.querySelectorAll('[data-flow]');
  var flowPanels = document.querySelectorAll('.flow-panel');
  var flowStarBtns = document.querySelectorAll('[data-flow-star]');
  if (!flowOpts.length || !flowPanels.length) return;

  function flowStorageKey() {
    return 'proto_default_flow:' + location.pathname.replace(/\/index\.html$/i, '');
  }
  function getStoredDefaultFlow() {
    try { return localStorage.getItem(flowStorageKey()); } catch (e) { return null; }
  }
  function setStoredDefaultFlow(flowId) {
    try {
      if (flowId) localStorage.setItem(flowStorageKey(), flowId);
      else localStorage.removeItem(flowStorageKey());
    } catch (e) {}
  }
  function activateFlow(flowId) {
    var opt = document.querySelector('[data-flow="' + flowId + '"]');
    if (!opt) return;
    flowOpts.forEach(function (o) { o.classList.remove('active'); });
    opt.classList.add('active');
    flowPanels.forEach(function (p) { p.classList.toggle('active', p.id === flowId); });
    var pc = document.querySelector('.phone-content');
    if (pc) pc.scrollTop = 0;
  }
  function syncFlowStarUi() {
    var def = getStoredDefaultFlow();
    flowStarBtns.forEach(function (btn) {
      var id = btn.getAttribute('data-flow-star');
      var on = def === id;
      btn.classList.toggle('is-starred', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (!def) {
        btn.setAttribute('title', 'Star a flow to open this prototype on that screen by default. Saved in this browser only.');
      } else if (on) {
        btn.setAttribute('title', 'Default flow on load — click to clear');
      } else {
        btn.setAttribute('title', 'Set as default flow on load');
      }
    });
  }

  flowOpts.forEach(function (opt) {
    opt.addEventListener('click', function () {
      var flowId = opt.dataset.flow;
      flowOpts.forEach(function (o) { o.classList.remove('active'); });
      opt.classList.add('active');
      flowPanels.forEach(function (p) { p.classList.toggle('active', p.id === flowId); });
      var pc = document.querySelector('.phone-content');
      if (pc) pc.scrollTop = 0;
    });
  });

  flowStarBtns.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var id = btn.getAttribute('data-flow-star');
      if (getStoredDefaultFlow() === id) setStoredDefaultFlow(null);
      else setStoredDefaultFlow(id);
      syncFlowStarUi();
    });
  });

  window.getProtoActiveTab = function () {
    var active = document.querySelector('[data-flow].active');
    return active ? active.dataset.flow : 'flow-1';
  };
  window.PROTO_TAB_LABELS = { 'flow-1': 'Live show', 'flow-2': 'Placeholder' };

  var p = new URLSearchParams(window.location.search);
  var q = p.get('flow');
  if (q) activateFlow(q);
  else {
    var stored = getStoredDefaultFlow();
    if (stored && document.querySelector('[data-flow="' + stored + '"]')) activateFlow(stored);
    else activateFlow('flow-1');
  }
  syncFlowStarUi();
})();
