// GET /api/admin/templates: the email and document templates, plus the placeholders they understand.
import { json } from "../../lib/session";
import { emailTemplates, docTemplates } from "../../lib/templates";
import { PLACEHOLDERS } from "../../../src/data/emailTemplates";

export const onRequestGet = async () => json({ email: emailTemplates, documents: docTemplates, placeholders: PLACEHOLDERS });
