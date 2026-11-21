import { billMockSource, paginateResidentBills } from '../data/billing.mockSource';
import { residentScopedBills } from '../../mock/residentMockDomainBuilders';
import { residentMockSeed } from '../../mock/residentMockSeed';
import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
function contextFor(homeContextId: string): ResidentRepositoryRequestContext {
    const home = mockResidentHomeContexts.find((candidate) => candidate.homeContextId === homeContextId);
    const scenario = residentMockSeed.find((candidate) => candidate.homeContextId === homeContextId);
    if (!home || !scenario)
        throw new Error('Missing resident test context');
    return {
        activeHome: {
            homeContextId: home.homeContextId,
            residentId: 'resident-001',
            societyId: home.societyId,
            societyName: home.societyName,
            societyAreaId: home.societyAreaId,
            societyAreaName: home.societyAreaName,
            city: home.city,
            unitId: home.unitId,
            flatNumber: home.flatNumber,
            displayUnitName: home.displayUnitName,
            ...includeWhenPresent("buildingName", home.buildingName),
            ...includeWhenPresent("towerName", home.towerName),
            ...includeWhenPresent("wingName", home.wingName),
            residentRole: home.residentRole,
            status: home.status,
            featureFlagScopeId: home.featureFlagScopeId,
            permissionScopeId: home.permissionScopeId,
            dataScopeKey: scenario.dataScopeKey
        },
        dataScopeKey: scenario.dataScopeKey
    };
}
describe('resident billing mock pagination', () => {
    it('provides at least 36 realistic bills for each full-feature residence', () => {
        for (const home of mockResidentHomeContexts.filter((candidate) => candidate.featureCoverage === 'full')) {
            const bills = residentScopedBills.filter((bill) => bill.homeContextId === home.homeContextId);
            expect(bills).toHaveLength(36);
            expect(bills.every((bill) => !/Maintenance Bill \d+/.test(bill.title))).toBe(true);
            expect(bills.every((bill) => bill.charges.length >= 5)).toBe(true);
        }
    });
    it('returns cursor pages without duplicates and keeps the selected filter', () => {
        const bills = residentScopedBills.filter((bill) => bill.homeContextId === 'context-001');
        const first = paginateResidentBills(bills, { filter: 'paid', cursor: null, pageSize: 4 });
        const second = paginateResidentBills(bills, { filter: 'paid', cursor: first.nextCursor, pageSize: 4 });
        const ids = [...first.bills, ...second.bills].map((bill) => bill.id);
        expect(first.bills).toHaveLength(4);
        expect(first.bills.every((bill) => bill.status === 'PAID')).toBe(true);
        expect(second.bills.every((bill) => bill.status === 'PAID')).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
    });
    it('scopes repository pages to the active residence', async () => {
        jest.useFakeTimers();
        const firstRequest = billMockSource.getBillsPage(contextFor('context-001'), {
            filter: 'all', cursor: null, pageSize: 8
        });
        const secondRequest = billMockSource.getBillsPage(contextFor('context-004'), {
            filter: 'all', cursor: null, pageSize: 8
        });
        await jest.runAllTimersAsync();
        const [first, second] = await Promise.all([firstRequest, secondRequest]);
        jest.useRealTimers();
        expect(first.ok).toBe(true);
        expect(second.ok).toBe(true);
        if (!first.ok || !second.ok)
            return;
        expect(first.data.bills.every((bill) => bill.homeContextId === 'context-001')).toBe(true);
        expect(second.data.bills.every((bill) => bill.homeContextId === 'context-004')).toBe(true);
        expect(first.data.bills[0]?.societyName).not.toBe(second.data.bills[0]?.societyName);
    });
});

