import { domesticHelpMockSource } from '../domesticHelp.mockSource';
import type { ResidentRepositoryRequestContext } from '../../../homeContext/data/residentHomeContext.types';
import { getRequiredItem } from "../../../../../shared/utils/requiredItem";
function context(scope: string, societyId: string, unitId: string): ResidentRepositoryRequestContext {
    return {
        dataScopeKey: scope,
        activeHome: {
            homeContextId: `home-${scope}`,
            residentId: 'resident-test',
            societyId,
            societyName: `Society ${societyId}`,
            societyAreaId: `area-${societyId}`,
            societyAreaName: 'Test area',
            city: 'Pune',
            unitId,
            flatNumber: unitId,
            displayUnitName: unitId,
            residentRole: 'owner',
            status: 'active',
            featureFlagScopeId: `flags-${societyId}`,
            permissionScopeId: `permissions-${unitId}`,
            dataScopeKey: scope,
        },
    };
}
describe('domesticHelpMockSource', () => {
    beforeEach(() => domesticHelpMockSource.reset());
    it('isolates records and identifiers by active residence', async () => {
        const first = await domesticHelpMockSource.list(context('scope-one', 'society-one', 'A-101'));
        const second = await domesticHelpMockSource.list(context('scope-two', 'society-two', 'B-202'));
        expect(first.ok && first.data.every((record) => record.dataScopeKey === 'scope-one')).toBe(true);
        expect(second.ok && second.data.every((record) => record.dataScopeKey === 'scope-two')).toBe(true);
        expect(first.ok && second.ok && getRequiredItem(first.data, 0, "domesticHelp.mockSource.test.ts").id).not.toBe(second.ok ? getRequiredItem(second.data, 0, "domesticHelp.mockSource.test.ts").id : '');
    });
    it('does not expose a domestic-help record through another residence', async () => {
        const firstContext = context('scope-one', 'society-one', 'A-101');
        const secondContext = context('scope-two', 'society-two', 'B-202');
        const first = await domesticHelpMockSource.list(firstContext);
        const firstId = first.ok ? getRequiredItem(first.data, 0, "domesticHelp.mockSource.test.ts").id : '';
        const leaked = await domesticHelpMockSource.detail(secondContext, firstId);
        expect(leaked.ok && leaked.data).toBeUndefined();
    });
    it('makes duplicate access updates idempotent', async () => {
        const activeContext = context('scope-one', 'society-one', 'A-101');
        const list = await domesticHelpMockSource.list(activeContext);
        const domesticHelpId = list.ok ? getRequiredItem(list.data, 0, "domesticHelp.mockSource.test.ts").id : '';
        const input = { context: activeContext, domesticHelpId, accessStatus: 'suspended' as const };
        const first = await domesticHelpMockSource.setAccess(input);
        const duplicate = await domesticHelpMockSource.setAccess(input);
        expect(first.ok && first.data?.accessStatus).toBe('suspended');
        expect(duplicate.ok && duplicate.data).toEqual(first.ok ? first.data : undefined);
    });
    it('persists lifecycle actions only inside the active residence', async () => {
        const firstContext = context('scope-one', 'society-one', 'A-101');
        const secondContext = context('scope-two', 'society-two', 'B-202');
        const firstList = await domesticHelpMockSource.list(firstContext);
        const secondList = await domesticHelpMockSource.list(secondContext);
        const firstId = firstList.ok ? getRequiredItem(firstList.data, 0, "domesticHelp.mockSource.test.ts").id : '';
        const secondId = secondList.ok ? getRequiredItem(secondList.data, 0, "domesticHelp.mockSource.test.ts").id : '';
        const leave = await domesticHelpMockSource.applyServiceAction({
            context: firstContext,
            domesticHelpId: firstId,
            action: { type: 'startLeave' },
        });
        const duplicate = await domesticHelpMockSource.applyServiceAction({
            context: firstContext,
            domesticHelpId: firstId,
            action: { type: 'startLeave' },
        });
        const untouched = await domesticHelpMockSource.detail(secondContext, secondId);
        expect(leave.ok && leave.data?.serviceStatus).toBe('onLeave');
        expect(leave.ok && leave.data?.accessStatus).toBe('suspended');
        expect(duplicate.ok && duplicate.data).toEqual(leave.ok ? leave.data : undefined);
        expect(untouched.ok && untouched.data?.serviceStatus).toBe('active');
    });
    it('removes a linked worker from the residence list while retaining scoped history', async () => {
        const activeContext = context('scope-one', 'society-one', 'A-101');
        const initial = await domesticHelpMockSource.list(activeContext);
        const domesticHelpId = initial.ok ? getRequiredItem(initial.data, 0, "domesticHelp.mockSource.test.ts").id : '';
        const removed = await domesticHelpMockSource.applyServiceAction({
            context: activeContext,
            domesticHelpId,
            action: { type: 'remove' },
        });
        const list = await domesticHelpMockSource.list(activeContext);
        const history = await domesticHelpMockSource.detail(activeContext, domesticHelpId);
        expect(removed.ok && removed.data?.serviceStatus).toBe('removed');
        expect(list.ok && list.data.some((record) => record.id === domesticHelpId)).toBe(false);
        expect(history.ok && history.data?.serviceStatus).toBe('removed');
    });
});

