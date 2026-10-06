import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Static output for Cloudflare Pages. No SSR adapter, no server to keep warm.
export default defineConfig({
  site: "https://balian.dev",
  output: "static",
  trailingSlash: "always",
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  // Pre-bundle three up front so the dev server does not re-optimise it mid-session.
  vite: { optimizeDeps: { include: ["three"] } },
});
