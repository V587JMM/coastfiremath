import { Link } from '@tanstack/react-router';
import { BARISTA_EXAMPLE, baristaAgeRows, calculateBarista } from '~/lib/barista';
import { coastRequirements, dollars } from '~/lib/calculator';
import { baristaLastModified } from '~/lib/seo';
import { ContentFaq } from './content-faq';

export const baristaFaq = [
  [
    'What is Barista FIRE?',
    'Barista FIRE is a form of semi-retirement that combines part-time earnings with investment withdrawals to pay living costs. You save enough that a smaller job can replace some of your former salary. Unlike full financial independence, the plan still depends on earned income. The calculator estimates the portfolio required for that combination and checks what happens when the job ends.',
  ],
  [
    'How much money do I need for Barista FIRE?',
    'Start with annual spending minus after-deduction part-time income, then divide the remaining gap by your withdrawal rate. With $40,000 spending and $20,800 take-home pay, a 4% assumption gives a $480,000 income-gap target. That is only the first check. If the income stops at 65, you also need enough to fund the intervening withdrawals and arrive at a full retirement target. The calculator shows the larger requirement.',
  ],
  [
    'Does Barista FIRE mean working in a coffee shop?',
    'No. The name describes the funding approach rather than a required occupation. Consulting, tutoring, retail, seasonal work or another part-time role can provide the income. Use pay and hours you could realistically maintain, account for unpaid weeks and commuting costs, and check the actual benefit terms. The example does not imply that every part-time job pays $25 an hour or provides health insurance.',
  ],
  [
    'Is Barista FIRE the same as Coast FIRE?',
    'They answer different questions. A Coast FIRE calculation assumes your retirement portfolio stays invested without withdrawals while work or separate funds cover current expenses. A Barista FIRE plan can draw from that portfolio before full retirement because part-time pay covers only some bills. If your earnings cover all spending and you leave retirement assets untouched, the two approaches can overlap.',
  ],
  [
    'Can I Barista FIRE with $500,000?',
    'Possibly under some assumptions, but a balance alone cannot answer the question. At a 4% starting rate, $500,000 corresponds to $20,000 of annual portfolio withdrawals. Add realistic take-home earnings and compare the total with your spending. Then test the age when you will stop working. Enter $500,000 above to see both the initial withdrawal check and the later retirement funding check.',
  ],
  [
    'What happens if my part-time income covers all my expenses?',
    'The current spending gap and income-gap target become zero. The full plan does not automatically need zero investments: you still need a portfolio for the years after part-time work ends. This calculator discounts that full retirement target to today. Earnings above spending are not automatically invested, and the model assumes no new contributions during the part-time period.',
  ],
  [
    'Does this Barista FIRE calculator include taxes and inflation?',
    'It reduces gross part-time pay by your entered income-deduction percentage; it does not calculate your tax return. Include any taxes on portfolio withdrawals in annual spending yourself. It converts the nominal investment return into an exact real return using inflation, and assumes wages and spending keep pace with inflation. Every result is in today’s dollars, so do not inflate your spending input again.',
  ],
  [
    'What if I lose my job or stop working earlier?',
    'Set weekly hours to zero to see a no-earned-income scenario, or lower paid weeks to model a shorter working year. Move stop-work age earlier to test a shorter part-time period. These edits do not simulate an unexpected job loss halfway through the plan. Keep a separate cash reserve and review which expenses could change if income disappears or healthcare coverage changes.',
  ],
] as const;

const example = calculateBarista(BARISTA_EXAMPLE);
const coast = coastRequirements(BARISTA_EXAMPLE, BARISTA_EXAMPLE.age);
const rows = baristaAgeRows();

export function BaristaGuide() {
  return (
    <div className="article-body barista-guide">
      <section aria-labelledby="what-is-barista-fire">
        <h2 id="what-is-barista-fire">What is Barista FIRE?</h2>
        <p>
          Barista FIRE is a way to leave full-time work by combining a smaller earned income with money from
          investments. FIRE stands for financial independence, retire early. In this version, you remain
          partly dependent on work: a part-time job pays some of the bills, and your portfolio covers the
          rest. The goal is often a more manageable schedule before you can afford to stop earning altogether.
        </p>
        <p>
          You do not have to become a barista. The income could come from tutoring, consulting or a seasonal
          role that fits your life. What matters is the cash flow you can keep after deductions, and how
          reliably it arrives. A job that looks attractive on an hourly basis might provide fewer paid weeks,
          unpredictable shifts or additional travel expenses. Enter a realistic yearly work pattern rather
          than assuming every available hour will be paid.
        </p>
        <p>
          Consider someone spending $40,000 a year and earning $25 an hour for 20 hours a week. Working 52
          paid weeks produces $26,000 before deductions. With the example’s 20% deduction assumption,
          take-home pay is $20,800. The investments must supply the remaining $19,200, or $1,600 a month. That
          monthly split is the starting point for this calculator, rather than replacing a former full-time
          salary dollar for dollar.
        </p>
        <p>
          The distinction from full retirement matters. A plan that works while you earn $20,800 may need a
          substantially larger portfolio once that income ends. Set a stop-work age above to make that
          transition explicit. If you are still deciding which milestone you want, the{' '}
          <Link to="/what-is-coast-fire/">guide to Coast FIRE</Link> explains what it means to stop adding to
          retirement savings while leaving the balance untouched.
        </p>
        <p>
          Before using a job’s advertised benefits to reduce your spending estimate, check what you would
          actually receive at your planned hours. Healthcare premiums, deductibles and costs for dependents
          belong in the budget even when an employer provides coverage. Keep money for emergencies separate
          from the investment balance entered above. A cash reserve can cover an unpaid break or a large
          repair without making the retirement projection appear better funded than it is. This tool combines
          your investments into one balance, so you also need to check which accounts can supply the early
          withdrawals when you need them.
        </p>
      </section>
      <section aria-labelledby="barista-formula">
        <h2 id="barista-formula">Barista FIRE formula and algorithm</h2>
        <h3>Find the income your investments must replace</h3>
        <p>
          Begin with annual spending in today’s dollars. Include housing, food, healthcare, insurance, travel
          and an allowance for irregular bills. Include taxes that withdrawals must fund as well. Then
          calculate part-time earnings from your hourly pay, weekly hours and paid weeks. The income-deduction
          percentage is your own estimate for taxes and other payroll deductions; the calculator does not
          infer a tax bracket or benefits eligibility.
        </p>
        <pre>
          Gross income = hourly pay × weekly hours × paid weeks{'\n'}
          Take-home income = gross income × (1 − deduction rate){'\n'}
          Annual gap = max(0, annual spending − take-home income){'\n'}
          Income-gap target = annual gap ÷ withdrawal rate
        </pre>
        <p>
          Use rates as decimals in these formulas: 20% becomes 0.20 and 4% becomes 0.04. In the fixed example,
          $19,200 divided by 0.04 gives {dollars(example.incomeGapTarget)}. This familiar shortcut limits the
          initial withdrawal to your selected percentage. It does not account for the eventual loss of the job
          income, so it is displayed as one check within the result.
        </p>
        <h3>Fund the bridge to full retirement</h3>
        <p>
          The second check asks what balance can fund monthly withdrawals until your stop-work age and still
          reach a full retirement target on that date. Spending stays the same in purchasing power throughout
          both phases. The model assumes income keeps up with inflation during part-time work and becomes zero
          when that work ends. Surplus earnings are not added to investments, and no new contributions are
          included.
        </p>
        <pre>
          Real return = (1 + nominal return) ÷ (1 + inflation) − 1{'\n'}m = (1 + real return) ^ (1 ÷ 12) − 1
          {'\n'}N = (stop-work age − current age) × 12{'\n'}F = annual spending ÷ withdrawal rate{'\n'}
          Bridge target = (annual gap ÷ 12) × [1 − (1 + m) ^ (−N)] ÷ m{'\n'}
          {'  '}+ F ÷ (1 + m) ^ N{'\n'}
          Portfolio needed today = max(income-gap target, bridge target)
        </pre>
        <p>
          Here, m is the effective monthly real return, N is the number of months of part-time work, and F is
          the full retirement target. Withdrawals occur at month-end after that month’s growth. With zero real
          return, the bridge formula becomes monthly gap × N + F. If the stop-work age equals your current
          age, there is no part-time phase: the required amount is the full retirement target and the
          calculator counts no work income.
        </p>
        <p>
          With 7% nominal growth and 3% inflation, the exact real return is about{' '}
          {(example.real * 100).toFixed(2)}%. For the age-35 example, the discounted cost of the withdrawals
          is {dollars(example.bridgeCost)}, and the discounted retirement reserve is{' '}
          {dollars(example.discountedRetirement)}. Together they require {dollars(example.bridgeTarget)}{' '}
          today. That exceeds the {dollars(example.incomeGapTarget)} shortcut, so the larger bridge figure
          becomes the headline result. The calculator uses unrounded values internally; displayed dollar
          amounts are rounded.
        </p>
        <h3>Read the result as a scenario</h3>
        <p>
          The projected balance uses your current investments, the same real monthly growth and the spending
          gap. If investments run out, the projection stops at zero and reports when the first shortfall
          occurs. A result above the target means the two modeled checks are met; it is not a probability of
          success. The model does not simulate market volatility, changing asset allocations, account-access
          rules, pensions or Social Security.
        </p>
        <p>
          A smooth return can hide the effect of losses early in a withdrawal period.{' '}
          <a href="https://www.blackrock.com/us/individual/literature/investor-education/sequence-of-returns-one-pager-va-us.pdf">
            BlackRock’s sequence-of-returns illustration
          </a>{' '}
          shows why the order of returns matters once withdrawals begin. Try lower investment growth, fewer
          paid weeks and a higher spending budget, then compare the revised funding gap. A 4% input is an
          illustration, and a longer retirement needs its own withdrawal analysis.
        </p>
        <p>
          Make the income assumptions earn their place in the plan. Changing paid weeks from 52 to 46 reduces
          gross earnings in this example from $26,000 to $23,000, and take-home pay from $20,800 to $18,400.
          The annual portfolio gap rises by $2,400 without any change in your lifestyle. Next, test a return
          two percentage points below your first estimate while keeping inflation unchanged. Comparing one
          change at a time makes the trade-off visible. Finally, combine fewer working weeks, lower growth and
          higher spending to see whether your available investments still meet both funding checks.
        </p>
      </section>
      <section aria-labelledby="barista-by-age">
        <h2 id="barista-by-age">Barista FIRE numbers by age and spending</h2>
        <p>
          These fixed examples compare annual spending of $40,000, $60,000 and $80,000. Each cell is the
          portfolio needed at the starting age, using the larger of the two checks above. Every row assumes
          $25 an hour, 20 hours a week, 52 paid weeks, 20% income deductions, 7% nominal return, 3% inflation,
          a 4% withdrawal rate and a stop-work age of 65. The table stays fixed when you edit the personal
          calculator.
        </p>
        <p className="barista-table-hint">Scroll sideways on a small screen to see all three budgets.</p>
        <section
          className="content-table barista-age-table"
          aria-label="Barista FIRE targets by age and annual spending"
          // biome-ignore lint/a11y/noNoninteractiveTabindex: The scroll region needs keyboard access.
          tabIndex={0}
        >
          <table>
            <caption>Fixed example · Portfolio needed in today’s dollars</caption>
            <thead>
              <tr>
                <th scope="col">Starting age</th>
                <th scope="col">$40k / year</th>
                <th scope="col">$60k / year</th>
                <th scope="col">$80k / year</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ age, years, targets }) => (
                <tr key={age}>
                  <th scope="row">
                    {age}
                    <small>{years} years to 65</small>
                  </th>
                  {targets.map((target, i) => (
                    <td key={[40000, 60000, 80000][i]}>{dollars(target)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p>
          Read across a row to see the effect of spending while pay and age stay fixed. Take-home pay remains
          $20,800, so the portfolio must provide $19,200, $39,200 or $59,200 a year respectively. A larger
          budget increases both the withdrawals during the part-time phase and the full retirement target.
          This makes the cost of a permanent spending increase clearer than comparing hourly wages alone.
        </p>
        <p>
          Read down a column to compare starting ages. The stop-work date stays at 65. Starting younger gives
          investments more time to grow, but also adds more years of bridge withdrawals. With different return
          or withdrawal assumptions, the income-gap check can dominate several rows, producing the same
          headline amount at different ages. A flat result is therefore possible. For an age comparison with
          no early withdrawals, use the{' '}
          <Link to="/coast-fire-calculator-by-age/">Coast FIRE calculator by age</Link>.
        </p>
      </section>
      <section aria-labelledby="barista-vs-coast">
        <h2 id="barista-vs-coast">Barista FIRE vs Coast FIRE</h2>
        <p>
          The practical difference is whether your retirement investments help pay bills before full
          retirement. Coast FIRE leaves that portfolio untouched and relies on work or separate funds for
          current living costs. Barista FIRE allows a split: earnings pay some bills, investments pay the
          rest. Neither label determines a particular job or number of weekly hours. A part-time worker can
          follow either approach, depending on whether earnings cover the budget.
        </p>
        <p>
          Planning for the point when part-time pay ends? The{' '}
          <Link to="/fire-number-calculator/">FIRE number calculator</Link> compares portfolio targets for
          funding your full retirement budget at different withdrawal rates.
        </p>
        <div className="content-table">
          <table>
            <caption>Compare the cash-flow assumptions before comparing balances</caption>
            <thead>
              <tr>
                <th scope="col">Planning question</th>
                <th scope="col">Barista FIRE</th>
                <th scope="col">Coast FIRE</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Who pays today’s bills?</th>
                <td>Part-time earnings plus portfolio withdrawals for any gap.</td>
                <td>Work or separate funds cover all current bills.</td>
              </tr>
              <tr>
                <th scope="row">Are there early withdrawals?</th>
                <td>Yes, when take-home pay falls below spending.</td>
                <td>No withdrawals from the retirement portfolio.</td>
              </tr>
              <tr>
                <th scope="row">What does the target check?</th>
                <td>Current withdrawals and the transition when earned income ends.</td>
                <td>Growth to a future retirement target without new contributions.</td>
              </tr>
              <tr>
                <th scope="row">What needs a backup?</th>
                <td>Job income, spending flexibility and withdrawal funding.</td>
                <td>Living-cost income and the assumed investment growth.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          At age 35, a $40,000 retirement budget, retirement at 65 and the default rates give a Coast number
          of {dollars(coast.coast)}. The Barista example requires {dollars(example.required)} because the
          portfolio also funds a $19,200 annual gap before 65. The lower Coast number does not buy the same
          current lifestyle on $20,800 of earnings: another source must pay the rest of the bills. Compare
          both the balance and the required cash flow.
        </p>
        <p>
          If part-time take-home pay covers the entire budget, early withdrawals fall to zero and the bridge
          calculation reduces to the Coast formula. If you prefer that approach, use the{' '}
          <Link to="/">Coast FIRE calculator</Link> to estimate when further retirement contributions could
          become optional. If you expect to draw from investments sooner, keep the Barista calculation and
          test the loss of work income rather than treating the two targets as interchangeable.
        </p>
      </section>
      <section aria-labelledby="barista-faq">
        <h2 id="barista-faq">Barista FIRE FAQ</h2>
        <ContentFaq questions={baristaFaq} />
      </section>
      <p className="review-date">
        Updated <time dateTime={baristaLastModified}>November 18, 2026</time> ·{' '}
        <Link to="/editorial-policy/">Our calculation methodology</Link>
      </p>
    </div>
  );
}
