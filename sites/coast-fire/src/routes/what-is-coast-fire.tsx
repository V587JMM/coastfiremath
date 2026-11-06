import { createFileRoute, Link } from '@tanstack/react-router';
import { head } from '~/lib/seo';
import { Article } from '~/site/article';
export const Route = createFileRoute('/what-is-coast-fire')({
  head: () =>
    head(
      'What Is Coast FIRE? Formula, Examples & Limits',
      'Understand Coast FIRE, calculate your number in today’s dollars, and learn the difference between coasting and retiring.',
      '/what-is-coast-fire/',
      false,
      false,
    ),
  component: Page,
});
function Page() {
  return (
    <Article title="What is Coast FIRE?" intro="Fund retirement first. Then let time do more of the work.">
      <h2>Enough invested to stop adding</h2>
      <p>
        Coast FIRE is the point where your current retirement investments could grow to your retirement target
        without additional contributions. You generally keep earning enough to pay your living costs until
        retirement. Reaching a Coast number does not mean you can stop working today.
      </p>
      <h2>The Coast FIRE formula</h2>
      <p>
        First divide your annual portfolio-funded retirement spending by your withdrawal-rate assumption. Then
        discount that target by your assumed real investment growth over the years until retirement.
      </p>
      <pre>
        Retirement target = annual spending ÷ withdrawal rate
        <br />
        Coast number = target ÷ (1 + real return) ^ years
      </pre>
      <p>
        For an illustration, $40,000 in annual spending and a 4% withdrawal assumption produce a $1,000,000
        target. With 30 years until retirement and a 4% real return, the Coast number is about $308,319.
        Change any assumption and the answer changes. These are example assumptions, not a recommendation.
      </p>
      <p>
        To see what age alone changes, use the{' '}
        <Link to="/coast-fire-calculator-by-age/">Coast FIRE Calculator by Age</Link>. It holds your
        retirement age, spending and rates constant across starting ages.
      </p>
      <h2>What “today’s dollars” means</h2>
      <p>
        A $40,000 spending goal means the lifestyle that $40,000 buys today. To compare like with like, the
        model removes inflation from future balances. Exact real return is (1 + nominal return) ÷ (1 +
        inflation) − 1. Do not subtract inflation again from an already-real return.
      </p>
      <h2>How to prepare your inputs</h2>
      <p>
        Use retirement investments rather than home equity you have not planned to spend. Estimate the yearly
        amount your portfolio must cover, including a budget for healthcare and any taxes it needs to fund.
        This tool does not calculate taxes or automatically estimate Social Security and pensions.
      </p>
      <p>
        By default, the monthly contribution is a fixed dollar amount, deposited at each month-end. A $1,000
        contribution stays $1,000 in future dollars, so inflation gradually reduces its purchasing power.
        Optionally adjust contributions with inflation to preserve the entered buying power each month. Future
        nominal deposits then change, including the first month.
      </p>
      <h2>Coasting versus full FIRE</h2>
      <p>
        Full FIRE asks whether your portfolio can support withdrawals now. Coast FIRE asks whether you could
        stop contributing now and wait until your chosen retirement age. You still need to fund the years in
        between. Barista FIRE involves part-time income and potentially portfolio withdrawals; this calculator
        does not model that cash flow.
      </p>
      <h2>A scenario is not a probability</h2>
      <p>
        Lower, base and higher returns explore sensitivity to one assumption. They are smooth growth
        projections, not Monte Carlo simulations, historical backtests or confidence intervals. A withdrawal
        rate is also an assumption, not a promise your savings will last.
      </p>
      <h2>Choose an age to stop contributing</h2>
      <p>
        If you have a milestone in mind, use the calculator’s target-age planner to estimate the fixed monthly
        saving needed to reach Coast FIRE by that age. Your full retirement age stays unchanged. Apply the
        monthly amount to compare the resulting path with your current plan. The estimate changes when your
        spending, investments, return, inflation or withdrawal assumptions change.
      </p>
      <h2>Put your own numbers to work</h2>
      <p>
        <Link to="/">Use the Coast FIRE calculator</Link> to compare stopping contributions now with
        continuing until your moving Coast threshold is reached. Read the{' '}
        <Link to="/editorial-policy/">calculation methodology</Link> for details and limits.
      </p>
    </Article>
  );
}
