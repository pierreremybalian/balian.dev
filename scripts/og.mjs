// Renders one 1200x630 share image per page into public/og/<key>.png, using the site's own fonts.
// Run with: npm run og   (needs Playwright; set PLAYWRIGHT_PATH if it is not installed in this repo)
import { fileURLToPath, pathToFileURL } from "node:url";
import { mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { seo } from "../src/data/seo.ts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fonts = path.join(root, "node_modules/@fontsource-variable");
const out = path.join(root, "public/og");
mkdirSync(out, { recursive: true });

const { chromium } = await import(process.env.PLAYWRIGHT_PATH ? pathToFileURL(process.env.PLAYWRIGHT_PATH).href : "playwright");

const services = ["websites-and-cms", "wordpress-development", "woocommerce-development", "web-app-saas-development", "ai-integration", "ai-assisted-engineering"];
const work = ["zonesteward", "cookiesteward"];
const eyebrow = (k) => (services.includes(k) || k === "services" ? "Services" : work.includes(k) || k === "work" ? "Work" : k[0].toUpperCase() + k.slice(1));
const urlPath = (k) => (services.includes(k) ? `services/${k}/` : work.includes(k) ? `work/${k}/` : `${k}/`);

const html = (key, title, seed) => `<!doctype html><meta charset=utf-8><style>
@font-face{font-family:Sora;src:url(${pathToFileURL(fonts)}/sora/files/sora-latin-wght-normal.woff2);font-weight:100 800}
@font-face{font-family:JB;src:url(${pathToFileURL(fonts)}/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2);font-weight:100 800}
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;background:#090b10;position:relative;overflow:hidden;font-family:Sora}
canvas{position:absolute;right:-110px;top:0;opacity:.9}
.glow{position:absolute;right:20px;top:90px;width:520px;height:520px;background:radial-gradient(closest-side,rgba(255,46,147,.2),transparent)}
.brand{position:absolute;left:72px;top:64px;display:flex;align-items:center;gap:14px;font-weight:800;font-size:34px;letter-spacing:-.03em;color:#eceef3}
.brand i{width:30px;height:30px;border-radius:50%;background:#ff2e93;box-shadow:0 0 0 8px rgba(255,46,147,.22)}
.brand b{color:#ff2e93;font-weight:800}
.eb{position:absolute;left:72px;top:196px;font:500 22px JB;letter-spacing:.14em;text-transform:uppercase;color:#ff2e93}
h1{position:absolute;left:72px;top:246px;width:640px;font-weight:800;font-size:${title.length > 30 ? 58 : 68}px;line-height:1.06;letter-spacing:-.04em;color:#eceef3}
.sub{position:absolute;left:72px;bottom:64px;font:500 20px JB;letter-spacing:.08em;color:#8b93a7}
</style><div class=glow></div><canvas id=c width=760 height=630></canvas>
<div class=brand><i></i><span>Balian<b>.dev</b></span></div>
<div class=eb>${eyebrow(key)}</div><h1>${title}</h1><div class=sub>balian.dev/${urlPath(key)}</div>
<script>
let s=${seed};const r=()=>(s=(s*16807)%2147483647)/2147483647;
const c=document.getElementById('c').getContext('2d'),cx=380,cy=315,R=235,P=[];
for(let i=0;i<130;i++){const y=1-2*i/129,q=Math.sqrt(1-y*y),t=i*2.399963,k=R*(.8+.4*r());P.push([cx+Math.cos(t)*q*k,cy+y*k*.95,(Math.sin(t)*q+1)/2])}
c.lineWidth=1.2;
for(let a=0;a<P.length;a++){const d=P.map((p,b)=>[Math.hypot(p[0]-P[a][0],p[1]-P[a][1]),b]).filter(x=>x[1]!==a).sort((x,y)=>x[0]-y[0]).slice(0,2);
for(const[,b]of d){c.strokeStyle='rgba(255,46,147,'+(.16+.3*P[a][2])+')';c.beginPath();c.moveTo(P[a][0],P[a][1]);c.lineTo(P[b][0],P[b][1]);c.stroke()}}
for(let i=0;i<P.length;i+=3){c.strokeStyle='rgba(255,46,147,.1)';c.beginPath();c.moveTo(cx,cy);c.lineTo(P[i][0],P[i][1]);c.stroke()}
for(const p of P){c.fillStyle='rgba(216,169,194,'+(.35+.65*p[2])+')';c.beginPath();c.arc(p[0],p[1],1.8+3*p[2],0,7);c.fill()}
c.fillStyle='#fff';c.beginPath();c.arc(cx,cy,9,0,7);c.fill();
</script>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
let n = 0;
for (const [key, meta] of Object.entries(seo)) {
  if (key === "home") continue; // the home page keeps public/og.png
  // load from a file: URL so the local font files are allowed
  const tmp = path.join(tmpdir(), "balian-og.html");
  writeFileSync(tmp, html(key, meta.title, 7 + ++n * 31));
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  await page.screenshot({ path: path.join(out, `${key}.png`) });
  console.log("og/" + key + ".png");
}
await browser.close();
