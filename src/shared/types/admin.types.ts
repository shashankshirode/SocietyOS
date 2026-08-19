

export type AdminApprovalType =
  | 'TENANT_ONBOARDING'
  | 'MOVE_IN'
  | 'MOVE_OUT'
  | 'NOC'
  | 'DOCUMENT_VERIFICATION'
  | 'FACILITY_BOOKING'
  | 'COMPLAINT_ESCALATION'
  | 'VENDOR_REGISTRATION'
  | 'WORK_ORDER_VERIFICATION'
  | 'PAYMENT_CORRECTION'
  | 'ATTENDANCE_CORRECTION';

export type AdminApprovalStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'MORE_INFO_REQUIRED'
  | 'ESCALATED';

export type UnitOccupancyStatus =
  | 'OWNER_OCCUPIED'
  | 'TENANT_OCCUPIED'
  | 'VACANT'
  | 'UNDER_TRANSFER'
  | 'MOVE_OUT_PENDING'
  | 'BLOCKED';

export type KycStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'VERIFIED'
  | 'REJECTED'
  | 'EXPIRED';

export type DuesStatus =
  | 'NO_DUES'
  | 'PARTIAL_DUES'
  | 'DUES_PENDING'
  | 'LONG_PENDING'
  | 'DISPUTED';

export type AdminNoticeTarget =
  | 'ALL_RESIDENTS'
  | 'OWNERS_ONLY'
  | 'TENANTS_ONLY'
  | 'WING_SPECIFIC'
  | 'FLOOR_SPECIFIC'
  | 'COMMITTEE'
  | 'STAFF'
  | 'CUSTOM_GROUP';

export type AdminNoticeStatus =
  | 'DRAFT'
  | 'SCHEDULED'
  | 'PUBLISHED'
  | 'ARCHIVED';

export type AdminComplaintStatus =
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'SLA_BREACHED'
  | 'ESCALATED'
  | 'VENDOR_LINKED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED';

export type AdminAuditEventType =
  | 'BILL_CYCLE_CREATED'
  | 'BILLS_CALCULATED'
  | 'BILLS_PUBLISHED'
  | 'PAYMENT_RECORDED'
  | 'RECEIPT_GENERATED'
  | 'PAYMENT_REVERSED'
  | 'ADJUSTMENT_CREATED'
  | 'DEFAULTER_NOTICE_GENERATED'
  | 'UNIT_UPDATED'
  | 'RESIDENT_ACCESS_CHANGED'
  | 'DOCUMENT_VERIFIED'
  | 'NOC_APPROVED'
  | 'APPROVAL_ACTIONED'
  | 'NOTICE_PUBLISHED'
  | 'COMPLAINT_ASSIGNED'
  | 'COMPLAINT_RESOLVED'
  | 'FEATURE_CONFIGURATION_CHANGED';



export interface SocietySummary {
  id: string;
  name: string;
  registrationNumber?: string;
  societyType: string;
  city: string;
  state: string;
  address: string;
  towers: string[];
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  totalParkingSlots: number;
  activeResidents: number;
  activeTenants: number;
  activeStaff: number;
  activeGuards: number;
  enabledModules: string[];
  adminContacts: { name: string; role: string; mobile: string }[];
  establishedYear?: number;
  lastUpdatedAt: string;
}

export interface AdminUnit {
  id: string;
  unitNumber: string;
  wing: string;
  floor: number;
  unitType: string;
  areaSqFt: number;
  occupancyStatus: UnitOccupancyStatus;
  ownerName?: string;
  tenantName?: string;
  duesStatus: DuesStatus;
  outstandingAmount: number;
  parkingCount: number;
  documentStatus: 'COMPLETE' | 'INCOMPLETE' | 'PENDING_VERIFICATION';
  kycStatus: KycStatus;
  lastActivityAt?: string;
}

export interface AdminUnitDetail extends AdminUnit {
  ownerMobileMasked?: string;
  tenantMobileMasked?: string;
  familyMemberCount: number;
  vehicleCount: number;
  pendingBillsCount: number;
  openComplaintsCount: number;
  nocStatus?: string;
  moveOutStatus?: string;
  lastPaymentDate?: string;
  lastPaymentAmount?: number;
  notes?: string;
}

export interface AdminResident {
  id: string;
  name: string;
  role: 'OWNER' | 'TENANT' | 'FAMILY';
  unitNumber: string;
  wing: string;
  occupancyStatus: string;
  kycStatus: KycStatus;
  documentStatus: 'COMPLETE' | 'INCOMPLETE' | 'PENDING_VERIFICATION';
  accessStatus: 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  mobileMasked: string;
  emailMasked: string;
  profilePhotoPlaceholder?: string;
  registeredAt?: string;
}

export interface AdminApproval {
  id: string;
  approvalNumber: string;
  type: AdminApprovalType;
  requestedBy: string;
  requestedByRole: string;
  unitNumber: string;
  wing: string;
  createdAt: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: AdminApprovalStatus;
  assignedRole?: string;
  summary: string;
  notes?: string;
  slaDeadline?: string;
}

export interface AdminNotice {
  id: string;
  title: string;
  content: string;
  category: string;
  target: AdminNoticeTarget;
  targetWing?: string;
  status: AdminNoticeStatus;
  publishedAt?: string;
  scheduledAt?: string;
  createdBy: string;
  acknowledgementCount: number;
  totalTargetCount: number;
  createdAt: string;
}

export interface AdminComplaint {
  id: string;
  ticketNumber: string;
  category: string;
  subcategory?: string;
  unitNumber: string;
  wing: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  slaStatus: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  slaDeadline?: string;
  assigneeName?: string;
  assigneeRole?: string;
  status: AdminComplaintStatus;
  isVendorLinked: boolean;
  vendorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  eventType: AdminAuditEventType;
  entityType: string;
  entityReference: string;
  summary: string;
  correlationId?: string;
  deviceSource?: string;
  ipAddress?: string;
}

export interface AdminDashboardData {
  totalUnits: number;
  occupiedUnits: number;
  vacantUnits: number;
  ownerCount: number;
  tenantCount: number;
  pendingApprovalsCount: number;
  openComplaintsCount: number;
  pendingNocsCount: number;
  unreadNoticesCount: number;
  thisMonthCollection: number;
  defaulterCount: number;
  complianceAlerts: number;
  recentApprovals: AdminApproval[];
  recentComplaints: AdminComplaint[];
  recentAuditLogs: AdminAuditLog[];
  lastUpdatedAt: string;
}

export interface SocietySettings {
  society: SocietySummary;
  billingDueDay: number;
  penaltyGraceDays: number;
  visitorAutoExpireHours: number;
  complaintSlaHours: { LOW: number; MEDIUM: number; HIGH: number; CRITICAL: number };
  allowTenantBillView: boolean;
  requireDocumentForTenant: boolean;
  notificationChannels: string[];
  lastConfiguredAt: string;
}

export interface RolePermissionSummary {
  role: string;
  displayName: string;
  permissionGroups: {
    group: string;
    permissions: { key: string; label: string; enabled: boolean; sensitive: boolean }[];
  }[];
  backendEnforcementNote: string;
}

export interface FeatureConfigurationGroup {
  group: string;
  displayName: string;
  flags: {
    key: string;
    label: string;
    description: string;
    enabled: boolean;
    isHidden: boolean;
    requiresBackend: boolean;
  }[];
}
