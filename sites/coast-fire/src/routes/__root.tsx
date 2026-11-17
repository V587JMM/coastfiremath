import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import baristaCss from '~/site/barista.css?url';
import css from '~/site/styles.css?url';
import visualCss from '~/site/visual.css?url';

const analyticsScript = `(() => {
  if (window.location.origin !== 'https://coastfiremath.com') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5ZJXLPWZ';
  document.head.appendChild(script);

  const pvuv = document.createElement('script');
  pvuv.async = true;
  pvuv.src = 'https://www.pvuv.ai/f.js';
  pvuv.dataset.site = 'AzKAAhHP';
  pvuv.dataset.api = 'https://in.pvuv.ai';
  document.head.appendChild(pvuv);
})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'stylesheet', href: visualCss },
      { rel: 'stylesheet', href: baristaCss },
      { rel: 'icon', href: '/brand-icon.png', type: 'image/png', sizes: '96x96' },
    ],
  }),
  shellComponent: Document,
  component: Layout,
  notFoundComponent: () => (
    <article className="article">
      <meta name="robots" content="noindex" />
      <title>Page not found | Coast FIRE Calculator</title>
      <h1>Page not found</h1>
      <p>This address does not have a page.</p>
      <Link to="/">Return to the calculator</Link>
    </article>
  ),
});
function Document({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {import.meta.env.PROD && <script id="coast-fire-analytics">{analyticsScript}</script>}
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
function Layout() {
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand">
            <img className="brand-logo" src="/brand-logo.webp" alt="CoastFireMath" width={630} height={140} />
          </Link>
          <nav aria-label="Main navigation">
            <Link to="/" activeProps={{ 'aria-current': 'page' }} activeOptions={{ exact: true }}>
              Calculator
            </Link>
            <Link to="/fire-number-calculator/" activeProps={{ 'aria-current': 'page' }}>
              FIRE Number Calculator
            </Link>
            <Link to="/barista-fire-calculator/" activeProps={{ 'aria-current': 'page' }}>
              Barista FIRE Calculator
            </Link>
            <Link to="/coast-fire-calculator-by-age/" activeProps={{ 'aria-current': 'page' }}>
              Coast FIRE Calculator by Age
            </Link>
            <Link to="/what-is-coast-fire/" activeProps={{ 'aria-current': 'page' }}>
              What Is Coast FIRE?
            </Link>
            <Link to="/editorial-policy/">Methodology</Link>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <Link to="/" className="brand">
            CoastFireMath
          </Link>
          <p>Make room for your next chapter.</p>
        </div>
        <nav aria-label="Footer">
          <Link to="/about/">About</Link>
          <Link to="/editorial-policy/">Editorial policy</Link>
          <Link to="/privacy/">Privacy</Link>
          <Link to="/contact/">Contact</Link>
          <Link to="/terms/">Terms</Link>
          <Link to="/dmca/">DMCA</Link>
          <Link to="/refunds/">Refunds</Link>
        </nav>
        <a
          className="directory-badge"
          href="https://newname.ai/badge?ref=coast-fire-calculator"
          target="_blank"
          rel="noopener"
          data-newname-badge="coast-fire-calculator"
        >
          <img src="https://newname.ai/badge/listed.svg" alt="Listed on NewName.ai" width={200} height={54} />
        </a>
        <p className="fine">
          Educational estimates, not personalized financial advice. US dollars · Single-person planning.
        </p>
      </footer>
    </>
  );
}
