import { isExplicitDemoMode, mockSourcePermitted, guardDisputeSource, disputeSourceNotTrusted } from '../disputeSourceGuard';
import { DisputeSourceNotTrustedError } from '../interFlat.repository';
import { disputeGateway, resetDisputeGateway, listCasesForActor, openCase } from '../disputeGateway';
import { reporter, command, openCaseInput } from '../../__tests__/fixtures/disputeHarness';
describe('dispute production source guard', () => {
    const originalMode = process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
    afterEach(() => {
        if (originalMode === undefined) {
            delete process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
        }
        else {
            process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = originalMode;
        }
        resetDisputeGateway();
    });
    it('recognises mock as an explicit choice only', () => {
        delete process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
        expect(isExplicitDemoMode()).toBe(false);
        process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = 'mock';
        expect(isExplicitDemoMode()).toBe(true);
        process.env.EXPO_PUBLIC_DATA_SOURCE_MODE = 'api';
        expect(isExplicitDemoMode()).toBe(false);
    });
    it('permits fixtures under jest regardless of configuration', () => {
        delete process.env.EXPO_PUBLIC_DATA_SOURCE_MODE;
        expect(mockSourcePermitted()).toBe(true);
    });
    it('produces an actionable error rather than an empty success', () => {
        const failure = disputeSourceNotTrusted<{
            id: string;
        }>();
        expect(failure.ok).toBe(false);
        if (failure.ok) {
            return;
        }
        expect(failure.error.code).toBe('DISPUTE_SOURCE_NOT_TRUSTED');
        expect(failure.error.category).toBe('INTEGRATION_UNAVAILABLE');
        expect(failure.error.retryable).toBe(false);
    });
    it('refuses the repository mock source outside a demo build', async () => {
        expect(typeof DisputeSourceNotTrustedError).toBe('function');
        const error = new DisputeSourceNotTrustedError();
        expect(error.name).toBe('DisputeSourceNotTrustedError');
        expect(error.message).toContain('explicit demo build');
    });
});
describe('dispute gateway has no mock fallback', () => {
    beforeEach(() => {
        resetDisputeGateway();
    });
    it('serves nothing rather than fixtures before any case exists', () => {
        expect(listCasesForActor(reporter())).toEqual([]);
    });
    it('accepts a real case and returns it through the gateway', () => {
        const result = openCase(reporter(), command('pending', 'OPEN_CASE', 'gw-1', 0), openCaseInput());
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(listCasesForActor(reporter())).toHaveLength(1);
        expect(disputeGateway().ports.cases.read(result.value.id)).toBeDefined();
    });
    it('never returns fixture identifiers', () => {
        const result = openCase(reporter(), command('pending', 'OPEN_CASE', 'gw-2', 0), openCaseInput());
        expect(result.ok).toBe(true);
        if (!result.ok) {
            return;
        }
        expect(result.value.caseNumber).toMatch(/^DISP-\d{4}$/);
        expect(result.value.caseNumber).not.toMatch(/mock|fixture|test|VIOL/i);
    });
});

