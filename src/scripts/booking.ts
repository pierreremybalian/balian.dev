// Contact page booking: loads open slots from /api/slots, lets the visitor pick one in their own time zone,
// and posts the booking to /api/book. Everything here degrades to the empty-state text if anything fails.
interface Slot { start: string; end: string }

export function initBooking() {
  const root = document.getElementById("book");
  const days = document.getElementById("book-days");
  const slotsBox = document.getElementById("book-slots");
  const empty = document.getElementById("book-empty");
  const form = document.getElementById("book-form") as HTMLFormElement | null;
  const chosen = document.getElementById("book-chosen");
  const status = document.getElementById("book-status");
  const done = document.getElementById("book-done");
  const change = document.getElementById("book-change");
  const note = document.getElementById("book-note");
  if (!root || !days || !slotsBox || !empty || !form || !chosen || !status || !done) return;

  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let hostTz = "America/Chicago";
  let slots: Slot[] = [];
  let picked: Slot | null = null;

  const fmtDayKey = (d: Date) => {
    const p = new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d);
    return p.filter((x) => x.type !== "literal").map((x) => x.value).join("-");
  };
  const fmtDay = new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" });
  const fmtDayLong = new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric" });
  const fmtTime = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const fmtHost = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: hostTz });
  const tzName = (tz: string) => new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date()).find((p) => p.type === "timeZoneName")?.value ?? tz;

  function showEmpty() {
    days.replaceChildren();
    slotsBox.replaceChildren();
    empty.hidden = false;
  }

  function renderDay(key: string) {
    slotsBox.replaceChildren();
    for (const s of slots) {
      const d = new Date(s.start);
      if (fmtDayKey(d) !== key) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "slot";
      b.setAttribute("aria-pressed", String(picked?.start === s.start));
      b.innerHTML = `<span>${fmtTime.format(d)}</span>` + (localTz !== hostTz ? `<small>${fmtHost.format(d)} ${tzName(hostTz)}</small>` : "");
      b.addEventListener("click", () => pick(s));
      slotsBox.appendChild(b);
    }
  }

  function renderDays() {
    const keys: string[] = [];
    for (const s of slots) { const k = fmtDayKey(new Date(s.start)); if (!keys.includes(k)) keys.push(k); }
    if (!keys.length) return showEmpty();
    empty.hidden = true;
    days.replaceChildren();
    keys.forEach((k) => {
      const first = slots.find((s) => fmtDayKey(new Date(s.start)) === k)!;
      const b = document.createElement("button");
      b.type = "button";
      b.className = "day";
      b.textContent = fmtDay.format(new Date(first.start));
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => {
        days.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
        b.setAttribute("aria-pressed", "true");
        renderDay(k);
      });
      days.appendChild(b);
    });
    // times stay hidden until a day is picked
    slotsBox.replaceChildren();
    const hint = document.createElement("span");
    hint.className = "note";
    hint.textContent = "Pick a day to see the open times.";
    slotsBox.appendChild(hint);
  }

  function pick(s: Slot) {
    picked = s;
    slotsBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    const d = new Date(s.start);
    chosen.textContent = `${fmtDayLong.format(d)}, ${fmtTime.format(d)} ${tzName(localTz)}` + (localTz !== hostTz ? ` (${fmtHost.format(d)} ${tzName(hostTz)})` : "");
    form.hidden = false;
    status.textContent = "";
    (form.querySelector("#book-name") as HTMLInputElement | null)?.focus();
    renderDay(fmtDayKey(d));
  }

  async function load() {
    try {
      const r = await fetch("/api/slots", { headers: { Accept: "application/json" } });
      const data = (await r.json()) as { tz?: string; slots?: Slot[]; error?: string };
      if (!r.ok || !data.slots) return showEmpty();
      hostTz = data.tz || hostTz;
      slots = data.slots;
      if (note && localTz !== hostTz) note.textContent = `Times are shown in your time zone (${tzName(localTz)}), with mine (${tzName(hostTz)}) beside them. Calls are on Google Meet.`;
      renderDays();
    } catch {
      showEmpty();
    }
  }

  change?.addEventListener("click", (e) => {
    e.preventDefault();
    picked = null;
    form.hidden = true;
    slotsBox.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", "false"));
    (slotsBox.querySelector("button") as HTMLButtonElement | null)?.focus();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!picked) return;
    const fields = Array.from(form.querySelectorAll<HTMLInputElement>("[required]"));
    fields.forEach((f) => f.removeAttribute("aria-invalid"));
    const bad = fields.filter((f) => !f.checkValidity());
    if (bad.length) {
      bad.forEach((f) => f.setAttribute("aria-invalid", "true"));
      status.textContent = "Please fix the highlighted field" + (bad.length > 1 ? "s" : "") + ".";
      bad[0].focus();
      return;
    }
    const fd = new FormData(form);
    const btn = form.querySelector("button[type=submit]") as HTMLButtonElement | null;
    if (btn) btn.disabled = true;
    status.textContent = "Booking...";
    try {
      const r = await fetch("/api/book", {
        method: "POST",
        headers: { "content-type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ start: picked.start, name: fd.get("name"), email: fd.get("email"), note: fd.get("note"), website: fd.get("website") }),
      });
      const data = (await r.json().catch(() => ({}))) as { ok?: boolean; meet?: string | null; error?: string };
      if (r.ok && data.ok) {
        const d = new Date(picked.start);
        form.hidden = true;
        days.hidden = true;
        slotsBox.hidden = true;
        done.hidden = false;
        done.innerHTML = `<b>Booked.</b> ${fmtDayLong.format(d)} at ${fmtTime.format(d)} ${tzName(localTz)}. The invite with the Google Meet link is on its way to ${String(fd.get("email"))}.`;
        done.focus();
      } else if (r.status === 409) {
        status.textContent = data.error || "That time was just taken. Please pick another.";
        picked = null;
        form.hidden = true;
        await load();
      } else {
        status.textContent = data.error || "That did not go through. Please try again, or email me.";
      }
    } catch {
      status.textContent = "That did not go through. Please try again, or email me.";
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  load();
}
