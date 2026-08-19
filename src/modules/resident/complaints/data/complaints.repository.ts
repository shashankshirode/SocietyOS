import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { complaintApiSource } from './complaints.apiSource';
import { complaintMockSource } from './complaints.mockSource';
import { repositorySuccess } from '../../../../core/repositories/repository.types';
import type { ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';

const baseRepo = createRepository({
  moduleKey: 'residentComplaints',
  mockRepository: complaintMockSource,
  apiRepository: complaintApiSource,
});

type ComplaintAssignmentInput = {
  complaintId: string;
  assigneeId: string;
  assigneeName: string;
};

type ComplaintFeedbackInput = {
  complaintId: string;
  rating: number;
  comments: string;
};

type ComplaintSlaSummaryInput = {
  unitId?: string;
  status?: ComplaintStatus;
};

type ComplaintMutationInput = {
  complaintId: string;
  note: string;
};

type ComplaintStatusUpdateInput = ComplaintMutationInput & {
  status: ComplaintStatus;
};

export const complaintRepository = {
  ...baseRepo,

  async assignComplaint(_input: ComplaintAssignmentInput) {
    return repositorySuccess({ ok: true });
  },
  async submitComplaintFeedback(_input: ComplaintFeedbackInput) {
    return repositorySuccess({ ok: true });
  },
  async getComplaintSlaSummary(_input?: ComplaintSlaSummaryInput) {
    return repositorySuccess({ ok: true, summary: {} });
  },
  async createComplaint(_payload: CreateComplaintPayload) {
    return repositorySuccess({ id: 'comp-mock-' + Date.now() });
  },
  async createPrivateComplaint(_payload: CreateComplaintPayload) {
    return repositorySuccess({ id: 'comp-mock-' + Date.now() });
  },
  async reopenComplaint(_input: ComplaintMutationInput) {
    return repositorySuccess({ ok: true });
  },
  async updateComplaintStatus(_input: ComplaintStatusUpdateInput) {
    return repositorySuccess({ ok: true });
  }
};

export const complaintsRepository = complaintRepository;
export const ComplaintsRepository = complaintRepository;
