import { Link } from '@tanstack/react-router';
import { dollars } from '~/lib/calculator';
import { calculateFireNumber } from '~/lib/fire-number';
import { ContentFaq } from './content-faq';

const questions = [
  [
    'What is a FIRE number?',
    'Your FIRE number is an estimated investment balance that corresponds to your annual retirement spending at a chosen initial withdrawal rate. FIRE means financial independence, retire early. The number is a planning target, not a test of whether a portfolio can survive a specific retirement.',
  ],
  [
    'Is my FIRE number 25 times my salary?',
    'Use the annual spending your investments need to fund, not your salary. At a 4% initial withdrawal assumption the target is 25 times that spending. Someone earning $120,000 and planning $60,000 of annual portfolio-funded spending would have a $1.5 million target at 4%.',
  ],
  [
    'How much do I need to retire on $5,000 a month?',
    'A $5,000 monthly budget is $60,000 a year. Dividing by 4% gives $1.5 million; at 3.5% it is about $1.71 million, and at 3% it is $2 million. Include healthcare, taxes paid from investments and irregular costs in the budget. These targets do not establish retirement readiness.',
  ],
  [
    'Is the 4% rule guaranteed for early retirement?',
    'No. A withdrawal assumption does not account for every retirement length, asset allocation, market sequence or future expense. An early retirement can last much longer than the 30-year horizon often associated with the rule. Compare multiple assumptions and evaluate the withdrawal plan separately.',
  ],
  [
    'Should I include Social Security or a pension?',
    'You can use only the spending left for investments to cover when reliable income is available from the start of the modeled retirement period. Do not subtract a later-starting benefit from every year of early retirement. This tool does not model benefit start dates, benefit taxes or the bridge before income begins.',
  ],
  [
    'Does the FIRE number calculator account for inflation?',
    'The target uses today’s spending and is shown in today’s dollars. The optional timeline takes a real return after inflation and fees, and assumes monthly investments keep their purchasing power as future dollar deposits rise with inflation. It does not show a future nominal-dollar target.',
  ],
  [
    'What counts as invested today?',
    'Include investments earmarked for retirement, such as retirement-account and taxable-brokerage balances. Exclude emergency cash, money reserved for other goals and home equity you have not planned to spend. This tool combines assets into one balance and does not determine when you can access individual accounts.',
  ],
  [
    'Can I use this for Lean FIRE or Fat FIRE?',
    'Yes. Enter the spending budget you want to fund and compare the resulting target. Lean and Fat FIRE describe different lifestyles and budgets; they do not have universal dollar thresholds. The calculation stays annual portfolio-funded spending divided by your withdrawal assumption.',
  ],
] as const;
const spendingLevels = [30000, 40000, 60000, 80000, 100000];
const rates = [3, 3.5, 4];

export function FireNumberGuide() {
  return (
    <div className="article-body fire-number-guide">
      <section aria-labelledby="fire-formula-heading">
        <h2 id="fire-formula-heading">How to find your FIRE number</h2>
        <div className="fire-method-grid">
          <div>
            <p>
              Estimate what your investments must pay for each year in retirement, then divide by the
              withdrawal rate as a decimal. At 4%, you need 25 times annual spending. At 3%, the multiple is
              about 33.33.
            </p>
            <p className="fire-formula">FIRE number = annual spending ÷ (withdrawal rate ÷ 100)</p>
            <p>
              Start with housing, food, transport, insurance and healthcare. Allow for repairs, replacement
              purchases and taxes that your investments must pay. Use a retirement budget rather than assuming
              that all of your current salary needs replacing.
            </p>
            <p>
              The optional timeline answers a different question: how long it might take to build that
              balance. It grows investments monthly at your real return and adds savings at month-end. Your
              deposits keep pace with inflation. It stops at the first funded month, or at age 100 if the
              target is not reached.
            </p>
          </div>
          <aside className="fire-worked-example" aria-label="Worked FIRE number example">
            <h3>A $4,000 monthly budget</h3>
            <p>$4,000 × 12 = $48,000 a year</p>
            <p>
              $48,000 ÷ 0.04 = <strong>$1,200,000</strong>
            </p>
            <p>
              With $300,000 already invested, the target is 25% funded and the gap is $900,000. At 3%, the
              same budget needs $1.6 million.
            </p>
            <a href="#fire-inputs-heading">Try your own spending budget ↑</a>
          </aside>
        </div>
      </section>

      <section aria-labelledby="fire-spending-heading">
        <h2 id="fire-spending-heading">FIRE numbers by spending</h2>
        <p>
          This fixed reference compares retirement budgets at three initial withdrawal assumptions. All
          figures are in today’s US dollars. It stays unchanged when you edit the calculator.
        </p>
        <div className="fire-table-scroll">
          <table className="fire-spending-table">
            <caption>
              Illustrative portfolio targets · No automatic Social Security or pension deduction
            </caption>
            <thead>
              <tr>
                <th scope="col">Monthly equivalent (approx.)</th>
                <th scope="col">Annual spending</th>
                {rates.map((rate) => (
                  <th key={rate} scope="col">
                    At {rate}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {spendingLevels.map((spending) => (
                <tr key={spending}>
                  <th scope="row">{dollars(spending / 12)}</th>
                  <td>{dollars(spending)}</td>
                  {rates.map((withdrawal) => (
                    <td key={withdrawal}>
                      {dollars(calculateFireNumber({ spending, withdrawal, balance: 0 }).target)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          At 4%, another $100 a month of retirement spending adds $30,000 to the target. A recurring expense
          changes both your budget and the investment balance needed to fund it.
        </p>
      </section>

      <section aria-labelledby="fire-withdrawal-heading">
        <h2 id="fire-withdrawal-heading">Which withdrawal rate?</h2>
        <p>
          A withdrawal rate sets a first-year spending amount relative to a portfolio. It is separate from the
          investment return used while saving. Entering a 7% return does not mean a 7% withdrawal is
          sustainable.
        </p>
        <p>
          The 4% rule is often discussed with a 30-year retirement and later inflation adjustments to the
          initial withdrawal amount. A longer retirement, fees, taxes and losses early in retirement can
          change the outcome. Compare 3%, 3.5% and 4% to see how sensitive your target is; the calculator does
          not choose a rate for you.
        </p>
        <p>
          <a href="https://www.fidelity.com/learning-center/personal-finance/how-to-retire-early">
            Fidelity’s guide to early retirement
          </a>{' '}
          discusses a lower withdrawal assumption for a longer retirement.{' '}
          <a href="https://www.schwab.com/learn/story/beyond-4-rule-how-much-can-you-spend-retirement">
            Schwab explains how time horizon and portfolio choices affect withdrawals
          </a>
          . Neither source endorses this calculator or its example settings.
        </p>
        <h3>Keep the income timing visible</h3>
        <p>
          If you expect Social Security, a pension or rental income, check when it starts and how dependable
          it is. A payment that begins years after you leave work cannot pay the bills before then. Model that
          gap separately before reducing the spending entered here. Health insurance, account-access rules and
          withdrawal taxes also need their own review.
        </p>
      </section>

      <section aria-labelledby="fire-vs-coast-heading">
        <h2 id="fire-vs-coast-heading">FIRE number vs Coast FIRE</h2>
        <p>
          Your full FIRE number is the balance associated with funding spending from investments. A Coast FIRE
          number is the balance that might grow into a future retirement target while you continue to cover
          living costs from work or other funds. A Coast milestone alone does not fund withdrawals today.
        </p>
        <p>
          Use the <Link to="/">Coast FIRE calculator</Link> if you want to stop adding to retirement
          investments before you stop working. If part-time pay will cover only some bills, the{' '}
          <Link to="/barista-fire-calculator/">Barista FIRE calculator</Link> models the spending gap and the
          later end of work income. Read <Link to="/what-is-coast-fire/">what Coast FIRE means</Link> for
          examples of those distinctions.
        </p>
      </section>

      <section className="fire-faq" aria-labelledby="fire-faq-heading">
        <div>
          <h2 id="fire-faq-heading">FIRE number FAQs</h2>
          <p>Budget, withdrawal and account questions to check before relying on one target.</p>
        </div>
        <ContentFaq questions={questions} />
      </section>
    </div>
  );
}
