import { createFileRoute } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/editorial-policy')({
  head: () =>
    head(
      'Calculation Methodology & Editorial Policy',
      'Exact inflation adjustment, monthly contribution timing, Coast threshold detection, assumptions and sources for our calculator.',
      '/editorial-policy/',
      false,
      false,
    ),
  component: Page,
});
function Page() {
  return (
    <Article
      title="Methodology & editorial policy"
      intro="The assumptions should be as visible as the answer."
    >
      <h2>The calculation</h2>
      <p>
        The retirement target is annual portfolio-funded spending divided by the withdrawal rate. The current
        Coast threshold is that target discounted by the real growth assumption over the remaining years.
        Effective real return is (1 + nominal return) ÷ (1 + inflation) − 1.
      </p>
      <h2>Monthly timing and Coast detection</h2>
      <p>
        We convert effective annual nominal return and inflation into effective monthly factors using (1 +
        annual rate)^(1/12). Investments grow for a month, then a contribution is added at month-end. The
        default keeps its nominal dollar amount fixed. The optional inflation adjustment treats the entered
        monthly amount as today’s purchasing power and adjusts each future deposit by cumulative monthly
        inflation, including the first month. With deflation, nominal deposits fall. Each month, the
        inflation-adjusted balance is compared with the Coast threshold for the remaining time until
        retirement.
      </p>
      <p>
        When the threshold is first reached, further contributions stop in the Coast path. The “stop now” path
        receives no contributions. Reaching the target only at retirement is reported separately with a
        zero-year pre-retirement Coast phase. Results use today’s purchasing power. The displayed gap is the
        current Coast threshold minus the current balance, floored at zero. The reported age is estimated to
        the month, not a forecast of market timing. Progress text reports the full balance-to-threshold ratio,
        even above 100%; only the visual bar is capped. Monthly and annual spending entry use the same
        annualized target.
      </p>
      <h2>Saving toward a target Coast age</h2>
      <p>
        The target-age planner works backward from the Coast threshold at your chosen age. It converts that
        threshold into future nominal dollars, subtracts the growth of existing investments, and divides the
        remainder by the future-value factor for equal month-end deposits. In inflation-adjusted mode, the
        equivalent calculation uses real monthly growth and a constant monthly deposit in today’s dollars. The
        planner and the main calculator always use the same selected contribution mode.
      </p>
      <p>
        The suggested monthly amount is rounded up to the next whole dollar. Applying it updates the main
        calculator so you can inspect the estimated crossover and projection. An immediate Coast goal with a
        funding gap has no monthly-saving solution; it needs more invested today. Already meeting the current
        threshold requires no additional contributions under the same assumptions.
      </p>
      <p>
        If the current plan does not reach the retirement target, the suggested remedy solves for the monthly
        saving needed by the existing retirement age. Applying that amount does not promise an earlier Coast
        phase. Changing valid main age inputs automatically brings the desired Coast age into their range and
        shows an explanation.
      </p>
      <h2>Demonstration assumptions</h2>
      <p>
        The example starts at age 32, targeting retirement at 65, with $150,000 invested, $48,000 annual
        portfolio-funded spending and $1,500 monthly contributions. Its 7% nominal return, 3% inflation and 4%
        withdrawal rate are illustrative editable inputs. The return and inflation imply approximately 3.88%
        real growth. They are not a forecast, a historical average claim or a recommendation for your
        portfolio.
      </p>
      <p>
        The lower and higher comparisons shift nominal return down and up by two percentage points. They keep
        every other input unchanged. Negative real returns are retained. The fixed age-reference table uses a
        $1,200,000 target, retirement at 65 and a 4% real return, independently of your personal inputs.
      </p>
      <h2>Limits</h2>
      <p>
        No Social Security, pensions, tax calculation, account-access rules, investment fees or variable
        market returns are modeled automatically. Include appropriate costs in your spending budget and
        reflect costs in your return assumption. The tool does not determine whether a particular account can
        be accessed at your planned retirement age. It does not model withdrawals after retirement or assign a
        retirement-success probability.
      </p>
      <h2>Sources and review</h2>
      <p>
        <a href="https://fred.stlouisfed.org/blog/2022/05/constructing-ex-ante-real-interest-rates-on-fred/">
          FRED explains exact real-rate adjustment
        </a>
        .{' '}
        <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator">
          Investor.gov provides a compound-interest calculator
        </a>
        .{' '}
        <a href="https://corporate.vanguard.com/content/dam/corp/research/pdf/vanguard_principles_retirement_income.pdf">
          Vanguard’s retirement-income research
        </a>{' '}
        provides context for real spending and modeling assumptions. These sources do not endorse this website
        or its demonstration rates.
      </p>
      <p>
        Review formulas, automated calculation tests and explanations when the model changes. Review
        country-specific claims before adding them. Change the update date after a substantive review, and
        describe model changes here. Initial implementation: November 5, 2026; independent professional review
        has not been performed.
      </p>
    </Article>
  );
}
