import { repositoryErrorMessages, residenceAccessActionLabels, residenceAccessMessages, } from '../../../messages/en/residenceAccess.messages';
import type { ResidenceAccessDetail, ResidenceAccessPage, ResidenceAccessResult, ResidenceAccessStatus, } from '../models/residenceAccess.types';
import type { Absent } from "../../../shared/types/absence.types";
const statuses: readonly ResidenceAccessStatus[] = [
    'DISCOVERED',
    'CLAIM_NOT_STARTED',
    'IDENTITY_DETAILS_REQUIRED',
    'DOCUMENTS_REQUIRED',
    'DOCUMENTS_UNDER_REVIEW',
    'DOCUMENT_CHANGES_REQUIRED',
    'OWNER_CONSENT_REQUIRED',
    'OWNER_CONSENT_PENDING',
    'SOCIETY_APPROVAL_PENDING',
    'ADDITIONAL_INFORMATION_REQUIRED',
    'APPROVED',
    'ACTIVE',
    'REJECTED',
    'SUSPENDED',
    'TEMPORARILY_RESTRICTED',
    'INACTIVE',
    'EXPIRED',
    'REACTIVATION_REQUIRED',
    'ACCESS_REVOKED',
    'UNIT_TRANSFER_PENDING',
    'MOVE_OUT_PENDING',
    'ARCHIVED',
];
function isJsonObject(value: JsonValue | Absent): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}
function hasString(object: JsonObject, key: string): boolean {
    return typeof object[key] === 'string';
}
function invalidPayload<T>(): ResidenceAccessResult<T> {
    return {
        ok: false,
        error: {
            code: 'SERVER_ERROR',
            message: repositoryErrorMessages.SERVER_ERROR,
            retryable: true,
        },
    };
}
function cloneDetail(payload: JsonValue): ResidenceAccessDetail {
    const detail: ResidenceAccessDetail = JSON.parse(JSON.stringify(payload));
    return detail;
}
function clonePage(payload: JsonValue): ResidenceAccessPage {
    const page: ResidenceAccessPage = JSON.parse(JSON.stringify(payload));
    return page;
}
function normalizeUnsupportedStatus(item: JsonObject): boolean {
    const accessRecord = item.accessRecord;
    const eligibility = item.eligibility;
    if (!isJsonObject(accessRecord) || !isJsonObject(eligibility) || !hasString(accessRecord, 'status')) {
        return false;
    }
    const status = accessRecord.status;
    if (typeof status === 'string' && statuses.includes(status as ResidenceAccessStatus)) {
        return true;
    }
    accessRecord.status = 'ARCHIVED';
    accessRecord.statusReason = residenceAccessMessages.common.unsupportedStatus;
    accessRecord.blockers = ['OTHER'];
    accessRecord.residentPendingActions = [];
    accessRecord.societyPendingActions = [];
    accessRecord.canWithdraw = false;
    eligibility.canEnterResidence = false;
    eligibility.canViewLimitedResidenceData = false;
    eligibility.canUploadDocuments = false;
    eligibility.canEditSubmittedDetails = false;
    eligibility.canSendReminder = false;
    eligibility.canRequestOwnerConsent = false;
    eligibility.canResubmit = false;
    eligibility.canAppeal = false;
    eligibility.canRequestReactivation = false;
    eligibility.blockingReasons = ['OTHER'];
    eligibility.nextRecommendedAction = 'VIEW_HISTORY';
    item.primaryAction = {
        type: 'VIEW_HISTORY',
        label: residenceAccessActionLabels.VIEW_HISTORY,
        accessibilityLabel: residenceAccessActionLabels.VIEW_HISTORY,
        enabled: true,
    };
    item.secondaryActions = [];
    return true;
}
export function parseResidenceAccessDetail(payload: JsonValue): ResidenceAccessResult<ResidenceAccessDetail> {
    if (!isJsonObject(payload)) {
        return invalidPayload();
    }
    const residence = payload.residence;
    const accessRecord = payload.accessRecord;
    const eligibility = payload.eligibility;
    const requirements = payload.requirements;
    const documents = payload.documents;
    const timeline = payload.timeline;
    if (!isJsonObject(residence) ||
        !isJsonObject(accessRecord) ||
        !isJsonObject(eligibility) ||
        !Array.isArray(requirements) ||
        !Array.isArray(documents) ||
        !Array.isArray(timeline) ||
        !hasString(residence, 'residenceAccessId') ||
        !hasString(residence, 'societyName') ||
        !hasString(accessRecord, 'residenceAccessId') ||
        !hasString(accessRecord, 'status') ||
        typeof eligibility.canEnterResidence !== 'boolean') {
        return invalidPayload();
    }
    if (!normalizeUnsupportedStatus(payload)) {
        return invalidPayload();
    }
    return { ok: true, data: cloneDetail(payload) };
}
export function parseResidenceAccessPage(payload: JsonValue): ResidenceAccessResult<ResidenceAccessPage> {
    if (!isJsonObject(payload) || !Array.isArray(payload.items)) {
        return invalidPayload();
    }
    if (typeof payload.totalCount !== 'number' || typeof payload.dataVersion !== 'number') {
        return invalidPayload();
    }
    const itemsValid = payload.items.every((item) => {
        if (!isJsonObject(item)) {
            return false;
        }
        const residence = item.residence;
        const record = item.accessRecord;
        return (isJsonObject(residence) &&
            isJsonObject(record) &&
            isJsonObject(item.eligibility) &&
            hasString(residence, 'residenceAccessId') &&
            hasString(record, 'status') &&
            normalizeUnsupportedStatus(item));
    });
    return itemsValid ? { ok: true, data: clonePage(payload) } : invalidPayload();
}

