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
        On coastfiremath.com, we use Google Tag Manager to load site analytics. When Google Analytics is
        enabled, it may use cookies to measure page visits and receive page URLs, referrers and browser or
        device information. The calculator does not send your inputs or estimates as analytics events. You can
        manage analytics cookies in your browser or use the{' '}
        <a href="https://tools.google.com/dlpage/gaoptout">Google Analytics opt-out add-on</a>.
      </p>
      <p>
        We also use PVUV.ai to measure visits and distinguish human traffic from bots. PVUV may receive page
        URLs, referrers, browser and device details, and interaction signals. It uses first-party cookies and
        may store a visitor identifier in your browser’s local storage. You can clear both in your browser
        settings. See the <a href="https://www.pvuv.ai/privacy">PVUV.ai privacy policy</a> for details.
      </p>
      <p>
        Fonts are served by this site. Our hosting provider may process IP addresses, request paths,
        timestamps and technical information in operational logs when serving pages and assets. Those requests
        do not include financial input values.
      </p>
      <h2>Contact and changes</h2>
      <p>
        If a contact address is configured and you choose to send email, your email provider and the recipient
        process that message. Avoid sending account numbers or sensitive financial information. See the{' '}
        <Link to="/contact/">contact page</Link> for channel availability.
      </p>
      <p>
        The current operator’s available identity details are on <Link to="/about/">About</Link>.
      </p>
    </Article>
  );
}
