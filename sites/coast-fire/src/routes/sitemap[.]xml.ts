import { createFileRoute } from '@tanstack/react-router';
import { canonicalUrl, sitemapEntries } from '~/lib/seo';
import { configured } from '../../site.config';

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: () => {
        const entries = configured ? sitemapEntries : [];
        const urls = entries.map(({ path, lastmod }) => {
          const loc = canonicalUrl(path).replaceAll('&', '&amp;');
          const date = lastmod ? `<lastmod>${lastmod}</lastmod>` : '';
          return `  <url><loc>${loc}</loc>${date}</url>`;
        });
        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...urls,
          '</urlset>',
        ].join('\n');
        return new Response(xml, {
          headers: {
            'content-type': 'application/xml; charset=utf-8',
            'cache-control': 'public, max-age=3600',
          },
        });
      },
    },
  },
});
