import type { FirePoint } from '~/lib/fire-number';

const compact = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);

export function FireNumberProjection({
  points,
  target,
  age,
}: {
  points: FirePoint[];
  target: number;
  age: number;
}) {
  const last = points[points.length - 1]!;
  const maximum = Math.max(target, ...points.map((point) => point.balance)) * 1.12;
  const x = (month: number) => 68 + (month / Math.max(1, last.month)) * 548;
  const y = (balance: number) => 194 - (balance / maximum) * 172;
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'}${x(point.month).toFixed(2)},${y(point.balance).toFixed(2)}`)
    .join(' ');
  return (
    <figure className="fire-projection">
      <svg viewBox="0 0 640 232" role="img" aria-labelledby="fire-chart-title fire-chart-description">
        <title id="fire-chart-title">Investment growth toward your FIRE number</title>
        <desc id="fire-chart-description">
          Hypothetical investments grow from {compact(points[0]!.balance)} at age {age} to{' '}
          {compact(last.balance)} at age {(age + last.month / 12).toFixed(1)}. The target is {compact(target)}
          . All amounts are in today’s dollars.
        </desc>
        <line className="fire-chart-baseline" x1="68" x2="616" y1="194" y2="194" />
        <line className="fire-chart-threshold" x1="68" x2="616" y1={y(target)} y2={y(target)} />
        <text x="58" y={y(target) + 4} textAnchor="end">
          {compact(target)}
        </text>
        <text x="58" y="198" textAnchor="end">
          $0
        </text>
        <path className="fire-chart-path" d={path} />
        <circle className="fire-chart-end" cx={x(last.month)} cy={y(last.balance)} r="4" />
        <text x="68" y="219">
          Age {age}
        </text>
        <text x="342" y="219" textAnchor="middle">
          Age {(age + last.month / 24).toFixed(1)}
        </text>
        <text x="616" y="219" textAnchor="end">
          Age {(age + last.month / 12).toFixed(1)}
        </text>
      </svg>
      <figcaption>
        <span className="fire-path-key">Investment balance</span>
        <span className="fire-threshold-key">FIRE target</span> · Today’s dollars
      </figcaption>
    </figure>
  );
}
