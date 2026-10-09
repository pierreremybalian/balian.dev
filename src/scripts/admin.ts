// Admin pages. Everything is fetched from /api/admin/* and built with DOM nodes, so data never becomes markup.
import { renderMarkdown } from "../lib/md";

type Attrs = Record<string, string | boolean | ((e: Event) => void)>;
type Child = Node | string | null | undefined | false;
const h = (tag: string, attrs: Attrs = {}, ...children: Child[]): HTMLElement => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (typeof v === "function") el.addEventListener(k.slice(2), v);
    else if (v === true) el.setAttribute(k, "");
    else if (v !== false) el.setAttribute(k, v);
  }
  for (const c of children) if (c !== null && c !== undefined && c !== false) el.append(c instanceof Node ? c : String(c));
  return el;
};
const status = () => document.getElementById("admin-status");
const say = (t: string) => { const s = status(); if (s) s.textContent = t; };
const api = async <T = unknown>(path: string, init: RequestInit = {}): Promise<T> => {
  const r = await fetch(path, { ...init, headers: { "content-type": "application/json", "x-requested-with": "admin", ...(init.headers || {}) } });
  if (r.status === 401) { location.href = "/admin/login/"; throw new Error("signed out"); }
  const d = (await r.json().catch(() => ({}))) as T & { error?: string };
  if (!r.ok) throw new Error(d.error || `Request failed (${r.status})`);
  return d;
};
const when = (iso?: string | null) => (iso ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso)) : "");
const money = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
const pill = (text: string, kind = "") => h("span", { class: "pill " + kind }, text);
/** Render the email exactly as the recipient sees it, inside a sandboxed frame built from our own HTML. */
async function previewInto(box: HTMLElement, subject: string, body: string) {
  const r = await api<{ html: string }>("/api/admin/preview", { method: "POST", body: JSON.stringify({ subject, body }) });
  const frame = h("iframe", { class: "mailframe", title: "Email preview", sandbox: "" }) as HTMLIFrameElement;
  box.replaceChildren(frame);
  frame.srcdoc = r.html;
}

interface Lead { id: string; created_at: string; updated_at: string; name: string; email: string; company: string; phone: string; website: string; kind: string; source: string; stage: string; notes: string; prescan?: Record<string, unknown> | null }
interface Detail { lead: Lead; submissions: { id: string; created_at: string; type: string; summary_text: string; payload_json: string }[]; events: { created_at: string; type: string; detail: string }[]; emails: { created_at: string; to_email: string; subject: string; body: string; template: string }[]; documents: { id: string; type: string; title: string; status: string; token: string; sent_at?: string; viewed_at?: string; accepted_at?: string; accepted_name?: string }[]; invoices: { id: string; number: string; amount_cents: number; due_date?: string; status: string; link: string; notes: string; paid_at?: string }[]; stages: string[]; stageLabel: Record<string, string> }
interface Templates { email: { id: string; name: string; when: string; subject: string; body: string }[]; documents: { id: string; name: string; title: string; fields: { id: string; label: string; help?: string; multiline?: boolean }[]; body: string }[]; placeholders: string[] }

const STAGE_LABEL: Record<string, string> = { new: "New", contacted: "Contacted", call_booked: "Call booked", questionnaire: "Questionnaire in", proposal_sent: "Proposal sent", agreed: "Agreed", in_progress: "In progress", launched: "Launched", care: "On a care plan", lost: "Lost" };
const leadLink = (l: { id: string; name: string; company: string; email: string }) => h("a", { href: `/admin/lead/?id=${l.id}`, class: "lead-link" }, h("b", {}, l.name || l.email), l.company ? h("span", { class: "note" }, " " + l.company) : null);

/* ---------- pages ---------- */
async function pipeline() {
  const box = document.getElementById("pipeline")!;
  const d = await api<{ leads: Lead[]; counts: Record<string, number>; stages: string[] }>("/api/admin/leads");
  box.replaceChildren(...d.stages.map((s) => h("section", { class: "col" },
    h("h2", {}, STAGE_LABEL[s] ?? s, " ", h("span", { class: "count" }, String(d.counts[s] ?? 0))),
    ...d.leads.filter((l) => l.stage === s).map((l) => h("div", { class: "card" }, leadLink(l), h("div", { class: "note" }, `${l.source || ""} · ${when(l.updated_at)}`))),
  )));
  const form = document.getElementById("add-lead") as HTMLFormElement | null;
  form?.addEventListener("submit", async (e) => {
    e.preventDefault(); const fd = new FormData(form);
    try { const r = await api<{ lead: Lead }>("/api/admin/leads", { method: "POST", body: JSON.stringify(Object.fromEntries(fd)) }); location.href = `/admin/lead/?id=${r.lead.id}`; } catch (err) { say((err as Error).message); }
  });
}

async function leads() {
  const box = document.getElementById("leads")!, form = document.getElementById("lead-filter") as HTMLFormElement;
  const sel = form.querySelector("select")!;
  for (const s of Object.keys(STAGE_LABEL)) sel.append(h("option", { value: s }, STAGE_LABEL[s]));
  const load = async () => {
    const fd = new FormData(form); const q = new URLSearchParams(); for (const [k, v] of fd) if (v) q.set(k, String(v));
    const d = await api<{ leads: Lead[] }>("/api/admin/leads?" + q);
    box.replaceChildren(d.leads.length ? h("ul", { class: "rows" }, ...d.leads.map((l) => h("li", {}, leadLink(l), h("span", {}, l.email), pill(STAGE_LABEL[l.stage] ?? l.stage, l.stage === "lost" ? "" : "sig"), h("span", { class: "note" }, when(l.updated_at))))) : h("p", { class: "note" }, "No leads match."));
  };
  form.addEventListener("input", () => { clearTimeout((form as unknown as { t?: number }).t); (form as unknown as { t?: number }).t = window.setTimeout(load, 250); });
  form.addEventListener("submit", (e) => { e.preventDefault(); load(); });
  load();
}

async function submissions() {
  const box = document.getElementById("submissions")!, filter = document.getElementById("sub-filter")!;
  const load = async (type: string) => {
    const d = await api<{ submissions: { id: string; lead_id: string; created_at: string; type: string; summary_text: string; name: string; email: string; company: string }[] }>("/api/admin/submissions?type=" + type);
    const label: Record<string, string> = { contact: "Brief", booking: "Call", intake: "Questionnaire" };
    box.replaceChildren(d.submissions.length ? h("ul", { class: "rows subs" }, ...d.submissions.map((s) => h("li", {},
      h("div", {}, pill(label[s.type] ?? s.type, "sig"), " ", leadLink({ id: s.lead_id, name: s.name, company: s.company, email: s.email }), h("span", { class: "note" }, " " + when(s.created_at))),
      h("details", {}, h("summary", {}, s.summary_text.split("\n")[0].slice(0, 140) || "(no summary)"), h("pre", {}, s.summary_text)),
    ))) : h("p", { class: "note" }, "Nothing yet."));
  };
  filter.addEventListener("click", (e) => { const a = (e.target as HTMLElement).closest("a"); if (!a) return; e.preventDefault(); filter.querySelectorAll("a").forEach((x) => x.removeAttribute("aria-current")); a.setAttribute("aria-current", "true"); load(a.dataset.type ?? ""); });
  load("");
}

async function templates() {
  const box = document.getElementById("templates")!;
  const t = await api<Templates>("/api/admin/templates");
  const sample: Record<string, string> = { name: "Ada Lovelace", first: "Ada", company: "Acme Widgets", website: "https://acme.example", slot: "Thursday, October 15 at 2:00 PM", meet: "https://meet.google.com/abc-defg-hij", doc_link: "https://balian.dev/d/?t=example", doc_title: "Proposal for Acme Widgets", invoice_number: "BD-2026-004", amount: "$9,600.00", due: "November 1, 2026", questionnaire_link: "https://balian.dev/intake/?site=acme.example", date: "October 9, 2026" };
  const f = (s: string) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => sample[k] ?? `{{${k}}}`);
  type Item = { id: string; name: string; group: "email" | "doc"; when?: string; subject?: string; body: string; fields?: string };
  const items: Item[] = [
    ...t.email.map((e): Item => ({ id: "email-" + e.id, name: e.name, group: "email", when: e.when, subject: e.subject, body: e.body })),
    ...t.documents.map((d): Item => ({ id: "doc-" + d.id, name: d.name, group: "doc", when: "Generated from a lead's page; the fields below are asked at that point.", body: d.body, fields: d.fields.map((x) => x.label).join("; ") })),
  ];
  const nav = h("nav", { class: "tnav", "aria-label": "Templates" });
  const pane = h("div", { class: "tpane" });
  const link = (it: Item) => h("a", { href: "#" + it.id, onclick: (e) => { e.preventDefault(); history.replaceState(null, "", "#" + it.id); show(it.id); } }, it.name);
  nav.append(h("span", { class: "label" }, "Emails"), ...items.filter((i) => i.group === "email").map(link), h("span", { class: "label", style: "margin-top:18px" }, "Documents"), ...items.filter((i) => i.group === "doc").map(link));
  async function show(id: string) {
    const it = items.find((i) => i.id === id) ?? items[0];
    nav.querySelectorAll("a").forEach((a) => a.setAttribute("aria-current", a.getAttribute("href") === "#" + it.id ? "page" : "false"));
    const preview = h("div", { class: "previewpane" });
    pane.replaceChildren(...[
      h("h2", {}, it.name), h("p", { class: "note" }, it.when ?? ""),
      it.subject ? h("p", {}, h("span", { class: "label" }, "Subject "), f(it.subject)) : null,
      it.fields ? h("p", {}, h("span", { class: "label" }, "Asks for "), it.fields) : null,
      h("div", { class: "grid2" }, h("div", {}, h("span", { class: "label" }, "Source"), h("pre", {}, it.body)), h("div", {}, h("span", { class: "label" }, it.group === "email" ? "As the recipient sees it" : "Rendered"), preview)),
    ].filter((x): x is HTMLElement => x !== null));
    if (it.group === "email") await previewInto(preview, f(it.subject ?? ""), f(it.body));
    else { const d = h("div", { class: "doc preview" }); preview.replaceChildren(d); renderMarkdown(f(it.body).replace(/_list\}\}/g, "}}"), d); }
  }
  box.replaceChildren(h("div", { class: "tsplit" }, nav, pane));
  show(location.hash.slice(1) || items[0].id);
  window.addEventListener("hashchange", () => show(location.hash.slice(1)));
}

async function lead() {
  const box = document.getElementById("lead")!;
  const id = new URLSearchParams(location.search).get("id") ?? "";
  if (!id) { box.textContent = "No lead id."; return; }
  const [d, t] = await Promise.all([api<Detail>("/api/admin/lead/" + id), api<Templates>("/api/admin/templates")]);
  const L = d.lead;
  document.title = `${L.name || L.email} · Admin · Balian.dev`;
  const reload = () => location.reload();
  const patch = (body: Record<string, string>) => api("/api/admin/lead/" + id, { method: "PATCH", body: JSON.stringify(body) });

  /* header */
  const stageSel = h("select", { onchange: async (e) => { try { await patch({ stage: (e.target as HTMLSelectElement).value }); say("Stage saved."); } catch (err) { say((err as Error).message); } } }) as HTMLSelectElement;
  for (const s of d.stages) stageSel.append(h("option", { value: s, selected: s === L.stage }, d.stageLabel[s]));
  const field = (name: keyof Lead, label: string) => h("label", { class: "inline" }, h("span", { class: "label" }, label), h("input", { value: String(L[name] ?? ""), onchange: async (e) => { try { await patch({ [name]: (e.target as HTMLInputElement).value }); say("Saved."); } catch (err) { say((err as Error).message); } } }));
  const head = h("section", { class: "ahead lead-head" },
    h("div", {}, h("h1", {}, L.name || L.email), h("p", { class: "note" }, `${L.source || "manual"} · first seen ${when(L.created_at)} · updated ${when(L.updated_at)}`)),
    h("div", { class: "stage" }, h("span", { class: "label" }, "Stage"), stageSel),
  );
  const contact = h("section", { class: "grid2" },
    h("div", { class: "fields" }, field("name", "Name"), field("company", "Company"), h("label", { class: "inline" }, h("span", { class: "label" }, "Email"), h("a", { href: "mailto:" + L.email }, L.email)), field("phone", "Phone"), field("website", "Website"), field("kind", "Looking for"),
      L.website ? h("p", {}, h("a", { class: "lnk", href: L.website, target: "_blank", rel: "noopener" }, "Open site"), " ", h("a", { class: "lnk", href: `/intake/?site=${encodeURIComponent(L.website.replace(/^https?:\/\//, ""))}`, target: "_blank" }, "Questionnaire link")) : null),
    h("div", {}, h("span", { class: "label" }, "Notes"), h("textarea", { class: "notes", onchange: async (e) => { try { await patch({ notes: (e.target as HTMLTextAreaElement).value }); say("Notes saved."); } catch (err) { say((err as Error).message); } } }, L.notes)),
  );

  /* pre-scan */
  const scan = L.prescan as { summary?: string[] } | null;
  const prescan = h("section", { class: "report" }, h("span", { class: "label" }, "Pre-scan"), scan?.summary?.length ? h("ul", { class: "plainlist" }, ...scan.summary.map((s) => h("li", {}, s))) : h("p", { class: "note" }, "No scan yet. Add a website and it runs with the next submission."));

  /* email */
  const emailPanel = (() => {
    const sel = h("select", {}, h("option", { value: "" }, "Pick a template")) as HTMLSelectElement;
    for (const e of t.email) sel.append(h("option", { value: e.id }, e.name));
    const subj = h("input", { placeholder: "Subject" }) as HTMLInputElement, body = h("textarea", { class: "mail" }) as HTMLTextAreaElement, to = h("input", { value: L.email }) as HTMLInputElement;
    const vars: Record<string, string> = { name: L.name, first: L.name.split(/\s+/)[0] || "there", company: L.company || L.name, website: L.website || "your site", questionnaire_link: `https://balian.dev/intake/?site=${encodeURIComponent(L.website.replace(/^https?:\/\//, ""))}` };
    const fillT = (s: string, extra: Record<string, string> = {}) => s.replace(/\{\{(\w+)\}\}/g, (_, k) => extra[k] ?? vars[k] ?? `{{${k}}}`);
    const apply = (tplId: string, extra: Record<string, string> = {}) => { const e = t.email.find((x) => x.id === tplId); if (!e) return; sel.value = tplId; subj.value = fillT(e.subject, extra); body.value = fillT(e.body, extra); };
    sel.addEventListener("change", () => apply(sel.value));
    const send = h("button", { class: "btn small", type: "button", onclick: async () => { try { say("Sending..."); await api("/api/admin/email", { method: "POST", body: JSON.stringify({ lead_id: id, template: sel.value, to: to.value, subject: subj.value, body: body.value }) }); say("Sent."); reload(); } catch (err) { say((err as Error).message); } } }, "Send");
    const pane = h("div", { class: "previewpane", hidden: true });
    const preview = h("button", { class: "btn ghost small", type: "button", onclick: async () => { pane.hidden = false; await previewInto(pane, subj.value, body.value); } }, "Preview");
    const el = h("section", { class: "panel" }, h("h2", {}, "Send an email"), h("div", { class: "arow" }, sel, to), subj, body, h("div", { class: "arow" }, send, preview, h("span", { class: "note" }, "Goes out from the site's address with you in reply-to and bcc. **bold**, lists and links render in the branded layout.")), pane);
    return { el, apply };
  })();

  /* documents */
  const docs = h("section", { class: "panel" }, h("h2", {}, "Documents"));
  if (d.documents.length) docs.append(h("ul", { class: "rows" }, ...d.documents.map((doc) => {
    const link = `${location.origin}/d/?t=${doc.token}`;
    const row = h("li", { class: "docrow" }, h("div", {}, h("b", {}, doc.title), " ", pill(doc.status, doc.status === "accepted" ? "ok" : "sig"), h("div", { class: "note" }, [doc.sent_at && `sent ${when(doc.sent_at)}`, doc.viewed_at && `viewed ${when(doc.viewed_at)}`, doc.accepted_at && `accepted by ${doc.accepted_name} ${when(doc.accepted_at)}`].filter(Boolean).join(" · ") || "draft")),
      h("div", { class: "arow" },
        h("a", { class: "lnk", href: link, target: "_blank" }, "Open"),
        doc.status !== "accepted" ? h("button", { class: "btn ghost small", type: "button", onclick: async () => {
          const full = await api<{ document: { title: string; body_md: string } }>("/api/admin/document/" + doc.id);
          const title = h("input", { value: full.document.title }) as HTMLInputElement, body = h("textarea", { class: "md" }, full.document.body_md) as HTMLTextAreaElement, preview = h("div", { class: "doc preview" });
          renderMarkdown(body.value, preview); body.addEventListener("input", () => renderMarkdown(body.value, preview));
          const editor = h("div", { class: "editor" }, title, h("div", { class: "grid2" }, body, preview), h("div", { class: "arow" }, h("button", { class: "btn small", type: "button", onclick: async () => { try { await api("/api/admin/document/" + doc.id, { method: "PATCH", body: JSON.stringify({ title: title.value, body_md: body.value }) }); say("Saved."); } catch (err) { say((err as Error).message); } } }, "Save"), h("button", { class: "btn ghost small", type: "button", onclick: () => editor.remove() }, "Close")));
          row.append(editor);
        } }, "Edit") : null,
        doc.status === "draft" ? h("button", { class: "btn small", type: "button", onclick: async () => { try { await api("/api/admin/document/" + doc.id, { method: "PATCH", body: JSON.stringify({ status: "sent" }) }); emailPanel.apply(doc.type === "agreement" ? "agreement-sent" : "proposal-sent", { doc_link: link, doc_title: doc.title }); say("Marked sent. The email below is filled in; press Send."); emailPanel.el.scrollIntoView({ behavior: "smooth" }); } catch (err) { say((err as Error).message); } } }, "Send") : null,
      ));
    return row;
  })));
  const newDoc = (() => {
    const sel = h("select", {}, h("option", { value: "" }, "New document from...")) as HTMLSelectElement;
    for (const x of t.documents) sel.append(h("option", { value: x.id }, x.name));
    const fields = h("div", { class: "fields" });
    sel.addEventListener("change", () => { fields.replaceChildren(...(t.documents.find((x) => x.id === sel.value)?.fields ?? []).map((f) => h("label", { class: "inline" }, h("span", { class: "label" }, f.label), f.multiline ? h("textarea", { name: f.id, placeholder: f.help ?? "" }) : h("input", { name: f.id, placeholder: f.help ?? "" })))); });
    const create = h("button", { class: "btn small", type: "button", onclick: async () => {
      const vals: Record<string, string> = {}; fields.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[name]").forEach((f) => (vals[f.name] = f.value));
      try { await api("/api/admin/documents", { method: "POST", body: JSON.stringify({ lead_id: id, template: sel.value, fields: vals }) }); reload(); } catch (err) { say((err as Error).message); }
    } }, "Create draft");
    return h("div", { class: "newdoc" }, sel, fields, create);
  })();
  docs.append(newDoc);

  /* invoices */
  const inv = h("section", { class: "panel" }, h("h2", {}, "Invoices"));
  const overdue = (i: Detail["invoices"][number]) => i.status === "sent" && i.due_date && i.due_date < new Date().toISOString().slice(0, 10);
  if (d.invoices.length) inv.append(h("ul", { class: "rows" }, ...d.invoices.map((i) => h("li", {},
    h("div", {}, h("b", {}, i.number), " ", money(i.amount_cents), " ", pill(overdue(i) ? "overdue" : i.status, i.status === "paid" ? "ok" : overdue(i) ? "bad" : "sig"), h("div", { class: "note" }, [i.due_date && `due ${i.due_date}`, i.paid_at && `paid ${when(i.paid_at)}`, i.notes].filter(Boolean).join(" · "))),
    h("div", { class: "arow" }, i.link ? h("a", { class: "lnk", href: i.link, target: "_blank", rel: "noopener" }, "Open") : null,
      ...(["sent", "paid", "void"] as const).filter((s) => s !== i.status && !(i.status === "paid")).map((s) => h("button", { class: "btn ghost small", type: "button", onclick: async () => { try { await api("/api/admin/invoice/" + i.id, { method: "PATCH", body: JSON.stringify({ status: s }) }); reload(); } catch (err) { say((err as Error).message); } } }, `Mark ${s}`)),
      i.status === "sent" ? h("button", { class: "btn ghost small", type: "button", onclick: () => { emailPanel.apply(overdue(i) ? "invoice-reminder" : "invoice-sent", { invoice_number: i.number, amount: money(i.amount_cents), due: i.due_date ?? "" }); emailPanel.el.scrollIntoView({ behavior: "smooth" }); } }, "Email") : null),
  ))));
  const amount = h("input", { placeholder: "Amount, e.g. 7200" }) as HTMLInputElement, due = h("input", { type: "date" }) as HTMLInputElement, link = h("input", { placeholder: "Link to the invoice (optional)" }) as HTMLInputElement, notes = h("input", { placeholder: "Notes, e.g. 40% on acceptance" }) as HTMLInputElement;
  inv.append(h("div", { class: "arow wrap" }, amount, due, link, notes, h("button", { class: "btn small", type: "button", onclick: async () => { try { await api("/api/admin/invoices", { method: "POST", body: JSON.stringify({ lead_id: id, amount: amount.value, due_date: due.value, link: link.value, notes: notes.value }) }); reload(); } catch (err) { say((err as Error).message); } } }, "Add invoice")));

  /* submissions, emails, timeline */
  const subs = h("section", { class: "panel" }, h("h2", {}, "Submissions"), d.submissions.length ? h("div", {}, ...d.submissions.map((s) => h("details", { class: "tpl" }, h("summary", {}, pill(s.type, "sig"), " ", when(s.created_at), " ", h("span", { class: "note" }, s.summary_text.split("\n")[0].slice(0, 120))), h("pre", {}, s.summary_text)))) : h("p", { class: "note" }, "None yet."));
  const mails = h("section", { class: "panel" }, h("h2", {}, "Emails sent"), d.emails.length ? h("div", {}, ...d.emails.map((m) => h("details", { class: "tpl" }, h("summary", {}, when(m.created_at), " ", h("b", {}, m.subject), h("span", { class: "note" }, " to " + m.to_email)), h("pre", {}, m.body)))) : h("p", { class: "note" }, "None yet."));
  const timeline = h("section", { class: "panel" }, h("h2", {}, "Timeline"), h("ul", { class: "timeline" }, ...d.events.map((e) => h("li", {}, h("span", { class: "note" }, when(e.created_at)), " ", pill(e.type), " ", e.detail))));

  box.replaceChildren(head, contact, prescan, emailPanel.el, docs, inv, subs, mails, timeline);
}

export function initAdmin() {
  const page = document.body.dataset.page;
  api<{ login: string }>("/api/admin/me").then((m) => { const w = document.getElementById("admin-who"); if (w) w.textContent = m.login; }).catch(() => {});
  document.getElementById("admin-logout")?.addEventListener("click", async () => { await api("/api/admin/logout", { method: "POST" }); location.href = "/admin/login/"; });
  const run = { pipeline, leads, submissions, templates, lead }[page ?? ""];
  if (run) run().catch((e) => say((e as Error).message));
}
