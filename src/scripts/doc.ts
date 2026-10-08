// Public document page (/d/?t=token): renders the Markdown and handles acceptance.
import { renderMarkdown } from "../lib/md";

export function initDoc() {
  const title = document.getElementById("doc-title"), meta = document.getElementById("doc-meta"), body = document.getElementById("doc-body");
  const form = document.getElementById("doc-accept") as HTMLFormElement | null, status = document.getElementById("accept-status"), done = document.getElementById("doc-done");
  if (!title || !meta || !body || !form || !status || !done) return;
  const token = new URLSearchParams(location.search).get("t") ?? "";
  const fmt = (iso: string) => new Intl.DateTimeFormat(undefined, { dateStyle: "long", timeStyle: "short" }).format(new Date(iso));
  (async () => {
    const r = await fetch("/api/doc/" + encodeURIComponent(token)).catch(() => null);
    const d = r ? ((await r.json().catch(() => ({}))) as { title?: string; body_md?: string; status?: string; accepted_at?: string; accepted_name?: string; error?: string }) : null;
    if (!r || !r.ok || !d?.body_md) { title.textContent = "That document is not available."; meta.textContent = "The link may be wrong, or the document has not been sent yet."; return; }
    title.textContent = d.title ?? "Document";
    document.title = `${d.title} · Balian.dev`;
    renderMarkdown(d.body_md.replace(/^#\s+[^\n]*\n+/, ""), body);
    if (d.status === "accepted") {
      meta.textContent = `Accepted by ${d.accepted_name} on ${fmt(d.accepted_at!)}.`;
      done.hidden = false; done.textContent = `This document was accepted by ${d.accepted_name} on ${fmt(d.accepted_at!)}. A copy was emailed to both parties.`;
    } else {
      meta.textContent = "Read it through, then accept at the bottom if it is right. Questions go to pierre@baliandesign.com.";
      form.hidden = false;
    }
  })();
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (form.querySelector("#accept-name") as HTMLInputElement).value.trim();
    if (name.length < 2) { status.textContent = "Please type your full name."; return; }
    const btn = form.querySelector("button") as HTMLButtonElement; btn.disabled = true; status.textContent = "Recording...";
    try {
      const r = await fetch(`/api/doc/${encodeURIComponent(token)}/accept`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ name }) });
      const d = (await r.json().catch(() => ({}))) as { ok?: boolean; accepted_at?: string; error?: string };
      if (r.ok && d.ok) { form.hidden = true; done.hidden = false; done.textContent = `Accepted. Thank you, ${name}. A copy with the acceptance record is on its way to your email.`; done.focus(); meta.textContent = `Accepted by ${name} on ${fmt(d.accepted_at!)}.`; }
      else status.textContent = d.error || "That did not go through. Please try again.";
    } catch { status.textContent = "That did not go through. Please try again."; }
    finally { btn.disabled = false; }
  });
}
