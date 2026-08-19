import { mockResidentHomeContexts } from '../../homeContext/data/residentHomeContext.mockData';
import { mapContextToActive } from '../../homeContext/state/residentHomeContext.store';
import { residentHouseholdMockSource, linkFamilyMemberToHomeContext } from '../../household/data/residentHousehold.mockSource';
import { publishResidentMockNotification } from '../../notifications/data/residentNotificationEvents.mock';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { CreateShortStayInput, FamilyPortabilityInput, FamilyPortabilityResult, RentalDeclaration, ResidentLifecycleRepository, ShortStay, ShortStayPolicyStatus, SubmitRentalDeclarationInput, UpdateShortStayStatusInput, } from './residentLifecycle.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const rentalDeclarations = new Map<string, RentalDeclaration>();
const shortStaysByHome = new Map<string, ShortStay[]>();
let lifecycleSequence = 200;
function requestContextForHome(homeContextId: string): ResidentRepositoryRequestContext | Absent {
    const home = mockResidentHomeContexts.find((entry) => entry.homeContextId === homeContextId);
    if (!home)
        return undefined;
    const activeHome = mapContextToActive(home);
    return { activeHome, dataScopeKey: activeHome.dataScopeKey };
}
function policyForContext(context: ResidentRepositoryRequestContext): ShortStayPolicyStatus {
    if (context.activeHome.featureFlagScopeId === 'scope-gv')
        return 'approvalRequired';
    return 'prohibited';
}
function shortStayState(context: ResidentRepositoryRequestContext): ShortStay[] {
    const existing = shortStaysByHome.get(context.activeHome.homeContextId);
    if (existing)
        return existing;
    const seeded: ShortStay[] = context.activeHome.featureFlagScopeId === 'scope-gv' ? [{
            stayId: 'short-stay-001',
            homeContextId: context.activeHome.homeContextId,
            societyId: context.activeHome.societyId,
            unitId: context.activeHome.unitId,
            platform: 'Airbnb',
            listingIdentifier: 'GV-A1204',
            listingTitle: 'Green Valley family apartment',
            hostOrManager: 'Aarav Mehta',
            societyPolicyStatus: 'approvalRequired',
            approvalRequired: true,
            guestName: 'Nisha Kapoor',
            guestCount: 3,
            kycStatus: 'verified',
            checkInAt: '2026-07-18T08:30:00.000Z',
            checkOutAt: '2026-07-20T05:30:00.000Z',
            vehicleNumber: 'MH 15 AB 2481',
            accessWindowStart: '2026-07-18T08:00:00.000Z',
            accessWindowEnd: '2026-07-20T06:30:00.000Z',
            rulesAcknowledged: true,
            status: 'approved',
            createdAt: '2026-07-12T08:00:00.000Z',
            updatedAt: '2026-07-12T08:00:00.000Z'
        }] : [];
    shortStaysByHome.set(context.activeHome.homeContextId, seeded);
    return seeded;
}
export const residentLifecycleMockSource: ResidentLifecycleRepository = {
    async getFamilyPortabilityPlan(context) {
        const sourceMembers = await residentHouseholdMockSource.getFamilyMembers(context);
        const eligibleTargetContexts = mockResidentHomeContexts
            .filter((home) => home.homeContextId !== context.activeHome.homeContextId && home.status === 'active' && (home.residentRole === 'owner' || home.residentRole === 'coOwner'))
            .map((home) => requestContextForHome(home.homeContextId))
            .filter((target): target is ResidentRepositoryRequestContext => Boolean(target));
        return {
            sourceHomeContextId: context.activeHome.homeContextId,
            sourceMembers,
            eligibleTargetContexts,
            reusableDocuments: sourceMembers.slice(0, 2).map((member, index) => ({ documentId: `portable-document-${index + 1}`, memberId: member.id, title: index === 0 ? 'Identity proof' : 'Profile photo', scope: 'reusable' })),
            missingLocalDocumentTitles: ['Society relationship declaration', 'Local emergency consent']
        };
    },
    async executeFamilyPortability(input: FamilyPortabilityInput): Promise<FamilyPortabilityResult> {
        if (!input.consentConfirmed)
            throw new Error('Consent is required before linking family members.');
        if (input.sourceContext.activeHome.homeContextId === input.targetContext.activeHome.homeContextId)
            throw new Error('Choose a different target residence.');
        const targetHome = mockResidentHomeContexts.find((home) => home.homeContextId === input.targetContext.activeHome.homeContextId);
        if (!targetHome || targetHome.status !== 'active' || (targetHome.residentRole !== 'owner' && targetHome.residentRole !== 'coOwner'))
            throw new Error('Target residence is not eligible.');
        const sourceMembers = await residentHouseholdMockSource.getFamilyMembers(input.sourceContext);
        lifecycleSequence += 1;
        const results = input.familyMemberIds.map((memberId) => {
            const sourceMember = sourceMembers.find((member) => member.id === memberId);
            if (!sourceMember)
                return { sourceFamilyMemberId: memberId, outcome: 'failed' as const, reason: 'Family member is no longer available.' };
            const linked = linkFamilyMemberToHomeContext({ sourceMember, targetContext: input.targetContext, relationToOwner: input.relationToOwner, stayPattern: input.stayPattern, permissions: input.permissions });
            return { sourceFamilyMemberId: memberId, targetFamilyMemberId: linked.member.id, outcome: linked.outcome };
        });
        publishResidentMockNotification({ societyId: input.targetContext.activeHome.societyId, recipientResidentProfileId: 'resident-001', kind: 'familyPortabilityCompleted' });
        return {
            operationId: `family-portability-${lifecycleSequence}`,
            targetHomeContextId: input.targetContext.activeHome.homeContextId,
            results,
            reusableDocumentIds: input.familyMemberIds.map((memberId) => `portable-${memberId}`),
            missingLocalDocumentTitles: ['Society relationship declaration', 'Local emergency consent']
        };
    },
    async getRentalDeclaration(context) {
        return rentalDeclarations.get(context.activeHome.homeContextId) ?? null;
    },
    async submitRentalDeclaration(input: SubmitRentalDeclarationInput) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.effectiveFrom))
            throw new Error('Enter an effective date in YYYY-MM-DD format.');
        if (input.occupancyModel === 'brokerManagedStay' && (!input.managerName?.trim() || !input.managerPhone?.trim()))
            throw new Error('Broker or manager details are required.');
        lifecycleSequence += 1;
        const declaration: RentalDeclaration = {
            declarationId: `rental-declaration-${lifecycleSequence}`,
            homeContextId: input.context.activeHome.homeContextId,
            societyId: input.context.activeHome.societyId,
            unitId: input.context.activeHome.unitId,
            occupancyModel: input.occupancyModel,
            ...includeWhenPresent("managerName", input.managerName?.trim()),
            ...includeWhenPresent("managerPhone", input.managerPhone?.trim()),
            effectiveFrom: input.effectiveFrom,
            status: 'submitted',
            updatedAt: new Date().toISOString()
        };
        rentalDeclarations.set(declaration.homeContextId, declaration);
        publishResidentMockNotification({ societyId: declaration.societyId, recipientResidentProfileId: 'resident-001', kind: 'rentalDeclarationSubmitted' });
        return declaration;
    },
    async listShortStays(context) {
        return [...shortStayState(context)];
    },
    async createShortStay(input: CreateShortStayInput) {
        const policy = policyForContext(input.context);
        if (policy === 'prohibited')
            throw new Error('Short stays are prohibited for this residence.');
        if (!input.rulesAcknowledged)
            throw new Error('Society rules must be acknowledged.');
        if (input.guestCount < 1 || input.guestCount > 20)
            throw new Error('Guest count must be between 1 and 20.');
        if (Date.parse(input.checkOutAt) <= Date.parse(input.checkInAt))
            throw new Error('Check-out must be after check-in.');
        lifecycleSequence += 1;
        const timestamp = new Date().toISOString();
        const stay: ShortStay = {
            stayId: `short-stay-${lifecycleSequence}`,
            homeContextId: input.context.activeHome.homeContextId,
            societyId: input.context.activeHome.societyId,
            unitId: input.context.activeHome.unitId,
            platform: input.platform.trim(),
            listingIdentifier: input.listingIdentifier.trim(),
            listingTitle: input.listingTitle.trim(),
            hostOrManager: input.hostOrManager.trim(),
            societyPolicyStatus: policy,
            approvalRequired: policy === 'approvalRequired',
            guestName: input.guestName.trim(),
            guestCount: input.guestCount,
            kycStatus: 'pending',
            checkInAt: input.checkInAt,
            checkOutAt: input.checkOutAt,
            ...includeWhenPresent("vehicleNumber", input.vehicleNumber?.trim()),
            accessWindowStart: input.checkInAt,
            accessWindowEnd: input.checkOutAt,
            rulesAcknowledged: input.rulesAcknowledged,
            status: policy === 'approvalRequired' ? 'pendingApproval' : 'approved',
            createdAt: timestamp,
            updatedAt: timestamp
        };
        shortStaysByHome.set(stay.homeContextId, [stay, ...shortStayState(input.context)]);
        publishResidentMockNotification({ societyId: stay.societyId, recipientResidentProfileId: 'resident-001', kind: 'shortStayCreated' });
        return stay;
    },
    async updateShortStayStatus(input: UpdateShortStayStatusInput) {
        const stays = shortStayState(input.context);
        const current = stays.find((stay) => stay.stayId === input.stayId);
        if (!current)
            throw new Error('Short stay was not found in this residence.');
        if (input.action === 'extend' && (!input.extendedCheckOutAt || Date.parse(input.extendedCheckOutAt) <= Date.parse(current.checkOutAt)))
            throw new Error('Extended check-out must be later than the current check-out.');
        const nextStatus = input.action === 'approve' ? 'approved' : input.action === 'reject' ? 'rejected' : input.action === 'checkIn' ? 'checkedIn' : input.action === 'checkOut' ? 'completed' : input.action === 'cancel' ? 'cancelled' : current.status;
        const updated: ShortStay = {
            ...current,
            status: nextStatus,
            checkOutAt: input.action === 'extend' && input.extendedCheckOutAt ? input.extendedCheckOutAt : current.checkOutAt,
            accessWindowEnd: input.action === 'extend' && input.extendedCheckOutAt ? input.extendedCheckOutAt : current.accessWindowEnd,
            updatedAt: new Date().toISOString()
        };
        shortStaysByHome.set(current.homeContextId, stays.map((stay) => stay.stayId === updated.stayId ? updated : stay));
        publishResidentMockNotification({ societyId: updated.societyId, recipientResidentProfileId: 'resident-001', kind: 'shortStayStatusChanged' });
        return updated;
    }
};
export function getLifecycleRequestContext(homeContextId: string): ResidentRepositoryRequestContext | Absent {
    return requestContextForHome(homeContextId);
}
export function resetResidentLifecycleMockState(): void {
    rentalDeclarations.clear();
    shortStaysByHome.clear();
    lifecycleSequence = 200;
}

