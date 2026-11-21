export type RoundingPolicy = 'HALF_UP' | 'FLOOR' | 'CEIL';
export interface MoneyValue {
    readonly minorUnits: number;
    readonly currency: string;
}
export const DEFAULT_CURRENCY = 'INR';
export function toMinorUnits(amount: number | string): number {
    if (typeof amount === 'string') {
        const parsed = parseFloat(amount.replace(/[^0-9.-]/g, ''));
        if (isNaN(parsed))
            return 0;
        return Math.round(parsed * 100);
    }
    if (!isFinite(amount))
        return 0;
    return Math.round(amount * 100);
}
export function fromMinorUnits(minorUnits: number): number {
    if (!isFinite(minorUnits))
        return 0;
    return Math.round(minorUnits) / 100;
}
export function createMoney(amount: number, currency: string = DEFAULT_CURRENCY): MoneyValue {
    return {
        minorUnits: toMinorUnits(amount),
        currency,
    };
}
export function addMoney(aMinor: number, bMinor: number): number {
    return Math.round(aMinor) + Math.round(bMinor);
}
export function subtractMoney(aMinor: number, bMinor: number): number {
    return Math.round(aMinor) - Math.round(bMinor);
}
export function multiplyRate(amountMinor: number, rate: number, policy: RoundingPolicy = 'HALF_UP'): number {
    if (!isFinite(amountMinor) || !isFinite(rate))
        return 0;
    const raw = amountMinor * rate;
    switch (policy) {
        case 'FLOOR':
            return Math.floor(raw);
        case 'CEIL':
            return Math.ceil(raw);
        case 'HALF_UP':
        default:
            return Math.round(raw);
    }
}
export function calculateAreaCharge(areaSqFt: number, ratePerSqFt: number, policy: RoundingPolicy = 'HALF_UP'): number {
    if (areaSqFt <= 0 || ratePerSqFt <= 0)
        return 0;
    const rateMinor = toMinorUnits(ratePerSqFt);
    const raw = areaSqFt * rateMinor;
    switch (policy) {
        case 'FLOOR':
            return Math.floor(raw);
        case 'CEIL':
            return Math.ceil(raw);
        case 'HALF_UP':
        default:
            return Math.round(raw);
    }
}
export function calculatePercentage(baseMinor: number, percentage: number, policy: RoundingPolicy = 'HALF_UP'): number {
    if (baseMinor <= 0 || percentage <= 0)
        return 0;
    const raw = (baseMinor * percentage) / 100;
    switch (policy) {
        case 'FLOOR':
            return Math.floor(raw);
        case 'CEIL':
            return Math.ceil(raw);
        case 'HALF_UP':
        default:
            return Math.round(raw);
    }
}
export function clampMoney(amountMinor: number, minMinor?: number, maxMinor?: number): number {
    let result = amountMinor;
    if (minMinor !== undefined && result < minMinor) {
        result = minMinor;
    }
    if (maxMinor !== undefined && result > maxMinor) {
        result = maxMinor;
    }
    return result;
}
export function formatMoney(minorUnits: number, currency: string = DEFAULT_CURRENCY): string {
    const major = fromMinorUnits(minorUnits);
    try {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(major);
    }
    catch {
        return `${currency} ${major.toFixed(2)}`;
    }
}

