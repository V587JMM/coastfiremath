export type FireNumberInputs = { spending: number; withdrawal: number; balance: number };
export type FireTimelineInputs = { age: number; monthly: number; real: number };
export type FirePoint = { month: number; balance: number };

export const FIRE_NUMBER_EXAMPLE: FireNumberInputs = { spending: 60000, withdrawal: 4, balance: 300000 };
export const FIRE_TIMELINE_EXAMPLE: FireTimelineInputs = { age: 35, monthly: 2000, real: 4 };

export function fireNumberIssues(v: FireNumberInputs) {
  const issues: Partial<Record<keyof FireNumberInputs, string>> = {};
  if (!Number.isFinite(v.spending) || v.spending <= 0 || v.spending > 1e7)
    issues.spending = 'Enter annual spending above $0 and up to $10 million.';
  if (!Number.isFinite(v.withdrawal) || v.withdrawal < 0.1 || v.withdrawal > 15)
    issues.withdrawal = 'Enter a withdrawal rate from 0.1% to 15%.';
  if (!Number.isFinite(v.balance) || v.balance < 0 || v.balance > 1e9)
    issues.balance = 'Enter investments from $0 to $1 billion.';
  return issues;
}

export function fireTimelineIssues(v: FireTimelineInputs) {
  const issues: Partial<Record<keyof FireTimelineInputs, string>> = {};
  if (!Number.isInteger(v.age) || v.age < 18 || v.age > 100) issues.age = 'Enter a whole age from 18 to 100.';
  if (!Number.isFinite(v.monthly) || v.monthly < 0 || v.monthly > 1e6)
    issues.monthly = 'Enter monthly investments from $0 to $1 million.';
  if (!Number.isFinite(v.real) || v.real < -50 || v.real > 30)
    issues.real = 'Enter a real annual return from −50% to 30%.';
  return issues;
}

export function calculateFireNumber(v: FireNumberInputs) {
  const issues = fireNumberIssues(v);
  if (Object.keys(issues).length) throw new Error(Object.values(issues).join(' '));
  const rate = v.withdrawal / 100;
  const target = v.spending / rate;
  return {
    target,
    multiple: 1 / rate,
    gap: Math.max(0, target - v.balance),
    surplus: Math.max(0, v.balance - target),
    progress: (v.balance / target) * 100,
    annualSupported: v.balance * rate,
  };
}

// Constant real deposits at month-end: the future nominal amounts rise with inflation.
// The age-100 horizon is a modeling limit, not a target retirement age.
export function projectFireNumber(v: FireNumberInputs, timeline: FireTimelineInputs) {
  const { target } = calculateFireNumber(v);
  const issues = fireTimelineIssues(timeline);
  if (Object.keys(issues).length) throw new Error(Object.values(issues).join(' '));
  const growth = (1 + timeline.real / 100) ** (1 / 12);
  const horizon = (100 - timeline.age) * 12;
  const points: FirePoint[] = [{ month: 0, balance: v.balance }];
  let balance = v.balance;
  let reachedMonth: number | null = balance >= target ? 0 : null;
  for (let month = 1; month <= horizon && reachedMonth === null; month++) {
    balance = balance * growth + timeline.monthly;
    if (balance >= target * (1 - 1e-12)) reachedMonth = month;
    if (month % 12 === 0 || reachedMonth !== null) points.push({ month, balance });
  }
  return { reachedMonth, points, finalBalance: balance, horizon };
}
