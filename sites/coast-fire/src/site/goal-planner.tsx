import { type ContributionMode, dollars, type Inputs, monthlyForCoastAge } from '~/lib/calculator';

export function GoalPlanner({
  inputs,
  goalAge,
  onGoalAge,
  onApply,
  mode,
  adjustment,
}: {
  inputs: Inputs;
  goalAge: string;
  onGoalAge: (value: string) => void;
  onApply: (monthly: number) => void;
  mode: ContributionMode;
  adjustment: string;
}) {
  const desiredAge = goalAge.trim() === '' ? Number.NaN : Number(goalAge);
  const valid =
    Number.isInteger(desiredAge) && desiredAge >= inputs.age && desiredAge <= inputs.retirementAge;
  const plan = valid ? monthlyForCoastAge(inputs, desiredAge, mode) : null;
  const required = plan?.monthly === null || plan === null ? null : Math.ceil(plan.monthly);
  const withinLimit = required !== null && required <= 1000000;
  const alreadyApplied = required === inputs.monthly;
  return (
    <section className="goal-planner" id="goal-planner" aria-labelledby="goal-heading">
      <div className="goal-intro">
        <h2 id="goal-heading">Monthly Savings Needed to Reach Coast FIRE</h2>
        <p>
          Choose the age you want to stop contributing. We’ll estimate how much to invest each month using the
          assumptions above.
        </p>
      </div>
      <div className="goal-controls">
        <div className="goal-input">
          <label htmlFor="goal-age">I want to reach Coast FIRE by age</label>
          <div className="input-wrap">
            <input
              id="goal-age"
              type="number"
              inputMode="numeric"
              step="1"
              min={inputs.age}
              max={inputs.retirementAge}
              value={goalAge}
              onChange={(e) => onGoalAge(e.target.value)}
              aria-describedby="goal-hint"
              aria-invalid={!valid}
            />
          </div>
          <p id="goal-hint" className="fine">
            {inputs.age === inputs.retirementAge
              ? `You are at your target retirement age (${inputs.retirementAge}); there is no pre-retirement saving period.`
              : `Choose age ${inputs.age}–${inputs.retirementAge}. Retirement stays at ${inputs.retirementAge}.`}
          </p>
          {adjustment && (
            <p className="goal-adjustment" role="status">
              {adjustment}
            </p>
          )}
        </div>
        <div className="goal-answer" aria-live="polite" aria-atomic="true">
          {!plan ? (
            <p className="goal-message">
              Enter a whole-number age from {inputs.age} to {inputs.retirementAge}.
            </p>
          ) : required === null ? (
            <p className="goal-message">
              Coasting now needs {dollars(plan.gapNow)} more invested today. There is no time for monthly
              deposits to close an immediate gap.
            </p>
          ) : (
            <>
              <span className="fine">
                {required === 0 ? 'Additional monthly saving needed' : 'Estimated monthly saving needed'}
              </span>
              <p className="goal-amount">
                {dollars(required)}
                <span>/month</span>
              </p>
              <p className="fine">
                {required === 0
                  ? 'Your investments already meet today’s Coast threshold under these assumptions.'
                  : desiredAge === inputs.retirementAge
                    ? `Continue contributions until retirement at ${desiredAge}; pre-retirement Coast phase: 0 years. Rounded up to the next dollar.`
                    : `${mode === 'inflation' ? 'Inflation-adjusted' : 'Fixed dollar'} deposits until age ${desiredAge}, then no new contributions. Rounded up to the next dollar.`}
              </p>
              {required > 0 && mode === 'inflation' && (
                <p className="fine">
                  Amount is in today’s dollars; future monthly deposits adjust with inflation.
                </p>
              )}
            </>
          )}
        </div>
        {required !== null && (
          <div className="goal-action">
            <button
              type="button"
              className="primary-button"
              disabled={!withinLimit || alreadyApplied}
              onClick={() => onApply(required)}
            >
              {!withinLimit
                ? 'Above calculator limit'
                : alreadyApplied
                  ? 'Amount applied'
                  : 'Use this monthly amount'}
            </button>
            {!withinLimit && (
              <p className="fine">
                This exceeds the $1 million/month input limit. Try a later Coast age or a different spending
                goal.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
