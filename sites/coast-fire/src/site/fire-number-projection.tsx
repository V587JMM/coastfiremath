import { ageLabel, compact, dollars } from '~/lib/calculator';
import type { FirePoint } from '~/lib/fire-number';

export function FireNumberProjection({
  points,
  target,
  age,
  reached,
}: {
  points: FirePoint[];
  target: number;
  age: number;
  reached: boolean;
}) {
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const endAge = ageLabel(last.month, age);
  const maximum = Math.max(target, ...points.map((point) => point.balance)) * 1.12;
  const x = (month: number) => 68 + (month / Math.max(1, last.month)) * 548;
  const y = (balance: number) => 194 - (balance / maximum) * 150;
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'}${x(point.month).toFixed(2)},${y(point.balance).toFixed(2)}`)
    .join(' ');
  return (
    <figure className="fire-projection">
      <svg viewBox="0 0 640 232" role="img" aria-labelledby="fire-chart-title fire-chart-description">
        <title id="fire-chart-title">Investment growth toward your FIRE number</title>
        <desc id="fire-chart-description">
          The balance starts at {dollars(first.balance)} at age {age} and ends at {dollars(last.balance)} at
          age {endAge}. {reached ? 'Target reached.' : 'Below target.'} The FIRE target is {dollars(target)}.
          All amounts are in today’s dollars.
        </desc>
        <line className="fire-chart-baseline" x1="68" x2="616" y1="194" y2="194" />
        <line className="fire-chart-threshold" x1="68" x2="616" y1={y(target)} y2={y(target)} />
        <text x="58" y="198" textAnchor="end">
          $0
        </text>
        <path className="fire-chart-path" d={path} />
        <circle className="fire-chart-point" cx={x(first.month)} cy={y(first.balance)} r="4">
          <title>
            Age {age} · Starting balance {dollars(first.balance)}
          </title>
        </circle>
        <circle className="fire-chart-point" cx={x(last.month)} cy={y(last.balance)} r="5">
          <title>
            Age {endAge} · Ending balance {dollars(last.balance)}
          </title>
        </circle>
        <text className="fire-chart-end-value" x="612" y={y(last.balance) - 14} textAnchor="end">
          {compact(last.balance)}
        </text>
        <text x="68" y="219">
          Age {age}
        </text>
        <text x="616" y="219" textAnchor="end">
          Age {endAge}
        </text>
      </svg>
      <figcaption>
        <span className="fire-path-key">Investment balance</span>
        <span className="fire-threshold-key">FIRE target {dollars(target)}</span> · Today’s dollars
        <dl className="fire-projection-milestones">
          <div>
            <dt>Starting balance · Age {age}</dt>
            <dd>{dollars(first.balance)}</dd>
          </div>
          <div>
            <dt>
              {reached ? 'First funded month' : 'Projection ends'} · Age {endAge}
            </dt>
            <dd>{dollars(last.balance)}</dd>
          </div>
        </dl>
      </figcaption>
    </figure>
  );
}
