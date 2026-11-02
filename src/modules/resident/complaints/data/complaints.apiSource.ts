import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Complaint, ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import type { ComplaintDto } from './complaint.dto';
import { complaintDtoDecoder, complaintDtoListDecoder } from './complaint.dto';
import { decodeOrThrow } from '../../../../core/api/decoders';
import { mapComplaintDtoToDomain, mapCreateComplaintPayloadToDto } from './complaint.mapper';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from "../../../../shared/types/absence.types";
import type { ResidentComplaintsRepository } from './residentComplaints.repository.types';

export const complaintApiSource: ResidentComplaintsRepository & {
  assign(id: string, assignee: string): Promise<RepositoryResult<Complaint>>;
  submitFeedback(id: string, rating: number, comments: string): Promise<RepositoryResult<Complaint>>;
} = {
  async list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Complaint[]>> {
    try {
      const raw = await apiClient.get<unknown>(apiEndpoints.complaints.list);
      const dtos = decodeOrThrow(complaintDtoListDecoder, raw, 'complaints.list');
      return repositorySuccess(dtos.map(mapComplaintDtoToDomain));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async detail(context: ResidentRepositoryRequestContext | string, complaintId?: string): Promise<RepositoryResult<Complaint | Absent>> {
    try {
      let actualId: string;
      if (typeof context === 'string') {
        actualId = context;
      } else {
        actualId = complaintId || '';
      }
      const raw = await apiClient.get<unknown>(apiEndpoints.complaints.detail(actualId));
      const dto = decodeOrThrow(complaintDtoDecoder, raw, `complaints.detail(${actualId})`);
      return repositorySuccess(mapComplaintDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async create(context: ResidentRepositoryRequestContext | CreateComplaintPayload, payload?: CreateComplaintPayload): Promise<RepositoryResult<Complaint>> {
    try {
      let actualPayload: CreateComplaintPayload;
      if (payload) {
        actualPayload = payload;
      } else {
        actualPayload = context as CreateComplaintPayload;
      }
      const raw = await apiClient.post<unknown>(
        apiEndpoints.complaints.create,
        mapCreateComplaintPayloadToDto(actualPayload),
        { idempotencyKey: createIdempotencyKey('complaint-create') }
      );
      const dto = decodeOrThrow(complaintDtoDecoder, raw, 'complaints.create');
      return repositorySuccess(mapComplaintDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async updateStatus(id: string, status: ComplaintStatus, note?: string): Promise<RepositoryResult<Complaint>> {
    try {
      const raw = await apiClient.post<unknown>(apiEndpoints.complaints.detail(id) + '/status', { status, note });
      const dto = decodeOrThrow(complaintDtoDecoder, raw, `complaints.status(${id})`);
      return repositorySuccess(mapComplaintDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async assign(id: string, assignee: string): Promise<RepositoryResult<Complaint>> {
    try {
      const raw = await apiClient.post<unknown>(apiEndpoints.complaints.detail(id) + '/assign', { assignee });
      const dto = decodeOrThrow(complaintDtoDecoder, raw, `complaints.assign(${id})`);
      return repositorySuccess(mapComplaintDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },

  async submitFeedback(id: string, rating: number, comments: string): Promise<RepositoryResult<Complaint>> {
    try {
      const raw = await apiClient.post<unknown>(apiEndpoints.complaints.detail(id) + '/feedback', { rating, comments });
      const dto = decodeOrThrow(complaintDtoDecoder, raw, `complaints.feedback(${id})`);
      return repositorySuccess(mapComplaintDtoToDomain(dto));
    } catch (error) {
      return repositoryFailure(repositoryErrorFromUnknown(error as Error));
    }
  },
};

export default complaintApiSource;
