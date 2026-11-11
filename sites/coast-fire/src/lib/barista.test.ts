import assert from 'node:assert/strict';
import { test } from 'node:test';
import { BARISTA_EXAMPLE, baristaAgeRows, baristaIssues, calculateBarista } from './barista.ts';

const close = (actual: number, expected: number) =>
  assert.ok(
    Math.abs(actual - expected) <= Math.max(0.01, Math.abs(expected) * 1e-10),
    `${actual} differs from ${expected}`,
  );

test('default earnings, deductions and gap reconcile; simple shortcut does not hide later income loss', () => {
  const r = calculateBarista(BARISTA_EXAMPLE);
  assert.equal(r.grossIncome, 26000);
  assert.equal(r.netIncome, 20800);
  assert.equal(r.annualGap, 19200);
  assert.equal(r.incomeGapTarget, 480000);
  assert.equal(r.retirementTarget, 1000000);
  assert.ok(r.required > r.incomeGapTarget);
  assert.ok(r.gap > 0);
  // Independently iterate cash flows from the solved threshold to verify retirement funding.
  const funded = calculateBarista({ ...BARISTA_EXAMPLE, balance: r.required });
  close(funded.projectedBalance, r.retirementTarget);
  assert.equal(funded.gap, 0);
  assert.equal(funded.depletedMonth, null);
});

test('zero real growth equals all bridge spending plus full retirement reserve', () => {
  const r = calculateBarista({ ...BARISTA_EXAMPLE, nominal: 3, inflation: 3 });
  close(r.required, 19200 * 30 + 1000000);
  close(r.projectedBalance, 0);
  assert.ok(r.depletedMonth !== null);
});

test('earnings that cover spending reduce bridge check to the Coast formula without investing surplus', () => {
  const v = { ...BARISTA_EXAMPLE, hourly: 100 };
  const r = calculateBarista(v);
  assert.equal(r.annualGap, 0);
  assert.equal(r.incomeGapTarget, 0);
  close(r.required, 1000000 / (1.07 / 1.03) ** 30);
  close(r.projectedBalance, v.balance * (1.07 / 1.03) ** 30);
  assert.equal(r.coverage, 1);
});

test('immediate full retirement ignores earnings and needs the full retirement target', () => {
  const r = calculateBarista({ ...BARISTA_EXAMPLE, retirementAge: 35 });
  assert.equal(r.netIncome, 0);
  assert.equal(r.grossIncome, 0);
  assert.equal(r.required, 1000000);
  assert.equal(r.projectedBalance, 500000);
  assert.equal(r.depletedMonth, null);
});

test('no earnings, no paid weeks and 100% deductions all model the full spending gap', () => {
  for (const patch of [{ hours: 0 }, { hourly: 0 }, { weeks: 0 }, { tax: 100 }]) {
    const r = calculateBarista({ ...BARISTA_EXAMPLE, ...patch });
    assert.equal(r.netIncome, 0);
    assert.equal(r.annualGap, 40000);
    assert.ok(r.required >= 1000000);
  }
});

test('lower returns, higher spending and fewer working weeks raise the needed balance', () => {
  const base = calculateBarista(BARISTA_EXAMPLE);
  for (const patch of [{ nominal: 2 }, { spending: 60000 }, { weeks: 40 }])
    assert.ok(calculateBarista({ ...BARISTA_EXAMPLE, ...patch }).required > base.required);
  const negative = calculateBarista({ ...BARISTA_EXAMPLE, nominal: 0, inflation: 3 });
  assert.ok(Number.isFinite(negative.required));
  const funded = calculateBarista({
    ...BARISTA_EXAMPLE,
    nominal: 0,
    inflation: 3,
    balance: negative.required,
  });
  close(funded.projectedBalance, negative.retirementTarget);
});

test('depletion is reported without negative portfolios or borrowing', () => {
  const r = calculateBarista({ ...BARISTA_EXAMPLE, balance: 1000, nominal: 0, inflation: 0 });
  assert.equal(r.depletedMonth, 1);
  assert.equal(r.projectedBalance, 0);
  assert.equal(calculateBarista({ ...BARISTA_EXAMPLE, balance: 0 }).depletedMonth, 0);
});

test('invalid, empty, fractional ages and reversed dates produce field-specific errors', () => {
  for (const [key, value] of Object.entries({
    age: 35.5,
    retirementAge: 34,
    balance: -1,
    spending: 0,
    hourly: Number.NaN,
    hours: 169,
    weeks: 53,
    tax: 101,
    nominal: -51,
    inflation: -11,
    withdrawal: 0,
  })) {
    const v = { ...BARISTA_EXAMPLE, [key]: value };
    assert.ok(Object.keys(baristaIssues(v)).includes(key));
    assert.throws(() => calculateBarista(v));
  }
});

test('age and spending examples use the same model and preserve all three budget columns', () => {
  const rows = baristaAgeRows();
  assert.equal(rows.length, 8);
  const at35 = rows.find((row) => row.age === 35)!;
  assert.equal(at35.years, 30);
  close(at35.targets[0]!, calculateBarista(BARISTA_EXAMPLE).required);
  for (const row of rows) {
    assert.equal(row.targets.length, 3);
    assert.ok(row.targets[0]! < row.targets[1]! && row.targets[1]! < row.targets[2]!);
  }
});
