// Cloudflare Pages Function: POST /api/intake  { answers: { [questionId]: string | string[] }, fax?: honeypot }
// Formats the questionnaire in step order and emails it to Pierre through Resend, with a copy to the person who filled it in.
import { intakeSteps, matches } from "../../src/data/intake";
import { prescan, normalizeUrl } from "../lib/prescan";
import { record, upsertLead, addSubmission, addEvent, type DbEnv } from "../lib/db";
import { sendMail } from "../lib/mail";

interface Env extends DbEnv {
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

  // Pre-scan of their site goes at the head of the email, then the answers in the order the questions were asked.
  const lines: string[] = [`Project questionnaire from ${name} (${company})`, `Email: ${email}`, ""];
  const website = normalizeUrl(clean(a.website, 200)[0] ?? "");
  let scanResult: unknown = null;
  if (website) {
    const scan = await Promise.race([prescan(website), new Promise<null>((r) => setTimeout(() => r(null), 12_000))]);
    scanResult = scan;
    lines.push(`== PRE-SCAN OF ${new URL(website).hostname.toUpperCase()} ==`, "");
    lines.push(...(scan ? scan.summary.map((l) => `  ${l}`) : ["  (scan timed out)"]), "");
  }
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
  await record(env, async (db) => {
    const lead = await upsertLead(db, { email, name, company, website: website ?? "", phone: clean(a.phone, 40)[0] ?? "", source: "intake", stage: "questionnaire", prescan_json: scanResult ? JSON.stringify(scanResult) : undefined });
    await addSubmission(db, lead.id, "intake", { answers: a, prescan: scanResult }, text);
    await addEvent(db, lead.id, "submission", `Completed the questionnaire (${answered} of ${total})`);
  });

  // Section headings become Markdown headings in the branded layout; the plain-text part keeps the == MARKERS ==.
  const md = text.replace(/^== (.+) ==$/gm, (_, h: string) => `## ${h[0] + h.slice(1).toLowerCase()}`);
  const r = await sendMail(env, { to: env.CONTACT_TO, replyTo: `${name} <${email}>`, subject: `Questionnaire: ${company}, ${name} (${answered}/${total})`, title: `Questionnaire from ${name}, ${company}`, text: md });
  if (!r.ok) return json({ error: "That did not send. Your answers are still here. Please try again." }, 502);
  // The copy to the client is a courtesy; its failure does not fail the submission.
  const first = name.split(/\s+/)[0];
  await sendMail(env, { to: email, replyTo: env.CONTACT_TO, subject: `Your answers for Balian.dev: ${company}`, title: `Thanks, ${first}.`, preheader: "A copy of what you sent, for your files.", text: `Here is a copy of what you sent me. I will read it properly, do some digging, and come back with questions and a time to talk.\n\nPierre\n\n---\n\n${md}` }).catch(() => {});
  return json({ ok: true });
};
