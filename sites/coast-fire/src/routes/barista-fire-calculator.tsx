import { createFileRoute, Link } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import {
  BARISTA_EXAMPLE,
  BARISTA_FIELDS,
  type BaristaInputs,
  baristaIssues,
  calculateBarista,
} from '~/lib/barista';
import { ageLabel, dollars } from '~/lib/calculator';
import { head } from '~/lib/seo';
import { BaristaGuide } from '~/site/barista-guide';
import site from '../../site.config';

const path = '/barista-fire-calculator/';
const description =
  'Use this Barista FIRE calculator to combine part-time pay with portfolio withdrawals. See your savings target, compare ages and budgets, and test your plan.';

export const Route = createFileRoute('/barista-fire-calculator')({
  head: () =>
    head('Barista FIRE Calculator – Part-Time Income & Savings', description, path, false, false, {
      image: '/share/barista-fire-calculator.png',
      jsonLd: [
        {
          '@type': 'WebApplication',
          name: 'Barista FIRE Calculator',
          description,
          url: `${site.url}${path}`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
      ],
    }),
  component: BaristaCalculator,
});

const exampleValues = Object.fromEntries(
  Object.entries(BARISTA_EXAMPLE).map(([key, value]) => [key, String(value)]),
) as Record<keyof BaristaInputs, string>;

function BaristaCalculator() {
  const [values, setValues] = useState(exampleValues);
  const [notice, setNotice] = useState('Example: $25/hour, 20 hours/week. Edit any field to try your plan.');
  const resultRef = useRef<HTMLElement>(null);
  const inputs = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value.trim() === '' ? Number.NaN : Number(value)]),
  ) as BaristaInputs;
  const issues = baristaIssues(inputs);
  const result = Object.keys(issues).length ? null : calculateBarista(inputs);
  const jumpToResult = () => {
    resultRef.current?.scrollIntoView({ block: 'start' });
    resultRef.current?.focus({ preventScroll: true });
  };
  function field(key: keyof BaristaInputs) {
    const f = BARISTA_FIELDS[key];
    const id = `barista-${key}`;
    return (
      <div className="field" key={key}>
        <label htmlFor={id}>{f.label}</label>
        <div className="input-wrap">
          {'unit' in f && f.unit === '$' && <span aria-hidden="true">$</span>}
          <input
            id={id}
            type="number"
            inputMode={'whole' in f ? 'numeric' : 'decimal'}
            min={f.min}
            max={f.max}
            step={'whole' in f ? 1 : 'any'}
            value={values[key]}
            aria-invalid={Boolean(issues[key])}
            aria-describedby={`${id}-hint${issues[key] ? ` ${id}-error` : ''}`}
            onChange={(event) => {
              const value = event.currentTarget.value;
              setValues((previous) => ({ ...previous, [key]: value }));
              setNotice('Your inputs stay in this tab. Results update as you type.');
            }}
          />
          {'unit' in f && f.unit === '%' && <span aria-hidden="true">%</span>}
        </div>
        <small id={`${id}-hint`}>{f.hint}</small>
        {issues[key] && (
          <small className="barista-field-error" id={`${id}-error`}>
            {issues[key]}
          </small>
        )}
      </div>
    );
  }
  return (
    <div className="calculator-page barista-page">
      <div className="page-title">
        <div>
          <h1>Barista FIRE Calculator</h1>
          <p>See how part-time pay and investments could cover your life, now and after work ends.</p>
        </div>
      </div>
      <button type="button" className="barista-mobile-summary" onClick={jumpToResult}>
        <span>
          {result ? (
            <>
              Portfolio needed today<strong>{dollars(Math.ceil(result.required))}</strong>
            </>
          ) : (
            'Check your input issues'
          )}
        </span>
        <span>View result ↓</span>
      </button>
      <div className="barista-calculator">
        <section className="inputs-panel" aria-labelledby="barista-inputs">
          <div className="panel-heading">
            <h2 id="barista-inputs">Your part-time plan</h2>
            <button
              type="button"
              className="text-button"
              onClick={() => {
                setValues(exampleValues);
                setNotice('Example restored: $25/hour, 20 hours/week.');
              }}
            >
              Reset example
            </button>
          </div>
          <p className="sample-notice" role="status">
            {notice}
          </p>
          <div className="barista-field-pair">
            {field('hourly')}
            {field('hours')}
          </div>
          {field('spending')}
          {field('balance')}
          <div className="barista-field-pair">
            {field('age')}
            {field('retirementAge')}
          </div>
          <details className="assumptions barista-assumptions">
            <summary>Income &amp; return assumptions</summary>
            <p className="fine">
              Example: 52 paid weeks · 20% income deductions · 7% return · 3% inflation · 4% withdrawal rate.
            </p>
            <div className="barista-field-pair">
              {field('weeks')}
              {field('tax')}
            </div>
            {field('nominal')}
            {field('inflation')}
            {field('withdrawal')}
          </details>
          <button className="secondary-button barista-result-jump" type="button" onClick={jumpToResult}>
            {result ? 'View updated result ↓' : 'Review input issues ↓'}
          </button>
          <noscript>
            <p className="fine">
              The example is shown below. Enable JavaScript to edit inputs and recalculate.
            </p>
          </noscript>
        </section>
        <section
          className="barista-results"
          ref={resultRef}
          id="barista-result"
          tabIndex={-1}
          aria-labelledby="barista-results-heading"
        >
          <h2 id="barista-results-heading">Your Barista FIRE estimate</h2>
          <div>
            {result ? (
              <>
                <p className="barista-status" role="status" aria-atomic="true">
                  {result.gap > 0
                    ? `${dollars(Math.ceil(result.gap))} more invested would meet both modeled checks.`
                    : `Your balance meets both modeled checks, with ${dollars(result.surplus)} above the target.`}
                </p>
                <div className="barista-target">
                  <span>Portfolio needed today</span>
                  <strong>{dollars(Math.ceil(result.required))}</strong>
                  <p>
                    For {dollars(inputs.spending)}/year spending, with part-time income until age{' '}
                    {inputs.retirementAge}.
                  </p>
                </div>
                <div className="barista-income">
                  <h3>How your monthly spending is covered</h3>
                  <div
                    className="barista-income-bar"
                    role="img"
                    aria-label={`${(result.coverage * 100).toFixed(0)}% of spending covered by work, ${((1 - result.coverage) * 100).toFixed(0)}% by investments`}
                  >
                    <span style={{ width: `${result.coverage * 100}%` }} />
                  </div>
                  <dl className="barista-income-split">
                    <div>
                      <dt>
                        <i className="barista-work-key" />
                        Take-home pay
                      </dt>
                      <dd>
                        {dollars(result.netIncome / 12)}
                        <small>{dollars(result.netIncome)}/year</small>
                      </dd>
                    </div>
                    <div>
                      <dt>
                        <i className="barista-portfolio-key" />
                        Portfolio withdrawals
                      </dt>
                      <dd>
                        {dollars(result.annualGap / 12)}
                        <small>{dollars(result.annualGap)}/year</small>
                      </dd>
                    </div>
                  </dl>
                  {result.netIncome > inputs.spending && (
                    <p className="fine">
                      Pay exceeds spending by {dollars(result.netIncome - inputs.spending)}/year. The surplus
                      is not invested in this model.
                    </p>
                  )}
                  {result.months === 0 && (
                    <p className="fine">Your stop-work age is now. No part-time income is counted.</p>
                  )}
                </div>
                <dl className="barista-checks">
                  <div>
                    <dt>
                      Income-gap target<small>Annual gap ÷ {inputs.withdrawal}%</small>
                    </dt>
                    <dd>{dollars(result.incomeGapTarget)}</dd>
                  </div>
                  <div>
                    <dt>
                      Bridge + retirement target<small>Monthly withdrawals, then full retirement</small>
                    </dt>
                    <dd>{dollars(result.bridgeTarget)}</dd>
                  </div>
                </dl>
                <p className="fine barista-check-note">
                  The headline uses the larger target.{' '}
                  <a href="#barista-formula">See the formulas and worked example</a>.
                </p>
                <div className="barista-retirement">
                  <h3>When work ends at {inputs.retirementAge}</h3>
                  <dl className="barista-income-split">
                    <div>
                      <dt>Projected from your balance</dt>
                      <dd>{dollars(result.projectedBalance)}</dd>
                    </div>
                    <div>
                      <dt>Full retirement target</dt>
                      <dd>{dollars(result.retirementTarget)}</dd>
                    </div>
                  </dl>
                  {result.depletedMonth !== null ? (
                    <p>
                      Investments first fail to cover the modeled withdrawals around age{' '}
                      {ageLabel(result.depletedMonth, inputs.age)}. The projection stops at zero.
                    </p>
                  ) : (
                    <p>
                      {result.projectedBalance < result.retirementTarget * (1 - 1e-10)
                        ? 'The projected balance is below the full retirement target.'
                        : 'The projected balance covers the full retirement target under these assumptions.'}
                    </p>
                  )}
                </div>
                <p className="barista-assumption-note">
                  {inputs.weeks} paid weeks · {inputs.tax}% income deductions · {inputs.nominal}% nominal
                  return · {inputs.inflation}% inflation · {inputs.withdrawal}% withdrawal rate. Today’s
                  dollars; no new contributions. Wages and spending keep pace with inflation.
                </p>
              </>
            ) : (
              <div className="barista-errors" role="status">
                <h3>Check your inputs</h3>
                <ul>
                  {Object.entries(issues).map(([key, issue]) => (
                    <li key={key}>
                      <a
                        href={`#barista-${key}`}
                        onClick={() => {
                          const input = document.getElementById(`barista-${key}`);
                          const disclosure = input?.closest('details');
                          if (disclosure) disclosure.open = true;
                          input?.focus();
                        }}
                      >
                        {issue}
                      </a>
                    </li>
                  ))}
                </ul>
                <p>Results return when every field is valid. Your other inputs are kept.</p>
              </div>
            )}
          </div>
          <p className="barista-limit-note">
            Educational estimate. Smooth returns, no success probability. Taxes on withdrawals, account access
            and future benefit income need separate planning.
          </p>
        </section>
      </div>
      <nav className="barista-toc" aria-label="On this page">
        <a href="#what-is-barista-fire">What is Barista FIRE?</a>
        <a href="#barista-formula">Formulas</a>
        <a href="#barista-by-age">Age &amp; spending table</a>
        <a href="#barista-vs-coast">Barista vs Coast</a>
        <a href="#barista-faq">FAQ</a>
      </nav>
      <BaristaGuide />
      <p className="bottom-note">
        Prefer to leave retirement investments untouched?{' '}
        <Link to="/">Calculate your Coast FIRE number →</Link>
      </p>
    </div>
  );
}
