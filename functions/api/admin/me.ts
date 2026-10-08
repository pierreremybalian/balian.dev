import { json, type Session } from "../../lib/session";
export const onRequestGet = async ({ data }: { data: { session: Session } }) => json({ login: data.session.login, exp: data.session.exp });
