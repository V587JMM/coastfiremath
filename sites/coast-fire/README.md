# Coast FIRE Calculator

A US single-person, browser-only calculator built from ShipWords' ai-site template. See DESIGN.md and the project-root DESIGN_PRINCIPLES.md.

## Local development

From the ShipWords workspace: `npx --yes pnpm@10.30.1 install`, then `npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire dev`. Open http://127.0.0.1:5030. No Cloudflare login, D1, R2, auth, billing or AI keys needed.

`npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire check` runs route/type generation, mathematical tests and the Cloudflare production build. `npx --yes pnpm@10.30.1 --filter @shipwords/site-coast-fire preview` serves the build.

## Publishing configuration

Domain, operator and email are intentionally blank at the owner's request. Preview sends noindex and robots disallow, omits canonical URLs, and returns an empty sitemap. Contact explains that no channel has been configured; no email is invented. Before publishing, supply VITE_PUBLIC_SITE_URL (HTTPS origin, no trailing slash), VITE_CONTACT_EMAIL and VITE_OPERATOR_NAME to the build environment. These are public build-time values. Restart/rebuild after changing them. The deploy script validates them and requires Wrangler credentials; no deployment has been performed.

Seven primary pages enter the sitemap when the publication configuration is complete, including the interactive Coast FIRE by Age comparison. DMCA, terms and refunds are supplementary noindex utility pages retained for the starter's policy requirements. No account or payment API is active. The upstream templates/ai-site directory retains the original template sources.

The upstream generic check-site expects AI billing, auth and a configured email; it is a launch check for the original paid-AI template. This browser-only site's check uses TypeScript, calculation tests, production build and browser verification instead; shared checks are unchanged. Domain/email are still enforced by launch-check.mjs.

## Data and assumptions

Results include an always-visible assumptions summary and a target-age planner. Choose a Coast age to estimate a fixed nominal monthly contribution, then apply the rounded-up amount to the main calculator. Mobile input editing shows a compact result dock with a return-to-result action. All these interactions run locally.
Inputs exist in React memory only. Nothing persists on reload, enters a URL or is submitted. No analytics, advertising or external fonts are loaded. Example rates are illustrative, independently editable, and not investment forecasts. Exact real-return conversion; effective monthly compounding; fixed nominal deposits at month-end; deposits cease after the moving Coast threshold is reached. All displayed projections use today's dollars. Smooth scenarios are not risk simulations.

Before adding analytics or ads, update privacy and verify financial input values are never transmitted. Real author details, editorial review, production domain and contact information must be finalized before public launch. Do not claim professional credentials or historical performance.

Template source revision: shipwords-dev/shipwords 31d00ca (MIT). Outfit and DM Sans are self-hosted with their SIL Open Font Licenses in public/fonts/. The header wordmark and favicon are web derivatives of the supplied CoastFireMath logo.

## Visual direction

The current UI follows the Pastel consumer direction (seed 762299305), with teal, navy, sunrise gold and coral from the CoastFireMath logo. The computed contribute/Coast timeline uses the same crossover month as the summary and chart. See DESIGN.md and the project-root .taste-skill/critique.md for the visual review.

## Planning refinements

Retirement-only crossings explicitly have zero pre-retirement Coast years. Progress text preserves the real percentage above 100 while the bar is capped. Desired Coast age clamps when valid main age bounds change, with an explanation. Unreachable plans show a concrete monthly saving amount for the existing retirement age.

Spending can be entered per month or year; the model annualizes it. Contributions default to fixed nominal dollars, with an optional monthly inflation-indexed mode preserving the entered buying power from the first deposit. Negative inflation lowers nominal deposits. Forward, inverse, scenarios and remedies share the same mode.

Optional Excel downloads and print/save-PDF output include normalized inputs, assumptions, selected mode, results and yearly projections. They create a copy only on explicit user action, with no upload, browser storage or automatic restore. Privacy and methodology explain these actions.

No indexable metadata or sitemap entries are enabled unless domain, contact email and operator all pass configuration validation. The same validation protects the deploy command. The actual contact channel and operator remain blank at the owner's request: this is still a release-preparation gap, not proof of a working feedback channel. Test fixtures are not deployed operator identities.
