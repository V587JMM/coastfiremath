import { createFileRoute, Link } from '@tanstack/react-router';
import { coastRequirements, dollars, EXAMPLE } from '~/lib/calculator';
import { guideLastModified, head } from '~/lib/seo';
import { Article } from '~/site/article';
import { ContentFaq, faqSchema } from '~/site/content-faq';
import site, { operator } from '../../site.config';

const path = '/what-is-coast-fire/';
const title = 'What Is Coast FIRE? Meaning, Formula & Examples';
const description =
  'Learn what Coast FIRE means, calculate your number in today’s dollars, and compare coasting with full, Barista, Lean and Fat FIRE.';
const image = '/share/coast-fire-guide.png';
const questions = [
  [
    'Can I stop working when I reach Coast FIRE?',
    'You still need income or separate funds to pay living costs until retirement. Reaching the Coast FIRE number means that, under your assumptions, the retirement portfolio could reach its future target without new deposits. Taking withdrawals before retirement changes that calculation.',
  ],
  [
    'Can my Coast FIRE number change after I reach it?',
    'Yes. A change to spending, your retirement age, withdrawal assumptions or the expected real return changes the threshold. A market decline can also leave the portfolio below it, even if your assumptions are unchanged. Recheck the threshold whenever the plan changes.',
  ],
  [
    'Can I keep saving after reaching Coast FIRE?',
    'Yes. The milestone estimates when further deposits become optional under the model. Continuing to save could leave room for a larger budget or an earlier retirement date. The calculator stops adding deposits after the milestone to illustrate what coasting would look like.',
  ],
] as const;

const first = coastRequirements({ ...EXAMPLE, spending: 40000, nominal: 4, inflation: 0 }, 35);
const second = coastRequirements(EXAMPLE, 45);
const third = coastRequirements({ ...EXAMPLE, spending: 60000, nominal: 3 }, 55);

export const Route = createFileRoute('/what-is-coast-fire')({
  head: () =>
    head(title, description, path, false, false, {
      image,
      article: true,
      jsonLd: [
        {
          '@type': 'Article',
          headline: title,
          description,
          mainEntityOfPage: `${site.url}${path}`,
          image: `${site.url}${image}`,
          dateModified: guideLastModified,
          author: { '@type': 'Organization', name: operator, url: `${site.url}/about/` },
        },
        faqSchema(questions),
      ],
    }),
  component: Page,
});
function Page() {
  return (
    <Article
      title="What is Coast FIRE?"
      intro="Fund retirement first. Then let time do more of the work."
      updated="November 6, 2026"
    >
      {operator && (
        <p>
          By <Link to="/about/">{operator}</Link>
        </p>
      )}
      <h2>What does Coast FIRE mean?</h2>
      <p>
        Coast FIRE is the point where your current retirement investments could grow to your retirement target
        without additional contributions. You generally keep earning enough to pay your living costs until
        retirement. Reaching a Coast number does not mean you can stop working today.
      </p>
      <p>
        FIRE stands for financial independence, retire early. The Coast FIRE meaning is narrower. Your
        retirement savings have reached a point where time and assumed growth could cover the rest of the
        journey. You can still work full-time or part-time, depending on what it takes to pay your bills. Your
        planned retirement date is when the portfolio is expected to start covering the spending you assigned
        to it.
      </p>
      <p>
        Think of this as two budgets. One covers life between now and retirement, usually from work or other
        funds. The other covers retirement and sets the target for your investments. If you plan to use
        retirement savings for living costs before that date, include those withdrawals in a separate
        projection. The Coast formula assumes the money remains invested and available to grow.
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
        Use rates in decimal form for the calculation, so 4% becomes 0.04. The withdrawal rate converts a
        spending budget into a target balance. The real investment return determines how much of that balance
        needs to be invested today. The two rates answer different questions and can be set independently.
        Keep the budget and target in the same units when comparing scenarios.
      </p>
      <h2>Three Coast FIRE examples</h2>
      <p>
        These examples all retire at 65 and use a 4% withdrawal assumption. The ages, budgets and returns
        illustrate the calculation. Compare the full retirement target with the amount required today in each
        case. You can reproduce the figures in the <Link to="/">Coast FIRE calculator</Link>.
      </p>
      <h3>Age 35, with $40,000 in annual spending</h3>
      <p>
        Divide $40,000 by 0.04 to get a retirement target of {dollars(first.target)}. With 30 years and a 4%
        real return, divide the target by 1.04 raised to the 30th power. The resulting Coast FIRE number is
        about {dollars(first.coast)}. For this illustration, enter 4% nominal return and 0% inflation to
        represent the stated real rate directly.
      </p>
      <h3>Age 45, with $48,000 in annual spending</h3>
      <p>
        At a 4% withdrawal rate, the retirement target is {dollars(second.target)}. A 7% nominal return and 3%
        inflation give about {(second.real * 100).toFixed(2)}% real growth. Divide the target by the unrounded
        real growth factor raised to the 20th power to get {dollars(second.coast)}. Compared with the first
        example, the higher budget and shorter runway both raise the balance needed today.
      </p>
      <h3>Age 55, with $60,000 in annual spending</h3>
      <p>
        A $60,000 budget divided by 0.04 gives {dollars(third.target)}. With both nominal return and inflation
        at 3%, the real return is zero, and the balance is assumed to keep its buying power over the next ten
        years. The Coast FIRE number is therefore {dollars(third.coast)}, the same amount as the retirement
        target. This example isolates what happens when growth adds no purchasing power.
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
      <p>
        This also lets you compare the result with your current investments in the same units. A future
        balance may be larger in dollars and still buy less than you expect. Expressing both the budget and
        the portfolio in today’s dollars makes it easier to see what the result can support.
      </p>
      <h2>How to prepare your inputs</h2>
      <p>
        Use retirement investments rather than home equity you have not planned to spend. Estimate the yearly
        amount your portfolio must cover, including a budget for healthcare and any taxes it needs to fund.
        This tool does not calculate taxes or automatically estimate Social Security and pensions.
      </p>
      <p>
        Start with a yearly budget that reflects the expenses you expect your investments to pay. If part of
        that budget is covered by another income source, compare a scenario using the remaining amount. If
        income starts after retirement or expenses change substantially, a single annual input only
        approximates the plan. Keep those timing differences visible in a separate budget.
      </p>
      <p>
        By default, the monthly contribution is a fixed dollar amount, deposited at each month-end. A $1,000
        contribution stays $1,000 in future dollars, so inflation gradually reduces its purchasing power.
        Optionally adjust contributions with inflation to preserve the entered buying power each month. Future
        nominal deposits then change, including the first month.
      </p>
      <h2>Coast FIRE vs Barista, Lean and Fat FIRE</h2>
      <p>
        Full FIRE asks whether your portfolio can support withdrawals now. Coast FIRE asks whether you could
        stop contributing now and wait until your chosen retirement age. The labels below describe different
        ways to fund spending or different levels of spending. They can overlap, and there are no fixed dollar
        amounts that separate Lean from Fat FIRE.
      </p>
      <div className="content-table">
        <table>
          <caption>How each FIRE approach covers living costs</caption>
          <thead>
            <tr>
              <th scope="col">Approach</th>
              <th scope="col">How spending is covered</th>
              <th scope="col">Planning question</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Coast FIRE</th>
              <td>Work or separate funds cover current bills while retirement assets remain invested.</td>
              <td>Can growth alone reach my future target?</td>
            </tr>
            <tr>
              <th scope="row">Barista FIRE</th>
              <td>
                Part-time income covers some expenses, with portfolio withdrawals potentially covering the
                rest.
              </td>
              <td>How much do I need to earn or withdraw each year?</td>
            </tr>
            <tr>
              <th scope="row">Lean FIRE</th>
              <td>The portfolio supports a relatively low spending budget.</td>
              <td>What would a smaller retirement budget include?</td>
            </tr>
            <tr>
              <th scope="row">Fat FIRE</th>
              <td>The portfolio supports a larger budget with more discretionary spending.</td>
              <td>How large a portfolio would fund the lifestyle I want?</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Someone can coast toward either a Lean or a Fat retirement budget. Those labels change the spending
        assumption, while coasting changes how you get there. If you plan to combine part-time income with
        withdrawals before retirement, as in some Barista FIRE plans, you need a projection that tracks those
        cash flows. The Coast calculator assumes the retirement balance stays invested until the date you
        select.
      </p>
      <h2>A scenario is not a probability</h2>
      <p>
        Lower, base and higher returns explore sensitivity to one assumption. They are smooth growth
        projections, not Monte Carlo simulations, historical backtests or confidence intervals. A withdrawal
        rate is also an assumption, not a promise your savings will last.
      </p>
      <p>
        Try changing one assumption at a time so you can tell what moved the result. Then compare a scenario
        with several changes together, such as lower returns and higher spending. An estimate that moves
        substantially under small changes gives you a reason to revisit the plan before relying on one dollar
        figure or one date.
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
      <h2>Coast FIRE FAQ</h2>
      <ContentFaq questions={questions} />
    </Article>
  );
}
