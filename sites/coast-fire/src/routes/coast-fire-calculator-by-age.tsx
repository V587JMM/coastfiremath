import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { type CoastAssumptions, coastAgeRows, EXAMPLE, validate } from '~/lib/calculator';
import { head } from '~/lib/seo';
import { AgeGuide, ageFaq } from '~/site/age-guide';
import { AgeTable } from '~/site/age-table';
import { faqSchema } from '~/site/content-faq';
import site from '../../site.config';

const path = '/coast-fire-calculator-by-age/';
const description =
  'Compare Coast FIRE numbers from age 25 to 60. Adjust retirement age, spending, return, inflation and withdrawal rate to see the savings target at each age.';

export const Route = createFileRoute('/coast-fire-calculator-by-age')({
  head: () =>
    head('Coast FIRE Calculator by Age — Compare Savings Targets', description, path, false, false, {
      image: '/share/coast-fire-by-age.png',
      jsonLd: [
        {
          '@type': 'WebApplication',
          name: 'Coast FIRE Calculator by Age',
          description,
          url: `${site.url}${path}`,
          image: `${site.url}/share/coast-fire-by-age.png`,
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Any',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        },
        faqSchema(ageFaq),
      ],
    }),
  component: ByAge,
});

const fields = [
  { key: 'retirementAge', label: 'Retirement age', min: 18, max: 100, step: 1 },
  { key: 'spending', label: 'Annual spending', min: 0.01, max: 1e7, step: 0.01, prefix: '$' },
  { key: 'nominal', label: 'Nominal annual return', min: -50, max: 30, step: 'any', suffix: '%' },
  { key: 'inflation', label: 'Annual inflation', min: -10, max: 30, step: 'any', suffix: '%' },
  { key: 'withdrawal', label: 'Withdrawal rate', min: 0.1, max: 15, step: 'any', suffix: '%' },
] as const;

const example = {
  retirementAge: String(EXAMPLE.retirementAge),
  spending: String(EXAMPLE.spending),
  nominal: String(EXAMPLE.nominal),
  inflation: String(EXAMPLE.inflation),
  withdrawal: String(EXAMPLE.withdrawal),
};

function ByAge() {
  const [values, setValues] = useState(example);
  const assumptions = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [key, value === '' ? Number.NaN : Number(value)]),
  ) as CoastAssumptions;
  const errors = validate({ ...assumptions, age: 18, balance: 0, monthly: 0 });
  const rows = errors.length === 0 ? coastAgeRows(assumptions) : [];

  return (
    <div className="by-age-page">
      <div className="page-title">
        <div>
          <h1>Coast FIRE Calculator by Age</h1>
          <p>Compare how much you’d need invested at different ages for the same retirement goal.</p>
        </div>
      </div>
      <div className="by-age-grid">
        <section className="inputs-panel" aria-labelledby="by-age-inputs">
          <div className="panel-heading">
            <h2 id="by-age-inputs">Retirement assumptions</h2>
            <button type="button" className="text-button" onClick={() => setValues(example)}>
              Reset example
            </button>
          </div>
          <p className="fine by-age-input-note" id="by-age-input-note">
            Enter the annual amount your portfolio must cover, in today’s dollars. Use a return before
            inflation and after investment fees.
          </p>
          <div className="by-age-fields">
            {fields.map((field) => {
              const { key, label, min, max, step } = field;
              const id = `by-age-${key}`;
              return (
                <div className="field" key={key}>
                  <label htmlFor={id}>{label}</label>
                  <div className="input-wrap">
                    {'prefix' in field && <span aria-hidden="true">{field.prefix}</span>}
                    <input
                      id={id}
                      type="number"
                      inputMode={key === 'retirementAge' ? 'numeric' : 'decimal'}
                      min={min}
                      max={max}
                      step={step}
                      value={values[key]}
                      aria-describedby={
                        key === 'spending' || key === 'nominal' ? 'by-age-input-note' : undefined
                      }
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        setValues((previous) => ({ ...previous, [key]: value }));
                      }}
                    />
                    {'suffix' in field && <span aria-hidden="true">{field.suffix}</span>}
                  </div>
                </div>
              );
            })}
          </div>
          <noscript>
            <p className="fine">
              The table shows the default example. Enable JavaScript to change assumptions.
            </p>
          </noscript>
        </section>
        <section className="age-reference by-age-results" aria-labelledby="by-age-results">
          <h2 id="by-age-results">Coast numbers by starting age</h2>
          <div aria-live="polite">
            {errors.length ? (
              <ul className="by-age-errors">
                {errors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </ul>
            ) : rows.length ? (
              <AgeTable
                rows={rows}
                caption={`Retire at ${assumptions.retirementAge} · Estimated amounts in today’s dollars`}
              />
            ) : (
              <p>Choose a retirement age of 25 or later to see ages in this comparison.</p>
            )}
          </div>
          <p className="fine">
            Each row is the amount you’d need invested at that starting age if you made no further retirement
            contributions.
          </p>
        </section>
      </div>
      <section className="by-age-next">
        <h2>What the table tells you</h2>
        <p>
          Each row uses the same retirement target. With positive real growth, more years to compound lower
          the Coast number. With zero real growth, every row equals the retirement target. With negative real
          growth, a longer horizon raises the amount needed.
        </p>
        <p>
          To find your personal gap and estimated age to stop contributing, use the{' '}
          <Link to="/">Coast FIRE Calculator</Link>. See the{' '}
          <Link to="/editorial-policy/">calculation methodology</Link> for the formulas and assumptions.
        </p>
        <p>
          If you expect part-time pay to cover only some bills, try the{' '}
          <Link to="/barista-fire-calculator/">Barista FIRE calculator</Link>. It includes portfolio
          withdrawals before full retirement and compares $40k, $60k and $80k spending budgets by age.
        </p>
      </section>
      <AgeGuide />
    </div>
  );
}
