import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
import { contactEmail } from '../../site.config';
export const Route = createFileRoute('/contact')({
  head: () =>
    head(
      'Contact | Coast FIRE Calculator',
      'Report a calculation issue or send feedback about Coast FIRE Calculator.',
      '/contact/',
      false,
      false,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="Contact" intro="Help make the numbers and explanations clearer.">
      <h2>Feedback and corrections</h2>
      {contactEmail ? (
        <p>
          Email <a href={`mailto:${contactEmail}`}>{contactEmail}</a> with the page address, what you
          expected, and a description of the issue.
        </p>
      ) : (
        <p>
          A contact address has not been configured for this preview. Email and form submissions are currently
          unavailable.
        </p>
      )}
      <h2>Reporting a calculation issue</h2>
      <p>
        Describe which assumption or result appears inconsistent. You can use made-up amounts that reproduce
        the issue; there is no need to share your actual financial situation. Never include account
        credentials, account numbers or identification documents.
      </p>
      <h2>Scope</h2>
      <p>
        This project provides educational calculations. It does not offer personalized investment, tax or
        legal advice. For the model’s boundaries, read our <Link to="/editorial-policy/">methodology</Link>.
      </p>
    </Article>
  );
}
