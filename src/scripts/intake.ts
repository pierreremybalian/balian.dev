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
  form.addEventListener("change", save);

  function show(n: number, focus = true) {
    i = n;
    steps.forEach((s, k) => { s.hidden = k !== n; });
    back.hidden = n === 0;
    next.hidden = n === steps.length - 1;
    send.hidden = n !== steps.length - 1;
    bar.style.width = `${((n + 1) / steps.length) * 100}%`;
    where.textContent = `Step ${n + 1} of ${steps.length}`;
    status.textContent = "";
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
      const ok = f.checkValidity() && f.value.trim() !== "";
      f.setAttribute("aria-invalid", String(!ok));
      if (!ok && !first) first = f;
    });
    step.querySelectorAll<HTMLFieldSetElement>(".choices[data-required]").forEach((g) => {
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

  back.addEventListener("click", () => show(i - 1));
  next.addEventListener("click", () => { if (valid(i)) show(i + 1); });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    for (let n = 0; n < steps.length; n++) if (!valid(n)) { show(n); return; }
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

  show(i, false);
}
