// Cloudflare Pages middleware: the apex (balian.dev) is the one canonical host.
// www.balian.dev and the production pages.dev address redirect there with a permanent redirect.
// Preview deployments (<hash>.balian-dev.pages.dev) are left alone.
const REDIRECT_HOSTS = new Set(["www.balian.dev", "balian-dev.pages.dev"]);

export const onRequest = async ({ request, next }: { request: Request; next: () => Promise<Response> }) => {
  const url = new URL(request.url);
  if (REDIRECT_HOSTS.has(url.hostname)) {
    return Response.redirect(`https://balian.dev${url.pathname}${url.search}`, 301);
  }
  return next();
};
