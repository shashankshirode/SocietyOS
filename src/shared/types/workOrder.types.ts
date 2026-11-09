import type { Absent } from './absence.types';

export type WorkOrderType =
  | 'PREVENTIVE_MAINTENANCE' | 'BREAKDOWN' | 'INSPECTION' | 'REPAIR' | 'REPLACEMENT'
  | 'COMPLAINT_LINKED' | 'INSTALLATION' | 'OTHER';

export type WorkOrderStatus =
  | 'DRAFT'
  | 'OPEN'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'ON_HOLD'
  | 'COMPLETION_SUBMITTED'
  | 'COMPLETED'
  | 'VERIFIED'
  | 'CLOSED'
  | 'CANCELLED'
  | 'OVERDUE';

export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type BreakdownSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type OperationalImpact = 'NO_IMPACT' | 'PARTIAL_IMPACT' | 'SERVICE_DOWN' | 'SAFETY_RISK' | 'MAJOR_DISRUPTION';
export type WorkOrderSource = 'MANUAL' | 'COMPLAINT' | 'SCHEDULE' | 'BREAKDOWN' | 'EMERGENCY';

export type WorkOrderHoldReason =
  | 'WAITING_FOR_PARTS'
  | 'WAITING_FOR_VENDOR'
  | 'WAITING_FOR_ACCESS'
  | 'WEATHER_DELAY'
  | 'BUDGET_APPROVAL'
  | 'OTHER';

export type WorkOrderPartUsage = {
  itemId: string;
  itemName: string;
  quantity: number;
  unitCost?: number | Absent;
  totalCost?: number | Absent;
};

export type WorkOrderTimelineItem = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
  event?: string | Absent;
  eventType?: string | Absent;
  actorId?: string | Absent;
  actorName?: string | Absent;
};

export type WorkOrder = {
  id: string;
  workOrderNumber: string;
  title: string;
  type: WorkOrderType;
  linkedAssetId?: string | Absent;
  linkedAssetName?: string | Absent;
  vendorId?: string | Absent;
  assignedVendorId?: string | Absent;
  vendorName?: string | Absent;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  dueDate: string;
  assignedTo: string;
  slaStatus: string;
  source: WorkOrderSource;
  description: string;
  notes?: string | Absent;
  evidenceLabel?: string | Absent;
  completionProofLabel?: string | Absent;
  verificationStatus: string;
  verificationNotes?: string | Absent;
  verifiedAt?: string | Absent;
  reworkReason?: string | Absent;
  startedAt?: string | Absent;
  completedAt?: string | Absent;
  closedAt?: string | Absent;
  createdAt?: string | Absent;
  partsUsed?: WorkOrderPartUsage[] | Absent;
  costAmount?: number | Absent;
  costCurrency?: string | Absent;
  linkedComplaintId?: string | Absent;
  linkedEmergencyIncidentId?: string | Absent;
  maintenancePlanId?: string | Absent;
  maintenanceOccurrenceId?: string | Absent;
  evidenceDocumentIds?: string[] | Absent;
  serviceReportDocumentId?: string | Absent;
  holdReason?: string | Absent;
  timeline: WorkOrderTimelineItem[];
};

export type CreateWorkOrderInput = {
  type: WorkOrderType;
  title: string;
  description: string;
  linkedAssetId?: string;
  vendorId?: string;
  priority: WorkOrderPriority;
  dueDate: string;
  assignedTo: string;
  sourceComplaintId?: string;
  evidenceLabel?: string;
  notes?: string;
};

export type ServiceHistoryItem = {
  id: string;
  serviceDate: string;
  assetId: string;
  assetName: string;
  vendorId?: string | Absent;
  vendorName?: string | Absent;
  workOrderNumber: string;
  serviceType: WorkOrderType;
  status: WorkOrderStatus;
  costPlaceholder?: string | Absent;
  costAmount?: number | Absent;
  costCurrency?: string | Absent;
  technician: string;
  findings: string;
  nextAction: string;
  reportPlaceholder?: string | Absent;
  serviceReportDocumentId?: string | Absent;
};

export type FacilityIncident = {
  id: string;
  assetId: string;
  assetName: string;
  location: string;
  description: string;
  severity: BreakdownSeverity;
  operationalImpact: OperationalImpact;
  immediateActionTaken: string;
  evidenceLabel?: string;
  vendorNotificationRequired: boolean;
  linkedWorkOrderId?: string;
};

export type AssetBreakdownInput = {
  assetId: string;
  location: string;
  description: string;
  severity: BreakdownSeverity;
  operationalImpact: OperationalImpact;
  immediateActionTaken: string;
  evidenceLabel?: string;
  vendorNotificationRequired: boolean;
};
