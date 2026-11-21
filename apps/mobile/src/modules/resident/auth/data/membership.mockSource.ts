import type { ResidenceMembership, ResidenceAccessTimelineEvent, ImageAssetReference, } from './membership.types';
import type { ResidenceMembershipRepository } from './membershipRepository.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
const societyImages: Record<string, ImageAssetReference> = {
    'society-gv': {
        uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#0f2027', '#203a43', '#2c5364'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Green Valley Heights residential towers'
    },
    'society-gp': {
        uri: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#1a2a3a', '#2d4a5a'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Gokhale Park Residency building exterior'
    },
    'society-ra': {
        uri: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#1e3c72', '#2a5298'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Rohan Ananta residential complex'
    },
    'society-re': {
        uri: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#134e5e', '#71b280'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Riverstone Enclave residential campus'
    },
    'society-ec': {
        uri: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#2c3e50', '#4ca1af'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Emerald Court residential complex'
    },
    'society-sr': {
        uri: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#3a7bd5', '#3a6073'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Skyline Residency towers'
    },
    'society-oh': {
        uri: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=400&q=80',
        fallbackGradient: ['#7f00ff', '#e100ff'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Orchid Habitat residential complex'
    }
};
function getSocietyImage(societyId: string): ImageAssetReference {
    return societyImages[societyId] ?? {
        uri: '',
        fallbackGradient: ['#172554', '#1e3a5f'],
        fallbackIcon: 'business-outline',
        accessibilityLabel: 'Residential community'
    };
}
const mockMemberships: ResidenceMembership[] = [
    {
        membershipId: 'membership-001',
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        societyImage: getSocietyImage('society-gv'),
        unitId: 'unit-gv-a-1204',
        unitDisplayName: 'A-1204',
        buildingName: 'Tower A',
        wingName: 'East Wing',
        role: 'owner',
        status: 'active',
        statusUpdatedAt: '2026-06-15T10:00:00.000Z',
        ...includeWhenPresent("approverGroup", undefined),
        outstandingRequirements: [],
        onboardingState: {
            completed: true,
            currentStepId: null,
            completedStepIds: ['confirm-profile', 'confirm-residence', 'notifications', 'emergency', 'society-rules', 'completion'],
            totalSteps: 6,
            completedSteps: 6,
            rulesVersionAcknowledged: 'v2.1',
            latestRulesVersion: 'v2.1'
        },
        lastAccessedAt: '2026-07-16T08:30:00.000Z',
        isLastActiveResidence: true,
        availableActions: ['openHome'],
        homeContextId: 'context-001',
        reminderCount: 0
    },
    {
        membershipId: 'membership-002',
        societyId: 'society-gv',
        societyName: 'Green Valley Heights',
        societyImage: getSocietyImage('society-gv'),
        unitId: 'unit-gv-b-804',
        unitDisplayName: 'B-804',
        buildingName: 'Tower B',
        wingName: 'West Wing',
        role: 'familyMember',
        status: 'active',
        statusUpdatedAt: '2026-06-20T14:00:00.000Z',
        outstandingRequirements: [],
        onboardingState: {
            completed: false,
            currentStepId: 'notifications',
            completedStepIds: ['confirm-profile', 'confirm-residence'],
            totalSteps: 5,
            completedSteps: 2,
            rulesVersionAcknowledged: null,
            latestRulesVersion: 'v2.1'
        },
        isLastActiveResidence: false,
        availableActions: ['openHome'],
        homeContextId: 'context-002',
        reminderCount: 0
    },
    {
        membershipId: 'membership-003',
        societyId: 'society-gp',
        societyName: 'Gokhale Park Residency',
        societyImage: getSocietyImage('society-gp'),
        unitId: 'unit-gp-c-503',
        unitDisplayName: 'C-503',
        buildingName: 'Building C',
        role: 'tenant',
        status: 'documentsRequired',
        statusReason: 'Police verification document is required before access can be approved.',
        statusUpdatedAt: '2026-07-10T09:00:00.000Z',
        approverGroup: 'societyAdministrator',
        outstandingRequirements: [
            { type: 'policeVerification', label: 'Police Verification Certificate', completed: false, mandatory: true },
            { type: 'rentAgreement', label: 'Registered Rent Agreement', completed: true, mandatory: true },
            { type: 'identityVerification', label: 'Identity Proof (Aadhaar/Passport)', completed: true, mandatory: true },
        ],
        onboardingState: {
            completed: false,
            currentStepId: null,
            completedStepIds: [],
            totalSteps: 6,
            completedSteps: 0,
            rulesVersionAcknowledged: null,
            latestRulesVersion: 'v1.0'
        },
        isLastActiveResidence: false,
        availableActions: ['uploadDocuments', 'trackRequest'],
        homeContextId: 'context-003',
        reminderCount: 0
    },
    {
        membershipId: 'membership-004',
        societyId: 'society-ra',
        societyName: 'Rohan Ananta',
        societyImage: getSocietyImage('society-ra'),
        unitId: 'unit-ra-p-1102',
        unitDisplayName: 'P-1102',
        buildingName: 'Phase 3',
        role: 'owner',
        status: 'societyApprovalPending',
        statusReason: 'Your access request has been submitted and is awaiting committee approval.',
        statusUpdatedAt: '2026-07-08T11:00:00.000Z',
        approverGroup: 'committeeOffice',
        outstandingRequirements: [],
        onboardingState: {
            completed: false,
            currentStepId: null,
            completedStepIds: [],
            totalSteps: 6,
            completedSteps: 0,
            rulesVersionAcknowledged: null,
            latestRulesVersion: 'v3.0'
        },
        isLastActiveResidence: false,
        availableActions: ['trackRequest', 'remindApprover', 'withdrawRequest'],
        homeContextId: 'context-004',
        lastReminderSentAt: '2026-07-12T10:00:00.000Z',
        reminderCount: 1,
        nextReminderAvailableAt: '2026-07-14T10:00:00.000Z'
    },
    {
        membershipId: 'membership-005',
        societyId: 'society-re',
        societyName: 'Riverstone Enclave',
        societyImage: getSocietyImage('society-re'),
        unitId: 'unit-re-d-602',
        unitDisplayName: 'D-602',
        buildingName: 'Riverstone Tower',
        role: 'tenant',
        status: 'ownerConsentRequired',
        statusReason: 'The unit owner must provide consent for your tenancy before society can approve access.',
        statusUpdatedAt: '2026-07-05T16:00:00.000Z',
        approverGroup: 'owner',
        outstandingRequirements: [
            { type: 'ownerConsent', label: 'Owner Consent Letter', completed: false, mandatory: true },
        ],
        onboardingState: {
            completed: false,
            currentStepId: null,
            completedStepIds: [],
            totalSteps: 6,
            completedSteps: 0,
            rulesVersionAcknowledged: null,
            latestRulesVersion: 'v1.5'
        },
        isLastActiveResidence: false,
        availableActions: ['requestOwnerConsent', 'trackRequest'],
        homeContextId: 'context-005',
        reminderCount: 0
    },
    {
        membershipId: 'membership-006',
        societyId: 'society-ec',
        societyName: 'Emerald Court',
        societyImage: getSocietyImage('society-ec'),
        unitId: 'unit-ec-a-303',
        unitDisplayName: 'A-303',
        buildingName: 'Block A',
        role: 'familyMember',
        status: 'rejected',
        statusReason: 'Relationship proof provided does not match unit ownership records. Please resubmit with valid documentation.',
        statusUpdatedAt: '2026-07-01T12:00:00.000Z',
        outstandingRequirements: [],
        onboardingState: {
            completed: false,
            currentStepId: null,
            completedStepIds: [],
            totalSteps: 5,
            completedSteps: 0,
            rulesVersionAcknowledged: null,
            latestRulesVersion: 'v1.0'
        },
        isLastActiveResidence: false,
        availableActions: ['reviewDecision', 'correctAndResubmit'],
        homeContextId: 'context-006',
        reminderCount: 0
    },
    {
        membershipId: 'membership-007',
        societyId: 'society-sr',
        societyName: 'Skyline Residency',
        societyImage: getSocietyImage('society-sr'),
        unitId: 'unit-sr-b-905',
        unitDisplayName: 'B-905',
        buildingName: 'Tower B',
        role: 'tenant',
        status: 'expired',
        statusReason: 'Rent agreement period ended on 30 June 2026. Renewal or reactivation required.',
        statusUpdatedAt: '2026-06-30T23:59:59.000Z',
        outstandingRequirements: [],
        onboardingState: {
            completed: true,
            currentStepId: null,
            completedStepIds: ['confirm-profile', 'confirm-residence', 'notifications', 'emergency', 'society-rules', 'completion'],
            totalSteps: 6,
            completedSteps: 6,
            rulesVersionAcknowledged: 'v1.0',
            latestRulesVersion: 'v1.0'
        },
        isLastActiveResidence: false,
        availableActions: ['renewAccess', 'viewHistory'],
        homeContextId: 'context-007',
        reminderCount: 0
    },
    {
        membershipId: 'membership-008',
        societyId: 'society-oh',
        societyName: 'Orchid Habitat',
        societyImage: getSocietyImage('society-oh'),
        unitId: 'unit-oh-c-704',
        unitDisplayName: 'C-704',
        buildingName: 'Orchid Tower',
        role: 'owner',
        status: 'suspended',
        statusReason: 'Access has been temporarily suspended by society administration. Please contact society office for assistance.',
        statusUpdatedAt: '2026-07-14T08:00:00.000Z',
        outstandingRequirements: [],
        onboardingState: {
            completed: true,
            currentStepId: null,
            completedStepIds: ['confirm-profile', 'confirm-residence', 'notifications', 'emergency', 'society-rules', 'completion'],
            totalSteps: 6,
            completedSteps: 6,
            rulesVersionAcknowledged: 'v2.0',
            latestRulesVersion: 'v2.0'
        },
        isLastActiveResidence: false,
        availableActions: ['contactSupport', 'viewHistory'],
        homeContextId: 'context-008',
        reminderCount: 0
    },
];
const mockTimelines: Record<string, ResidenceAccessTimelineEvent[]> = {
    'membership-004': [
        { id: 'tl-001', type: 'accessRequested', title: 'Access Requested', description: 'You submitted an access request for P-1102, Phase 3.', occurredAt: '2026-07-08T11:00:00.000Z' },
        { id: 'tl-002', type: 'profileVerified', title: 'Profile Verified', description: 'Your resident profile was verified successfully.', occurredAt: '2026-07-09T09:30:00.000Z', actor: 'System' },
        { id: 'tl-003', type: 'documentsSubmitted', title: 'Documents Submitted', description: 'All required documents were submitted.', occurredAt: '2026-07-09T10:00:00.000Z' },
        { id: 'tl-004', type: 'sentForSocietyApproval', title: 'Sent for Society Approval', description: 'Your request has been forwarded to the Committee Office for review.', occurredAt: '2026-07-10T08:00:00.000Z', actor: 'System' },
        { id: 'tl-005', type: 'reminderSent', title: 'Reminder Sent', description: 'You sent a reminder to the committee office.', occurredAt: '2026-07-12T10:00:00.000Z' },
    ],
    'membership-006': [
        { id: 'tl-010', type: 'accessRequested', title: 'Access Requested', description: 'You requested family member access to A-303, Block A.', occurredAt: '2026-06-25T14:00:00.000Z' },
        { id: 'tl-011', type: 'documentsSubmitted', title: 'Documents Submitted', occurredAt: '2026-06-26T09:00:00.000Z' },
        { id: 'tl-012', type: 'accessRejected', title: 'Access Rejected', description: 'Relationship proof does not match ownership records.', occurredAt: '2026-07-01T12:00:00.000Z', actor: 'Society Administrator' },
    ]
};
const reminderTracker = new Map<string, {
    lastSentAt: string;
    count: number;
}>();
reminderTracker.set('membership-004', { lastSentAt: '2026-07-12T10:00:00.000Z', count: 1 });
export const membershipMockSource: ResidenceMembershipRepository = {
    async getMemberships(_signal) {
        return [...mockMemberships];
    },
    async getMembershipDetail(membershipId, _signal) {
        const found = mockMemberships.find((m) => m.membershipId === membershipId);
        if (!found)
            throw new Error(`Membership ${membershipId} not found.`);
        return found;
    },
    async requestResidenceAccess(request, _signal) {
        const newMembership: ResidenceMembership = {
            membershipId: `membership-${Date.now()}`,
            societyId: request.societyCode,
            societyName: request.societyCode,
            societyImage: getSocietyImage(request.societyCode),
            unitId: request.unitId,
            unitDisplayName: request.unitId,
            buildingName: 'Building',
            role: request.role,
            status: 'societyApprovalPending',
            statusUpdatedAt: new Date().toISOString(),
            approverGroup: 'societyAdministrator',
            outstandingRequirements: [],
            onboardingState: {
                completed: false,
                currentStepId: null,
                completedStepIds: [],
                totalSteps: 6,
                completedSteps: 0,
                rulesVersionAcknowledged: null,
                latestRulesVersion: 'v1.0'
            },
            isLastActiveResidence: false,
            availableActions: ['trackRequest', 'remindApprover', 'withdrawRequest'],
            homeContextId: `context-${Date.now()}`,
            reminderCount: 0
        };
        const timelineEvent: ResidenceAccessTimelineEvent = {
            id: `tl-${Date.now()}`,
            type: 'accessRequested',
            title: 'Access Requested',
            description: request.supportingNote ?? 'Access request submitted.',
            occurredAt: new Date().toISOString()
        };
        return { membership: newMembership, timeline: [timelineEvent] };
    },
    async sendAccessReminder(membershipId, _request, _signal) {
        const existing = reminderTracker.get(membershipId);
        const maxReminders = 3;
        const currentCount = existing ? existing.count : 0;
        if (currentCount >= maxReminders) {
            return {
                sent: false,
                nextAvailableAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                totalRemindersSent: currentCount,
                remainingReminders: 0
            };
        }
        const now = new Date().toISOString();
        const nextAvailable = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();
        reminderTracker.set(membershipId, { lastSentAt: now, count: currentCount + 1 });
        return {
            sent: true,
            nextAvailableAt: nextAvailable,
            totalRemindersSent: currentCount + 1,
            remainingReminders: maxReminders - currentCount - 1
        };
    },
    async withdrawAccessRequest(membershipId, _request, _signal) {
        const found = mockMemberships.find((m) => m.membershipId === membershipId);
        if (!found)
            throw new Error(`Membership ${membershipId} not found.`);
        return { ...found, status: 'revoked' as const, statusReason: 'Request withdrawn by resident.' };
    },
    async getAccessTimeline(membershipId, _signal) {
        return mockTimelines[membershipId] ?? [];
    }
};
export { mockMemberships };

