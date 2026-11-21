import { residenceDocumentTypeLabels, residenceAccessMessages } from '../../../messages/en/residenceAccess.messages';
import type { OwnerConsentRequest, ResidenceAccessAppeal, ResidenceAccessBlocker, ResidenceAccessDecision, ResidenceAccessNotification, ResidenceAccessRecord, ResidenceAccessStatus, ResidenceAccessTimelineEvent, ResidenceApprovalReminder, ResidenceDocument, ResidenceDocumentRequirement, ResidenceDocumentType, ResidenceDocumentVerificationStatus, ResidenceFeatureRestriction, ResidenceReactivationRequest, ResidenceRole, ResidenceSummary, ResidenceSuspensionRecord, SocietyAccessReviewTask, } from '../models/residenceAccess.types';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
export const mockResidenceAccessUsers = {
    defaultUserId: 'resident-001',
    noActiveUserId: 'resident-no-active',
    emptyUserId: 'resident-empty'
} as const;
interface ResidenceSeed {
    readonly id: string;
    readonly userId?: string;
    readonly societyId: string;
    readonly societyName: string;
    readonly unitId: string;
    readonly unitNumber: string;
    readonly buildingName: string;
    readonly wingName?: string;
    readonly city: string;
    readonly role: ResidenceRole;
    readonly status: ResidenceAccessStatus;
    readonly blockers: readonly ResidenceAccessBlocker[];
    readonly reason: string;
    readonly residentPendingActions: readonly string[];
    readonly societyPendingActions: readonly string[];
    readonly completedSteps: readonly string[];
    readonly updatedAt: string;
    readonly submittedAt?: string;
    readonly expectedReviewAt?: string;
    readonly effectiveFrom?: string;
    readonly effectiveUntil?: string;
    readonly homeContextId?: string;
    readonly canWithdraw?: boolean;
    readonly correctionAllowed?: boolean;
    readonly correctionDeadline?: string;
    readonly appealAllowed?: boolean;
    readonly reactivationAllowed?: boolean;
    readonly reminderCooldownHours?: number;
    readonly featureRestrictions?: readonly ResidenceFeatureRestriction[];
    readonly imageUri: string;
}
const seeds: readonly ResidenceSeed[] = [
    {
        id: 'access-active-owner',
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        unitId: 'unit-gv-a-1204',
        unitNumber: 'A-1204',
        buildingName: 'Tower A',
        wingName: 'East Wing',
        city: 'Nashik',
        role: 'OWNER',
        status: 'ACTIVE',
        blockers: [],
        reason: residenceAccessMessages.seed.activeOwnerReason,
        residentPendingActions: [],
        societyPendingActions: [],
        completedSteps: ['Identity verified', 'Ownership verified', 'Society approval complete', 'Access activated'],
        updatedAt: '2026-07-16T08:30:00.000Z',
        effectiveFrom: '2024-01-01T00:00:00.000Z',
        homeContextId: 'context-001',
        imageUri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-active-family',
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        unitId: 'unit-gv-b-804',
        unitNumber: 'B-804',
        buildingName: 'Tower B',
        wingName: 'West Wing',
        city: 'Nashik',
        role: 'FAMILY_MEMBER',
        status: 'ACTIVE',
        blockers: [],
        reason: residenceAccessMessages.seed.activeFamilyReason,
        residentPendingActions: [],
        societyPendingActions: [],
        completedSteps: ['Relationship verified', 'Owner consent received', 'Access activated'],
        updatedAt: '2026-07-15T14:10:00.000Z',
        effectiveFrom: '2026-01-10T00:00:00.000Z',
        homeContextId: 'context-002',
        imageUri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-documents-required',
        societyId: 'society-gp',
        societyName: 'Gokhale Park Residency',
        unitId: 'unit-gp-c-503',
        unitNumber: 'C-503',
        buildingName: 'Building C',
        city: 'Nashik',
        role: 'TENANT',
        status: 'DOCUMENTS_REQUIRED',
        blockers: ['MANDATORY_DOCUMENT_MISSING', 'POLICE_VERIFICATION_PENDING'],
        reason: residenceAccessMessages.seed.documentsRequiredReason,
        residentPendingActions: ['Upload the registered rent agreement', 'Complete Tenant KYC', 'Upload police verification'],
        societyPendingActions: ['Review the request after all mandatory documents are submitted'],
        completedSteps: ['Mobile number verified', 'Residence selected', 'Identity details confirmed'],
        updatedAt: '2026-07-16T06:45:00.000Z',
        canWithdraw: true,
        imageUri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-document-correction',
        societyId: 'society-lp',
        societyName: 'Lakeview Promenade',
        unitId: 'unit-lp-f-702',
        unitNumber: 'F-702',
        buildingName: 'Lake Tower',
        city: 'Pune',
        role: 'TENANT',
        status: 'DOCUMENT_CHANGES_REQUIRED',
        blockers: ['DOCUMENT_REJECTED', 'DOCUMENT_UNREADABLE'],
        reason: residenceAccessMessages.seed.rejectedDocumentReason,
        residentPendingActions: ['Replace the unreadable rent agreement', 'Review and resubmit the corrected request'],
        societyPendingActions: ['Review the corrected document version'],
        completedSteps: ['Identity verified', 'Tenant KYC verified', 'Police verification verified'],
        updatedAt: '2026-07-15T12:20:00.000Z',
        submittedAt: '2026-07-13T09:15:00.000Z',
        correctionAllowed: true,
        correctionDeadline: '2026-07-29T18:30:00.000Z',
        appealAllowed: true,
        imageUri: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-owner-consent',
        societyId: 'society-re',
        societyName: 'Riverstone Enclave',
        unitId: 'unit-re-d-602',
        unitNumber: 'D-602',
        buildingName: 'Riverstone Tower',
        city: 'Mumbai',
        role: 'TENANT',
        status: 'OWNER_CONSENT_REQUIRED',
        blockers: ['OWNER_CONSENT_MISSING'],
        reason: residenceAccessMessages.seed.ownerConsentReason,
        residentPendingActions: ['Send a secure consent request to the registered owner'],
        societyPendingActions: ['Verify the tenancy after owner consent is received'],
        completedSteps: ['Identity verified', 'Tenant documents uploaded'],
        updatedAt: '2026-07-14T10:05:00.000Z',
        canWithdraw: true,
        imageUri: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-approval-pending',
        societyId: 'society-ra',
        societyName: 'Rohan Ananta',
        unitId: 'unit-ra-p-1102',
        unitNumber: 'P-1102',
        buildingName: 'Phase 3',
        city: 'Pune',
        role: 'OWNER',
        status: 'SOCIETY_APPROVAL_PENDING',
        blockers: ['ADMIN_REVIEW_PENDING'],
        reason: residenceAccessMessages.seed.approvalPendingReason,
        residentPendingActions: [],
        societyPendingActions: ['Complete committee review', 'Publish an access decision'],
        completedSteps: ['Request submitted', 'Identity verified', 'Ownership document verified'],
        updatedAt: '2026-07-16T10:42:00.000Z',
        submittedAt: '2026-07-16T10:42:00.000Z',
        expectedReviewAt: '2026-07-18T18:30:00.000Z',
        canWithdraw: true,
        imageUri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-rejected-family',
        societyId: 'society-ec',
        societyName: 'Emerald Court',
        unitId: 'unit-ec-a-303',
        unitNumber: 'A-303',
        buildingName: 'Block A',
        city: 'Pune',
        role: 'FAMILY_MEMBER',
        status: 'REJECTED',
        blockers: ['DOCUMENT_NAME_MISMATCH', 'PROFILE_DATA_MISMATCH'],
        reason: residenceAccessMessages.seed.rejectedFamilyReason,
        residentPendingActions: ['Replace relationship proof', 'Confirm the selected relationship', 'Resubmit before the correction deadline'],
        societyPendingActions: [],
        completedSteps: ['Identity verified', 'Owner consent received'],
        updatedAt: '2026-07-14T13:30:00.000Z',
        submittedAt: '2026-07-10T11:20:00.000Z',
        correctionAllowed: true,
        correctionDeadline: '2026-07-31T18:30:00.000Z',
        appealAllowed: true,
        imageUri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-expired-tenant',
        societyId: 'society-sr',
        societyName: 'Skyline Residency',
        unitId: 'unit-sr-b-905',
        unitNumber: 'B-905',
        buildingName: 'Tower B',
        city: 'Mumbai',
        role: 'TENANT',
        status: 'EXPIRED',
        blockers: ['TENANCY_PERIOD_EXPIRED', 'DOCUMENT_EXPIRED'],
        reason: residenceAccessMessages.seed.expiredTenantReason,
        residentPendingActions: ['Upload the renewed rent agreement', 'Submit a reactivation request'],
        societyPendingActions: ['Verify the renewed tenancy after submission'],
        completedSteps: ['Previous occupancy verified', 'Previous access period completed'],
        updatedAt: '2026-06-30T18:30:00.000Z',
        effectiveFrom: '2025-07-01T00:00:00.000Z',
        effectiveUntil: '2026-06-30T18:29:59.000Z',
        reactivationAllowed: true,
        imageUri: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-suspended-owner',
        societyId: 'society-oh',
        societyName: 'Orchid Habitat',
        unitId: 'unit-oh-c-704',
        unitNumber: 'C-704',
        buildingName: 'Orchid Tower',
        city: 'Pune',
        role: 'OWNER',
        status: 'SUSPENDED',
        blockers: ['DUPLICATE_ACTIVE_OCCUPANCY', 'SUSPENDED_BY_SOCIETY'],
        reason: residenceAccessMessages.seed.suspendedOwnerReason,
        residentPendingActions: ['Upload occupancy clarification', 'Submit a manual review request'],
        societyPendingActions: ['Resolve the duplicate occupancy review'],
        completedSteps: ['Identity verified', 'Ownership previously verified', 'Access previously active'],
        updatedAt: '2026-07-14T08:00:00.000Z',
        expectedReviewAt: '2026-07-21T18:30:00.000Z',
        reactivationAllowed: true,
        imageUri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-restricted',
        societyId: 'society-pgh',
        societyName: 'Palm Grove Heights',
        unitId: 'unit-pgh-p-702',
        unitNumber: 'P-702',
        buildingName: 'Palm Tower',
        city: 'Mumbai',
        role: 'AUTHORIZED_OCCUPANT',
        status: 'TEMPORARILY_RESTRICTED',
        blockers: [],
        reason: residenceAccessMessages.seed.restrictedReason,
        residentPendingActions: [],
        societyPendingActions: ['Complete the feature-level policy review'],
        completedSteps: ['Residence access remains active'],
        updatedAt: '2026-07-15T08:45:00.000Z',
        homeContextId: 'context-006',
        featureRestrictions: [
            {
                feature: 'VISITOR_APPROVAL',
                reason: 'Visitor approvals are paused during a security policy review.',
                restrictedAt: '2026-07-15T08:45:00.000Z',
                expectedReviewAt: '2026-07-18T18:30:00.000Z'
            },
            {
                feature: 'FACILITY_BOOKING',
                reason: 'New facility bookings are paused until the policy review finishes.',
                restrictedAt: '2026-07-15T08:45:00.000Z',
                expectedReviewAt: '2026-07-18T18:30:00.000Z'
            },
        ],
        imageUri: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-future-tenant',
        societyId: 'society-mh',
        societyName: 'Maple Heights',
        unitId: 'unit-mh-t-1603',
        unitNumber: 'T-1603',
        buildingName: 'Maple Tower',
        city: 'Pune',
        role: 'TENANT',
        status: 'APPROVED',
        blockers: [],
        reason: residenceAccessMessages.seed.futureReason,
        residentPendingActions: [],
        societyPendingActions: ['Activate permissions on the effective move-in date'],
        completedSteps: ['Identity verified', 'Documents verified', 'Owner consent received', 'Society approval complete'],
        updatedAt: '2026-07-16T09:20:00.000Z',
        submittedAt: '2026-07-12T11:00:00.000Z',
        effectiveFrom: '2026-07-22T00:00:00.000Z',
        effectiveUntil: '2027-07-21T18:29:59.000Z',
        homeContextId: 'context-008',
        imageUri: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-inactive-owner',
        societyId: 'society-cg',
        societyName: 'Cedar Gardens',
        unitId: 'unit-cg-a-401',
        unitNumber: 'A-401',
        buildingName: 'Cedar Block',
        city: 'Nashik',
        role: 'OWNER',
        status: 'INACTIVE',
        blockers: [],
        reason: residenceAccessMessages.seed.inactiveReason,
        residentPendingActions: [],
        societyPendingActions: [],
        completedSteps: ['Occupancy history retained', 'Unit transfer completed'],
        updatedAt: '2026-05-31T12:00:00.000Z',
        effectiveFrom: '2019-03-01T00:00:00.000Z',
        effectiveUntil: '2026-05-31T11:59:59.000Z',
        reactivationAllowed: false,
        imageUri: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-revoked-family',
        societyId: 'society-vw',
        societyName: 'Veridian Woods',
        unitId: 'unit-vw-b-202',
        unitNumber: 'B-202',
        buildingName: 'Willow Wing',
        city: 'Mumbai',
        role: 'FAMILY_MEMBER',
        status: 'ACCESS_REVOKED',
        blockers: ['REVOKED_BY_OWNER'],
        reason: residenceAccessMessages.seed.revokedReason,
        residentPendingActions: [],
        societyPendingActions: [],
        completedSteps: ['Previous family access retained in history'],
        updatedAt: '2026-07-01T07:30:00.000Z',
        appealAllowed: false,
        imageUri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-reactivation-review',
        societyId: 'society-ss',
        societyName: 'Silver Springs',
        unitId: 'unit-ss-a-1008',
        unitNumber: 'A-1008',
        buildingName: 'Spring Tower',
        city: 'Pune',
        role: 'TENANT',
        status: 'SOCIETY_APPROVAL_PENDING',
        blockers: ['ADMIN_REVIEW_PENDING'],
        reason: residenceAccessMessages.seed.reactivationReason,
        residentPendingActions: [],
        societyPendingActions: ['Review the renewed tenancy', 'Approve or reject reactivation'],
        completedSteps: ['Renewed agreement uploaded', 'Reactivation request submitted'],
        updatedAt: '2026-07-15T16:10:00.000Z',
        submittedAt: '2026-07-15T16:10:00.000Z',
        expectedReviewAt: '2026-07-19T18:30:00.000Z',
        reactivationAllowed: true,
        imageUri: 'https://images.unsplash.com/photo-1529408632839-a54952c491e5?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-appeal-review',
        societyId: 'society-bh',
        societyName: 'Bluebell Habitat',
        unitId: 'unit-bh-c-110',
        unitNumber: 'C-110',
        buildingName: 'Bluebell Court',
        city: 'Nashik',
        role: 'AUTHORIZED_OCCUPANT',
        status: 'REJECTED',
        blockers: ['PROFILE_DATA_MISMATCH'],
        reason: residenceAccessMessages.seed.appealReason,
        residentPendingActions: [],
        societyPendingActions: ['Review the reconsideration request'],
        completedSteps: ['Initial decision recorded', 'Reconsideration submitted'],
        updatedAt: '2026-07-16T07:55:00.000Z',
        submittedAt: '2026-07-11T12:30:00.000Z',
        correctionAllowed: false,
        appealAllowed: true,
        expectedReviewAt: '2026-07-23T18:30:00.000Z',
        imageUri: 'https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-upload-retry',
        societyId: 'society-op',
        societyName: 'Oakwood Park',
        unitId: 'unit-op-d-404',
        unitNumber: 'D-404',
        buildingName: 'Oak Block',
        city: 'Pune',
        role: 'TENANT',
        status: 'DOCUMENTS_REQUIRED',
        blockers: ['MANDATORY_DOCUMENT_MISSING'],
        reason: 'The Tenant KYC upload was interrupted and can be retried.',
        residentPendingActions: ['Retry Tenant KYC upload'],
        societyPendingActions: ['Review documents after successful submission'],
        completedSteps: ['Identity verified', 'Rent agreement uploaded'],
        updatedAt: '2026-07-16T11:02:00.000Z',
        imageUri: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-reminder-cooldown',
        societyId: 'society-hg',
        societyName: 'Harmony Greens',
        unitId: 'unit-hg-e-909',
        unitNumber: 'E-909',
        buildingName: 'Green Tower',
        city: 'Mumbai',
        role: 'OWNER',
        status: 'SOCIETY_APPROVAL_PENDING',
        blockers: ['ADMIN_REVIEW_PENDING'],
        reason: 'Society review is pending and a reminder was delivered recently.',
        residentPendingActions: [],
        societyPendingActions: ['Complete ownership review'],
        completedSteps: ['Request submitted', 'Documents verified', 'Reminder delivered'],
        updatedAt: '2026-07-16T12:18:00.000Z',
        submittedAt: '2026-07-13T09:00:00.000Z',
        expectedReviewAt: '2026-07-15T18:30:00.000Z',
        reminderCooldownHours: 24,
        imageUri: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=82'
    },
    {
        id: 'access-no-active-docs',
        userId: mockResidenceAccessUsers.noActiveUserId,
        societyId: 'society-na',
        societyName: 'North Avenue',
        unitId: 'unit-na-a-101',
        unitNumber: 'A-101',
        buildingName: 'North Block',
        city: 'Nashik',
        role: 'TENANT',
        status: 'DOCUMENTS_REQUIRED',
        blockers: ['MANDATORY_DOCUMENT_MISSING'],
        reason: residenceAccessMessages.seed.documentsRequiredReason,
        residentPendingActions: ['Upload mandatory verification documents'],
        societyPendingActions: ['Review after submission'],
        completedSteps: ['Mobile number verified'],
        updatedAt: '2026-07-16T06:00:00.000Z',
        imageUri: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1000&q=82'
    },
];
export const mockResidenceSummaries: readonly ResidenceSummary[] = seeds.map((seed) => ({
    residenceAccessId: seed.id,
    societyId: seed.societyId,
    societyName: seed.societyName,
    unitId: seed.unitId,
    unitNumber: seed.unitNumber,
    buildingName: seed.buildingName,
    ...includeWhenPresent("wingName", seed.wingName),
    city: seed.city,
    role: seed.role,
    image: {
        uri: seed.imageUri,
        fallbackIcon: 'business-outline',
        accessibilityLabel: `${seed.societyName} residential building`
    },
    officePhoneMasked: '+91 ••••• ••210',
    officeEmail: `office@${seed.societyId.replace('society-', '')}.societyos.example`,
    supportHours: 'Monday to Saturday, 9:30 AM to 6:00 PM',
    escalationChannel: 'Society Secretary escalation after the expected review date'
}));
export const mockResidenceAccessRecords: readonly ResidenceAccessRecord[] = seeds.map((seed, index) => ({
    residenceAccessId: seed.id,
    userId: seed.userId ?? mockResidenceAccessUsers.defaultUserId,
    societyId: seed.societyId,
    unitId: seed.unitId,
    occupancyId: `occupancy-${seed.id}`,
    role: seed.role,
    status: seed.status,
    blockers: seed.blockers,
    statusReason: seed.reason,
    residentPendingActions: seed.residentPendingActions,
    societyPendingActions: seed.societyPendingActions,
    completedSteps: seed.completedSteps,
    statusUpdatedAt: seed.updatedAt,
    requestCreatedAt: seed.submittedAt ?? seed.updatedAt,
    ...includeWhenPresent("submittedAt", seed.submittedAt),
    ...includeWhenPresent("expectedReviewAt", seed.expectedReviewAt),
    referenceNumber: `RES-${seed.societyId.replace('society-', '').toUpperCase()}-${seed.unitNumber.replace('-', '')}-${String(index + 1).padStart(4, '0')}`,
    ...includeWhenPresent("effectiveFrom", seed.effectiveFrom),
    ...includeWhenPresent("effectiveUntil", seed.effectiveUntil),
    ...includeWhenPresent("homeContextId", seed.homeContextId),
    canWithdraw: seed.canWithdraw ?? false,
    correctionAllowed: seed.correctionAllowed ?? false,
    ...includeWhenPresent("correctionDeadline", seed.correctionDeadline),
    appealAllowed: seed.appealAllowed ?? false,
    reactivationAllowed: seed.reactivationAllowed ?? false,
    reminderCooldownHours: seed.reminderCooldownHours ?? 24,
    featureRestrictions: seed.featureRestrictions ?? [],
    dataVersion: 1
}));
interface RequirementSeed {
    readonly accessId: string;
    readonly type: ResidenceDocumentType;
    readonly status: ResidenceDocumentVerificationStatus;
    readonly mandatory?: boolean;
    readonly rejectionReason?: string;
    readonly expiryDate?: string;
}
const requirementSeeds: readonly RequirementSeed[] = [
    { accessId: 'access-documents-required', type: 'RENT_AGREEMENT', status: 'NOT_SUBMITTED' },
    { accessId: 'access-documents-required', type: 'TENANT_KYC', status: 'NOT_SUBMITTED' },
    { accessId: 'access-documents-required', type: 'POLICE_VERIFICATION', status: 'NOT_SUBMITTED' },
    { accessId: 'access-documents-required', type: 'TENANT_PHOTOGRAPH', status: 'VERIFIED', mandatory: false },
    { accessId: 'access-documents-required', type: 'SOCIETY_RULE_ACKNOWLEDGEMENT', status: 'VERIFIED' },
    { accessId: 'access-document-correction', type: 'RENT_AGREEMENT', status: 'CHANGES_REQUIRED', rejectionReason: residenceAccessMessages.seed.documentUnreadable },
    { accessId: 'access-document-correction', type: 'TENANT_KYC', status: 'VERIFIED' },
    { accessId: 'access-document-correction', type: 'POLICE_VERIFICATION', status: 'VERIFIED' },
    { accessId: 'access-owner-consent', type: 'OWNER_CONSENT', status: 'NOT_SUBMITTED' },
    { accessId: 'access-rejected-family', type: 'RELATIONSHIP_PROOF', status: 'REJECTED', rejectionReason: residenceAccessMessages.seed.relationshipMismatch },
    { accessId: 'access-rejected-family', type: 'IDENTITY_PROOF', status: 'VERIFIED' },
    { accessId: 'access-expired-tenant', type: 'RENT_AGREEMENT', status: 'EXPIRED', expiryDate: '2026-06-30T18:29:59.000Z' },
    { accessId: 'access-suspended-owner', type: 'OWNERSHIP_PROOF', status: 'NOT_SUBMITTED' },
    { accessId: 'access-reactivation-review', type: 'RENT_AGREEMENT', status: 'UNDER_REVIEW', expiryDate: '2027-07-14T18:29:59.000Z' },
    { accessId: 'access-upload-retry', type: 'RENT_AGREEMENT', status: 'UPLOADED' },
    { accessId: 'access-upload-retry', type: 'TENANT_KYC', status: 'NOT_SUBMITTED' },
    { accessId: 'access-no-active-docs', type: 'IDENTITY_PROOF', status: 'NOT_SUBMITTED' },
];
function requirementDescription(type: ResidenceDocumentType): string {
    switch (type) {
        case 'RENT_AGREEMENT':
            return 'Upload the complete registered agreement showing the unit, resident names and tenancy dates.';
        case 'TENANT_KYC':
            return 'Provide the society-configured tenant identity and contact declaration.';
        case 'POLICE_VERIFICATION':
            return 'Upload the acknowledgement or completed police verification certificate.';
        case 'RELATIONSHIP_PROOF':
            return 'Provide a document that supports the selected family relationship.';
        case 'OWNERSHIP_PROOF':
            return 'Provide a current document linking the owner to the selected unit.';
        case 'SOCIETY_RULE_ACKNOWLEDGEMENT':
            return 'Acknowledge the latest society rules before review.';
        default:
            return `Provide a clear and current ${residenceDocumentTypeLabels[type].toLocaleLowerCase()} document.`;
    }
}
export const mockResidenceDocumentRequirements: readonly ResidenceDocumentRequirement[] = requirementSeeds.map((seed, index) => {
    const record = mockResidenceAccessRecords.find((entry) => entry.residenceAccessId === seed.accessId);
    if (!record) {
        throw new Error(`Mock residence record ${seed.accessId} is missing.`);
    }
    const submitted = seed.status !== 'NOT_SUBMITTED';
    const requirementId = `requirement-${seed.accessId}-${seed.type.toLocaleLowerCase()}`;
    return {
        requirementId,
        societyId: record.societyId,
        unitId: record.unitId,
        occupancyRole: record.role,
        documentType: seed.type,
        title: residenceDocumentTypeLabels[seed.type],
        description: requirementDescription(seed.type),
        mandatory: seed.mandatory ?? true,
        acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        maximumFileSizeBytes: 8 * 1024 * 1024,
        expiryDateRequired: seed.type === 'RENT_AGREEMENT' || seed.type === 'POLICE_VERIFICATION',
        frontAndBackRequired: seed.type === 'IDENTITY_PROOF',
        verificationStatus: seed.status,
        ...includeWhenPresent("rejectionReason", seed.rejectionReason
            ? { code: 'OTHER', residentVisibleReason: seed.rejectionReason, internalAdminNote: 'Internal mock note that must never be rendered.' }
            : undefined),
        ...includeWhenPresent("submittedDocumentId", submitted ? `document-${requirementId}` : undefined),
        ...includeWhenPresent("submittedAt", submitted ? '2026-07-13T09:15:00.000Z' : undefined),
        ...includeWhenPresent("expiryDate", seed.expiryDate),
        displayOrder: index + 1
    };
});
export const mockResidenceDocuments: readonly ResidenceDocument[] = mockResidenceDocumentRequirements
    .filter((requirement) => Boolean(requirement.submittedDocumentId))
    .map((requirement) => {
    const record = mockResidenceAccessRecords.find((entry) => entry.societyId === requirement.societyId && entry.unitId === requirement.unitId);
    if (!record || !requirement.submittedDocumentId) {
        throw new Error(`Mock document scope is missing for ${requirement.requirementId}.`);
    }
    const versionId = `version-${requirement.submittedDocumentId}-1`;
    return {
        documentId: requirement.submittedDocumentId,
        residenceAccessId: record.residenceAccessId,
        requirementId: requirement.requirementId,
        societyId: requirement.societyId,
        unitId: requirement.unitId,
        occupancyId: record.occupancyId,
        currentVersionId: versionId,
        versions: [
            {
                versionId,
                documentId: requirement.submittedDocumentId,
                versionNumber: 1,
                fileName: `${requirement.documentType.toLocaleLowerCase()}.pdf`,
                mimeType: 'application/pdf',
                fileSizeBytes: 1420000,
                temporaryRemoteUrl: `https://temporary.invalid/${requirement.submittedDocumentId}`,
                submittedAt: requirement.submittedAt ?? '2026-07-13T09:15:00.000Z',
                verificationStatus: requirement.verificationStatus,
                checksum: `checksum-${requirement.requirementId}`,
                side: 'SINGLE'
            },
        ]
    };
});
function eventForRecord(record: ResidenceAccessRecord, index: number): ResidenceAccessTimelineEvent {
    return {
        eventId: `event-${record.residenceAccessId}-${index}`,
        residenceAccessId: record.residenceAccessId,
        eventType: record.status === 'ACTIVE' ? 'ACCESS_ACTIVATED' : record.status === 'EXPIRED' ? 'ACCESS_EXPIRED' : record.status === 'SUSPENDED' ? 'ACCESS_SUSPENDED' : record.status === 'REJECTED' ? 'REQUEST_STARTED' : 'REQUEST_STARTED',
        title: record.status === 'ACTIVE' ? 'Access activated' : record.status === 'EXPIRED' ? 'Access expired' : record.status === 'SUSPENDED' ? 'Access suspended' : 'Residence access updated',
        residentVisibleDescription: record.statusReason,
        occurredAt: record.statusUpdatedAt,
        actorType: record.status === 'ACTIVE' ? 'SYSTEM' : 'SOCIETY_ADMIN',
        actorDisplayRole: record.status === 'ACTIVE' ? 'SocietyOS' : 'Society Office',
        residentVisible: true
    };
}
export const mockResidenceAccessTimeline: readonly ResidenceAccessTimelineEvent[] = [
    ...mockResidenceAccessRecords.map(eventForRecord),
    {
        eventId: 'event-approval-submitted',
        residenceAccessId: 'access-approval-pending',
        eventType: 'SUBMITTED_FOR_REVIEW',
        title: 'Submitted for review',
        residentVisibleDescription: 'Identity, ownership proof and declarations were submitted successfully.',
        occurredAt: '2026-07-16T10:42:00.000Z',
        actorType: 'RESIDENT',
        actorDisplayRole: 'Resident',
        residentVisible: true
    },
    {
        eventId: 'event-correction-requested',
        residenceAccessId: 'access-document-correction',
        eventType: 'DOCUMENT_CHANGES_REQUESTED',
        title: 'Document changes requested',
        residentVisibleDescription: residenceAccessMessages.seed.documentUnreadable,
        occurredAt: '2026-07-15T12:20:00.000Z',
        actorType: 'SOCIETY_ADMIN',
        actorDisplayRole: 'Membership Desk',
        relatedDocumentId: 'document-requirement-access-document-correction-rent_agreement',
        residentVisible: true
    },
];
export const mockResidenceAccessDecisions: readonly ResidenceAccessDecision[] = [
    {
        decisionId: 'decision-family-v1',
        residenceAccessId: 'access-rejected-family',
        requestVersion: 1,
        decision: 'REJECTED',
        rejectionReasonCode: 'RELATIONSHIP_PROOF_INVALID',
        residentVisibleReason: residenceAccessMessages.seed.relationshipMismatch,
        internalAdminNote: 'Internal ownership graph identifiers must remain private.',
        decidedAt: '2026-07-14T13:30:00.000Z',
        decisionMakerRole: 'Society Membership Desk',
        affectedRequirementIds: ['requirement-access-rejected-family-relationship_proof'],
        correctionAllowed: true,
        correctionDeadline: '2026-07-31T18:30:00.000Z',
        supportingNotes: 'Upload a document that clearly supports the relationship selected in this request.'
    },
    {
        decisionId: 'decision-document-v1',
        residenceAccessId: 'access-document-correction',
        requestVersion: 1,
        decision: 'CHANGES_REQUIRED',
        rejectionReasonCode: 'DOCUMENT_UNREADABLE',
        residentVisibleReason: residenceAccessMessages.seed.documentUnreadable,
        internalAdminNote: 'OCR confidence was below the internal review threshold.',
        decidedAt: '2026-07-15T12:20:00.000Z',
        decisionMakerRole: 'Document Review Desk',
        affectedRequirementIds: ['requirement-access-document-correction-rent_agreement'],
        correctionAllowed: true,
        correctionDeadline: '2026-07-29T18:30:00.000Z'
    },
    {
        decisionId: 'decision-appeal-v1',
        residenceAccessId: 'access-appeal-review',
        requestVersion: 1,
        decision: 'REJECTED',
        rejectionReasonCode: 'DOCUMENT_INFORMATION_MISMATCH',
        residentVisibleReason: 'The submitted identity details did not match the occupancy register.',
        internalAdminNote: 'Manual source record reference withheld from resident.',
        decidedAt: '2026-07-14T10:00:00.000Z',
        decisionMakerRole: 'Society Membership Desk',
        affectedRequirementIds: [],
        correctionAllowed: false
    },
];
export const mockOwnerConsentRequests: readonly OwnerConsentRequest[] = [
    {
        consentRequestId: 'consent-owner-required',
        residenceAccessId: 'access-owner-consent',
        maskedOwnerName: 'R•••• M••••',
        status: 'NOT_REQUESTED',
        alternativeOfficeVerificationAllowed: true
    },
];
export const mockSuspensionRecords: readonly ResidenceSuspensionRecord[] = [
    {
        suspensionId: 'suspension-orchid-1',
        residenceAccessId: 'access-suspended-owner',
        residentVisibleReason: residenceAccessMessages.seed.suspendedOwnerReason,
        internalAdminNote: 'Conflicting occupancy record identifier withheld.',
        suspendedAt: '2026-07-14T08:00:00.000Z',
        authorityRole: 'Society Membership Desk',
        affectedFeatures: ['VISITOR_APPROVAL', 'FACILITY_BOOKING', 'CHAT', 'DIRECTORY'],
        stillAvailableFeatures: ['Suspension details', 'Document upload', 'Previous receipts', 'Emergency assistance', 'Society Office contact'],
        resolutionSteps: ['Upload current ownership or occupancy clarification', 'Submit a manual review request'],
        expectedReviewAt: '2026-07-21T18:30:00.000Z',
        temporary: true,
        referenceNumber: 'SUS-OH-C704-260714'
    },
];
export const mockReactivationRequests: readonly ResidenceReactivationRequest[] = [
    {
        requestId: 'reactivation-silver-1',
        residenceAccessId: 'access-reactivation-review',
        requestedByUserId: mockResidenceAccessUsers.defaultUserId,
        reason: 'RENEWED_TENANCY',
        supportingDocumentIds: ['document-requirement-access-reactivation-review-rent_agreement'],
        residentMessage: 'The renewed agreement covers the next twelve months.',
        status: 'UNDER_REVIEW',
        submittedAt: '2026-07-15T16:10:00.000Z'
    },
];
export const mockResidenceAppeals: readonly ResidenceAccessAppeal[] = [
    {
        appealId: 'appeal-bluebell-1',
        residenceAccessId: 'access-appeal-review',
        reason: 'The occupancy register was updated after the original decision.',
        explanation: 'Please review the corrected society record and current identity proof.',
        status: 'UNDER_REVIEW',
        submittedAt: '2026-07-16T07:55:00.000Z'
    },
];
export const mockResidenceReminders: readonly ResidenceApprovalReminder[] = [
    {
        reminderId: 'reminder-harmony-1',
        requestId: 'access-reminder-cooldown',
        societyId: 'society-hg',
        unitId: 'unit-hg-e-909',
        sentByUserId: mockResidenceAccessUsers.defaultUserId,
        sentAt: '2026-07-16T12:18:00.000Z',
        reason: 'REVIEW_DELAYED',
        optionalMessage: 'The expected review time has passed. Please share an update.',
        deliveryStatus: 'DELIVERED',
        nextAllowedReminderAt: '2026-07-17T12:18:00.000Z'
    },
];
export const mockSocietyAccessReviewTasks: readonly SocietyAccessReviewTask[] = [
    {
        taskId: 'task-approval-ra-1',
        societyId: 'society-ra',
        unitId: 'unit-ra-p-1102',
        occupancyId: 'occupancy-access-approval-pending',
        residentUserId: mockResidenceAccessUsers.defaultUserId,
        requestId: 'access-approval-pending',
        taskType: 'NEW_ACCESS_REQUEST',
        priority: 'NORMAL',
        status: 'OPEN',
        createdAt: '2026-07-16T10:42:00.000Z',
        dueAt: '2026-07-18T18:30:00.000Z'
    },
];
export const mockResidenceAccessNotifications: readonly ResidenceAccessNotification[] = [
    {
        notificationId: 'notification-documents-required',
        userId: mockResidenceAccessUsers.defaultUserId,
        residenceAccessId: 'access-documents-required',
        type: 'DOCUMENTS_REQUIRED',
        title: 'Residence documents required',
        body: 'Complete the three mandatory documents for Gokhale Park Residency.',
        createdAt: '2026-07-16T06:45:00.000Z',
        deepLinkDestination: 'DOCUMENT_REQUIREMENTS'
    },
    {
        notificationId: 'notification-suspension',
        userId: mockResidenceAccessUsers.defaultUserId,
        residenceAccessId: 'access-suspended-owner',
        type: 'ACCESS_SUSPENDED',
        title: 'Residence access suspended',
        body: 'Review the occupancy clarification required for Orchid Habitat.',
        createdAt: '2026-07-14T08:00:00.000Z',
        deepLinkDestination: 'SUSPENSION_RESOLUTION'
    },
];
export interface MockResidenceAccessData {
    readonly summaries: readonly ResidenceSummary[];
    readonly records: readonly ResidenceAccessRecord[];
    readonly requirements: readonly ResidenceDocumentRequirement[];
    readonly documents: readonly ResidenceDocument[];
    readonly timeline: readonly ResidenceAccessTimelineEvent[];
    readonly reminders: readonly ResidenceApprovalReminder[];
    readonly decisions: readonly ResidenceAccessDecision[];
    readonly ownerConsents: readonly OwnerConsentRequest[];
    readonly suspensions: readonly ResidenceSuspensionRecord[];
    readonly reactivationRequests: readonly ResidenceReactivationRequest[];
    readonly appeals: readonly ResidenceAccessAppeal[];
    readonly adminTasks: readonly SocietyAccessReviewTask[];
    readonly notifications: readonly ResidenceAccessNotification[];
}
export function createMockResidenceAccessData(): MockResidenceAccessData {
    return {
        summaries: mockResidenceSummaries.map((entry) => ({ ...entry, image: { ...entry.image } })),
        records: mockResidenceAccessRecords.map((entry) => ({
            ...entry,
            blockers: [...entry.blockers],
            residentPendingActions: [...entry.residentPendingActions],
            societyPendingActions: [...entry.societyPendingActions],
            completedSteps: [...entry.completedSteps],
            featureRestrictions: entry.featureRestrictions.map((restriction) => ({ ...restriction }))
        })),
        requirements: mockResidenceDocumentRequirements.map((entry) => ({
            ...entry,
            acceptedFileTypes: [...entry.acceptedFileTypes],
            ...includeWhenPresent("rejectionReason", entry.rejectionReason ? { ...entry.rejectionReason } : undefined)
        })),
        documents: mockResidenceDocuments.map((entry) => ({
            ...entry,
            versions: entry.versions.map((version) => ({ ...version }))
        })),
        timeline: mockResidenceAccessTimeline.map((entry) => ({ ...entry })),
        reminders: mockResidenceReminders.map((entry) => ({ ...entry })),
        decisions: mockResidenceAccessDecisions.map((entry) => ({
            ...entry,
            affectedRequirementIds: [...entry.affectedRequirementIds]
        })),
        ownerConsents: mockOwnerConsentRequests.map((entry) => ({ ...entry })),
        suspensions: mockSuspensionRecords.map((entry) => ({
            ...entry,
            affectedFeatures: [...entry.affectedFeatures],
            stillAvailableFeatures: [...entry.stillAvailableFeatures],
            resolutionSteps: [...entry.resolutionSteps]
        })),
        reactivationRequests: mockReactivationRequests.map((entry) => ({
            ...entry,
            supportingDocumentIds: [...entry.supportingDocumentIds]
        })),
        appeals: mockResidenceAppeals.map((entry) => ({ ...entry })),
        adminTasks: mockSocietyAccessReviewTasks.map((entry) => ({ ...entry })),
        notifications: mockResidenceAccessNotifications.map((entry) => ({ ...entry }))
    };
}

