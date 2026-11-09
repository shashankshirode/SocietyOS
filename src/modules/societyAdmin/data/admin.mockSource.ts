import type {
  AdminDashboardData,
  AdminUnit,
  AdminUnitDetail,
  AdminResident,
  AdminApproval,
  AdminNotice,
  AdminComplaint,
  AdminAuditLog,
  AdminNoticeTarget,
  AdminNoticeStatus,
  AdminComplaintStatus,
} from '../../../shared/types/admin.types';
import { mockAdminUnits, mockAdminUnitDetail } from '../../../shared/mock/adminUnits.mock';
import { mockAdminApprovals } from '../../../shared/mock/adminApprovals.mock';
import { mockAdminAuditLogs } from '../../../shared/mock/adminAuditLogs.mock';
import { mockStore } from '../../../core/mockStore/mockStore';
import type { NoticeCategory } from '../../../shared/types/notice.types';
import { getRequiredItem } from '../../../shared/utils/requiredItem';
import {
  getPendingResidenceRequests,
  approveResidenceRequest,
  rejectResidenceRequest,
} from '../../../core/identity/identityResolver';
import { emitInAppNotification } from '../../resident/notifications/data/residentNotifications.mockSource';

let dynamicAdminApprovals = [...mockAdminApprovals];
let dynamicAdminAuditLogs = [...mockAdminAuditLogs];

export function resetAdminApprovals() {
  dynamicAdminApprovals = [...mockAdminApprovals];
  dynamicAdminAuditLogs = [...mockAdminAuditLogs];
}

const withMockDelay = <T>(data: T, ms = 400): Promise<T> =>
  process.env.NODE_ENV === 'test'
    ? Promise.resolve(data)
    : new Promise((resolve) => setTimeout(() => resolve(data), ms));

export const adminMockSource = {
  getDashboard: async (): Promise<AdminDashboardData> => {
    const storeUnits = mockStore.getState().societyUnits;
    const totalUnits = storeUnits.length > 0 ? storeUnits.length : mockAdminUnits.length;
    const occupiedUnits =
      storeUnits.length > 0
        ? storeUnits.filter((u) => u.occupancyStatus !== 'VACANT').length
        : mockAdminUnits.filter((u) => u.occupancyStatus !== 'VACANT').length;
    const vacantUnits = Math.max(0, totalUnits - occupiedUnits);

    const storeResidents = mockStore.getState().residents;
    const ownerCount = storeResidents.filter((r) => r.role === 'OWNER').length;
    const tenantCount = storeResidents.filter((r) => r.role === 'TENANT').length;

    const storeComplaints = mockStore.getState().complaints;
    const openComplaints = storeComplaints.filter(
      (c) => c.status !== 'RESOLVED' && c.status !== 'CLOSED'
    );
    const openComplaintsCount = openComplaints.length;
    const criticalComplaints = openComplaints.filter(
      (c) => c.priority === 'HIGH' || c.priority === 'URGENT' || c.priority === 'CRITICAL'
    );

    const pendingReqs = getPendingResidenceRequests();
    const storeNocs = mockStore.getState().nocs;
    const pendingNocs = storeNocs.filter((n) => n.status === 'PENDING');
    const storeBookings = mockStore.getState().facilityBookings;
    const pendingBookings = storeBookings.filter((b) => b.status === 'PENDING');

    const pendingApprovalsCount =
      pendingReqs.length +
      pendingNocs.length +
      pendingBookings.length +
      dynamicAdminApprovals.filter((a) => a.status === 'PENDING').length;

    const storeNotices = mockStore.getState().notices;
    const unreadNoticesCount = storeNotices.filter((n) => n.status === 'UNREAD').length;

    const storeBills = mockStore.getState().bills;
    const thisMonthCollection = storeBills
      .filter((b) => b.status === 'PAID')
      .reduce((sum, b) => sum + (b.totalAmount || b.amount || 0), 0);
    const defaulterCount = storeBills.filter(
      (b) => b.status === 'OVERDUE' || (b.status !== 'PAID' && new Date(b.dueDate) < new Date())
    ).length;

    const recentComplaints = (await adminMockSource.getComplaints()).slice(0, 5);
    const allApprovals = await adminMockSource.getApprovals();
    const recentApprovals = allApprovals.slice(0, 5);
    const recentAuditLogs = dynamicAdminAuditLogs.slice(0, 5);

    const feedItems: {
      id: string;
      title: string;
      subtitle: string;
      status: string;
      statusTone: 'warning' | 'danger' | 'info' | 'success';
    }[] = [];

    if (criticalComplaints.length > 0) {
      feedItems.push({
        id: 'critical-complaints-alert',
        title: 'High Priority Complaints Requiring Action',
        subtitle: `${criticalComplaints.length} tickets need urgent technician assignment`,
        status: `${criticalComplaints.length} URGENT`,
        statusTone: 'danger',
      });
    } else if (openComplaintsCount > 0) {
      feedItems.push({
        id: 'open-complaints-alert',
        title: 'Active Resident Service Requests',
        subtitle: `${openComplaintsCount} open complaints undergoing resolution`,
        status: `${openComplaintsCount} OPEN`,
        statusTone: 'warning',
      });
    }

    if (pendingApprovalsCount > 0) {
      feedItems.push({
        id: 'pending-approvals-alert',
        title: 'Pending Society Approvals Queue',
        subtitle: `${pendingApprovalsCount} resident, NOC and booking requests awaiting review`,
        status: `${pendingApprovalsCount} PENDING`,
        statusTone: 'warning',
      });
    }

    if (storeNotices.length > 0) {
      feedItems.push({
        id: 'active-notices-feed',
        title: 'Published Society Circulars',
        subtitle: `${storeNotices.length} active announcements broadcast to residents`,
        status: `${storeNotices.length} ACTIVE`,
        statusTone: 'info',
      });
    }

    if (feedItems.length === 0) {
      feedItems.push({
        id: 'all-systems-clear',
        title: 'Society Operations Normal',
        subtitle: 'All complaints resolved and no approvals pending',
        status: 'CLEAR',
        statusTone: 'success',
      });
    }

    return withMockDelay({
      totalUnits,
      occupiedUnits,
      vacantUnits,
      ownerCount: ownerCount > 0 ? ownerCount : 12,
      tenantCount: tenantCount > 0 ? tenantCount : 4,
      pendingApprovalsCount,
      openComplaintsCount,
      pendingNocsCount: pendingNocs.length,
      unreadNoticesCount,
      thisMonthCollection,
      defaulterCount,
      complianceAlerts: 0,
      recentApprovals,
      recentComplaints,
      recentAuditLogs,
      lastUpdatedAt: new Date().toISOString(),
      feedItems,
    });
  },

  getUnits: (_filters?: Record<string, string>): Promise<AdminUnit[]> =>
    withMockDelay(mockAdminUnits),

  getUnitDetail: (_unitId: string): Promise<AdminUnitDetail> =>
    withMockDelay(mockAdminUnitDetail),

  getResidents: (_filters?: Record<string, string>): Promise<AdminResident[]> =>
    withMockDelay(mockStore.getState().residents as AdminResident[]),

  getApprovals: (_filters?: Record<string, string>): Promise<AdminApproval[]> => {
    const pendingReqs = getPendingResidenceRequests();

    const pendingNocs: AdminApproval[] = mockStore
      .getState()
      .nocs.filter((n) => n.status === 'PENDING')
      .map((n) => ({
        id: n.id,
        approvalNumber: n.applicationNumber || `NOC-${n.id.slice(-4)}`,
        type: 'NOC',
        requestedBy: n.applicantName || 'Resident',
        requestedByRole: n.applicantType || 'OWNER',
        unitNumber: n.unitNumber || 'A-1204',
        wing: 'Main Wing',
        ...(n.createdAt ? { createdAt: n.createdAt } : {}),
        priority: 'HIGH',
        status: 'PENDING',
        summary: `${n.category} NOC application for ${n.purpose || 'Society Clearance'}`,
        ...(n.comments ? { notes: n.comments } : {}),
      }));

    const pendingBookings: AdminApproval[] = mockStore
      .getState()
      .facilityBookings.filter((b) => b.status === 'PENDING')
      .map((b) => ({
        id: b.id,
        approvalNumber: `BK-${b.id.slice(-4)}`,
        type: 'FACILITY_BOOKING',
        requestedBy: b.bookedBy || 'Resident',
        requestedByRole: 'RESIDENT',
        unitNumber: b.unitNumber || 'Unit A-1204',
        wing: 'Tower A',
        createdAt: b.createdAt || new Date().toISOString(),
        priority: 'MEDIUM',
        status: 'PENDING',
        summary: `Amenity reservation request for ${b.facilityName || 'Clubhouse'}`,
      }));

    const merged = [...pendingReqs, ...pendingNocs, ...pendingBookings, ...dynamicAdminApprovals];
    return withMockDelay(merged);
  },

  getApprovalDetail: (approvalId: string): Promise<AdminApproval> => {
    const pendingReqs = getPendingResidenceRequests();
    const found =
      pendingReqs.find((a) => a.id === approvalId) ||
      dynamicAdminApprovals.find((a) => a.id === approvalId);
    return withMockDelay(found ?? getRequiredItem(mockAdminApprovals, 0, 'admin.mockSource.ts'));
  },

  approveRequest: (
    approvalId: string,
    notes?: string
  ): Promise<{
    success: boolean;
  }> => {
    if (
      approvalId.startsWith('req-') ||
      approvalId.startsWith('res-') ||
      approvalId.startsWith('appr-')
    ) {
      approveResidenceRequest(approvalId);
    }

    const noc = mockStore.getState().nocs.find((n) => n.id === approvalId);
    if (noc) {
      mockStore.updateNoc(approvalId, {
        status: 'APPROVED',
        approvalRemarks: notes || 'Approved by Society Admin',
        approvedAt: new Date().toISOString(),
      });
    }

    const booking = mockStore.getState().facilityBookings.find((b) => b.id === approvalId);
    if (booking) {
      mockStore.updateFacilityBooking(approvalId, {
        status: 'CONFIRMED',
      });
    }

    const vehicle = mockStore.getState().vehicles.find((v) => v.id === approvalId);
    if (vehicle) {
      mockStore.updateVehicle(approvalId, {
        status: 'ACTIVE',
      });
    }

    dynamicAdminApprovals = dynamicAdminApprovals.map((a) => {
      if (a.id !== approvalId) return a;
      const effectiveNotes = notes || a.notes;
      return {
        ...a,
        status: 'APPROVED' as const,
        ...(effectiveNotes ? { notes: effectiveNotes } : {}),
      };
    });

    dynamicAdminAuditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Society Admin (Rohan)',
      actorRole: 'SOCIETY_ADMIN',
      eventType: 'APPROVAL_ACTIONED',
      entityType: 'APPROVAL',
      entityReference: approvalId,
      summary: `Approved request ${approvalId}: ${notes || 'Standard administrative approval'}`,
    });

    emitInAppNotification({
      id: `notif-appr-${Date.now()}`,
      homeContextId: 'context-001',
      societyId: 'society-gv',
      unitId: 'unit-gv-a-1204',
      dataScopeKey: 'society-gv:unit-gv-a-1204',
      title: 'Request Approved by Administration',
      description: `Your application (${approvalId}) has been officially approved.`,
      category: 'SECURITY',
      status: 'unread',
      priority: 'normal',
      actionable: true,
      createdAtIso: new Date().toISOString(),
    });

    return withMockDelay({ success: true }, 400);
  },

  rejectRequest: (
    approvalId: string,
    reason: string
  ): Promise<{
    success: boolean;
  }> => {
    if (
      approvalId.startsWith('req-') ||
      approvalId.startsWith('res-') ||
      approvalId.startsWith('appr-')
    ) {
      rejectResidenceRequest(approvalId, reason);
    }

    const noc = mockStore.getState().nocs.find((n) => n.id === approvalId);
    if (noc) {
      mockStore.updateNoc(approvalId, {
        status: 'REJECTED',
        rejectionReason: reason,
      });
    }

    const booking = mockStore.getState().facilityBookings.find((b) => b.id === approvalId);
    if (booking) {
      mockStore.updateFacilityBooking(approvalId, {
        status: 'CANCELLED',
      });
    }

    const vehicle = mockStore.getState().vehicles.find((v) => v.id === approvalId);
    if (vehicle) {
      mockStore.updateVehicle(approvalId, {
        status: 'REJECTED',
      });
    }

    dynamicAdminApprovals = dynamicAdminApprovals.map((a) =>
      a.id === approvalId
        ? { ...a, status: 'REJECTED' as const, notes: `Rejected: ${reason}` }
        : a
    );

    dynamicAdminAuditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Society Admin (Rohan)',
      actorRole: 'SOCIETY_ADMIN',
      eventType: 'APPROVAL_ACTIONED',
      entityType: 'APPROVAL',
      entityReference: approvalId,
      summary: `Rejected request ${approvalId}: ${reason}`,
    });

    emitInAppNotification({
      id: `notif-rej-${Date.now()}`,
      homeContextId: 'context-001',
      societyId: 'society-gv',
      unitId: 'unit-gv-a-1204',
      dataScopeKey: 'society-gv:unit-gv-a-1204',
      title: 'Request Rejected by Administration',
      description: `Your application (${approvalId}) was rejected. Reason: ${reason}`,
      category: 'SECURITY',
      status: 'unread',
      priority: 'important',
      actionable: true,
      createdAtIso: new Date().toISOString(),
    });

    return withMockDelay({ success: true }, 400);
  },

  requestMoreInfo: (
    _approvalId: string,
    _info: string
  ): Promise<{
    success: boolean;
  }> => withMockDelay({ success: true }, 400),

  getNotices: (_filters?: Record<string, string>): Promise<AdminNotice[]> => {
    const mapped = mockStore.getState().notices.map((n) => ({
      id: n.id,
      title: n.title,
      content: n.body,
      category: n.category,
      target: (n.targetAudience || 'ALL_RESIDENTS') as AdminNoticeTarget,
      status: (n.status === 'EXPIRED' ? 'EXPIRED' : 'PUBLISHED') as AdminNoticeStatus,
      createdBy: n.postedBy || 'Admin',
      acknowledgementCount: n.acknowledged ? 1 : 0,
      totalTargetCount: 8,
      createdAt: n.date + 'T09:00:00Z',
    }));
    return withMockDelay(mapped);
  },

  publishNotice: (
    _noticeId: string
  ): Promise<{
    success: boolean;
  }> => withMockDelay({ success: true }, 400),

  createNotice: (payload: Partial<AdminNotice>): Promise<AdminNotice> => {
    const newId = `notice-${Date.now()}`;
    mockStore.addNotice({
      id: newId,
      title: payload.title || '',
      body: payload.content || '',
      category: (payload.category?.toUpperCase() || 'GENERAL') as NoticeCategory,
      date: getRequiredItem(new Date().toISOString().split('T'), 0, 'admin.mockSource.ts'),
      postedBy: 'Society Admin (Rohan)',
      isImportant: true,
      priority: 'NORMAL',
      status: 'UNREAD',
      societyName: 'Green Valley Heights',
      targetAudience: payload.target || 'ALL_RESIDENTS',
      acknowledgementRequired: true,
      acknowledged: false,
    });

    dynamicAdminAuditLogs.unshift({
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: 'Society Admin (Rohan)',
      actorRole: 'SOCIETY_ADMIN',
      eventType: 'NOTICE_PUBLISHED',
      entityType: 'NOTICE',
      entityReference: newId,
      summary: `Published notice: ${payload.title || 'Untitled'}`,
    });

    const created: AdminNotice = {
      id: newId,
      title: payload.title || '',
      content: payload.content || '',
      category: payload.category || 'General',
      target: payload.target || 'ALL_RESIDENTS',
      status: 'PUBLISHED',
      createdBy: 'Society Admin (Rohan)',
      acknowledgementCount: 0,
      totalTargetCount: 8,
      createdAt: new Date().toISOString(),
    };
    return withMockDelay(created, 400);
  },

  getComplaints: (_filters?: Record<string, string>): Promise<AdminComplaint[]> => {
    const storeComplaints = mockStore.getState().complaints;
    const mapped: AdminComplaint[] = storeComplaints.map((c) => {
      const wingMatch = c.flatNumber?.match(/^([A-Za-z]+)-/);
      const wing = wingMatch ? `${wingMatch[1]} Wing` : 'Main Wing';
      const priority: AdminComplaint['priority'] =
        c.priority === 'URGENT' ? 'CRITICAL' : (c.priority as AdminComplaint['priority']) || 'MEDIUM';
      const status: AdminComplaintStatus = (c.status as AdminComplaintStatus) || 'OPEN';

      const assigneeName = c.assignedTo || c.technicianName;
      return {
        id: c.id,
        ticketNumber: c.id.startsWith('comp-') ? `CMP-${c.id.replace('comp-', '')}` : c.id,
        category: c.category || 'General',
        unitNumber: c.flatNumber || 'Common Area',
        wing,
        priority,
        slaStatus: 'ON_TIME',
        ...(assigneeName ? { assigneeName } : {}),
        ...(c.assignedTo ? { assigneeRole: 'STAFF_USER' } : {}),
        status,
        isVendorLinked: false,
        createdAt: c.createdAt || new Date().toISOString(),
        updatedAt: c.updatedAt || new Date().toISOString(),
      };
    });
    return withMockDelay(mapped);
  },

  assignComplaint: (
    complaintId: string,
    assignee: string
  ): Promise<{
    success: boolean;
  }> => {
    const existing = mockStore.getState().complaints.find((c) => c.id === complaintId);
    if (existing) {
      const updates = existing.updates ? [...existing.updates] : [];
      updates.push({
        id: `update-${Date.now()}`,
        status: 'ASSIGNED',
        note: `Assigned to ${assignee}`,
        timestamp: new Date().toISOString(),
      });
      mockStore.updateComplaint(complaintId, {
        assignedTo: assignee,
        status: 'ASSIGNED',
        updatedAt: new Date().toISOString(),
        updates,
      });

      dynamicAdminAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: 'Society Admin (Rohan)',
        actorRole: 'SOCIETY_ADMIN',
        eventType: 'COMPLAINT_ASSIGNED',
        entityType: 'COMPLAINT',
        entityReference: complaintId,
        summary: `Assigned complaint ${complaintId} to ${assignee}`,
      });

      emitInAppNotification({
        id: `notif-cmp-assign-${Date.now()}`,
        homeContextId: 'context-001',
        societyId: 'society-gv',
        unitId: existing.unitId || 'unit-gv-a-1204',
        dataScopeKey: existing.dataScopeKey || 'society-gv:unit-gv-a-1204',
        title: 'Complaint Assigned to Technician',
        description: `Ticket ${complaintId} has been assigned to ${assignee}.`,
        category: 'COMPLAINTS',
        status: 'unread',
        priority: 'normal',
        actionable: true,
        createdAtIso: new Date().toISOString(),
        deepLink: 'ComplaintList',
      });
    }
    return withMockDelay({ success: true }, 400);
  },

  escalateComplaint: (
    complaintId: string
  ): Promise<{
    success: boolean;
  }> => {
    const existing = mockStore.getState().complaints.find((c) => c.id === complaintId);
    if (existing) {
      const updates = existing.updates ? [...existing.updates] : [];
      updates.push({
        id: `update-${Date.now()}`,
        status: 'IN_PROGRESS',
        note: 'Complaint escalated to society administration.',
        timestamp: new Date().toISOString(),
      });
      mockStore.updateComplaint(complaintId, {
        priority: 'URGENT',
        updatedAt: new Date().toISOString(),
        updates,
      });

      dynamicAdminAuditLogs.unshift({
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: 'Society Admin (Rohan)',
        actorRole: 'SOCIETY_ADMIN',
        eventType: 'APPROVAL_ACTIONED',
        entityType: 'COMPLAINT',
        entityReference: complaintId,
        summary: `Escalated complaint ${complaintId} to URGENT priority`,
      });
    }
    return withMockDelay({ success: true }, 400);
  },

  getAuditLogs: (_filters?: Record<string, string>): Promise<AdminAuditLog[]> =>
    withMockDelay(dynamicAdminAuditLogs),
};
