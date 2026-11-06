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
export function head(title: string, description: string, path: string, tool = false, noindex = false) {
  const data = pageHead(site, {
    title,
    description,
    path,
    noindex: !configured || noindex,
    jsonLd: tool
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
  if (!configured) {
    data.links = [];
    data.meta = data.meta.filter((m) => m.property !== 'og:url');
  }
  return data;
}
