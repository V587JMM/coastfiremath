import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/dmca')({
  head: () =>
    head(
      'Copyright Notices | Coast FIRE Calculator',
      'Copyright concerns and the contact channel for Coast FIRE Calculator.',
      '/dmca/',
      false,
      true,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="Copyright notices" intro="A channel for concerns about material on this site.">
      <h2>Report material</h2>
      <p>
        For a copyright concern, identify the work, the specific page or material, your relationship to the
        rights holder and a way to reach you. Use the channel on the <Link to="/contact/">contact page</Link>.
        This preview has no configured contact address yet.
      </p>
      <h2>No user uploads</h2>
      <p>This calculator does not accept user-uploaded material or host user-generated content.</p>
    </Article>
  );
}
