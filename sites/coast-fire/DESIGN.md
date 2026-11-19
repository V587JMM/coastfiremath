# Coast FIRE — product design

## Current visual direction

### Directory badge

Place the official NewName.ai listing badge below the shared footer navigation, with 20px of breathing room. Keep its native 200 × 54 size and dark artwork, descriptive alt text, referral URL and detection attribute. The link opens in a new tab with `noopener`. Use the same placement on desktop and mobile so the homepage badge remains visible and crawlable.

### 4 percent rule calculator

Use the site's ocean and sea-mist colors and Outfit/DM Sans type. Lead with portfolio-to-income, with the first year's annual withdrawal as the dominant teal figure and the monthly equivalent immediately below it. The spending mode shows the implied portfolio and links to the accumulation timeline. Keep a compact input column beside results and stack them on phones. Place the three balance paths directly below the result. Different line patterns and a textual scenario summary convey the same outcomes.

Use an annual withdrawal at the start of each year, followed by investment returns and fees. Display the main chart in today’s dollars. The annual schedule switches dollar bases and distinguishes planned withdrawals from amounts actually available. Rate presets and the reference table update the calculator in place. Print the assumptions and scenario results as text.

### FIRE number calculator

Extend the established Pastel consumer direction (seed 762299305), existing Outfit/DM Sans fonts and ocean/sea-mist palette. This is another working tool inside the existing site, not a replacement visual system. The question is: what investment balance could fund my retirement spending? Make the full FIRE target the dominant teal figure, then show the actual funded percentage, funding gap and spending supported by current investments. Keep that target distinct from the discounted Coast threshold.

The primary form has monthly/yearly spending, a withdrawal assumption and current investments. A separate opt-in timeline adds current age, monthly investments in today's dollars and a real annual return. Its error state never removes an otherwise valid FIRE target. Show 3%, 3.5% and 4% as actionable comparisons, adding the custom rate when needed. These are illustrative assumptions, not recommendations. The timeline uses month-end deposits that keep pace with inflation, stops at the first funded month and reports an explicit not-reached-by-age-100 state. A labeled savings path is drawn from the same computed points as the reported age. All inputs stay in memory; copying a summary happens only on request.

Composition: a compact title; spending form beside the target, progress and rate comparison; optional timeline below; a readable formula and worked example; a fixed spending/rate table; withdrawal assumptions, US budgeting boundaries and FIRE/Coast distinctions; FAQ. Retain the site's 20px panels and control styling, with scoped CSS so existing calculators are unchanged. On phones stack the form and target, provide a result jump, and constrain tables to their own scrolling region. Use the two-column wrapping navigation for the additional crawlable tool link. No decorative photography is needed for the live numerical tool.

Show the current balance beside funding progress so it also appears in print. Label the savings path with its ending age and balance, and repeat exact starting and ending amounts below the chart. The printed timeline shows the inputs as text. Each reference budget can populate the annual spending field and return focus there.

Research references: [WorkFree](https://workfree.me/fire-number-calculator/) separates a spending-based target from an optional savings timeline; [Engaging Data](https://engaging-data.com/fire-calculator/) makes accumulation assumptions and today's-dollar units explicit. Adapt these useful interaction patterns with original copy and implementation. For withdrawal context use [Fidelity's early-retirement guide](https://www.fidelity.com/learning-center/personal-finance/how-to-retire-early) and [Schwab's withdrawal-rule explanation](https://www.schwab.com/learn/story/beyond-4-rule-how-much-can-you-spend-retirement). Do not imply a universal retirement success rate or indefinite portfolio survival.

### Shared calculator design

Primary navigation exposes the FIRE Number Calculator, 4% Rule Calculator, Barista FIRE Calculator, Coast FIRE Calculator by Age and What Is Coast FIRE? as server-rendered links with their canonical trailing-slash URLs. Retain Calculator and Methodology. At widths up to 1360px, move navigation below the brand and wrap links. On phones use two columns with 44px minimum targets. Keep every tool link visible without JavaScript.

The Barista FIRE inner page inherits the current ocean, sea-mist and sunrise tokens, Outfit headings, DM Sans controls and rounded calculator panels. Its question is how much must be invested to combine part-time earnings with withdrawals today, while still funding retirement after work stops. The main teal amount is the larger of the income-gap target and a monthly bridge-to-retirement calculation; show the income split and both checks beside it. Default example: age 35, stop work at 65, $500,000 invested, $40,000 spending, $25/hour, 20 hours/week, 52 paid weeks, 20% income deduction, 7% nominal return, 3% inflation and 4% withdrawal assumption. Keep all amounts in today's dollars. Fields update locally; invalid fields receive specific feedback and clear results. On phones, pair related fields, provide a result jump and keep tables inside their own scrollable frame. Reading order: calculator, definition, formulas, fixed age/spending examples, Barista versus Coast, FAQ. Preserve the existing brand rather than dealing a replacement design.

CoastFireMath uses the supplied sunrise and wave wordmark as the brand source. Pastel consumer, seed 762299305, maps those colors onto a white and sea-mist calculator: deep ocean text, one teal threshold tile, a warm sunrise tile for the age milestone, and coral on the action that applies the calculated saving amount. The same teal connects the live progress, forecast path and timeline. Outfit gives headings the geometry of the wordmark; DM Sans keeps controls and tabular amounts easy to read. The actual logo is used in the shared header, and its symbol is used as the favicon. Retain the public tool layout and working inputs, links, calculations and exports.

The previous palette followed the Pastel consumer draw (seed 556476457) in ocean blue with Manrope. Its cobalt amount tile established a strong focal point that the brand palette carries forward.

The homepage defines Coast FIRE beside the calculator title and gives one short instruction above the inputs. Rate assumptions start expanded, with a native slider and a precise numeric field for each rate. Reuse the teal accent and keep the calculated result as the focal point.

The homepage places plan export beside the title on larger screens and beneath the subtitle on phones. Use quiet secondary buttons so the Coast threshold remains the main visual focus. Keep the location stable when inputs are invalid and explain why export is unavailable.

The By Age tool shares the site palette and typography. Keep editable assumptions beside the comparison table on desktop, then stack them above the table on phones. Emphasize the Coast amount column. The homepage retains a fixed example and links to the editable comparison.

Keep the calculator above the age explanations. Use the existing article typography for the reading sections and let comparison table text wrap to fit phones. The two share images use the existing navy, teal and sunrise palette.

The user requested more character after the initial ledger design. Current direction: taste-skill Pastel consumer, seed 180175363 (see project .taste-skill/visual-direction). Retain the no-sidebar shell: this public calculator has only two primary destinations and needs its width. Use locally loaded Manrope with semibold tabular money figures, white list/form panels, 20px outer card radii and 10px controls. Adapt the dealt pastel proportions to a sage savings horizon: stone ground, pale sage data tiles with dark green ink, one green investment series, neutral comparisons. No gradients, shadows or new external services.

Idea: the computed crossover is a horizon between active contributions and investment-only growth. The dominant threshold tile is paired with the actual milestone age; an accurately proportioned contribute/Coast phase strip extends that same idea under the chart. Zero Coast duration remains zero, not a decorative stub. Age, contributions and cash-flow assumptions retain their existing meaning.

Keep calculation, route, metadata, privacy, export and print behavior. Improve hierarchy and section rhythm; make forms compact enough that the projection remains visible on desktop. Baseline screenshots: project .taste-skill/visual-before. Prior direction notes below document the earlier implementation and its functional constraints.

Based on ../../../DESIGN_PRINCIPLES.md. Taste skill: Achromatic ledger, seed 497389628. No redraws to style. Shell adapted from icon rail to no-sidebar: a public calculator has only a tool and a guide, so labeled top navigation is discoverable and preserves width.

Question: When can I stop adding to retirement savings?
Face: blue-grey ledger ground, loaded Geist, tabular dollar amounts, blue only on the investment path. Signature: a monthly accumulation path that bends into a no-contributions Coast phase at the computed crossover. No photographs are needed for this working calculator.

Inventory: US single-person planning; today's-dollar results; fixed nominal monthly deposits; exact inflation conversion; moving Coast threshold; zero additional deposits after crossover; three adjustable return scenarios; no login; no financial data transmission; six indexable destinations after configuration.

Argument: input your situation → see the Coast gap and age → inspect the path and assumptions → compare return scenarios → understand age with a labeled fixed-reference table → inspect formulas and boundaries → read the guide and methodology.

Grid: centered 1200px canvas; inputs and results sit side by side on desktop. On narrow screens, show editable inputs first, then the result summary and the full projection. Use keyboard-accessible native fields, details and buttons.

Sample: age 32, retirement 65, investments $150,000, annual portfolio-funded spending $48,000, monthly nominal deposit $1,500. Illustrative assumptions: 7% nominal return, 3% inflation, 4% withdrawal. These are editable demonstration assumptions, not a forecast or a recommended asset allocation. Lower/higher nominal return scenarios shift by two percentage points; no probabilities implied.

Financial fields stay in React memory and do not enter URLs or analytics events. The production domain loads site analytics through Google Tag Manager. Fonts are served locally. The launch check requires valid domain, contact and operator values.

## Result clarity and target-age planning

Nominal return, inflation and withdrawal assumptions stay visible beside the main result, with an Edit assumptions control that opens the settings and focuses nominal return. Mobile editing provides an inline link to the result and a compact live result dock once the input heading scrolls offscreen or while the goal planner is in view. The dock hides while the result is visible and when the reader leaves the calculator. It respects safe-area insets and reduced motion, and its button moves keyboard focus to the result.

The target-age planner is a separate hypothetical calculation until its monthly amount is applied. A whole-number Coast age ranges from current age to full retirement age. It solves for constant nominal month-end deposits using the same effective monthly growth and inflation factors as the main model. Amounts round up to whole dollars. Already-coasting, immediate-gap, invalid-age and above-input-limit states have explicit copy.

Keep example plans in a closed disclosure above the editable fields. The rows show the key inputs for each case and load only on explicit selection. The result identifies the example in use, and the calculator can restore the personal draft from before the examples were loaded. The opening example remains the reference for the formula and age table. No inputs are persisted or transmitted.

## Review corrections and actionable results

Keep the existing Achromatic Ledger direction. Treat retirement-only reachability as a separate result in summary, mobile dock, chart and printout. Preserve actual progress percentages and show the surplus. Clamp desired Coast age when valid main age boundaries change, with status feedback. Place a concrete retirement-saving remedy and apply action inside an unreachable result.

Budget entry supports monthly/yearly units; retirement target always uses annual spending. Contribution inflation adjustment is optional and clearly described, with the selected basis repeated beside results. The Excel export has inputs, results and projection sheets, and a dedicated print view hides interactive controls. All financial processing remains browser-local. Domain, feedback email and operator must all be configured before indexing or release.
