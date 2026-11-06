import { llmsTxt } from '@shipwords/core/seo';
import { createFileRoute } from '@tanstack/react-router';
import site from '../../site.config';
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        llmsTxt(
          site,
          'US Coast FIRE calculator. Fixed nominal monthly contributions, exact inflation adjustment, results in today’s dollars. Educational estimates.',
          [
            { title: 'Calculator', path: '/', description: 'Coast number, gap and estimated coast age.' },
            {
              title: 'Methodology',
              path: '/editorial-policy/',
              description: 'Formulas, assumptions and limitations.',
            },
          ],
        ),
    },
  },
});
