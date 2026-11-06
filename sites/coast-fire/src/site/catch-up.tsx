import { dollars, type Inputs, monthlyForCoastAge, type Result } from '~/lib/calculator';
export function CatchUp({
  inputs,
  result,
  onApply,
}: {
  inputs: Inputs;
  result: Result;
  onApply: (monthly: number) => void;
}) {
  if (result.coastMonth !== null) return null;
  const plan = monthlyForCoastAge(inputs, inputs.retirementAge, result.contributionMode);
  const amount = plan.monthly === null ? null : Math.ceil(plan.monthly);
  return (
    <div className="catch-up">
      <h3>A way to reach your retirement target</h3>
      {amount === null ? (
        <p>
          Your target retirement age is now. The portfolio is {dollars(plan.gapNow)} short today; monthly
          saving has no time to close this gap.
        </p>
      ) : (
        <>
          <p>
            To keep retirement at {inputs.retirementAge}, this model needs about{' '}
            <strong>{dollars(amount)}/month</strong>
            {result.contributionMode === 'inflation'
              ? ' in today’s dollars, adjusted monthly with inflation'
              : ' in fixed future dollars'}
            . Continue through retirement; the pre-retirement Coast phase would be 0 years.
          </p>
          <button
            className="primary-button"
            type="button"
            disabled={amount > 1000000}
            onClick={() => onApply(amount)}
          >
            {amount > 1000000 ? 'Above calculator input limit' : 'Apply retirement saving amount'}
          </button>
        </>
      )}
    </div>
  );
}
