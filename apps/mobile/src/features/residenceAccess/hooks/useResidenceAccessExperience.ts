import { useCallback, useEffect, useRef, useState } from 'react';
import { createIdempotencyKey } from '../../../core/api/idempotency';
import type { LinkResidenceInput, ResidenceAccessDetail, ResidenceAccessListItem, ResidenceAccessRepositoryError, ResidenceAccessRoleFilter, ResidenceAccessStatusFilter, ResidenceApprovalReminderReason, ResidenceDocumentSelection, ResidenceOwnerConsentInput, ResidenceReactivationReason, ResidenceRecoveredUpload, } from '../models/residenceAccess.types';
import { residenceAccessRepository } from '../repositories/residenceAccess.repository';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
export type ResidenceAccessMutationName = 'UPLOAD_DOCUMENT' | 'REMOVE_DOCUMENT' | 'SUBMIT_FOR_REVIEW' | 'SEND_REMINDER' | 'REQUEST_OWNER_CONSENT' | 'RESUBMIT_CORRECTION' | 'SUBMIT_APPEAL' | 'SUBMIT_SUSPENSION_RESOLUTION' | 'REQUEST_REACTIVATION' | 'LINK_RESIDENCE' | 'WITHDRAW_REQUEST' | 'ACTIVATE_RESIDENCE' | 'REFRESH_RESIDENCE';
interface AppealFormValue {
    readonly reason: string;
    readonly explanation?: string;
    readonly supportingDocumentId?: string;
    readonly supportingDocument?: ResidenceDocumentSelection;
    readonly acknowledgementAccepted: boolean;
}
interface ReactivationFormValue {
    readonly reason: ResidenceReactivationReason;
    readonly residentMessage?: string;
    readonly supportingDocumentIds: readonly string[];
}
interface SuspensionFormValue {
    readonly explanation: string;
    readonly supportingDocumentIds: readonly string[];
}
export function useResidenceAccessExperience(userId: string) {
    const [items, setItems] = useState<readonly ResidenceAccessListItem[]>([]);
    const [nextCursor, setNextCursor] = useState<string | Absent>();
    const [totalCount, setTotalCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [listError, setListError] = useState<ResidenceAccessRepositoryError | null>(null);
    const [actionError, setActionError] = useState<ResidenceAccessRepositoryError | null>(null);
    const [selectedDetail, setSelectedDetail] = useState<ResidenceAccessDetail | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [activeMutation, setActiveMutation] = useState<ResidenceAccessMutationName | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [recoveredUploads, setRecoveredUploads] = useState<readonly ResidenceRecoveredUpload[]>([]);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState<ResidenceAccessStatusFilter>('ALL');
    const [roleFilter, setRoleFilter] = useState<ResidenceAccessRoleFilter>('ALL');
    const selectedIdRef = useRef<string | null>(null);
    const inFlightMutations = useRef(new Set<ResidenceAccessMutationName>());
    const uploadAbortControllerRef = useRef<AbortController | null>(null);
    const loadFirstPage = useCallback(async (refreshing = false) => {
        if (refreshing) {
            setIsRefreshing(true);
        }
        else {
            setIsLoading(true);
        }
        const result = await residenceAccessRepository.getResidences({
            userId,
            ...includeWhenPresent("cursor", undefined),
            pageSize: 5,
            ...includeWhenPresent("searchText", searchText.trim() || undefined),
            statusFilter,
            roleFilter
        });
        if (result.ok) {
            setItems(result.data.items);
            setNextCursor(result.data.nextCursor);
            setTotalCount(result.data.totalCount);
            setListError(null);
        }
        else {
            setListError(result.error);
        }
        setIsLoading(false);
        setIsRefreshing(false);
    }, [roleFilter, searchText, statusFilter, userId]);
    const loadMore = useCallback(async () => {
        if (!nextCursor || isLoadingMore) {
            return;
        }
        setIsLoadingMore(true);
        const result = await residenceAccessRepository.getResidences({
            userId,
            cursor: nextCursor,
            pageSize: 5,
            ...includeWhenPresent("searchText", searchText.trim() || undefined),
            statusFilter,
            roleFilter
        });
        if (result.ok) {
            setItems((current) => {
                const byId = new Map(current.map((item) => [item.accessRecord.residenceAccessId, item]));
                result.data.items.forEach((item) => byId.set(item.accessRecord.residenceAccessId, item));
                return [...byId.values()];
            });
            setNextCursor(result.data.nextCursor);
            setTotalCount(result.data.totalCount);
            setListError(null);
        }
        else {
            setListError(result.error);
        }
        setIsLoadingMore(false);
    }, [isLoadingMore, nextCursor, roleFilter, searchText, statusFilter, userId]);
    const refreshSelected = useCallback(async () => {
        const residenceAccessId = selectedIdRef.current;
        if (!residenceAccessId) {
            return false;
        }
        const result = await residenceAccessRepository.refreshResidence(userId, residenceAccessId);
        if (result.ok) {
            setSelectedDetail(result.data);
            setActionError(null);
            return true;
        }
        setActionError(result.error);
        return false;
    }, [userId]);
    useEffect(() => {
        void loadFirstPage();
    }, [loadFirstPage]);
    useEffect(() => residenceAccessRepository.subscribe(() => {
        void loadFirstPage(true);
        if (selectedIdRef.current) {
            void refreshSelected();
        }
    }), [loadFirstPage, refreshSelected]);
    const selectResidence = useCallback(async (residenceAccessId: string) => {
        selectedIdRef.current = residenceAccessId;
        setIsDetailLoading(true);
        setActionError(null);
        const result = await residenceAccessRepository.getResidenceDetail(userId, residenceAccessId);
        if (result.ok) {
            setSelectedDetail(result.data);
            setRecoveredUploads(await residenceAccessRepository.getRecoveredUploads(residenceAccessId));
            setIsDetailLoading(false);
            return result.data;
        }
        setSelectedDetail(null);
        setActionError(result.error);
        setIsDetailLoading(false);
        return null;
    }, [userId]);
    const closeResidence = useCallback(() => {
        selectedIdRef.current = null;
        setSelectedDetail(null);
        setRecoveredUploads([]);
        setActionError(null);
        setUploadProgress(0);
    }, []);
    const runMutation = useCallback(async (name: ResidenceAccessMutationName, operation: () => Promise<ReturnType<typeof residenceAccessRepository.getResidenceDetail> extends Promise<infer Result> ? Result : never>): Promise<boolean> => {
        if (inFlightMutations.current.has(name)) {
            return false;
        }
        inFlightMutations.current.add(name);
        setActiveMutation(name);
        setActionError(null);
        try {
            const result = await operation();
            if (result.ok) {
                selectedIdRef.current = result.data.accessRecord.residenceAccessId;
                setSelectedDetail(result.data);
                await loadFirstPage(true);
                return true;
            }
            setActionError(result.error.code === 'UPLOAD_CANCELLED' ? null : result.error);
            return false;
        }
        finally {
            inFlightMutations.current.delete(name);
            setActiveMutation(null);
        }
    }, [loadFirstPage]);
    const uploadDocument = useCallback((requirementId: string, selection: ResidenceDocumentSelection, expiryDate?: string) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        setUploadProgress(0);
        const controller = new AbortController();
        uploadAbortControllerRef.current = controller;
        return runMutation('UPLOAD_DOCUMENT', () => residenceAccessRepository.uploadDocument({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            requirementId,
            selection,
            ...includeWhenPresent("expiryDate", expiryDate),
            idempotencyKey: createIdempotencyKey(`residence-document-${requirementId}`),
            onProgress: setUploadProgress,
            signal: controller.signal
        })).finally(() => {
            if (uploadAbortControllerRef.current === controller) {
                uploadAbortControllerRef.current = null;
            }
            setUploadProgress(0);
        });
    }, [runMutation, selectedDetail]);
    const cancelDocumentUpload = useCallback(() => {
        uploadAbortControllerRef.current?.abort();
    }, []);
    const removeDocument = useCallback((documentId: string) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('REMOVE_DOCUMENT', () => residenceAccessRepository.removeDocument(userId, selectedDetail.accessRecord.residenceAccessId, documentId));
    }, [runMutation, selectedDetail, userId]);
    const submitForReview = useCallback((declarationsAccepted: boolean, rulesAcknowledged: boolean, consentAccepted: boolean) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('SUBMIT_FOR_REVIEW', () => residenceAccessRepository.submitForReview({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            declarationsAccepted,
            rulesAcknowledged,
            consentAccepted,
            idempotencyKey: createIdempotencyKey('residence-access-submit')
        }));
    }, [runMutation, selectedDetail]);
    const sendReminder = useCallback((reason: ResidenceApprovalReminderReason, optionalMessage?: string) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('SEND_REMINDER', () => residenceAccessRepository.sendReminder({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            reason,
            ...includeWhenPresent("optionalMessage", optionalMessage),
            idempotencyKey: createIdempotencyKey('residence-access-reminder')
        }));
    }, [runMutation, selectedDetail]);
    const requestOwnerConsent = useCallback((deliveryMethod: ResidenceOwnerConsentInput['deliveryMethod']) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('REQUEST_OWNER_CONSENT', () => residenceAccessRepository.requestOwnerConsent({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            deliveryMethod,
            idempotencyKey: createIdempotencyKey('owner-consent-request')
        }));
    }, [runMutation, selectedDetail]);
    const resubmitCorrection = useCallback((affectedRequirementIds: readonly string[]) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('RESUBMIT_CORRECTION', () => residenceAccessRepository.resubmitCorrection({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            affectedRequirementIds,
            idempotencyKey: createIdempotencyKey('residence-correction-resubmit')
        }));
    }, [runMutation, selectedDetail]);
    const submitAppeal = useCallback((value: AppealFormValue) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('SUBMIT_APPEAL', () => residenceAccessRepository.submitAppeal({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            reason: value.reason,
            ...includeWhenPresent("explanation", value.explanation),
            ...includeWhenPresent("supportingDocumentId", value.supportingDocumentId),
            ...includeWhenPresent("supportingDocument", value.supportingDocument),
            acknowledgementAccepted: value.acknowledgementAccepted,
            idempotencyKey: createIdempotencyKey('residence-access-appeal')
        }));
    }, [runMutation, selectedDetail]);
    const submitSuspensionResolution = useCallback((value: SuspensionFormValue) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('SUBMIT_SUSPENSION_RESOLUTION', () => residenceAccessRepository.submitSuspensionResolution({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            explanation: value.explanation,
            supportingDocumentIds: value.supportingDocumentIds,
            idempotencyKey: createIdempotencyKey('suspension-resolution')
        }));
    }, [runMutation, selectedDetail]);
    const requestReactivation = useCallback((value: ReactivationFormValue) => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('REQUEST_REACTIVATION', () => residenceAccessRepository.requestReactivation({
            residenceAccessId: selectedDetail.accessRecord.residenceAccessId,
            reason: value.reason,
            ...includeWhenPresent("residentMessage", value.residentMessage),
            supportingDocumentIds: value.supportingDocumentIds,
            idempotencyKey: createIdempotencyKey('residence-reactivation')
        }));
    }, [runMutation, selectedDetail]);
    const linkResidence = useCallback((input: Omit<LinkResidenceInput, 'userId' | 'idempotencyKey'>) => runMutation('LINK_RESIDENCE', () => residenceAccessRepository.linkResidence({
        ...input,
        userId,
        idempotencyKey: createIdempotencyKey('link-residence')
    })), [runMutation, userId]);
    const withdrawRequest = useCallback(() => {
        if (!selectedDetail) {
            return Promise.resolve(false);
        }
        return runMutation('WITHDRAW_REQUEST', () => residenceAccessRepository.withdrawRequest(userId, selectedDetail.accessRecord.residenceAccessId, createIdempotencyKey('withdraw-residence-request')));
    }, [runMutation, selectedDetail, userId]);
    const activateResidence = useCallback((residenceAccessId: string) => runMutation('ACTIVATE_RESIDENCE', () => residenceAccessRepository.activateResidence(userId, residenceAccessId, createIdempotencyKey('activate-residence'))), [runMutation, userId]);
    return {
        items,
        totalCount,
        hasMore: Boolean(nextCursor),
        isLoading,
        isRefreshing,
        isLoadingMore,
        listError,
        actionError,
        selectedDetail,
        isDetailLoading,
        activeMutation,
        uploadProgress,
        recoveredUploads,
        searchText,
        statusFilter,
        roleFilter,
        setSearchText,
        setStatusFilter,
        setRoleFilter,
        loadMore,
        refresh: () => loadFirstPage(true),
        selectResidence,
        refreshSelected,
        closeResidence,
        clearActionError: () => setActionError(null),
        uploadDocument,
        cancelDocumentUpload,
        removeDocument,
        submitForReview,
        sendReminder,
        requestOwnerConsent,
        resubmitCorrection,
        submitAppeal,
        submitSuspensionResolution,
        requestReactivation,
        linkResidence,
        withdrawRequest,
        activateResidence
    };
}

