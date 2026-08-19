import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Complaint, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import type { ComplaintDto } from './complaint.dto';
import { mapComplaintDtoToDomain, mapCreateComplaintPayloadToDto } from './complaint.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
export const complaintApiSource = {
    async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Complaint[]>> {
        try {
            const dtos = await apiClient.get<ComplaintDto[]>(apiEndpoints.complaints.list);
            return repositorySuccess(dtos.map(mapComplaintDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async detail(context: ResidentRepositoryRequestContext | string, complaintId?: string): Promise<RepositoryResult<Complaint | Absent>> {
        try {
            let actualId: string;
            if (typeof context === 'string') {
                actualId = context;
            }
            else {
                actualId = complaintId || '';
            }
            const dto = await apiClient.get<ComplaintDto>(apiEndpoints.complaints.detail(actualId));
            return repositorySuccess(mapComplaintDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async create(context: ResidentRepositoryRequestContext | CreateComplaintPayload, payload?: CreateComplaintPayload): Promise<RepositoryResult<Complaint>> {
        try {
            let actualPayload: CreateComplaintPayload;
            if (payload) {
                actualPayload = payload;
            }
            else {
                actualPayload = context as CreateComplaintPayload;
            }
            const dto = await apiClient.post<ComplaintDto>(apiEndpoints.complaints.create, mapCreateComplaintPayloadToDto(actualPayload), { idempotencyKey: createIdempotencyKey('complaint-create') });
            return repositorySuccess(mapComplaintDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async updateStatus(id: string, status: JsonValue, note?: string): Promise<RepositoryResult<Complaint>> {
        try {
            const dto = await apiClient.post<ComplaintDto>(apiEndpoints.complaints.detail(id) + '/status', { status, note });
            return repositorySuccess(mapComplaintDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async assign(id: string, assignee: string): Promise<RepositoryResult<Complaint>> {
        try {
            const dto = await apiClient.post<ComplaintDto>(apiEndpoints.complaints.detail(id) + '/assign', { assignee });
            return repositorySuccess(mapComplaintDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async submitFeedback(id: string, rating: number, comments: string): Promise<RepositoryResult<Complaint>> {
        try {
            const dto = await apiClient.post<ComplaintDto>(apiEndpoints.complaints.detail(id) + '/feedback', { rating, comments });
            return repositorySuccess(mapComplaintDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
};
export default complaintApiSource;

