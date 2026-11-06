import writeExcelFile from 'write-excel-file/universal';
import type { buildPlan } from './plan';

const header = (value: string) => ({ value, fontWeight: 'bold' as const, backgroundColor: '#E8EFE2' });
const money = (value: number) => ({ value, format: '[$$-409]#,##0.00' });
const percent = (value: number) => ({ value, format: '0.00%' });
const number = (value: number) => ({ value, format: '0.00' });

export function createPlanWorkbook(plan: ReturnType<typeof buildPlan>) {
  const { inputs, result } = plan;
  return writeExcelFile([
    {
      sheet: 'Inputs',
      columns: [{ width: 34 }, { width: 47 }],
      data: [
        ['Input or assumption', 'Value'].map(header),
        ['Current age', inputs.age],
        ['Retirement age', inputs.retirementAge],
        ['Investments today', money(inputs.balance)],
        ['Annual retirement spending', money(inputs.spending)],
        ['Spending entered per', plan.spendingEntryPeriod === 'month' ? 'Month' : 'Year'],
        ['Monthly contribution', money(inputs.monthly)],
        [
          'Contribution basis',
          inputs.contributionMode === 'inflation'
            ? 'Adjusted monthly with inflation'
            : 'Fixed nominal dollars',
        ],
        ['Nominal annual return', percent(inputs.nominal / 100)],
        ['Annual inflation', percent(inputs.inflation / 100)],
        ['Withdrawal rate', percent(inputs.withdrawal / 100)],
        ['Desired Coast age', plan.desiredCoastAge ?? 'Not selected'],
        ['Currency and purchasing power', 'USD in today’s dollars, except fixed nominal deposits'],
      ],
    },
    {
      sheet: 'Results',
      columns: [{ width: 35 }, { width: 60 }],
      data: [
        ['Estimated result', 'Value'].map(header),
        ['Coast FIRE number today', money(result.coastNumber)],
        ['Full retirement target', money(result.retirementTarget)],
        ['Gap today', money(result.gap)],
        ['Surplus today', money(result.surplus)],
        ['Progress to Coast FIRE', percent(result.progressPercent / 100)],
        ['Real annual return', percent(result.realReturn)],
        ['Estimated Coast age', result.coastAge === null ? 'Not reached' : number(result.coastAge)],
        ['Months until target is met', result.coastMonth ?? 'Not reached'],
        ['Target first met at retirement', result.retirementOnly ? 'Yes' : 'No'],
        ['Months coasting before retirement', result.preRetirementCoastMonths ?? 'Not reached'],
        ['Retirement balance if saving stops now', money(result.stopNowAtRetirement)],
        ['Retirement balance under this plan', money(result.planAtRetirement)],
        ['Model', { value: plan.model, wrap: true }],
        ['Limitations', { value: plan.limitations, wrap: true }],
      ],
    },
    {
      sheet: 'Projection',
      columns: [{ width: 16 }, { width: 12 }, { width: 23 }, { width: 24 }, { width: 24 }],
      data: [
        [
          'Elapsed months',
          'Age',
          'Stop adding now (USD)',
          'Save then coast (USD)',
          'Coast threshold (USD)',
        ].map(header),
        ...plan.projection.map((point) => [
          point.month,
          number(point.age),
          money(point.stopNow),
          money(point.coastPath),
          money(point.threshold),
        ]),
      ],
    },
  ]).toBlob();
}
