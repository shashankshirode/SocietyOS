import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Complaint, ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { Absent } from '../../../../shared/types/absence.types';

export interface ResidentComplaintsRepository {
  list(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<Complaint[]>>;
  detail(
    context: ResidentRepositoryRequestContext | string,
    complaintId?: string
  ): Promise<RepositoryResult<Complaint | Absent>>;
  create(
    context: ResidentRepositoryRequestContext | CreateComplaintPayload,
    payload?: CreateComplaintPayload
  ): Promise<RepositoryResult<Complaint>>;
  updateStatus(
    id: string,
    status: ComplaintStatus,
    note?: string
  ): Promise<RepositoryResult<Complaint>>;
}
