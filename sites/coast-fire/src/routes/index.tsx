import { createFileRoute, Link } from '@tanstack/react-router';
import { type ChangeEvent, useState } from 'react';
import {
  ageLabel,
  type ContributionMode,
  calculate,
  clampGoalAge,
  coastAgeRows,
  convertSpending,
  dollars,
  EXAMPLE,
  type Inputs,
  type SpendingPeriod,
  validate,
} from '~/lib/calculator';
import { head } from '~/lib/seo';
import { AgeTable } from '~/site/age-table';
import { GoalPlanner } from '~/site/goal-planner';
import { MobileResultLink, viewResult } from '~/site/mobile-result-link';
import { PhaseTimeline } from '~/site/phase-timeline';
import { PlanActions, PrintPlan } from '~/site/plan-actions';
import { Projection } from '~/site/projection';
import { Summary } from '~/site/summary';

export const Route = createFileRoute('/')({
  head: () =>
    head(
      'Coast FIRE Calculator — Your Number & When You Can Coast',
      'Find your Coast FIRE number, savings gap and estimated coast age. Compare return scenarios in today’s dollars with a free, private US calculator.',
      '/',
      true,
    ),
  component: Calculator,
});
const fields: {
  key: keyof Inputs;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}[] = [
  { key: 'age', label: 'Your age', hint: 'Whole years', min: 18, max: 100, step: 1 },
  {
    key: 'retirementAge',
    label: 'Retirement age',
    hint: 'When your portfolio funds your life',
    min: 18,
    max: 100,
    step: 1,
  },
  {
    key: 'balance',
    label: 'Invested today',
    hint: 'Retirement investments, not home equity',
    min: 0,
    max: 1e9,
    step: 1000,
    prefix: '$',
  },
  {
    key: 'spending',
    label: 'Annual retirement spending',
    hint: 'Portfolio-funded spending, in today’s dollars',
    min: 1,
    max: 1e7,
    step: 1000,
    prefix: '$',
  },
  {
    key: 'monthly',
    label: 'Monthly contribution',
    hint: 'Fixed future dollar amount; added at month-end',
    min: 0,
    max: 1e6,
    step: 100,
    prefix: '$',
  },
  {
    key: 'nominal',
    label: 'Nominal annual return',
    hint: 'Before inflation; account for fees in your assumption',
    min: -50,
    max: 30,
    step: 0.5,
    suffix: '%',
  },
  {
    key: 'inflation',
    label: 'Annual inflation',
    hint: 'Used to express results in today’s purchasing power',
    min: -10,
    max: 30,
    step: 0.5,
    suffix: '%',
  },
  {
    key: 'withdrawal',
    label: 'Withdrawal rate',
    hint: 'Sets the target; not a guarantee',
    min: 0.1,
    max: 15,
    step: 0.1,
    suffix: '%',
  },
];
const exampleResult = calculate(EXAMPLE);
const exampleAgeRows = coastAgeRows(EXAMPLE);

function Calculator() {
  const [values, setValues] = useState<Record<keyof Inputs, string>>(
    () =>
      Object.fromEntries(Object.entries(EXAMPLE).map(([k, v]) => [k, String(v)])) as Record<
        keyof Inputs,
        string
      >,
  );
  const [sample, setSample] = useState(true);
  const [goalAge, setGoalAge] = useState('45');
  const [goalAdjustment, setGoalAdjustment] = useState('');
  const [spendingPeriod, setSpendingPeriod] = useState<SpendingPeriod>('year');
  const [contributionMode, setContributionMode] = useState<ContributionMode>('fixed');
  const v = Object.fromEntries(
    Object.entries(values).map(([k, val]) => [k, val.trim() === '' ? Number.NaN : Number(val)]),
  ) as Inputs;
  v.spending = convertSpending(v.spending, spendingPeriod, 'year');
  const errors = validate(v);
  const r = errors.length ? null : calculate(v, contributionMode);
  function change(key: keyof Inputs, event: ChangeEvent<HTMLInputElement>) {
    const next = { ...values, [key]: event.target.value };
    setValues(next);
    if (key === 'age' || key === 'retirementAge') {
      const age = next.age.trim() === '' ? Number.NaN : Number(next.age);
      const retirement = next.retirementAge.trim() === '' ? Number.NaN : Number(next.retirementAge);
      const goal = goalAge.trim() === '' ? Number.NaN : Number(goalAge);
      const adjusted = clampGoalAge(goal, age, retirement);
      if (adjusted !== goal && Number.isFinite(adjusted)) {
        setGoalAge(String(adjusted));
        setGoalAdjustment(
          `Target Coast age adjusted from ${goal} to ${adjusted} to stay within your current age (${age}) and retirement age (${retirement}).`,
        );
      }
    }
    setSample(false);
  }
  function reset() {
    setValues(
      Object.fromEntries(Object.entries(EXAMPLE).map(([k, n]) => [k, String(n)])) as Record<
        keyof Inputs,
        string
      >,
    );
    setSample(true);
    setGoalAge('45');
    setGoalAdjustment('');
    setSpendingPeriod('year');
    setContributionMode('fixed');
  }
  function switchSpendingPeriod(next: SpendingPeriod) {
    if (next === spendingPeriod) return;
    setValues((previous) => ({
      ...previous,
      spending:
        previous.spending.trim() === ''
          ? ''
          : String(convertSpending(Number(previous.spending), spendingPeriod, next)),
    }));
    setSpendingPeriod(next);
  }
  function editAssumptions() {
    const details = document.querySelector<HTMLDetailsElement>('.assumptions');
    if (details) details.open = true;
    document.getElementById('nominal')?.focus({ preventScroll: true });
    document.getElementById('nominal')?.scrollIntoView({ block: 'center' });
  }
  function applyMonthly(monthly: number) {
    setValues((previous) => ({ ...previous, monthly: String(monthly) }));
    setSample(false);
  }
  function field(f: (typeof fields)[number]) {
    const rate = f.suffix === '%';
    return (
      <div className={`field field-${f.key}${rate ? ' rate-field' : ''}`} key={f.key}>
        <label htmlFor={f.key}>
          {f.key === 'spending'
            ? `${spendingPeriod === 'month' ? 'Monthly' : 'Annual'} retirement spending`
            : f.label}
        </label>
        <div className="input-wrap">
          {f.prefix && <span aria-hidden="true">{f.prefix}</span>}
          <input
            id={f.key}
            type="number"
            inputMode={f.prefix || rate ? 'decimal' : 'numeric'}
            value={values[f.key]}
            min={f.min}
            max={f.key === 'spending' && spendingPeriod === 'month' ? f.max / 12 : f.max}
            step={f.key === 'spending' ? 0.01 : f.step}
            onChange={(e) => change(f.key, e)}
            aria-describedby={`${f.key}-hint`}
          />
          {f.suffix && <span aria-hidden="true">{f.suffix}</span>}
        </div>
        {rate && (
          <input
            className="rate-slider"
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={values[f.key] === '' ? EXAMPLE[f.key] : values[f.key]}
            onChange={(e) => change(f.key, e)}
            aria-label={`${f.label} slider`}
            aria-describedby={`${f.key}-hint`}
          />
        )}
        <small id={`${f.key}-hint`}>
          {f.key === 'monthly' && contributionMode === 'inflation'
            ? 'Today’s buying power; dollar deposits adjust monthly with inflation'
            : f.hint}
        </small>
      </div>
    );
  }
  const scenarios = r
    ? [-2, 0, 2].map((delta) => {
        const nominal = Math.min(30, Math.max(-50, v.nominal + delta));
        return {
          label: delta < 0 ? 'Lower return' : delta > 0 ? 'Base + 2 points' : 'Base case',
          nominal,
          result: calculate({ ...v, nominal }, contributionMode),
        };
      })
    : [];
  return (
    <div className="calculator-page">
      <div className="page-title calculator-title">
        <div>
          <h1>Coast FIRE calculator</h1>
          <p className="coast-intro">
            Coast FIRE is when your investments could grow enough to fund retirement without further
            contributions. You still need to cover living costs until retirement.
          </p>
        </div>
        <PlanActions inputs={v} result={r} goalAge={goalAge} period={spendingPeriod} />
      </div>
      <div className="calculator-grid">
        <section className="inputs-panel" id="starting-point" aria-labelledby="input-heading">
          <div className="panel-heading">
            <h2 id="input-heading">Your Coast FIRE number</h2>
            <button className="text-button" type="button" onClick={reset}>
              Reset example ↺
            </button>
          </div>
          <p className="sample-notice">
            {sample
              ? 'Your starting point is the example below. Replace the ages, investments, spending and monthly savings to update your Coast FIRE number and timeline.'
              : 'Your inputs stay in this tab. Nothing is uploaded.'}
          </p>
          <div className="age-fields">{fields.slice(0, 2).map(field)}</div>
          {field(fields[2]!)}
          <fieldset className="spending-period">
            <legend>Enter retirement spending per</legend>
            <button
              type="button"
              aria-pressed={spendingPeriod === 'month'}
              onClick={() => switchSpendingPeriod('month')}
            >
              Month
            </button>
            <button
              type="button"
              aria-pressed={spendingPeriod === 'year'}
              onClick={() => switchSpendingPeriod('year')}
            >
              Year
            </button>
          </fieldset>
          {field(fields[3]!)}
          {field(fields[4]!)}
          <label className="contribution-option" htmlFor="inflate-contributions">
            <input
              id="inflate-contributions"
              type="checkbox"
              checked={contributionMode === 'inflation'}
              onChange={(event) => {
                setContributionMode(event.target.checked ? 'inflation' : 'fixed');
                setSample(false);
              }}
            />
            <span>Adjust contributions with inflation</span>
          </label>
          <p className="fine contribution-option-note">
            {contributionMode === 'inflation'
              ? 'Keeps the entered buying power each month. Future deposits rise with positive inflation and fall with deflation.'
              : 'Off: the future dollar amount stays fixed. Turn on to keep the same buying power.'}
          </p>
          <details className="assumptions" open>
            <summary>Return &amp; withdrawal assumptions</summary>
            <div className="assumption-fields">{fields.slice(5).map(field)}</div>
            <p className="fine">
              Example rates illustrate the model; they are not a market forecast.{' '}
              <Link to="/editorial-policy/">How we calculate</Link>
            </p>
          </details>
          <p className="input-footnote">US dollars. One person. No Social Security or tax calculation.</p>
          <button type="button" className="mobile-view-result" onClick={viewResult}>
            {r ? 'View updated result ↑' : 'Check input issues ↑'}
          </button>
        </section>
        <section className="results-panel" aria-label="Calculation results">
          {r ? (
            <>
              <Summary r={r} v={v} sample={sample} onEdit={editAssumptions} onApply={applyMonthly} />
              <div className="chart-block">
                <div className="panel-heading">
                  <h2>When can you coast?</h2>
                  <span className="fine">Hypothetical growth</span>
                </div>
                <Projection result={r} age={v.age} retirementAge={v.retirementAge} />
                <PhaseTimeline result={r} age={v.age} retirementAge={v.retirementAge} />
                <p className="chart-note">
                  {r.retirementOnly
                    ? 'The teal path reaches the retirement target at retirement. There is no pre-retirement Coast phase.'
                    : 'The teal path stops contributions at the Coast milestone.'}{' '}
                  Both paths still require income for living costs before retirement.
                </p>
                <div className="target-strip">
                  <span>
                    Full retirement target <strong>{dollars(r.target)}</strong>
                  </span>
                  <span>
                    Real annual return <strong>{(r.real * 100).toFixed(2)}%</strong>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="error-panel" id="coast-result" tabIndex={-1} role="alert">
              <h2>Check your inputs</h2>
              <ul>
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
              <p>Results will reappear when all fields are valid.</p>
            </div>
          )}
        </section>
      </div>
      {r && (
        <>
          <GoalPlanner
            inputs={v}
            goalAge={goalAge}
            onGoalAge={(value) => {
              setGoalAge(value);
              setGoalAdjustment('');
            }}
            onApply={applyMonthly}
            mode={contributionMode}
            adjustment={goalAdjustment}
          />
          <section className="scenario-section" aria-labelledby="scenario-title">
            <div className="section-intro">
              <h2 id="scenario-title">See how returns move your date.</h2>
              <p>
                One assumption can move your milestone. These scenarios change nominal return only; they are
                not probabilities.
              </p>
            </div>
            <div className="scenario-table">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Scenario</th>
                    <th scope="col">Nominal / real</th>
                    <th scope="col">Coast number</th>
                    <th scope="col">Coast age</th>
                  </tr>
                </thead>
                <tbody>
                  {scenarios.map((s, i) => (
                    <tr key={s.label} className={i === 1 ? 'base-row' : ''}>
                      <th scope="row">
                        {s.label}
                        {i === 1 && <span className="base-label">Your inputs</span>}
                      </th>
                      <td>
                        {s.nominal.toFixed(1)}% / {(s.result.real * 100).toFixed(2)}%
                      </td>
                      <td>{dollars(s.result.coast)}</td>
                      <td>
                        {s.result.coastMonth === null
                          ? 'Not reached'
                          : s.result.coastMonth === 0
                            ? 'Now'
                            : ageLabel(s.result.coastMonth, v.age)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <details className="year-details">
            <summary>Explore your year-by-year projection</summary>
            <div className="table-scroll">
              <table>
                <caption>Personal projection · All balances in today’s dollars</caption>
                <thead>
                  <tr>
                    <th scope="col">Age</th>
                    <th scope="col">Stop adding now</th>
                    <th scope="col">Save, then coast</th>
                    <th scope="col">Coast threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {r.points
                    .filter((p) => p.month % 12 === 0 || p.month === r.coastMonth)
                    .map((p) => (
                      <tr key={p.month}>
                        <th scope="row">
                          {ageLabel(p.month, v.age)}
                          {p.month === r.coastMonth ? ' · Coast' : ''}
                        </th>
                        <td>{dollars(p.stopNow)}</td>
                        <td>{dollars(p.coastPath)}</td>
                        <td>{dollars(p.threshold)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
      <div className="education-grid">
        <section className="age-reference">
          <h2>Coast FIRE numbers by age</h2>
          <p>With positive real growth, more years to compound lower the Coast number.</p>
          <AgeTable
            rows={exampleAgeRows}
            caption={`Fixed example · ${dollars(EXAMPLE.spending)}/year spending · ${EXAMPLE.withdrawal}% withdrawal · ${(exampleResult.real * 100).toFixed(2)}% real return · Retire at ${EXAMPLE.retirementAge}`}
          />
          <p className="fine">
            The table uses fixed assumptions. Edit them in the{' '}
            <Link to="/coast-fire-calculator-by-age/">Coast FIRE Calculator by Age</Link>.
          </p>
        </section>
        <section className="method-block">
          <h2>How to calculate Coast FIRE</h2>
          <p>
            Here’s how the opening example gets its Coast FIRE number at age {EXAMPLE.age}, with retirement at{' '}
            {EXAMPLE.retirementAge}. All amounts are in today’s dollars.
          </p>
          <div className="formula">
            <span>1. Full retirement target</span>
            <p>
              {dollars(EXAMPLE.spending)} ÷ {EXAMPLE.withdrawal}% = {dollars(exampleResult.target)}
            </p>
            <span>2. Real annual return</span>
            <p>
              (1 + {EXAMPLE.nominal}%) ÷ (1 + {EXAMPLE.inflation}%) − 1 ≈{' '}
              {(exampleResult.real * 100).toFixed(2)}%
            </p>
            <span>3. Coast number today</span>
            <p>
              {dollars(exampleResult.target)} ÷ (1 + real return)
              <sup>{EXAMPLE.retirementAge - EXAMPLE.age}</sup> ≈ {dollars(exampleResult.coast)}
            </p>
          </div>
          <h3>Consistent purchasing power</h3>
          <p>
            The model uses the unrounded real return. The Coast FIRE number is the amount you’d need invested
            today to reach the retirement target through growth alone.
          </p>
          <h3>Know the boundaries</h3>
          <p>
            These are smooth-return estimates. They exclude market volatility, taxes, account-access rules and
            automatic Social Security or pension estimates.
          </p>
          <Link to="/editorial-policy/" className="arrow-link">
            Read the complete methodology →
          </Link>
        </section>
      </div>
      <section className="faq-section">
        <div>
          <h2>A few good questions.</h2>
          <p>
            New to the idea? <Link to="/what-is-coast-fire/">Start with the Coast FIRE guide →</Link>
          </p>
        </div>
        <div className="faq-list">
          {[
            [
              'Does Coast FIRE mean I can quit my job?',
              'It means you may be able to stop adding to retirement investments under your assumptions. You still need income for living costs until retirement. The calculator does not assess whether you can quit work today.',
              '/what-is-coast-fire/',
              'Read what Coast FIRE means',
            ],
            [
              'What if I contribute nothing each month?',
              'The monthly contribution can be zero. If your investments already clear the Coast threshold, you are coasting in this model. Otherwise zero contributions will not close the gap under the same fixed assumptions.',
              '/coast-fire-calculator-by-age/',
              'Compare balances needed by age',
            ],
            [
              'Is the 4% withdrawal rate guaranteed?',
              'No. It is an editable planning assumption used to convert spending into a target. This tool does not simulate retirement withdrawals, market crashes or the chance that a portfolio lasts a certain number of years.',
              '/editorial-policy/',
              'See the model’s assumptions',
            ],
            [
              'Why does my number differ from another calculator?',
              'Compare real versus nominal return, retirement age, spending, withdrawal rate, contribution timing and whether Social Security is included. Contributions default to fixed dollars. The optional inflation adjustment keeps their purchasing power constant and changes the result.',
              '/editorial-policy/',
              'Review the calculation methodology',
            ],
            [
              'Are my financial details saved?',
              'Not automatically. Inputs stay in page memory, with no upload or browser storage. You may download an Excel plan or print/save a PDF on your device. Reloading restores the example, but does not delete copies you chose to keep.',
              '/privacy/',
              'Read the privacy policy',
            ],
          ].map(([q, a, to, label]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>
                {a} <Link to={to}>{label}</Link>.
              </p>
            </details>
          ))}
        </div>
      </section>
      <div className="bottom-note">
        <p>Built for clarity. Your assumptions, your perspective.</p>
        <span>
          Updated November 5, 2026 · <Link to="/about/">About this project</Link>
        </span>
      </div>
      <MobileResultLink result={r} age={v.age} />
      {r && <PrintPlan inputs={v} result={r} goalAge={goalAge} period={spendingPeriod} />}
    </div>
  );
}
