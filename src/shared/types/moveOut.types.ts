export type MovingPersonType = 'OWNER' | 'TENANT';

export type MoveOutStatus =
  | 'DRAFT'
  | 'REQUESTED'
  | 'CLEARANCE_CHECK'
  | 'EXCEPTION'
  | 'READY'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESUBMIT'
  | 'SCHEDULED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'SIGNED'
  | 'ISSUED'
  | 'ACCESS_REVOKED'
  | 'OCCUPANCY_CLOSED'
  | 'ARCHIVED'
  | 'CANCELLED'
  | 'PENDING_CLEARANCE'
  | 'CLEARED'
  | 'NOC_GENERATED';

export type ClearanceStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'CLEARED'
  | 'BLOCKED'
  | 'OVERRIDDEN'
  | 'WAIVED'
  | 'NOT_APPLICABLE';

export type ClearanceCategory =
  | 'FINANCIAL'
  | 'DOCUMENT_ASSET'
  | 'PARKING'
  | 'ACCESS'
  | 'METER'
  | 'DAMAGE'
  | 'COMPLAINT'
  | 'VENDOR';

export interface ClearanceChecklistItem {
  id: string;
  title: string;
  description: string;
  category?: ClearanceCategory;
  status: ClearanceStatus;
  priority?: 'MANDATORY' | 'OPTIONAL';
  responsibleTeam: string;
  lastUpdated?: string;
  actionRequiredLabel?: string;
  notes?: string;
  clearedAt?: string;
  clearedBy?: string;
  overrideReason?: string;
  overriddenBy?: string;
  overriddenAt?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface ClearanceSnapshot {
  id: string;
  moveOutRequestId: string;
  generatedAt: string;
  generatedBy: string;
  clearanceItems: ClearanceChecklistItem[];
  overallStatus: string;
  blockingItems: ClearanceChecklistItem[];
  policyVersion?: string;
  checksum?: string;
}

export interface MoveOutClearanceResult {
  moveOutRequestId: string;
  overallStatus: string;
  clearanceItems: ClearanceChecklistItem[];
  blockingItems: ClearanceChecklistItem[];
  evaluatedAt: string;
  snapshotId: string;
}

export interface MoveOutRequest {
  id: string;
  requestNumber: string;
  societyId?: string;
  unitId?: string;
  residentId?: string;
  occupancyRelationshipId?: string;
  personType: MovingPersonType;
  flatNumber?: string;
  proposedMoveOutDate?: string;
  requestedExitDate?: string;
  requestedBy?: string;
  requestedAt?: string;
  reason: string;
  newAddress?: string;
  contactNumber: string;
  vehicleEntryRequired: boolean;
  liftSlotRequired: boolean;
  moverName?: string;
  notes?: string;
  checklist: ClearanceChecklistItem[];
  status: MoveOutStatus;
  clearanceSnapshotId?: string;
  nocCertificateId?: string;
  rejectionReason?: string;
  cancellationReason?: string;
  closureNotes?: string;
  approvalStatus?: string;
  approvedAt?: string;
  approvedBy?: string;
  nocStatus?: string;
  nocId?: string;
  accessRevocationStatus?: string;
  accessRevocationAt?: string;
  occupancyClosureStatus?: string;
  occupancyClosedAt?: string;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMoveOutRequestInput {
  societyId: string;
  unitId: string;
  residentId: string;
  occupancyRelationshipId: string;
  personType: MovingPersonType;
  requestedExitDate: string;
  reason: string;
  newAddress?: string;
  contactNumber: string;
  vehicleEntryRequired: boolean;
  liftSlotRequired: boolean;
  moverName?: string;
  notes?: string;
}

export interface UpdateMoveOutRequestInput {
  id: string;
  requestedExitDate?: string;
  reason?: string;
  newAddress?: string;
  contactNumber?: string;
  vehicleEntryRequired?: boolean;
  liftSlotRequired?: boolean;
  moverName?: string;
  notes?: string;
}

export interface OverrideClearanceInput {
  moveOutRequestId: string;
  clearanceItemId: string;
  reason: string;
  notes?: string;
  overriddenBy?: string;
}

export interface ApproveMoveOutInput {
  moveOutRequestId: string;
  approvedBy?: string;
  notes?: string;
}

export interface RejectMoveOutInput {
  moveOutRequestId: string;
  reason: string;
  rejectedBy?: string;
}

export interface ResubmitMoveOutInput {
  moveOutRequestId: string;
  notes?: string;
}

export interface GenerateNocInput {
  moveOutRequestId: string;
  generatedBy?: string;
  certificateNumber?: string;
}

export interface RevokeAccessInput {
  moveOutRequestId: string;
  revokedBy?: string;
  notes?: string;
}

export interface CloseOccupancyInput {
  moveOutRequestId: string;
  closedBy?: string;
  notes?: string;
}

export interface CancelMoveOutInput {
  moveOutRequestId: string;
  reason?: string;
  cancelledBy?: string;
}

export interface MoveOutRequestFilters {
  societyId?: string;
  status?: MoveOutStatus;
  unitId?: string;
  residentId?: string;
  personType?: MovingPersonType;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export const DEFAULT_CLEARANCE_CHECKLIST_TEMPLATE: Array<Omit<ClearanceChecklistItem, 'id' | 'status'>> = [
  {
    title: 'Financial Dues Clearance',
    description: 'Verify all maintenance, utility, and penalty dues are cleared.',
    category: 'FINANCIAL',
    responsibleTeam: 'Accounts & Finance',
    priority: 'MANDATORY',
  },
  {
    title: 'Document & Asset Clearance',
    description: 'Verify return of gate passes, tags, and society property.',
    category: 'DOCUMENT_ASSET',
    responsibleTeam: 'Facility Management',
    priority: 'MANDATORY',
  },
  {
    title: 'Parking Slot Vacating',
    description: 'Ensure dedicated parking slots are vacated and vehicle tags deactivated.',
    category: 'PARKING',
    responsibleTeam: 'Security & Parking',
    priority: 'MANDATORY',
  },
  {
    title: 'Access Control Deactivation',
    description: 'Schedule deactivation of RFID cards, biometric profiles, and mobile app access.',
    category: 'ACCESS',
    responsibleTeam: 'Security Admin',
    priority: 'MANDATORY',
  },
  {
    title: 'Utility Meter Final Reading',
    description: 'Record final electricity, water, and gas meter readings.',
    category: 'METER',
    responsibleTeam: 'Maintenance Operations',
    priority: 'MANDATORY',
  },
  {
    title: 'Flat Inspection & Damage Check',
    description: 'Inspect common area adjoining unit and premises for damages.',
    category: 'DAMAGE',
    responsibleTeam: 'Estate Maintenance',
    priority: 'OPTIONAL',
  },
  {
    title: 'Pending Complaints Resolution',
    description: 'Ensure no unresolved resident-filed disputes or complaints.',
    category: 'COMPLAINT',
    responsibleTeam: 'Society Office',
    priority: 'OPTIONAL',
  },
];
