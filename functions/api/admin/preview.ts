// POST /api/admin/preview { subject, body }: the branded HTML the recipient would see, for the admin's preview pane.
import { json } from "../../lib/session";
import { layout, textToHtml } from "../../lib/mail";

export const onRequestPost = async ({ request }: { request: Request }) => {
  const b = (await request.json().catch(() => ({}))) as { subject?: string; body?: string; title?: string };
  return json({ html: layout({ title: b.title, bodyHtml: textToHtml(String(b.body ?? "")), preheader: b.subject }) });
};
