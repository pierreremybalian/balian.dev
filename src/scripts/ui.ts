// Small, calm UI behaviour: mobile menu, soft reveals, rail progress, timeline fill.
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* mobile menu: toggle, Escape to close, focus returns to the button, page behind is inert while open */
const btn = document.getElementById("menu-btn") as HTMLButtonElement | null;
const panel = document.getElementById("mpanel");
const main = document.getElementById("main");
function setMenu(open: boolean, returnFocus = false) {
  if (!btn || !panel) return;
  panel.classList.toggle("open", open);
  btn.setAttribute("aria-expanded", String(open));
  btn.textContent = open ? "Close" : "Menu";
  if (main) (main as HTMLElement & { inert: boolean }).inert = open;
  if (open) panel.querySelector<HTMLElement>("a")?.focus();
  else if (returnFocus) btn.focus();
}
btn?.addEventListener("click", () => setMenu(!panel?.classList.contains("open")));
panel?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && panel?.classList.contains("open")) setMenu(false, true);
});
window.matchMedia("(min-width: 1001px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

/* viewer-controlled motion pause. Persisted, and honoured by CSS and by the network canvas. */
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const toggles = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-motion-toggle]"));
function setMotion(off: boolean) {
  document.documentElement.dataset.motion = off ? "off" : "on";
  toggles.forEach((t) => t.setAttribute("aria-pressed", String(off)));
  try { localStorage.setItem("motion", off ? "off" : "on"); } catch { /* storage unavailable */ }
}
toggles.forEach((t) => {
  t.setAttribute("aria-pressed", String(document.documentElement.dataset.motion === "off"));
  t.addEventListener("click", () => setMotion(document.documentElement.dataset.motion !== "off"));
});
if (reduceMotion) toggles.forEach((t) => (t.hidden = true));

/* soft reveals: content is visible by default, this only eases it in */
const rv = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
if (rv.length && "IntersectionObserver" in window && !reduce && document.documentElement.dataset.motion !== "off") {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in-view");
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );
  rv.forEach((el) => io.observe(el));
} else {
  rv.forEach((el) => el.classList.add("in-view"));
}

/* rail progress + timeline fill, on scroll */
const fill = document.getElementById("rfill");
const tl = document.getElementById("tl");
const tlFill = document.getElementById("tlfill");
const steps = Array.from(document.querySelectorAll<HTMLElement>(".st"));
let ticking = false;
function update() {
  ticking = false;
  const doc = document.documentElement;
  const max = doc.scrollHeight - window.innerHeight;
  if (fill && max > 0) fill.style.transform = `scaleY(${Math.min(1, window.scrollY / max)})`;
  if (tl && tlFill) {
    const r = tl.getBoundingClientRect();
    const mark = window.innerHeight * 0.62;
    const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    const still = reduce || document.documentElement.dataset.motion === "off";
    tlFill.style.transform = `scaleY(${still ? 1 : p})`;
    steps.forEach((s) => {
      const top = s.getBoundingClientRect().top;
      s.classList.toggle("on", still || top < mark);
    });
  }
}
function onScroll() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
update();
