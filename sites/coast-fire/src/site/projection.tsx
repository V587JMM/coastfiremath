import { useId } from 'react';
import { compact, dollars, type Result } from '~/lib/calculator';

// Round-tick algorithm adapted from taste-skill/assets/charts.js, rendered in React
// for SSR and paired with an accessible year-by-year table in the calculator.
export function Projection({
  result,
  age,
  retirementAge,
}: {
  result: Result;
  age: number;
  retirementAge: number;
}) {
  const id = useId();
  const max = Math.max(...result.points.flatMap((p) => [p.stopNow, p.coastPath, p.threshold]), 1);
  const raw = max / 4;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((n) => n * mag).find((n) => n >= raw) ?? 10 * mag;
  const ceiling = (Math.floor(max / step) + 1) * step;
  const ticks = Array.from({ length: Math.round(ceiling / step) + 1 }, (_, i) => i * step);
  const duration = Math.max(1, result.points.length - 1);
  const x = (m: number) => 65 + (m / duration) * 600;
  const y = (value: number) => 225 - (value / ceiling) * 190;
  const line = (key: 'stopNow' | 'coastPath' | 'threshold') =>
    result.points.map((p, i) => `${i ? 'L' : 'M'}${x(p.month).toFixed(2)},${y(p[key]).toFixed(2)}`).join(' ');
  const m = result.coastMonth;
  return (
    <figure className="projection">
      <svg viewBox="0 0 690 265" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
        <title id={`${id}-title`}>Investment paths to retirement, in today’s dollars</title>
        <desc id={`${id}-desc`}>
          Stopping contributions now projects to {dollars(result.stopNowAtRetirement)}. The Coast path
          projects to {dollars(result.atRetirement)} at age {retirementAge}.{' '}
          {m === null
            ? 'The Coast threshold is not reached before retirement.'
            : result.retirementOnly
              ? 'The retirement target is reached at retirement, with no pre-retirement Coast phase.'
              : `Contributions stop after ${m} months.`}{' '}
          All lines are hypothetical projections.
        </desc>
        {ticks.map((t) => (
          <g key={t}>
            <line x1="65" x2="665" y1={y(t)} y2={y(t)} stroke="var(--chart-grid)" />
            <text x="54" y={y(t) + 4} textAnchor="end">
              {compact(t)}
            </text>
          </g>
        ))}
        <path
          d={`${line('coastPath')} L${x(duration)},225 L65,225 Z`}
          fill="var(--chart-primary)"
          fillOpacity="0.055"
        />
        <path
          d={line('threshold')}
          fill="none"
          stroke="var(--chart-threshold)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
        />
        <path
          d={line('stopNow')}
          fill="none"
          stroke="var(--chart-comparison)"
          strokeWidth="2"
          strokeDasharray="7 4"
        />
        <path
          d={line('coastPath')}
          fill="none"
          stroke="var(--chart-primary)"
          strokeWidth="2.5"
          strokeDasharray="7 3"
        />
        {m !== null && (
          <g>
            <line x1={x(m)} x2={x(m)} y1="28" y2="225" stroke="var(--chart-primary)" strokeDasharray="3 5" />
            <circle cx={x(m)} cy={y(result.points[m]!.coastPath)} r="4" fill="var(--chart-primary)" />
            <text
              x={Math.min(580, Math.max(140, x(m)))}
              y="18"
              textAnchor="middle"
              className="coast-annotation"
            >
              {result.retirementOnly
                ? 'Retirement target met'
                : m === 0
                  ? 'Coasting now'
                  : 'Contributions stop'}
            </text>
          </g>
        )}
        {Array.from({ length: age === retirementAge ? 1 : 4 }, (_, i) => {
          const t = i / 3;
          return (
            <text
              key={String(age + (retirementAge - age) * t)}
              x={65 + t * 600}
              y="249"
              textAnchor={i === 0 ? 'start' : i === 3 ? 'end' : 'middle'}
            >
              Age {Math.round(age + (retirementAge - age) * t)}
            </text>
          );
        })}
      </svg>
      <figcaption className="chart-legend">
        <span>
          <i className="swatch blue" />
          {result.retirementOnly ? 'Save to retirement' : 'Save, then coast'}
        </span>
        <span>
          <i className="swatch ink" />
          Stop adding now
        </span>
        <span>
          <i className="swatch gray" />
          Coast threshold
        </span>
      </figcaption>
    </figure>
  );
}
