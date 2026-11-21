


import type { BarrierCommandState } from './hardware.types';

export type RfidAccessResult =
  | 'ALLOWED'
  | 'DENIED'
  | 'UNKNOWN_TAG'
  | 'EXPIRED_TAG'
  | 'BLOCKED_VEHICLE'
  | 'MANUAL_REVIEW';

export type RfidTagStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'LOST'
  | 'EXPIRED'
  | 'BLOCKED'
  | 'PENDING_MAPPING';

export type AnprReviewDecision =
  | 'MATCH_TO_VEHICLE'
  | 'MARK_UNKNOWN'
  | 'MARK_VISITOR'
  | 'MARK_FALSE_READ'
  | 'BLOCKED_REVIEW'
  | 'ESCALATE_TO_SECURITY';

export type BoomBarrierStatus =
  | 'OPEN'
  | 'CLOSED'
  | 'OPENING'
  | 'CLOSING'
  | 'ERROR'
  | 'OFFLINE'
  | 'MANUAL_OVERRIDE'
  | 'UNKNOWN';

export interface RfidEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  tagCodeMasked: string;
  matchedVehicleNumber?: string | undefined;
  matchedUnitNumber?: string | undefined;
  timestamp: string;
  accessResult: RfidAccessResult;
  gateLocation: string;
  correlationId?: string | undefined;
  sourceTimestamp?: string | undefined;
  receivedAt?: string | undefined;
  stalePolicyDetected?: boolean | undefined;
  deduplicationKey?: string | undefined;
}

export interface RfidTagMapping {
  id: string;
  tagCode: string;
  vehicleNumber?: string | undefined;
  unitNumber?: string | undefined;
  residentName?: string | undefined;
  validFrom: string;
  validUntil: string;
  accessZone: string;
  status: RfidTagStatus;
  notes?: string | undefined;
  vehicleId?: string | undefined;
  unitId?: string | undefined;
  staffCredentialId?: string | undefined;
  societyId?: string | undefined;
}

export interface AnprEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  plateNumberMasked: string;
  matchConfidence: number;
  matchedVehicleNumber?: string | undefined;
  unitNumber?: string | undefined;
  gateLocation: string;
  timestamp: string;
  status: 'MATCHED' | 'UNMATCHED' | 'LOW_CONFIDENCE' | 'DENIED';
  vehicleId?: string | undefined;
  captureImageUrl?: string | undefined;
  reviewStatus?: ('PENDING_REVIEW' | 'REVIEWED' | 'NOT_REQUIRED') | undefined;
  reviewedBy?: string | undefined;
  reviewDecision?: AnprReviewDecision | undefined;
  sourceTimestamp?: string | undefined;
  receivedAt?: string | undefined;
  deduplicationKey?: string | undefined;
}

export interface AnprVehicleMatchReview {
  eventId: string;
  detectedPlateText: string;
  suggestedVehicleNumber?: string | undefined;
  confidenceScore: number;
  reviewerDecision: AnprReviewDecision;
  notes: string;
  matchedVehicleId?: string | undefined;
}

export interface BoomBarrierDevice {
  id: string;
  name: string;
  deviceCode: string;
  location: string;
  status: BoomBarrierStatus;
  lastOpenTime?: string | undefined;
  lastCloseTime?: string | undefined;
  deniedCount: number;
  lastCommandState?: BarrierCommandState | undefined;
  controllerState?: BoomBarrierStatus | undefined;
  positionSensorState?: BoomBarrierStatus | undefined;
  stateDiscrepancy?: boolean | undefined;
}

export interface BarrierCommandRecord {
  commandId: string;
  barrierId: string;
  commandType: 'OPEN' | 'CLOSE';
  state: BarrierCommandState;
  requestedBy: string;
  reason?: string | undefined;
  emergencyIncidentId?: string | undefined;
  sentAt: string;
  acknowledgedAt?: string | undefined;
  confirmedAt?: string | undefined;
  idempotencyKey: string;
}

export interface GateHardwareDashboardData {
  gateDevicesCount: number;
  rfidReadersCount: number;
  anprCamerasCount: number;
  boomBarriersCount: number;
  totalGateEventsToday: number;
  unmatchedVehicleEventsToday: number;
  deviceHealthScore: number;
}
