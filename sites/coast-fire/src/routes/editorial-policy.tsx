import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/editorial-policy')({
  head: () =>
    head(
      'Calculation Methodology & Editorial Policy',
      'Check the Coast FIRE and FIRE number formulas, inflation adjustments, and monthly savings projections with worked examples you can reproduce in a spreadsheet.',
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
      intro="See how the calculator works and verify the results with worked examples."
      updated="November 16, 2026"
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
      <h2 id="calculation-validation">Calculation Validation</h2>
      <p>
        Reproduce these examples in a spreadsheet or enter the same assumptions in the{' '}
        <Link to="/" hash="starting-point">
          Coast FIRE calculator
        </Link>
        . Every example starts at age 30, targets retirement at 65, and uses $48,000 in annual spending from
        investments and a 4% withdrawal rate. That gives a retirement target of $48,000 ÷ 0.04 = $1,200,000 in
        today’s dollars. Keep intermediate values unrounded and round the displayed balances to the nearest
        dollar.
      </p>
      <h3>1. Base case at age 30</h3>
      <p>
        <strong>Inputs.</strong> $150,000 invested, $1,500 per month in fixed dollar contributions, 7% nominal
        annual return, and 3% annual inflation.
      </p>
      <p>
        Divide 1.07 by 1.03 to get the annual growth factor after inflation, A. The real return is A − 1, or
        about 3.88%. Divide $1,200,000 by A<sup>35</sup> to get a Coast FIRE number of{' '}
        <strong>$316,266</strong>. Subtract $150,000 to get a gap of <strong>$166,266</strong>.
      </p>
      <p>
        To verify the timeline, let g = 1.07<sup>1/12</sup> and p = 1.03<sup>1/12</sup>. At month m, grow the
        starting balance by g<sup>m</sup>, add $1,500 × (g<sup>m</sup> − 1) ÷ (g − 1) for month-end deposits,
        and divide the total by p<sup>m</sup> to get its buying power. Compare that balance with the
        retirement target divided by A raised to the remaining years, 35 − m ÷ 12. At month 174 the balance is
        $548,754 against a $549,512 threshold. At month 175 it is $551,474 against $551,259, so contributions
        stop at <strong>age 44 years, 7 months</strong> in the model.
      </p>
      <h3>2. Investment return equals inflation</h3>
      <p>
        <strong>Inputs.</strong> $150,000 invested, $0 per month in fixed dollar contributions, and 3% for
        both nominal annual return and annual inflation.
      </p>
      <p>
        The real return is 1.03 ÷ 1.03 − 1 = <strong>0%</strong>. Discounting $1,200,000 by 1 raised to 35
        leaves a Coast FIRE number of <strong>$1,200,000</strong>. The gap is $1,050,000, and the portfolio
        stays at $150,000 in today’s dollars without deposits, so the model shows no Coast date.
      </p>
      <h3>3. Already at Coast FIRE</h3>
      <p>
        <strong>Inputs.</strong> $350,000 invested, $1,500 per month in fixed dollar contributions, 7% nominal
        annual return, and 3% annual inflation.
      </p>
      <p>
        The Coast threshold is the same $316,266 as in case 1. The starting balance is about $33,734 above it,
        so the model shows <strong>Coast FIRE now</strong> and needs <strong>$0 more per month</strong>. With
        deposits stopped from the start, both paths project $350,000 × A<sup>35</sup>, or about $1,327,998 at
        age 65.
      </p>
      <h3>4. No new monthly savings</h3>
      <p>
        <strong>Inputs.</strong> $150,000 invested, $0 per month in fixed dollar contributions, 7% nominal
        annual return, and 3% annual inflation.
      </p>
      <p>
        Both projection paths compound the same starting balance with no deposits. At retirement they both
        equal $150,000 × A<sup>35</sup>, or about <strong>$569,142</strong>. That is below the $1,200,000
        retirement target, and the balance stays below the Coast threshold throughout, so the model shows{' '}
        <strong>no Coast date</strong>.
      </p>
      <h3>5. Monthly savings for two target Coast ages</h3>
      <p>
        <strong>Inputs.</strong> $150,000 invested, an initial monthly contribution of $1,500, 7% nominal
        annual return, and 3% annual inflation. Turn on <strong>Adjust contributions with inflation</strong>.
        Use 40 and 45 as separate target Coast ages, then apply each suggested monthly amount to check the
        forward projection.
      </p>
      <p>
        Work in today’s dollars. For a goal age G, discount $1,200,000 by A raised to 65 − G. Let n be (G −
        30) × 12 and r = A<sup>1/12</sup>. The starting balance grows to $150,000 × r<sup>n</sup>. Subtract
        that from the goal threshold and divide by (r<sup>n</sup> − 1) ÷ (r − 1) to get the monthly deposit.
        Round up to a whole dollar, then multiply by the same factor to find the value of the deposits at the
        goal. Add the grown starting balance and compare it with the threshold.
      </p>
      <div className="content-table">
        <table>
          <caption>Reverse estimates and forward checks in today’s dollars</caption>
          <thead>
            <tr>
              <th scope="col">Calculation</th>
              <th scope="col">Goal at 40</th>
              <th scope="col">Goal at 45</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Months to goal</th>
              <td>120</td>
              <td>180</td>
            </tr>
            <tr>
              <th scope="row">Starting balance grown to goal</th>
              <td>$219,562</td>
              <td>$265,638</td>
            </tr>
            <tr>
              <th scope="row">Monthly deposit before whole-dollar rounding</th>
              <td>$1,668.86</td>
              <td>$1,214.58</td>
            </tr>
            <tr>
              <th scope="row">Monthly deposit to apply</th>
              <td>$1,669</td>
              <td>$1,215</td>
            </tr>
            <tr>
              <th scope="row">Balance vs. threshold one month before goal</th>
              <td>$459,821 vs. $461,465</td>
              <td>$557,196 vs. $558,305</td>
            </tr>
            <tr>
              <th scope="row">Balance vs. threshold at goal</th>
              <td>$462,953 vs. $462,932</td>
              <td>$560,183 vs. $560,080</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        For the prior month, use one fewer deposit and one more month of growth remaining to retirement. In
        both examples the portfolio is still below the threshold in the prior month and first clears it at the
        goal age.
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
        every other input unchanged. Negative real returns are retained. The homepage age-reference table uses
        the same demonstration spending, retirement age, and return assumptions across all starting ages.
      </p>
      <h2 id="fire-number-methodology">FIRE number and accumulation timeline</h2>
      <p>
        The <Link to="/fire-number-calculator/">FIRE number calculator</Link> divides annual portfolio-funded
        spending by the initial withdrawal assumption as a decimal. At $48,000 of annual spending and 4%, this
        gives $1,200,000. With $300,000 invested, progress is 25% and the current funding gap is $900,000.
        Progress text can exceed 100%; the visual bar stops at 100%. Monthly spending is multiplied by 12
        before calculating the target. The expected investment return does not change the FIRE number.
      </p>
      <p>
        Its optional timeline uses a real annual return after inflation and fees, converted to an effective
        monthly growth factor. Each month the existing balance grows, then a contribution is added at
        month-end. Contributions are constant in today's purchasing power, so future nominal deposits are
        assumed to rise with inflation. This differs from the homepage's default fixed nominal deposits. With
        zero real growth, $300,000 invested and $2,500 a month reach a $1,200,000 target after 360 months.
      </p>
      <p>
        The projection stops at the first month that reaches the target, using a relative rounding tolerance
        of one trillionth at the boundary. If it does not reach the target by age 100, it reports that limit
        and the ending balance; it does not invent a retirement date. Already-funded targets have a zero-month
        accumulation period. The model makes no withdrawals during accumulation and does not simulate the
        subsequent retirement. It does not assess a withdrawal rate's success probability.
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
