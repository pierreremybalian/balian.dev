// Checks every H1 and lede in src/data/ledes.ts against the rules in CONTENT.md.
// Run with: npm run lint:copy   (Node 22.18+ strips the types, no build step needed)
import { copy } from "../src/data/ledes.ts";

const banned = [
  "rather than", "whatever the problem", "i choose", "accountable", "end-to-end", "leverage", "robust", "seamless",
  "cutting-edge", "solutions", "tailored", "world-class", "passionate", "synergy", "holistic", "elevate", "unlock",
  "empower", "streamline", "delve", "in today's", "game-changing", "best-in-class",
];
const countOpener = /^(one|two|three|four|five|six|seven|eight|nine|ten|\d+)\s+(areas|ways|things|steps|pillars|services|reasons)\b/i;
const stop = new Set("a an the and or of to in on for with is are be it its that this these those as at by from your you i my me we our".split(" "));
const words = (s: string) => s.toLowerCase().replace(/[^a-z0-9' -]/g, " ").split(/\s+/).filter(Boolean);
const content = (s: string) => words(s).filter((w) => !stop.has(w));

let failures = 0;
for (const [id, { h1, lede }] of Object.entries(copy)) {
  const problems: string[] = [];
  const n = words(lede).length;
  const sentences = lede.split(/(?<=[.!?])\s+/).filter(Boolean).length;
  const lower = lede.toLowerCase();

  if (n < 12 || n > 34) problems.push(`${n} words (want 12 to 34)`);
  if (sentences < 1 || sentences > 3) problems.push(`${sentences} sentences (want 1 to 3)`);
  if (!/\b(i|i'm|i've|i'll|you|your|you're|you'll|my)\b/i.test(lede)) problems.push("no I or you");
  if ((lede.match(/,/g) ?? []).length > 2) problems.push("more than two commas (stacked list?)");
  if (/[—–]/.test(lede)) problems.push("dash");
  if (/!/.test(lede)) problems.push("exclamation mark");
  if (countOpener.test(lede)) problems.push("opens by counting the page's own sections");
  for (const b of banned) if (lower.includes(b)) problems.push(`banned phrase: "${b}"`);

  const h = new Set(content(h1));
  const l = content(lede);
  const shared = l.filter((w) => h.has(w)).length;
  if (l.length && shared / l.length > 0.4) problems.push("repeats the H1");

  if (problems.length) {
    failures++;
    console.error(`FAIL ${id}\n  "${lede}"\n  - ${problems.join("\n  - ")}\n`);
  }
}

if (failures) {
  console.error(`${failures} lede(s) failed. Rules: CONTENT.md`);
  process.exit(1);
}
console.log(`Copy lint passed (${Object.keys(copy).length} pages).`);
