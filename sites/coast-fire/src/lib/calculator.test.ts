import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import {
  calculate,
  clampGoalAge,
  coastAgeRows,
  convertSpending,
  EXAMPLE,
  monthlyForCoastAge,
  validate,
} from './calculator.ts';
import { buildPlan } from './plan.ts';

const close = (a: number, b: number) =>
  assert.ok(Math.abs(a - b) < Math.max(1, Math.abs(b)) * 1e-9, `${a} vs ${b}`);
test('exact real return and known Coast present value', () => {
  const r = calculate({ ...EXAMPLE, age: 30, retirementAge: 65, spending: 48000, nominal: 5, inflation: 0 });
  close(r.coast, 217548.34242309237);
  close(r.real, 0.05);
  close(calculate(EXAMPLE).real, 1.07 / 1.03 - 1);
});
test('age comparison matches the personal calculator and respects the retirement horizon', () => {
  const rows = coastAgeRows(EXAMPLE);
  assert.deepEqual(
    rows.map(({ age }) => age),
    [25, 30, 35, 40, 45, 50, 55, 60],
  );
  for (const { age, years, coast } of rows) {
    assert.equal(years, EXAMPLE.retirementAge - age);
    close(coast, calculate({ ...EXAMPLE, age }).coast);
  }

  const zero = coastAgeRows({ ...EXAMPLE, retirementAge: 30, nominal: EXAMPLE.inflation });
  assert.deepEqual(zero, [
    { age: 25, years: 5, coast: 1_200_000 },
    { age: 30, years: 0, coast: 1_200_000 },
  ]);
  const negative = coastAgeRows({ ...EXAMPLE, retirementAge: 30, nominal: 0 });
  close(negative[0]!.coast, 1_200_000 * 1.03 ** 5);
  assert.equal(negative[1]!.coast, 1_200_000);
  assert.deepEqual(coastAgeRows({ ...EXAMPLE, retirementAge: 24 }), []);
});
test('zero return: end-of-month contributions reach target exactly', () => {
  const r = calculate({
    ...EXAMPLE,
    age: 64,
    retirementAge: 65,
    nominal: 0,
    inflation: 0,
    balance: 1188000,
    monthly: 1000,
  });
  assert.equal(r.coastMonth, 12);
  close(r.atRetirement, r.target);
});
test('fixed nominal contributions match independent nominal annuity before deflation', () => {
  const v = { ...EXAMPLE, balance: 0, monthly: 100, retirementAge: 33 };
  const r = calculate(v);
  const g = 1.07 ** (1 / 12);
  close(r.atRetirement, (100 * (g ** 12 - 1)) / (g - 1) / 1.03);
  assert.equal(r.coastMonth, null);
});
test('coast crossing uses moving threshold and stops deposits thereafter', () => {
  const r = calculate({ ...EXAMPLE, monthly: 1800 });
  assert.ok(r.coastMonth !== null && r.coastMonth > 0);
  const m = r.coastMonth!;
  assert.ok(r.points[m - 1]!.coastPath < r.points[m - 1]!.threshold);
  assert.ok(r.points[m]!.coastPath >= r.points[m]!.threshold);
  close(r.points[m + 1]!.coastPath, r.points[m]!.coastPath * (1 + r.real) ** (1 / 12));
  assert.ok(r.atRetirement >= r.target * (1 - 1e-9));
});
test('already coasting never receives deposits', () => {
  const r = calculate({ ...EXAMPLE, balance: 2000000 });
  assert.equal(r.coastMonth, 0);
  close(r.atRetirement, r.stopNowAtRetirement);
});
test('zero savings and contributions remains zero, not a fabricated date', () => {
  const r = calculate({ ...EXAMPLE, balance: 0, monthly: 0 });
  assert.equal(r.coastMonth, null);
  close(r.atRetirement, 0);
});
test('negative real return is preserved, no-deposit gap never closes', () => {
  const r = calculate({ ...EXAMPLE, nominal: 0, inflation: 3, monthly: 0 });
  assert.ok(r.real < 0);
  assert.ok(r.coast > r.target);
  assert.equal(r.coastMonth, null);
});
test('retirement today has no phantom growth or contribution', () => {
  const r = calculate({ ...EXAMPLE, retirementAge: EXAMPLE.age });
  close(r.coast, r.target);
  assert.equal(r.points.length, 1);
  close(r.atRetirement, EXAMPLE.balance);
});
test('invalid financial inputs are rejected', () => {
  for (const changes of [
    { balance: -1 },
    { spending: 0 },
    { age: 32.5 },
    { retirementAge: 20 },
    { nominal: Number.NaN },
    { withdrawal: 0 },
  ])
    assert.ok(validate({ ...EXAMPLE, ...changes }).length);
});

test('reverse saving amount reaches the requested Coast month and then stops', () => {
  for (const changes of [{}, { nominal: 0 }, { nominal: -2, inflation: 3 }, { inflation: 0 }]) {
    const v = { ...EXAMPLE, balance: 50000, ...changes };
    const goalAge = 45;
    const plan = monthlyForCoastAge(v, goalAge);
    assert.ok(plan.monthly !== null && plan.monthly > 0);
    const forward = calculate({ ...v, monthly: plan.monthly! });
    assert.equal(forward.coastMonth, (goalAge - v.age) * 12);
    assert.ok(forward.atRetirement >= forward.target * (1 - 1e-9));
  }
});

test('reverse model has an independent zero-rate closed-form result', () => {
  const v = { ...EXAMPLE, age: 40, retirementAge: 65, nominal: 0, inflation: 0, balance: 240000 };
  close(monthlyForCoastAge(v, 50).monthly!, (1200000 - 240000) / 120);
});

test('reverse goals distinguish already coasting from an immediate funding gap', () => {
  assert.equal(monthlyForCoastAge({ ...EXAMPLE, balance: 2000000 }, EXAMPLE.age).monthly, 0);
  const immediate = monthlyForCoastAge(EXAMPLE, EXAMPLE.age);
  assert.equal(immediate.monthly, null);
  close(immediate.gapNow, calculate(EXAMPLE).gap);
});

test('rounded-up reverse contributions meet the deadline; insufficient deposits do not', () => {
  const plan = monthlyForCoastAge(EXAMPLE, 45);
  const applied = calculate({ ...EXAMPLE, monthly: Math.ceil(plan.monthly!) });
  assert.ok(applied.coastMonth !== null && applied.coastMonth <= plan.months);
  const short = calculate({ ...EXAMPLE, monthly: plan.monthly! - 1 });
  assert.ok(short.coastMonth === null || short.coastMonth > plan.months);
  assert.equal(monthlyForCoastAge(EXAMPLE, 65).months, 396);
});

test('invalid reverse goals are rejected', () => {
  for (const age of [31, 66, 45.5, Number.NaN]) assert.throws(() => monthlyForCoastAge(EXAMPLE, age));
});

test('retirement-only crossing has zero Coast months, including retirement today', () => {
  const amount = Math.ceil(monthlyForCoastAge(EXAMPLE, 65).monthly!);
  const result = calculate({ ...EXAMPLE, monthly: amount });
  assert.equal(result.coastMonth, 396);
  assert.equal(result.retirementOnly, true);
  assert.equal(result.coastDurationMonths, 0);
  assert.equal(calculate({ ...EXAMPLE, retirementAge: 32, balance: 2000000 }).retirementOnly, true);
  assert.equal(calculate(EXAMPLE).retirementOnly, false);
});

test('actual progress exceeds 100 while bar is capped and surplus reconciles', () => {
  const result = calculate({ ...EXAMPLE, balance: 400000 });
  close(result.progress, (400000 / result.coast) * 100);
  assert.equal(result.progress.toFixed(1), '117.2');
  assert.equal(result.progressBar, 100);
  close(result.surplus, 400000 - result.coast);
});

test('goal range follows valid main ages without hiding incomplete input', () => {
  assert.equal(clampGoalAge(45, 65, 65), 65);
  assert.equal(clampGoalAge(60, 32, 55), 55);
  assert.equal(clampGoalAge(45, 32, 65), 45);
  assert.ok(Number.isNaN(clampGoalAge(Number.NaN, 32, 65)));
  assert.equal(clampGoalAge(45, 70, 65), 45);
});

test('monthly and annual spending represent the same retirement target', () => {
  close(convertSpending(48000, 'year', 'month'), 4000);
  close(
    calculate({ ...EXAMPLE, spending: convertSpending(4000, 'month', 'year') }).coast,
    calculate(EXAMPLE).coast,
  );
  close(convertSpending(convertSpending(48001, 'year', 'month'), 'month', 'year'), 48001);
});

test('inflation-linked deposits follow an independent real annuity', () => {
  const v = { ...EXAMPLE, retirementAge: 33, balance: 0, monthly: 100 };
  const r = calculate(v, 'inflation');
  const h = (1.07 / 1.03) ** (1 / 12);
  close(r.atRetirement, (100 * (h ** 12 - 1)) / (h - 1));
  assert.ok(r.atRetirement > calculate(v).atRetirement);
});

test('linked reverse plan matches forward model for positive, zero and negative real growth', () => {
  for (const rates of [
    { nominal: 7, inflation: 3 },
    { nominal: 3, inflation: 3 },
    { nominal: 0, inflation: 3 },
    { nominal: 0, inflation: -2 },
  ]) {
    const v = { ...EXAMPLE, balance: 50000, ...rates };
    const plan = monthlyForCoastAge(v, 45, 'inflation');
    const forward = calculate({ ...v, monthly: plan.monthly! }, 'inflation');
    assert.equal(forward.coastMonth, 156);
    assert.ok(forward.atRetirement >= forward.target * (1 - 1e-9));
  }
});

test('zero-inflation contribution modes agree and deposits still stop after crossing', () => {
  const v = { ...EXAMPLE, inflation: 0, balance: 50000 };
  const amount = monthlyForCoastAge(v, 45, 'inflation').monthly!;
  close(amount, monthlyForCoastAge(v, 45, 'fixed').monthly!);
  const r = calculate({ ...v, monthly: amount }, 'inflation');
  const month = r.coastMonth!;
  close(r.points[month + 1]!.coastPath, r.points[month]!.coastPath * (1 + r.real) ** (1 / 12));
});

test('export stores normalized annual spending, mode, true progress and stage', () => {
  const plan = buildPlan({ ...EXAMPLE, balance: 400000 }, 'inflation', 45, 'month');
  assert.equal(plan.inputs.spending, 48000);
  assert.equal(plan.inputs.contributionMode, 'inflation');
  assert.equal(plan.spendingEntryPeriod, 'month');
  assert.ok(plan.result.progressPercent > 100);
  assert.equal(plan.result.coastMonth, 0);
  assert.equal(buildPlan(EXAMPLE, 'fixed', 101, 'year').desiredCoastAge, null);
});
