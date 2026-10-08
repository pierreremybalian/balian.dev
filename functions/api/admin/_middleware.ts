// Every /api/admin/* route needs a valid admin session, except the sign-in routes themselves.
// Mutations also need the x-requested-with header, which a cross-site form cannot set.
import { readSession, json, type AuthEnv } from "../../lib/session";

const OPEN = new Set(["/api/admin/login", "/api/admin/callback", "/api/admin/dev-login"]);

export const onRequest = async ({ request, env, next, data }: { request: Request; env: AuthEnv; next: () => Promise<Response>; data: Record<string, unknown> }) => {
  const path = new URL(request.url).pathname.replace(/\/$/, "");
  if (OPEN.has(path)) return next();
  const session = await readSession(env, request);
  if (!session) return json({ error: "Sign in first." }, 401);
  if (request.method !== "GET" && request.headers.get("x-requested-with") !== "admin") return json({ error: "Missing request header." }, 403);
  data.session = session;
  return next();
};
