import { MockResidenceAccessRepository } from '../MockResidenceAccessRepository';
import { mockResidenceAccessUsers } from '../mockResidenceAccessData';
import type { ResidenceAccessDetail, ResidenceDocumentRequirement, ResidenceDocumentSelection, ResidenceDocumentUploadInput, } from '../../models/residenceAccess.types';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
jest.mock('expo-secure-store', () => {
    const values = new Map<string, string>();
    return {
        setItemAsync: jest.fn(async (key: string, value: string) => { values.set(key, value); }),
        getItemAsync: jest.fn(async (key: string) => values.get(key) ?? null),
        deleteItemAsync: jest.fn(async (key: string) => { values.delete(key); })
    };
});
function requireSuccess<T>(result: {
    readonly ok: true;
    readonly data: T;
} | {
    readonly ok: false;
}): T {
    if (!result.ok)
        throw new Error('Expected successful residence repository result');
    return result.data;
}
async function detail(repository: MockResidenceAccessRepository, residenceAccessId: string): Promise<ResidenceAccessDetail> {
    return requireSuccess(await repository.getResidenceDetail(mockResidenceAccessUsers.defaultUserId, residenceAccessId));
}
async function uploadRequirement(repository: MockResidenceAccessRepository, residenceAccessId: string, requirement: ResidenceDocumentRequirement, ordinal: number): Promise<ResidenceAccessDetail> {
    const mimeType = getRequiredItem(requirement.acceptedFileTypes, 0, "MockResidenceAccessRepository.test.ts");
    const sides: readonly ResidenceDocumentSelection['side'][] = requirement.frontAndBackRequired ? ['FRONT', 'BACK'] : ['SINGLE'];
    let current = await detail(repository, residenceAccessId);
    for (const [sideIndex, side] of sides.entries()) {
        const extension = mimeType === 'application/pdf' ? 'pdf' : 'jpg';
        const input: ResidenceDocumentUploadInput = {
            residenceAccessId,
            requirementId: requirement.requirementId,
            selection: {
                uri: `file:///secure/${residenceAccessId}-${ordinal}-${sideIndex}.${extension}`,
                fileName: `${residenceAccessId}-${ordinal}-${sideIndex}.${extension}`,
                mimeType,
                fileSizeBytes: 200000 + ordinal * 100 + sideIndex,
                side
            },
            ...includeWhenPresent("expiryDate", requirement.expiryDateRequired ? '2027-07-16' : undefined),
            idempotencyKey: `upload-${residenceAccessId}-${ordinal}-${sideIndex}`
        };
        current = requireSuccess(await repository.uploadDocument(input));
    }
    return current;
}
describe('MockResidenceAccessRepository chained acceptance scenarios', () => {
    let repository: MockResidenceAccessRepository;
    beforeEach(() => {
        repository = new MockResidenceAccessRepository();
        repository.setMockLatency(0);
    });
    it('Scenario A uploads named requirements, submits once, and creates the review task', async () => {
        const initial = await detail(repository, 'access-documents-required');
        const mandatory = initial.requirements.filter((requirement) => requirement.mandatory && requirement.verificationStatus === 'NOT_SUBMITTED');
        expect(mandatory.map((entry) => entry.title)).toEqual(expect.arrayContaining([
            'Registered rent agreement',
            'Tenant KYC',
            'Police verification',
        ]));
        for (const [index, requirement] of mandatory.entries()) {
            await uploadRequirement(repository, initial.accessRecord.residenceAccessId, requirement, index);
        }
        const submitted = requireSuccess(await repository.submitForReview({
            residenceAccessId: initial.accessRecord.residenceAccessId,
            declarationsAccepted: true,
            rulesAcknowledged: true,
            consentAccepted: true,
            idempotencyKey: 'scenario-a-submit'
        }));
        expect(submitted.accessRecord.status).toBe('SOCIETY_APPROVAL_PENDING');
        expect(repository.getOutboxSnapshot().adminTasks.some((task) => task.requestId === initial.accessRecord.residenceAccessId && task.taskType === 'NEW_ACCESS_REQUEST')).toBe(true);
        const duplicate = await repository.submitForReview({
            residenceAccessId: initial.accessRecord.residenceAccessId,
            declarationsAccepted: true,
            rulesAcknowledged: true,
            consentAccepted: true,
            idempotencyKey: 'scenario-a-second-submit'
        });
        expect(duplicate.ok).toBe(false);
    });
    it('Scenario B creates one reminder task and notification, then enforces cooldown', async () => {
        const sent = requireSuccess(await repository.sendReminder({
            residenceAccessId: 'access-approval-pending',
            reason: 'URGENT_VISITOR_ACCESS_REQUIRED',
            optionalMessage: 'Move-in security verification is time-sensitive.',
            idempotencyKey: 'scenario-b-reminder'
        }));
        expect(getRequiredItem(sent.reminders, 0, "MockResidenceAccessRepository.test.ts")?.deliveryStatus).toBe('DELIVERED');
        const snapshot = repository.getOutboxSnapshot();
        expect(snapshot.adminTasks.some((task) => task.requestId === 'access-approval-pending' && task.taskType === 'RESIDENT_REMINDER')).toBe(true);
        expect(snapshot.notifications.some((notification) => notification.residenceAccessId === 'access-approval-pending' && notification.type === 'REMINDER_DELIVERED')).toBe(true);
        const duplicate = await repository.sendReminder({
            residenceAccessId: 'access-approval-pending',
            reason: 'OTHER',
            idempotencyKey: 'scenario-b-duplicate'
        });
        expect(duplicate.ok).toBe(false);
        if (!duplicate.ok)
            expect(duplicate.error.code).toBe('REMINDER_COOLDOWN');
    });
    it('Scenario C retains the resident-visible decision and document versions during correction', async () => {
        const rejected = await detail(repository, 'access-rejected-family');
        const decision = getRequiredItem(rejected.decisions, 0, "MockResidenceAccessRepository.test.ts");
        if (!decision)
            throw new Error('Missing rejected decision fixture');
        const affected = rejected.requirements.find((requirement) => decision.affectedRequirementIds.includes(requirement.requirementId));
        if (!affected)
            throw new Error('Missing affected document fixture');
        const previousDecisionId = decision.decisionId;
        await uploadRequirement(repository, rejected.accessRecord.residenceAccessId, affected, 20);
        const corrected = requireSuccess(await repository.resubmitCorrection({
            residenceAccessId: rejected.accessRecord.residenceAccessId,
            affectedRequirementIds: decision.affectedRequirementIds,
            idempotencyKey: 'scenario-c-resubmit'
        }));
        expect(corrected.accessRecord.status).toBe('DOCUMENTS_UNDER_REVIEW');
        expect(corrected.decisions.some((entry) => entry.decisionId === previousDecisionId)).toBe(true);
        expect(corrected.decisions.every((entry) => entry.internalAdminNote === undefined)).toBe(true);
        expect(corrected.timeline.some((event) => event.eventType === 'DOCUMENT_RESUBMITTED')).toBe(true);
        expect(repository.getOutboxSnapshot().adminTasks.some((task) => task.requestId === rejected.accessRecord.residenceAccessId && task.taskType === 'DOCUMENT_RESUBMITTED')).toBe(true);
    });
    it('Scenario D moves owner consent to society review only after the mocked owner approves', async () => {
        const pending = requireSuccess(await repository.requestOwnerConsent({
            residenceAccessId: 'access-owner-consent',
            deliveryMethod: 'SECURE_LINK',
            idempotencyKey: 'scenario-d-consent'
        }));
        expect(pending.accessRecord.status).toBe('OWNER_CONSENT_PENDING');
        const approved = requireSuccess(repository.simulateOwnerConsentDecision('access-owner-consent', true));
        expect(approved.ownerConsent?.status).toBe('APPROVED');
        expect(approved.accessRecord.status).toBe('SOCIETY_APPROVAL_PENDING');
        expect(repository.getOutboxSnapshot().adminTasks.some((task) => task.requestId === 'access-owner-consent' && task.taskType === 'OWNER_CONSENT_RECEIVED')).toBe(true);
    });
    it('Scenario E blocks dashboard access and submits suspension resolution for society review', async () => {
        const suspended = await detail(repository, 'access-suspended-owner');
        expect(suspended.eligibility.canEnterResidence).toBe(false);
        const resolution = requireSuccess(await repository.submitSuspensionResolution({
            residenceAccessId: suspended.accessRecord.residenceAccessId,
            explanation: 'The requested occupancy clarification has been completed.',
            supportingDocumentIds: [],
            idempotencyKey: 'scenario-e-resolution'
        }));
        expect(resolution.accessRecord.status).toBe('SOCIETY_APPROVAL_PENDING');
        expect(resolution.eligibility.canEnterResidence).toBe(false);
        expect(repository.getOutboxSnapshot().adminTasks.some((task) => task.requestId === suspended.accessRecord.residenceAccessId && task.taskType === 'SUSPENSION_RESOLUTION')).toBe(true);
    });
    it('Scenario F renews expired tenancy without restoring access before society approval', async () => {
        const expired = await detail(repository, 'access-expired-tenant');
        const agreement = expired.requirements.find((requirement) => requirement.documentType === 'RENT_AGREEMENT');
        if (!agreement)
            throw new Error('Missing expired agreement fixture');
        const renewed = await uploadRequirement(repository, expired.accessRecord.residenceAccessId, agreement, 30);
        const supportingDocumentIds = renewed.documents.map((document) => document.documentId);
        const requested = requireSuccess(await repository.requestReactivation({
            residenceAccessId: expired.accessRecord.residenceAccessId,
            reason: 'RENEWED_TENANCY',
            supportingDocumentIds,
            residentMessage: 'The renewed registered agreement is attached.',
            idempotencyKey: 'scenario-f-reactivation'
        }));
        expect(requested.accessRecord.status).toBe('SOCIETY_APPROVAL_PENDING');
        expect(requested.eligibility.canEnterResidence).toBe(false);
        const approved = requireSuccess(repository.simulateSocietyDecision(expired.accessRecord.residenceAccessId, true));
        expect(approved.accessRecord.status).toBe('ACTIVE');
        expect(approved.eligibility.canEnterResidence).toBe(true);
    });
    it('Scenario G paginates mixed residences without cross-account leakage', async () => {
        const firstPage = requireSuccess(await repository.getResidences({
            userId: mockResidenceAccessUsers.defaultUserId,
            pageSize: 4,
            statusFilter: 'ALL',
            roleFilter: 'ALL'
        }));
        expect(firstPage.items).toHaveLength(4);
        expect(firstPage.nextCursor).toBeDefined();
        const secondPage = requireSuccess(await repository.getResidences({
            userId: mockResidenceAccessUsers.defaultUserId,
            ...includeWhenPresent("cursor", firstPage.nextCursor),
            pageSize: 4,
            statusFilter: 'ALL',
            roleFilter: 'ALL'
        }));
        const ids = [...firstPage.items, ...secondPage.items].map((item) => item.accessRecord.residenceAccessId);
        expect(new Set(ids).size).toBe(ids.length);
        expect([...firstPage.items, ...secondPage.items].every((item) => item.accessRecord.userId === mockResidenceAccessUsers.defaultUserId)).toBe(true);
        const leaked = await repository.getResidenceDetail(mockResidenceAccessUsers.noActiveUserId, 'access-active-owner');
        expect(leaked.ok).toBe(false);
    });
    it('submits an appeal with optional new evidence as a separate scoped document and task', async () => {
        const appealed = requireSuccess(await repository.submitAppeal({
            residenceAccessId: 'access-rejected-family',
            reason: 'Relationship evidence should be reconsidered',
            explanation: 'A clearer supporting certificate is attached.',
            supportingDocument: {
                uri: 'file:///secure/relationship-certificate.pdf',
                fileName: 'relationship-certificate.pdf',
                mimeType: 'application/pdf',
                fileSizeBytes: 340000,
                side: 'SINGLE'
            },
            acknowledgementAccepted: true,
            idempotencyKey: 'appeal-with-evidence'
        }));
        const appeal = appealed.appeal;
        expect(appeal?.status).toBe('SUBMITTED');
        expect(appeal?.supportingDocumentId).toBeDefined();
        const supportingDocument = appealed.documents.find((document) => document.documentId === appeal?.supportingDocumentId);
        expect(supportingDocument?.societyId).toBe(appealed.accessRecord.societyId);
        expect(supportingDocument?.unitId).toBe(appealed.accessRecord.unitId);
        expect(supportingDocument?.occupancyId).toBe(appealed.accessRecord.occupancyId);
        expect(repository.getOutboxSnapshot().adminTasks.some((task) => task.requestId === appealed.accessRecord.residenceAccessId && task.taskType === 'APPEAL_SUBMITTED')).toBe(true);
    });
    it('recovers an interrupted offline upload from encrypted device storage', async () => {
        const current = await detail(repository, 'access-documents-required');
        const requirement = current.requirements.find((entry) => entry.verificationStatus === 'NOT_SUBMITTED');
        if (!requirement)
            throw new Error('Missing offline upload requirement fixture');
        repository.setMockNetworkAvailable(false);
        const result = await repository.uploadDocument({
            residenceAccessId: current.accessRecord.residenceAccessId,
            requirementId: requirement.requirementId,
            selection: {
                uri: 'file:///secure/recoverable-document.pdf',
                fileName: 'recoverable-document.pdf',
                mimeType: 'application/pdf',
                fileSizeBytes: 220000,
                side: 'SINGLE'
            },
            idempotencyKey: 'offline-recovery'
        });
        expect(result.ok).toBe(false);
        const recovered = await repository.getRecoveredUploads(current.accessRecord.residenceAccessId);
        expect(recovered).toHaveLength(1);
        expect(getRequiredItem(recovered, 0, "MockResidenceAccessRepository.test.ts")?.requirementId).toBe(requirement.requirementId);
    });
    it('cancels an in-flight upload without creating a document or recovery entry', async () => {
        const current = await detail(repository, 'access-upload-retry');
        const requirement = current.requirements.find((entry) => entry.verificationStatus === 'NOT_SUBMITTED');
        if (!requirement)
            throw new Error('Missing cancellable upload requirement fixture');
        const controller = new AbortController();
        const upload = repository.uploadDocument({
            residenceAccessId: current.accessRecord.residenceAccessId,
            requirementId: requirement.requirementId,
            selection: {
                uri: 'file:///secure/cancelled-document.pdf',
                fileName: 'cancelled-document.pdf',
                mimeType: 'application/pdf',
                fileSizeBytes: 220000,
                side: 'SINGLE'
            },
            idempotencyKey: 'cancel-upload',
            signal: controller.signal
        });
        controller.abort();
        const result = await upload;
        expect(result.ok).toBe(false);
        if (!result.ok)
            expect(result.error.code).toBe('UPLOAD_CANCELLED');
        expect(await repository.getRecoveredUploads(current.accessRecord.residenceAccessId)).toHaveLength(0);
        const refreshed = await detail(repository, current.accessRecord.residenceAccessId);
        expect(refreshed.documents.some((document) => document.requirementId === requirement.requirementId)).toBe(false);
    });
    it('prevents duplicate claims and routes another resident through owner consent for an occupied unit', async () => {
        const duplicate = await repository.linkResidence({
            userId: mockResidenceAccessUsers.defaultUserId,
            method: 'UNIT_DETAILS',
            societyIdentifier: 'society-gv',
            unitNumber: 'A-1204',
            role: 'OWNER',
            idempotencyKey: 'duplicate-link'
        });
        expect(duplicate.ok).toBe(false);
        if (!duplicate.ok)
            expect(duplicate.error.code).toBe('DUPLICATE_REQUEST');
        const occupied = requireSuccess(await repository.linkResidence({
            userId: mockResidenceAccessUsers.emptyUserId,
            method: 'INVITE_CODE',
            societyIdentifier: 'society-gv',
            unitNumber: 'A-1204',
            role: 'TENANT',
            idempotencyKey: 'occupied-link'
        }));
        expect(occupied.accessRecord.status).toBe('OWNER_CONSENT_REQUIRED');
        expect(occupied.accessRecord.blockers).toContain('DUPLICATE_ACTIVE_OCCUPANCY');
        expect(occupied.ownerConsent?.maskedOwnerName).toBe('Registered owner');
    });
    it('creates role-specific verification requirements for an unoccupied linked home', async () => {
        const linked = requireSuccess(await repository.linkResidence({
            userId: mockResidenceAccessUsers.emptyUserId,
            method: 'QR_CODE',
            societyIdentifier: 'NEW-SOCIETY',
            unitNumber: 'T-901',
            role: 'TENANT',
            relationshipDescription: 'Registered tenant',
            idempotencyKey: 'new-tenant-home'
        }));
        expect(linked.accessRecord.status).toBe('DOCUMENTS_REQUIRED');
        expect(linked.requirements.map((requirement) => requirement.documentType)).toEqual([
            'IDENTITY_PROOF',
            'RENT_AGREEMENT',
            'TENANT_KYC',
        ]);
        expect(linked.eligibility.canEnterResidence).toBe(false);
    });
    it('Scenario H accepts requirements in SUBMITTED status during correction resubmit', async () => {
        const initial = await detail(repository, 'access-document-correction');
        const decision = getRequiredItem(initial.decisions, 0, "MockResidenceAccessRepository.test.ts");
        if (!decision)
            throw new Error('Missing document correction decision fixture');
        const affected = initial.requirements.find((requirement) => decision.affectedRequirementIds.includes(requirement.requirementId));
        if (!affected)
            throw new Error('Missing affected requirement fixture');
        await uploadRequirement(repository, initial.accessRecord.residenceAccessId, affected, 99);
        const afterUpload = await detail(repository, initial.accessRecord.residenceAccessId);
        const uploadedReq = afterUpload.requirements.find((r) => r.requirementId === affected.requirementId);
        expect(uploadedReq?.verificationStatus).toBe('UPLOADED');
        const first = requireSuccess(await repository.resubmitCorrection({
            residenceAccessId: initial.accessRecord.residenceAccessId,
            affectedRequirementIds: decision.affectedRequirementIds,
            idempotencyKey: 'scenario-h-resubmit-1'
        }));
        expect(first.accessRecord.status).toBe('DOCUMENTS_UNDER_REVIEW');
        const underReviewReq = first.requirements.find((r) => r.requirementId === affected.requirementId);
        expect(underReviewReq?.verificationStatus).toBe('UNDER_REVIEW');
        const idempotentRetry = requireSuccess(await repository.resubmitCorrection({
            residenceAccessId: initial.accessRecord.residenceAccessId,
            affectedRequirementIds: decision.affectedRequirementIds,
            idempotencyKey: 'scenario-h-resubmit-1'
        }));
        expect(idempotentRetry.accessRecord.status).toBe('DOCUMENTS_UNDER_REVIEW');
    });
});

