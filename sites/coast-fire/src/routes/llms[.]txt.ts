import { llmsTxt } from '@shipwords/core/seo';
import { createFileRoute } from '@tanstack/react-router';
import site from '../../site.config';
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        llmsTxt(
          site,
          'US retirement planning calculators for Coast FIRE and full FIRE targets. Educational estimates in today’s dollars, with explicit spending, withdrawal and growth assumptions.',
          [
            { title: 'Calculator', path: '/', description: 'Coast number, gap and estimated coast age.' },
            {
              title: 'FIRE Number Calculator',
              path: '/fire-number-calculator/',
              description:
                'Full retirement target, withdrawal-rate comparisons, progress and an optional accumulation timeline.',
            },
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
