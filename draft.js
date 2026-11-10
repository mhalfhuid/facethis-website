// Draft notice for the FaceThis preview on aeroba.org (Malcolm, 10 Nov 2026: "Preview, marked as draft").
(function () {
  function addBanner() {
    if (document.getElementById('ft-draft')) return;
    var b = document.createElement('div');
    b.id = 'ft-draft';
    b.setAttribute('role', 'note');
    b.textContent = 'Voorbeeldontwerp — boeken, betalen en aanvragen werken nog niet. Reviews, cijfers en foto’s zijn voorbeelden.';
    b.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;padding:10px 16px;' +
      'background:#C4F82A;color:#0a0a0a;font:600 13px/1.4 Archivo,Helvetica,Arial,sans-serif;text-align:center;' +
      'box-shadow:0 -4px 20px rgba(0,0,0,.4)';
    document.body.appendChild(b);
    document.body.style.paddingBottom = '52px';
  }
  var send = /verstuur|betaal|claim|aanvraag|vraag advies|start coaching|plan je intake|bevestig/i;
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('button, a');
    if (el && send.test(el.textContent || '')) {
      setTimeout(function () { alert('Dit is een voorbeeldontwerp: er wordt nog niets verstuurd of betaald.'); }, 50);
    }
  }, true);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addBanner); else addBanner();
  window.addEventListener('load', addBanner);
})();
