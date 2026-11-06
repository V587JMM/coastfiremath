import { sitemapXml } from '@shipwords/core/seo';
import { createFileRoute } from '@tanstack/react-router';
import { pages } from '~/lib/seo';
import site, { configured } from '../../site.config';
export const Route = createFileRoute('/sitemap.xml')({
  server: { handlers: { GET: () => sitemapXml(site, configured ? pages.map((path) => ({ path })) : []) } },
});
