import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

function wrapTables() {
  const visit = (node, parent, i) => {
    if (node.type === "element" && node.tagName === "table" && parent && !(parent.tagName === "div" && parent.properties?.className?.includes("tw"))) {
      parent.children[i] = { type: "element", tagName: "div", properties: { className: ["tw"] }, children: [node] };
      return;
    }
    if (node.type === "element" && node.tagName === "a" && /^https?:\/\//.test(String(node.properties?.href ?? ""))) {
      node.properties.rel = "noopener";
    }
    node.children?.forEach((c, k) => visit(c, node, k));
  };
  return (tree) => visit(tree, null, 0);
}

// Static output for Cloudflare Pages. No SSR adapter, no server to keep warm.
export default defineConfig({
  site: "https://balian.dev",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
  integrations: [sitemap({ lastmod: new Date(), filter: (page) => !/\/(intake|admin|d)\//.test(page) })], // the questionnaire is sent by link, never indexed
  // Blog posts: wrap every table so a wide cost table scrolls inside its own box on a phone, and open external links in a new tab.
  markdown: { rehypePlugins: [wrapTables] },
  // Pre-bundle three up front so the dev server does not re-optimise it mid-session.
  vite: {
    optimizeDeps: { include: ["three"] },
    // Never inline assets as data: URIs, so the CSP can keep font-src and img-src strict.
    build: { assetsInlineLimit: 0 },
  },
});
