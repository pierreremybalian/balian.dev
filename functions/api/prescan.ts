// Cloudflare Pages Function: GET /api/prescan?url=example.com
// Runs functions/lib/prescan.ts for the questionnaire, so the form can pre-fill what the site already tells us.
import { prescan, normalizeUrl } from "../lib/prescan";

const json = (body: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", "cache-control": "no-store", ...extra } });

export const onRequestGet = async ({ request }: { request: Request }) => {
  const params = new URL(request.url).searchParams;
  const url = normalizeUrl(params.get("url") ?? "");
  if (!url) return json({ error: "That does not look like a public website address." }, 422);
  if (params.get("fresh") === "1") return json(await prescan(url));
  // Same scan within ten minutes comes from cache, so retyping the address does not hammer the prospect's site.
  const cache = (caches as unknown as { default: Cache }).default;
  const key = new Request("https://balian.dev/api/prescan?url=" + encodeURIComponent(url));
  const hit = await cache.match(key);
  if (hit) return hit;
  const result = await prescan(url);
  const res = new Response(JSON.stringify(result), { headers: { "content-type": "application/json", "cache-control": "public, max-age=600" } });
  await cache.put(key, res.clone());
  return res;
};
