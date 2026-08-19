import { getRequiredItem } from "../utils/requiredItem";
import type { Absent } from "../types/absence.types";
const DEFAULT_STRING_FALLBACK = '—';
const DEFAULT_NUMBER_FALLBACK = 0;
const DEFAULT_DATE_FALLBACK = '—';
export function safeString(value: string | null | Absent, fallback: string = DEFAULT_STRING_FALLBACK): string {
    if (value === null || value === undefined)
        return fallback;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
}
export function safeNumber(value: number | null | Absent, fallback: number = DEFAULT_NUMBER_FALLBACK): number {
    if (value === null || value === undefined)
        return fallback;
    return Number.isFinite(value) ? value : fallback;
}
export function safeArray<T>(value: T[] | null | Absent): T[] {
    return Array.isArray(value) ? value : [];
}
export function safeFirst<T>(value: T[] | null | Absent, fallback: T): T {
    const arr = safeArray(value);
    return arr.length > 0 ? getRequiredItem(arr, 0, "safeData.ts") : fallback;
}
export function safeDate(value: string | null | Absent, fallback: string = DEFAULT_DATE_FALLBACK): string {
    if (!value)
        return fallback;
    const date = new Date(value);
    if (isNaN(date.getTime()))
        return fallback;
    return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}
export function safeCurrency(amount: number | null | Absent, fallback: string = '₹0'): string {
    if (amount === null || amount === undefined || !Number.isFinite(amount)) {
        return fallback;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
}
export function safeEnum<T extends string>(value: string | null | Absent, validValues: readonly T[], fallback: T): T {
    if (value && (validValues as readonly string[]).includes(value)) {
        return value as T;
    }
    return fallback;
}
export function safeBoolean(value: boolean | null | Absent, fallback = false): boolean {
    return value ?? fallback;
}
export function safeGet<T>(obj: Record<string, T> | null | Absent, key: string, fallback: T): T {
    if (!obj || !(key in obj))
        return fallback;
    return obj[key] ?? fallback;
}

