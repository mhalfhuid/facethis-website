// FaceThis app shell (Malcolm, 10 Nov 2026: "make sure the whole site is responsive so it feels like opening a native app on the phone").
// Phone: slim top bar, bottom tab bar, safe areas, no zoom-on-tap, home-screen install, smooth page changes.
(function () {
  var head = document.head;
  function meta(n, c, attr) { var m = document.createElement('meta'); m.setAttribute(attr || 'name', n); m.content = c; head.appendChild(m); }
  var vp = document.querySelector('meta[name=viewport]');
  if (vp) vp.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
  var dark = /training\.html$/.test(location.pathname);
  meta('theme-color', dark ? '#0a0a0a' : '#ffffff');
  meta('apple-mobile-web-app-capable', 'yes');
  meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-status-bar-style', dark ? 'black-translucent' : 'default');
  meta('apple-mobile-web-app-title', 'FaceThis');
  meta('format-detection', 'telephone=no');
  [['manifest', 'manifest.webmanifest'], ['apple-touch-icon', 'icons/apple-touch-icon.png'], ['icon', 'icons/icon-192.png']].forEach(function (l) {
    var e = document.createElement('link'); e.rel = l[0]; e.href = l[1]; head.appendChild(e);
  });

  var css = '' +
    '@view-transition{navigation:auto}' +
    '::view-transition-old(root),::view-transition-new(root){animation-duration:.22s}' +
    'html{-webkit-text-size-adjust:100%;text-size-adjust:100%;background:' + (dark ? '#0a0a0a' : '#ffffff') + '}' +
    'body{-webkit-tap-highlight-color:transparent;overscroll-behavior-y:none}' +
    'button,a,[role=button]{touch-action:manipulation}' +
    'input,select,textarea{font-size:max(16px,1em)}' +
    '#ft-tabs{display:none}' +
    '@media (max-width:760px){' +
      'body{padding-bottom:calc(72px + env(safe-area-inset-bottom)) !important}' +
      'header{padding-top:calc(10px + env(safe-area-inset-top)) !important;padding-bottom:10px !important;flex-wrap:nowrap !important}' +
      'header nav a,header > div > a:not(.logo),header .wrap nav a{display:none !important}' +
      'header nav{flex-wrap:nowrap !important;gap:8px !important}' +
      'header button{min-height:40px}' +
      'header .wrap{flex-wrap:nowrap !important}' +
      '#ft-tabs{display:flex;position:fixed;left:0;right:0;bottom:0;z-index:2147483600;height:calc(64px + env(safe-area-inset-bottom));padding:0 6px env(safe-area-inset-bottom);' +
        'background:' + (dark ? 'rgba(12,12,11,.88)' : 'rgba(255,255,255,.94)') + ';-webkit-backdrop-filter:blur(18px) saturate(1.4);backdrop-filter:blur(18px) saturate(1.4);border-top:1px solid ' + (dark ? '#23231f' : '#E2E2DC') + '}' +
      '#ft-tabs a,#ft-tabs button{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border:0;background:none;color:' + (dark ? '#8a8a84' : '#75756E') + ';' +
        'font:700 10px/1 Archivo,Helvetica,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;cursor:pointer;-webkit-user-select:none;user-select:none;transition:color .15s,transform .1s}' +
      '#ft-tabs svg{width:24px;height:24px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
      (dark ? '#ft-tabs .on{color:#C4F82A}' : '#ft-tabs .on{color:#0A0A0A;box-shadow:inset 0 3px 0 #C4F82A}') +
      '#ft-tabs a:active,#ft-tabs button:active{transform:scale(.92)}' +
      'button:active,a:active{opacity:.85}' +
    '}' +
    '@media (max-width:760px) and (display-mode:standalone){#ft-draft{font-size:11px !important}}';
  var st = document.createElement('style'); st.id = 'ft-app-css'; st.textContent = css; head.appendChild(st);

  var I = {
    home: '<svg viewBox="0 0 24 24"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5v-5h4v5"/></svg>',
    book: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/></svg>',
    train: '<svg viewBox="0 0 24 24"><path d="M6.5 8v8M17.5 8v8M3.5 10v4M20.5 10v4M6.5 12h11"/></svg>',
    user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.3-3.6 4.2-5.4 7.5-5.4s6.2 1.8 7.5 5.4"/></svg>'
  };
  function page() { var p = location.pathname.split('/').pop() || 'index.html'; return p; }
  function build() {
    if (document.getElementById('ft-tabs')) return;
    var p = page(), user = window.FTAuth && window.FTAuth.get();
    var n = document.createElement('nav'); n.id = 'ft-tabs'; n.setAttribute('aria-label', 'App-menu');
    function tab(href, key, label) { return '<a href="' + href + '"' + (p === href ? ' class="on" aria-current="page"' : '') + '>' + I[key] + '<span>' + label + '</span></a>'; }
    n.innerHTML = tab('index.html', 'home', 'Home') + tab('boeken.html', 'book', 'Boeken') + tab('training.html', 'train', 'Training') +
      '<button type="button" id="ft-tab-acc">' + I.user + '<span>' + (user ? 'Account' : 'Inloggen') + '</span></button>';
    document.body.appendChild(n);
    n.querySelector('#ft-tab-acc').addEventListener('click', function () {
      if (!window.FTAuth) return;
      if (window.FTAuth.get()) { if (confirm('Uitloggen als ' + window.FTAuth.get().name + '?')) window.FTAuth.logout(); }
      else window.FTAuth.open();
    });
  }
  window.addEventListener('ft-auth', function (e) {
    var b = document.querySelector('#ft-tab-acc span'); if (b) b.textContent = e.detail ? 'Account' : 'Inloggen';
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
  window.addEventListener('load', build);
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(function () {});
})();
