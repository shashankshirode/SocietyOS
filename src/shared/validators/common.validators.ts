import type { Absent } from "../types/absence.types";
export type { ValidationResult } from './validation.types';
export function isRequired(value: string | Absent | null): boolean {
    return Boolean(value?.trim());
}
export function isValidIndianMobile(value: string): boolean {
    return /^[6-9]\d{9}$/.test(value.trim());
}
export function isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}
export function isValidVehicleNumber(value: string): boolean {
    return /^[A-Z]{2}\s?\d{1,2}\s?[A-Z]{1,2}\s?\d{4}$/i.test(value.trim());
}
export function minLength(value: string, length: number): boolean {
    return value.trim().length >= length;
}
export function isPositiveNumber(value: string | number): boolean {
    const parsed = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(parsed) && parsed > 0;
}

