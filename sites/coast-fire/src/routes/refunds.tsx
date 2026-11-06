import { createFileRoute } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/refunds')({
  head: () =>
    head(
      'Payments & Refunds | Coast FIRE Calculator',
      'Coast FIRE Calculator is free and does not take payments.',
      '/refunds/',
      false,
      true,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="Payments & refunds" intro="The calculator is free to use.">
      <h2>No payments</h2>
      <p>
        This version sells no products, charges no fees and collects no payment details. There are no
        purchases to refund.
      </p>
      <h2>Unexpected charges</h2>
      <p>
        If you see an unfamiliar charge, contact your payment provider. Do not send card numbers or financial
        credentials to this site.
      </p>
    </Article>
  );
}
