import { cookieHeader, json } from "../../lib/session";
export const onRequestPost = async ({ request }: { request: Request }) => json({ ok: true }, 200, { "set-cookie": cookieHeader("", 0, request) });
