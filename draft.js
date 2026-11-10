// Draft notice for the FaceThis preview on aeroba.org (Malcolm, 10 Nov 2026: "Preview, marked as draft").
(function () {
  function addBanner() {
    if (document.getElementById('ft-draft')) return;
    var b = document.createElement('div');
    b.id = 'ft-draft';
    b.setAttribute('role', 'note');
    b.textContent = 'Voorbeeldontwerp — inloggen, boeken en betalen zijn een demo: er wordt niets verstuurd of betaald. Reviews, cijfers en foto’s zijn voorbeelden.';
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;padding:10px 16px;' +
      'background:#C4F82A;color:#0a0a0a;font:600 13px/1.4 Archivo,Helvetica,Arial,sans-serif;text-align:center;' +
      'box-shadow:0 -4px 20px rgba(0,0,0,.4)';
    var full = b.textContent, phone = window.matchMedia('(max-width:760px)');
    function fit() {
      if (phone.matches) {
        b.style.bottom = 'calc(64px + env(safe-area-inset-bottom))';
        b.style.padding = '6px 12px'; b.style.fontSize = '11px';
        if (!b._open) b.textContent = 'Voorbeeldontwerp · demo, er wordt niets betaald — tik voor meer';
      } else { b.style.bottom = '0'; b.style.padding = '10px 16px'; b.style.fontSize = '13px'; b.textContent = full; }
    }
    b.addEventListener('click', function () { if (phone.matches) { b._open = !b._open; b.textContent = b._open ? full : ''; fit(); } });
    phone.addEventListener ? phone.addEventListener('change', fit) : phone.addListener(fit);
    fit();
    document.body.appendChild(b);
    document.body.style.paddingBottom = '52px';
  }
  var send = /verstuur|betaal|claim|aanvraag|vraag advies|start coaching|plan je intake|bevestig/i;
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('button, a');
    if (el && send.test(el.textContent || '') && !el.closest('#boeken, [data-demo-flow]')) {
      setTimeout(function () { alert('Dit is een voorbeeldontwerp: er wordt nog niets verstuurd of betaald.'); }, 50);
    }
  }, true);
  // Bar removed (Malcolm, 10 Nov: "delete the bar"); the demo notice on send buttons stays.
})();
