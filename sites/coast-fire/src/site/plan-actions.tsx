import { useState } from 'react';
import { ageLabel, dollars, type Inputs, type Result, type SpendingPeriod } from '~/lib/calculator';
import { buildPlan } from '~/lib/plan';

type Props = { inputs: Inputs; result: Result; goalAge: string; period: SpendingPeriod };
export function PlanActions({
  inputs,
  result,
  goalAge,
  period,
}: Omit<Props, 'result'> & { result: Result | null }) {
  const [message, setMessage] = useState('');
  const [preparing, setPreparing] = useState(false);
  async function download() {
    if (!result || preparing) return;
    setPreparing(true);
    setMessage('Preparing your Excel file…');
    try {
      const { createPlanWorkbook } = await import('~/lib/plan-workbook');
      const plan = buildPlan(
        inputs,
        result.contributionMode,
        goalAge.trim() === '' ? null : Number(goalAge),
        period,
      );
      const blob = await createPlanWorkbook(plan);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'coast-fire-plan.xlsx';
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage('Excel file prepared. Check your downloads.');
    } catch {
      setMessage('Could not prepare the Excel file. Please try again.');
    } finally {
      setPreparing(false);
    }
  }
  return (
    <section className="plan-actions" aria-label="Save your plan" aria-describedby="plan-export-note">
      <div className="plan-buttons">
        <button className="secondary-button" type="button" disabled={!result || preparing} onClick={download}>
          Download Excel
        </button>
        <button className="secondary-button" type="button" disabled={!result} onClick={() => window.print()}>
          Print / save PDF
        </button>
      </div>
      <p id="plan-export-note" role="status">
        {!result
          ? 'Correct your inputs to save a plan.'
          : message || 'Exports include your inputs and estimates.'}
      </p>
    </section>
  );
}
export function PrintPlan({ inputs, result, goalAge, period }: Props) {
  const goal = goalAge.trim() === '' ? Number.NaN : Number(goalAge);
  const validGoal = Number.isInteger(goal) && goal >= inputs.age && goal <= inputs.retirementAge;
  return (
    <section className="print-plan">
      <h2>Coast FIRE plan</h2>
      <p>US dollars · Amounts in today’s purchasing power · Hypothetical estimates</p>
      <h3>Your inputs and assumptions</h3>
      <dl>
        <dt>Current / retirement age</dt>
        <dd>
          {inputs.age} / {inputs.retirementAge}
        </dd>
        <dt>Investments today</dt>
        <dd>{dollars(inputs.balance)}</dd>
        <dt>Annual / monthly retirement spending</dt>
        <dd>
          {dollars(inputs.spending)} / {dollars(inputs.spending / 12)} (entered per {period})
        </dd>
        <dt>Monthly contribution</dt>
        <dd>
          {dollars(inputs.monthly)} ·{' '}
          {result.contributionMode === 'inflation'
            ? 'today’s dollars, adjusted monthly with inflation'
            : 'fixed nominal dollars'}
        </dd>
        <dt>Nominal return / inflation / withdrawal rate</dt>
        <dd>
          {inputs.nominal}% / {inputs.inflation}% / {inputs.withdrawal}%
        </dd>
        <dt>Desired Coast age</dt>
        <dd>{validGoal ? goalAge : 'Not selected (enter a valid age in the planner)'}</dd>
      </dl>
      <h3>Estimated results</h3>
      <p>
        Coast number today: {dollars(result.coast)}. Retirement target: {dollars(result.target)}. Gap:{' '}
        {dollars(result.gap)}. Surplus: {dollars(result.surplus)}. Progress: {result.progress.toFixed(1)}%.
      </p>
      <p>
        {result.coastMonth === null
          ? 'Target not reached before retirement under these inputs.'
          : result.retirementOnly
            ? `Retirement target reached at ${inputs.retirementAge}. Pre-retirement Coast phase: 0 years.`
            : `Coast milestone: age ${ageLabel(result.coastMonth, inputs.age)}. After that milestone, this projection stops new contributions.`}
      </p>
      <p>
        You still need income for living costs before retirement. This model excludes market volatility,
        taxes, Social Security, pensions, account-access rules and retirement drawdown risks.
      </p>
      <table>
        <caption>Projection in today’s dollars</caption>
        <thead>
          <tr>
            <th>Age</th>
            <th>Stop adding now</th>
            <th>Plan</th>
            <th>Coast threshold</th>
          </tr>
        </thead>
        <tbody>
          {result.points
            .filter((point) => point.month % 12 === 0 || point.month === result.coastMonth)
            .map((point) => (
              <tr key={point.month}>
                <th>{ageLabel(point.month, inputs.age)}</th>
                <td>{dollars(point.stopNow)}</td>
                <td>{dollars(point.coastPath)}</td>
                <td>{dollars(point.threshold)}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p>Model explanation: /editorial-policy/ · No personal information is sent to prepare this printout.</p>
    </section>
  );
}
