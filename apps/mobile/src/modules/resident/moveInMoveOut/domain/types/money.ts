import type { Absent } from '../../../../../shared/types/absence.types';
import type { DomainErrorCode, DomainViolation } from './primitives';
import { MAX_REASONABLE_MONEY_MINOR_UNITS, MINOR_UNITS_PER_MAJOR } from './primitives';

export type CurrencyCode = 'INR';

export type Money = {
  readonly minorUnits: number;
  readonly currency: CurrencyCode;
};

export type MoneyValidation =
  | { readonly valid: true; readonly violations: readonly [] }
  | { readonly valid: false; readonly violations: readonly DomainViolation[] };

function violation(code: DomainErrorCode, field: string): DomainViolation {
  return { code, field, blocking: true };
}

export function inr(minorUnits: number): Money {
  return { minorUnits, currency: 'INR' };
}

export function isValidCurrency(code: string): boolean {
  return code === 'INR';
}

export function validateMoney(value: Money, field: string): MoneyValidation {
  const violations: DomainViolation[] = [];

  if (!Number.isSafeInteger(value.minorUnits)) {
    violations.push(violation('MONEY_PRECISION_INVALID', `${field}.minorUnits`));
  }

  if (Math.abs(value.minorUnits) > MAX_REASONABLE_MONEY_MINOR_UNITS) {
    violations.push(violation('MONEY_PRECISION_INVALID', `${field}.minorUnits`));
  }

  if (!isValidCurrency(value.currency)) {
    violations.push(violation('CURRENCY_MISMATCH', `${field}.currency`));
  }

  if (violations.length === 0) {
    return { valid: true, violations: [] };
  }

  return { valid: false, violations };
}

function assertExactMinorUnits(value: Money): void {
  if (!Number.isSafeInteger(value.minorUnits) || Math.abs(value.minorUnits) > MAX_REASONABLE_MONEY_MINOR_UNITS) {
    throw new Error('MONEY_PRECISION_INVALID');
  }
}

function assertSameCurrency(left: Money, right: Money): void {
  if (left.currency !== right.currency) {
    throw new Error('CURRENCY_MISMATCH');
  }
}

export function addMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  assertExactMinorUnits(left);
  assertExactMinorUnits(right);
  return { minorUnits: left.minorUnits + right.minorUnits, currency: left.currency };
}

export function subtractMoney(left: Money, right: Money): Money {
  assertSameCurrency(left, right);
  assertExactMinorUnits(left);
  assertExactMinorUnits(right);
  return { minorUnits: left.minorUnits - right.minorUnits, currency: left.currency };
}

export function sumMoney(values: readonly Money[], currency: CurrencyCode): Money {
  return values.reduce<Money>((total, value) => addMoney(total, value), { minorUnits: 0, currency });
}

export function negateMoney(value: Money): Money {
  return { minorUnits: -value.minorUnits, currency: value.currency };
}

export function isZeroMoney(value: Money): boolean {
  return value.minorUnits === 0;
}

export function isCreditBalance(value: Money): boolean {
  return value.minorUnits < 0;
}

export function isDebitBalance(value: Money): boolean {
  return value.minorUnits > 0;
}

export function majorToMinor(majorAmount: number): number {
  if (!Number.isFinite(majorAmount)) {
    throw new Error('MONEY_PRECISION_INVALID');
  }
  const scaled = majorAmount * MINOR_UNITS_PER_MAJOR;
  const rounded = Math.round(scaled);
  if (Math.abs(scaled - rounded) > Number.EPSILON * Math.abs(scaled)) {
    throw new Error('MONEY_PRECISION_INVALID');
  }
  return rounded;
}

export function minorToMajor(minorUnits: number): number {
  return minorUnits / MINOR_UNITS_PER_MAJOR;
}

export function compareMoney(left: Money, right: Money): number {
  assertSameCurrency(left, right);
  if (left.minorUnits < right.minorUnits) {
    return -1;
  }
  if (left.minorUnits > right.minorUnits) {
    return 1;
  }
  return 0;
}

export function moneyEquals(left: Money, right: Money): boolean {
  return left.currency === right.currency && left.minorUnits === right.minorUnits;
}

export type MoneyLineLabel = string;

export function describeMoney(value: Money, label: MoneyLineLabel): string {
  return `${label}:${value.currency}:${value.minorUnits}`;
}

export function optionalMoney(value: Money | Absent): Money | Absent {
  return value;
}
