// Local development only: signs in as the first allow-listed id. Needs ADMIN_DEV_LOGIN=1 in .dev.vars and a localhost host.
// Never set ADMIN_DEV_LOGIN on the Pages project.
import { cookieHeader, makeSession, type AuthEnv } from "../../lib/session";

export const onRequestGet = async ({ request, env }: { request: Request; env: AuthEnv }) => {
  const url = new URL(request.url);
  const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
  const idv = (env.ADMIN_GITHUB_IDS ?? "").split(",")[0]?.trim();
  if (env.ADMIN_DEV_LOGIN !== "1" || !local || !idv || !env.ADMIN_SESSION_SECRET) return new Response("Not available.", { status: 404 });
  const session = await makeSession(env, idv, "dev");
  return new Response(null, { status: 302, headers: { location: `${url.origin}/admin/`, "set-cookie": cookieHeader(session, 86_400, request) } });
};
