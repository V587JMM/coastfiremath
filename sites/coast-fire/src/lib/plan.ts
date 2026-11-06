import { type ContributionMode, calculate, type Inputs, type SpendingPeriod } from './calculator.ts';
export function buildPlan(
  inputs: Inputs,
  mode: ContributionMode,
  goalAge: number | null,
  period: SpendingPeriod,
) {
  const result = calculate(inputs, mode);
  return {
    schemaVersion: 1,
    model:
      'Monthly effective compounding; month-end deposits; contributions stop at the moving Coast threshold.',
    currency: 'USD',
    displayBasis: 'today-dollars',
    spendingEntryPeriod: period,
    inputs: {
      ...inputs,
      spendingBasis: 'annual-today-dollars',
      contributionMode: mode,
      contributionBasis: mode === 'inflation' ? 'today-dollars-adjusted-monthly' : 'fixed-nominal-dollars',
    },
    desiredCoastAge:
      goalAge !== null &&
      Number.isInteger(goalAge) &&
      goalAge >= inputs.age &&
      goalAge <= inputs.retirementAge
        ? goalAge
        : null,
    result: {
      coastNumber: result.coast,
      retirementTarget: result.target,
      gap: result.gap,
      surplus: result.surplus,
      progressPercent: result.progress,
      coastMonth: result.coastMonth,
      coastAge: result.coastAge,
      retirementOnly: result.retirementOnly,
      preRetirementCoastMonths: result.coastDurationMonths,
      realReturn: result.real,
      stopNowAtRetirement: result.stopNowAtRetirement,
      planAtRetirement: result.atRetirement,
    },
    projection: result.points.filter((point) => point.month % 12 === 0 || point.month === result.coastMonth),
    limitations:
      'Hypothetical constant returns, not a probability. Taxes, account access, Social Security, pensions and retirement drawdowns are not modeled.',
  };
}
