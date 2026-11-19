import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { convertSpending, dollars, type SpendingPeriod } from '~/lib/calculator';
import {
  DRAW_RATES,
  DRAWDOWN_EXAMPLE,
  drawdownIssue,
  drawdownLimits,
  firstWithdrawal,
  modelWithdrawals,
  portfolioForSpending,
  realGrowthFactor,
  type WithdrawalStrategy,
  withdrawalScenarios,
} from '~/lib/four-percent-rule';
import { fourPercentLastModified, head } from '~/lib/seo';
import drawdownCss from '~/site/four-percent.css?url';
import { FourPercentGuide } from '~/site/four-percent-guide';
import { FourPercentProjection, withdrawalOutcome } from '~/site/four-percent-projection';
import site from '../../site.config';

const path = '/4-percent-rule-calculator/';
const title = '4 Percent Rule Calculator – Retirement Withdrawals';
const description =
  'Use this free 4 percent rule calculator to estimate annual and monthly retirement withdrawals, adjust for inflation, and see how long your portfolio could last.';
const shareImage = '/share/4-percent-rule-calculator.png';

export const Route = createFileRoute('/4-percent-rule-calculator')({
  head: () => {
    const data = head(title, description, path, false, false, {
      image: shareImage,
      jsonLd: [
        {
          '@type': 'WebApplication',
          name: '4 Percent Rule Calculator',
          description,
          url: `${site.url}${path}`,
          image: `${site.url}${shareImage}`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    });
    return { ...data, links: [...data.links, { rel: 'stylesheet', href: drawdownCss }] };
  },
  component: FourPercentCalculator,
});

const example = {
  portfolio: String(DRAWDOWN_EXAMPLE.portfolio),
  spending: '60000',
  rate: String(DRAWDOWN_EXAMPLE.rate),
  years: String(DRAWDOWN_EXAMPLE.years),
  nominal: String(DRAWDOWN_EXAMPLE.nominal),
  inflation: String(DRAWDOWN_EXAMPLE.inflation),
  fee: String(DRAWDOWN_EXAMPLE.fee),
};
type Field = keyof typeof example;

const strategies: Record<WithdrawalStrategy, string> = {
  'fixed-real': 'Inflation-adjusted withdrawal',
  percent: 'Percentage of remaining balance',
};

function FourPercentCalculator() {
  const [values, setValues] = useState(example);
  const [mode, setMode] = useState<'portfolio' | 'spending'>('portfolio');
  const [period, setPeriod] = useState<SpendingPeriod>('year');
  const [strategy, setStrategy] = useState<WithdrawalStrategy>('fixed-real');
  const [copyStatus, setCopyStatus] = useState('');
  const [resetCount, setResetCount] = useState(0);
  const portfolioRef = useRef<HTMLInputElement>(null);
  const assumptionsRef = useRef<HTMLDetailsElement>(null);
  const resultRef = useRef<HTMLElement>(null);

  function number(field: Field) {
    return values[field].trim() === '' ? Number.NaN : Number(values[field]);
  }
  const spending = convertSpending(number('spending'), period, 'year');
  const primaryIssue = drawdownIssue(mode, mode === 'spending' ? spending : number('portfolio'));
  const rateIssue = drawdownIssue('rate', number('rate'));
  const yearsIssue = drawdownIssue('years', number('years'));
  const assumptionsIssue = (['nominal', 'inflation', 'fee'] as const).some((field) =>
    drawdownIssue(field, number(field)),
  );
  const settings = {
    portfolio: mode === 'portfolio' ? number('portfolio') : portfolioForSpending(spending, number('rate')),
    rate: number('rate'),
    years: number('years'),
    nominal: number('nominal'),
    inflation: number('inflation'),
    fee: number('fee'),
  };
  const { portfolio, rate, years, nominal, inflation, fee } = settings;
  const validTarget = !primaryIssue && !rateIssue;
  const annual = mode === 'portfolio' ? firstWithdrawal(portfolio, rate) : spending;
  const scenarios =
    validTarget && !yearsIssue && !assumptionsIssue ? withdrawalScenarios(settings, strategy) : null;
  const realReturn = realGrowthFactor(nominal, inflation, fee);
  const rates = [...new Set([...DRAW_RATES, ...(validTarget ? [rate] : [])])].sort((a, b) => a - b);

  function change(field: Field, value: string) {
    setValues((previous) => ({ ...previous, [field]: value }));
    setCopyStatus('');
  }

  function changePeriod(next: SpendingPeriod) {
    if (next === period) return;
    change(
      'spending',
      values.spending === '' ? '' : String(convertSpending(number('spending'), period, next)),
    );
    setPeriod(next);
  }

  function applyPortfolio(amount: number) {
    change('portfolio', String(amount));
    setMode('portfolio');
    requestAnimationFrame(() => portfolioRef.current?.focus());
  }

  function reset() {
    setValues(example);
    setMode('portfolio');
    setPeriod('year');
    setStrategy('fixed-real');
    setCopyStatus('');
    setResetCount((count) => count + 1);
    if (assumptionsRef.current) assumptionsRef.current.open = false;
  }

  function field(key: Field, label: string, suffix?: string, hint?: string) {
    const id = `drawdown-${key}`;
    const spec = drawdownLimits[key];
    const monthly = key === 'spending' && period === 'month';
    const issue = drawdownIssue(key, key === 'spending' ? spending : number(key));
    const error =
      issue && monthly
        ? 'Enter a monthly amount with an annual equivalent from $0.01 to $10 million.'
        : issue;
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        <div className="input-wrap">
          {(key === 'portfolio' || key === 'spending') && <span aria-hidden="true">$</span>}
          <input
            id={id}
            ref={key === 'portfolio' ? portfolioRef : undefined}
            type="number"
            inputMode={key === 'years' ? 'numeric' : 'decimal'}
            min={monthly ? spec.min / 12 : spec.min}
            max={monthly ? spec.max / 12 : spec.max}
            step={key === 'spending' ? 'any' : spec.step}
            value={values[key]}
            onChange={(event) => change(key, event.currentTarget.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={
              [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined
            }
          />
          {suffix && <span aria-hidden="true">{suffix}</span>}
        </div>
        {hint && <small id={`${id}-hint`}>{hint}</small>}
        {error && (
          <small id={`${id}-error`} className="drawdown-error">
            {error}
          </small>
        )}
      </div>
    );
  }

  async function copySummary() {
    if (!validTarget) return;
    const lines = [
      'CoastFireMath · 4 Percent Rule Calculator',
      `Starting portfolio ${dollars(portfolio)} · Withdrawal rate ${rate}%`,
      `First-year withdrawal ${dollars(annual)} · Monthly equivalent ${dollars(annual / 12)} · Before taxes`,
      ...(scenarios
        ? [
            `${years}-year horizon · ${nominal}% nominal return · ${inflation}% inflation · ${fee}% annual fee`,
            strategies[strategy],
            ...scenarios.map(
              ({ label, result }) =>
                `${label} · ${withdrawalOutcome(result, years)} · ${dollars(result.endingBalance)} left in today's dollars`,
            ),
          ]
        : []),
      `${site.url}${path}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopyStatus('Summary copied.');
    } catch {
      setCopyStatus('Copy is unavailable here. You can select and copy the result text.');
    }
  }

  return (
    <div className="drawdown-page">
      <div className="page-title">
        <div>
          <h1>4 Percent Rule Calculator</h1>
          <p>See what your retirement savings could pay in year one and how long the balance could last.</p>
        </div>
      </div>
      <div className="drawdown-grid">
        <section className="inputs-panel drawdown-inputs" aria-labelledby="drawdown-input-title">
          <div className="panel-heading">
            <h2 id="drawdown-input-title">Your withdrawal plan</h2>
            <button className="drawdown-text-button" type="button" onClick={reset}>
              Reset example
            </button>
          </div>
          <fieldset className="spending-period">
            <legend>Calculate from</legend>
            <button
              type="button"
              aria-pressed={mode === 'portfolio'}
              onClick={() => {
                setMode('portfolio');
                setCopyStatus('');
              }}
            >
              Portfolio
            </button>
            <button
              type="button"
              aria-pressed={mode === 'spending'}
              onClick={() => {
                setMode('spending');
                setCopyStatus('');
              }}
            >
              Spending
            </button>
          </fieldset>
          {mode === 'portfolio' ? (
            field(
              'portfolio',
              'Starting retirement portfolio',
              undefined,
              'Example starts with $1 million. Edit this to use your own balance.',
            )
          ) : (
            <>
              <fieldset className="spending-period">
                <legend>Spending period</legend>
                <button type="button" aria-pressed={period === 'month'} onClick={() => changePeriod('month')}>
                  Month
                </button>
                <button type="button" aria-pressed={period === 'year'} onClick={() => changePeriod('year')}>
                  Year
                </button>
              </fieldset>
              {field('spending', `${period === 'month' ? 'Monthly' : 'Annual'} portfolio-funded spending`)}
            </>
          )}
          {field('rate', 'Initial withdrawal rate', '%')}
          <fieldset className="drawdown-presets" aria-label="Withdrawal rate presets">
            {DRAW_RATES.map((preset) => (
              <button
                key={preset}
                type="button"
                aria-pressed={rate === preset}
                onClick={() => change('rate', String(preset))}
              >
                {preset}%
              </button>
            ))}
          </fieldset>
          {field('years', 'Retirement horizon', 'years')}
          <details className="drawdown-assumptions" ref={assumptionsRef}>
            <summary>Returns, inflation and fees{assumptionsIssue ? ' · Check inputs' : ''}</summary>
            {field('nominal', 'Nominal annual return', '%', 'Before inflation and investment fees.')}
            {field('inflation', 'Annual inflation', '%')}
            {field(
              'fee',
              'Annual investment fee',
              '%',
              'Applied to the invested balance after each year’s return.',
            )}
            <div className="field">
              <label htmlFor="drawdown-strategy">Withdrawal strategy</label>
              <select
                id="drawdown-strategy"
                value={strategy}
                onChange={(event) => {
                  setStrategy(event.currentTarget.value === 'percent' ? 'percent' : 'fixed-real');
                  setCopyStatus('');
                }}
              >
                <option value="fixed-real">Inflation-adjusted withdrawal</option>
                <option value="percent">Percentage of remaining balance</option>
              </select>
              <small>
                Inflation-adjusted withdrawals aim for steady purchasing power. Percentage withdrawals rise or
                fall with the portfolio.
              </small>
            </div>
          </details>
          <p className="drawdown-note">US dollars. Calculations run in your browser.</p>
          <button
            className="drawdown-jump"
            type="button"
            onClick={() => {
              resultRef.current?.scrollIntoView({ block: 'start' });
              resultRef.current?.focus({ preventScroll: true });
            }}
          >
            View withdrawal results ↓
          </button>
          <noscript>
            <p>Enable JavaScript to change the example inputs.</p>
          </noscript>
        </section>
        <section
          ref={resultRef}
          tabIndex={-1}
          className="drawdown-panel drawdown-result"
          aria-labelledby="drawdown-result-title"
        >
          <h2 id="drawdown-result-title">Your retirement withdrawals</h2>
          {validTarget ? (
            <>
              <div aria-live="polite">
                <div className="drawdown-hero-number">
                  <p>
                    {mode === 'portfolio'
                      ? 'First-year withdrawal before taxes'
                      : 'Starting portfolio implied by your rate'}
                  </p>
                  <strong>{dollars(mode === 'portfolio' ? annual : portfolio)}</strong>
                  <p>
                    {mode === 'spending' && `${dollars(annual)} in year one before taxes · `}
                    {dollars(annual / 12)} monthly equivalent
                  </p>
                </div>
                <p className="drawdown-context">
                  {dollars(portfolio)} starting balance · {rate}% initial withdrawal · {dollars(annual)} in
                  year one
                </p>
                {mode === 'spending' && (
                  <p className="drawdown-note">
                    For an estimate of when you could reach this balance, use the{' '}
                    <Link to="/fire-number-calculator/">FIRE Number Calculator</Link>.
                  </p>
                )}
                {scenarios ? (
                  <div className="drawdown-status">
                    <strong>{withdrawalOutcome(scenarios[0].result, years)}</strong>
                    <p>
                      {dollars(scenarios[0].result.endingBalance)} left after year {years}, in today’s
                      dollars.
                    </p>
                    <p className="drawdown-note">
                      Base assumptions · {nominal}% nominal return · {inflation}% inflation · {fee}% fee ·{' '}
                      {((realReturn - 1) * 100).toFixed(2)}% real return
                    </p>
                    <p className="drawdown-note">
                      {strategies[strategy]} · One payment at the start of each year.{' '}
                      {strategy === 'percent' && 'Payments vary with the balance.'}
                    </p>
                  </div>
                ) : (
                  <p className="drawdown-error" role="status">
                    Check the horizon and growth assumptions to see the projection.
                  </p>
                )}
              </div>
              <h3>Compare withdrawal rates</h3>
              <p className="drawdown-note">
                Based on the displayed portfolio.{' '}
                {mode === 'portfolio'
                  ? 'Choose a rate to update the withdrawal.'
                  : 'Choose a rate to recalculate the portfolio for your budget.'}
              </p>
              {/* biome-ignore lint/a11y/noNoninteractiveTabindex: This region scrolls horizontally on narrow screens. */}
              <section className="drawdown-table-scroll" aria-label="Rate comparison" tabIndex={0}>
                <table>
                  <caption>First year before taxes · Base return path</caption>
                  <thead>
                    <tr>
                      <th scope="col">Rate</th>
                      <th scope="col">Yearly</th>
                      <th scope="col">Monthly</th>
                      <th scope="col">Projection outcome</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rates.map((comparisonRate) => {
                      const income = firstWithdrawal(portfolio, comparisonRate);
                      const comparison = scenarios
                        ? modelWithdrawals({ ...settings, rate: comparisonRate }, strategy)
                        : null;
                      return (
                        <tr
                          key={comparisonRate}
                          className={comparisonRate === rate ? 'drawdown-active-row' : undefined}
                        >
                          <th scope="row">
                            <button
                              className="drawdown-text-button"
                              type="button"
                              aria-pressed={comparisonRate === rate}
                              onClick={() => change('rate', String(comparisonRate))}
                            >
                              {comparisonRate}%
                            </button>
                          </th>
                          <td>{dollars(income)}</td>
                          <td>{dollars(income / 12)}</td>
                          <td>
                            {comparison ? (
                              <>
                                {withdrawalOutcome(comparison, years)}
                                <small>
                                  {dollars(comparison.endingBalance)} left after year {years}
                                </small>
                              </>
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
              <div className="drawdown-actions">
                <button type="button" onClick={copySummary}>
                  Copy summary
                </button>
                <button type="button" onClick={() => window.print()}>
                  Print / save PDF
                </button>
              </div>
              <p className="drawdown-note drawdown-copy-status" role="status">
                {copyStatus}
              </p>
            </>
          ) : (
            <p className="drawdown-error" role="status">
              Correct the highlighted inputs to see your withdrawal estimate.
            </p>
          )}
        </section>
      </div>
      {scenarios && (
        <FourPercentProjection
          key={resetCount}
          scenarios={scenarios}
          portfolio={portfolio}
          years={years}
          strategy={strategy}
        />
      )}
      <FourPercentGuide onUsePortfolio={applyPortfolio} />
      <p className="review-date">
        Updated <time dateTime={fourPercentLastModified}>November 18, 2026</time>
      </p>
    </div>
  );
}
