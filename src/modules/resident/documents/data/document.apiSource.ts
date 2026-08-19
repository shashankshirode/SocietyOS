import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { DocumentAccessLog, DocumentInfo } from '../../../../shared/types/document.types';
import type { DocumentAccessLogDto, DocumentDto, RecordDocumentAccessInput, UploadDocumentPlaceholderInput } from './document.dto';
import { mapDocumentAccessLogDtoToDomain, mapDocumentDtoToDomain } from './document.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const documentApiSource = {
    async residentDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        return this.allDocuments(context);
    },
    async societyDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        return this.allDocuments(context);
    },
    async allDocuments(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<DocumentInfo[]>> {
        try {
            const dtos = await apiClient.get<DocumentDto[]>(apiEndpoints.documents.list);
            return repositorySuccess(dtos.map(mapDocumentDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async detail(context: ResidentRepositoryRequestContext | string, documentId?: string): Promise<RepositoryResult<DocumentInfo | Absent>> {
        try {
            let actualId: string;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = documentId || '';
            }
            const dto = await apiClient.get<DocumentDto>(apiEndpoints.documents.detail(actualId));
            return repositorySuccess(mapDocumentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async accessLogs(context?: ResidentRepositoryRequestContext | string, documentId?: string): Promise<RepositoryResult<DocumentAccessLog[]>> {
        try {
            let actualId: string | Absent;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = documentId;
            }
            const dtos = await apiClient.get<DocumentAccessLogDto[]>(actualId ? apiEndpoints.documents.accessLogs(actualId) : apiEndpoints.documents.list);
            return repositorySuccess(dtos.map(mapDocumentAccessLogDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async recordAccess(_context: ResidentRepositoryRequestContext, input: RecordDocumentAccessInput): Promise<RepositoryResult<DocumentAccessLog>> {
        try {
            const dto = await apiClient.post<DocumentAccessLogDto>(apiEndpoints.documents.accessLogs(input.documentId), input, { idempotencyKey: createIdempotencyKey(`document-access-${input.action.toLowerCase()}`) });
            return repositorySuccess(mapDocumentAccessLogDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async uploadPlaceholder(context: ResidentRepositoryRequestContext | UploadDocumentPlaceholderInput, input?: UploadDocumentPlaceholderInput): Promise<RepositoryResult<DocumentInfo>> {
        try {
            let actualInput: UploadDocumentPlaceholderInput;
            if (input) {
                actualInput = input;
            }
            else {
                actualInput = context as UploadDocumentPlaceholderInput;
            }
            const dto = await apiClient.post<DocumentDto>(apiEndpoints.documents.create, actualInput, { idempotencyKey: createIdempotencyKey('document-upload') });
            return repositorySuccess(mapDocumentDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};
export default documentApiSource;

