import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { mockDocumentAccessLogs } from '../../../../shared/mock/documentAccessLogs.mock';
import { mockStore } from '../../../../core/mockStore/mockStore';
import type { DocumentAccessLog, DocumentInfo } from '../../../../shared/types/document.types';
import type { RecordDocumentAccessInput, UploadDocumentPlaceholderInput } from './document.dto';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const documentAccessLogs = [...mockDocumentAccessLogs];
export const documentMockSource = {
    async residentDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const all = mockStore.getState().documents;
        const scoped = all.filter((document) => matchesResidentRepositoryContext(document, ctx));
        return repositorySuccess(scoped);
    },
    async societyDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        return repositorySuccess(mockStore.getState().documents.filter((document) => document.isSocietyDoc && matchesResidentRepositoryContext(document, ctx)));
    },
    async allDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const documents = mockStore.getState().documents.filter((document) => matchesResidentRepositoryContext(document, ctx) ||
            (document.isSocietyDoc && matchesResidentRepositoryContext(document, ctx)));
        return repositorySuccess(documents);
    },
    async detail(context: ResidentRepositoryRequestContext | string, documentId?: string): Promise<RepositoryResult<DocumentInfo | Absent>> {
        await withMockDelay();
        let actualId: string;
        if (typeof context === 'string') {
            actualId = context;
        }
        else {
            actualId = documentId || '';
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : context;
        const doc = mockStore.getState().documents.find((document) => document.id === actualId &&
            (matchesResidentRepositoryContext(document, requestContext) ||
                (document.isSocietyDoc && matchesResidentRepositoryContext(document, requestContext))));
        return repositorySuccess(doc);
    },
    async accessLogs(context?: ResidentRepositoryRequestContext | string, documentId?: string): Promise<RepositoryResult<DocumentAccessLog[]>> {
        await withMockDelay();
        let actualDocId = documentId;
        if (typeof context === 'string') {
            actualDocId = context;
        }
        const requestContext = typeof context === 'string' ? resolveRequestContext() : resolveRequestContext(context);
        const scopedDocumentIds = mockStore.getState().documents
            .filter((document) => matchesResidentRepositoryContext(document, requestContext))
            .map((document) => document.id);
        return repositorySuccess(documentAccessLogs.filter((log) => actualDocId
            ? log.documentId === actualDocId && scopedDocumentIds.includes(actualDocId)
            : scopedDocumentIds.includes(log.documentId)));
    },
    async recordAccess(context: ResidentRepositoryRequestContext, input: RecordDocumentAccessInput): Promise<RepositoryResult<DocumentAccessLog>> {
        await withMockDelay(120);
        const document = mockStore.getState().documents.find((candidate) => candidate.id === input.documentId && matchesResidentRepositoryContext(candidate, context));
        if (!document) {
            return { ok: false, error: { code: 'DOCUMENT_NOT_FOUND', message: 'This document is unavailable in the active residence.' } };
        }
        const log: DocumentAccessLog = {
            id: `document-log-${Date.now()}`,
            documentId: input.documentId,
            documentTitle: input.documentTitle,
            actorName: 'Current resident',
            actorRole: context.activeHome.residentRole.toUpperCase(),
            action: input.action,
            timestamp: new Date().toISOString(),
            deviceInfo: 'SocietyOS mobile app',
            ...includeWhenPresent("reason", input.reason)
        };
        documentAccessLogs.unshift(log);
        return repositorySuccess(log);
    },
    async uploadPlaceholder(context: ResidentRepositoryRequestContext | UploadDocumentPlaceholderInput, input?: UploadDocumentPlaceholderInput): Promise<RepositoryResult<DocumentInfo>> {
        await withMockDelay(800);
        let actualContext: ResidentRepositoryRequestContext;
        let actualInput: UploadDocumentPlaceholderInput;
        if (input) {
            actualContext = context as ResidentRepositoryRequestContext;
            actualInput = input;
        }
        else {
            actualContext = resolveRequestContext();
            actualInput = context as UploadDocumentPlaceholderInput;
        }
        const newDoc: DocumentInfo = {
            id: `doc-${Date.now()}`,
            title: actualInput.title,
            category: actualInput.category,
            flatNumber: actualContext.activeHome.flatNumber,
            status: 'PENDING_VERIFICATION',
            ...includeWhenPresent("uploadedDate", new Date().toISOString().split('T')[0]),
            uploadedBy: actualContext.activeHome.residentRole === 'tenant' ? 'Amit' : 'Shashank',
            fileType: 'pdf',
            fileSize: '1.2 MB',
            sensitivity: 'OWNER_ONLY',
            homeContextId: actualContext.activeHome.homeContextId,
            societyId: actualContext.activeHome.societyId,
            unitId: actualContext.activeHome.unitId,
            dataScopeKey: actualContext.dataScopeKey
        };
        mockStore.addDocument(newDoc);
        return repositorySuccess(newDoc);
    }
};
export default documentMockSource;

