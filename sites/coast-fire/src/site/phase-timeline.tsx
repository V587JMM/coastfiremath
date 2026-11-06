import { ageLabel, type Result } from '~/lib/calculator';

export function PhaseTimeline({
  result,
  age,
  retirementAge,
}: {
  result: Result;
  age: number;
  retirementAge: number;
}) {
  if (result.coastMonth === null) return null;
  const months = (retirementAge - age) * 12;
  const savingShare = months === 0 ? 0 : (result.coastMonth / months) * 100;
  const coastShare = months === 0 ? 0 : 100 - savingShare;
  const crossing = ageLabel(result.coastMonth, age);
  return (
    <figure className="phase-timeline" aria-label="Contributing and Coast phases before retirement">
      <div className="phase-track" aria-hidden="true">
        <span className="saving-phase" style={{ width: `${savingShare}%` }} />
        <span className="coast-phase" style={{ width: `${coastShare}%` }} />
      </div>
      <div className="phase-labels">
        <div>
          <span>
            <i className="phase-key saving-key" />
            Contribute
          </span>
          <strong>{result.coastMonth === 0 ? 'No additional saving needed' : `Now → age ${crossing}`}</strong>
        </div>
        <div>
          <span>
            <i className="phase-key coast-key" />
            Coast
          </span>
          <strong>
            {result.coastDurationMonths === 0
              ? '0 years before retirement'
              : `Age ${crossing} → ${retirementAge}`}
          </strong>
        </div>
      </div>
    </figure>
  );
}
