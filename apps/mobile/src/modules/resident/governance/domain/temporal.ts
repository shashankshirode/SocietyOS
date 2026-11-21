export type IsoInstant = string;
const STRICT_UTC_ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?Z$/;
const MILLISECONDS_PER_DAY = 86400000;
export type EffectiveWindow = {
    readonly effectiveFrom: IsoInstant;
    readonly effectiveTo: IsoInstant | null;
};
export function isIsoInstant(value: string): boolean {
    const match = STRICT_UTC_ISO.exec(value);
    if (match === null) {
        return false;
    }
    const parsed = Date.parse(value);
    if (Number.isNaN(parsed)) {
        return false;
    }
    const instant = new Date(parsed);
    return (instant.getUTCFullYear() === Number(match[1]) &&
        instant.getUTCMonth() + 1 === Number(match[2]) &&
        instant.getUTCDate() === Number(match[3]) &&
        instant.getUTCHours() === Number(match[4]) &&
        instant.getUTCMinutes() === Number(match[5]) &&
        instant.getUTCSeconds() === Number(match[6]));
}
export function normalizeIso(value: string): string {
    return new Date(Date.parse(value)).toISOString();
}
export function toEpochMillis(value: IsoInstant): number {
    return Date.parse(value);
}
export function fromEpochMillis(millis: number): IsoInstant {
    return new Date(millis).toISOString();
}
export function compareInstants(left: IsoInstant, right: IsoInstant): number {
    return toEpochMillis(left) - toEpochMillis(right);
}
export function isInstantBefore(left: IsoInstant, right: IsoInstant): boolean {
    return compareInstants(left, right) < 0;
}
export function isEffectiveAt(window: EffectiveWindow, at: IsoInstant): boolean {
    if (isInstantBefore(at, window.effectiveFrom)) {
        return false;
    }
    if (window.effectiveTo === null) {
        return true;
    }
    return isInstantBefore(at, window.effectiveTo);
}
export function isValidWindow(window: EffectiveWindow): boolean {
    if (!isIsoInstant(window.effectiveFrom)) {
        return false;
    }
    if (window.effectiveTo === null) {
        return true;
    }
    if (!isIsoInstant(window.effectiveTo)) {
        return false;
    }
    return isInstantBefore(window.effectiveFrom, window.effectiveTo);
}
export function windowsOverlap(left: EffectiveWindow, right: EffectiveWindow): boolean {
    const leftEnd = left.effectiveTo === null ? Number.POSITIVE_INFINITY : toEpochMillis(left.effectiveTo);
    const rightEnd = right.effectiveTo === null ? Number.POSITIVE_INFINITY : toEpochMillis(right.effectiveTo);
    const leftStart = toEpochMillis(left.effectiveFrom);
    const rightStart = toEpochMillis(right.effectiveFrom);
    return leftStart < leftEnd && rightStart < leftEnd;
}
export function daysEffectiveWithin(window: EffectiveWindow, at: IsoInstant): number {
    const windowStart = toEpochMillis(window.effectiveFrom);
    const windowEnd = window.effectiveTo === null ? toEpochMillis(at) : toEpochMillis(window.effectiveTo);
    const upperBound = Math.min(windowEnd, toEpochMillis(at));
    if (upperBound <= windowStart) {
        return 0;
    }
    return Math.floor((upperBound - windowStart) / MILLISECONDS_PER_DAY);
}

