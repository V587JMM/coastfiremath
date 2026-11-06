import { Link } from '@tanstack/react-router';
import { coastAgeRows, coastRequirements, dollars, EXAMPLE } from '~/lib/calculator';
import { ContentFaq } from './content-faq';

const ageNotes = [
  'A long runway gives a relatively small balance more time to grow. It also leaves more time for your spending plans, housing or retirement date to change. Try a lower return and a higher spending estimate alongside the example. If the threshold moves substantially, treat it as a range to revisit as you learn more about the life you want to fund.',
  'The balance shown is what would need to be invested at 30 under the same retirement assumptions. If you already have some investments, compare the number with assets you actually intend to leave invested. The difference is a funding gap today. How long it takes to close depends on future contributions and returns, which the personal calculator models separately.',
  'There is still time for compounding, but five fewer years than at 30 means a higher threshold at the same positive real return. This is a useful age to compare budgets. A permanent increase in annual portfolio-funded spending raises both the retirement target and the amount you need today. An expense that ends before retirement belongs in your current budget instead.',
  'Use this row as a checkpoint against a plan with the same spending and retirement age. A lower return assumption can make a material difference even with decades left. If you plan to pause contributions for a few years, look at both the stop-now and continued-saving paths in the personal calculator. The age table assumes the pause lasts until retirement.',
  'The shorter runway puts more weight on your current balance. If you plan to leave full-time work at 45, make a separate budget for the years before retirement. The number in this row assumes you leave retirement savings invested, so taking money from the portfolio during those years would change the path shown in the table.',
  'At 50, compare the amount needed at your chosen retirement age with an earlier or later date. Moving the retirement age changes the time available for compounding. Keep the spending assumption fixed for the first comparison so you can isolate the effect of time. Then revisit healthcare and other costs that could differ between the two retirement dates.',
  'The estimate is now closer to the full retirement target. A few extra years still matter, but a return assumption has less time to compound than it did at 30. Check when you expect different income sources to start. A single spending input cannot describe a budget that changes sharply before and after a pension or other income begins.',
  'With only a short Coast period, you need much of the retirement target already invested. In the example, age 60 leaves five years before retirement. If your target retirement age is 60, the row instead shows the full target. Account access and the timing of withdrawals can matter at this point, and neither is modeled by this comparison.',
];

export const ageFaq = [
  [
    'How do I read the age table?',
    'Pick the starting age you want to compare. The last column estimates the investment balance you would need at that age if you contributed nothing more before your chosen retirement date. Every row uses the same retirement spending and rate assumptions. Use the main calculator for your exact current age and balance.',
  ],
  [
    'Why does age 60 usually require more than age 30?',
    'At a positive real return, thirty-five years of growth can do more work than five. With retirement at 65 and the same spending goal, a person starting to coast at 60 needs more invested upfront. If the assumed real return is negative, the direction reverses in this model.',
  ],
  [
    'Why does zero real return make every row equal the target?',
    'A zero real return means the investment balance is assumed to keep its purchasing power exactly. There is no growth in today’s dollars to close a funding gap. The Coast FIRE number therefore equals the full retirement target, no matter how many years remain.',
  ],
  [
    'What if my age is between two rows?',
    'The table uses five-year steps so you can compare horizons at a glance. Enter your exact current age in the main Coast FIRE calculator to get a personal number. The difference between rows comes from compounding, so averaging the two adjacent dollar amounts only gives an approximation.',
  ],
  [
    'Why did some rows disappear when I changed retirement age?',
    'A Coast period can only start before or at the retirement age. When you set retirement to 55, the table leaves out age 60. The row for age 55 has zero years to grow and shows the full retirement target. A retirement age below 25 leaves no rows in this tool.',
  ],
  [
    'Which spending number should I enter?',
    'Enter the annual amount you expect the portfolio to cover during retirement, in today’s dollars. If you estimate a reliable income stream separately, use the remaining spending for a like-for-like scenario. This model uses one spending figure, so it cannot account for income that starts later or expenses that change year by year.',
  ],
] as const;

const spendingLevels = [36000, 48000, 60000];
const realReturns = [2, 4, 6];
const baselineRows = coastAgeRows(EXAMPLE);
const baseline = coastRequirements(EXAMPLE, 40);

export function AgeGuide() {
  return (
    <div className="article-body age-guide">
      <section aria-labelledby="age-formula">
        <h2 id="age-formula">How to calculate Coast FIRE by age</h2>
        <p>
          Start with the annual amount your portfolio needs to cover and divide it by your withdrawal rate.
          This gives the balance you want at retirement. Then divide that balance by the real growth factor
          raised to the number of years between the starting age and retirement. The result is what you would
          need invested at the starting age to reach the target through growth alone.
        </p>
        <p>
          The Coast FIRE number calculator above uses a nominal return and inflation to find the real growth
          rate. In the default example, {dollars(EXAMPLE.spending)} of annual spending divided by{' '}
          {EXAMPLE.withdrawal}% gives a {dollars(baseline.target)} retirement target. With a {EXAMPLE.nominal}
          % nominal return and {EXAMPLE.inflation}% inflation, the real return is about{' '}
          {(baseline.real * 100).toFixed(2)}%. At age 40, there are 25 years until retirement at 65 and the
          resulting Coast FIRE number is {dollars(baseline.coast)}.
        </p>
        <p>
          If you’re new to the distinction between stopping contributions and stopping work, read{' '}
          <Link to="/what-is-coast-fire/">what Coast FIRE means</Link> first. It explains which costs you
          still need to cover and includes examples you can reproduce in the{' '}
          <Link to="/">personal calculator</Link>.
        </p>
      </section>
      <section aria-labelledby="age-checkpoints">
        <h2 id="age-checkpoints">What each starting age means</h2>
        <p>
          The checkpoints below are a fixed example using the calculator’s default assumptions. The live table
          above reflects your edits. These amounts compare starting ages under one retirement goal and do not
          tell you what balance someone your age should have saved.
        </p>
        {baselineRows.map(({ age, coast, years }, index) => (
          <div key={age}>
            <h3>Age {age}</h3>
            <p>
              <strong>{dollars(coast)}</strong> with {years} years until retirement. {ageNotes[index]}
            </p>
          </div>
        ))}
      </section>
      <section aria-labelledby="age-sensitivity">
        <h2 id="age-sensitivity">How spending and returns change the number</h2>
        <p>
          The table below fixes starting age at 40, retirement at 65 and the withdrawal rate at 4%. Read
          across to change the assumed real return while spending stays fixed. Read down to change spending
          while the return stays fixed. These figures are a separate illustration and stay in place when you
          edit the calculator.
        </p>
        <div className="content-table">
          <table className="age-table">
            <caption>Coast FIRE numbers at 40 in today’s dollars</caption>
            <thead>
              <tr>
                <th scope="col">Annual spending</th>
                {realReturns.map((rate) => (
                  <th scope="col" key={rate}>
                    {rate}% real
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spendingLevels.map((spending) => (
                <tr key={spending}>
                  <th scope="row">{dollars(spending)}</th>
                  {realReturns.map((rate) => (
                    <td key={rate}>
                      {dollars(
                        coastRequirements({ ...EXAMPLE, spending, nominal: rate, inflation: 0 }, 40).coast,
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Spending changes the target proportionally. For example, going from $48,000 to $60,000 adds a
          quarter to the required balance at every return shown. Returns affect the compounded growth over the
          full 25 years, so the differences across a row are not proportional to the rates. Use the
          lower-return and higher-spending cells to see how much room your plan has if both assumptions move.
        </p>
        <p>
          Compare the estimate with the investments you plan to leave untouched. A balance above one cell and
          below another tells you which assumptions would have to hold for you to stop contributing under this
          model. If the gap matters to your decision, return to the personal calculator and enter the monthly
          amount you can realistically save. That adds the contribution path the age comparison intentionally
          leaves out.
        </p>
      </section>
      <section aria-labelledby="age-faq">
        <h2 id="age-faq">Coast FIRE by age FAQ</h2>
        <ContentFaq questions={ageFaq} />
      </section>
    </div>
  );
}
