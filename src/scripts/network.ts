// Home hero: one hub ("Pierre + AI") directing a network of skills.
// The cloud morphs between four formations and regroups by discipline when a legend chip is pointed at.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, BufferAttribute, BufferGeometry, LineSegments, LineBasicMaterial,
  Points, PointsMaterial, CanvasTexture, Color, Vector3, DynamicDrawUsage,
} from "three";
import { categories, skills } from "../data/skills";

export function initNetwork() {
  const wrap = document.getElementById("gl");
  const lgBox = document.getElementById("lg");
  const cap = document.getElementById("gl-cap");
  const capDefault = cap?.textContent ?? "";
  if (!wrap || !lgBox) return;
  const parent = wrap.parentElement as HTMLElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* legend buttons, built first so they exist even without WebGL */
  const btns: HTMLButtonElement[] = categories.map((name, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "lg";
    b.textContent = name;
    b.dataset.c = String(i);
    b.setAttribute("aria-pressed", "false");
    lgBox.appendChild(b);
    return b;
  });

  const probe = document.createElement("canvas");
  if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;

  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  wrap.appendChild(renderer.domElement);
  const scene = new Scene();
  const camera = new PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.z = 10.5;
  const group = new Group();
  scene.add(group);

  const N = 360;
  const K = skills.length;
  const R = 3.2;
  const rnd = (a: number, b: number) => a + Math.random() * (b - a);

  /* categories per node; the first K spread nodes carry the labelled skills */
  const cat: number[] = new Array(N).fill(-1);
  const lab: number[] = [];
  for (let i = 0; i < K; i++) {
    const idx = Math.floor((i * N) / K) + 2;
    lab.push(idx);
    cat[idx] = skills[i][1];
  }
  for (let i = 0; i < N; i++) if (cat[i] < 0) cat[i] = Math.floor(Math.random() * categories.length);

  /* formations: 0 sphere, 1 clustered by discipline, 2 torus, 3 layers (edge / app / data) */
  const mk = () => new Float32Array((N + 1) * 3); // slot N is the hub, always at the origin
  const F = [mk(), mk(), mk(), mk()];
  const gold = Math.PI * (3 - Math.sqrt(5));
  const jit: number[] = [];
  for (let i = 0; i < N; i++) jit.push(rnd(0.8, 1.2));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = gold * i;
    const k = R * jit[i];
    F[0][i * 3] = Math.cos(th) * r * k; F[0][i * 3 + 1] = y * k; F[0][i * 3 + 2] = Math.sin(th) * r * k;
  }
  const ctr = categories.map((_, c) => {
    const a = (c / categories.length) * Math.PI * 2;
    const ring = 2.7 + categories.length * 0.05;
    return [Math.cos(a) * ring, c % 2 ? 0.9 : -0.9, Math.sin(a) * ring];
  });
  for (let i = 0; i < N; i++) {
    const cc = ctr[cat[i]];
    const u = Math.random(), v = Math.random() * 2 - 1, ph = Math.random() * Math.PI * 2;
    const rr = Math.cbrt(u) * 0.95, sq = Math.sqrt(1 - v * v);
    F[1][i * 3] = cc[0] + rr * sq * Math.cos(ph); F[1][i * 3 + 1] = cc[1] + rr * v; F[1][i * 3 + 2] = cc[2] + rr * sq * Math.sin(ph);
  }
  for (let i = 0; i < N; i++) {
    const tu = ((i * 0.6180339) % 1) * Math.PI * 2, tv = ((i * 0.381966) % 1) * Math.PI * 2, RR = 2.5, rt = 1.05 * jit[i];
    F[2][i * 3] = (RR + rt * Math.cos(tv)) * Math.cos(tu); F[2][i * 3 + 1] = rt * Math.sin(tv) * 1.1; F[2][i * 3 + 2] = (RR + rt * Math.cos(tv)) * Math.sin(tu);
  }
  for (let i = 0; i < N; i++) {
    const ly = i % 3, j = Math.floor(i / 3), rad = 3.3 * Math.sqrt((j + 0.5) / (N / 3)), tt = gold * j;
    F[3][i * 3] = Math.cos(tt) * rad; F[3][i * 3 + 1] = (ly - 1) * 1.8 + rnd(-0.12, 0.12); F[3][i * 3 + 2] = Math.sin(tt) * rad;
  }

  const cur = new Float32Array(F[0]);
  const posAttr = new BufferAttribute(cur, 3);
  posAttr.setUsage(DynamicDrawUsage);

  /* edges, one set per formation, all sharing the same live position buffer */
  function nearest(form: Float32Array, filter?: (a: number, b: number) => boolean) {
    const pairs: number[] = [];
    for (let a = 0; a < N; a++) {
      const best: [number, number][] = [];
      for (let b = 0; b < N; b++) {
        if (a === b || (filter && !filter(a, b))) continue;
        const dx = form[a * 3] - form[b * 3], dy = form[a * 3 + 1] - form[b * 3 + 1], dz = form[a * 3 + 2] - form[b * 3 + 2];
        best.push([dx * dx + dy * dy + dz * dz, b]);
      }
      best.sort((p, q) => p[0] - q[0]);
      for (let n = 0; n < 2 && n < best.length; n++) pairs.push(a, best[n][1]);
    }
    return pairs;
  }
  const edgeIdx = [
    nearest(F[0]),
    nearest(F[1], (a, b) => cat[a] === cat[b]),
    nearest(F[2]),
    nearest(F[3], (a, b) => a % 3 === b % 3),
  ];
  const edgeMats: LineBasicMaterial[] = [];
  edgeIdx.forEach((ix) => {
    const g = new BufferGeometry();
    g.setAttribute("position", posAttr);
    g.setIndex(ix);
    const m = new LineBasicMaterial({ color: 0xff2e93, transparent: true, opacity: 0 });
    edgeMats.push(m);
    group.add(new LineSegments(g, m));
  });

  /* nodes */
  const cv = document.createElement("canvas");
  cv.width = cv.height = 64;
  const cx = cv.getContext("2d")!;
  const gr = cx.createRadialGradient(32, 32, 0, 32, 32, 30);
  gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(0.7, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)");
  cx.fillStyle = gr; cx.fillRect(0, 0, 64, 64);
  const tex = new CanvasTexture(cv);
  const colArr = new Float32Array((N + 1) * 3), colTarget = new Float32Array((N + 1) * 3);
  const BASE = new Color(0xd8a9c2), HI = new Color(0xffffff), DIM = new Color(0x3b2733);
  const setColors = (hl: number) => {
    for (let n = 0; n < N; n++) {
      const c = hl < 0 ? BASE : cat[n] === hl ? HI : DIM;
      colTarget[n * 3] = c.r; colTarget[n * 3 + 1] = c.g; colTarget[n * 3 + 2] = c.b;
    }
  };
  setColors(-1);
  colArr.set(colTarget);
  const colAttr = new BufferAttribute(colArr, 3);
  const mat = (size: number, extra: object = {}) =>
    new PointsMaterial({ size, vertexColors: true, map: tex, transparent: true, depthWrite: false, alphaTest: 0.05, ...extra });
  const ng = new BufferGeometry();
  ng.setAttribute("position", posAttr); ng.setAttribute("color", colAttr);
  ng.setIndex(Array.from({ length: N }, (_, i) => i));
  group.add(new Points(ng, mat(0.1)));
  const lgm = new BufferGeometry();
  lgm.setAttribute("position", posAttr); lgm.setAttribute("color", colAttr); lgm.setIndex(lab);
  group.add(new Points(lgm, mat(0.24)));
  const hg = new BufferGeometry();
  hg.setAttribute("position", posAttr); hg.setIndex([N]);
  group.add(new Points(hg, new PointsMaterial({ size: 0.55, color: 0xffffff, map: tex, transparent: true, depthWrite: false, alphaTest: 0.05 })));
  const sp: number[] = [];
  lab.forEach((ix) => sp.push(N, ix));
  const sg = new BufferGeometry();
  sg.setAttribute("position", posAttr); sg.setIndex(sp);
  group.add(new LineSegments(sg, new LineBasicMaterial({ color: 0xff2e93, transparent: true, opacity: 0.14 })));
  const pp = new Float32Array(K * 3);
  const pt = Array.from({ length: K }, () => Math.random());
  const pg = new BufferGeometry();
  pg.setAttribute("position", new BufferAttribute(pp, 3));
  group.add(new Points(pg, new PointsMaterial({ size: 0.16, color: 0xffffff, map: tex, transparent: true, depthWrite: false, alphaTest: 0.05 })));

  /* labels */
  const tags = skills.map((s) => {
    const e = document.createElement("span");
    e.className = "tag";
    e.setAttribute("aria-hidden", "true");
    e.textContent = s[0];
    parent.appendChild(e);
    return e;
  });
  const hubTag = document.createElement("span");
  hubTag.className = "tag hub";
  hubTag.setAttribute("aria-hidden", "true");
  hubTag.textContent = "Pierre + AI";
  parent.appendChild(hubTag);

  /* morph state */
  let form = 0;
  let from = new Float32Array(cur);
  let to = F[0];
  let t0 = 0, dur = 2.2;
  const wts = [1, 0, 0, 0];
  let fromW = [1, 0, 0, 0], toW = [1, 0, 0, 0];
  let hl = -1, hold = false, nextAt = 3;
  let targetRot: number | null = null; // when a discipline is picked, turn its cluster to face the viewer
  const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t));
  const t00 = performance.now();
  const clock = () => (performance.now() - t00) / 1000;
  function go(k: number, now: number, instant = false) {
    form = k; from = new Float32Array(cur); to = F[k]; t0 = now; dur = instant ? 0.001 : 2.2;
    fromW = wts.slice(); toW = [0, 0, 0, 0]; toW[k] = 1;
  }
  function setHL(c: number, now: number) {
    hl = c; setColors(c); hold = c >= 0;
    if (c >= 0) {
      const a = (c / categories.length) * Math.PI * 2;
      let t = a - Math.PI / 2;
      const TWO = Math.PI * 2;
      t += Math.round((rotY - t) / TWO) * TWO; // nearest turn
      targetRot = t;
      if (reduce) rotY = t;
    } else targetRot = null;
    if (cap) cap.textContent = c >= 0 ? `${categories[c]}: ${skills.filter((s) => s[1] === c).map((s) => s[0]).join(", ")}` : capDefault;
    btns.forEach((b, i) => { b.classList.toggle("on", i === c); b.setAttribute("aria-pressed", String(i === c)); });
    if (c >= 0) go(1, now, reduce);
    else { nextAt = now + 1.4; if (reduce) go(0, now, true); }
  }
  // hover and keyboard focus preview a discipline; a click pins it until it is clicked again
  let pinned = -1;
  btns.forEach((b, i) => {
    const on = () => setHL(i, clock());
    const off = () => setHL(-1, clock());
    // touch fires an emulated mouseenter before click, which made a tap select then immediately deselect
    const canHover = window.matchMedia("(hover: hover)");
    b.addEventListener("mouseenter", () => { if (canHover.matches && pinned < 0) on(); });
    b.addEventListener("mouseleave", () => { if (canHover.matches && pinned < 0) off(); });
    b.addEventListener("focus", () => { if (pinned < 0 && b.matches(":focus-visible")) on(); });
    b.addEventListener("blur", () => { if (pinned < 0 && hl === i) off(); });
    b.addEventListener("click", () => {
      if (pinned === i) { pinned = -1; off(); }
      else { pinned = i; on(); }
    });
  });

  let rotY = 1.2 * 0.07, pulseT = 0, lastNow = 0;
  const v3 = new Vector3();
  let mx = 0, my = 0, w = 1, h = 1, visible = true;
  function size() {
    w = wrap!.clientWidth; h = wrap!.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = 10.5 * Math.min(1.7, Math.max(1, 1.25 / camera.aspect)); // pull back so the whole cloud fits a narrow canvas
    camera.updateProjectionMatrix();
    group.position.x = window.innerWidth > 1000 ? 1.3 : 0;
  }
  function place(el: HTMLElement, x: number, y: number, z: number, op: number) {
    v3.set(x, y, z).applyMatrix4(group.matrixWorld);
    const depth = v3.z;
    v3.project(camera);
    const rect = wrap!.getBoundingClientRect(), par = parent.getBoundingClientRect();
    const px = rect.left - par.left + (v3.x * 0.5 + 0.5) * w + 8, py = rect.top - par.top + (-v3.y * 0.5 + 0.5) * h - 8;
    el.style.transform = `translate(${px}px,${py}px)`;
    const o = Math.max(0, Math.min(1, (depth - 0.9) / 2.2)) * op;
    el.style.opacity = String(o);
    el.style.visibility = o < 0.04 ? "hidden" : "visible";
  }
  function frame(now: number, _rotT: number) {
    const dt = Math.min(0.1, Math.max(0, now - lastNow));
    lastNow = now;
    if (targetRot !== null) rotY += (targetRot - rotY) * Math.min(1, dt * 2.2);
    else rotY += dt * 0.07;
    pulseT += dt * 0.16;
    if (!hold && !reduce && now > nextAt && now - t0 > dur + 3.2) { go((form + 1) % 4, now); nextAt = now + 1; }
    const s = ease((now - t0) / dur);
    for (let n = 0; n < (N + 1) * 3; n++) cur[n] = from[n] + (to[n] - from[n]) * s;
    posAttr.needsUpdate = true;
    for (let e = 0; e < 4; e++) {
      wts[e] = fromW[e] + (toW[e] - fromW[e]) * s;
      edgeMats[e].opacity = wts[e] * (hl >= 0 && e === 1 ? 0.34 : 0.2);
    }
    for (let n = 0; n < (N + 1) * 3; n++) colArr[n] += (colTarget[n] - colArr[n]) * 0.12;
    colAttr.needsUpdate = true;
    // keep the whole picked cluster inside the canvas: slide the cloud left while a discipline is held
    const baseX = window.innerWidth > 1000 ? 1.3 : 0;
    group.position.x += ((hold && baseX ? baseX - 1.5 : baseX) - group.position.x) * Math.min(1, dt * 2.2);
    group.rotation.y = rotY + mx * 0.35;
    group.rotation.x = my * 0.2;
    group.updateMatrixWorld(true);
    for (let q = 0; q < K; q++) {
      const kk = (pt[q] + pulseT + q * 0.07) % 1, ix = lab[q] * 3;
      pp[q * 3] = cur[ix] * kk; pp[q * 3 + 1] = cur[ix + 1] * kk; pp[q * 3 + 2] = cur[ix + 2] * kk;
    }
    pg.attributes.position.needsUpdate = true;
    for (let q = 0; q < K; q++) {
      const ix = lab[q] * 3;
      const on = hl < 0 || skills[q][1] === hl;
      place(tags[q], cur[ix], cur[ix + 1], cur[ix + 2], on ? 1 : 0.18);
      tags[q].classList.toggle("hl", hl >= 0 && on);
    }
    place(hubTag, 0, 0, 0, 1);
    hubTag.style.visibility = "visible"; hubTag.style.opacity = "1";
    renderer.render(scene, camera);
  }

  size();
  window.addEventListener("resize", () => { size(); if (reduce) frame(10, 1.4); });
  if (reduce) {
    frame(10, 1.4);
    btns.forEach((b) => ["mouseenter", "mouseleave", "click"].forEach((ev) => b.addEventListener(ev, () => setTimeout(() => frame(10, 1.4), 30))));
    return;
  }
  window.addEventListener("pointermove", (e) => {
    mx = e.clientX / window.innerWidth - 0.5;
    my = e.clientY / window.innerHeight - 0.5;
  });
  new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(wrap);
  const loop = () => {
    requestAnimationFrame(loop);
    if (!visible) return;
    const now = clock();
    frame(now, now + 1.2);
  };
  loop();
}
