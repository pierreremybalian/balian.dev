// Multi-step questionnaire: one fieldset per step, answers saved to localStorage as you go, posted to /api/intake at the end.
const KEY = "intake-draft";

export function initIntake() {
  const form = document.getElementById("intake") as HTMLFormElement | null;
  const steps = Array.from(document.querySelectorAll<HTMLFieldSetElement>("#intake .step"));
  const back = document.getElementById("intake-back") as HTMLButtonElement | null;
  const next = document.getElementById("intake-next") as HTMLButtonElement | null;
  const send = document.getElementById("intake-send") as HTMLButtonElement | null;
  const bar = document.getElementById("intake-bar");
  const where = document.getElementById("intake-where");
  const status = document.getElementById("intake-status");
  const done = document.getElementById("intake-done");
  if (!form || !steps.length || !back || !next || !send || !bar || !where || !status || !done) return;

  let i = 0;
  /* conditional questions: hidden (and disabled, so they neither validate nor post) unless their condition holds */
  const conds = Array.from(form.querySelectorAll<HTMLElement>("[data-showif]"));
  const answered = (q: string): string[] => Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${q}"]`))
    .filter((el) => !(el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) || el.checked)
    .map((el) => el.value).filter(Boolean);
  function applyConds() {
    for (const el of conds) {
      const c = JSON.parse(el.dataset.showif!) as { q: string; any: string[] };
      const on = c.any.some((x) => answered(c.q).includes(x));
      el.hidden = !on;
      el.querySelectorAll<HTMLInputElement>("input, select, textarea").forEach((f) => { f.disabled = !on; });
    }
  }
  const stepHasQuestions = (n: number) => Array.from(steps[n].querySelectorAll<HTMLElement>(".field")).some((f) => !f.hidden);
  // ?step=3 opens that step directly and ?all=1 shows every step at once, so the questionnaire can be reviewed without filling it in.
  const qs = new URLSearchParams(location.search);
  const showAll = qs.get("all") === "1";
  const fromUrl = Number(qs.get("step"));

  /* draft: restore, then save on every change */
  const read = (): Record<string, string | string[]> => {
    const out: Record<string, string | string[]> = {};
    new FormData(form).forEach((v, k) => {
      if (k === "fax") return;
      const s = String(v);
      if (k in out) out[k] = ([] as string[]).concat(out[k], s);
      else out[k] = s;
    });
    return out;
  };
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify({ i, a: read() })); } catch { /* storage unavailable */ } };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const { i: savedStep, a } = JSON.parse(raw) as { i: number; a: Record<string, string | string[]> };
      for (const [k, v] of Object.entries(a)) {
        const els = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${k}"]`);
        els.forEach((el) => {
          if (el instanceof HTMLInputElement && (el.type === "checkbox" || el.type === "radio")) el.checked = ([] as string[]).concat(v).includes(el.value);
          else el.value = String(v);
        });
      }
      if (Number.isInteger(savedStep) && savedStep > 0 && savedStep < steps.length) i = savedStep;
    }
  } catch { /* ignore a bad draft */ }
  form.addEventListener("input", save);
  form.addEventListener("change", () => { applyConds(); save(); });
  applyConds();
  if (Number.isInteger(fromUrl) && fromUrl >= 1 && fromUrl <= steps.length) i = fromUrl - 1;

  function show(n: number, focus = true) {
    i = n;
    if (showAll) {
      steps.forEach((s) => { s.hidden = false; });
      back.hidden = true; next.hidden = true; send.hidden = false;
      bar.style.width = "100%";
      where.textContent = `All ${steps.length} steps`;
      return;
    }
    steps.forEach((s, k) => { s.hidden = k !== n; });
    back.hidden = n === 0;
    next.hidden = n === steps.length - 1;
    send.hidden = n !== steps.length - 1;
    bar.style.width = `${((n + 1) / steps.length) * 100}%`;
    where.textContent = `Step ${n + 1} of ${steps.length}`;
    status.textContent = "";
    try { history.replaceState(null, "", n === 0 ? location.pathname : `?step=${n + 1}`); } catch { /* ignore */ }
    save();
    if (focus) {
      const h = steps[n].querySelector<HTMLElement>("h2");
      if (h) { h.tabIndex = -1; h.focus(); }
      window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 24, behavior: "smooth" });
    }
  }

  function valid(n: number): boolean {
    const step = steps[n];
    let first: HTMLElement | null = null;
    step.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>("[required]").forEach((f) => {
      if (f.disabled) return;
      const ok = f.checkValidity() && f.value.trim() !== "";
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !first) first = f;
    });
    step.querySelectorAll<HTMLFieldSetElement>(".choices[data-required]").forEach((g) => {
      if (g.hidden) return;
      const ok = g.querySelector("input:checked") !== null;
      g.classList.toggle("bad", !ok);
      if (!ok && !first) first = g.querySelector("input");
    });
    if (first) {
      status.textContent = "A required answer is missing on this step.";
      (first as HTMLElement).focus();
      return false;
    }
    return true;
  }

  const nearest = (from: number, dir: 1 | -1) => { let n = from + dir; while (n > 0 && n < steps.length - 1 && !stepHasQuestions(n)) n += dir; return Math.max(0, Math.min(steps.length - 1, n)); };
  back.addEventListener("click", () => show(nearest(i, -1)));
  next.addEventListener("click", () => { if (valid(i)) show(nearest(i, 1)); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    for (let n = 0; n < steps.length; n++) if (stepHasQuestions(n) && !valid(n)) { show(n); return; }
    send.disabled = true;
    status.textContent = "Sending...";
    try {
      const r = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ answers: read(), fax: (form.querySelector('[name="fax"]') as HTMLInputElement | null)?.value ?? "" }),
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (r.ok && data.ok) {
        try { localStorage.removeItem(KEY); } catch { /* ignore */ }
        form.hidden = true;
        done.hidden = false;
        done.innerHTML = "<b>Sent.</b> Thank you. I will read it properly, do some digging, and come back to you with questions and a time to talk. A copy is on its way to your email.";
        done.focus();
      } else {
        status.textContent = data.error || "That did not send. Your answers are still here. Please try again.";
      }
    } catch {
      status.textContent = "That did not send. Your answers are still here. Please try again.";
    } finally {
      send.disabled = false;
    }
  });

  /* pre-scan: fill what the site already tells us, and show it at the top */
  const report = document.getElementById("intake-report");
  const rows = document.getElementById("intake-report-rows");
  const reportH = document.getElementById("intake-report-h");
  const site = form.querySelector<HTMLInputElement>('[name="website"]');
  const setIfEmpty = (name: string, value: string) => {
    const el = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${name}"]`);
    if (el && !el.value.trim()) { el.value = value; el.dispatchEvent(new Event("input", { bubbles: true })); }
  };
  let scanned = "";
  async function scan(raw: string) {
    const v = raw.trim();
    if (!v || v === scanned || !report || !rows) return;
    scanned = v;
    try {
      const r = await fetch("/api/prescan?url=" + encodeURIComponent(v));
      const d = (await r.json()) as Record<string, unknown> & { error?: string; summary?: string[] };
      if (!r.ok || d.error) return;
      const host = (() => { try { return new URL(String(d.finalUrl || d.url)).hostname; } catch { return v; } })();
      if (reportH) reportH.textContent = `${host} at a glance`;
      const arr = (k: string) => (Array.isArray(d[k]) ? (d[k] as string[]) : []);
      const sec = d.securityHeaders as Record<string, boolean> | undefined;
      const missing = sec ? Object.entries(sec).filter(([, ok]) => !ok).map(([k]) => k) : [];
      const items: [string, string][] = [
        ["Domain", [d.registrar && `registrar ${d.registrar}`, d.registered && `registered ${d.registered}`, d.expires && `expires ${d.expires}`].filter(Boolean).join(", ") || "no registry record found"],
        ["Nameservers", `${d.dnsProvider || "unknown provider"}${arr("nameservers").length ? ` (${arr("nameservers").join(", ")})` : ""}`],
        ["Email", `${d.mailProvider || "no mail records"}. SPF ${d.spf ? "present" : "missing"}, DMARC ${d.dmarc ? "present" : "missing"}`],
        ["Platform", arr("platform").length ? `${arr("platform").join(", ")}${d.theme ? `, theme "${d.theme}"` : ""}${arr("builders").length ? `, built with ${arr("builders").join(", ")}` : ""}` : "not recognised"],
        ["Cloudflare", d.cloudflare ? "yes" : "no"],
        ["Web server", [...arr("hosting"), d.server && `server "${d.server}"`].filter(Boolean).join("; ") || "no identifying headers"],
        ["Integrations", arr("trackers").length ? arr("trackers").join(", ") : "no common third-party scripts seen"],
        ["Cookie consent", String(d.cookieBanner || "none detected")],
        ["Security headers", missing.length ? `missing ${missing.join(", ")}` : "all common ones present"],
        ["Pages", `${d.sitemapUrls !== undefined ? `${d.sitemapUrls} in the sitemap` : "no sitemap"}, responded in ${d.ttfbMs} ms`],
      ];
      rows.replaceChildren(...items.flatMap(([k, val]) => { const dt = document.createElement("dt"); dt.textContent = k; const dd = document.createElement("dd"); dd.textContent = val; return [dt, dd]; }));
      report.hidden = false;
      // pre-fill, leaving anything the person already typed alone
      if (arr("platform").length) setIfEmpty("platform", `${arr("platform").join(", ")}${d.theme ? `, theme "${d.theme}"` : ""}${arr("builders").length ? `, ${arr("builders").join(", ")}` : ""} (found automatically; correct me if that is wrong)`);
      const hostBits = [...arr("hosting"), d.server && `server ${d.server}`, d.dnsProvider && `DNS at ${d.dnsProvider}`].filter(Boolean);
      if (hostBits.length) setIfEmpty("hosting", `${hostBits.join(", ")} (found automatically; add who has the logins)`);
      const storeP = arr("platform").filter((p) => /Shopify|WooCommerce|BigCommerce|Magento|PrestaShop|OpenCart/.test(p));
      if (storeP.length) setIfEmpty("store_platform", storeP.join(", "));
      if (arr("trackers").length) setIfEmpty("integrations", `Seen on the site: ${arr("trackers").join(", ")}. Add anything behind the scenes: CRM, ERP, accounting, email, payments.`);
      save();
    } catch { /* the questionnaire works without it */ }
  }
  const fromQuery = qs.get("site");
  if (site) {
    site.addEventListener("change", () => scan(site.value));
    if (fromQuery && !site.value) { site.value = fromQuery; save(); }
    if (site.value) scan(site.value);
  }

  show(i, false);
}
