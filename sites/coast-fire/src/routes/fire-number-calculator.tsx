import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { ageLabel, convertSpending, dollars, type SpendingPeriod } from '~/lib/calculator';
import {
  calculateFireNumber,
  FIRE_NUMBER_EXAMPLE,
  FIRE_TIMELINE_EXAMPLE,
  type FireNumberInputs,
  type FireTimelineInputs,
  fireNumberIssues,
  fireTimelineIssues,
  projectFireNumber,
} from '~/lib/fire-number';
import { head } from '~/lib/seo';
import fireNumberCss from '~/site/fire-number.css?url';
import { FireNumberGuide } from '~/site/fire-number-guide';
import { FireNumberProjection } from '~/site/fire-number-projection';
import site from '../../site.config';

const path = '/fire-number-calculator/';
const title = 'FIRE Number Calculator – Find Your Retirement Target';
const description =
  'Use this free FIRE number calculator to find your retirement savings target, compare withdrawal rates, check your progress, and estimate your years to FIRE.';

export const Route = createFileRoute('/fire-number-calculator')({
  head: () => {
    const data = head(title, description, path, false, false, {
      image: '/share/fire-number-calculator.png',
      jsonLd: [
        {
          '@type': 'WebApplication',
          name: 'FIRE Number Calculator',
          description,
          url: `${site.url}${path}`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript for interactive calculations',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    });
    return { ...data, links: [...data.links, { rel: 'stylesheet', href: fireNumberCss }] };
  },
  component: FireNumberCalculator,
});

const initialValues = {
  spending: String(FIRE_NUMBER_EXAMPLE.spending),
  withdrawal: String(FIRE_NUMBER_EXAMPLE.withdrawal),
  balance: String(FIRE_NUMBER_EXAMPLE.balance),
};
const initialTimeline = {
  age: String(FIRE_TIMELINE_EXAMPLE.age),
  monthly: String(FIRE_TIMELINE_EXAMPLE.monthly),
  real: String(FIRE_TIMELINE_EXAMPLE.real),
};
const numeric = (value: string) => (value.trim() === '' ? Number.NaN : Number(value));

function NumberField({
  name,
  label,
  value,
  onChange,
  hint,
  error,
  min,
  max,
  step = 1,
  unit,
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
  error?: string;
  min: number;
  max: number;
  step?: number;
  unit?: '$' | '%';
}) {
  const id = `fire-${name}`;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrap">
        {unit === '$' && <span aria-hidden="true">$</span>}
        <input
          id={id}
          type="number"
          inputMode={name === 'age' ? 'numeric' : 'decimal'}
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ''}`}
        />
        {unit === '%' && <span aria-hidden="true">%</span>}
      </div>
      <small id={`${id}-hint`}>{hint}</small>
      {error && (
        <small className="fire-field-error" id={`${id}-error`}>
          {error}
        </small>
      )}
    </div>
  );
}

function FireNumberCalculator() {
  const [values, setValues] = useState(initialValues);
  const [period, setPeriod] = useState<SpendingPeriod>('year');
  const [showTimeline, setShowTimeline] = useState(false);
  const [timelineValues, setTimelineValues] = useState(initialTimeline);
  const [copyStatus, setCopyStatus] = useState('');
  const resultRef = useRef<HTMLElement>(null);
  const inputs: FireNumberInputs = {
    spending: convertSpending(numeric(values.spending), period, 'year'),
    withdrawal: numeric(values.withdrawal),
    balance: values.balance.trim() === '' ? 0 : numeric(values.balance),
  };
  const timeline: FireTimelineInputs = {
    age: numeric(timelineValues.age),
    monthly: numeric(timelineValues.monthly),
    real: numeric(timelineValues.real),
  };
  const issues = fireNumberIssues(inputs);
  const result = Object.keys(issues).length ? null : calculateFireNumber(inputs);
  const timelineIssues = fireTimelineIssues(timeline);
  const projection =
    showTimeline && result && Object.keys(timelineIssues).length === 0
      ? projectFireNumber(inputs, timeline)
      : null;
  const rates = [...new Set([3, 3.5, 4, ...(result ? [inputs.withdrawal] : [])])].sort((a, b) => a - b);

  function change(key: keyof typeof initialValues, value: string) {
    setValues((previous) => ({ ...previous, [key]: value }));
    setCopyStatus('');
  }
  function switchPeriod(next: SpendingPeriod) {
    if (next === period) return;
    setValues((previous) => ({
      ...previous,
      spending:
        previous.spending.trim() === ''
          ? ''
          : String(convertSpending(numeric(previous.spending), period, next)),
    }));
    setPeriod(next);
    setCopyStatus('');
  }
  function reset() {
    setValues(initialValues);
    setTimelineValues(initialTimeline);
    setPeriod('year');
    setShowTimeline(false);
    setCopyStatus('');
  }
  async function copySummary() {
    if (!result) return;
    const lines = [
      'CoastFireMath — FIRE number estimate',
      `Annual portfolio-funded spending: ${dollars(inputs.spending)}`,
      `Withdrawal assumption: ${inputs.withdrawal}%`,
      `FIRE number: ${dollars(result.target)} in today's dollars`,
      `Invested today: ${dollars(inputs.balance)}; gap: ${dollars(result.gap)}`,
      ...(projection
        ? [
            `Timeline assumptions: age ${timeline.age}, ${dollars(timeline.monthly)}/month in today's dollars, ${timeline.real}% real return`,
            projection.reachedMonth === null
              ? 'Target not reached by age 100 under these assumptions.'
              : `First funded age: ${ageLabel(projection.reachedMonth, timeline.age)}`,
          ]
        : []),
      'Educational estimate; no retirement-success probability is calculated.',
      `${site.url}${path}`,
    ];
    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      setCopyStatus('Summary copied.');
    } catch {
      setCopyStatus('Copy is unavailable in this browser. You can select and copy the result text.');
    }
  }

  return (
    <div className="fire-number-page">
      <div className="page-title">
        <div>
          <h1>FIRE Number Calculator</h1>
          <p>Find the investments needed to fund your retirement spending, in today’s dollars.</p>
        </div>
      </div>
      <div className="fire-number-grid" data-ui="fire-number-calculator">
        <section className="inputs-panel" aria-labelledby="fire-inputs-heading">
          <div className="panel-heading">
            <h2 id="fire-inputs-heading">Your retirement budget</h2>
            <button className="text-button" type="button" onClick={reset}>
              Reset example
            </button>
          </div>
          <p className="fire-input-note">
            Example: $60,000 a year, 4% withdrawals and $300,000 invested. Edit any field.
          </p>
          <fieldset className="spending-period">
            <legend>Enter spending per</legend>
            <button type="button" aria-pressed={period === 'month'} onClick={() => switchPeriod('month')}>
              Month
            </button>
            <button type="button" aria-pressed={period === 'year'} onClick={() => switchPeriod('year')}>
              Year
            </button>
          </fieldset>
          <NumberField
            name="spending"
            label={`${period === 'month' ? 'Monthly' : 'Annual'} retirement spending`}
            value={values.spending}
            onChange={(value) => change('spending', value)}
            hint="Amount your investments must cover, including taxes and healthcare."
            error={
              issues.spending && period === 'month'
                ? 'Enter monthly spending above $0 and up to $833,333.33.'
                : issues.spending
            }
            min={0.01}
            max={period === 'month' ? 1e7 / 12 : 1e7}
            step={0.01}
            unit="$"
          />
          <NumberField
            name="withdrawal"
            label="Withdrawal rate"
            value={values.withdrawal}
            onChange={(value) => change('withdrawal', value)}
            hint="Assumed first-year withdrawal, not an investment return."
            error={issues.withdrawal}
            min={0.1}
            max={15}
            step={0.1}
            unit="%"
          />
          <NumberField
            name="balance"
            label="Invested today (optional)"
            value={values.balance}
            onChange={(value) => change('balance', value)}
            hint="Retirement investments. Exclude home equity and emergency cash."
            error={issues.balance}
            min={0}
            max={1e9}
            step={1000}
            unit="$"
          />
          <p className="fire-input-note">US dollars. No sign-up. Your entries stay in this tab.</p>
          <button
            type="button"
            className="fire-result-jump"
            onClick={() => {
              resultRef.current?.scrollIntoView({ block: 'start' });
              resultRef.current?.focus({ preventScroll: true });
            }}
          >
            View {result ? 'your FIRE number' : 'input issues'} ↓
          </button>
          <noscript>
            <p>The result shows the example. Enable JavaScript to use your own numbers.</p>
          </noscript>
        </section>
        <section
          className="fire-number-result"
          aria-labelledby="fire-result-heading"
          id="fire-result"
          ref={resultRef}
          tabIndex={-1}
        >
          <h2 id="fire-result-heading">Your FIRE number</h2>
          <div aria-live="polite">
            {result ? (
              <>
                <div className="fire-target">
                  <p>Full retirement target · Today’s dollars</p>
                  <strong>{dollars(result.target)}</strong>
                  <p>
                    {result.multiple.toFixed(2)} × {dollars(inputs.spending)} annual spending
                  </p>
                </div>
                <p className="fire-result-context">
                  A {inputs.withdrawal}% initial withdrawal equals {dollars(inputs.spending)} a year, or{' '}
                  {dollars(inputs.spending / 12)} a month. This target does not test how long the portfolio
                  will last.
                </p>
                <div className="fire-progress-heading">
                  <span>Funded today</span>
                  <strong>{result.progress.toFixed(1)}%</strong>
                </div>
                <progress
                  className="fire-progress"
                  value={Math.min(100, result.progress)}
                  max={100}
                  aria-label="Current investments as a share of your FIRE target"
                  aria-valuetext={`${result.progress.toFixed(1)}% funded`}
                />
                <dl className="fire-result-metrics">
                  <div>
                    <dt>{result.surplus > 0 ? 'Above the target' : 'Still to invest'}</dt>
                    <dd>{dollars(result.surplus > 0 ? result.surplus : result.gap)}</dd>
                  </div>
                  <div>
                    <dt>Current investments × {inputs.withdrawal}%</dt>
                    <dd>
                      {dollars(result.annualSupported)}
                      <span> /year</span>
                    </dd>
                  </div>
                </dl>
                {result.gap === 0 && (
                  <p className="fire-funded-note">
                    Your current investments meet this target under the selected assumption. Account access,
                    taxes and withdrawal risks still need a separate review.
                  </p>
                )}
                <h3>Compare withdrawal rates</h3>
                <p className="fire-input-note">
                  A lower rate needs more invested. Select a rate to update your plan.
                </p>
                <div className="fire-table-scroll">
                  <table className="fire-rate-table">
                    <caption>Same spending budget · Illustrative withdrawal assumptions</caption>
                    <thead>
                      <tr>
                        <th scope="col">Rate</th>
                        <th scope="col">Multiple</th>
                        <th scope="col">FIRE target</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rates.map((rate) => {
                        const alternative = calculateFireNumber({ ...inputs, withdrawal: rate });
                        return (
                          <tr
                            key={rate}
                            className={rate === inputs.withdrawal ? 'fire-selected-rate' : undefined}
                          >
                            <th scope="row">
                              <button
                                type="button"
                                aria-pressed={rate === inputs.withdrawal}
                                aria-label={`Use ${rate}% withdrawal rate`}
                                onClick={() => change('withdrawal', String(rate))}
                              >
                                {rate}%{rate === inputs.withdrawal && <span> Selected</span>}
                              </button>
                            </th>
                            <td>{alternative.multiple.toFixed(2)}×</td>
                            <td>{dollars(alternative.target)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <button className="fire-copy-button" type="button" onClick={copySummary}>
                  Copy summary
                </button>
                <p className="fire-copy-status" role="status">
                  {copyStatus}
                </p>
              </>
            ) : (
              <div className="fire-error-state" role="alert">
                <h3>Check your inputs</h3>
                <p>Correct the highlighted fields to see your FIRE target and progress.</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <section className="fire-timeline-section" aria-labelledby="fire-timeline-heading">
        <h2 id="fire-timeline-heading">When could you reach FIRE?</h2>
        <p>
          Your spending and withdrawal rate set the target. Savings and investment growth affect the time to
          reach it.
        </p>
        <label className="fire-timeline-toggle">
          <input
            type="checkbox"
            checked={showTimeline}
            onChange={(event) => {
              setShowTimeline(event.currentTarget.checked);
              setCopyStatus('');
            }}
          />
          Estimate my time to FIRE
        </label>
        {showTimeline && (
          <div className="fire-timeline-grid" data-ui="fire-timeline">
            <div className="fire-timeline-inputs">
              {(
                [
                  {
                    key: 'age',
                    label: 'Your age',
                    hint: 'Used to label the projection; modeled through age 100.',
                    min: 18,
                    max: 100,
                    step: 1,
                  },
                  {
                    key: 'monthly',
                    label: 'Monthly investment',
                    hint: 'Today’s dollars. Future deposits are assumed to rise with inflation.',
                    min: 0,
                    max: 1e6,
                    step: 100,
                    unit: '$',
                  },
                  {
                    key: 'real',
                    label: 'Real annual return',
                    hint: 'After inflation and fees. 4% is an editable example, not a forecast.',
                    min: -50,
                    max: 30,
                    step: 0.5,
                    unit: '%',
                  },
                ] as const
              ).map((field) => (
                <NumberField
                  key={field.key}
                  name={field.key}
                  label={field.label}
                  value={timelineValues[field.key]}
                  hint={field.hint}
                  error={timelineIssues[field.key]}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  unit={'unit' in field ? field.unit : undefined}
                  onChange={(value) => {
                    setTimelineValues((previous) => ({ ...previous, [field.key]: value }));
                    setCopyStatus('');
                  }}
                />
              ))}
            </div>
            <div className="fire-timeline-output" aria-live="polite">
              {projection && result ? (
                <>
                  <p className="fire-timeline-answer">
                    {projection.reachedMonth === null
                      ? 'Not reached by age 100'
                      : projection.reachedMonth === 0
                        ? 'Target already met'
                        : `Estimated FIRE age: ${ageLabel(projection.reachedMonth, timeline.age)}`}
                  </p>
                  <p>
                    {projection.reachedMonth === null
                      ? `The model ends at ${dollars(projection.finalBalance)}, below your ${dollars(result.target)} target. Try higher monthly savings or revisit your spending and return assumptions.`
                      : projection.reachedMonth === 0
                        ? 'No additional saving is needed to meet the target you entered. This is not a retirement-readiness assessment.'
                        : `About ${Math.floor(projection.reachedMonth / 12)} years and ${projection.reachedMonth % 12} months from now, using ${dollars(timeline.monthly)} monthly deposits and a ${timeline.real}% real annual return.`}
                  </p>
                  {projection.points.length > 1 && (
                    <FireNumberProjection
                      points={projection.points}
                      target={result.target}
                      age={timeline.age}
                    />
                  )}
                  <p className="fire-input-note">
                    Smooth growth, month-end deposits, no withdrawals before FIRE. This is an accumulation
                    estimate, not a historical backtest or success probability.
                  </p>
                </>
              ) : (
                <p role="alert">
                  {result
                    ? 'Complete the timeline fields to see an estimate. Your FIRE number above is still valid.'
                    : 'Correct your retirement budget above before estimating a timeline.'}
                </p>
              )}
            </div>
          </div>
        )}
      </section>
      <FireNumberGuide />
      <p className="review-date">
        Updated <time dateTime="2026-11-16">November 16, 2026</time> ·{' '}
        <Link to="/editorial-policy/" hash="fire-number-methodology">
          Calculation methodology
        </Link>
      </p>
    </div>
  );
}
