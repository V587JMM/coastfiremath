import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  DRAWDOWN_EXAMPLE,
  drawdownIssue,
  firstWithdrawal,
  modelWithdrawals,
  portfolioForSpending,
  realGrowthFactor,
  withdrawalScenarios,
} from './four-percent-rule.ts';

function close(actual: number, expected: number) {
  assert.ok(Math.abs(actual - expected) < 1e-7, `Expected ${expected}, got ${actual}`);
}

test('first-year income and reverse portfolio reconcile at 4%', () => {
  assert.equal(firstWithdrawal(1_000_000, 4), 40_000);
  assert.equal(portfolioForSpending(5_000 * 12, 4), 1_500_000);
  close(realGrowthFactor(7, 3, 1), (1.07 * 0.99) / 1.03);
});

test('the classic rule withdraws at the start of each year and keeps purchasing power constant', () => {
  const result = modelWithdrawals(DRAWDOWN_EXAMPLE, 'fixed-real');
  const factor = 1.07 / 1.03;
  close(result.rows[0]!.balance, 960_000 * factor);
  close(result.rows[1]!.balance, (960_000 * factor - 40_000) * factor);
  const tenth = result.rows[9]!;
  assert.equal(tenth.paid, 40_000);
  close(tenth.paid * tenth.withdrawalPriceFactor, 40_000 * 1.03 ** 9);
  close(tenth.balance * tenth.balancePriceFactor, tenth.balance * 1.03 ** 10);
});

test('depletion and first shortfall distinguish an exact final payment from a partial withdrawal', () => {
  const input = { ...DRAWDOWN_EXAMPLE, nominal: 0, inflation: 0, years: 25 };
  const exact = modelWithdrawals(input, 'fixed-real');
  assert.equal(exact.depletedYear, 25);
  assert.equal(exact.firstShortfall, null);
  assert.equal(exact.endingBalance, 0);
  const later = modelWithdrawals({ ...input, years: 26 }, 'fixed-real');
  assert.equal(later.firstShortfall, 26);
  const partial = modelWithdrawals({ ...input, rate: 15 }, 'fixed-real');
  assert.equal(partial.firstShortfall, 7);
  assert.equal(partial.rows[6]!.paid, 100_000);
  assert.equal(partial.rows[7]!.paid, 0);
  const empty = modelWithdrawals({ ...input, portfolio: 0 }, 'fixed-real');
  assert.equal(empty.depletedYear, 0);
  assert.equal(empty.endingBalance, 0);
  const losing = modelWithdrawals({ ...input, nominal: -10 }, 'fixed-real');
  assert.ok(losing.firstShortfall && losing.firstShortfall < 25);
});

test('withdrawal as a share of balance adapts after an early loss', () => {
  const [base, lower, stress] = withdrawalScenarios(DRAWDOWN_EXAMPLE, 'percent');
  close(stress.result.rows[0]!.balance, (960_000 * 0.8) / 1.03);
  close(stress.result.rows[1]!.paid, stress.result.rows[0]!.balance * 0.04);
  close(stress.result.rows[1]!.balance, (stress.result.rows[0]!.balance * 0.96 * 0.9) / 1.03);
  close(stress.result.rows[2]!.balance, (stress.result.rows[1]!.balance * 0.96 * 1.07) / 1.03);
  close(lower.result.rows[0]!.balance, 960_000 * (1.07 / 1.03 - 0.02));
  assert.ok(stress.result.rows[1]!.paid < base.result.rows[1]!.paid);
  assert.ok(stress.result.endingBalance > 0);
  assert.equal(stress.result.firstShortfall, null);
  assert.ok(withdrawalScenarios(DRAWDOWN_EXAMPLE, 'fixed-real')[2].result.firstShortfall);
});

test('input limits reject missing and non-finite values and constrain the horizon', () => {
  assert.ok(drawdownIssue('portfolio', -1));
  assert.ok(drawdownIssue('spending', 0));
  assert.ok(drawdownIssue('rate', Number.NaN));
  assert.ok(drawdownIssue('years', 30.5));
  assert.ok(drawdownIssue('years', 61));
  assert.ok(drawdownIssue('nominal', -51));
  assert.ok(drawdownIssue('inflation', Infinity));
  assert.ok(drawdownIssue('fee', -1));
  assert.equal(drawdownIssue('portfolio', 0), undefined);
  assert.equal(drawdownIssue('years', 50), undefined);
});
