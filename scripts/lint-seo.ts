// Checks titles and meta descriptions in src/data/seo.ts. Run with: npm run lint:seo
import { seo, TITLE_SUFFIX } from "../src/data/seo.ts";

let failures = 0;
const titles = new Map<string, string>();
const descs = new Map<string, string>();

for (const [id, s] of Object.entries(seo)) {
  const full = id === "home" ? s.title + TITLE_SUFFIX : s.title + TITLE_SUFFIX;
  const problems: string[] = [];
  const kw = s.keyword.toLowerCase();
  if (full.length > 60) problems.push(`title is ${full.length} characters (max 60)`);
  if (full.length < 25) problems.push(`title is only ${full.length} characters`);
  if (s.description.length < 110 || s.description.length > 158) problems.push(`description is ${s.description.length} characters (want 110 to 158)`);
  if (!full.toLowerCase().includes(kw)) problems.push(`title does not contain the keyword "${s.keyword}"`);
  if (!s.description.toLowerCase().includes(kw)) problems.push(`description does not contain the keyword "${s.keyword}"`);
  if (titles.has(full)) problems.push(`title duplicates ${titles.get(full)}`);
  if (descs.has(s.description)) problems.push(`description duplicates ${descs.get(s.description)}`);
  titles.set(full, id);
  descs.set(s.description, id);
  if (/[—]/.test(s.title + s.description)) problems.push("em dash");
  if (problems.length) {
    failures++;
    console.error(`FAIL ${id}\n  ${full}\n  - ${problems.join("\n  - ")}\n`);
  }
}

if (failures) {
  console.error(`${failures} page(s) failed the SEO lint.`);
  process.exit(1);
}
console.log(`SEO lint passed (${Object.keys(seo).length} pages).`);
