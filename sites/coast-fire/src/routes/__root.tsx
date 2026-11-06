import { createRootRoute, HeadContent, Link, Outlet, Scripts } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import css from '~/site/styles.css?url';
import visualCss from '~/site/visual.css?url';
export const Route = createRootRoute({
  head: () => ({
    meta: [{ charSet: 'utf-8' }, { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    links: [
      { rel: 'stylesheet', href: css },
      { rel: 'stylesheet', href: visualCss },
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
            <Link to="/what-is-coast-fire/">The guide</Link>
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
        <p className="fine">
          Educational estimates, not personalized financial advice. US dollars · Single-person planning.
        </p>
      </footer>
    </>
  );
}
