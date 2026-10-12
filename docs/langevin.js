/* How a Langevin sampler works — 1-D interactive explainer.
   Target: π(x) = 0.6·N(-1, 0.7²) + 0.4·N(1.2, 0.6²)   (two bell curves)
   Landscape: U(x) = -log π(x)
   Update (unadjusted Langevin algorithm), applied to each of N walkers:
       x_{k+1} = x_k - h U'(x_k) + sqrt(2h) ξ_k,   ξ_k ~ N(0, 1)
   Every step records one new position per walker, i.e. N samples per step.
   Layout: landscape panel on the left, histogram panel on the right
   (stacked on narrow screens). Colours are read from the page's CSS
   variables, so the demo follows the light/dark theme.
   Markup contract (research.qmd):
     canvas#langevin-demo, [data-demo-toggle] [data-demo-kick] [data-demo-reset]
     [data-demo-step] [data-demo-count] [data-demo-msg]                      */
(() => {
  const canvas = document.getElementById("langevin-demo");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const $ = (sel) => document.querySelector(sel);
  const btnToggle = $("[data-demo-toggle]"), btnKick = $("[data-demo-kick]"), btnReset = $("[data-demo-reset]");
  const lblStep = $("[data-demo-step]"), lblCount = $("[data-demo-count]"), msg = $("[data-demo-msg]");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- target and landscape ----
  const W1 = 0.6, M1 = -1.0, S1 = 0.7, W2 = 0.4, M2 = 1.2, S2 = 0.6;
  const SQ2PI = Math.sqrt(2 * Math.PI);
  const n1 = (x) => W1 * Math.exp(-0.5 * ((x - M1) / S1) ** 2) / (S1 * SQ2PI);
  const n2 = (x) => W2 * Math.exp(-0.5 * ((x - M2) / S2) ** 2) / (S2 * SQ2PI);
  const pi = (x) => n1(x) + n2(x);
  const U = (x) => -Math.log(Math.max(pi(x), 1e-300));
  const dU = (x) => {                       // U'(x) = -π'(x)/π(x)
    const a = n1(x), b = n2(x), p = a + b;
    if (p < 1e-300) return x > 0 ? 3 : -3;
    return (a * (x - M1) / (S1 * S1) + b * (x - M2) / (S2 * S2)) / p;
  };

  // ---- algorithm & pacing ----
  const h = 0.03;
  const FRAMES_PER_STEP = 5;               // ~12 steps per second, tweened in between
  const N = 30, START = 2.8;
  const XMIN = -3.3, XMAX = 3.3, BINS = 60;
  const BW = (XMAX - XMIN) / BINS;

  let kicks = true, running = !reduced, visible = true;
  let walkers = [], hist = new Float64Array(BINS), samples = 0, step = 0, frame = 0;
  let last = null;
  let W = 0, H = 0, dpr = 1, C = {};

  function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function say(t) { if (msg) msg.textContent = t; }

  function readColors() {
    const cs = getComputedStyle(document.body);
    const v = (n, f) => (cs.getPropertyValue(n).trim() || f);
    const dark = document.body.classList.contains("quarto-dark");
    C = {
      bg: v("--surface", "#fcfaf3"), ink: v("--ink", "#1d2433"), muted: v("--muted", "#545c6b"),
      faint: v("--faint", "#7c8190"), line: v("--line", "#ddd2b8"), accent: v("--accent", "#1f3a68"),
      ribbon: v("--ribbon", "#8c1d2c"), link: dark ? "#9fc0e8" : "#1f3a68",
      walker: dark ? "#e2e8f0" : "#1f3a68",
      landFill: dark ? "rgba(169,199,234,.08)" : "rgba(31,58,104,.06)",
      pull: dark ? "#7dd3c0" : "#1d7a6a",
      dark,
    };
  }

  function reset() {
    walkers = Array.from({ length: N }, () => { const x = START + 0.06 * gauss(); return { x, px: x }; });
    hist.fill(0); samples = 0; step = 0; last = null;
    say(kicks ? "Thirty walkers start high on the right-hand slope. Watch them roll into the valleys while the histogram fills in."
              : "Random kicks are off: this is plain gradient descent.");
  }

  function iterate() {
    const s = Math.sqrt(2 * h);
    walkers.forEach((w, i) => {
      w.px = w.x;
      const drift = -h * dU(w.x);
      const noise = kicks ? s * gauss() : 0;
      w.x = Math.min(XMAX + 0.4, Math.max(XMIN - 0.4, w.x + drift + noise));
      if (i === 0) last = { drift, noise };
      const b = Math.floor((w.x - XMIN) / BW);
      if (b >= 0 && b < BINS) hist[b]++;
      samples++;
    });
    step++;
    if (kicks) {
      if (step === 25) say("Each step moves all 30 walkers once, so the histogram gains 30 samples per step.");
      if (step === 160) say("Walkers now cross the hill now and then. The left valley is deeper, so over time it collects about 60% of the samples.");
      if (step === 600) say("The histogram now closely follows the dashed target curve. That agreement is what sampling means.");
    } else if (step === 60) {
      say("Without random kicks each walker stops at the bottom of its valley. That finds the lowest point, but the spread of π is lost.");
    }
  }

  // ---- layout: two panels side by side (stacked when narrow) ----
  function panels() {
    const stacked = W < 640;
    const gap = stacked ? 0 : 28, outer = 16;
    if (stacked) {
      const ph = (H - 2 * outer) / 2;
      return { stacked, A: { x: outer, y: outer, w: W - 2 * outer, h: ph - 8 }, B: { x: outer, y: outer + ph + 8, w: W - 2 * outer, h: ph - 8 } };
    }
    const pw = (W - 2 * outer - gap) / 2;
    return { stacked, A: { x: outer, y: outer, w: pw, h: H - 2 * outer }, B: { x: outer + pw + gap, y: outer, w: pw, h: H - 2 * outer } };
  }
  const plot = (P) => ({ l: P.x + 34, r: P.x + P.w - 8, t: P.y + 30, b: P.y + P.h - 26 });
  const UMIN = U(M1), UTOP = UMIN + 6.4, PMAX = pi(M1) * 1.3;

  function label(t, x, y, color, align = "left", size = 14, style = "") {
    ctx.fillStyle = color; ctx.textAlign = align;
    ctx.font = `${style} ${size}px "Times New Roman", Times, serif`;
    ctx.fillText(t, x, y);
  }
  function arrow(x0, y, x1, color) {
    if (Math.abs(x1 - x0) < 2) return;
    const dir = Math.sign(x1 - x0);
    ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1 - dir * 6, y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x1 - dir * 8, y - 4.5); ctx.lineTo(x1 - dir * 8, y + 4.5); ctx.closePath(); ctx.fill();
  }
  function axes(p, xs) {
    ctx.strokeStyle = C.line; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(p.l, p.b + .5); ctx.lineTo(p.r, p.b + .5); ctx.stroke();
    for (let t = -3; t <= 3; t++) label(String(t).replace("-", "−"), xs(t), p.b + 17, C.faint, "center", 12);
  }

  function draw(alpha) {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    const { A, B } = panels();
    const fs = W < 640 ? 13 : 15;

    // ----- panel A: landscape -----
    const pa = plot(A);
    const xa = (x) => pa.l + (x - XMIN) / (XMAX - XMIN) * (pa.r - pa.l);
    const ya = (u) => pa.b - (Math.min(u, UTOP) - UMIN) / (UTOP - UMIN) * (pa.b - pa.t);
    label("The landscape  U(x) = −log π(x)", A.x + 2, A.y + 14, C.ink, "left", fs, "bold");
    const path = () => { ctx.beginPath(); for (let i = 0; i <= 300; i++) { const x = XMIN + (XMAX - XMIN) * i / 300; i ? ctx.lineTo(xa(x), ya(U(x))) : ctx.moveTo(xa(x), ya(U(x))); } };
    path(); ctx.lineTo(xa(XMAX), pa.b); ctx.lineTo(xa(XMIN), pa.b); ctx.closePath(); ctx.fillStyle = C.landFill; ctx.fill();
    path(); ctx.strokeStyle = C.link; ctx.lineWidth = 2; ctx.stroke();
    axes(pa, xa);
    if (W >= 640) {
      label("deep valley", xa(M1), ya(UMIN) - 34, C.faint, "center", 13, "italic");
      label("hill", xa(0.25), ya(U(0.25)) - 12, C.faint, "center", 13, "italic");
    }
    walkers.forEach((w, i) => {
      if (i === 0) return;
      const x = w.px + (w.x - w.px) * alpha;
      ctx.beginPath(); ctx.arc(xa(x), ya(U(x)) - 5, 4, 0, Math.PI * 2);
      ctx.fillStyle = C.walker; ctx.globalAlpha = .8; ctx.fill(); ctx.globalAlpha = 1;
    });
    const w0 = walkers[0];
    if (w0) {
      const x = w0.px + (w0.x - w0.px) * alpha, X = xa(x), Y = ya(U(x)) - 6;
      if (last && running) {
        const sc = (xa(1) - xa(0)) * 3;           // arrows drawn 3× actual size
        arrow(X, Y - 20, X + last.drift * sc, C.pull);
        if (kicks) arrow(X, Y - 32, X + last.noise * sc, C.ribbon);
      }
      ctx.beginPath(); ctx.arc(X, Y, 6.5, 0, Math.PI * 2); ctx.fillStyle = C.ribbon; ctx.fill();
      ctx.strokeStyle = C.bg; ctx.lineWidth = 2; ctx.stroke();
    }
    // arrow legend (wide layouts only; the text below the demo explains it too)
    if (W >= 640) {
      const lgY = A.y + 14;
      label("random kick", A.x + A.w, lgY, C.ribbon, "right", 13);
      ctx.font = '13px "Times New Roman", Times, serif';
      const kw = ctx.measureText("random kick").width;
      label("downhill pull ·", A.x + A.w - kw - 6, lgY, C.pull, "right", 13);
    }

    // ----- panel B: histogram vs target -----
    const pb = plot(B);
    const xb = (x) => pb.l + (x - XMIN) / (XMAX - XMIN) * (pb.r - pb.l);
    const yb = (p) => pb.b - Math.min(p, PMAX) / PMAX * (pb.b - pb.t);
    label("Histogram of samples vs. target π(x)", B.x + 2, B.y + 14, C.ink, "left", fs, "bold");
    if (samples > 0) {
      for (let b = 0; b < BINS; b++) {
        const dens = hist[b] / (samples * BW);
        if (dens <= 0) continue;
        const x0 = xb(XMIN + b * BW), x1 = xb(XMIN + (b + 1) * BW), y = yb(dens);
        ctx.fillStyle = C.ribbon; ctx.globalAlpha = .28; ctx.fillRect(x0 + .5, y, x1 - x0 - 1, pb.b - y);
        ctx.globalAlpha = .9; ctx.fillRect(x0 + .5, y, x1 - x0 - 1, 1.6); ctx.globalAlpha = 1;
      }
    }
    ctx.setLineDash([6, 5]); ctx.beginPath();
    for (let i = 0; i <= 300; i++) { const x = XMIN + (XMAX - XMIN) * i / 300; i ? ctx.lineTo(xb(x), yb(pi(x))) : ctx.moveTo(xb(x), yb(pi(x))); }
    ctx.strokeStyle = C.ink; ctx.lineWidth = 1.8; ctx.stroke(); ctx.setLineDash([]);
    axes(pb, xb);
    if (W >= 640) {
      const sh = samples > 0 ? Math.round(100 * hist.slice(0, Math.round((0.1 - XMIN) / BW)).reduce((a, c) => a + c, 0) / samples) : 0;
      label(`left valley: ${sh}% of samples (target ≈ 60%)`, B.x + B.w, B.y + 14, C.muted, "right", 13, "italic");
    }

    if (lblStep) lblStep.textContent = "step " + step.toLocaleString();
    if (lblCount) lblCount.textContent = samples.toLocaleString() + " samples (30 per step)";
  }

  function fit() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    readColors(); draw(1);
  }

  function loop() {
    if (running && visible && !document.hidden) {
      frame++;
      if (frame % FRAMES_PER_STEP === 0) iterate();
      draw((frame % FRAMES_PER_STEP + 1) / FRAMES_PER_STEP);
    }
    requestAnimationFrame(loop);
  }

  if (btnToggle) btnToggle.addEventListener("click", () => {
    running = !running;
    btnToggle.textContent = running ? "Pause" : "Play";
    btnToggle.setAttribute("aria-pressed", String(running));
  });
  if (btnKick) btnKick.addEventListener("click", () => {
    kicks = !kicks;
    btnKick.textContent = "Random kicks: " + (kicks ? "on" : "off");
    btnKick.setAttribute("aria-pressed", String(kicks));
    reset(); draw(1);
  });
  if (btnReset) btnReset.addEventListener("click", () => { reset(); draw(1); });
  if (!running && btnToggle) { btnToggle.textContent = "Play"; btnToggle.setAttribute("aria-pressed", "false"); }

  // re-read colours when the light/dark toggle flips the body class
  new MutationObserver(() => { readColors(); draw(1); }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  if ("IntersectionObserver" in window) new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(canvas);
  reset();
  new ResizeObserver(fit).observe(canvas);
  fit();
  if (reduced) { for (let i = 0; i < 600; i++) iterate(); draw(1); }
  loop();
})();
