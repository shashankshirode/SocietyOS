

export type MovingPersonType = 'OWNER' | 'TENANT';

export type ClearanceStatus =
  | 'NOT_STARTED'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'CLEARED'
  | 'BLOCKED'
  | 'OVERRIDDEN';

export interface ClearanceChecklistItem {
  id: string;
  title: string;
  description: string;
  status: ClearanceStatus;
  responsibleTeam: string;
  lastUpdated?: string;
  actionRequiredLabel?: string;
}

export interface MoveOutRequest {
  id: string;
  requestNumber: string;
  personType: MovingPersonType;
  flatNumber: string;
  proposedMoveOutDate: string;
  reason: string;
  newAddress?: string;
  contactNumber: string;
  vehicleEntryRequired: boolean;
  liftSlotRequired: boolean;
  moverName?: string;
  notes?: string;
  checklist: ClearanceChecklistItem[];
  status: 'PENDING_CLEARANCE' | 'CLEARED' | 'NOC_GENERATED' | 'CANCELLED';
}
