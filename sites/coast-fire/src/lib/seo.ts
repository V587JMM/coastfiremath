import { pageHead, type SitemapEntry } from '@shipwords/core/seo';
import site, { configured } from '../../site.config';

export const homeLastModified = '2026-11-12';
export const guideLastModified = '2026-11-11';
export const methodologyLastModified = '2026-11-09';

// Include only canonical, indexable pages. Update lastmod for meaningful page changes.
export const sitemapEntries: SitemapEntry[] = [
  { path: '/', lastmod: homeLastModified },
  { path: '/what-is-coast-fire/', lastmod: guideLastModified },
  { path: '/coast-fire-calculator-by-age/', lastmod: '2026-11-11' },
  { path: '/barista-fire-calculator/', lastmod: '2026-11-11' },
  { path: '/about/' },
  { path: '/editorial-policy/', lastmod: methodologyLastModified },
  { path: '/privacy/' },
  { path: '/contact/' },
];

export function canonicalUrl(path: string) {
  return new URL(path, site.url).href;
}

export function head(
  title: string,
  description: string,
  path: string,
  tool = false,
  noindex = false,
  sharing?: { image: string; article?: boolean; jsonLd: Record<string, unknown>[] },
) {
  const data = pageHead(site, {
    title,
    description,
    path,
    image: configured && sharing ? `${site.url}${sharing.image}` : undefined,
    noindex: !configured || noindex,
    jsonLd: sharing
      ? configured
        ? sharing.jsonLd
        : []
      : tool
        ? [
            {
              '@type': 'SoftwareApplication',
              name: site.name,
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Any',
              isAccessibleForFree: true,
              ...(configured ? { url: site.url } : {}),
              offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            },
          ]
        : [],
  });
  if (sharing?.article) {
    for (const meta of data.meta) {
      if (meta.property === 'og:type') meta.content = 'article';
    }
  }
  if (configured) {
    const url = canonicalUrl(path);
    data.links = [{ rel: 'canonical', href: url }];
    for (const meta of data.meta) {
      if (meta.property === 'og:url') meta.content = url;
    }
    if (!noindex) data.meta.push({ name: 'robots', content: 'index, follow' });
  } else {
    data.links = [];
    data.meta = data.meta.filter((m) => m.property !== 'og:url');
  }
  return data;
}
