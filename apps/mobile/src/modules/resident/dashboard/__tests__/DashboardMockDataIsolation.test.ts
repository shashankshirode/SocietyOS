import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { getScopedDashboardData } from '../data/dashboard.mockSource';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
function getResidence(contextId: string) {
    const home = mockResidentHomeContexts.find((item) => item.homeContextId === contextId);
    if (!home)
        throw new Error(`Missing residence fixture ${contextId}`);
    const activeHome = mapContextToActive(home);
    return getScopedDashboardData({ activeHome, dataScopeKey: activeHome.dataScopeKey });
}
describe('Dashboard multi-residence mock isolation', () => {
    it('provides three complete, independently scoped residence datasets', () => {
        const residences = [getResidence('context-001'), getResidence('context-003'), getResidence('context-004')];
        expect(residences.map((item) => item.societyName)).toEqual([
            'Green Valley Heights',
            'Gokhale Park Residency',
            'Rohan Ananta',
        ]);
        expect(new Set(residences.map((item) => item.contextKey)).size).toBe(3);
        expect(new Set(residences.map((item) => getRequiredItem(item.visitorTimeline, 0, "DashboardMockDataIsolation.test.ts").visitorName)).size).toBe(3);
        expect(new Set(residences.map((item) => item.maintenancePayment.billId)).size).toBe(3);
        expect(new Set(residences.map((item) => getRequiredItem(item.notices, 0, "DashboardMockDataIsolation.test.ts").title)).size).toBe(3);
        expect(new Set(residences.map((item) => getRequiredItem(item.amenities, 0, "DashboardMockDataIsolation.test.ts").name)).size).toBe(3);
        residences.forEach((dashboard) => {
            expect(dashboard.residentProfileId).toBe('resident-001');
            expect(dashboard.locale).toBeTruthy();
            expect(dashboard.timezone).toBe('Asia/Kolkata');
            expect(dashboard.residenceDetails?.familyMembers.length).toBeGreaterThan(0);
            expect(dashboard.residenceDetails?.parking.length).toBeGreaterThan(0);
            expect(dashboard.residenceDetails?.featureFlags.length).toBeGreaterThan(0);
            expect(Object.values(dashboard.sectionStates ?? {}).every((state) => state.status === 'ready')).toBe(true);
        });
    });
});

