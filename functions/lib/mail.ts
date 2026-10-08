// Outgoing mail: one branded HTML layout for everything the site sends, with a plain-text part, through Resend.
export interface MailEnv { RESEND_API_KEY?: string; CONTACT_TO?: string; CONTACT_FROM?: string }

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Inline markup: **bold**, [text](url) and bare https links. Input is escaped first. */
function inline(text: string): string {
  let s = esc(text);
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" style="color:#c2185b;text-decoration:underline">$1</a>');
  s = s.replace(/(^|[\s(])((https?:\/\/)[^\s<)]*[^\s<).,;:!?])/g, (_, pre, url) => `${pre}<a href="${url}" style="color:#c2185b;text-decoration:underline">${url}</a>`);
  return s;
}

/** Plain text (the way the templates are written) or a Markdown subset, to email HTML. */
export function textToHtml(text: string): string {
  const lines = text.replace(/\r/g, "").split("\n");
  const out: string[] = [];
  let i = 0;
  const P = (inner: string) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#16150f">${inner}</p>`;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    const hm = line.match(/^(#{1,3})\s+(.*)$/);
    if (hm) { const size = [26, 21, 18][hm[1].length - 1]; out.push(`<h${hm[1].length + 1} style="margin:28px 0 12px;font-size:${size}px;line-height:1.25;color:#16150f;letter-spacing:-0.02em">${inline(hm[2])}</h${hm[1].length + 1}>`); i++; continue; }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) { items.push(`<li style="margin:0 0 8px">${inline(lines[i].replace(/^\s*[-*]\s+/, "")) || "&nbsp;"}</li>`); i++; }
      out.push(`<ul style="margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.6;color:#16150f">${items.join("")}</ul>`); continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) { items.push(`<li style="margin:0 0 8px">${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`); i++; }
      out.push(`<ol style="margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.6;color:#16150f">${items.join("")}</ol>`); continue;
    }
    if (/^\|/.test(line) && /^\|/.test(lines[i + 1] ?? "")) {
      const rows: string[][] = [];
      while (i < lines.length && /^\|/.test(lines[i])) { rows.push(lines[i].split("|").slice(1, -1).map((c) => c.trim())); i++; }
      const tr = rows.filter((r, k) => !(k === 1 && r.every((c) => /^:?-+:?$/.test(c)))).map((r, k) => `<tr>${r.map((c) => `<${k === 0 ? "th" : "td"} style="text-align:left;padding:8px 10px;border-bottom:1px solid #e6e3dc;font-size:15px;${k === 0 ? "font-weight:600;color:#6b6760;font-size:12px;letter-spacing:.06em;text-transform:uppercase" : "color:#16150f"}">${inline(c)}</${k === 0 ? "th" : "td"}>`).join("")}</tr>`).join("");
      out.push(`<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:0 0 16px">${tr}</table>`); continue;
    }
    if (/^-{3,}$/.test(line.trim())) { out.push('<hr style="border:0;border-top:1px solid #e6e3dc;margin:24px 0">'); i++; continue; }
    // paragraph: consecutive non-blank lines; single line breaks are kept (signatures, addresses)
    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|\s*[-*]\s|\s*\d+\.\s|\||-{3,}$)/.test(lines[i])) { para.push(inline(lines[i].trim())); i++; }
    out.push(P(para.join("<br>")));
  }
  return out.join("\n");
}

/** The branded shell. Light, table-based, inline styles, so it survives every mail client. */
export function layout(opts: { title?: string; bodyHtml: string; preheader?: string; footnote?: string }): string {
  const pre = opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(opts.preheader)}</div>` : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(opts.title ?? "Balian.dev")}</title></head>
<body style="margin:0;padding:0;background:#f4f2ec;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif">
${pre}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f2ec"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px">
<tr><td style="padding:0 4px 18px">
  <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#ff2e93;vertical-align:middle;margin-right:8px"></span><span style="font-size:18px;font-weight:800;letter-spacing:-0.02em;color:#16150f;vertical-align:middle">Balian<span style="color:#ff2e93">.dev</span></span>
</td></tr>
<tr><td style="background:#ffffff;border:1px solid #e6e3dc;border-top:3px solid #ff2e93;padding:32px 32px 24px">
${opts.title ? `<h1 style="margin:0 0 20px;font-size:24px;line-height:1.2;letter-spacing:-0.02em;color:#16150f">${esc(opts.title)}</h1>` : ""}
${opts.bodyHtml}
</td></tr>
<tr><td style="padding:18px 4px 0;font-size:12px;line-height:1.6;color:#8a8680">
Pierre Balian · Balian.dev · Minneapolis, MN · <a href="mailto:pierre@baliandesign.com" style="color:#8a8680">pierre@baliandesign.com</a> · <a href="https://balian.dev" style="color:#8a8680">balian.dev</a>${opts.footnote ? `<br>${esc(opts.footnote)}` : ""}
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
