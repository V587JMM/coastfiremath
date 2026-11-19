import { Link } from '@tanstack/react-router';
import { dollars } from '~/lib/calculator';
import { firstWithdrawal } from '~/lib/four-percent-rule';
import { ContentFaq } from './content-faq';

const portfolios = [250_000, 500_000, 750_000, 1_000_000, 1_500_000, 2_000_000, 3_000_000];
const referenceRates = [3, 3.5, 4, 5];

const questions = [
  [
    'How much is the 4% rule on $1,000,000?',
    'The first-year withdrawal is $40,000 before taxes, or about $3,333 a month for budgeting. With 3% inflation, the second-year planned withdrawal is $41,200 in future dollars.',
  ],
  [
    'Does the 4% rule include Social Security or pensions?',
    'The rule applies to withdrawals from investments. Social Security and pensions can cover part of your budget. Count those payments from their actual start dates when deciding how much your portfolio needs to supply.',
  ],
  [
    'How do taxes and investment fees affect withdrawals?',
    'The calculator shows gross portfolio withdrawals. Estimate the tax you owe separately when planning spendable income. The optional annual investment fee reduces the modeled growth of the remaining balance.',
  ],
  [
    'Does the 4% rule work for a 40- or 50-year early retirement?',
    'A longer horizon exposes the portfolio to more years of withdrawals and market uncertainty. Use the longer horizon and compare lower starting rates and early losses to see how the assumptions change your result.',
  ],
  [
    'How are the 4% rule and the 25× rule related?',
    'They use the same first-year relationship in opposite directions. Multiply your portfolio by 4% to get the first-year withdrawal. Multiply annual portfolio-funded spending by 25 to find the starting balance implied by that rate.',
  ],
] as const;

export function FourPercentGuide({ onUsePortfolio }: { onUsePortfolio: (portfolio: number) => void }) {
  return (
    <div className="article-body drawdown-guide">
      <section aria-labelledby="drawdown-formula">
        <h2 id="drawdown-formula">How the 4% rule works</h2>
        <p>
          Multiply your starting portfolio by 4% to get the first-year withdrawal. In later years, adjust that
          dollar amount for inflation to keep its purchasing power steady.
        </p>
        <div className="drawdown-formulas">
          <p>
            <strong>First-year withdrawal</strong> = starting portfolio × withdrawal rate
          </p>
          <p>
            <strong>Year N withdrawal in nominal dollars</strong> = first-year withdrawal × (1 + inflation)
            <sup>N − 1</sup>
          </p>
        </div>
        <p>
          With $1 million, the first year provides $40,000. At 3% inflation, the planned withdrawal rises to
          $41,200 in year 2 and about $52,191 in year 10.
        </p>
        <p>
          The separate percentage-of-balance strategy recalculates each payment from the balance at the start
          of that year. Its payments may shrink after losses. Try both strategies with the early-loss scenario
          to see the trade-off between steady spending and a portfolio that adjusts its payouts.
        </p>
      </section>
      <section aria-labelledby="drawdown-reference">
        <h2 id="drawdown-reference">4% rule withdrawal chart</h2>
        <p>
          Compare first-year income at common portfolio sizes and withdrawal rates. Select a portfolio to use
          it above.
        </p>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: This region scrolls horizontally on narrow screens. */}
        <section className="drawdown-table-scroll" aria-label="First-year withdrawal examples" tabIndex={0}>
          <table className="drawdown-reference-table">
            <caption>First-year withdrawals before taxes · annual and monthly equivalents</caption>
            <thead>
              <tr>
                <th scope="col">Starting portfolio</th>
                {referenceRates.map((rate) => (
                  <th key={rate} scope="col">
                    {rate}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {portfolios.map((portfolio) => (
                <tr key={portfolio}>
                  <th scope="row">
                    <button
                      className="drawdown-text-button"
                      type="button"
                      onClick={() => onUsePortfolio(portfolio)}
                    >
                      Use {dollars(portfolio)}
                    </button>
                  </th>
                  {referenceRates.map((rate) => {
                    const annual = firstWithdrawal(portfolio, rate);
                    return (
                      <td key={rate}>
                        {dollars(annual)}/yr <small>{dollars(annual / 12)}/mo</small>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
      <section aria-labelledby="drawdown-horizon-guide">
        <h2 id="drawdown-horizon-guide">30 years vs. early retirement</h2>
        <p>
          William Bengen tested inflation-adjusted withdrawals against historical US stock and bond returns.
          The Trinity Study compared several stock and bond mixes, including 50/50 and 75/25, across horizons
          up to 30 years. A 40- or 50-year retirement can expose assets to more withdrawals, inflation and
          market downturns. Early losses matter because each withdrawal leaves less invested for a recovery.
        </p>
        <p>
          Try a longer horizon, lower starting rates such as 3.5% or 3.25%, and the early-loss scenario.
          Include healthcare and applicable taxes in the budget and account for investment fees when
          estimating portfolio growth.
        </p>
        <p className="drawdown-sources">
          <a href="https://www.financialplanningassociation.org/article/journal/MAR04-determining-withdrawal-rates-using-historical-data">
            Bengen’s original research
          </a>
          {' · '}
          <a href="https://www.aaii.com/journal/article/retirement-savings-choosing-a-withdrawal-rate-that-is-sustainable">
            Trinity Study
          </a>
          {' · '}
          <a href="https://www.schwab.com/learn/story/beyond-4-rule-how-much-can-you-spend-retirement">
            Schwab’s withdrawal-rate guide
          </a>
        </p>
      </section>
      <section aria-labelledby="drawdown-related">
        <h2 id="drawdown-related">4% rule, FIRE number and Coast FIRE</h2>
        <ul>
          <li>
            Find your target balance and time to reach it with the{' '}
            <Link to="/fire-number-calculator/">FIRE Number Calculator</Link>.
          </li>
          <li>
            Estimate when you could stop contributing and let your savings grow with the{' '}
            <Link to="/">Coast FIRE Calculator</Link>.
          </li>
          <li>
            Model a retirement budget supported partly by wages with the{' '}
            <Link to="/barista-fire-calculator/">Barista FIRE Calculator</Link>.
          </li>
        </ul>
        <p>
          See the{' '}
          <Link to="/editorial-policy/" hash="withdrawal-methodology">
            withdrawal calculation methodology
          </Link>{' '}
          for formulas and a worked first-year check.
        </p>
      </section>
      <section aria-labelledby="drawdown-faq">
        <h2 id="drawdown-faq">4% rule FAQs</h2>
        <ContentFaq questions={questions} />
      </section>
    </div>
  );
}
