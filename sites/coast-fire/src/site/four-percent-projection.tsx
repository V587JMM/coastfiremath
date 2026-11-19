import { useState } from 'react';
import { compact, dollars } from '~/lib/calculator';
import {
  EARLY_LOSS_RETURNS,
  LOWER_RETURN_DELTA,
  type modelWithdrawals,
  type WithdrawalStrategy,
  type withdrawalScenarios,
} from '~/lib/four-percent-rule';

type Scenarios = ReturnType<typeof withdrawalScenarios>;
type ScenarioId = Scenarios[number]['id'];

export function withdrawalOutcome(result: ReturnType<typeof modelWithdrawals>, years: number) {
  if (result.depletedYear === 0) return 'No starting balance';
  if (result.firstShortfall !== null) {
    return result.depletedYear === result.firstShortfall
      ? `Depleted in year ${result.firstShortfall} with a shortfall`
      : `Depleted in year ${result.depletedYear} · first shortfall in year ${result.firstShortfall}`;
  }
  if (result.depletedYear !== null)
    return `Depleted in year ${result.depletedYear} after the full withdrawal`;
  return `Balance lasts through year ${years}`;
}

export function FourPercentProjection({
  scenarios,
  portfolio,
  years,
  strategy,
}: {
  scenarios: Scenarios;
  portfolio: number;
  years: number;
  strategy: WithdrawalStrategy;
}) {
  const [future, setFuture] = useState(false);
  const [selected, setSelected] = useState<ScenarioId>('base');
  const scenario = scenarios.find(({ id }) => id === selected) ?? scenarios[0];
  const max = Math.max(
    portfolio,
    ...scenarios.flatMap(({ result }) => result.rows.map((row) => row.balance)),
  );
  const x = (year: number) => 76 + (year / years) * 534;
  const y = (balance: number) => 188 - (balance / (max || 1)) * 158;
  const ticks = [...new Set([0, Math.round(years / 2), years])];

  return (
    <section className="drawdown-projection drawdown-panel" aria-labelledby="drawdown-projection-heading">
      <h2 id="drawdown-projection-heading">How long could your portfolio last?</h2>
      <p>
        Three hypothetical return paths show the effect of lower growth and losses early in retirement.
        Balances are in today’s dollars.
      </p>
      <figure>
        <svg
          viewBox="0 0 640 226"
          role="img"
          aria-labelledby="drawdown-chart-title drawdown-chart-description"
        >
          <title id="drawdown-chart-title">Retirement portfolio balance by year</title>
          <desc id="drawdown-chart-description">
            Three modeled balance paths in today’s dollars. The outcome of each scenario is listed below.
          </desc>
          <line className="drawdown-chart-grid" x1="76" x2="610" y1="188" y2="188" />
          <text x="69" y="193" textAnchor="end">
            $0
          </text>
          {max > 0 && (
            <>
              <line className="drawdown-chart-grid" x1="76" x2="610" y1="30" y2="30" />
              <text x="69" y="35" textAnchor="end">
                {compact(max)}
              </text>
            </>
          )}
          {[...scenarios].reverse().map(({ id, result }) => (
            <polyline
              key={id}
              className={`drawdown-line drawdown-${id}`}
              points={[
                `76,${y(portfolio)}`,
                ...result.rows.map((row) => `${x(row.year)},${y(row.balance)}`),
              ].join(' ')}
            />
          ))}
          {ticks.map((year) => (
            <text
              key={year}
              x={x(year)}
              y="216"
              textAnchor={year === 0 ? 'start' : year === years ? 'end' : 'middle'}
            >
              {year === 0 ? 'Start' : `Year ${year}`}
            </text>
          ))}
        </svg>
        <figcaption>
          <dl className="drawdown-scenarios">
            {scenarios.map(({ id, label, result }) => (
              <div key={id}>
                <dt>
                  <span className={`drawdown-key drawdown-${id}`} aria-hidden="true" />
                  {label}
                </dt>
                <dd>{withdrawalOutcome(result, years)}</dd>
                <dd>
                  {dollars(result.endingBalance)} left after year {years}
                </dd>
                {strategy === 'percent' && (
                  <dd>
                    {dollars(result.rows[years - 1]!.paid)} paid in year {years}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </figcaption>
      </figure>
      <p className="drawdown-note">
        The lower path subtracts {LOWER_RETURN_DELTA} percentage points from the base real return. The
        early-loss path uses {EARLY_LOSS_RETURNS[0]}% and {EARLY_LOSS_RETURNS[1]}% nominal returns in years 1
        and 2, then resumes the base return. These scenarios use assumed returns and give no historical or
        forecast probability of success.
      </p>
      <details className="drawdown-schedule">
        <summary>Annual withdrawal schedule</summary>
        <div className="drawdown-schedule-controls">
          <label>
            Scenario
            <select
              value={selected}
              onChange={(event) => setSelected(event.currentTarget.value as ScenarioId)}
            >
              {scenarios.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <fieldset className="spending-period">
            <legend>Dollar basis</legend>
            <button type="button" aria-pressed={!future} onClick={() => setFuture(false)}>
              Today’s dollars
            </button>
            <button type="button" aria-pressed={future} onClick={() => setFuture(true)}>
              Future nominal dollars
            </button>
          </fieldset>
        </div>
        {/* biome-ignore lint/a11y/noNoninteractiveTabindex: This region scrolls horizontally on narrow screens. */}
        <section className="drawdown-table-scroll" aria-label="Year-by-year projections" tabIndex={0}>
          <table>
            <caption>
              {scenario.label} · {future ? 'Future nominal dollars' : 'Today’s dollars'}
            </caption>
            <thead>
              <tr>
                <th scope="col">Year</th>
                <th scope="col">Planned withdrawal</th>
                <th scope="col">Amount paid</th>
                <th scope="col">Year-end balance</th>
              </tr>
            </thead>
            <tbody>
              {scenario.result.rows.map((row) => (
                <tr key={row.year}>
                  <th scope="row">{row.year}</th>
                  <td>{dollars(row.planned * (future ? row.withdrawalPriceFactor : 1))}</td>
                  <td>{dollars(row.paid * (future ? row.withdrawalPriceFactor : 1))}</td>
                  <td>{dollars(row.balance * (future ? row.balancePriceFactor : 1))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </details>
    </section>
  );
}
