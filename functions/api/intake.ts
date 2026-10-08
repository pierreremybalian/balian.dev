// Cloudflare Pages Function: POST /api/intake  { answers: { [questionId]: string | string[] }, fax?: honeypot }
// Formats the questionnaire in step order and emails it to Pierre through Resend, with a copy to the person who filled it in.
import { intakeSteps, matches } from "../../src/data/intake";

interface Env {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const clean = (v: unknown, max: number) => ([] as unknown[]).concat(v ?? []).map((x) => String(x ?? "").trim().slice(0, max)).filter(Boolean);

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  let body: { answers?: Record<string, unknown>; fax?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return json({ error: "That request could not be read." }, 400);
  }
  if (clean(body.fax, 50).length) return json({ ok: true });
  const a = body.answers ?? {};
  const name = clean(a.name, 120)[0] ?? "";
  const email = clean(a.email, 200)[0] ?? "";
  const company = clean(a.company, 120)[0] ?? "";
  if (!name || !company || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return json({ error: "Please add your name, company and a valid email on the first step." }, 422);
  }
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: "The questionnaire is not connected yet. Please email me your answers instead." }, 503);
  }

  // Plain text, in the order the questions were asked. Unanswered questions are listed so the gaps are visible.
  const lines: string[] = [`Project questionnaire from ${name} (${company})`, `Email: ${email}`, ""];
  let answered = 0, total = 0;
  for (const step of intakeSteps) {
    if (!step.questions.some((q) => matches(a, q.showIf))) continue;
    lines.push(`== ${step.title.toUpperCase()} ==`, "");
    for (const q of step.questions) {
      if (!matches(a, q.showIf)) continue;
      total++;
      const vals = clean(a[q.id], 4000);
      if (vals.length) answered++;
      lines.push(`${q.label}`, vals.length ? vals.map((v) => `  ${v.replace(/\n/g, "\n  ")}`).join("\n") : "  (not answered)", "");
    }
  }
  lines.push(`${answered} of ${total} answered.`);
  const text = lines.join("\n");

  const send = (to: string, subject: string, body: string, replyTo?: string) =>
    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ from: env.CONTACT_FROM, to: [to], ...(replyTo ? { reply_to: replyTo } : {}), subject, text }),
    });

  const r = await send(env.CONTACT_TO, `Questionnaire: ${company}, ${name} (${answered}/${total})`, text, `${name} <${email}>`);
  if (!r.ok) return json({ error: "That did not send. Your answers are still here. Please try again." }, 502);
  // The copy to the client is a courtesy; its failure does not fail the submission.
  await send(email, `Your answers for Balian.dev: ${company}`, `Thanks, ${name}. Here is a copy of what you sent me. I will read it properly and come back with questions and a time to talk.\n\n${text}`).catch(() => {});
  return json({ ok: true });
};
