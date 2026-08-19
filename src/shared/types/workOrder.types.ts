export type WorkOrderType =
  | 'PREVENTIVE_MAINTENANCE' | 'BREAKDOWN' | 'INSPECTION' | 'REPAIR' | 'REPLACEMENT'
  | 'COMPLAINT_LINKED' | 'INSTALLATION' | 'OTHER';

export type WorkOrderStatus = 'DRAFT' | 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'ON_HOLD' | 'COMPLETED' | 'VERIFIED' | 'CLOSED' | 'CANCELLED' | 'OVERDUE';
export type WorkOrderPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type BreakdownSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type OperationalImpact = 'NO_IMPACT' | 'PARTIAL_IMPACT' | 'SERVICE_DOWN' | 'SAFETY_RISK';

export type WorkOrderTimelineItem = {
  id: string;
  title: string;
  note: string;
  createdAt: string;
};

export type WorkOrder = {
  id: string;
  workOrderNumber: string;
  title: string;
  type: WorkOrderType;
  linkedAssetId?: string;
  linkedAssetName?: string;
  vendorId?: string;
  vendorName?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  dueDate: string;
  assignedTo: string;
  slaStatus: string;
  source: 'MANUAL' | 'COMPLAINT' | 'SCHEDULE' | 'BREAKDOWN';
  description: string;
  notes?: string;
  evidenceLabel?: string;
  completionProofLabel?: string;
  verificationStatus: string;
  linkedComplaintId?: string;
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
  vendorId: string;
  vendorName: string;
  workOrderNumber: string;
  serviceType: WorkOrderType;
  status: WorkOrderStatus;
  costPlaceholder: string;
  technician: string;
  findings: string;
  nextAction: string;
  reportPlaceholder: string;
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
