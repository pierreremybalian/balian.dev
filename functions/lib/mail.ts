// Outgoing mail: one branded HTML layout for everything the site sends, with a plain-text part, through Resend.
export interface MailEnv { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Site tokens (src/styles/global.css), inlined because mail clients ignore stylesheets.
const C = { bg: "#090b10", surface: "#10131a", line: "#232834", ink: "#e8ebf2", soft: "#b7bfce", mut: "#8e97a8", sig: "#ff2e93" };
const F = { display: "'Sora', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", sans: "'Instrument Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", mono: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace" };
const body = `margin:0 0 16px;font-family:${F.sans};font-size:16px;line-height:1.6;color:${C.soft}`;

/** Inline markup: **bold**, [text](url) and bare https links. Input is escaped first. */
function inline(text: string): string {
  let s = esc(text);
  s = s.replace(/\*\*([^*]+)\*\*/g, `<strong style="color:${C.ink};font-weight:600">$1</strong>`);
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, `<a href="$2" style="color:${C.sig};text-decoration:underline">$1</a>`);
  s = s.replace(/(^|[\s(])((https?:\/\/)[^\s<)]*[^\s<).,;:!?])/g, (_, pre, url) => `${pre}<a href="${url}" style="color:${C.sig};text-decoration:underline;word-break:break-all">${url}</a>`);
  return s;
}

/** Plain text (the way the templates are written) or a Markdown subset, to email HTML. */
export function textToHtml(text: string): string {
  const lines = text.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const hm = line.match(/^(#{1,3})\s+(.*)$/);
    if (hm) { const size = [24, 20, 17][hm[1].length - 1]; out.push(`<h${hm[1].length + 1} style="margin:28px 0 12px;font-family:${F.display};font-size:${size}px;line-height:1.2;color:${C.ink};letter-spacing:-0.03em;font-weight:700">${inline(hm[2])}</h${hm[1].length + 1}>`); i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(`<li style="margin:0 0 8px">${inline(lines[i].replace(/^\s*[-*]\s+/, "")) || "&nbsp;"}</li>`); i++; }
      out.push(`<ul style="${body};padding-left:22px">${items.join("")}</ul>`); continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(`<li style="margin:0 0 8px">${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`); i++; }
      out.push(`<ol style="${body};padding-left:22px">${items.join("")}</ol>`); continue;
    }
    if (/^\|/.test(line) && /^\|/.test(lines[i + 1] ?? "")) {
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      const tr = rows.filter((r, k) => !(k === 1 && r.every((c) => /^:?-+:?$/.test(c)))).map((r, k) => `<tr>${r.map((c) => `<${k === 0 ? "th" : "td"} style="text-align:left;padding:10px 12px;border-bottom:1px solid ${C.line};${k === 0 ? `font-family:${F.mono};font-weight:500;color:${C.mut};font-size:11px;letter-spacing:.1em;text-transform:uppercase` : `font-family:${F.sans};font-size:15px;color:${C.ink}`}">${inline(c)}</${k === 0 ? "th" : "td"}>`).join("")}</tr>`).join("");
      out.push(`<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">${tr}</table>`); continue;
    }
    if (/^-{3,}$/.test(line.trim())) { out.push(`<hr style="border:0;border-top:1px solid ${C.line};margin:24px 0">`); i++; continue; }
    const btn = line.trim().match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    if (btn) {
      out.push(`<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px"><tr><td style="background:${C.sig};border-radius:3px"><a href="${esc(btn[2])}" style="display:inline-block;padding:13px 22px;font-family:${F.sans};font-size:15px;font-weight:600;color:#0a0c18;text-decoration:none">${esc(btn[1])}&nbsp;&rarr;</a></td></tr></table>`);
      i++; continue;
    }
    // paragraph: consecutive non-blank lines; single line breaks are kept (signatures, addresses)
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|\s*[-*]\s|\s*\d+\.\s|\||-{3,}$)/.test(lines[i]) && !/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/.test(lines[i].trim())) { para.push(inline(lines[i].trim())); i++; }
    out.push(`<p style="${body}">${para.join("<br>")}</p>`);
  }
  return out.join("\n");
}

/** The branded shell: the site's dark theme, inline styles, table layout. Web fonts load where the client allows (Apple Mail, iOS), with clean fallbacks elsewhere. */
export function layout(opts: { title?: string; bodyHtml: string; preheader?: string; footnote?: string }): string {
  const pre = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(opts.preheader)}</div>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(opts.title ?? "Balian.dev")}</title>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@700;800&family=Instrument+Sans:wght@400;600&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
<style>:root{color-scheme:dark;supported-color-schemes:dark}body{background:${C.bg}}a{color:${C.sig}}</style></head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${F.sans}">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg}" bgcolor="${C.bg}"><tr><td align="center" style="padding:36px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 4px 18px">
  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${C.sig};vertical-align:middle;margin-right:9px"></span><span style="font-family:${F.display};font-size:19px;font-weight:800;letter-spacing:-0.03em;color:${C.ink};vertical-align:middle">Balian<span style="color:${C.sig}">.dev</span></span>
</td></tr>
<tr><td style="background:${C.surface};border:1px solid ${C.line};border-top:2px solid ${C.sig};padding:32px 32px 20px" bgcolor="${C.surface}">
${opts.title ? `<h1 style="margin:0 0 20px;font-family:${F.display};font-size:26px;line-height:1.15;letter-spacing:-0.04em;font-weight:800;color:${C.ink}">${esc(opts.title)}</h1>` : ""}
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:18px 4px 0;font-family:${F.mono};font-size:11px;line-height:1.7;letter-spacing:.04em;color:${C.mut}">
Pierre Balian · Minneapolis, MN · <a href="mailto:pierre@baliandesign.com" style="color:${C.mut}">pierre@baliandesign.com</a> · <a href="https://balian.dev" style="color:${C.mut}">balian.dev</a>${opts.footnote ? `<br>${esc(opts.footnote)}` : ""}
</td></tr>
</table></td></tr></table></body></html>`;
}

export interface Mail { to: string | string[]; subject: string; text: string; html?: string; title?: string; preheader?: string; replyTo?: string; bcc?: string | string[] }

/** Send through Resend. When `html` is omitted the text is rendered through the layout. */
export async function sendMail(env: MailEnv, m: Mail): Promise<{ ok: boolean; id?: string; error?: string }> {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM) return { ok: false, error: "Mail is not configured." };
  const html = m.html ?? layout({ title: m.title, bodyHtml: textToHtml(m.text), preheader: m.preheader });
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.CONTACT_FROM, to: ([] as string[]).concat(m.to), ...(m.bcc ? { bcc: ([] as string[]).concat(m.bcc) } : {}), ...(m.replyTo ? { reply_to: m.replyTo } : {}), subject: m.subject, text: m.text, html }),
  });
  const j = (await r.json().catch(() => ({}))) as { id?: string; message?: string };
  return r.ok ? { ok: true, id: j.id } : { ok: false, error: j.message ?? String(r.status) };
}
