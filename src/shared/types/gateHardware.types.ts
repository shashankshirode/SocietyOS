


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
  matchedVehicleNumber?: string;
  matchedUnitNumber?: string;
  timestamp: string;
  accessResult: RfidAccessResult;
  gateLocation: string;
}

export interface RfidTagMapping {
  id: string;
  tagCode: string;
  vehicleNumber?: string;
  unitNumber?: string;
  residentName?: string;
  validFrom: string;
  validUntil: string;
  accessZone: string;
  status: RfidTagStatus;
  notes?: string;
}

export interface AnprEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  plateNumberMasked: string;
  matchConfidence: number;
  matchedVehicleNumber?: string;
  unitNumber?: string;
  gateLocation: string;
  timestamp: string;
  status: 'MATCHED' | 'UNMATCHED' | 'LOW_CONFIDENCE' | 'DENIED';
}

export interface AnprVehicleMatchReview {
  eventId: string;
  detectedPlateText: string;
  suggestedVehicleNumber?: string;
  confidenceScore: number;
  reviewerDecision: AnprReviewDecision;
  notes: string;
}

export interface BoomBarrierDevice {
  id: string;
  name: string;
  deviceCode: string;
  location: string;
  status: BoomBarrierStatus;
  lastOpenTime?: string;
  lastCloseTime?: string;
  deniedCount: number;
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
