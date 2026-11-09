import { createRepository } from '../../../../core/dataSource/repositoryFactory';
import { complaintApiSource } from './complaints.apiSource';
import { complaintMockSource } from './complaints.mockSource';
import { repositoryFailure, repositorySuccess } from '../../../../core/repositories/repository.types';
import type { ComplaintStatus, CreateComplaintPayload } from '../../../../shared/types/complaint.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { domainEventBus } from '../../../../core/events/DomainEventBus';
import { WorkOrderService } from '../../../facilityOps/services/workOrderService';
import type { FacilityOperationsActor } from '../../../facilityOps/data/facilityOpsActor.types';

const baseRepo = createRepository({
  moduleKey: 'residentComplaints',
  mockRepository: complaintMockSource,
  apiRepository: complaintApiSource,
});

export type ComplaintAssignmentInput = {
  complaintId: string;
  assigneeId: string;
  assigneeName: string;
};

export type ComplaintFeedbackInput = {
  complaintId: string;
  rating: number;
  comments: string;
};

export type ComplaintSlaSummaryInput = {
  unitId?: string;
  status?: ComplaintStatus;
};

export type ComplaintMutationInput = {
  complaintId: string;
  note: string;
};

export type ComplaintStatusUpdateInput = ComplaintMutationInput & {
  status: ComplaintStatus;
};

export const complaintRepository = {
  ...baseRepo,

  async assignComplaint(input: ComplaintAssignmentInput) {
    const complaint = mockStore.getState().complaints.find((c) => c.id === input.complaintId);
    if (!complaint) {
      return repositoryFailure({
        code: 'COMPLAINT_NOT_FOUND',
        message: 'Complaint not found',
        category: 'NOT_FOUND',
      });
    }

    const updated = {
      ...complaint,
      status: 'ASSIGNED' as ComplaintStatus,
      assignedTo: input.assigneeName,
      assignedToUserId: input.assigneeId,
      assignedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        ...(complaint.updates || []),
        {
          id: `update-${Date.now()}`,
          status: 'ASSIGNED' as ComplaintStatus,
          note: `Assigned to ${input.assigneeName}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    mockStore.updateComplaint(input.complaintId, updated);

    let workOrder = undefined;
    try {
      const actor: FacilityOperationsActor = {
        userId: 'admin-auto-01',
        name: 'Society Administration',
        role: 'ADMIN',
        societyId: complaint.societyId || 'soc-palm-grove-01',
        permissions: ['CREATE_WORK_ORDER', 'MANAGE_WORK_ORDERS'],
        hasPermission: () => true,
      };
      workOrder = WorkOrderService.getInstance().createWorkOrder(
        {
          title: `${complaint.category}: ${complaint.title}`,
          description: complaint.description,
          type: 'COMPLAINT_LINKED',
          priority: complaint.priority === 'URGENT' ? 'URGENT' : 'MEDIUM',
          source: 'COMPLAINT',
          sourceId: complaint.id,
          assignedTo: input.assigneeName,
        },
        actor,
      );
    } catch {
      workOrder = undefined;
    }

    void domainEventBus.emit({
      eventId: `evt-assign-${complaint.id}`,
      eventType: 'helpdesk.ticket.assigned',
      societyId: complaint.societyId ?? 'soc-palm-grove-01',
      unitId: complaint.unitId,
      actor: {
        userId: 'admin-auto-01',
        personId: 'admin-auto-01',
        displayName: 'Society Administration',
        role: 'ADMIN',
      },
      subject: {
        entityType: 'Complaint',
        entityId: complaint.id,
      },
      severity: 'INFO',
      createdAtIso: new Date().toISOString(),
      correlationId: `corr-${complaint.id}`,
      payload: {
        complaintId: complaint.id,
        assignedTo: input.assigneeName,
        assignedToUserId: input.assigneeId,
      },
    });

    return repositorySuccess({ ok: true, complaint: updated, workOrder });
  },

  async submitComplaintFeedback(input: ComplaintFeedbackInput) {
    const complaint = mockStore.getState().complaints.find((c) => c.id === input.complaintId);
    if (!complaint) {
      return repositoryFailure({
        code: 'COMPLAINT_NOT_FOUND',
        message: 'Complaint not found',
        category: 'NOT_FOUND',
      });
    }

    const feedbackRecord = {
      id: `fb-${Date.now()}`,
      complaintId: input.complaintId,
      rating: input.rating,
      comment: input.comments,
      createdAt: new Date().toISOString(),
    };

    mockStore.getState().complaintFeedback = [
      ...(mockStore.getState().complaintFeedback || []),
      feedbackRecord as any,
    ];

    const updated = {
      ...complaint,
      status: 'CLOSED' as ComplaintStatus,
      rating: input.rating,
      feedbackComment: input.comments,
      closedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        ...(complaint.updates || []),
        {
          id: `update-${Date.now()}`,
          status: 'CLOSED' as ComplaintStatus,
          note: `Resolution confirmed with ${input.rating} star rating.`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    mockStore.updateComplaint(input.complaintId, updated);
    return repositorySuccess({ ok: true, feedback: feedbackRecord, complaint: updated });
  },

  async getComplaintSlaSummary(input?: ComplaintSlaSummaryInput) {
    const complaints = mockStore.getState().complaints || [];
    const scoped = input?.unitId ? complaints.filter((c) => c.unitId === input.unitId) : complaints;
    const open = scoped.filter((c) => c.status === 'OPEN').length;
    const inProgress = scoped.filter((c) => c.status === 'IN_PROGRESS' || c.status === 'ASSIGNED').length;
    const resolved = scoped.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length;
    const breached = scoped.filter((c) => (c as any).slaStatus === 'BREACHED').length;

    return repositorySuccess({
      ok: true,
      summary: {
        total: scoped.length,
        open,
        inProgress,
        resolved,
        breached,
      },
    });
  },

  async createComplaint(payload: CreateComplaintPayload) {
    return complaintMockSource.create(payload);
  },

  async createPrivateComplaint(payload: CreateComplaintPayload) {
    return complaintMockSource.create({ ...payload, isPrivate: true });
  },

  async reopenComplaint(input: ComplaintMutationInput) {
    const complaint = mockStore.getState().complaints.find((c) => c.id === input.complaintId);
    if (!complaint) {
      return repositoryFailure({
        code: 'COMPLAINT_NOT_FOUND',
        message: 'Complaint not found',
        category: 'NOT_FOUND',
      });
    }

    const updated = {
      ...complaint,
      status: 'REOPENED' as ComplaintStatus,
      reopenReason: input.note,
      reopenedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updates: [
        ...(complaint.updates || []),
        {
          id: `update-${Date.now()}`,
          status: 'REOPENED' as ComplaintStatus,
          note: `Complaint reopened: ${input.note}`,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    mockStore.updateComplaint(input.complaintId, updated);

    mockStore.getState().complaintReopens = [
      ...(mockStore.getState().complaintReopens || []),
      {
        id: `reopen-${Date.now()}`,
        complaintId: input.complaintId,
        reason: input.note,
        reopenedAt: new Date().toISOString(),
      },
    ];

    void domainEventBus.emit({
      eventId: `evt-reopen-${complaint.id}`,
      eventType: 'helpdesk.ticket.reopened',
      societyId: complaint.societyId ?? 'soc-palm-grove-01',
      unitId: complaint.unitId,
      actor: {
        userId: complaint.reportedByUserId || 'usr-resident-01',
        personId: complaint.reportedByUserId || 'usr-resident-01',
        displayName: complaint.residentName || 'Resident',
        role: 'RESIDENT_OWNER',
      },
      subject: {
        entityType: 'Complaint',
        entityId: complaint.id,
      },
      severity: 'WARNING',
      createdAtIso: new Date().toISOString(),
      correlationId: `corr-${complaint.id}`,
      payload: {
        complaintId: complaint.id,
        reason: input.note,
      },
    });

    return repositorySuccess({ ok: true, complaint: updated });
  },

  async updateComplaintStatus(input: ComplaintStatusUpdateInput) {
    return complaintMockSource.updateStatus(input.complaintId, input.status, input.note);
  },
};

export const complaintsRepository = complaintRepository;
export const ComplaintsRepository = complaintRepository;
