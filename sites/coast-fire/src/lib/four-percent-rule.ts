export type WithdrawalStrategy = 'fixed-real' | 'percent';
export type DrawdownInputs = {
  portfolio: number;
  rate: number;
  years: number;
  nominal: number;
  inflation: number;
  fee: number;
};

export const DRAWDOWN_EXAMPLE: DrawdownInputs = {
  portfolio: 1_000_000,
  rate: 4,
  years: 30,
  nominal: 7,
  inflation: 3,
  fee: 0,
};

export const DRAW_RATES = [3, 3.5, 4, 4.5, 5] as const;
export const EARLY_LOSS_RETURNS = [-20, -10] as const;
export const LOWER_RETURN_DELTA = 2;

export const drawdownLimits = {
  portfolio: { min: 0, max: 1e9, step: 0.01, issue: 'Enter a portfolio from $0 to $1 billion.' },
  spending: { min: 0.01, max: 1e7, step: 0.01, issue: 'Enter annual spending from $0.01 to $10 million.' },
  rate: { min: 0.1, max: 15, step: 0.01, issue: 'Enter a rate from 0.1% to 15%.' },
  years: { min: 1, max: 60, step: 1, issue: 'Enter a whole number of years from 1 to 60.' },
  nominal: { min: -50, max: 20, step: 0.01, issue: 'Enter a nominal return from −50% to 20%.' },
  inflation: { min: -5, max: 20, step: 0.01, issue: 'Enter inflation from −5% to 20%.' },
  fee: { min: 0, max: 5, step: 0.01, issue: 'Enter an annual fee from 0% to 5%.' },
} as const;

export function drawdownIssue(field: keyof typeof drawdownLimits, value: number) {
  const { min, max, issue } = drawdownLimits[field];
  if (
    !Number.isFinite(value) ||
    value < min ||
    value > max ||
    (field === 'years' && !Number.isInteger(value))
  ) {
    return issue;
  }
}

export const firstWithdrawal = (portfolio: number, rate: number) => portfolio * (rate / 100);
export const portfolioForSpending = (annual: number, rate: number) => annual / (rate / 100);

export function realGrowthFactor(nominal: number, inflation: number, fee: number) {
  return ((1 + nominal / 100) * (1 - fee / 100)) / (1 + inflation / 100);
}

export function modelWithdrawals(
  settings: DrawdownInputs,
  strategy: WithdrawalStrategy,
  growthFactor: (year: number) => number = () =>
    realGrowthFactor(settings.nominal, settings.inflation, settings.fee),
) {
  const { portfolio, rate, years, inflation } = settings;
  const initialWithdrawal = firstWithdrawal(portfolio, rate);
  let balance = portfolio;
  let firstShortfall: number | null = null;
  let depletedYear: number | null = portfolio === 0 ? 0 : null;
  const rows = Array.from({ length: years }, (_, index) => {
    const year = index + 1;
    const planned = strategy === 'fixed-real' ? initialWithdrawal : firstWithdrawal(balance, rate);
    // Tolerate floating-point noise when the last withdrawal exactly matches the balance.
    const remainder = balance - planned;
    const tolerance = Math.max(balance, planned) * 1e-12;
    const paid = Math.min(balance, planned);
    if (firstShortfall === null && remainder < -tolerance) firstShortfall = year;
    balance = remainder <= tolerance ? 0 : remainder * growthFactor(year);
    if (depletedYear === null && balance === 0) depletedYear = year;
    return {
      year,
      planned,
      paid,
      balance,
      withdrawalPriceFactor: (1 + inflation / 100) ** index,
      balancePriceFactor: (1 + inflation / 100) ** year,
    };
  });
  return { rows, firstShortfall, depletedYear, endingBalance: balance };
}

export function withdrawalScenarios(settings: DrawdownInputs, strategy: WithdrawalStrategy) {
  const { nominal, inflation, fee } = settings;
  const base = realGrowthFactor(nominal, inflation, fee);
  const lower = base - LOWER_RETURN_DELTA / 100;
  return [
    { id: 'base', label: 'Base return', result: modelWithdrawals(settings, strategy, () => base) },
    { id: 'lower', label: 'Lower return', result: modelWithdrawals(settings, strategy, () => lower) },
    {
      id: 'early',
      label: 'Early market losses',
      result: modelWithdrawals(settings, strategy, (year) => {
        const stressReturn = EARLY_LOSS_RETURNS[year - 1];
        return stressReturn === undefined ? base : realGrowthFactor(stressReturn, inflation, fee);
      }),
    },
  ] as const;
}
