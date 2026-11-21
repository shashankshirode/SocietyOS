import * as SecureStore from 'expo-secure-store';
import { repositoryErrorMessages, residenceAccessMessages, residenceDocumentTypeLabels, } from '../../../messages/en/residenceAccess.messages';
import { resolveResidenceAccessEligibility } from '../services/ResidenceAccessEligibilityService';
import { resolveResidenceActions, compareResidenceAccessItems } from '../services/ResidenceAccessPresentationService';
import { residenceAccessTransitionService } from '../services/ResidenceAccessTransitionService';
import { resolveResidenceExpiryReminder } from '../services/ResidenceExpiryReminderService';
import type { LinkResidenceInput, OwnerConsentRequest, ResidenceAccessActor, ResidenceAccessAppeal, ResidenceAccessCommand, ResidenceAccessDecision, ResidenceAccessDetail, ResidenceAccessListItem, ResidenceAccessListQuery, ResidenceAccessNotification, ResidenceAccessPage, ResidenceAccessRecord, ResidenceAccessRepositoryErrorCode, ResidenceAccessResult, ResidenceAccessTimelineEvent, ResidenceAppealInput, ResidenceApprovalReminder, ResidenceCorrectionSubmissionInput, ResidenceDocument, ResidenceDocumentMimeType, ResidenceDocumentRequirement, ResidenceDocumentUploadInput, ResidenceOwnerConsentInput, ResidenceReactivationInput, ResidenceReactivationRequest, ResidenceRecoveredUpload, ResidenceSummary, ResidenceSuspensionRecord, ResidenceSuspensionResolutionInput, SendResidenceReminderInput, SocietyAccessReviewTask, SubmitResidenceAccessInput, } from '../models/residenceAccess.types';
import type { ResidenceAccessRepository, ResidenceAccessRepositoryListener, ResidenceAccessRepositorySnapshot, } from './residenceAccess.repository.types';
import { createMockResidenceAccessData } from './mockResidenceAccessData';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
const residentActor: ResidenceAccessActor = {
    actorType: 'RESIDENT',
    actorId: 'resident-001',
    actorDisplayRole: 'Resident'
};
const societyActor: ResidenceAccessActor = {
    actorType: 'SOCIETY_ADMIN',
    actorId: 'society-office-mock',
    actorDisplayRole: 'Society Office'
};
const ownerActor: ResidenceAccessActor = {
    actorType: 'OWNER',
    actorId: 'registered-owner-mock',
    actorDisplayRole: 'Registered owner'
};
const systemActor: ResidenceAccessActor = {
    actorType: 'SYSTEM',
    actorId: 'societyos-system',
    actorDisplayRole: 'SocietyOS'
};
const recoveredUploadPrefix = 'societyos.residence-access.pending-upload.';
const completedDocumentStatuses = new Set(['UPLOADED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED']);
const acceptedUploadDocumentStatuses = new Set(['UPLOADED', 'VERIFIED']);
function success<T>(data: T): ResidenceAccessResult<T> {
    return { ok: true, data };
}
function failure<T>(code: ResidenceAccessRepositoryErrorCode, retryable: boolean, options?: {
    readonly field?: string;
    readonly retryAfter?: string;
}): ResidenceAccessResult<T> {
    return {
        ok: false,
        error: {
            code,
            message: repositoryErrorMessages[code],
            retryable,
            ...includeWhenPresent("field", options?.field),
            ...includeWhenPresent("retryAfter", options?.retryAfter)
        }
    };
}
function errorResult<T>(code: ResidenceAccessRepositoryErrorCode, retryable: boolean, options?: {
    readonly field?: string;
    readonly retryAfter?: string;
}): ResidenceAccessResult<T> {
    return failure<T>(code, retryable, options);
}
function delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
function isAcceptedMimeType(value: string): value is ResidenceDocumentMimeType {
    return value === 'image/jpeg' || value === 'image/png' || value === 'image/heic' || value === 'application/pdf';
}
function uploadStorageKey(residenceAccessId: string, requirementId: string): string {
    return `${recoveredUploadPrefix}${residenceAccessId}.${requirementId}`;
}
function serializeRecoveredUpload(input: ResidenceDocumentUploadInput): string {
    const values = [
        input.residenceAccessId,
        input.requirementId,
        input.selection.uri,
        input.selection.fileName,
        input.selection.mimeType,
        String(input.selection.fileSizeBytes),
        input.selection.side,
        input.expiryDate ?? '',
    ];
    return values.map((value) => encodeURIComponent(value)).join('|');
}
async function persistRecoveredUpload(input: ResidenceDocumentUploadInput): Promise<void> {
    try {
        await SecureStore.setItemAsync(uploadStorageKey(input.residenceAccessId, input.requirementId), serializeRecoveredUpload(input));
    }
    catch {
    }
}
async function removeRecoveredUpload(residenceAccessId: string, requirementId: string): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(uploadStorageKey(residenceAccessId, requirementId));
    }
    catch {
    }
}
function deserializeRecoveredUpload(value: string): ResidenceRecoveredUpload | null {
    const parts = value.split('|').map((part) => decodeURIComponent(part));
    if (parts.length !== 8) {
        return null;
    }
    const [residenceAccessId, requirementId, uri, fileName, mimeType, sizeValue, side, expiryDate] = parts;
    const fileSizeBytes = Number(sizeValue);
    if (!residenceAccessId ||
        !requirementId ||
        !uri ||
        !fileName ||
        !mimeType ||
        !isAcceptedMimeType(mimeType) ||
        !Number.isFinite(fileSizeBytes) ||
        fileSizeBytes < 0 ||
        (side !== 'SINGLE' && side !== 'FRONT' && side !== 'BACK')) {
        return null;
    }
    return {
        residenceAccessId,
        requirementId,
        selection: { uri, fileName, mimeType, fileSizeBytes, side },
        ...includeWhenPresent("expiryDate", expiryDate || undefined)
    };
}
function nowIso(): string {
    return new Date().toISOString();
}
function createEvent(residenceAccessId: string, eventType: ResidenceAccessTimelineEvent['eventType'], title: string, description: string, actor: ResidenceAccessActor, relatedTaskId?: string, relatedDocumentId?: string): ResidenceAccessTimelineEvent {
    return {
        eventId: `event-${eventType.toLocaleLowerCase()}-${Date.now()}`,
        residenceAccessId,
        eventType,
        title,
        residentVisibleDescription: description,
        occurredAt: nowIso(),
        actorType: actor.actorType,
        actorDisplayRole: actor.actorDisplayRole,
        ...includeWhenPresent("relatedTaskId", relatedTaskId),
        ...includeWhenPresent("relatedDocumentId", relatedDocumentId),
        residentVisible: true
    };
}
function createLinkedResidenceRequirements(record: ResidenceAccessRecord): readonly ResidenceDocumentRequirement[] {
    const documentTypes: readonly ResidenceDocumentRequirement['documentType'][] = record.role === 'OWNER' || record.role === 'CO_OWNER'
        ? ['IDENTITY_PROOF', 'OWNERSHIP_PROOF']
        : record.role === 'TENANT'
            ? ['IDENTITY_PROOF', 'RENT_AGREEMENT', 'TENANT_KYC']
            : record.role === 'FAMILY_MEMBER' || record.role === 'MINOR'
                ? ['IDENTITY_PROOF', 'RELATIONSHIP_PROOF']
                : ['IDENTITY_PROOF', 'ADDRESS_PROOF'];
    return documentTypes.map((documentType, index) => ({
        requirementId: `requirement-${record.residenceAccessId}-${documentType.toLocaleLowerCase()}`,
        societyId: record.societyId,
        unitId: record.unitId,
        occupancyRole: record.role,
        documentType,
        title: residenceDocumentTypeLabels[documentType],
        description: `Provide ${residenceDocumentTypeLabels[documentType].toLocaleLowerCase()} for residence verification.`,
        mandatory: true,
        acceptedFileTypes: ['image/jpeg', 'image/png', 'application/pdf'],
        maximumFileSizeBytes: 8 * 1024 * 1024,
        expiryDateRequired: documentType === 'RENT_AGREEMENT',
        frontAndBackRequired: documentType === 'IDENTITY_PROOF',
        verificationStatus: 'NOT_SUBMITTED',
        displayOrder: index + 1
    }));
}
export class MockResidenceAccessRepository implements ResidenceAccessRepository {
    private summaries: ResidenceSummary[];
    private records: ResidenceAccessRecord[];
    private requirements: ResidenceDocumentRequirement[];
    private documents: ResidenceDocument[];
    private timeline: ResidenceAccessTimelineEvent[];
    private reminders: ResidenceApprovalReminder[];
    private decisions: ResidenceAccessDecision[];
    private ownerConsents: OwnerConsentRequest[];
    private suspensions: ResidenceSuspensionRecord[];
    private reactivationRequests: ResidenceReactivationRequest[];
    private appeals: ResidenceAccessAppeal[];
    private adminTasks: SocietyAccessReviewTask[];
    private notifications: ResidenceAccessNotification[];
    private listeners = new Set<ResidenceAccessRepositoryListener>();
    private submitCache = new Map<string, ResidenceAccessDetail>();
    private reminderCache = new Map<string, ResidenceAccessDetail>();
    private mutationCache = new Map<string, ResidenceAccessDetail>();
    private failedUploadAttempts = new Set<string>();
    private networkAvailable = true;
    private latencyMilliseconds = 120;
    constructor() {
        const data = createMockResidenceAccessData();
        this.summaries = [...data.summaries];
        this.records = [...data.records];
        this.requirements = [...data.requirements];
        this.documents = [...data.documents];
        this.timeline = [...data.timeline];
        this.reminders = [...data.reminders];
        this.decisions = [...data.decisions];
        this.ownerConsents = [...data.ownerConsents];
        this.suspensions = [...data.suspensions];
        this.reactivationRequests = [...data.reactivationRequests];
        this.appeals = [...data.appeals];
        this.adminTasks = [...data.adminTasks];
        this.notifications = [...data.notifications];
    }
    private notify(): void {
        this.listeners.forEach((listener) => listener());
    }
    private async waitForMockNetwork(): Promise<boolean> {
        await delay(this.latencyMilliseconds);
        return this.networkAvailable;
    }
    private findRecord(residenceAccessId: string): ResidenceAccessRecord | Absent {
        return this.records.find((record) => record.residenceAccessId === residenceAccessId);
    }
    private findResidentRecord(userId: string, residenceAccessId: string): ResidenceAccessRecord | Absent {
        return this.records.find((record) => record.residenceAccessId === residenceAccessId && record.userId === userId);
    }
    private replaceRecord(record: ResidenceAccessRecord): void {
        this.records = this.records.map((entry) => entry.residenceAccessId === record.residenceAccessId ? record : entry);
    }
    private transition(residenceAccessId: string, command: ResidenceAccessCommand): ResidenceAccessResult<ResidenceAccessRecord> {
        const current = this.findRecord(residenceAccessId);
        if (!current) {
            return errorResult('NOT_FOUND', false);
        }
        const transition = residenceAccessTransitionService.transition(current, command);
        if (!transition.allowed) {
            return errorResult('CONFLICT', false);
        }
        this.replaceRecord(transition.residenceAccess);
        return success(transition.residenceAccess);
    }
    private buildListItem(record: ResidenceAccessRecord): ResidenceAccessListItem | null {
        const residence = this.summaries.find((summary) => summary.residenceAccessId === record.residenceAccessId);
        if (!residence) {
            return null;
        }
        const requirements = this.requirements.filter((requirement) => requirement.requirementId.includes(`-${record.residenceAccessId}-`));
        const eligibility = resolveResidenceAccessEligibility(record);
        const actions = resolveResidenceActions(record, eligibility);
        return {
            residence,
            accessRecord: record,
            eligibility,
            primaryAction: actions.primaryAction,
            secondaryActions: actions.secondaryActions,
            completedRequirementCount: requirements.filter((requirement) => completedDocumentStatuses.has(requirement.verificationStatus)).length,
            totalRequirementCount: requirements.length
        };
    }
    private buildDetail(record: ResidenceAccessRecord): ResidenceAccessDetail | null {
        const listItem = this.buildListItem(record);
        if (!listItem) {
            return null;
        }
        const requirements = this.requirements
            .filter((requirement) => requirement.requirementId.includes(`-${record.residenceAccessId}-`))
            .map((requirement) => {
            const residentRequirement = { ...requirement };
            if (residentRequirement.rejectionReason) {
                residentRequirement.rejectionReason = {
                    code: residentRequirement.rejectionReason.code,
                    residentVisibleReason: residentRequirement.rejectionReason.residentVisibleReason
                };
            }
            return residentRequirement;
        })
            .sort((left, right) => left.displayOrder - right.displayOrder);
        return {
            ...listItem,
            requirements,
            documents: this.documents
                .filter((document) => document.residenceAccessId === record.residenceAccessId)
                .map((document) => ({
                ...document,
                versions: document.versions.map((version) => {
                    const residentVersion = { ...version };
                    delete residentVersion.temporaryRemoteUrl;
                    return residentVersion;
                })
            })),
            timeline: this.timeline
                .filter((event) => event.residenceAccessId === record.residenceAccessId && event.residentVisible)
                .sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime()),
            reminders: this.reminders
                .filter((reminder) => reminder.requestId === record.residenceAccessId)
                .sort((left, right) => new Date(right.sentAt).getTime() - new Date(left.sentAt).getTime()),
            decisions: this.decisions
                .filter((decision) => decision.residenceAccessId === record.residenceAccessId)
                .map((decision) => {
                const residentDecision = { ...decision };
                delete residentDecision.internalAdminNote;
                return residentDecision;
            })
                .sort((left, right) => right.requestVersion - left.requestVersion),
            ...includeWhenPresent("ownerConsent", this.ownerConsents.find((consent) => consent.residenceAccessId === record.residenceAccessId)),
            ...includeWhenPresent("suspension", (() => {
                const suspension = this.suspensions.find((entry) => entry.residenceAccessId === record.residenceAccessId);
                if (!suspension)
                    return undefined;
                const residentSuspension = { ...suspension };
                delete residentSuspension.internalAdminNote;
                return residentSuspension;
            })()),
            ...includeWhenPresent("reactivationRequest", this.reactivationRequests.find((request) => request.residenceAccessId === record.residenceAccessId)),
            ...includeWhenPresent("appeal", this.appeals.find((appeal) => appeal.residenceAccessId === record.residenceAccessId))
        };
    }
    private detailResult(record: ResidenceAccessRecord | Absent): ResidenceAccessResult<ResidenceAccessDetail> {
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const detail = this.buildDetail(record);
        return detail ? success(detail) : errorResult('NOT_FOUND', false);
    }
    async getResidences(query: ResidenceAccessListQuery): Promise<ResidenceAccessResult<ResidenceAccessPage>> {
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const search = query.searchText?.trim().toLocaleLowerCase() ?? '';
        const filtered = this.records
            .filter((record) => record.userId === query.userId)
            .map((record) => this.buildListItem(record))
            .filter((item): item is ResidenceAccessListItem => item !== null)
            .filter((item) => {
            if (query.roleFilter !== 'ALL' && item.accessRecord.role !== query.roleFilter) {
                return false;
            }
            if (search) {
                const searchable = `${item.residence.societyName} ${item.residence.unitNumber} ${item.residence.buildingName}`.toLocaleLowerCase();
                if (!searchable.includes(search)) {
                    return false;
                }
            }
            switch (query.statusFilter) {
                case 'ALL':
                    return true;
                case 'ACTIVE':
                    return item.eligibility.canEnterResidence;
                case 'ACTION_REQUIRED':
                    return item.accessRecord.residentPendingActions.length > 0;
                case 'PENDING':
                    return item.accessRecord.societyPendingActions.length > 0;
                case 'PREVIOUS':
                    return item.accessRecord.status === 'INACTIVE' || item.accessRecord.status === 'EXPIRED' || item.accessRecord.status === 'ARCHIVED';
                case 'UNAVAILABLE':
                    return item.accessRecord.status === 'REJECTED' || item.accessRecord.status === 'SUSPENDED' || item.accessRecord.status === 'ACCESS_REVOKED';
            }
        })
            .sort(compareResidenceAccessItems);
        const startIndex = query.cursor ? Number(query.cursor) : 0;
        const safeStart = Number.isFinite(startIndex) && startIndex >= 0 ? startIndex : 0;
        const items = filtered.slice(safeStart, safeStart + query.pageSize);
        const nextIndex = safeStart + items.length;
        return success({
            items,
            ...includeWhenPresent("nextCursor", nextIndex < filtered.length ? String(nextIndex) : undefined),
            totalCount: filtered.length,
            dataVersion: Math.max(0, ...filtered.map((item) => item.accessRecord.dataVersion))
        });
    }
    async getResidenceDetail(userId: string, residenceAccessId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        return this.detailResult(this.findResidentRecord(userId, residenceAccessId));
    }
    async uploadDocument(input: ResidenceDocumentUploadInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        if (input.signal?.aborted) {
            return errorResult('UPLOAD_CANCELLED', true);
        }
        if (!this.networkAvailable) {
            await persistRecoveredUpload(input);
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const eligibility = resolveResidenceAccessEligibility(record);
        if (!eligibility.canUploadDocuments && !eligibility.canResubmit) {
            return errorResult('FORBIDDEN', false);
        }
        const requirement = this.requirements.find((entry) => entry.requirementId === input.requirementId &&
            entry.societyId === record.societyId &&
            entry.unitId === record.unitId);
        if (!requirement) {
            return errorResult('NOT_FOUND', false);
        }
        if (!requirement.acceptedFileTypes.includes(input.selection.mimeType)) {
            return errorResult('UNSUPPORTED_FORMAT', false, { field: 'file' });
        }
        if (input.selection.fileSizeBytes > requirement.maximumFileSizeBytes) {
            return errorResult('FILE_TOO_LARGE', false, { field: 'file' });
        }
        if (input.selection.fileSizeBytes <= 0 || input.selection.fileName.toLocaleLowerCase().includes('corrupt')) {
            return errorResult('CORRUPTED_FILE', false, { field: 'file' });
        }
        if (input.selection.mimeType === 'application/pdf' &&
            input.selection.fileName.toLocaleLowerCase().includes('protected')) {
            return errorResult('PASSWORD_PROTECTED_PDF', false, { field: 'file' });
        }
        const checksum = `${input.selection.fileName.toLocaleLowerCase()}-${input.selection.fileSizeBytes}`;
        const duplicate = this.documents.some((document) => document.versions.some((version) => version.checksum === checksum));
        if (duplicate) {
            return errorResult('CONFLICT', false, { field: 'file' });
        }
        await persistRecoveredUpload(input);
        this.requirements = this.requirements.map((entry) => entry.requirementId === input.requirementId
            ? { ...entry, verificationStatus: 'UPLOADING' }
            : entry);
        for (const progress of [5, 24, 48, 72, 92]) {
            input.onProgress?.(progress);
            await delay(36);
            if (input.signal?.aborted) {
                this.requirements = this.requirements.map((entry) => entry.requirementId === input.requirementId
                    ? { ...entry, verificationStatus: 'NOT_SUBMITTED' }
                    : entry);
                await removeRecoveredUpload(input.residenceAccessId, input.requirementId);
                this.notify();
                return errorResult('UPLOAD_CANCELLED', true);
            }
        }
        const failureKey = `${input.residenceAccessId}:${input.requirementId}`;
        if (input.residenceAccessId === 'access-upload-retry' &&
            input.requirementId.includes('tenant_kyc') &&
            !this.failedUploadAttempts.has(failureKey)) {
            this.failedUploadAttempts.add(failureKey);
            this.requirements = this.requirements.map((entry) => entry.requirementId === input.requirementId
                ? { ...entry, verificationStatus: 'NOT_SUBMITTED' }
                : entry);
            this.notify();
            return errorResult('UPLOAD_FAILED', true);
        }
        const existingDocument = this.documents.find((document) => document.requirementId === input.requirementId);
        const documentId = existingDocument?.documentId ?? `document-${input.requirementId}`;
        const versionNumber = (existingDocument?.versions.length ?? 0) + 1;
        const versionId = `version-${documentId}-${versionNumber}`;
        const newVersion = {
            versionId,
            documentId,
            versionNumber,
            fileName: input.selection.fileName,
            mimeType: input.selection.mimeType,
            fileSizeBytes: input.selection.fileSizeBytes,
            localUri: input.selection.uri,
            submittedAt: nowIso(),
            verificationStatus: 'UPLOADED' as const,
            checksum,
            side: input.selection.side
        };
        if (existingDocument) {
            this.documents = this.documents.map((document) => document.documentId === existingDocument.documentId
                ? {
                    ...document,
                    currentVersionId: versionId,
                    versions: [...document.versions, newVersion]
                }
                : document);
        }
        else {
            this.documents = [
                ...this.documents,
                {
                    documentId,
                    residenceAccessId: record.residenceAccessId,
                    requirementId: input.requirementId,
                    societyId: record.societyId,
                    unitId: record.unitId,
                    occupancyId: record.occupancyId,
                    currentVersionId: versionId,
                    versions: [newVersion]
                },
            ];
        }
        const updatedDocument = this.documents.find((document) => document.documentId === documentId);
        const hasFront = updatedDocument?.versions.some((version) => version.side === 'FRONT') ?? false;
        const hasBack = updatedDocument?.versions.some((version) => version.side === 'BACK') ?? false;
        const requirementReady = !requirement.frontAndBackRequired || (hasFront && hasBack);
        this.requirements = this.requirements.map((entry) => entry.requirementId === input.requirementId
            ? {
                ...entry,
                verificationStatus: requirementReady ? 'UPLOADED' : 'NOT_SUBMITTED',
                ...includeWhenPresent("rejectionReason", undefined),
                submittedDocumentId: documentId,
                submittedAt: newVersion.submittedAt,
                ...includeWhenPresent("expiryDate", input.expiryDate)
            }
            : entry);
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, existingDocument ? 'DOCUMENT_RESUBMITTED' : 'DOCUMENT_UPLOADED', existingDocument ? 'Document replaced' : 'Document uploaded', `${requirement.title} was uploaded and saved as version ${versionNumber}.`, residentActor, undefined, documentId),
        ];
        this.notifications = [
            ...this.notifications,
            {
                notificationId: `notification-upload-${Date.now()}`,
                userId: record.userId,
                residenceAccessId: record.residenceAccessId,
                type: 'DOCUMENT_UPLOADED',
                title: 'Document uploaded',
                body: `${requirement.title} is ready for residence review.`,
                createdAt: nowIso(),
                deepLinkDestination: 'DOCUMENT_REQUIREMENTS'
            },
        ];
        input.onProgress?.(100);
        await removeRecoveredUpload(input.residenceAccessId, input.requirementId);
        this.notify();
        return this.detailResult(this.findRecord(record.residenceAccessId));
    }
    async removeDocument(userId: string, residenceAccessId: string, documentId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findResidentRecord(userId, residenceAccessId);
        const document = this.documents.find((entry) => entry.documentId === documentId && entry.residenceAccessId === residenceAccessId);
        if (!record || !document) {
            return errorResult('NOT_FOUND', false);
        }
        const requirement = this.requirements.find((entry) => entry.requirementId === document.requirementId);
        if (!requirement || requirement.verificationStatus !== 'UPLOADED') {
            return errorResult('FORBIDDEN', false);
        }
        this.documents = this.documents.filter((entry) => entry.documentId !== documentId);
        this.requirements = this.requirements.map((entry) => entry.requirementId === requirement.requirementId
            ? {
                ...entry,
                verificationStatus: 'NOT_SUBMITTED',
                ...includeWhenPresent("submittedDocumentId", undefined),
                ...includeWhenPresent("submittedAt", undefined),
                ...includeWhenPresent("expiryDate", undefined)
            }
            : entry);
        this.notify();
        return this.detailResult(record);
    }
    async getRecoveredUploads(residenceAccessId: string): Promise<readonly ResidenceRecoveredUpload[]> {
        const requirementIds = this.requirements
            .filter((requirement) => requirement.requirementId.includes(`-${residenceAccessId}-`))
            .map((requirement) => requirement.requirementId);
        const entries = await Promise.all(requirementIds.map(async (requirementId) => {
            try {
                return await SecureStore.getItemAsync(uploadStorageKey(residenceAccessId, requirementId));
            }
            catch {
                return null;
            }
        }));
        return entries
            .map((value) => (value ? deserializeRecoveredUpload(value) : null))
            .filter((entry): entry is ResidenceRecoveredUpload => entry !== null);
    }
    async submitForReview(input: SubmitResidenceAccessInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.submitCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        if (!input.declarationsAccepted || !input.rulesAcknowledged || !input.consentAccepted) {
            return errorResult('VALIDATION_FAILED', false, { field: 'declarations' });
        }
        const requirements = this.requirements.filter((requirement) => requirement.requirementId.includes(`-${record.residenceAccessId}-`));
        const missingMandatory = requirements.some((requirement) => requirement.mandatory && !acceptedUploadDocumentStatuses.has(requirement.verificationStatus));
        if (missingMandatory) {
            return errorResult('VALIDATION_FAILED', false, { field: 'documents' });
        }
        if (record.status !== 'DOCUMENTS_REQUIRED') {
            return errorResult('DUPLICATE_REQUEST', false);
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'SUBMIT_FOR_REVIEW',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const taskId = `task-new-access-${Date.now()}`;
        const submittedAt = nowIso();
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: ['ADMIN_REVIEW_PENDING'],
            residentPendingActions: [],
            societyPendingActions: ['Review submitted identity and documents', 'Publish an access decision'],
            completedSteps: [...transition.data.completedSteps, 'All mandatory documents uploaded', 'Request submitted'],
            submittedAt,
            expectedReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            canWithdraw: true,
            statusReason: residenceAccessMessages.seed.approvalPendingReason
        };
        this.replaceRecord(updatedRecord);
        this.requirements = this.requirements.map((requirement) => requirement.requirementId.includes(`-${record.residenceAccessId}-`) && requirement.verificationStatus === 'UPLOADED'
            ? { ...requirement, verificationStatus: 'UNDER_REVIEW' }
            : requirement);
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'NEW_ACCESS_REQUEST',
                priority: 'NORMAL',
                status: 'OPEN',
                createdAt: submittedAt,
                ...includeWhenPresent("dueAt", updatedRecord.expectedReviewAt)
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'SUBMITTED_FOR_REVIEW', 'Submitted for society review', `Request ${record.referenceNumber} was submitted successfully.`, residentActor, taskId),
        ];
        this.notifications = [
            ...this.notifications,
            {
                notificationId: `notification-submitted-${Date.now()}`,
                userId: record.userId,
                residenceAccessId: record.residenceAccessId,
                type: 'REQUEST_SUBMITTED',
                title: residenceAccessMessages.review.successTitle,
                body: residenceAccessMessages.review.successBody,
                createdAt: submittedAt,
                deepLinkDestination: 'APPROVAL_PROGRESS'
            },
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.submitCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async sendReminder(input: SendResidenceReminderInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.reminderCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const eligibility = resolveResidenceAccessEligibility(record);
        if (!eligibility.canSendReminder) {
            return errorResult('FORBIDDEN', false);
        }
        const sortedReminders = this.reminders
            .filter((reminder) => reminder.requestId === record.residenceAccessId)
            .sort((left, right) => new Date(right.sentAt).getTime() - new Date(left.sentAt).getTime());
        const latestReminder = sortedReminders.length > 0 ? sortedReminders[0] : undefined;
        if (latestReminder && new Date(latestReminder.nextAllowedReminderAt).getTime() > Date.now()) {
            return errorResult('REMINDER_COOLDOWN', false, {
                retryAfter: latestReminder.nextAllowedReminderAt
            });
        }
        if (record.expectedReviewAt &&
            new Date(record.expectedReviewAt).getTime() > Date.now() &&
            input.reason === 'REVIEW_DELAYED') {
            return errorResult('VALIDATION_FAILED', false, { field: 'reason' });
        }
        const sentAt = nowIso();
        const nextAllowedReminderAt = new Date(Date.now() + record.reminderCooldownHours * 60 * 60 * 1000).toISOString();
        const reminder: ResidenceApprovalReminder = {
            reminderId: `reminder-${Date.now()}`,
            requestId: record.residenceAccessId,
            societyId: record.societyId,
            unitId: record.unitId,
            sentByUserId: record.userId,
            sentAt,
            reason: input.reason,
            ...includeWhenPresent("optionalMessage", input.optionalMessage?.trim() || undefined),
            deliveryStatus: 'DELIVERED',
            nextAllowedReminderAt
        };
        const taskId = `task-reminder-${Date.now()}`;
        this.reminders = [...this.reminders, reminder];
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'RESIDENT_REMINDER',
                priority: input.reason === 'MOVE_IN_DATE_APPROACHING' || input.reason === 'URGENT_VISITOR_ACCESS_REQUIRED'
                    ? 'URGENT'
                    : 'NORMAL',
                status: 'OPEN',
                createdAt: sentAt,
                ...includeWhenPresent("residentMessage", reminder.optionalMessage)
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'REMINDER_SENT', 'Reminder delivered', 'A contextual reminder was delivered to the Society Office.', residentActor, taskId),
        ];
        this.notifications = [
            ...this.notifications,
            {
                notificationId: `notification-reminder-${Date.now()}`,
                userId: record.userId,
                residenceAccessId: record.residenceAccessId,
                type: 'REMINDER_DELIVERED',
                title: residenceAccessMessages.reminder.successTitle,
                body: residenceAccessMessages.reminder.nextAllowed(nextAllowedReminderAt),
                createdAt: sentAt,
                deepLinkDestination: 'APPROVAL_PROGRESS'
            },
        ];
        const refreshedRecord = {
            ...record,
            statusUpdatedAt: sentAt,
            dataVersion: record.dataVersion + 1
        };
        this.replaceRecord(refreshedRecord);
        const detail = this.buildDetail(refreshedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.reminderCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async requestOwnerConsent(input: ResidenceOwnerConsentInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const currentConsent = this.ownerConsents.find((consent) => consent.residenceAccessId === record.residenceAccessId);
        if (!currentConsent) {
            return errorResult('NOT_FOUND', false);
        }
        if (currentConsent.nextResendAllowedAt &&
            new Date(currentConsent.nextResendAllowedAt).getTime() > Date.now()) {
            return errorResult('RATE_LIMITED', false, {
                retryAfter: currentConsent.nextResendAllowedAt
            });
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'OWNER_CONSENT_SENT',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const requestedAt = nowIso();
        const nextResendAllowedAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        this.ownerConsents = this.ownerConsents.map((consent) => consent.residenceAccessId === record.residenceAccessId
            ? {
                ...consent,
                status: 'REQUESTED',
                requestedAt,
                nextResendAllowedAt,
                expiresAt
            }
            : consent);
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: ['OWNER_CONSENT_MISSING'],
            residentPendingActions: [],
            societyPendingActions: ['Wait for the registered owner to decide the consent request'],
            statusReason: residenceAccessMessages.consent.pendingBody
        };
        this.replaceRecord(updatedRecord);
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'OWNER_CONSENT_REQUESTED', 'Owner consent requested', `A secure consent request was sent using ${input.deliveryMethod.toLocaleLowerCase().replace('_', ' ')}.`, residentActor),
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async resubmitCorrection(input: ResidenceCorrectionSubmissionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record || !record.correctionAllowed) {
            return errorResult(record ? 'FORBIDDEN' : 'NOT_FOUND', false);
        }
        const correctedStatuses = new Set(['UPLOADED', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFIED']);
        const allCorrected = input.affectedRequirementIds.every((requirementId) => {
            const requirement = this.requirements.find((entry) => entry.requirementId === requirementId);
            return requirement ? correctedStatuses.has(requirement.verificationStatus) : false;
        });
        if (!allCorrected) {
            return errorResult('VALIDATION_FAILED', false, { field: 'documents' });
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'RESUBMIT',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const version = Math.max(1, ...this.decisions
            .filter((decision) => decision.residenceAccessId === record.residenceAccessId)
            .map((decision) => decision.requestVersion)) + 1;
        const taskId = `task-resubmission-${Date.now()}`;
        const submittedAt = nowIso();
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: ['ADMIN_REVIEW_PENDING'],
            residentPendingActions: [],
            societyPendingActions: ['Review the corrected document version', 'Publish a new access decision'],
            completedSteps: [...transition.data.completedSteps, `Correction version ${version} submitted`],
            submittedAt,
            expectedReviewAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            statusReason: `Correction version ${version} is under document review.`
        };
        this.replaceRecord(updatedRecord);
        this.requirements = this.requirements.map((requirement) => input.affectedRequirementIds.includes(requirement.requirementId)
            ? { ...requirement, verificationStatus: 'UNDER_REVIEW' }
            : requirement);
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'DOCUMENT_RESUBMITTED',
                priority: 'HIGH',
                status: 'OPEN',
                createdAt: submittedAt,
                ...includeWhenPresent("dueAt", updatedRecord.expectedReviewAt)
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'DOCUMENT_RESUBMITTED', residenceAccessMessages.decision.versionSubmitted(version), residenceAccessMessages.decision.historyRetained, residentActor, taskId),
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async submitAppeal(input: ResidenceAppealInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record || !record.appealAllowed) {
            return errorResult(record ? 'FORBIDDEN' : 'NOT_FOUND', false);
        }
        if (!input.acknowledgementAccepted || input.reason.trim().length < 8) {
            return errorResult('VALIDATION_FAILED', false, { field: 'appealReason' });
        }
        const existing = this.appeals.find((appeal) => appeal.residenceAccessId === record.residenceAccessId &&
            (appeal.status === 'SUBMITTED' || appeal.status === 'UNDER_REVIEW'));
        if (existing) {
            return errorResult('DUPLICATE_REQUEST', false);
        }
        const submittedAt = nowIso();
        let supportingDocumentId = input.supportingDocumentId;
        if (input.supportingDocument) {
            if (input.supportingDocument.fileSizeBytes <= 0) {
                return errorResult('CORRUPTED_FILE', false, { field: 'supportingDocument' });
            }
            if (input.supportingDocument.fileSizeBytes > 8 * 1024 * 1024) {
                return errorResult('FILE_TOO_LARGE', false, { field: 'supportingDocument' });
            }
            if (input.supportingDocument.mimeType === 'application/pdf' &&
                input.supportingDocument.fileName.toLocaleLowerCase().includes('protected')) {
                return errorResult('PASSWORD_PROTECTED_PDF', false, { field: 'supportingDocument' });
            }
            const checksum = `${input.supportingDocument.fileName.toLocaleLowerCase()}-${input.supportingDocument.fileSizeBytes}`;
            const duplicateDocument = this.documents.some((document) => document.versions.some((version) => version.checksum === checksum));
            if (duplicateDocument) {
                return errorResult('CONFLICT', false, { field: 'supportingDocument' });
            }
            supportingDocumentId = `document-appeal-${Date.now()}`;
            const versionId = `version-${supportingDocumentId}-1`;
            this.documents = [
                ...this.documents,
                {
                    documentId: supportingDocumentId,
                    residenceAccessId: record.residenceAccessId,
                    requirementId: `appeal-support-${record.residenceAccessId}`,
                    societyId: record.societyId,
                    unitId: record.unitId,
                    occupancyId: record.occupancyId,
                    currentVersionId: versionId,
                    versions: [{
                            versionId,
                            documentId: supportingDocumentId,
                            versionNumber: 1,
                            fileName: input.supportingDocument.fileName,
                            mimeType: input.supportingDocument.mimeType,
                            fileSizeBytes: input.supportingDocument.fileSizeBytes,
                            localUri: input.supportingDocument.uri,
                            submittedAt,
                            verificationStatus: 'SUBMITTED',
                            checksum,
                            side: input.supportingDocument.side
                        }]
                },
            ];
        }
        const appeal: ResidenceAccessAppeal = {
            appealId: `appeal-${Date.now()}`,
            residenceAccessId: record.residenceAccessId,
            reason: input.reason.trim(),
            ...includeWhenPresent("explanation", input.explanation?.trim() || undefined),
            ...includeWhenPresent("supportingDocumentId", supportingDocumentId),
            status: 'SUBMITTED',
            submittedAt
        };
        const taskId = `task-appeal-${Date.now()}`;
        this.appeals = [...this.appeals, appeal];
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'APPEAL_SUBMITTED',
                priority: 'HIGH',
                status: 'OPEN',
                createdAt: submittedAt,
                ...includeWhenPresent("residentMessage", appeal.explanation)
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'APPEAL_SUBMITTED', residenceAccessMessages.appeal.submitted, residenceAccessMessages.appeal.reviewNotice, residentActor, taskId),
        ];
        const updatedRecord = {
            ...record,
            societyPendingActions: ['Review the reconsideration request'],
            statusUpdatedAt: submittedAt,
            dataVersion: record.dataVersion + 1
        };
        this.replaceRecord(updatedRecord);
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async submitSuspensionResolution(input: ResidenceSuspensionResolutionInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record || record.status !== 'SUSPENDED') {
            return errorResult(record ? 'CONFLICT' : 'NOT_FOUND', false);
        }
        if (input.explanation.trim().length < 10) {
            return errorResult('VALIDATION_FAILED', false, { field: 'explanation' });
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'SUBMIT_SUSPENSION_RESOLUTION',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const taskId = `task-suspension-resolution-${Date.now()}`;
        const submittedAt = nowIso();
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: ['ADMIN_REVIEW_PENDING'],
            residentPendingActions: [],
            societyPendingActions: ['Review the submitted suspension resolution'],
            completedSteps: [...transition.data.completedSteps, 'Suspension resolution submitted'],
            statusReason: residenceAccessMessages.suspension.successBody,
            submittedAt,
            expectedReviewAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        };
        this.replaceRecord(updatedRecord);
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'SUSPENSION_RESOLUTION',
                priority: 'HIGH',
                status: 'OPEN',
                createdAt: submittedAt,
                residentMessage: input.explanation.trim()
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'CLARIFICATION_SUBMITTED', residenceAccessMessages.suspension.successTitle, residenceAccessMessages.suspension.successBody, residentActor, taskId),
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async requestReactivation(input: ResidenceReactivationInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findRecord(input.residenceAccessId);
        if (!record || !record.reactivationAllowed) {
            return errorResult(record ? 'FORBIDDEN' : 'NOT_FOUND', false);
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'REQUEST_REACTIVATION',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const taskId = `task-reactivation-${Date.now()}`;
        const submittedAt = nowIso();
        const reactivation: ResidenceReactivationRequest = {
            requestId: `reactivation-${Date.now()}`,
            residenceAccessId: record.residenceAccessId,
            requestedByUserId: record.userId,
            reason: input.reason,
            supportingDocumentIds: [...input.supportingDocumentIds],
            ...includeWhenPresent("residentMessage", input.residentMessage?.trim() || undefined),
            status: 'SUBMITTED',
            submittedAt
        };
        this.reactivationRequests = [
            ...this.reactivationRequests.filter((entry) => entry.residenceAccessId !== record.residenceAccessId),
            reactivation,
        ];
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: ['ADMIN_REVIEW_PENDING'],
            residentPendingActions: [],
            societyPendingActions: ['Review the reactivation request', 'Verify supporting documents'],
            completedSteps: [...transition.data.completedSteps, 'Reactivation request submitted'],
            statusReason: residenceAccessMessages.expiry.submittedBody,
            submittedAt,
            expectedReviewAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
        };
        this.replaceRecord(updatedRecord);
        this.adminTasks = [
            ...this.adminTasks,
            {
                taskId,
                societyId: record.societyId,
                unitId: record.unitId,
                occupancyId: record.occupancyId,
                residentUserId: record.userId,
                requestId: record.residenceAccessId,
                taskType: 'REACTIVATION_REQUEST',
                priority: 'HIGH',
                status: 'OPEN',
                createdAt: submittedAt,
                ...includeWhenPresent("residentMessage", reactivation.residentMessage)
            },
        ];
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'REACTIVATION_REQUESTED', residenceAccessMessages.expiry.submittedTitle, residenceAccessMessages.expiry.submittedBody, residentActor, taskId),
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async linkResidence(input: LinkResidenceInput): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(input.idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const normalizedSociety = input.societyIdentifier.trim().toLocaleLowerCase();
        const normalizedUnit = input.unitNumber.trim().toLocaleLowerCase();
        const duplicate = this.records.some((record) => {
            const summary = this.summaries.find((entry) => entry.residenceAccessId === record.residenceAccessId);
            return (record.userId === input.userId &&
                summary?.unitNumber.toLocaleLowerCase() === normalizedUnit &&
                (summary.societyId.toLocaleLowerCase() === normalizedSociety ||
                    summary.societyName.toLocaleLowerCase() === normalizedSociety));
        });
        if (duplicate) {
            return errorResult('DUPLICATE_REQUEST', false);
        }
        if (!normalizedSociety || !normalizedUnit) {
            return errorResult('VALIDATION_FAILED', false, { field: 'residence' });
        }
        const conflictingOccupancy = this.records.some((record) => {
            const summary = this.summaries.find((entry) => entry.residenceAccessId === record.residenceAccessId);
            const sameResidence = summary &&
                summary.unitNumber.toLocaleLowerCase() === normalizedUnit &&
                (summary.societyId.toLocaleLowerCase() === normalizedSociety ||
                    summary.societyName.toLocaleLowerCase() === normalizedSociety);
            return Boolean(sameResidence &&
                record.userId !== input.userId &&
                (record.status === 'ACTIVE' || record.status === 'TEMPORARILY_RESTRICTED') &&
                (record.role === 'OWNER' || record.role === 'CO_OWNER' || record.role === 'TENANT'));
        });
        const residenceAccessId = `access-linked-${Date.now()}`;
        const societyId = normalizedSociety.replace(/[^a-z0-9]+/g, '-');
        const unitId = `unit-${societyId}-${normalizedUnit.replace(/[^a-z0-9]+/g, '-')}`;
        const summary: ResidenceSummary = {
            residenceAccessId,
            societyId,
            societyName: input.societyIdentifier.trim().toLocaleUpperCase(),
            unitId,
            unitNumber: input.unitNumber.trim().toLocaleUpperCase(),
            buildingName: 'Residence verification',
            city: 'Society location pending',
            role: input.role,
            image: {
                fallbackIcon: 'home-outline',
                accessibilityLabel: 'Linked residence awaiting verification'
            },
            officePhoneMasked: '+91 ••••• ••000',
            officeEmail: 'office@societyos.example',
            supportHours: 'Society Office hours are provided after verification',
            escalationChannel: 'Contact SocietyOS support if the society identifier cannot be verified'
        };
        const discoveredRecord: ResidenceAccessRecord = {
            residenceAccessId,
            userId: input.userId,
            societyId,
            unitId,
            occupancyId: `occupancy-${residenceAccessId}`,
            role: input.role,
            status: 'DISCOVERED',
            blockers: ['IDENTITY_NOT_COMPLETE'],
            statusReason: 'The residence claim was created and identity details are required.',
            residentPendingActions: ['Confirm identity and occupancy details'],
            societyPendingActions: [],
            completedSteps: ['Residence claim created'],
            statusUpdatedAt: nowIso(),
            requestCreatedAt: nowIso(),
            referenceNumber: `RES-${societyId.toLocaleUpperCase()}-${Date.now()}`,
            canWithdraw: true,
            correctionAllowed: false,
            appealAllowed: false,
            reactivationAllowed: false,
            reminderCooldownHours: 24,
            featureRestrictions: [],
            dataVersion: 1
        };
        this.summaries = [...this.summaries, summary];
        this.records = [...this.records, discoveredRecord];
        const claimStarted = this.transition(residenceAccessId, {
            type: 'START_CLAIM',
            actor: residentActor
        });
        if (!claimStarted.ok) {
            return claimStarted;
        }
        const identityRequired = this.transition(residenceAccessId, {
            type: 'START_CLAIM',
            actor: residentActor
        });
        if (!identityRequired.ok) {
            return identityRequired;
        }
        let linkedRecord = identityRequired.data;
        if (conflictingOccupancy &&
            (input.role === 'TENANT' || input.role === 'FAMILY_MEMBER' || input.role === 'AUTHORIZED_OCCUPANT')) {
            const consentRequired = this.transition(residenceAccessId, {
                type: 'REQUEST_OWNER_CONSENT',
                actor: residentActor
            });
            if (!consentRequired.ok)
                return consentRequired;
            linkedRecord = {
                ...consentRequired.data,
                blockers: ['OWNER_CONSENT_MISSING', 'DUPLICATE_ACTIVE_OCCUPANCY'],
                statusReason: residenceAccessMessages.consent.pendingBody,
                residentPendingActions: ['Request consent from the registered owner'],
                societyPendingActions: ['Verify the existing occupancy before access approval']
            };
            this.replaceRecord(linkedRecord);
            this.ownerConsents = [
                ...this.ownerConsents,
                {
                    consentRequestId: `consent-${residenceAccessId}`,
                    residenceAccessId,
                    maskedOwnerName: 'Registered owner',
                    status: 'NOT_REQUESTED',
                    alternativeOfficeVerificationAllowed: true
                },
            ];
        }
        else {
            const documentsRequired = this.transition(residenceAccessId, {
                type: 'SUBMIT_IDENTITY',
                actor: residentActor
            });
            if (!documentsRequired.ok)
                return documentsRequired;
            linkedRecord = {
                ...documentsRequired.data,
                blockers: ['MANDATORY_DOCUMENT_MISSING'],
                statusReason: residenceAccessMessages.seed.documentsRequiredReason,
                residentPendingActions: ['Upload mandatory verification documents'],
                societyPendingActions: ['Review the claim after resident submission'],
                completedSteps: ['Residence claim created', 'Identity and occupancy details submitted']
            };
            this.replaceRecord(linkedRecord);
            this.requirements = [
                ...this.requirements,
                ...createLinkedResidenceRequirements(linkedRecord),
            ];
        }
        this.timeline = [
            ...this.timeline,
            createEvent(residenceAccessId, 'REQUEST_STARTED', 'Residence claim started', residenceAccessMessages.link.successBody, residentActor),
        ];
        const detail = this.buildDetail(linkedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(input.idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async withdrawRequest(userId: string, residenceAccessId: string, idempotencyKey: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findResidentRecord(userId, residenceAccessId);
        if (!record || !record.canWithdraw) {
            return errorResult(record ? 'FORBIDDEN' : 'NOT_FOUND', false);
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'REVOKE',
            actor: residentActor
        });
        if (!transition.ok) {
            return transition;
        }
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: [],
            statusReason: 'This residence access request was withdrawn by the resident.',
            residentPendingActions: [],
            societyPendingActions: [],
            canWithdraw: false
        };
        this.replaceRecord(updatedRecord);
        this.timeline = [
            ...this.timeline,
            createEvent(record.residenceAccessId, 'REQUEST_WITHDRAWN', 'Request withdrawn', updatedRecord.statusReason, residentActor),
        ];
        const detail = this.buildDetail(updatedRecord);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async activateResidence(userId: string, residenceAccessId: string, idempotencyKey: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        const cached = this.mutationCache.get(idempotencyKey);
        if (cached) {
            return success(cached);
        }
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findResidentRecord(userId, residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        if (record.status === 'ACTIVE' || record.status === 'TEMPORARILY_RESTRICTED') {
            return this.detailResult(record);
        }
        const effectiveFrom = record.effectiveFrom ? new Date(record.effectiveFrom) : null;
        if (record.status !== 'APPROVED' ||
            (effectiveFrom && effectiveFrom.getTime() > Date.now())) {
            return errorResult('FORBIDDEN', false);
        }
        const transition = this.transition(record.residenceAccessId, {
            type: 'ACTIVATE',
            actor: systemActor
        });
        if (!transition.ok) {
            return transition;
        }
        const activated: ResidenceAccessRecord = {
            ...transition.data,
            blockers: [],
            statusReason: residenceAccessMessages.seed.activeOwnerReason,
            residentPendingActions: [],
            societyPendingActions: []
        };
        this.replaceRecord(activated);
        const detail = this.buildDetail(activated);
        if (!detail) {
            return errorResult('SERVER_ERROR', true);
        }
        this.mutationCache.set(idempotencyKey, detail);
        this.notify();
        return success(detail);
    }
    async refreshResidence(userId: string, residenceAccessId: string): Promise<ResidenceAccessResult<ResidenceAccessDetail>> {
        if (!(await this.waitForMockNetwork())) {
            return errorResult('OFFLINE', true);
        }
        const record = this.findResidentRecord(userId, residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const expiry = record.effectiveUntil ? new Date(record.effectiveUntil) : null;
        if (expiry &&
            !Number.isNaN(expiry.getTime()) &&
            expiry.getTime() <= Date.now() &&
            (record.status === 'ACTIVE' || record.status === 'TEMPORARILY_RESTRICTED')) {
            const transition = this.transition(record.residenceAccessId, {
                type: 'EXPIRE',
                actor: systemActor
            });
            if (transition.ok) {
                const expiredRecord: ResidenceAccessRecord = {
                    ...transition.data,
                    blockers: ['TENANCY_PERIOD_EXPIRED', 'DOCUMENT_EXPIRED'],
                    statusReason: residenceAccessMessages.expiry.expiredNotification,
                    residentPendingActions: ['Renew residence access'],
                    societyPendingActions: []
                };
                this.replaceRecord(expiredRecord);
                this.notifications = [
                    ...this.notifications,
                    {
                        notificationId: `expiry-${record.residenceAccessId}-0`,
                        userId: record.userId,
                        residenceAccessId: record.residenceAccessId,
                        type: 'ACCESS_EXPIRED',
                        title: residenceAccessMessages.expiry.title,
                        body: residenceAccessMessages.expiry.expiredNotification,
                        createdAt: nowIso(),
                        deepLinkDestination: 'ACCESS_RENEWAL'
                    },
                ];
                this.notify();
                return this.detailResult(expiredRecord);
            }
        }
        const expiryReminder = resolveResidenceExpiryReminder(record, this.notifications);
        if (expiryReminder) {
            this.notifications = [
                ...this.notifications,
                {
                    notificationId: `expiry-${record.residenceAccessId}-${expiryReminder.thresholdInDays}`,
                    userId: record.userId,
                    residenceAccessId: record.residenceAccessId,
                    type: 'ACCESS_EXPIRING_SOON',
                    title: residenceAccessMessages.expiry.expiringTitle,
                    body: residenceAccessMessages.expiry.expiringSoon(expiryReminder.daysRemaining),
                    createdAt: nowIso(),
                    deepLinkDestination: 'ACCESS_RENEWAL'
                },
            ];
            this.notify();
        }
        if (record.status === 'APPROVED' &&
            record.effectiveFrom &&
            new Date(record.effectiveFrom).getTime() <= Date.now()) {
            const transition = this.transition(record.residenceAccessId, {
                type: 'ACTIVATE',
                actor: systemActor
            });
            if (transition.ok) {
                this.notify();
                return this.detailResult(transition.data);
            }
        }
        return this.detailResult(record);
    }
    getOutboxSnapshot(): ResidenceAccessRepositorySnapshot {
        return {
            adminTasks: this.adminTasks.map((task) => ({ ...task })),
            reminders: this.reminders.map((reminder) => ({ ...reminder })),
            appeals: this.appeals.map((appeal) => ({ ...appeal })),
            notifications: this.notifications.map((notification) => ({ ...notification }))
        };
    }
    subscribe(listener: ResidenceAccessRepositoryListener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    setMockNetworkAvailable(available: boolean): void {
        this.networkAvailable = available;
    }
    setMockLatency(milliseconds: number): void {
        this.latencyMilliseconds = Math.max(0, milliseconds);
    }
    reset(): void {
        const data = createMockResidenceAccessData();
        this.summaries = [...data.summaries];
        this.records = [...data.records];
        this.requirements = [...data.requirements];
        this.documents = [...data.documents];
        this.timeline = [...data.timeline];
        this.reminders = [...data.reminders];
        this.decisions = [...data.decisions];
        this.ownerConsents = [...data.ownerConsents];
        this.suspensions = [...data.suspensions];
        this.reactivationRequests = [...data.reactivationRequests];
        this.appeals = [...data.appeals];
        this.adminTasks = [...data.adminTasks];
        this.notifications = [...data.notifications];
        this.submitCache.clear();
        this.reminderCache.clear();
        this.mutationCache.clear();
        this.failedUploadAttempts.clear();
        this.networkAvailable = true;
        this.notify();
    }
    simulateOwnerConsentDecision(residenceAccessId: string, approved: boolean): ResidenceAccessResult<ResidenceAccessDetail> {
        const record = this.findRecord(residenceAccessId);
        if (!record || record.status !== 'OWNER_CONSENT_PENDING') {
            return errorResult(record ? 'CONFLICT' : 'NOT_FOUND', false);
        }
        const transition = this.transition(record.residenceAccessId, {
            type: approved ? 'OWNER_CONSENT_RECEIVED' : 'REJECT',
            actor: ownerActor
        });
        if (!transition.ok) {
            return transition;
        }
        const statusReason = approved
            ? residenceAccessMessages.seed.approvalPendingReason
            : 'The registered owner declined this consent request.';
        const updatedRecord: ResidenceAccessRecord = {
            ...transition.data,
            blockers: approved ? ['ADMIN_REVIEW_PENDING'] : ['OWNER_CONSENT_MISSING'],
            statusReason,
            residentPendingActions: approved ? [] : ['Review the owner decision and contact the Society Office if needed'],
            societyPendingActions: approved ? ['Review tenancy documents and publish a decision'] : []
        };
        this.replaceRecord(updatedRecord);
        this.ownerConsents = this.ownerConsents.map((consent) => consent.residenceAccessId === residenceAccessId
            ? {
                ...consent,
                status: approved ? 'APPROVED' : 'DECLINED',
                decidedAt: nowIso(),
                ...includeWhenPresent("residentVisibleDecisionReason", approved
                    ? undefined
                    : 'The registered owner did not confirm the tenancy request.')
            }
            : consent);
        const taskId = approved ? `task-owner-consent-${Date.now()}` : undefined;
        if (approved && taskId) {
            this.adminTasks = [
                ...this.adminTasks,
                {
                    taskId,
                    societyId: record.societyId,
                    unitId: record.unitId,
                    occupancyId: record.occupancyId,
                    residentUserId: record.userId,
                    requestId: record.residenceAccessId,
                    taskType: 'OWNER_CONSENT_RECEIVED',
                    priority: 'NORMAL',
                    status: 'OPEN',
                    createdAt: nowIso()
                },
            ];
        }
        this.timeline = [
            ...this.timeline,
            createEvent(residenceAccessId, approved ? 'OWNER_CONSENT_RECEIVED' : 'REQUEST_STARTED', approved ? 'Owner consent received' : 'Owner consent declined', statusReason, ownerActor, taskId),
        ];
        this.notify();
        return this.detailResult(updatedRecord);
    }
    simulateSocietyDecision(residenceAccessId: string, approved: boolean): ResidenceAccessResult<ResidenceAccessDetail> {
        const record = this.findRecord(residenceAccessId);
        if (!record) {
            return errorResult('NOT_FOUND', false);
        }
        const decisionTransition = this.transition(record.residenceAccessId, {
            type: approved ? 'APPROVE' : 'REJECT',
            actor: societyActor
        });
        if (!decisionTransition.ok) {
            return decisionTransition;
        }
        let updatedRecord = decisionTransition.data;
        if (approved) {
            const reactivation = this.reactivationRequests.find((request) => request.residenceAccessId === residenceAccessId);
            if (reactivation) {
                const renewedExpiry = this.requirements.find((requirement) => requirement.requirementId.includes(`-${residenceAccessId}-`) &&
                    requirement.documentType === 'RENT_AGREEMENT' &&
                    requirement.expiryDate)?.expiryDate;
                updatedRecord = {
                    ...updatedRecord,
                    effectiveFrom: nowIso(),
                    ...includeWhenPresent("effectiveUntil", renewedExpiry ?? updatedRecord.effectiveUntil)
                };
                this.replaceRecord(updatedRecord);
                this.reactivationRequests = this.reactivationRequests.map((request) => request.requestId === reactivation.requestId
                    ? { ...request, status: 'APPROVED', reviewedAt: nowIso() }
                    : request);
            }
            const effectiveFrom = updatedRecord.effectiveFrom
                ? new Date(updatedRecord.effectiveFrom)
                : null;
            if (!effectiveFrom || effectiveFrom.getTime() <= Date.now()) {
                const activation = this.transition(updatedRecord.residenceAccessId, {
                    type: 'ACTIVATE',
                    actor: systemActor
                });
                if (activation.ok) {
                    updatedRecord = activation.data;
                }
            }
        }
        updatedRecord = {
            ...updatedRecord,
            blockers: approved ? [] : ['OTHER'],
            statusReason: approved
                ? updatedRecord.status === 'ACTIVE'
                    ? 'Society review is complete and residence access is active.'
                    : residenceAccessMessages.seed.futureReason
                : 'The Society Office could not approve the latest request version.',
            residentPendingActions: approved ? [] : ['View the decision and available correction options'],
            societyPendingActions: []
        };
        this.replaceRecord(updatedRecord);
        this.timeline = [
            ...this.timeline,
            createEvent(residenceAccessId, approved ? 'REQUEST_APPROVED' : 'REQUEST_STARTED', approved ? 'Request approved' : 'Request rejected', updatedRecord.statusReason, societyActor),
        ];
        this.notify();
        return this.detailResult(updatedRecord);
    }
}
export const mockResidenceAccessRepository = new MockResidenceAccessRepository();
