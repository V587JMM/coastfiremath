import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/terms')({
  head: () =>
    head(
      'Terms of Use | Coast FIRE Calculator',
      'Terms and limitations for educational use of Coast FIRE Calculator.',
      '/terms/',
      false,
      true,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="Terms of use" intro="Use these estimates as a starting point for understanding.">
      <h2>Educational use</h2>
      <p>
        The tool projects simplified investment growth using assumptions you select. Results are not
        financial, tax or legal advice, a guarantee, or an instruction to stop working or saving. Future
        returns and inflation are unknown.
      </p>
      <h2>Scope and availability</h2>
      <p>
        No bank connection, investment transaction, account service or paid product is provided. We may
        correct calculations or change the tool. Review the <Link to="/editorial-policy/">methodology</Link>{' '}
        before relying on a result.
      </p>
      <h2>Respectful use</h2>
      <p>
        Use the calculator lawfully and do not disrupt access for others. Questions and corrections can be
        directed through <Link to="/contact/">Contact</Link>.
      </p>
    </Article>
  );
}
