import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import type { createDocumentMetadataRecord, DocumentAccessLogsRecord, DocumentsByCategoryRecord, DocumentVersionsRecord, requestDocumentAccessRecord, } from './documents.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
type DocumentParams = JsonObject | Absent;
function stringParam(params: DocumentParams, key: string): string | Absent {
    const value = params?.[key];
    return typeof value === 'string' ? value : undefined;
}
function requiredDocumentId(params: DocumentParams): string {
    const documentId = stringParam(params, 'documentId') ?? stringParam(params, 'id');
    if (!documentId)
        throw new Error('A document identifier is required.');
    return documentId;
}
export class DocumentsApiSource {
    async createDocumentMetadata(params?: DocumentParams): Promise<createDocumentMetadataRecord> {
        return apiClient.post<createDocumentMetadataRecord>(apiEndpoints.documents.create, params, { idempotencyKey: createIdempotencyKey('resident-document-metadata') });
    }
    async listDocumentsByCategory(params?: DocumentParams): Promise<DocumentsByCategoryRecord[]> {
        const category = stringParam(params, 'category');
        return apiClient.get<DocumentsByCategoryRecord[]>(apiEndpoints.documents.list, { ...includeWhenPresent("query", category ? { category } : undefined) });
    }
    async listDocumentAccessLogs(params?: DocumentParams): Promise<DocumentAccessLogsRecord[]> {
        return apiClient.get<DocumentAccessLogsRecord[]>(apiEndpoints.documents.accessLogs(requiredDocumentId(params)));
    }
    async createDocumentAccessLog(params?: DocumentParams): Promise<DocumentAccessLogsRecord> {
        const documentId = requiredDocumentId(params);
        return apiClient.post<DocumentAccessLogsRecord>(apiEndpoints.documents.accessEvents(documentId), params, { idempotencyKey: createIdempotencyKey(`resident-document-access-${documentId}`) });
    }
    async listDocumentVersions(params?: DocumentParams): Promise<DocumentVersionsRecord[]> {
        return apiClient.get<DocumentVersionsRecord[]>(apiEndpoints.documents.versions(requiredDocumentId(params)));
    }
    async requestDocumentAccess(params?: DocumentParams): Promise<requestDocumentAccessRecord> {
        const documentId = requiredDocumentId(params);
        return apiClient.post<requestDocumentAccessRecord>(apiEndpoints.documents.accessRequests(documentId), params, { idempotencyKey: createIdempotencyKey(`resident-document-access-request-${documentId}`) });
    }
}

