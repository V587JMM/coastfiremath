import { robotsTxt } from '@shipwords/core/seo';
import { createFileRoute } from '@tanstack/react-router';
import site, { configured } from '../../site.config';
export const Route = createFileRoute('/robots.txt')({
  server: {
    handlers: {
      GET: () =>
        configured
          ? robotsTxt(site)
          : new Response('User-agent: *\nAllow: /\n', {
              headers: { 'content-type': 'text/plain; charset=utf-8' },
            }),
    },
  },
});
