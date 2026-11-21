import { defaultFamilyAccessPermissions } from '../../household/data/residentHousehold.types';
import { residentHouseholdMockSource, resetResidentHouseholdMockState } from '../../household/data/residentHousehold.mockSource';
import { getResidentMockNotificationEvents, resetResidentMockNotificationEvents } from '../../notifications/data/residentNotificationEvents.mock';
import { getLifecycleRequestContext, resetResidentLifecycleMockState, residentLifecycleMockSource } from '../data/residentLifecycle.mockSource';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
function requiredContext(homeContextId: string) {
    const context = getLifecycleRequestContext(homeContextId);
    if (!context)
        throw new Error(`Missing test context: ${homeContextId}`);
    return context;
}
describe('residentLifecycleMockSource', () => {
    beforeEach(() => {
        resetResidentHouseholdMockState();
        resetResidentLifecycleMockState();
        resetResidentMockNotificationEvents();
    });
    it('links family people into another owned residence and prevents duplicate links', async () => {
        const sourceContext = requiredContext('context-001');
        const targetContext = requiredContext('context-004');
        const plan = await residentLifecycleMockSource.getFamilyPortabilityPlan(sourceContext);
        const sourceMember = getRequiredItem(plan.sourceMembers, 0, "residentLifecycle.integration.test.ts");
        const first = await residentLifecycleMockSource.executeFamilyPortability({
            sourceContext,
            targetContext,
            familyMemberIds: [sourceMember.id],
            relationToOwner: 'OTHER',
            stayPattern: 'secondarySeasonalResident',
            permissions: defaultFamilyAccessPermissions,
            consentConfirmed: true,
        });
        expect(getRequiredItem(first.results, 0, "residentLifecycle.integration.test.ts").outcome).toMatch(/copiedNewPerson|linkedExistingPerson/);
        const targetMembers = await residentHouseholdMockSource.getFamilyMembers(targetContext);
        expect(targetMembers.some((member) => member.personProfileId === `person-${sourceMember.id}`)).toBe(true);
        const duplicate = await residentLifecycleMockSource.executeFamilyPortability({
            sourceContext,
            targetContext,
            familyMemberIds: [sourceMember.id],
            relationToOwner: 'OTHER',
            stayPattern: 'secondarySeasonalResident',
            permissions: defaultFamilyAccessPermissions,
            consentConfirmed: true,
        });
        expect(getRequiredItem(duplicate.results, 0, "residentLifecycle.integration.test.ts").outcome).toBe('alreadyLinked');
        expect(getResidentMockNotificationEvents().some((event) => event.kind === 'familyPortabilityCompleted')).toBe(true);
    });
    it('blocks portability without consent and rental declarations that omit required manager details', async () => {
        const sourceContext = requiredContext('context-001');
        const targetContext = requiredContext('context-004');
        const plan = await residentLifecycleMockSource.getFamilyPortabilityPlan(sourceContext);
        await expect(residentLifecycleMockSource.executeFamilyPortability({ sourceContext, targetContext, familyMemberIds: [getRequiredItem(plan.sourceMembers, 0, "residentLifecycle.integration.test.ts").id], relationToOwner: 'OTHER', stayPattern: 'occasionalFamilyVisitor', permissions: defaultFamilyAccessPermissions, consentConfirmed: false })).rejects.toThrow('Consent');
        await expect(residentLifecycleMockSource.submitRentalDeclaration({ context: sourceContext, occupancyModel: 'brokerManagedStay', effectiveFrom: '2026-07-20' })).rejects.toThrow('manager');
    });
    it('isolates rental declarations and short stays by residence policy and context', async () => {
        const enabledContext = requiredContext('context-001');
        const prohibitedContext = requiredContext('context-004');
        const declaration = await residentLifecycleMockSource.submitRentalDeclaration({ context: enabledContext, occupancyModel: 'shortTermRental', effectiveFrom: '2026-07-20' });
        expect(await residentLifecycleMockSource.getRentalDeclaration(enabledContext)).toEqual(declaration);
        expect(await residentLifecycleMockSource.getRentalDeclaration(prohibitedContext)).toBeNull();
        await expect(residentLifecycleMockSource.createShortStay({ context: prohibitedContext, platform: 'Direct', listingIdentifier: 'PUNE-1', listingTitle: 'Pune stay', hostOrManager: 'Owner', guestName: 'Guest', guestCount: 2, checkInAt: '2026-07-20T08:30:00.000Z', checkOutAt: '2026-07-21T08:30:00.000Z', rulesAcknowledged: true })).rejects.toThrow('prohibited');
        const stay = await residentLifecycleMockSource.createShortStay({ context: enabledContext, platform: 'Airbnb', listingIdentifier: 'GV-2', listingTitle: 'Green Valley stay', hostOrManager: 'Owner', guestName: 'Guest', guestCount: 2, checkInAt: '2026-07-20T08:30:00.000Z', checkOutAt: '2026-07-21T08:30:00.000Z', rulesAcknowledged: true });
        expect(stay.status).toBe('pendingApproval');
        const approved = await residentLifecycleMockSource.updateShortStayStatus({ context: enabledContext, stayId: stay.stayId, action: 'approve' });
        const checkedIn = await residentLifecycleMockSource.updateShortStayStatus({ context: enabledContext, stayId: approved.stayId, action: 'checkIn' });
        const completed = await residentLifecycleMockSource.updateShortStayStatus({ context: enabledContext, stayId: checkedIn.stayId, action: 'checkOut' });
        expect(completed.status).toBe('completed');
        expect((await residentLifecycleMockSource.listShortStays(prohibitedContext)).some((entry) => entry.stayId === stay.stayId)).toBe(false);
    });
});

