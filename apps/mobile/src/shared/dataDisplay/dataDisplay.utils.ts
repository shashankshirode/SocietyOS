import type { Absent } from "../types/absence.types";
export type EmptyValueContext = 'generic' | 'notProvided' | 'notAssigned' | 'notUploaded' | 'notGenerated' | 'notConfigured' | 'pending' | 'noExpiry' | 'noData';
const EMPTY_LABELS: Record<EmptyValueContext, string> = {
    generic: 'Not available',
    notProvided: 'Not provided',
    notAssigned: 'Not assigned',
    notUploaded: 'Not uploaded',
    notGenerated: 'Not generated',
    notConfigured: 'Not configured',
    pending: 'Pending',
    noExpiry: 'No expiry date',
    noData: 'No data available',
};
export function resolveEmptyLabel(context: EmptyValueContext = 'generic'): string {
    return EMPTY_LABELS[context] || EMPTY_LABELS.generic;
}
export function isValueMissing(value: JsonValue | Absent): boolean {
    if (value === null || value === undefined)
        return true;
    if (typeof value === 'string' && value.trim() === '')
        return true;
    return false;
}
export function formatSafeAmount(value: number | null | Absent, currency = '₹'): string {
    if (value === null || value === undefined)
        return resolveEmptyLabel('generic');
    return `${currency}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
export function displayValue(value: string | null | Absent, context: EmptyValueContext = 'generic'): string {
    return isValueMissing(value) ? resolveEmptyLabel(context) : value!;
}

