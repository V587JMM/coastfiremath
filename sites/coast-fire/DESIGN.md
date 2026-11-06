# Coast FIRE — product design

## Current visual direction

CoastFireMath uses the supplied sunrise and wave wordmark as the brand source. Pastel consumer, seed 762299305, maps those colors onto a white and sea-mist calculator: deep ocean text, one teal threshold tile, a warm sunrise tile for the age milestone, and coral on the action that applies the calculated saving amount. The same teal connects the live progress, forecast path and timeline. Outfit gives headings the geometry of the wordmark; DM Sans keeps controls and tabular amounts easy to read. The actual logo is used in the shared header, and its symbol is used as the favicon. Retain the public tool layout and working inputs, links, calculations and exports.

The previous palette followed the Pastel consumer draw (seed 556476457) in ocean blue with Manrope. Its cobalt amount tile established a strong focal point that the brand palette carries forward.

The homepage defines Coast FIRE beside the calculator title and gives one short instruction above the inputs. Rate assumptions start expanded, with a native slider and a precise numeric field for each rate. Reuse the teal accent and keep the calculated result as the focal point.

The homepage places plan export beside the title on larger screens and beneath the subtitle on phones. Use quiet secondary buttons so the Coast threshold remains the main visual focus. Keep the location stable when inputs are invalid and explain why export is unavailable.

The By Age tool shares the site palette and typography. Keep editable assumptions beside the comparison table on desktop, then stack them above the table on phones. Emphasize the Coast amount column. The homepage retains a fixed example and links to the editable comparison.

The user requested more character after the initial ledger design. Current direction: taste-skill Pastel consumer, seed 180175363 (see project .taste-skill/visual-direction). Retain the no-sidebar shell: this public calculator has only two primary destinations and needs its width. Use locally loaded Manrope with semibold tabular money figures, white list/form panels, 20px outer card radii and 10px controls. Adapt the dealt pastel proportions to a sage savings horizon: stone ground, pale sage data tiles with dark green ink, one green investment series, neutral comparisons. No gradients, shadows or new external services.

Idea: the computed crossover is a horizon between active contributions and investment-only growth. The dominant threshold tile is paired with the actual milestone age; an accurately proportioned contribute/Coast phase strip extends that same idea under the chart. Zero Coast duration remains zero, not a decorative stub. Age, contributions and cash-flow assumptions retain their existing meaning.

Keep calculation, route, metadata, privacy, export and print behavior. Improve hierarchy and section rhythm; make forms compact enough that the projection remains visible on desktop. Baseline screenshots: project .taste-skill/visual-before. Prior direction notes below document the earlier implementation and its functional constraints.

Based on ../../../DESIGN_PRINCIPLES.md. Taste skill: Achromatic ledger, seed 497389628. No redraws to style. Shell adapted from icon rail to no-sidebar: a public calculator has only a tool and a guide, so labeled top navigation is discoverable and preserves width.

Question: When can I stop adding to retirement savings?
Face: blue-grey ledger ground, loaded Geist, tabular dollar amounts, blue only on the investment path. Signature: a monthly accumulation path that bends into a no-contributions Coast phase at the computed crossover. No photographs are needed for this working calculator.

Inventory: US single-person planning; today's-dollar results; fixed nominal monthly deposits; exact inflation conversion; moving Coast threshold; zero additional deposits after crossover; three adjustable return scenarios; no login; no financial data transmission; six indexable destinations after configuration.

Argument: input your situation → see the Coast gap and age → inspect the path and assumptions → compare return scenarios → understand age with a labeled fixed-reference table → inspect formulas and boundaries → read the guide and methodology.

Grid: centered 1200px canvas; 352px inputs + 16px gutter + remaining result column. Result and chart share one container. Mobile puts the short result summary before the input form; full projection follows it. No hover-only information; keyboard-accessible native fields, details and buttons.

Sample: age 32, retirement 65, investments $150,000, annual portfolio-funded spending $48,000, monthly nominal deposit $1,500. Illustrative assumptions: 7% nominal return, 3% inflation, 4% withdrawal. These are editable demonstration assumptions, not a forecast or a recommended asset allocation. Lower/higher nominal return scenarios shift by two percentage points; no probabilities implied.

Financial fields stay in React memory; no persistence, URL serialization, third-party analytics, ads or remote fonts. Geist is served locally. Domain/contact/owner remain unconfigured at the user's request; preview is noindex. Launch check requires their real values.

## Result clarity and target-age planning

Nominal return, inflation and withdrawal assumptions stay visible beside the main result, with an Edit assumptions control that opens the settings and focuses nominal return. Mobile editing provides an inline return-to-result button and a compact live result dock while the inputs or goal planner are on screen and the full result is above the viewport. The dock hides at the result and footer. It respects safe-area insets and reduced motion; returning to the result also moves keyboard focus.

The target-age planner is a separate hypothetical calculation until its monthly amount is applied. A whole-number Coast age ranges from current age to full retirement age. It solves for constant nominal month-end deposits using the same effective monthly growth and inflation factors as the main model. Amounts round up to whole dollars. Already-coasting, immediate-gap, invalid-age and above-input-limit states have explicit copy. Reset restores both the example and target age 45. No inputs are persisted or transmitted.

## Review corrections and actionable results

Keep the existing Achromatic Ledger direction. Treat retirement-only reachability as a separate result in summary, mobile dock, chart and printout. Preserve actual progress percentages and show the surplus. Clamp desired Coast age when valid main age boundaries change, with status feedback. Place a concrete retirement-saving remedy and apply action inside an unreachable result.

Budget entry supports monthly/yearly units; retirement target always uses annual spending. Contribution inflation adjustment is optional and clearly described, with the selected basis repeated beside results. The Excel export has inputs, results and projection sheets, and a dedicated print view hides interactive controls. All financial processing remains browser-local. Domain, feedback email and operator must all be configured before indexing or release.
