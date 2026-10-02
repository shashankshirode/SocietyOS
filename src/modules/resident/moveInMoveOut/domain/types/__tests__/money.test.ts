import {
  addMoney,
  compareMoney,
  inr,
  isCreditBalance,
  isDebitBalance,
  isValidCurrency,
  isZeroMoney,
  majorToMinor,
  minorToMajor,
  moneyEquals,
  subtractMoney,
  sumMoney,
  validateMoney,
} from '../money';

describe('money', () => {
  it('represents amounts only as integer minor units', () => {
    expect(validateMoney(inr(1000), 'amount')).toEqual({ valid: true, violations: [] });
    expect(validateMoney({ minorUnits: 10.5, currency: 'INR' }, 'amount').valid).toBe(false);
    expect(validateMoney({ minorUnits: Number.NaN, currency: 'INR' }, 'amount').valid).toBe(false);
    expect(validateMoney({ minorUnits: Number.POSITIVE_INFINITY, currency: 'INR' }, 'amount').valid).toBe(
      false,
    );
  });

  it('rejects an unsafe integer magnitude', () => {
    const outcome = validateMoney({ minorUnits: Number.MAX_SAFE_INTEGER + 2, currency: 'INR' }, 'amount');
    expect(outcome.valid).toBe(false);
    if (!outcome.valid) {
      expect(outcome.violations.map((violation) => violation.field)).toContain('amount.minorUnits');
    }
  });

  it('rejects any currency other than INR', () => {
    expect(isValidCurrency('INR')).toBe(true);
    expect(isValidCurrency('USD')).toBe(false);
    expect(isValidCurrency('inr')).toBe(false);
    const outcome = validateMoney({ minorUnits: 1, currency: 'USD' as 'INR' }, 'amount');
    expect(outcome.valid).toBe(false);
    if (!outcome.valid) {
      expect(outcome.violations.map((violation) => violation.code)).toContain('CURRENCY_MISMATCH');
    }
  });

  it('adds and subtracts exactly with no floating point drift', () => {
    expect(addMoney(inr(100), inr(250)).minorUnits).toBe(350);
    expect(subtractMoney(inr(350), inr(250)).minorUnits).toBe(100);
    expect(addMoney(inr(100000), inr(200050)).minorUnits).toBe(300050);
    expect(subtractMoney(inr(100050), inr(50)).minorUnits).toBe(100000);
  });

  it('refuses to combine a fractional amount into a total', () => {
    expect(() => addMoney(inr(100), { minorUnits: 0.1 + 0.2, currency: 'INR' })).toThrow(
      'MONEY_PRECISION_INVALID',
    );
    expect(() => subtractMoney(inr(100), { minorUnits: 0.5, currency: 'INR' })).toThrow(
      'MONEY_PRECISION_INVALID',
    );
  });

  it('sums a ledger of line items exactly', () => {
    const lines = [inr(100000), inr(200050), inr(999), inr(1)];
    expect(sumMoney(lines, 'INR').minorUnits).toBe(301050);
    expect(sumMoney([], 'INR')).toEqual({ minorUnits: 0, currency: 'INR' });
  });

  it('refuses to add or subtract across currencies', () => {
    expect(() => addMoney(inr(1), { minorUnits: 1, currency: 'USD' as 'INR' })).toThrow(
      'CURRENCY_MISMATCH',
    );
    expect(() => subtractMoney(inr(1), { minorUnits: 1, currency: 'USD' as 'INR' })).toThrow(
      'CURRENCY_MISMATCH',
    );
  });

  it('refuses to total a mixed currency ledger', () => {
    expect(() => sumMoney([inr(100), { minorUnits: 100, currency: 'USD' as 'INR' }], 'INR')).toThrow(
      'CURRENCY_MISMATCH',
    );
  });

  it('classifies zero credit and debit balances', () => {
    expect(isZeroMoney(inr(0))).toBe(true);
    expect(isCreditBalance(inr(-1))).toBe(true);
    expect(isDebitBalance(inr(1))).toBe(true);
    expect(isDebitBalance(inr(0))).toBe(false);
  });

  it('converts major amounts only when they are exactly representable in paisa', () => {
    expect(majorToMinor(0)).toBe(0);
    expect(majorToMinor(1)).toBe(100);
    expect(majorToMinor(0.1)).toBe(10);
    expect(majorToMinor(1234.56)).toBe(123456);
    expect(majorToMinor(-50.25)).toBe(-5025);
  });

  it('refuses to round away sub paisa precision', () => {
    expect(() => majorToMinor(0.005)).toThrow('MONEY_PRECISION_INVALID');
    expect(() => majorToMinor(1.005)).toThrow('MONEY_PRECISION_INVALID');
    expect(() => majorToMinor(Number.NaN)).toThrow('MONEY_PRECISION_INVALID');
    expect(() => majorToMinor(Number.POSITIVE_INFINITY)).toThrow('MONEY_PRECISION_INVALID');
  });

  it('round trips through minor units without loss', () => {
    for (const minor of [0, 1, 99, 100, 100050, -25075]) {
      expect(majorToMinor(minorToMajor(minor))).toBe(minor);
    }
  });

  it('orders amounts and compares for equality', () => {
    expect(compareMoney(inr(100), inr(200))).toBe(-1);
    expect(compareMoney(inr(300), inr(200))).toBe(1);
    expect(compareMoney(inr(200), inr(200))).toBe(0);
    expect(moneyEquals(inr(200), inr(200))).toBe(true);
    expect(moneyEquals(inr(200), inr(201))).toBe(false);
    expect(moneyEquals(inr(200), { minorUnits: 200, currency: 'USD' as 'INR' })).toBe(false);
  });

  it('never produces a fractional result from exact integer inputs', () => {
    const total = addMoney(addMoney(inr(33333), inr(33333)), inr(33334));
    expect(Number.isSafeInteger(total.minorUnits)).toBe(true);
    expect(total.minorUnits).toBe(100000);
  });
});
