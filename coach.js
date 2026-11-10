// FaceThis animated coach (UX agent G4, 10 Nov 2026). Draws a stylised coach in a gym on a canvas.
// Virtual stage 1280 x 720. FTCoach.draw(ctx, w, h, move, t, opts) — move: idle | stretch | squat | situp | plank | done.
(function () {
  var W = 1280, H = 720, FLOOR = 626;
  var LEN = { shin: 100, thigh: 104, torso: 150, neck: 16, head: 25, upper: 78, fore: 74, foot: 30 };
  var COL = {
    skin: '#9a6644', skinFar: '#774b30', top: '#C4F82A', topFar: '#97c21c', shorts: '#1d1d1b', shortsFar: '#121211',
    shoe: '#f1f1ec', shoeFar: '#c9c9c3', sole: '#C4F82A', hair: '#141210'
  };
  var rad = Math.PI / 180;
  function P(p, a, L) { return [p[0] + L * Math.sin(a * rad), p[1] - L * Math.cos(a * rad)]; }
  function wave(t, period) { return (1 - Math.cos(2 * Math.PI * t / period)) / 2; }       // 0..1..0
  function hold(x, k) { return Math.min(1, Math.max(0, (x - k) / (1 - 2 * k))); }          // squeeze to hold the ends
  function smooth(x) { return x * x * (3 - 2 * x); }

  // ---------- background (cached per size)
  var bgCache = {};
  function background(w, h) {
    var key = w + 'x' + h;
    if (bgCache[key]) return bgCache[key];
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var g = c.getContext('2d'); g.scale(w / W, h / H);
    var wall = g.createLinearGradient(0, 0, 0, 520);
    wall.addColorStop(0, '#1b1b18'); wall.addColorStop(1, '#121210');
    g.fillStyle = wall; g.fillRect(0, 0, W, 520);
    // wall panels
    g.strokeStyle = 'rgba(255,255,255,.035)'; g.lineWidth = 2;
    for (var x = 0; x < W; x += 160) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 520); g.stroke(); }
    // morning window, left
    var wx = 70, wy = 70, ww = 330, wh = 330;
    var sky = g.createLinearGradient(0, wy, 0, wy + wh);
    sky.addColorStop(0, '#f6d9a8'); sky.addColorStop(.55, '#e9b77d'); sky.addColorStop(1, '#b98a63');
    g.fillStyle = sky; g.fillRect(wx, wy, ww, wh);
    g.fillStyle = 'rgba(255,240,215,.55)'; g.beginPath(); g.arc(wx + 230, wy + 210, 46, 0, 7); g.fill();
    g.fillStyle = 'rgba(40,30,25,.35)'; g.fillRect(wx, wy + 250, ww, 80);
    g.fillStyle = '#0d0d0c';
    g.fillRect(wx - 10, wy - 10, ww + 20, 10); g.fillRect(wx - 10, wy + wh, ww + 20, 12);
    g.fillRect(wx - 10, wy, 10, wh); g.fillRect(wx + ww, wy, 10, wh);
    g.fillRect(wx + ww / 2 - 4, wy, 8, wh); g.fillRect(wx, wy + wh / 2 - 4, ww, 8);
    // light glow on wall
    var glow = g.createRadialGradient(240, 240, 40, 240, 240, 520);
    glow.addColorStop(0, 'rgba(246,200,140,.16)'); glow.addColorStop(1, 'rgba(246,200,140,0)');
    g.fillStyle = glow; g.fillRect(0, 0, W, 520);
    // brand on the wall
    g.save(); g.font = '400 132px Anton, Impact, sans-serif'; g.textBaseline = 'alphabetic';
    g.fillStyle = 'rgba(245,245,243,.05)'; g.fillText('FACE', 520, 250);
    g.fillStyle = 'rgba(196,248,42,.10)'; g.fillText('THIS', 790, 250); g.restore();
    // lime stripe
    g.fillStyle = 'rgba(196,248,42,.55)'; g.fillRect(0, 438, W, 4);
    // dumbbell rack, right
    g.fillStyle = '#0c0c0b'; g.fillRect(930, 360, 300, 14); g.fillRect(930, 430, 300, 14);
    g.fillRect(940, 360, 10, 160); g.fillRect(1210, 360, 10, 160);
    for (var i = 0; i < 6; i++) {
      var dx = 965 + i * 42, r1 = 13 + i, r2 = 11 + i;
      g.fillStyle = '#2b2b27'; g.beginPath(); g.arc(dx, 360 - r1 + 2, r1, 0, 7); g.fill();
      g.fillStyle = '#232320'; g.beginPath(); g.arc(dx, 430 - r2 + 2, r2, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,.06)'; g.beginPath(); g.arc(dx - 4, 360 - r1 - 2, r1 * .45, 0, 7); g.fill();
    }
    // floor
    var fl = g.createLinearGradient(0, 520, 0, H);
    fl.addColorStop(0, '#171715'); fl.addColorStop(1, '#0b0b0a');
    g.fillStyle = fl; g.fillRect(0, 520, W, H - 520);
    g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 2;
    for (var k = -8; k <= 8; k++) { g.beginPath(); g.moveTo(640 + k * 40, 520); g.lineTo(640 + k * 190, H); g.stroke(); }
    for (var yy = 545; yy < H; yy += (yy - 500) * 0.35) { g.beginPath(); g.moveTo(0, yy); g.lineTo(W, yy); g.stroke(); }
    // window light on the floor
    g.fillStyle = 'rgba(246,200,140,.05)';
    g.beginPath(); g.moveTo(80, 520); g.lineTo(400, 520); g.lineTo(700, H); g.lineTo(140, H); g.closePath(); g.fill();
    // kettlebells
    function kb(x, y, s, col) {
      g.fillStyle = col; g.beginPath(); g.arc(x, y - 22 * s, 22 * s, 0, 7); g.fill();
      g.strokeStyle = col; g.lineWidth = 7 * s; g.beginPath(); g.arc(x, y - 44 * s, 13 * s, Math.PI, 0); g.stroke();
      g.fillStyle = 'rgba(0,0,0,.4)'; g.beginPath(); g.ellipse(x, y + 2, 24 * s, 5 * s, 0, 0, 7); g.fill();
    }
    kb(1060, 560, 1.1, '#262622'); kb(1120, 566, 1.3, '#1f1f1c'); kb(1180, 556, .9, '#C4F82A');
    // mat
    g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(640, 650, 360, 26, 0, 0, 7); g.fill();
    g.fillStyle = '#22221f';
    g.beginPath(); g.moveTo(330, 618); g.lineTo(950, 618); g.lineTo(985, 650); g.lineTo(295, 650); g.closePath(); g.fill();
    g.fillStyle = '#C4F82A'; g.fillRect(295, 648, 690, 3);
    // vignette
    var v = g.createRadialGradient(640, 380, 300, 640, 380, 820);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)');
    g.fillStyle = v; g.fillRect(0, 0, W, H);
    bgCache[key] = c;
    return c;
  }

  // ---------- poses: return joint sets for near/far side (side view) or left/right (front view)
  function sideStanding(ax, ay, a) {
    a = a || {};
    var ankle = [ax, ay];
    var knee = P(ankle, a.shin || 0, LEN.shin), hip = P(knee, a.thigh || 0, LEN.thigh);
    var sh = P(hip, a.torso || 0, LEN.torso);
    return { ankle: ankle, knee: knee, hip: hip, sh: sh, footA: 90 };
  }
  function addArm(j, upper, fore) { j.elbow = P(j.sh, upper, LEN.upper); j.wrist = P(j.elbow, fore, LEN.fore); return j; }
  function addHead(j, a) { j.neck = P(j.sh, a, LEN.neck); j.headC = P(j.neck, a, LEN.head); return j; }

  function pose(move, t) {
    var ax = 640, ay = FLOOR - 8, j, far, p;
    if (move === 'squat') {
      p = smooth(hold(wave(t, 2.5), .08));
      j = sideStanding(600, ay, { shin: 34 * p, thigh: -84 * p, torso: 40 * p });
      addArm(j, 180 - 92 * p, 180 - 92 * p); addHead(j, 18 * p);
      far = clone(j, -10, -3);
      return { view: 'side', near: j, far: far };
    }
    if (move === 'situp') {
      p = smooth(hold(wave(t, 2.5), .12));
      var hip = [720, FLOOR - 24];
      var tor = -86 + 58 * p;
      j = { hip: hip };
      j.knee = P(hip, 48, LEN.thigh); j.ankle = P(j.knee, 160, LEN.shin); j.footA = 90;
      j.sh = P(hip, tor, LEN.torso);
      addArm(j, tor + 152, tor + 18); addHead(j, tor + 8 * p);
      far = clone(j, 10, -3);
      return { view: 'side', near: j, far: far, lying: true };
    }
    if (move === 'plank') {
      var b = 76 + 0.8 * Math.sin(2 * Math.PI * t / 2.5);
      j = { ankle: [392, FLOOR - 16], footA: 170 };
      j.knee = P(j.ankle, b, LEN.shin); j.hip = P(j.knee, b, LEN.thigh); j.sh = P(j.hip, b, LEN.torso);
      j.elbow = [j.sh[0] + 4, FLOOR - 14]; j.wrist = [j.elbow[0] + LEN.fore, FLOOR - 14];
      addHead(j, b - 6);
      far = clone(j, -10, -2);
      return { view: 'side', near: j, far: far, plank: true };
    }
    if (move === 'stretch') {
      // arms rise in the first 3 s, then slow side bends left and right (8 s per cycle)
      var up = smooth(Math.min(1, t / 2));
      var bend = up * 20 * Math.sin(2 * Math.PI * Math.max(0, t - 2) / 5);
      var hipC = [640, ay - LEN.shin - LEN.thigh];
      return { view: 'front', hipC: hipC, bend: bend, up: up };
    }
    // idle / done: easy standing bounce, arms loose (done: arms up)
    var bob = wave(t, move === 'done' ? 0.625 : 1.25);
    j = sideStanding(ax, ay, { shin: 5 * bob, thigh: -6 * bob, torso: 2 * bob });
    if (move === 'done') addArm(j, 10 + 8 * bob, 4 + 8 * bob); else addArm(j, 186 - 6 * bob, 176 - 6 * bob);
    addHead(j, 0);
    far = clone(j, -10, -3);
    if (move !== 'done') { far.elbow = P(far.sh, 172 + 6 * bob, LEN.upper); far.wrist = P(far.elbow, 182 + 6 * bob, LEN.fore); }
    return { view: 'side', near: j, far: far };
  }
  function clone(j, dx, dy) {
    var o = {};
    for (var k in j) o[k] = Array.isArray(j[k]) ? [j[k][0] + dx, j[k][1] + dy] : j[k];
    return o;
  }

  // ---------- drawing
  function seg(g, a, b, w, col) {
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round';
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke();
  }
  function shoe(g, ankle, a, col) {
    var toe = P(ankle, a, LEN.foot);
    seg(g, [ankle[0], ankle[1] + 4], [toe[0], toe[1] + 4], 16, col);
    seg(g, [ankle[0], ankle[1] + 11], [toe[0], toe[1] + 11], 4, COL.sole);
  }
  function leg(g, j, far) {
    seg(g, j.hip, j.knee, 36, far ? COL.shortsFar : COL.shorts);
    var mid = [(j.hip[0] * .35 + j.knee[0] * .65), (j.hip[1] * .35 + j.knee[1] * .65)];
    seg(g, mid, j.knee, 30, far ? COL.skinFar : COL.skin);
    seg(g, j.knee, j.ankle, 26, far ? COL.skinFar : COL.skin);
    shoe(g, j.ankle, j.footA, far ? COL.shoeFar : COL.shoe);
  }
  function arm(g, j, far) {
    seg(g, j.sh, j.elbow, 22, far ? COL.skinFar : COL.skin);
    seg(g, j.elbow, j.wrist, 18, far ? COL.skinFar : COL.skin);
  }
  function head(g, c, a) {
    g.fillStyle = COL.skin; g.beginPath(); g.arc(c[0], c[1], LEN.head, 0, 7); g.fill();
    g.fillStyle = COL.hair; g.beginPath(); g.arc(c[0], c[1], LEN.head + 1, (a - 200) * rad, (a + 10) * rad); g.closePath(); g.fill();
  }
  function torso(g, j) {
    seg(g, j.hip, j.sh, 50, COL.top);
    // shorts waistband
    seg(g, j.hip, P(j.hip, angleOf(j.hip, j.sh), 18), 52, COL.shorts);
    seg(g, j.sh, j.neck, 14, COL.skin);
  }
  function angleOf(a, b) { return Math.atan2(b[0] - a[0], -(b[1] - a[1])) / rad; }

  function drawSide(g, s) {
    var n = s.near, f = s.far;
    // shadow
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath();
    var minx = Math.min(n.ankle[0], n.sh[0], n.headC[0]) - 30, maxx = Math.max(n.ankle[0], n.sh[0], n.headC[0], n.wrist[0]) + 40;
    g.ellipse((minx + maxx) / 2, FLOOR + 2, (maxx - minx) / 2, 12, 0, 0, 7); g.fill();
    arm(g, f, true); leg(g, f, true);
    torso(g, n);
    leg(g, n, false);
    head(g, n.headC, angleOf(n.neck, n.headC));
    arm(g, n, false);
  }
  function drawFront(g, s) {
    var hipC = s.hipC, bend = s.bend, up = s.up;
    var shC = P(hipC, bend, LEN.torso);
    var perpL = bend - 90, perpR = bend + 90;
    var hipL = [hipC[0] - 20, hipC[1]], hipR = [hipC[0] + 20, hipC[1]];
    var shL = P(shC, perpL, 40), shR = P(shC, perpR, 40);
    g.fillStyle = 'rgba(0,0,0,.45)'; g.beginPath(); g.ellipse(640, FLOOR + 2, 90, 12, 0, 0, 7); g.fill();
    // legs (slightly apart)
    [[hipL, 186], [hipR, 174]].forEach(function (L) {
      var knee = P(L[0], L[1], LEN.thigh), ankle = P(knee, L[1], LEN.shin);
      seg(g, L[0], knee, 36, COL.shorts);
      seg(g, [(L[0][0] + knee[0] * 2) / 3, (L[0][1] + knee[1] * 2) / 3], knee, 30, COL.skin);
      seg(g, knee, ankle, 26, COL.skin);
      seg(g, [ankle[0] - 8, ankle[1] + 6], [ankle[0] + 8, ankle[1] + 6], 18, COL.shoe);
      seg(g, [ankle[0] - 10, ankle[1] + 14], [ankle[0] + 10, ankle[1] + 14], 4, COL.sole);
    });
    // torso as a trapezoid
    g.fillStyle = COL.top; g.beginPath();
    g.moveTo(hipL[0] - 8, hipL[1]); g.lineTo(hipR[0] + 8, hipR[1]); g.lineTo(shR[0] + 6, shR[1]); g.lineTo(shL[0] - 6, shL[1]); g.closePath(); g.fill();
    g.lineJoin = 'round'; g.strokeStyle = COL.top; g.lineWidth = 14; g.stroke();
    seg(g, [hipL[0] - 6, hipL[1] - 4], [hipR[0] + 6, hipR[1] - 4], 18, COL.shorts);
    var neck = P(shC, bend, LEN.neck + 6), hc = P(neck, bend, LEN.head - 2);
    seg(g, shC, neck, 16, COL.skin);
    // arms: from down at the sides (up=0) to overhead, hands together (up=1)
    // left arm sweeps out to the left and up (192 -> 372), right arm out to the right and up (168 -> -12)
    var aL = 192 + (372 + bend - 192) * up, aR = 168 + (bend - 12 - 168) * up;
    var eL = P(shL, aL, LEN.upper), wL = P(eL, aL + 8 * up, LEN.fore);
    var eR = P(shR, aR, LEN.upper), wR = P(eR, aR - 8 * up, LEN.fore);
    seg(g, shL, eL, 22, COL.skin); seg(g, eL, wL, 18, COL.skin);
    seg(g, shR, eR, 22, COL.skin); seg(g, eR, wR, 18, COL.skin);
    g.fillStyle = COL.skin; g.beginPath(); g.arc(hc[0], hc[1], LEN.head, 0, 7); g.fill();
    g.fillStyle = COL.hair; g.beginPath(); g.arc(hc[0], hc[1], LEN.head + 1, (bend - 180) * rad, (bend) * rad); g.closePath(); g.fill();
  }
  function draw(ctx, w, h, move, t, opts) {
    opts = opts || {};
    ctx.save();
    if (!opts.noBg) ctx.drawImage(background(w, h), 0, 0);
    ctx.scale(w / W, h / H);
    if (opts.zoom) { ctx.translate(640, 470); ctx.scale(opts.zoom, opts.zoom); ctx.translate(-640, -470); }
    var s = pose(move, t);
    if (s.view === 'front') drawFront(ctx, s); else drawSide(ctx, s);
    ctx.restore();
  }
  window.FTCoach = { draw: draw, W: W, H: H, clear: function () { bgCache = {}; } };
})();
