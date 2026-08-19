import type { AdminDashboardData, AdminApproval, AdminComplaint, AdminAuditLog } from '../types/admin.types';

export const mockAdminApprovalsSummary: AdminApproval[] = [
  {
    id: 'appr-001', approvalNumber: 'APR-2026-0041', type: 'MOVE_IN',
    requestedBy: 'Shashank Shirode', requestedByRole: 'RESIDENT_OWNER',
    unitNumber: 'A-1204', wing: 'A Wing', createdAt: '2026-06-28T10:00:00Z',
    priority: 'HIGH', status: 'PENDING', assignedRole: 'SECRETARY',
    summary: 'New tenant move-in request for A-1204',
  },
  {
    id: 'appr-002', approvalNumber: 'APR-2026-0042', type: 'NOC',
    requestedBy: 'Priya Joshi', requestedByRole: 'RESIDENT_OWNER',
    unitNumber: 'B-0802', wing: 'B Wing', createdAt: '2026-06-27T14:30:00Z',
    priority: 'MEDIUM', status: 'UNDER_REVIEW', assignedRole: 'SECRETARY',
    summary: 'NOC request for property loan',
  },
  {
    id: 'appr-003', approvalNumber: 'APR-2026-0043', type: 'VENDOR_REGISTRATION',
    requestedBy: 'Facility Manager', requestedByRole: 'FACILITY_MANAGER',
    unitNumber: 'N/A', wing: 'N/A', createdAt: '2026-06-26T09:00:00Z',
    priority: 'LOW', status: 'PENDING',
    summary: 'New electrician vendor registration — ShriGanesh Electricals',
  },
];

export const mockAdminComplaintsSummary: AdminComplaint[] = [
  {
    id: 'comp-001', ticketNumber: 'CMP-2026-0145', category: 'Maintenance',
    subcategory: 'Plumbing', unitNumber: 'C-1501', wing: 'C Wing',
    priority: 'HIGH', slaStatus: 'AT_RISK', slaDeadline: '2026-06-30T18:00:00Z',
    assigneeName: 'Rajesh Kumar', assigneeRole: 'FACILITY_MANAGER',
    status: 'IN_PROGRESS', isVendorLinked: false,
    createdAt: '2026-06-29T08:00:00Z', updatedAt: '2026-06-29T10:00:00Z',
  },
  {
    id: 'comp-002', ticketNumber: 'CMP-2026-0144', category: 'Security',
    unitNumber: 'Common Area', wing: 'B Wing',
    priority: 'CRITICAL', slaStatus: 'BREACHED',
    status: 'ESCALATED', isVendorLinked: false,
    createdAt: '2026-06-28T20:00:00Z', updatedAt: '2026-06-29T09:00:00Z',
  },
];

export const mockAdminAuditLogsSummary: AdminAuditLog[] = [
  {
    id: 'aud-001', timestamp: '2026-06-29T11:00:00Z',
    actorName: 'Anil Deshmukh', actorRole: 'SECRETARY',
    eventType: 'NOTICE_PUBLISHED', entityType: 'NOTICE',
    entityReference: 'NOT-2026-012', summary: 'Published AGM notice to all residents',
    correlationId: 'corr-001', deviceSource: 'Tablet App',
  },
  {
    id: 'aud-002', timestamp: '2026-06-29T10:30:00Z',
    actorName: 'Meena Kulkarni', actorRole: 'TREASURER',
    eventType: 'PAYMENT_RECORDED', entityType: 'PAYMENT',
    entityReference: 'PAY-2026-0089', summary: 'Manual cash payment recorded for B-0404 — ₹3,200',
    correlationId: 'corr-002', deviceSource: 'Tablet App',
  },
];

export const mockAdminDashboard: AdminDashboardData = {
  totalUnits: 300, occupiedUnits: 282, vacantUnits: 18,
  ownerCount: 195, tenantCount: 87, pendingApprovalsCount: 15,
  openComplaintsCount: 23, pendingNocsCount: 4, unreadNoticesCount: 3,
  thisMonthCollection: 1845000, defaulterCount: 18, complianceAlerts: 2,
  recentApprovals: mockAdminApprovalsSummary,
  recentComplaints: mockAdminComplaintsSummary,
  recentAuditLogs: mockAdminAuditLogsSummary,
  lastUpdatedAt: new Date().toISOString(),
};
