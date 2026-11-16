# Coast FIRE Calculator

A US single-person, browser-only calculator built from ShipWords' ai-site template. See DESIGN.md and the project-root DESIGN_PRINCIPLES.md.

## Local development

From the ShipWords workspace: `npx --yes pnpm@10.30.1 install`, then `npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire dev`. Open http://127.0.0.1:5030. No Cloudflare login, D1, R2, auth, billing or AI keys needed.

`npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire check` runs route/type generation, mathematical tests and the Cloudflare production build. `npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire preview` serves the build.

## Publishing configuration

Set `VITE_PUBLIC_SITE_URL` (the HTTPS origin without a trailing slash), `VITE_CONTACT_EMAIL`, and `VITE_OPERATOR_NAME` in Cloudflare Workers **Settings → Build → Build Variables and Secrets**. Vite reads these public values during the build, so start a fresh build after setting them. Use `pnpm run deploy` from `sites/coast-fire` for production. It checks these values before building and publishing the Worker. Builds without valid settings send noindex, omit canonical URLs, and return an empty sitemap.

Workers Builds on `main` also checks the publication configuration before building. The Worker allows crawling in `/robots.txt` and advertises the sitemap when the publication configuration is complete. For the public domain to serve this file directly, turn off Cloudflare Bot Preference Sync for the zone. Verify the public response after deployment because the zone can prepend its own rules.

The `/sitemap.xml` route renders the list in `src/lib/seo.ts` when the publication configuration is complete: the homepage, FIRE Number calculator, Coast FIRE guide, By Age comparison, Barista FIRE calculator, About, Editorial Policy, Privacy and Contact. DMCA, terms and refunds are supplementary noindex utility pages retained for the starter's policy requirements. No account or payment API is active. The upstream templates/ai-site directory retains the original template sources.

Public HTML pages use trailing slashes in internal links, canonical URLs and the sitemap. The Worker redirects GET and HEAD requests for slashless page URLs (or repeated trailing slashes) directly to the single-slash URL with HTTP 301, preserving query parameters. `src/lib/page-redirect.ts` lists these HTML routes; add new public pages there. Static assets, crawler files, API routes and unknown paths pass through unchanged. The homepage links to the Coast FIRE guide and By Age comparison next to the calculation results as well as in the relevant explanatory sections.

The upstream generic check-site expects AI billing, auth and a configured email; it is a launch check for the original paid-AI template. This browser-only site's check uses TypeScript, calculation tests, production build and browser verification instead; shared checks are unchanged. Domain/email are still enforced by launch-check.mjs.

## Data and assumptions

The FIRE Number calculator at `/fire-number-calculator/` estimates the full investment target as annual portfolio-funded spending divided by the initial withdrawal assumption. Monthly and annual spending entry are equivalent. It compares 3%, 3.5%, 4% and a custom selected rate, displays actual funding progress (including values above 100%), and separates the gap from the annual amount implied by current investments. Its optional timeline compounds at an effective monthly real return and adds constant real contributions at month-end, stopping at the first funded month or age 100. Deposits are assumed to keep pace with inflation; this differs from the Coast calculator's default fixed nominal contribution. Neither tool simulates withdrawals after full retirement or estimates success probabilities. The new page has independent metadata, WebApplication JSON-LD, a share image, crawlable examples and FAQ, and contextual links from the homepage, guide and methodology. `src/lib/fire-number.test.ts` checks the model against closed-form examples and boundary cases.

Results include an always-visible assumptions summary and a target-age planner. Choose a Coast age to estimate a fixed nominal monthly contribution, then apply the rounded-up amount to the main calculator. Mobile input editing shows a compact result dock with a return-to-result action. All these interactions run locally.
Calculator inputs exist in React memory only. They do not persist on reload, enter a URL or get submitted. Example rates are illustrative, independently editable, and not investment forecasts. Exact real-return conversion; effective monthly compounding; fixed nominal deposits at month-end; deposits cease after the moving Coast threshold is reached. All displayed projections use today's dollars. Smooth scenarios are not risk simulations.

The Barista FIRE calculator combines part-time take-home pay with month-end investment withdrawals. It shows the larger of an initial income-gap withdrawal target and a bridge-to-retirement target that preserves the full retirement reserve after work ends. Pay and spending keep pace with inflation; no new contributions or automatic benefits are included. Its fixed age table compares $40,000, $60,000 and $80,000 annual budgets using the same model.

Production pages on `https://coastfiremath.com` load the Google Tag Manager container. Configure and publish a Google tag with the GA4 measurement ID in that container to collect traffic data. Keep calculator inputs and results out of tag variables, triggers and events. Use Tag Assistant and GA4 Realtime to check the published setup.

Template source revision: shipwords-dev/shipwords 31d00ca (MIT). Outfit and DM Sans are self-hosted with their SIL Open Font Licenses in public/fonts/. The header wordmark and favicon are web derivatives of the supplied CoastFireMath logo.

## Visual direction

The current UI follows the Pastel consumer direction (seed 762299305), with teal, navy, sunrise gold and coral from the CoastFireMath logo. The computed contribute/Coast timeline uses the same crossover month as the summary and chart. See DESIGN.md and the project-root .taste-skill/critique.md for the visual review.

## Planning refinements

Retirement-only crossings explicitly have zero pre-retirement Coast years. Progress text preserves the real percentage above 100 while the bar is capped. Desired Coast age clamps when valid main age bounds change, with an explanation. Unreachable plans show a concrete monthly saving amount for the existing retirement age.

Spending can be entered per month or year; the model annualizes it. Contributions default to fixed nominal dollars, with an optional monthly inflation-indexed mode preserving the entered buying power from the first deposit. Negative inflation lowers nominal deposits. Forward, inverse, scenarios and remedies share the same mode.

Optional Excel downloads and print/save-PDF output include normalized inputs, assumptions, selected mode, results and yearly projections. They create a copy only on explicit user action, with no upload, browser storage or automatic restore. Privacy and methodology explain these actions.
