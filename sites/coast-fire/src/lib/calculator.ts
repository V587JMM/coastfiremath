export type Inputs = {
  age: number;
  retirementAge: number;
  balance: number;
  spending: number;
  monthly: number;
  nominal: number;
  inflation: number;
  withdrawal: number;
};
export type ContributionMode = 'fixed' | 'inflation';
export type SpendingPeriod = 'year' | 'month';
export function convertSpending(amount: number, from: SpendingPeriod, to: SpendingPeriod) {
  return from === to ? amount : to === 'month' ? amount / 12 : amount * 12;
}
export function clampGoalAge(goal: number, age: number, retirementAge: number) {
  if (
    ![goal, age, retirementAge].every(Number.isInteger) ||
    age < 18 ||
    retirementAge < age ||
    retirementAge > 100
  )
    return goal;
  return Math.max(age, Math.min(retirementAge, goal));
}
export const EXAMPLE: Inputs = {
  age: 32,
  retirementAge: 65,
  balance: 150000,
  spending: 48000,
  monthly: 1500,
  nominal: 7,
  inflation: 3,
  withdrawal: 4,
};
export function validate(v: Inputs): string[] {
  const errors: string[] = [];
  if (Object.values(v).some((x) => !Number.isFinite(x))) return ['Enter a number in every field.'];
  if (!Number.isInteger(v.age) || v.age < 18 || v.age > 100)
    errors.push('Current age must be a whole number from 18 to 100.');
  if (!Number.isInteger(v.retirementAge) || v.retirementAge < v.age || v.retirementAge > 100)
    errors.push('Retirement age must be a whole number between your current age and 100.');
  if (v.balance < 0 || v.balance > 1e9) errors.push('Investments must be between $0 and $1 billion.');
  if (v.spending <= 0 || v.spending > 1e7)
    errors.push('Annual spending must be above $0 and at most $10 million.');
  if (v.monthly < 0 || v.monthly > 1e6)
    errors.push('Monthly contributions must be between $0 and $1 million.');
  if (v.nominal < -50 || v.nominal > 30) errors.push('Nominal return must be between −50% and 30%.');
  if (v.inflation < -10 || v.inflation > 30) errors.push('Inflation must be between −10% and 30%.');
  if (v.withdrawal < 0.1 || v.withdrawal > 15) errors.push('Withdrawal rate must be between 0.1% and 15%.');
  return errors;
}
export type Point = { month: number; age: number; stopNow: number; coastPath: number; threshold: number };
export type CoastAssumptions = Pick<
  Inputs,
  'retirementAge' | 'spending' | 'nominal' | 'inflation' | 'withdrawal'
>;

export function coastRequirements(v: CoastAssumptions, age: number) {
  const real = (1 + v.nominal / 100) / (1 + v.inflation / 100) - 1;
  const target = v.spending / (v.withdrawal / 100);
  const coast = target / (1 + real) ** (v.retirementAge - age);
  return { real, target, coast };
}

export function coastAgeRows(v: CoastAssumptions) {
  return [25, 30, 35, 40, 45, 50, 55, 60]
    .filter((age) => age <= v.retirementAge)
    .map((age) => ({
      age,
      years: v.retirementAge - age,
      coast: coastRequirements(v, age).coast,
    }));
}

export function calculate(v: Inputs, contributionMode: ContributionMode = 'fixed') {
  const errors = validate(v);
  if (errors.length) throw new Error(errors.join(' '));
  const months = (v.retirementAge - v.age) * 12;
  const growth = (1 + v.nominal / 100) ** (1 / 12);
  const prices = (1 + v.inflation / 100) ** (1 / 12);
  const { real, target, coast } = coastRequirements(v, v.age);
  let nominalBalance = v.balance;
  let coastMonth: number | null = v.balance >= coast ? 0 : null;
  const points: Point[] = [];
  for (let month = 0; month <= months; month++) {
    const deflator = prices ** month;
    const threshold = target / (1 + real) ** ((months - month) / 12);
    const balance = nominalBalance / deflator;
    if (coastMonth === null && balance >= threshold * (1 - 1e-12)) coastMonth = month;
    points.push({
      month,
      age: v.age + month / 12,
      stopNow: v.balance * (growth / prices) ** month,
      coastPath: balance,
      threshold,
    });
    // Linked deposits preserve the entered amount's purchasing power each month.
    const deposit = v.monthly * (contributionMode === 'inflation' ? prices ** (month + 1) : 1);
    nominalBalance = nominalBalance * growth + (coastMonth === null ? deposit : 0);
  }
  return {
    target,
    coast,
    real,
    gap: Math.max(0, coast - v.balance),
    surplus: Math.max(0, v.balance - coast),
    progress: (100 * v.balance) / coast,
    progressBar: Math.min(100, (100 * v.balance) / coast),
    retirementOnly: coastMonth !== null && coastMonth === months,
    coastDurationMonths: coastMonth === null ? null : months - coastMonth,
    contributionMode,
    coastMonth,
    coastAge: coastMonth === null ? null : v.age + coastMonth / 12,
    points,
    stopNowAtRetirement: points[points.length - 1]!.stopNow,
    atRetirement: points[points.length - 1]!.coastPath,
  };
}
export type Result = ReturnType<typeof calculate>;
/** Constant nominal month-end deposits needed to meet the moving Coast target by an age. */
export function monthlyForCoastAge(v: Inputs, desiredAge: number, mode: ContributionMode = 'fixed') {
  const current = calculate(v, mode);
  if (!Number.isInteger(desiredAge) || desiredAge < v.age || desiredAge > v.retirementAge) {
    throw new Error('Choose a whole-number Coast age from your current age through retirement.');
  }
  const months = (desiredAge - v.age) * 12;
  if (current.gap === 0) return { monthly: 0, gapNow: 0, months };
  if (months === 0) return { monthly: null, gapNow: current.gap, months };
  const targetThen = current.target / (1 + current.real) ** (v.retirementAge - desiredAge);
  const pricesThen = mode === 'inflation' ? 1 : (1 + v.inflation / 100) ** (months / 12);
  const logGrowth = Math.log1p(mode === 'inflation' ? current.real : v.nominal / 100) / 12;
  const growthThen = Math.exp(logGrowth * months);
  const deposits =
    Math.abs(logGrowth) < 1e-14 ? months : Math.expm1(logGrowth * months) / Math.expm1(logGrowth);
  const monthly = Math.max(0, (targetThen * pricesThen - v.balance * growthThen) / deposits);
  return { monthly, gapNow: current.gap, months };
}
export const dollars = (v: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
export const compact = (v: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(v);
export const ageLabel = (months: number, startingAge: number) => {
  const years = Math.floor(months / 12);
  const extra = months % 12;
  return `${startingAge + years}${extra ? ` years, ${extra} mo` : ''}`;
};
