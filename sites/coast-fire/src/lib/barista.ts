export type BaristaInputs = {
  age: number;
  retirementAge: number;
  balance: number;
  spending: number;
  hourly: number;
  hours: number;
  weeks: number;
  tax: number;
  nominal: number;
  inflation: number;
  withdrawal: number;
};

export const BARISTA_EXAMPLE: BaristaInputs = {
  age: 35,
  retirementAge: 65,
  balance: 500000,
  spending: 40000,
  hourly: 25,
  hours: 20,
  weeks: 52,
  tax: 20,
  nominal: 7,
  inflation: 3,
  withdrawal: 4,
};

export const BARISTA_FIELDS = {
  hourly: { label: 'Hourly pay', min: 0, max: 10000, unit: '$', hint: 'Before taxes and deductions' },
  hours: { label: 'Hours per week', min: 0, max: 168, hint: 'A typical paid working week' },
  spending: {
    label: 'Annual spending',
    min: 1,
    max: 1e7,
    unit: '$',
    hint: 'Today’s dollars, including healthcare and withdrawal taxes',
  },
  balance: {
    label: 'Invested today',
    min: 0,
    max: 1e9,
    unit: '$',
    hint: 'Exclude your emergency fund and home equity',
  },
  age: { label: 'Your age', min: 18, max: 100, whole: true, hint: 'Start part-time work at this age' },
  retirementAge: {
    label: 'Stop-work age',
    min: 18,
    max: 100,
    whole: true,
    hint: 'Part-time income ends at this age',
  },
  weeks: {
    label: 'Paid weeks per year',
    min: 0,
    max: 52,
    hint: 'Reduce for unpaid holidays or seasonal work',
  },
  tax: {
    label: 'Income deductions',
    min: 0,
    max: 100,
    unit: '%',
    hint: 'Your estimate for taxes and payroll deductions; not a tax calculation',
  },
  nominal: {
    label: 'Nominal annual return',
    min: -50,
    max: 30,
    unit: '%',
    hint: 'After fees, before inflation',
  },
  inflation: {
    label: 'Annual inflation',
    min: -10,
    max: 30,
    unit: '%',
    hint: 'Pay and spending are assumed to keep pace',
  },
  withdrawal: {
    label: 'Withdrawal rate',
    min: 0.1,
    max: 15,
    unit: '%',
    hint: 'An illustrative starting-rate limit, not a guarantee',
  },
} satisfies Record<
  keyof BaristaInputs,
  { label: string; min: number; max: number; unit?: string; whole?: boolean; hint: string }
>;

export function baristaIssues(v: BaristaInputs) {
  const issues: Partial<Record<keyof BaristaInputs, string>> = {};
  for (const key of Object.keys(BARISTA_FIELDS) as (keyof BaristaInputs)[]) {
    const field = BARISTA_FIELDS[key];
    if (!Number.isFinite(v[key])) issues[key] = `Enter a number for ${field.label.toLowerCase()}.`;
    else if (v[key] < field.min || v[key] > field.max || ('whole' in field && !Number.isInteger(v[key])))
      issues[key] =
        `${field.label} must be ${'whole' in field ? 'a whole number ' : ''}from ${field.min} to ${field.max.toLocaleString('en-US')}.`;
  }
  if (!issues.age && !issues.retirementAge && v.retirementAge < v.age)
    issues.retirementAge = 'Stop-work age must be at least your current age.';
  return issues;
}

/** Today-dollar, month-end withdrawals; earnings end at retirementAge. No new contributions. */
export function calculateBarista(v: BaristaInputs) {
  const issues = baristaIssues(v);
  if (Object.keys(issues).length) throw new Error(Object.values(issues).join(' '));
  const months = (v.retirementAge - v.age) * 12;
  const grossIncome = months ? v.hourly * v.hours * v.weeks : 0;
  const netIncome = grossIncome * (1 - v.tax / 100);
  const annualGap = Math.max(0, v.spending - netIncome);
  const real = (1 + v.nominal / 100) / (1 + v.inflation / 100) - 1;
  const logMonthly = Math.log1p(real) / 12;
  const monthlyRate = Math.expm1(logMonthly);
  const discount = Math.exp(-logMonthly * months);
  const annuity = Math.abs(logMonthly) < 1e-14 ? months : -Math.expm1(-logMonthly * months) / monthlyRate;
  const retirementTarget = v.spending / (v.withdrawal / 100);
  const incomeGapTarget = annualGap / (v.withdrawal / 100);
  const bridgeCost = (annualGap / 12) * annuity;
  const discountedRetirement = retirementTarget * discount;
  const bridgeTarget = bridgeCost + discountedRetirement;
  const required = Math.max(incomeGapTarget, bridgeTarget);
  let projectedBalance = v.balance;
  let depletedMonth: number | null = v.balance === 0 && annualGap > 0 && months > 0 ? 0 : null;
  for (let month = 1; month <= months; month++) {
    projectedBalance = Math.max(0, projectedBalance * (1 + monthlyRate) - annualGap / 12);
    if (depletedMonth === null && projectedBalance === 0 && annualGap > 0) depletedMonth = month;
  }
  return {
    months,
    grossIncome,
    netIncome,
    annualGap,
    real,
    retirementTarget,
    incomeGapTarget,
    bridgeCost,
    discountedRetirement,
    bridgeTarget,
    required,
    projectedBalance,
    depletedMonth,
    gap: Math.max(0, required - v.balance),
    surplus: Math.max(0, v.balance - required),
    coverage: Math.min(netIncome, v.spending) / v.spending,
  };
}

export function baristaAgeRows() {
  return [25, 30, 35, 40, 45, 50, 55, 60].map((age) => ({
    age,
    years: BARISTA_EXAMPLE.retirementAge - age,
    targets: [40000, 60000, 80000].map(
      (spending) => calculateBarista({ ...BARISTA_EXAMPLE, age, spending }).required,
    ),
  }));
}
