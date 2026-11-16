import { createFileRoute, Link } from '@tanstack/react-router';
import { type ChangeEvent, useRef, useState } from 'react';
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
import { head, homeLastModified } from '~/lib/seo';
import { AgeTable } from '~/site/age-table';
import { GoalPlanner } from '~/site/goal-planner';
import { MobileResultLink, viewResult } from '~/site/mobile-result-link';
import { PhaseTimeline } from '~/site/phase-timeline';
import { PlanActions, PrintPlan } from '~/site/plan-actions';
import { Projection } from '~/site/projection';
import { Summary } from '~/site/summary';
import { contactEmail, operator } from '../../site.config';

export const Route = createFileRoute('/')({
  head: () =>
    head(
      'Free Coast FIRE Calculator | Inflation-Adjusted Planning',
      'Use this free Coast FIRE calculator to find your number, plan monthly savings for a target age, and compare inflation-adjusted return scenarios privately.',
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

type ExamplePlan = {
  name: string;
  inputs: Inputs;
  goalAge: number;
  contributionMode: ContributionMode;
};
const openingPlan: ExamplePlan = {
  name: 'Steady saver',
  inputs: EXAMPLE,
  goalAge: 45,
  contributionMode: 'fixed',
};
const examplePlans: ExamplePlan[] = [
  openingPlan,
  {
    name: 'Starting early',
    inputs: { ...EXAMPLE, age: 25, balance: 25000, spending: 42000, monthly: 750 },
    goalAge: 45,
    contributionMode: 'inflation',
  },
  {
    name: 'Already coasting',
    inputs: { ...EXAMPLE, age: 45, balance: 650000, monthly: 0 },
    goalAge: 50,
    contributionMode: 'fixed',
  },
  {
    name: 'Pausing contributions',
    inputs: { ...EXAMPLE, age: 40, balance: 180000, monthly: 0 },
    goalAge: 55,
    contributionMode: 'fixed',
  },
];

type InputValues = Record<keyof Inputs, string>;
type PlanDraft = {
  values: InputValues;
  goalAge: string;
  goalAdjustment: string;
  spendingPeriod: SpendingPeriod;
  contributionMode: ContributionMode;
};

function toInputValues(inputs: Inputs) {
  return Object.fromEntries(
    Object.entries(inputs).map(([key, value]) => [key, String(value)]),
  ) as InputValues;
}

function Calculator() {
  const [values, setValues] = useState(() => toInputValues(openingPlan.inputs));
  const [example, setExample] = useState<ExamplePlan | null>(openingPlan);
  const [savedDraft, setSavedDraft] = useState<PlanDraft | null>(null);
  const examplePicker = useRef<HTMLDetailsElement>(null);
  const [goalAge, setGoalAge] = useState(String(openingPlan.goalAge));
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
    setExample(null);
  }
  function loadExample(plan: ExamplePlan) {
    if (!example && !savedDraft) {
      setSavedDraft({ values, goalAge, goalAdjustment, spendingPeriod, contributionMode });
    }
    setValues(toInputValues(plan.inputs));
    setExample(plan);
    setGoalAge(String(plan.goalAge));
    setGoalAdjustment('');
    setSpendingPeriod('year');
    setContributionMode(plan.contributionMode);
    if (examplePicker.current) {
      examplePicker.current.open = false;
      examplePicker.current.querySelector('summary')?.focus();
    }
  }
  function restoreDraft() {
    if (!savedDraft) return;
    setValues(savedDraft.values);
    setExample(null);
    setGoalAge(savedDraft.goalAge);
    setGoalAdjustment(savedDraft.goalAdjustment);
    setSpendingPeriod(savedDraft.spendingPeriod);
    setContributionMode(savedDraft.contributionMode);
    setSavedDraft(null);
    examplePicker.current?.querySelector('summary')?.focus();
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
    setExample(null);
  }
  function editAssumptions() {
    const details = document.querySelector<HTMLDetailsElement>('.assumptions');
    if (details) details.open = true;
    document.getElementById('nominal')?.focus({ preventScroll: true });
    document.getElementById('nominal')?.scrollIntoView({ block: 'center' });
  }
  function applyMonthly(monthly: number) {
    setValues((previous) => ({ ...previous, monthly: String(monthly) }));
    setExample(null);
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
          <h1>Free Coast FIRE Calculator with Inflation-Adjusted Planning</h1>
          <p className="coast-intro">
            Enter your numbers to find your Coast FIRE number: the investments needed today to grow to your
            retirement target without new contributions. This milestone is also called Coast FI.
          </p>
        </div>
        <PlanActions inputs={v} result={r} goalAge={goalAge} period={spendingPeriod} />
      </div>
      <div className="calculator-grid">
        <section className="inputs-panel" id="starting-point" aria-labelledby="input-heading">
          <div className="panel-heading">
            <h2 id="input-heading">Your Coast FIRE number</h2>
          </div>
          <p className="sample-notice">
            {example
              ? `Example: ${example.name}. Edit any field to use your own numbers.`
              : 'Your inputs stay in this tab. Nothing is uploaded.'}
          </p>
          <details className="example-picker" ref={examplePicker}>
            <summary>Try an example</summary>
            <p className="fine">Load a sample plan to fill in the calculator and see its results.</p>
            <ul>
              {examplePlans.map((plan) => (
                <li key={plan.name}>
                  <button
                    className="example-option"
                    type="button"
                    aria-label={
                      plan === example ? `${plan.name} example loaded` : `Load ${plan.name} example`
                    }
                    disabled={plan === example}
                    onClick={() => loadExample(plan)}
                  >
                    <span>
                      <strong>{plan.name}</strong>
                      <small>
                        Age {plan.inputs.age} · {dollars(plan.inputs.balance)} invested ·{' '}
                        {dollars(plan.inputs.monthly)}/mo
                      </small>
                    </span>
                    <span>{plan === example ? 'Loaded' : 'Load'}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
          {savedDraft && (
            <button className="text-button restore-inputs" type="button" onClick={restoreDraft}>
              Restore my inputs
            </button>
          )}
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
                setExample(null);
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
            {r ? 'View updated result' : 'Check input issues'}
          </button>
        </section>
        <section className="results-panel" aria-label="Calculation results">
          {r ? (
            <>
              <Summary
                r={r}
                v={v}
                exampleName={example?.name}
                onEdit={editAssumptions}
                onApply={applyMonthly}
              />
              <div className="chart-block">
                <div className="panel-heading">
                  <h2>When Can You Reach Coast FIRE?</h2>
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
                <p className="chart-note">
                  New to coasting? Read{' '}
                  <Link to="/what-is-coast-fire/">what Coast FIRE means, with formulas and examples</Link>. To
                  compare savings targets at different starting ages, use the{' '}
                  <Link to="/coast-fire-calculator-by-age/">Coast FIRE calculator by age</Link>.
                </p>
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
              setExample(null);
            }}
            onApply={applyMonthly}
            mode={contributionMode}
            adjustment={goalAdjustment}
          />
          <section className="scenario-section" aria-labelledby="scenario-title">
            <div className="section-intro">
              <h2 id="scenario-title">How Investment Returns Affect Your Coast FIRE Age</h2>
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
      <aside className="related-calculator" aria-label="Related calculator">
        <p>
          Planning to cover some bills with part-time work? Use the{' '}
          <Link to="/barista-fire-calculator/">Barista FIRE calculator</Link> to estimate how take-home pay
          and portfolio withdrawals could fund your spending before full retirement.
        </p>
      </aside>
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
          <Link to="/editorial-policy/" hash="calculation-validation" className="arrow-link">
            Verify the calculations with worked examples →
          </Link>
        </section>
      </div>
      <section className="faq-section" aria-labelledby="faq-heading">
        <div>
          <h2 id="faq-heading">Coast FIRE Calculator FAQs</h2>
          <p>
            New to the idea? <Link to="/what-is-coast-fire/">Start with the Coast FIRE guide →</Link>
          </p>
        </div>
        <div className="faq-list">
          <details>
            <summary>What is my Coast FIRE number?</summary>
            <p>
              Your Coast FIRE number is the balance you would need invested today to reach your retirement
              target through growth alone. It depends on your retirement spending, current age, retirement
              age, expected return after inflation, and withdrawal rate.{' '}
              <a href="#starting-point">Enter your assumptions in the calculator</a> to find how much you need
              invested today.
            </p>
          </details>
          <details>
            <summary>Is Coast FI the same as Coast FIRE?</summary>
            <p>
              Yes. Coast FI (coast financial independence) and Coast FIRE describe the same milestone: your
              investments could grow to your retirement target without further contributions under your chosen
              assumptions. You still need earnings or separate funds for living costs until retirement. This
              calculator uses the same formula for either term.{' '}
              <Link to="/what-is-coast-fire/">Read what Coast FIRE means</Link> for examples and limits.
            </p>
          </details>
          <details>
            <summary>How do I know if I’ve reached Coast FIRE?</summary>
            <p>
              Before retirement, you’ve reached Coast FIRE under the model’s assumptions when your current
              retirement investments equal or exceed your Coast FIRE number.{' '}
              <a href="#coast-result">Check your result</a> to see whether you’re already coasting or how much
              more you’d need invested today.
            </p>
          </details>
          {[
            [
              'What investment accounts should I include?',
              'Add up the investments you’ve set aside for retirement, such as balances in a 401(k), traditional or Roth IRA, and taxable brokerage account. Leave out home equity, emergency savings, and money set aside for near-term expenses. The calculator uses a combined balance, so check each account’s withdrawal rules separately.',
            ],
            [
              'Does this Coast FIRE calculator account for inflation?',
              'Yes. It uses your return and inflation assumptions to show results in today’s dollars. Monthly deposits stay fixed in dollar terms by default, and you can turn on inflation adjustments to keep their purchasing power steady.',
              '/editorial-policy/',
              'See how the model adjusts for inflation',
            ],
            [
              'What rate of return should I use?',
              'Enter an estimated annual return for your mix of investments after fees and before inflation. The default is an example, and the lower-return scenario shows how a more cautious assumption could change your result.',
            ],
            [
              'What should I include in retirement spending?',
              'Include costs such as housing, food, healthcare, transportation, and occasional expenses like home repairs. Use today’s prices and enter the amount you expect your investments to cover, either per month or per year.',
            ],
            [
              'Does the calculator include taxes and Social Security?',
              'No. It doesn’t calculate taxes or estimate Social Security or pension income. Estimate those amounts separately, and include any taxes you expect your investments to cover in your spending budget.',
            ],
            [
              'Does Coast FIRE mean I can quit my job?',
              'Reaching Coast FIRE by itself doesn’t tell you whether you can afford to quit. It means you may be able to stop contributing to your retirement investments while covering living costs some other way. With full FIRE, your investments and other available income can cover those costs now without a paycheck.',
              '/what-is-coast-fire/',
              'Compare Coast FIRE with full FIRE in the guide',
            ],
            [
              'What if I contribute nothing each month?',
              'The monthly contribution can be zero. If your investments already clear the Coast threshold, you are coasting in this model. Otherwise zero contributions will not close the gap under the same fixed assumptions.',
              '/coast-fire-calculator-by-age/',
              'Compare balances needed by age',
            ],
            [
              'Is the 4% withdrawal rate guaranteed?',
              'No. It’s an adjustable assumption used to turn spending into a retirement savings target. This tool does not simulate retirement withdrawals, market crashes, or how long your portfolio will last.',
              '/editorial-policy/',
              'See the model’s assumptions',
            ],
            [
              'Why does my number differ from another calculator?',
              'Check that both tools use the same retirement age, spending, withdrawal rate, and return after inflation. Differences in when contributions are added or how Social Security is treated can also change the estimate.',
              '/editorial-policy/',
              'Review the calculation methodology',
            ],
            [
              'Are my financial details saved?',
              'Your inputs stay in this tab and aren’t uploaded or saved in browser storage. You can download an Excel plan or print or save a PDF on your device. Reloading restores the example, and any copies you saved stay on your device.',
              '/privacy/',
              'Read the privacy policy',
            ],
          ].map(([q, a, to, label]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>
                {a}
                {to && (
                  <>
                    {' '}
                    <Link to={to}>{label}</Link>.
                  </>
                )}
              </p>
            </details>
          ))}
        </div>
      </section>
      <div className="bottom-note">
        <section aria-labelledby="editorial-heading">
          <h2 id="editorial-heading">Who maintains this calculator?</h2>
          <p>
            {operator && (
              <>
                Maintained by <Link to="/about/">{operator}</Link>.{' '}
              </>
            )}
            This independent project develops educational retirement calculators for US readers and documents
            the formulas and assumptions behind them.
          </p>
          <p>
            Updated <time dateTime={homeLastModified}>November 16, 2026</time> ·{' '}
            <Link to="/editorial-policy/">Methodology and editorial policy</Link>
          </p>
          <p>
            Report a calculation or wording error{' '}
            {contactEmail ? (
              <>
                to <a href={`mailto:${contactEmail}`}>{contactEmail}</a>.
              </>
            ) : (
              <>
                through the <Link to="/contact/">contact page</Link>.
              </>
            )}{' '}
            Include the page URL and use sample amounts if needed to reproduce the issue.
          </p>
        </section>
        <section aria-labelledby="official-sources-heading">
          <h2 id="official-sources-heading">Official sources</h2>
          <p>
            Sources checked <time dateTime="2026-11-07">November 7, 2026</time>.
          </p>
          <ul>
            <li>
              <a href="https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator">
                SEC Investor.gov’s compound interest calculator
              </a>{' '}
              shows how a starting balance and regular contributions grow at an assumed rate.
            </li>
            <li>
              <a href="https://www.ssa.gov/retirement/full-retirement-age">SSA’s full retirement age guide</a>{' '}
              explains Social Security benefit timing. Estimate those benefits separately.
            </li>
            <li>
              <a href="https://www.irs.gov/publications/p590b">IRS Publication 590-B</a> explains IRA
              withdrawals. Check account access and withdrawal taxes separately.
            </li>
          </ul>
        </section>
      </div>
      <MobileResultLink result={r} age={v.age} />
      {r && <PrintPlan inputs={v} result={r} goalAge={goalAge} period={spendingPeriod} />}
    </div>
  );
}
