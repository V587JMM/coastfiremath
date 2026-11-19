// Only public HTML routes belong here. Assets, APIs and crawler files keep their URLs.
const pagePaths = new Set([
  '/fire-number-calculator',
  '/4-percent-rule-calculator',
  '/what-is-coast-fire',
  '/coast-fire-calculator-by-age',
  '/barista-fire-calculator',
  '/about',
  '/editorial-policy',
  '/privacy',
  '/contact',
  '/terms',
  '/dmca',
  '/refunds',
]);

export function redirectPageRequest(request: Request): Response | null {
  if (request.method !== 'GET' && request.method !== 'HEAD') return null;

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');
  if (!pagePaths.has(path) || url.pathname === `${path}/`) return null;

  url.pathname = `${path}/`;
  return new Response(null, { status: 301, headers: { Location: url.href } });
}
