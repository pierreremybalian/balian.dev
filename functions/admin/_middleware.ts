// The static /admin/ pages are only served to a signed-in admin; everyone else goes to the sign-in page.
import { readSession, type AuthEnv } from "../lib/session";

export const onRequest = async ({ request, env, next }: { request: Request; env: AuthEnv; next: () => Promise<Response> }) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/admin/login")) return next();
  const session = await readSession(env, request);
  if (!session) return Response.redirect(`${url.origin}/admin/login/`, 302);
  const res = await next();
  const out = new Response(res.body, res);
  out.headers.set("cache-control", "no-store");
  return out;
};
