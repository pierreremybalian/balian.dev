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

/* soft reveals: content is visible by default, this only eases it in */
const rv = Array.from(document.querySelectorAll<HTMLElement>(".rv"));
if (rv.length && "IntersectionObserver" in window && !reduce) {
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

/* rail "on this page" index: the current page's h2s, listed under its nav item, with the one in view marked */
const rail = document.querySelector<HTMLElement>(".rnav");
const current = rail?.querySelector<HTMLAnchorElement>('a[aria-current="page"]');
const heads = Array.from(document.querySelectorAll<HTMLElement>("main h2")).filter(
  (h) => !h.closest(".sr-only, .cta-band, .close, #faq") && h.textContent!.trim() && h.textContent!.trim() !== "Related"
);
// a section's short label ("Services", "Process") reads better in the rail than a full headline
const labelFor = (h: HTMLElement) => h.closest("section")?.querySelector<HTMLElement>(":scope > .in > .label, :scope > .label")?.textContent?.trim() || h.textContent!.trim();
const idxLinks: HTMLAnchorElement[] = [];
if (rail && current && heads.length > 1) {
  const idx = document.createElement("div");
  idx.className = "idx";
  idx.setAttribute("aria-label", "On this page");
  heads.slice(0, 9).forEach((h, i) => {
    if (!h.id) h.id = "s-" + (h.textContent!.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || String(i));
    const a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = labelFor(h);
    idx.appendChild(a);
    idxLinks.push(a);
  });
  current.insertAdjacentElement("afterend", idx);
}

/* active section + timeline fill, on scroll */
const tl = document.getElementById("tl");
const tlFill = document.getElementById("tlfill");
const steps = Array.from(document.querySelectorAll<HTMLElement>(".st"));
let ticking = false;
function update() {
  ticking = false;
  if (idxLinks.length) {
    const line = window.innerHeight * 0.3;
    let active = -1;
    heads.slice(0, idxLinks.length).forEach((h, i) => { if (h.getBoundingClientRect().top <= line) active = i; });
    // past the last section (CTA, footer) keeps the last one marked
    idxLinks.forEach((a, i) => a.classList.toggle("on", i === active));
  }
  if (tl && tlFill && tl.offsetHeight) { // hidden inside an inactive tab: leave it alone
    const r = tl.getBoundingClientRect();
    const mark = window.innerHeight * 0.62;
    const p = Math.max(0, Math.min(1, (mark - r.top) / r.height));
    const still = reduce;
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
