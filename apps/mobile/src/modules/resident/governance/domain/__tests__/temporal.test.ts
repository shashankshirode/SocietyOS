import { compareInstants, daysEffectiveWithin, fromEpochMillis, isEffectiveAt, isInstantBefore, isIsoInstant, isValidWindow, normalizeIso, toEpochMillis, windowsOverlap, } from '../temporal';
import { OPEN_WINDOW, T_AFTER, T_BEFORE, T_MID, T_START, window } from './governanceDomainFixtures';
describe('temporal primitives', () => {
    describe('isIsoInstant', () => {
        it('accepts UTC instants with and without milliseconds', () => {
            expect(isIsoInstant('2026-01-01T00:00:00Z')).toBe(true);
            expect(isIsoInstant('2026-01-01T00:00:00.000Z')).toBe(true);
            expect(isIsoInstant('2026-01-01T00:00:00.123Z')).toBe(true);
        });
        it('rejects instants without an explicit timezone', () => {
            expect(isIsoInstant('2026-01-01T00:00:00')).toBe(false);
            expect(isIsoInstant('2026-01-01')).toBe(false);
        });
        it('rejects non-UTC offsets', () => {
            expect(isIsoInstant('2026-01-01T00:00:00+05:30')).toBe(false);
        });
        it('rejects calendar-invalid dates', () => {
            expect(isIsoInstant('2026-02-30T00:00:00.000Z')).toBe(false);
            expect(isIsoInstant('2026-13-01T00:00:00.000Z')).toBe(false);
            expect(isIsoInstant('not-a-date')).toBe(false);
            expect(isIsoInstant('')).toBe(false);
        });
    });
    it('normalises equivalent instants to the same string', () => {
        expect(normalizeIso('2026-01-01T00:00:00Z')).toBe('2026-01-01T00:00:00.000Z');
        expect(isIsoInstant('2026-01-01T00:00:00Z')).toBe(true);
    });
    it('round-trips epoch millis', () => {
        expect(toEpochMillis(T_START)).toBe(Date.parse(T_START));
        expect(fromEpochMillis(toEpochMillis(T_MID))).toBe(T_MID);
    });
    it('orders instants', () => {
        expect(compareInstants(T_BEFORE, T_START)).toBeLessThan(0);
        expect(compareInstants(T_AFTER, T_START)).toBeGreaterThan(0);
        expect(compareInstants(T_START, T_START)).toBe(0);
        expect(isInstantBefore(T_BEFORE, T_START)).toBe(true);
        expect(isInstantBefore(T_START, T_BEFORE)).toBe(false);
    });
    describe('isEffectiveAt uses a half-open interval', () => {
        const bounded = window(T_START, T_MID);
        it('is not effective before the start', () => {
            expect(isEffectiveAt(bounded, T_BEFORE)).toBe(false);
        });
        it('is effective exactly at the start', () => {
            expect(isEffectiveAt(bounded, T_START)).toBe(true);
        });
        it('is NOT effective exactly at the end, so adjacent records never double count', () => {
            expect(isEffectiveAt(bounded, T_MID)).toBe(false);
        });
        it('treats a null end as open-ended', () => {
            expect(isEffectiveAt(OPEN_WINDOW, T_AFTER)).toBe(true);
        });
    });
    describe('isValidWindow', () => {
        it('accepts a well-formed window', () => {
            expect(isValidWindow(window(T_START, T_MID))).toBe(true);
            expect(isValidWindow(OPEN_WINDOW)).toBe(true);
        });
        it('rejects an inverted or empty window', () => {
            expect(isValidWindow(window(T_MID, T_START))).toBe(false);
            expect(isValidWindow(window(T_START, T_START))).toBe(false);
        });
        it('rejects malformed bounds', () => {
            expect(isValidWindow(window('nope', T_MID))).toBe(false);
            expect(isValidWindow(window(T_START, 'nope'))).toBe(false);
        });
    });
    describe('windowsOverlap', () => {
        it('detects a genuine overlap', () => {
            expect(windowsOverlap(window(T_START, T_AFTER), window(T_MID, T_AFTER))).toBe(true);
        });
        it('does not treat adjacent windows as overlapping', () => {
            expect(windowsOverlap(window(T_START, T_MID), window(T_MID, T_AFTER))).toBe(false);
        });
        it('detects nesting in both directions', () => {
            const inner = window('2026-02-01T00:00:00.000Z', '2026-03-01T00:00:00.000Z');
            expect(windowsOverlap(window(T_START, T_AFTER), inner)).toBe(true);
            expect(windowsOverlap(inner, window(T_START, T_AFTER))).toBe(true);
        });
        it('treats an empty window as overlapping nothing', () => {
            expect(windowsOverlap(window(T_MID, T_MID), window(T_START, T_AFTER))).toBe(false);
        });
        it('reports no overlap for disjoint windows', () => {
            expect(windowsOverlap(window(T_START, T_MID), window(T_AFTER, T_AFTER))).toBe(false);
        });
        it('handles an open-ended window', () => {
            expect(windowsOverlap(OPEN_WINDOW, window(T_MID, T_AFTER))).toBe(true);
            expect(windowsOverlap(window(T_MID, T_AFTER), OPEN_WINDOW)).toBe(true);
        });
    });
    describe('daysEffectiveWithin', () => {
        it('is zero before the window opens', () => {
            expect(daysEffectiveWithin(window('2026-02-01T00:00:00.000Z', null), T_START)).toBe(0);
        });
        it('counts whole elapsed days and floors a partial day', () => {
            const from = '2026-01-01T00:00:00.000Z';
            expect(daysEffectiveWithin(window(from, null), '2026-01-11T00:00:00.000Z')).toBe(10);
            expect(daysEffectiveWithin(window(from, null), '2026-01-11T23:59:59.999Z')).toBe(10);
        });
        it('never exceeds the closing bound', () => {
            expect(daysEffectiveWithin(window(T_START, T_MID), T_AFTER)).toBe(daysEffectiveWithin(window(T_START, T_MID), T_MID));
        });
    });
});

