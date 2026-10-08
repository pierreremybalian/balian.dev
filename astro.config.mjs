import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output for Cloudflare Pages. No SSR adapter, no server to keep warm.
export default defineConfig({
  site: "https://balian.dev",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
  integrations: [sitemap({ lastmod: new Date(), filter: (page) => !/\/(intake|admin|d)\//.test(page) })], // the questionnaire is sent by link, never indexed
  // Pre-bundle three up front so the dev server does not re-optimise it mid-session.
  vite: {
    optimizeDeps: { include: ["three"] },
    // Never inline assets as data: URIs, so the CSP can keep font-src and img-src strict.
    build: { assetsInlineLimit: 0 },
  },
});
