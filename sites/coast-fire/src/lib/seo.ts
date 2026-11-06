import { pageHead } from '@shipwords/core/seo';
import site, { configured } from '../../site.config';
export const pages = [
  '/',
  '/coast-fire-calculator-by-age/',
  '/what-is-coast-fire/',
  '/about/',
  '/editorial-policy/',
  '/privacy/',
  '/contact/',
];
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
  if (!configured) {
    data.links = [];
    data.meta = data.meta.filter((m) => m.property !== 'og:url');
  }
  return data;
}
