import { withMockDelay } from '../../../../core/repositories/repository.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { mockCurrentTenant, mockHouseholdOverview, mockTenantEligibilityBlockedByActiveTenant, mockTenantManagementSummary, mockTenantOnboardingBlockedActiveTenant, mockTenantOnboardingBlockedPreviousNoc, mockTenantOnboardingDraft, mockTenantOnboardingSubmitted, residentHouseholdOwnerId, residentHouseholdUnitId, } from './residentHousehold.mockData';
import type { ResidentHouseholdRepository } from './residentHousehold.repository.types';
import type { AddFamilyMemberInput, CancelTenantOnboardingInput, FamilyAccessPermissions, FamilyMember, HouseholdOverview, RemoveFamilyMemberAccessInput, SubmitTenantOnboardingInput, TenantAccessPermissionsInput, TenantAgreementInput, TenantDocumentChecklistItem, TenantDocumentType, TenantManagementSummary, TenantOnboardingRequest, TenantPersonalInfoInput, TenantProfile, UpdateFamilyMemberInput, UploadTenantDocumentInput, FamilyStayPattern } from './residentHousehold.types';
import { defaultTenantAccessPermissions } from './residentHousehold.types';
import { getResidentMockRecords } from '../../mock/residentMockRegistry';
import { enMessages } from '../../../../messages/en';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import { domainEventBus } from '../../../../core/events/DomainEventBus';
import { getCurrentSession } from '../../../../core/auth/sessionStore';
const familyMembersStateByHomeContext = new Map<string, FamilyMember[]>();
let tenantRequestsState: TenantOnboardingRequest[] = [
    cloneTenantRequest(mockTenantOnboardingDraft),
    cloneTenantRequest(mockTenantOnboardingSubmitted),
    cloneTenantRequest(mockTenantOnboardingBlockedActiveTenant),
    cloneTenantRequest(mockTenantOnboardingBlockedPreviousNoc),
];
let tenantState: TenantProfile | null = {
    ...mockCurrentTenant,
    permissions: { ...mockCurrentTenant.permissions },
    documentSummary: mockCurrentTenant.documentSummary.map((document) => ({ ...document }))
};
let isExitInitiatedState = false;
let sequence = 100;
function buildFamilyMembersForContext(context: ResidentRepositoryRequestContext): FamilyMember[] {
    const relations: readonly FamilyMember['relationToOwner'][] = [
        'SPOUSE',
        'SON',
        'DAUGHTER',
        'FATHER',
        'MOTHER',
        'BROTHER',
        'SISTER',
        'OTHER',
    ];
    return getResidentMockRecords(context, 'family').map((record) => ({
        id: record.id,
        homeContextId: record.homeContextId,
        societyId: record.societyId,
        unitId: record.unitId,
        dataScopeKey: record.dataScopeKey,
        fullName: enMessages.resident.mockData.recordTitle(enMessages.resident.mockData.featureLabels.family, record.ordinal + 1, context.activeHome.displayUnitName),
        dateOfBirth: `${record.ordinal % 4 === 0 ? '1955' : record.ordinal % 5 === 0 ? '2015' : '1990'}-01-15`,
        gender: getRequiredItem((['MALE', 'FEMALE', 'OTHER'] as const), record.ordinal % 3, "residentHousehold.mockSource.ts"),
        relationToOwner: getRequiredItem(relations, record.ordinal % relations.length, "residentHousehold.mockSource.ts"),
        phoneNumber: record.ordinal % 5 === 0 ? '' : `92000${String(record.ordinal + 1).padStart(5, '0')}`,
        isEmergencyContact: record.ordinal % 3 === 0,
        isPrimaryOwner: record.ordinal === 0 && context.activeHome.residentRole === 'owner',
        isSeniorCitizen: record.ordinal % 4 === 0,
        isMinor: record.ordinal % 5 === 0,
        bloodGroup: getRequiredItem((['O+', 'A+', 'B+', 'AB+', 'UNKNOWN'] as const), record.ordinal % 5, "residentHousehold.mockSource.ts"),
        accessStatus: record.ordinal % 7 === 0 ? 'PENDING' : 'ACTIVE',
        permissions: {
            visitorApprovalPermission: record.ordinal % 3 !== 0,
            noticeViewPermission: true,
            emergencyAccessPermission: true,
            facilityBookingPermission: record.ordinal % 4 !== 0,
            documentAccessPermission: record.ordinal % 2 === 0 ? 'LIMITED' : 'NONE',
            profileVisibility: record.ordinal % 5 === 0 ? 'HIDDEN' : 'HOUSEHOLD_ONLY'
        },
        createdAt: record.createdAtIso,
        updatedAt: record.updatedAtIso
    }));
}
function getFamilyMembersState(context: ResidentRepositoryRequestContext = resolveRequestContext()): FamilyMember[] {
    const existing = familyMembersStateByHomeContext.get(context.activeHome.homeContextId);
    if (existing) {
        return existing;
    }
    const created = buildFamilyMembersForContext(context);
    familyMembersStateByHomeContext.set(context.activeHome.homeContextId, created);
    return created;
}
function setCurrentFamilyMembersState(members: FamilyMember[]): void {
    const context = resolveRequestContext();
    familyMembersStateByHomeContext.set(context.activeHome.homeContextId, members);
}
function nowIso(): string {
    return new Date().toISOString();
}
function cloneDocument(document: TenantDocumentChecklistItem): TenantDocumentChecklistItem {
    return {
        ...document,
        ...includeWhenPresent("metadata", document.metadata
            ? {
                ...document.metadata,
                mockAccessLog: document.metadata.mockAccessLog.map((entry) => ({ ...entry }))
            }
            : undefined)
    };
}
function cloneTenantRequest(request: TenantOnboardingRequest): TenantOnboardingRequest {
    return {
        ...request,
        ...includeWhenPresent("personalInfo", request.personalInfo ? { ...request.personalInfo } : undefined),
        ...includeWhenPresent("agreement", request.agreement ? { ...request.agreement } : undefined),
        documents: request.documents.map(cloneDocument),
        accessPermissions: { ...request.accessPermissions },
        eligibility: {
            ...request.eligibility,
            checks: request.eligibility.checks.map((check) => ({ ...check }))
        },
        timeline: request.timeline.map((item) => ({ ...item }))
    };
}
function buildOverview(context: ResidentRepositoryRequestContext): HouseholdOverview {
    const familyMembersState = getFamilyMembersState(context);
    return {
        ...mockHouseholdOverview,
        unitId: context.activeHome.unitId,
        societyName: context.activeHome.societyName,
        unitLabel: context.activeHome.displayUnitName,
        familyMemberCount: familyMembersState.length,
        activeFamilyAccessCount: familyMembersState.filter((member) => member.accessStatus === 'ACTIVE').length,
        emergencyContactCount: familyMembersState.filter((member) => member.isEmergencyContact).length,
        currentTenantCount: tenantState ? 1 : 0,
        pendingTenantRequestCount: tenantRequestsState.filter((request) => request.status !== 'CANCELLED').length
    };
}
function findFamilyMember(familyMemberId: string): FamilyMember {
    const familyMembersState = getFamilyMembersState();
    const member = familyMembersState.find((item) => item.id === familyMemberId);
    if (!member) {
        throw new Error('resident.household.errors.familyMemberNotFound');
    }
    return member;
}
function findTenantRequest(requestId: string): TenantOnboardingRequest {
    const request = tenantRequestsState.find((item) => item.id === requestId);
    if (!request) {
        throw new Error('resident.household.errors.tenantRequestNotFound');
    }
    return request;
}
function toFamilyMember(input: AddFamilyMemberInput): FamilyMember {
    const timestamp = nowIso();
    const context = resolveRequestContext();
    sequence += 1;
    return {
        id: `family-member-${sequence}`,
        homeContextId: context.activeHome.homeContextId,
        societyId: context.activeHome.societyId,
        unitId: context.activeHome.unitId,
        dataScopeKey: context.dataScopeKey,
        fullName: input.fullName.trim(),
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        relationToOwner: input.relationToOwner,
        phoneNumber: input.phoneNumber.trim(),
        ...includeWhenPresent("emailAddress", input.emailAddress?.trim()),
        ...includeWhenPresent("photoMockUri", input.photoMockUri),
        isEmergencyContact: input.isEmergencyContact,
        isPrimaryOwner: false,
        isSeniorCitizen: input.isSeniorCitizen,
        isMinor: input.isMinor,
        ...includeWhenPresent("bloodGroup", input.bloodGroup),
        ...includeWhenPresent("medicalNotes", input.medicalNotes),
        accessStatus: input.accessStatus,
        permissions: {
            visitorApprovalPermission: input.visitorApprovalPermission,
            noticeViewPermission: input.noticeViewPermission,
            emergencyAccessPermission: input.emergencyAccessPermission,
            facilityBookingPermission: input.facilityBookingPermission,
            documentAccessPermission: input.documentAccessPermission,
            profileVisibility: input.profileVisibility
        },
        createdAt: timestamp,
        updatedAt: timestamp
    };
}
function applyFamilyInput(member: FamilyMember, input: UpdateFamilyMemberInput): FamilyMember {
    return {
        ...member,
        fullName: input.fullName.trim(),
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        relationToOwner: input.relationToOwner,
        phoneNumber: input.phoneNumber.trim(),
        ...includeWhenPresent("emailAddress", input.emailAddress?.trim()),
        ...includeWhenPresent("photoMockUri", input.photoMockUri),
        isEmergencyContact: input.isEmergencyContact,
        isSeniorCitizen: input.isSeniorCitizen,
        isMinor: input.isMinor,
        ...includeWhenPresent("bloodGroup", input.bloodGroup),
        ...includeWhenPresent("medicalNotes", input.medicalNotes),
        accessStatus: input.accessStatus,
        permissions: {
            visitorApprovalPermission: input.visitorApprovalPermission,
            noticeViewPermission: input.noticeViewPermission,
            emergencyAccessPermission: input.emergencyAccessPermission,
            facilityBookingPermission: input.facilityBookingPermission,
            documentAccessPermission: input.documentAccessPermission,
            profileVisibility: input.profileVisibility
        },
        updatedAt: nowIso()
    };
}
function updateRequest(request: TenantOnboardingRequest): TenantOnboardingRequest {
    tenantRequestsState = tenantRequestsState.map((item) => (item.id === request.id ? cloneTenantRequest(request) : item));
    return cloneTenantRequest(request);
}
function createChecklist(): TenantDocumentChecklistItem[] {
    return [
        { documentType: 'RENT_AGREEMENT', status: 'MISSING', required: true },
        { documentType: 'TENANT_KYC', status: 'MISSING', required: true },
        { documentType: 'POLICE_VERIFICATION', status: 'MISSING', required: true },
        { documentType: 'OWNER_CONSENT', status: 'MISSING', required: true },
        { documentType: 'TENANT_PHOTO', status: 'MISSING', required: true },
        { documentType: 'MOVE_IN_FORM', status: 'MISSING', required: true },
        { documentType: 'VEHICLE_DETAILS', status: 'MISSING', required: false },
        { documentType: 'RULE_ACKNOWLEDGEMENT', status: 'MISSING', required: true },
    ];
}
function updateDocument(documents: TenantDocumentChecklistItem[], requestId: string, input: UploadTenantDocumentInput): TenantDocumentChecklistItem[] {
    return documents.map((document) => {
        if (document.documentType !== input.documentType) {
            return document;
        }
        const timestamp = nowIso();
        return {
            ...document,
            status: 'UPLOADED',
            metadata: {
                documentId: `${requestId}-${input.documentType.toLowerCase()}-${sequence}`,
                documentType: input.documentType,
                ownerEntityType: 'tenant',
                ownerEntityId: requestId,
                visibility: input.documentType === 'OWNER_CONSENT' ? 'OWNER_AND_ADMIN_ONLY' : 'TENANT_SELF_AND_ADMIN',
                sensitivity: input.documentType === 'VEHICLE_DETAILS' ? 'MEDIUM' : 'HIGH',
                verificationStatus: 'UPLOADED',
                ...includeWhenPresent("expiryDate", input.expiryDate),
                uploadedAt: timestamp,
                uploadedBy: input.uploadedBy,
                accessControlledNoteKey: 'resident.tenant.documents.accessControlledNote',
                mockAccessLog: [
                    {
                        id: `${requestId}-access-log-${sequence}`,
                        documentId: `${requestId}-${input.documentType.toLowerCase()}-${sequence}`,
                        viewedBy: input.uploadedBy,
                        viewedAt: timestamp,
                        purposeKey: 'resident.tenant.documents.mockUploadAuditPurpose'
                    },
                ]
            }
        };
    });
}
function hasUploadedDocument(documents: TenantDocumentChecklistItem[], documentType: TenantDocumentType): boolean {
    const document = documents.find((item) => item.documentType === documentType);
    return document?.status === 'UPLOADED' || document?.status === 'PENDING_VERIFICATION' || document?.status === 'VERIFIED';
}
export function resetResidentHouseholdMockState() {
    familyMembersStateByHomeContext.clear();
    tenantRequestsState = [
        cloneTenantRequest(mockTenantOnboardingDraft),
        cloneTenantRequest(mockTenantOnboardingSubmitted),
        cloneTenantRequest(mockTenantOnboardingBlockedActiveTenant),
        cloneTenantRequest(mockTenantOnboardingBlockedPreviousNoc),
    ];
    tenantState = {
        ...mockCurrentTenant,
        permissions: { ...mockCurrentTenant.permissions },
        documentSummary: mockCurrentTenant.documentSummary.map((document) => ({ ...document }))
    };
    sequence = 100;
}
export function linkFamilyMemberToHomeContext(input: {
    sourceMember: FamilyMember;
    targetContext: ResidentRepositoryRequestContext;
    relationToOwner: FamilyMember['relationToOwner'];
    stayPattern: FamilyStayPattern;
    permissions: FamilyAccessPermissions;
}): {
    member: FamilyMember;
    outcome: 'linkedExistingPerson' | 'copiedNewPerson' | 'alreadyLinked';
} {
    const targetMembers = getFamilyMembersState(input.targetContext);
    const personProfileId = input.sourceMember.personProfileId ?? `person-${input.sourceMember.id}`;
    const exactLink = targetMembers.find((member) => member.personProfileId === personProfileId);
    if (exactLink)
        return { member: exactLink, outcome: 'alreadyLinked' };
    const matchingPerson = targetMembers.find((member) => Boolean(input.sourceMember.phoneNumber) && member.phoneNumber === input.sourceMember.phoneNumber);
    const timestamp = nowIso();
    sequence += 1;
    const linked: FamilyMember = {
        ...input.sourceMember,
        id: `family-member-${sequence}`,
        personProfileId: matchingPerson?.personProfileId ?? personProfileId,
        homeContextId: input.targetContext.activeHome.homeContextId,
        societyId: input.targetContext.activeHome.societyId,
        unitId: input.targetContext.activeHome.unitId,
        dataScopeKey: input.targetContext.dataScopeKey,
        relationToOwner: input.relationToOwner,
        stayPattern: input.stayPattern,
        permissions: { ...input.permissions },
        isPrimaryOwner: false,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    familyMembersStateByHomeContext.set(input.targetContext.activeHome.homeContextId, [...targetMembers, linked]);
    return { member: linked, outcome: matchingPerson ? 'linkedExistingPerson' : 'copiedNewPerson' };
}
export const residentHouseholdMockSource: ResidentHouseholdRepository = {
    async getHouseholdOverview(context?: ResidentRepositoryRequestContext) {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const role = ctx.activeHome.residentRole;
        const familyMembersState = getFamilyMembersState(ctx);
        if (role === 'familyMember') {
            return {
                ...mockHouseholdOverview,
                familyMemberCount: familyMembersState.length,
                activeFamilyAccessCount: familyMembersState.filter((member) => member.accessStatus === 'ACTIVE').length,
                emergencyContactCount: familyMembersState.filter((member) => member.isEmergencyContact).length,
                currentTenantCount: 0,
                pendingTenantRequestCount: 0
            };
        }
        if (role === 'tenant') {
            return {
                ...mockHouseholdOverview,
                familyMemberCount: 0,
                activeFamilyAccessCount: 0,
                emergencyContactCount: 0,
                currentTenantCount: tenantState ? 1 : 0,
                pendingTenantRequestCount: 0
            };
        }
        return buildOverview(ctx);
    },
    async getFamilyMembers(context?: ResidentRepositoryRequestContext) {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        if (ctx.activeHome.residentRole === 'tenant') {
            return [];
        }
        const familyMembersState = getFamilyMembersState(ctx);
        return familyMembersState.map((member) => ({ ...member, permissions: { ...member.permissions } }));
    },
    async getFamilyMemberById(familyMemberId: string) {
        await withMockDelay();
        const member = findFamilyMember(familyMemberId);
        return { ...member, permissions: { ...member.permissions } };
    },
    async addFamilyMember(input: AddFamilyMemberInput) {
        await withMockDelay();
        const member = toFamilyMember(input);
        setCurrentFamilyMembersState([...getFamilyMembersState(), member]);

        const session = getCurrentSession();
        const actorName = session?.name ?? 'Household Admin';
        const actorId = session?.userId ?? 'usr-rohan-01';

        void domainEventBus.emit({
            eventId: `evt-fam-add-${member.id}`,
            eventType: 'household.member.invited',
            societyId: member.societyId ?? 'soc-palm-grove-01',
            unitId: member.unitId ?? 'unit-b804',
            actor: {
                userId: actorId,
                personId: actorId,
                displayName: actorName,
                role: session?.role ?? 'RESIDENT_OWNER',
            },
            subject: {
                entityType: 'FamilyMember',
                entityId: member.id,
            },
            severity: 'INFO',
            createdAtIso: nowIso(),
            correlationId: `corr-${member.id}`,
            payload: {
                memberName: member.fullName,
                relation: member.relationToOwner,
            },
        });

        return { ...member, permissions: { ...member.permissions } };
    },
    async updateFamilyMember(familyMemberId: string, input: UpdateFamilyMemberInput) {
        await withMockDelay();
        const current = findFamilyMember(familyMemberId);
        const updated = applyFamilyInput(current, input);
        setCurrentFamilyMembersState(getFamilyMembersState().map((member) => (member.id === familyMemberId ? updated : member)));
        return { ...updated, permissions: { ...updated.permissions } };
    },
    async updateFamilyMemberPermissions(familyMemberId: string, input: FamilyAccessPermissions) {
        await withMockDelay();
        const current = findFamilyMember(familyMemberId);
        const updated: FamilyMember = {
            ...current,
            permissions: { ...input },
            updatedAt: nowIso()
        };
        setCurrentFamilyMembersState(getFamilyMembersState().map((member) => (member.id === familyMemberId ? updated : member)));

        const session = getCurrentSession();
        const actorName = session?.name ?? 'Household Admin';
        const actorId = session?.userId ?? 'usr-rohan-01';

        void domainEventBus.emit({
            eventId: `evt-fam-perm-${familyMemberId}`,
            eventType: 'household.permissions.changed',
            societyId: updated.societyId ?? 'soc-palm-grove-01',
            unitId: updated.unitId ?? 'unit-b804',
            actor: {
                userId: actorId,
                personId: actorId,
                displayName: actorName,
                role: session?.role ?? 'RESIDENT_OWNER',
            },
            subject: {
                entityType: 'FamilyMember',
                entityId: familyMemberId,
            },
            severity: 'INFO',
            createdAtIso: nowIso(),
            correlationId: `corr-${familyMemberId}`,
            payload: {
                memberName: updated.fullName,
                permissions: updated.permissions,
            },
        });

        return { ...updated, permissions: { ...updated.permissions } };
    },
    async removeFamilyMemberAccess(familyMemberId: string, _input: RemoveFamilyMemberAccessInput) {
        await withMockDelay();
        const current = findFamilyMember(familyMemberId);
        if (current.isPrimaryOwner) {
            throw new Error('resident.validation.family.primaryOwnerCannotBeRemoved');
        }
        const updated: FamilyMember = {
            ...current,
            accessStatus: 'INACTIVE',
            permissions: {
                ...current.permissions,
                visitorApprovalPermission: false,
                facilityBookingPermission: false,
                documentAccessPermission: 'NONE'
            },
            updatedAt: nowIso()
        };
        setCurrentFamilyMembersState(getFamilyMembersState().map((member) => (member.id === familyMemberId ? updated : member)));

        const session = getCurrentSession();
        const actorName = session?.name ?? 'Household Admin';
        const actorId = session?.userId ?? 'usr-rohan-01';

        void domainEventBus.emit({
            eventId: `evt-fam-rem-${familyMemberId}`,
            eventType: 'household.member.removed',
            societyId: updated.societyId ?? 'soc-palm-grove-01',
            unitId: updated.unitId ?? 'unit-b804',
            actor: {
                userId: actorId,
                personId: actorId,
                displayName: actorName,
                role: session?.role ?? 'RESIDENT_OWNER',
            },
            subject: {
                entityType: 'FamilyMember',
                entityId: familyMemberId,
            },
            severity: 'WARNING',
            createdAtIso: nowIso(),
            correlationId: `corr-${familyMemberId}`,
            payload: {
                memberName: updated.fullName,
            },
        });

        return { ...updated, permissions: { ...updated.permissions } };
    },
    async getTenantManagementSummary(context?: ResidentRepositoryRequestContext) {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        if (ctx.activeHome.residentRole !== 'owner') {
            return {
                unitId: ctx.activeHome.unitId,
                currentTenant: null,
                activeRequest: null
            };
        }
        const activeRequest = tenantRequestsState.find((request) => request.status !== 'CANCELLED') ?? null;
        const summary: TenantManagementSummary = {
            ...mockTenantManagementSummary,
            currentTenant: tenantState
                ? {
                    ...tenantState,
                    permissions: { ...tenantState.permissions },
                    documentSummary: tenantState.documentSummary.map((document) => ({ ...document }))
                }
                : null,
            activeRequest: activeRequest ? cloneTenantRequest(activeRequest) : null,
            isExitInitiated: isExitInitiatedState
        };
        return summary;
    },
    async runTenantEligibilityCheck() {
        await withMockDelay();
        if (tenantState) {
            return {
                ...mockTenantEligibilityBlockedByActiveTenant,
                checks: mockTenantEligibilityBlockedByActiveTenant.checks.map((check) => ({ ...check }))
            };
        }
        return {
            ...mockTenantOnboardingDraft.eligibility,
            checks: mockTenantOnboardingDraft.eligibility.checks.map((check) => ({ ...check }))
        };
    },
    async createTenantOnboardingDraft() {
        await withMockDelay();
        sequence += 1;
        const eligibility = await residentHouseholdMockSource.runTenantEligibilityCheck();
        const timestamp = nowIso();
        const request: TenantOnboardingRequest = {
            id: `tenant-request-${sequence}`,
            unitId: residentHouseholdUnitId,
            createdByResidentId: residentHouseholdOwnerId,
            status: eligibility.canStartOnboarding ? 'DRAFT' : 'BLOCKED',
            documents: createChecklist(),
            accessPermissions: { ...defaultTenantAccessPermissions },
            eligibility,
            timeline: [
                {
                    status: eligibility.canStartOnboarding ? 'DRAFT' : 'BLOCKED',
                    occurredAt: timestamp,
                    responsiblePartyKey: 'resident.tenant.status.owner',
                    nextActionKey: eligibility.canStartOnboarding
                        ? 'resident.tenant.status.nextPersonalInfo'
                        : 'resident.tenant.status.resolveBlockingReason',
                    ...includeWhenPresent("blockingReasonKey", eligibility.canStartOnboarding ? undefined : 'resident.tenant.blocked.activeTenant')
                },
            ],
            ...includeWhenPresent("blockingReasonKey", eligibility.canStartOnboarding ? undefined : 'resident.tenant.blocked.activeTenant'),
            createdAt: timestamp,
            updatedAt: timestamp
        };
        tenantRequestsState = [request, ...tenantRequestsState];
        return cloneTenantRequest(request);
    },
    async updateTenantPersonalInfo(requestId: string, input: TenantPersonalInfoInput) {
        await withMockDelay();
        const request = findTenantRequest(requestId);
        return updateRequest({ ...request, personalInfo: { ...input }, updatedAt: nowIso() });
    },
    async updateTenantAgreementInfo(requestId: string, input: TenantAgreementInput) {
        await withMockDelay();
        const request = findTenantRequest(requestId);
        return updateRequest({ ...request, agreement: { ...input }, updatedAt: nowIso() });
    },
    async uploadTenantDocumentMock(requestId: string, input: UploadTenantDocumentInput) {
        await withMockDelay();
        sequence += 1;
        const request = findTenantRequest(requestId);
        const documents = updateDocument(request.documents, requestId, input);
        const status = hasUploadedDocument(documents, 'RENT_AGREEMENT') ? 'DOCUMENTS_UPLOADED' : request.status;
        return updateRequest({
            ...request,
            documents,
            status,
            timeline: [
                ...request.timeline,
                {
                    status,
                    occurredAt: nowIso(),
                    responsiblePartyKey: 'resident.tenant.status.owner',
                    nextActionKey: 'resident.tenant.status.nextDocumentVerification'
                },
            ],
            updatedAt: nowIso()
        });
    },
    async updateTenantAccessPermissions(requestId: string, input: TenantAccessPermissionsInput) {
        await withMockDelay();
        const request = findTenantRequest(requestId);
        return updateRequest({ ...request, accessPermissions: { ...input }, updatedAt: nowIso() });
    },
    async submitTenantOnboardingRequest(requestId: string, input: SubmitTenantOnboardingInput) {
        await withMockDelay();
        const request = findTenantRequest(requestId);
        if (!input.ownerConsentConfirmed || !input.responsibilityAccepted || !request.eligibility.canStartOnboarding) {
            return updateRequest({
                ...request,
                status: 'BLOCKED',
                blockingReasonKey: 'resident.tenant.blocked.reviewIncomplete',
                updatedAt: nowIso()
            });
        }
        const timestamp = nowIso();
        return updateRequest({
            ...request,
            status: 'SUBMITTED_BY_OWNER',
            submittedAt: timestamp,
            timeline: [
                ...request.timeline,
                {
                    status: 'SUBMITTED_BY_OWNER',
                    occurredAt: timestamp,
                    responsiblePartyKey: 'resident.tenant.status.owner',
                    nextActionKey: 'resident.tenant.status.nextAdminReview'
                },
            ],
            updatedAt: timestamp
        });
    },
    async getTenantOnboardingRequestById(requestId: string) {
        await withMockDelay();
        return cloneTenantRequest(findTenantRequest(requestId));
    },
    async getCurrentTenant() {
        await withMockDelay();
        return tenantState
            ? {
                ...tenantState,
                permissions: { ...tenantState.permissions },
                documentSummary: tenantState.documentSummary.map((document) => ({ ...document }))
            }
            : null;
    },
    async getTenantById(tenantId: string) {
        await withMockDelay();
        if (!tenantState || tenantState.id !== tenantId) {
            throw new Error('resident.household.errors.tenantNotFound');
        }
        return {
            ...tenantState,
            permissions: { ...tenantState.permissions },
            documentSummary: tenantState.documentSummary.map((document) => ({ ...document }))
        };
    },
    async cancelTenantOnboardingRequest(requestId: string, _input: CancelTenantOnboardingInput) {
        await withMockDelay();
        const request = findTenantRequest(requestId);
        return updateRequest({
            ...request,
            status: 'CANCELLED',
            timeline: [
                ...request.timeline,
                {
                    status: 'CANCELLED',
                    occurredAt: nowIso(),
                    responsiblePartyKey: 'resident.tenant.status.owner',
                    nextActionKey: 'resident.tenant.status.nextCreateFreshRequest'
                },
            ],
            updatedAt: nowIso()
        });
    },
    async initiateTenantExit() {
        await withMockDelay();
        isExitInitiatedState = true;
    },
    async completeTenantExit() {
        await withMockDelay();
        isExitInitiatedState = false;
        tenantState = null;
    }
};

