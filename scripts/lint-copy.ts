// Checks every H1 and lede in src/data/ledes.ts against the rules in CONTENT.md, then scans all other copy
// (src/data/*.ts, src/pages/**/*.astro, src/components/*.astro) for banned phrases and the tics listed there.
// Run with: npm run lint:copy   (Node 22.18+ strips the types, no build step needed)
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { copy } from "../src/data/ledes.ts";

const banned = [
  "rather than", "whatever the problem", "i choose", "accountable", "end-to-end", "leverage", "robust", "seamless",
  "cutting-edge", "solutions", "tailored", "world-class", "passionate", "synergy", "holistic", "elevate", "unlock",
  "empower", "streamline", "delve", "in today's", "game-changing", "best-in-class",
];
// Patterns that read as written-by-template. Checked in all copy, not only ledes.
const tics: [RegExp, string][] = [
  [/[—–]/, "dash"],
  [/\bnot an afterthought\b/i, '"not an afterthought"'],
  [/\bnot just\b/i, '"not just"'],
  [/, not (?!to\b|for\b)[a-z]/, '"X, not Y" contrast'],
  [/\bfifteen years|ten years|two decades\b/i, "a year count other than twenty"],
  [/\brocket55|hooker\b/i, "employer name"],
];
// "accountable" is allowed outside ledes (one FAQ answer uses it on purpose).
const proseBanned = banned.filter((b) => b !== "accountable");

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

/* prose scan: every line of every copy-bearing file */
const root = new URL("..", import.meta.url).pathname;
const files: string[] = [];
const walk = (dir: string) => {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(ts|astro|md)$/.test(f) && !/skills\.ts$|site\.ts$|schema\.ts$/.test(f)) files.push(p);
  }
};
for (const d of ["src/data", "src/pages", "src/components", "src/content"]) walk(join(root, d));

let prose = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8").split("\n");
  let inFrontmatterCode = false;
  lines.forEach((line, i) => {
    // skip import/code lines in .astro frontmatter and ts that carry no copy
    if (/^\s*(import |const \w+ = (await )?[\w.]+\(|export (interface|type)|\/\/|---)/.test(line)) return;
    if (file.endsWith(".astro") && /^\s*(const|let) \w+ = \[?$/.test(line)) return;
    const hits: string[] = [];
    const lower = line.toLowerCase();
    for (const b of proseBanned) if (lower.includes(b)) hits.push(`"${b}"`);
    for (const [re, label] of tics) if (re.test(line)) hits.push(label);
    if (hits.length) {
      prose++;
      console.error(`PROSE ${relative(root, file)}:${i + 1}  ${hits.join(", ")}\n  ${line.trim().slice(0, 140)}`);
    }
  });
  void inFrontmatterCode;
}

if (failures || prose) {
  console.error(`\n${failures} lede(s) and ${prose} prose line(s) failed. Rules: CONTENT.md`);
  process.exit(1);
}
console.log(`Copy lint passed (${Object.keys(copy).length} pages, ${files.length} files scanned).`);
