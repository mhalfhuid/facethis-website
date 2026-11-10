// FaceThis demo login (Malcolm, 10 Nov 2026 interview: "Demo login").
// Any name + e-mail logs you in on this device only (localStorage). Nothing is sent anywhere.
(function () {
  var KEY = 'ft-user';
  function get() {
    try { var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.name ? v : null; } catch (e) { return null; }
  }
  function set(u) {
    try { if (u) localStorage.setItem(KEY, JSON.stringify(u)); else localStorage.removeItem(KEY); } catch (e) {}
    window.dispatchEvent(new CustomEvent('ft-auth', { detail: u }));
  }
  var css = '' +
    '#ft-login{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,.72);backdrop-filter:blur(8px);animation:ftl-in .2s ease both}' +
    '@keyframes ftl-in{from{opacity:0}to{opacity:1}}' +
    '#ft-login .box{width:min(100%,420px);padding:clamp(22px,5vw,34px);border-radius:24px;background:#0f0f0e;border:1px solid #2c2c26;color:#f5f5f3;font-family:Archivo,Helvetica,Arial,sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.6)}' +
    '#ft-login .k{font:500 11px/1 "IBM Plex Mono",monospace;letter-spacing:.14em;text-transform:uppercase;color:#C4F82A}' +
    '#ft-login h2{margin:12px 0 0;font:400 clamp(30px,6vw,40px)/1 Anton,Impact,sans-serif;text-transform:uppercase}' +
    '#ft-login p{margin:10px 0 0;font-size:14px;line-height:1.6;color:#b9b9b4}' +
    '#ft-login label{display:block;margin-top:16px;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#b9b9b4}' +
    '#ft-login input{width:100%;margin-top:7px;padding:14px 16px;border-radius:14px;border:1px solid #2c2c26;background:#131311;color:#f5f5f3;font-size:16px;outline:none}' +
    '#ft-login input:focus{border-color:#C4F82A}' +
    '#ft-login .go{width:100%;margin-top:22px;padding:16px;border:none;border-radius:999px;background:#C4F82A;color:#0a0a0a;font-size:14px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;cursor:pointer}' +
    '#ft-login .go:hover{background:#d8ff58}' +
    '#ft-login .x{float:right;margin:-6px -6px 0 0;width:36px;height:36px;border-radius:999px;border:1px solid #2c2c26;background:transparent;color:#b9b9b4;font-size:18px;cursor:pointer}' +
    '#ft-login .fine{margin-top:14px;font:400 11px/1.6 "IBM Plex Mono",monospace;color:#6e6e68}' +
    '#ft-login .err{min-height:18px;margin-top:8px;font-size:12px;color:#ff8a7a}';
  function open(opts) {
    opts = opts || {};
    if (document.getElementById('ft-login')) return;
    if (!document.getElementById('ft-login-css')) {
      var st = document.createElement('style'); st.id = 'ft-login-css'; st.textContent = css; document.head.appendChild(st);
    }
    var w = document.createElement('div');
    w.id = 'ft-login'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-modal', 'true'); w.setAttribute('aria-labelledby', 'ft-login-h');
    w.innerHTML = '<form class="box" novalidate>' +
      '<button type="button" class="x" aria-label="Sluiten">×</button>' +
      '<div class="k">Mijn FaceThis</div>' +
      '<h2 id="ft-login-h">Inloggen</h2>' +
      '<p>' + (opts.reason || 'Log in om te boeken, te betalen en je trainingsroutine van Melvin te openen.') + '</p>' +
      '<label for="ft-n">Naam</label><input id="ft-n" name="name" autocomplete="name" placeholder="Voornaam Achternaam">' +
      '<label for="ft-e">E-mail</label><input id="ft-e" name="email" type="email" autocomplete="email" placeholder="jij@voorbeeld.nl">' +
      '<div class="err" aria-live="polite"></div>' +
      '<button type="submit" class="go">Inloggen</button>' +
      '<div class="fine">Demo-login: je gegevens blijven alleen op dit apparaat. Er wordt niets verstuurd of opgeslagen op een server.</div>' +
      '</form>';
    document.body.appendChild(w);
    var f = w.querySelector('form'), n = w.querySelector('#ft-n'), e = w.querySelector('#ft-e'), err = w.querySelector('.err');
    function close() { w.remove(); document.removeEventListener('keydown', esc); }
    function esc(ev) { if (ev.key === 'Escape') close(); }
    document.addEventListener('keydown', esc);
    w.addEventListener('click', function (ev) { if (ev.target === w) close(); });
    w.querySelector('.x').addEventListener('click', close);
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = n.value.trim(), email = e.value.trim();
      if (name.length < 2) { err.textContent = 'Vul je naam in.'; n.focus(); return; }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { err.textContent = 'Vul een geldig e-mailadres in.'; e.focus(); return; }
      set({ name: name, email: email });
      close();
      if (opts.onDone) opts.onDone();
    });
    setTimeout(function () { n.focus(); }, 30);
  }
  window.FTAuth = { get: get, open: open, logout: function () { set(null); } };
})();
