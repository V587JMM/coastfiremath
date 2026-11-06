import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
import { operator } from '../../site.config';
export const Route = createFileRoute('/about')({
  head: () =>
    head(
      'About Coast FIRE Calculator',
      'Why this independent Coast FIRE calculator exists, what it models, and how its estimates should be used.',
      '/about/',
      false,
      false,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="About this calculator" intro="A focused tool for one meaningful retirement milestone.">
      <h2>What we are building</h2>
      <p>
        Coast FIRE Calculator is an independent project for US users exploring when retirement saving could
        become optional. Its focus is a clear Coast number, the gap from current investments, and an estimated
        age at which contributions could stop under the assumptions you enter.
      </p>
      <h2>What matters here</h2>
      <p>
        The calculator keeps nominal and real dollars consistent, shows assumptions next to results, and
        separates stopping contributions from stopping work. Financial inputs stay in your browser’s memory.
        There are no connected accounts, paid plans or personalized investment recommendations.
      </p>
      <h2>Who operates the site</h2>
      <p>
        {operator
          ? `Maintained by ${operator}.`
          : 'Operator details have not been supplied for this preview. No professional credentials or financial qualifications are claimed.'}
      </p>
      <h2>Check the method</h2>
      <p>
        Our <Link to="/editorial-policy/">editorial policy</Link> describes the formulas and sources. If you
        find something unclear, see the <Link to="/contact/">contact page</Link> for the available feedback
        channel.
      </p>
    </Article>
  );
}
