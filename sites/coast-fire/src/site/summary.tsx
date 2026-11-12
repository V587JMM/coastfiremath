import { Link } from '@tanstack/react-router';
import { ageLabel, dollars, type Inputs, type Result } from '~/lib/calculator';
import { CatchUp } from './catch-up';

export function Summary({
  r,
  v,
  exampleName,
  onEdit,
  onApply,
}: {
  r: Result;
  v: Inputs;
  exampleName?: string;
  onEdit: () => void;
  onApply: (monthly: number) => void;
}) {
  const state = r.retirementOnly
    ? r.coastMonth === 0
      ? 'Your retirement target is met.'
      : 'On track for retirement, with no earlier Coast phase.'
    : r.coastMonth === 0
      ? 'You could already coast.'
      : r.coastMonth === null
        ? 'Your current plan needs a change.'
        : 'Your Coast milestone is within reach.';
  return (
    <div className="summary" id="coast-result" tabIndex={-1} aria-live="polite" aria-atomic="true">
      <div className="result-heading">
        <span>{exampleName ? `Example · ${exampleName}` : 'Your estimate'}</span>
        <span>In today’s dollars</span>
      </div>
      <p className="result-state">
        <span className={`status-dot${r.coastMonth === null ? ' status-pending' : ''}`} aria-hidden="true" />
        {state}
      </p>
      <div className="result-metrics">
        <div className="result-overview">
          <div className="coast-number">
            <span>Coast FIRE number today</span>
            <strong>{dollars(r.coast)}</strong>
            <span>
              {v.age === v.retirementAge
                ? 'to fund your retirement target today'
                : `to coast to retirement at ${v.retirementAge}`}
            </span>
          </div>
          <div className="coast-milestone">
            <span>{r.retirementOnly ? 'Retirement target age' : 'Estimated Coast age'}</span>
            <strong>
              {r.retirementOnly
                ? String(v.retirementAge)
                : r.coastMonth === null
                  ? 'Not reached'
                  : r.coastMonth === 0
                    ? 'Already there'
                    : ageLabel(r.coastMonth, v.age)}
            </strong>
            <p>
              {r.retirementOnly
                ? 'Your retirement goal, with no earlier Coast phase.'
                : r.coastMonth === null
                  ? 'Try the saving amount below to close the gap.'
                  : 'The point where new retirement contributions could stop.'}
            </p>
          </div>
        </div>
        <div className="result-support">
          <div>
            <span>{r.gap > 0 ? 'Gap today' : 'Above today’s threshold'}</span>
            <strong>{dollars(r.gap > 0 ? r.gap : r.surplus)}</strong>
          </div>
          <div>
            <span>{r.retirementOnly ? 'Pre-retirement Coast phase' : 'Time still contributing'}</span>
            <strong>
              {r.retirementOnly
                ? '0 years'
                : r.coastMonth === null
                  ? 'Beyond your target'
                  : `${Math.floor(r.coastMonth / 12)} yr ${r.coastMonth % 12} mo`}
            </strong>
          </div>
        </div>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label="Current investments as a share of the Coast threshold"
        aria-valuenow={Math.round(r.progressBar)}
        aria-valuetext={`${r.progress.toFixed(1)}% of the Coast target; ${r.gap > 0 ? `${dollars(r.gap)} short` : `${dollars(r.surplus)} above the threshold`}`}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${r.progressBar}%` }} />
      </div>
      <div className="progress-caption">
        <span>{dollars(v.balance)} invested</span>
        <span>{r.progress.toFixed(1)}% of Coast target</span>
      </div>
      <div className="assumptions-snapshot">
        <div className="snapshot-heading">
          <span>Assumptions behind this result</span>
          <button type="button" className="text-button" onClick={onEdit}>
            Edit assumptions
          </button>
        </div>
        <dl>
          <div>
            <dt>Nominal return</dt>
            <dd>{v.nominal}%</dd>
          </div>
          <div>
            <dt>Inflation</dt>
            <dd>{v.inflation}%</dd>
          </div>
          <div>
            <dt>Real return</dt>
            <dd>{(r.real * 100).toFixed(2)}%</dd>
          </div>
          <div>
            <dt>Withdrawal</dt>
            <dd>{v.withdrawal}%</dd>
          </div>
        </dl>
        <p className="fine contribution-basis">
          Contributions:{' '}
          {r.contributionMode === 'inflation'
            ? 'adjusted monthly with inflation (today’s dollars)'
            : 'fixed future dollar amount'}
          . <Link to="/editorial-policy/">How we calculate this</Link>
        </p>
      </div>
      <p className="summary-note">
        {r.coastMonth === null
          ? `At ${dollars(v.monthly)}/month${r.contributionMode === 'inflation' ? ' in today’s dollars, adjusted with inflation' : ''}, the projected portfolio does not reach the retirement target by ${v.retirementAge}.`
          : r.retirementOnly
            ? r.coastMonth === 0
              ? `Your retirement target is already met at age ${v.retirementAge}. Pre-retirement Coast phase: 0 years.`
              : `Expected to reach your retirement target at ${v.retirementAge}. Continue contributing until retirement; pre-retirement Coast phase: 0 years.`
            : r.coastMonth === 0
              ? 'Under these assumptions, no additional retirement contributions are needed. You still need income for living costs until retirement.'
              : `Keep adding ${dollars(v.monthly)}/month${r.contributionMode === 'inflation' ? ' in today’s dollars, adjusted with inflation' : ''} until age ${ageLabel(r.coastMonth, v.age)}, then let your investments grow without new contributions.`}
      </p>
      <CatchUp inputs={v} result={r} onApply={onApply} />
    </div>
  );
}
