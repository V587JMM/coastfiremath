import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  calculateFireNumber,
  FIRE_NUMBER_EXAMPLE,
  FIRE_TIMELINE_EXAMPLE,
  fireNumberIssues,
  fireTimelineIssues,
  projectFireNumber,
} from './fire-number.ts';

test('25x, 28.57x and 33.33x targets use spending, not salary or expected investment returns', () => {
  const v = { spending: 48000, withdrawal: 4, balance: 300000 };
  assert.deepEqual(calculateFireNumber(v), {
    target: 1200000,
    multiple: 25,
    gap: 900000,
    surplus: 0,
    progress: 25,
    annualSupported: 12000,
  });
  assert.equal(calculateFireNumber({ ...v, withdrawal: 3 }).target, 1600000);
  assert.ok(Math.abs(calculateFireNumber({ ...v, withdrawal: 3.5 }).target - 1371428.5714285714) < 1e-6);
  const over = calculateFireNumber({ ...v, balance: 1500000 });
  assert.equal(over.progress, 125);
  assert.equal(over.surplus, 300000);
  assert.equal(over.gap, 0);
  assert.equal(calculateFireNumber({ ...v, balance: 0 }).annualSupported, 0);
});

test('zero growth has an independent deposit-count solution and checks the first funded month', () => {
  const v = { spending: 40000, withdrawal: 4, balance: 997500 };
  const t = { age: 50, monthly: 1000, real: 0 };
  const r = projectFireNumber(v, t);
  assert.equal(r.reachedMonth, 3);
  assert.equal(r.finalBalance, 1000500);
  assert.equal(r.points.at(-1)?.month, 3);
  assert.equal(projectFireNumber({ ...v, balance: 997000 }, t).reachedMonth, 3);
});

test('monthly compounding agrees with a real annuity; no-deposit case reaches a known annual boundary', () => {
  const v = { spending: 40000, withdrawal: 4, balance: 500000 };
  assert.equal(
    projectFireNumber(v, { age: 35, monthly: 0, real: 100 * (2 ** (1 / 10) - 1) }).reachedMonth,
    120,
  );
  const t = { age: 35, monthly: 2000, real: 4 };
  const r = projectFireNumber(v, t);
  assert.ok(r.reachedMonth !== null);
  const g = 1.04 ** (1 / 12);
  const value = (n: number) => v.balance * g ** n + (t.monthly * (g ** n - 1)) / (g - 1);
  assert.ok(Math.abs(r.finalBalance - value(r.reachedMonth)) < 1e-5);
  assert.ok(value(r.reachedMonth) >= 1e6);
  assert.ok(value(r.reachedMonth - 1) < 1e6);
});

test('already funded, no savings, negative return and horizon limits have explicit outcomes', () => {
  const funded = projectFireNumber(
    { spending: 40000, withdrawal: 4, balance: 1200000 },
    FIRE_TIMELINE_EXAMPLE,
  );
  assert.equal(funded.reachedMonth, 0);
  assert.equal(funded.points.length, 1);
  for (const real of [0, -4]) {
    const r = projectFireNumber(
      { spending: 40000, withdrawal: 4, balance: 100000 },
      { age: 99, monthly: 0, real },
    );
    assert.equal(r.reachedMonth, null);
    assert.equal(r.horizon, 12);
    assert.ok(r.finalBalance <= 100000);
  }
  const empty = projectFireNumber({ ...FIRE_NUMBER_EXAMPLE, balance: 0 }, { age: 35, monthly: 0, real: 4 });
  assert.equal(empty.reachedMonth, null);
  assert.equal(empty.finalBalance, 0);
  assert.equal(
    projectFireNumber(FIRE_NUMBER_EXAMPLE, { age: 100, monthly: 10000, real: 4 }).reachedMonth,
    null,
  );
});

test('invalid and empty numerical inputs are rejected; optional timeline validation is independent', () => {
  for (const v of [
    { ...FIRE_NUMBER_EXAMPLE, spending: 0 },
    { ...FIRE_NUMBER_EXAMPLE, spending: Number.NaN },
    { ...FIRE_NUMBER_EXAMPLE, withdrawal: 0 },
    { ...FIRE_NUMBER_EXAMPLE, withdrawal: 16 },
    { ...FIRE_NUMBER_EXAMPLE, balance: -1 },
    { ...FIRE_NUMBER_EXAMPLE, balance: Number.POSITIVE_INFINITY },
  ]) {
    assert.ok(Object.keys(fireNumberIssues(v)).length);
    assert.throws(() => calculateFireNumber(v));
  }
  for (const t of [
    { ...FIRE_TIMELINE_EXAMPLE, age: 35.5 },
    { ...FIRE_TIMELINE_EXAMPLE, age: 101 },
    { ...FIRE_TIMELINE_EXAMPLE, monthly: -1 },
    { ...FIRE_TIMELINE_EXAMPLE, monthly: Number.NaN },
    { ...FIRE_TIMELINE_EXAMPLE, real: -100 },
  ]) {
    assert.ok(Object.keys(fireTimelineIssues(t)).length);
    assert.throws(() => projectFireNumber(FIRE_NUMBER_EXAMPLE, t));
    assert.equal(calculateFireNumber(FIRE_NUMBER_EXAMPLE).target, 1500000);
  }
});
