import { llmsTxt } from '@shipwords/core/seo';
import { createFileRoute } from '@tanstack/react-router';
import site from '../../site.config';
export const Route = createFileRoute('/llms.txt')({
  server: {
    handlers: {
      GET: () =>
        llmsTxt(
          site,
          'US retirement planning calculators for Coast FIRE, full FIRE targets and retirement withdrawals. Educational estimates with explicit spending, withdrawal and growth assumptions.',
          [
            { title: 'Calculator', path: '/', description: 'Coast number, gap and estimated coast age.' },
            {
              title: 'FIRE Number Calculator',
              path: '/fire-number-calculator/',
              description:
                'Full retirement target, withdrawal-rate comparisons, progress and an optional accumulation timeline.',
            },
            {
              title: '4 Percent Rule Calculator',
              path: '/4-percent-rule-calculator/',
              description: 'Estimate first-year withdrawals and compare retirement drawdown paths.',
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
