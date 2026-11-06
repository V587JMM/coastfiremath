import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/privacy')({
  head: () =>
    head(
      'Privacy Policy | Coast FIRE Calculator',
      'How Coast FIRE Calculator handles financial inputs, cookies, local memory and hosting requests.',
      '/privacy/',
      false,
      false,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="Privacy policy" intro="Your financial inputs stay in your browser.">
      <h2>Financial information</h2>
      <p>
        Age, investments, spending, contribution amounts and rate assumptions are held in the current page’s
        memory. They are not submitted to a server, saved to browser storage or added to the address.
        Reloading the page restores the example. No account or bank connection is needed.
      </p>
      <h2>Optional downloads and printing</h2>
      <p>
        Nothing is saved automatically. If you choose Download Excel, your browser creates an Excel workbook
        containing your financial inputs, assumptions and estimates on your device. Print / save PDF opens
        your browser’s print dialog with the same plan information. These actions do not upload your data or
        create an account. You control any downloaded files, PDF copies and printouts; reloading this page
        does not remove copies you chose to keep. There is no automatic restore or local browser-storage
        feature.
      </p>
      <h2>Cookies, statistics and advertising</h2>
      <p>
        This version installs no analytics or advertising scripts and sets no application cookies. Fonts are
        served by this site. Standard requests for pages and assets still reach the hosting provider; the
        provider may process IP addresses, request paths, timestamps and technical information in its
        operational logs. Financial input values are not included in those requests.
      </p>
      <h2>Contact and changes</h2>
      <p>
        If a contact address is configured and you choose to send email, your email provider and the recipient
        process that message. Avoid sending account numbers or sensitive financial information. See the{' '}
        <Link to="/contact/">contact page</Link> for channel availability.
      </p>
      <p>
        Before introducing statistics, ads or other data-processing services, this policy must be updated to
        identify their handling of data and any applicable choices. The current operator’s available identity
        details are on <Link to="/about/">About</Link>.
      </p>
    </Article>
  );
}
