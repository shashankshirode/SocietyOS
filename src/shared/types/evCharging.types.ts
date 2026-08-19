


export type EvChargerStatus =
  | 'AVAILABLE'
  | 'OCCUPIED'
  | 'RESERVED'
  | 'OFFLINE'
  | 'FAULTED'
  | 'MAINTENANCE'
  | 'DISABLED';

export type EvChargingSessionStatus =
  | 'RESERVED'
  | 'STARTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'FAILED'
  | 'CANCELLED'
  | 'BILLING_PENDING';

export interface EvCharger {
  id: string;
  name: string;
  chargerCode: string;
  location: string;
  connectorType: string;
  status: EvChargerStatus;
  currentSessionId?: string;
  totalEnergyDeliveredKwh: number;
  billingReadiness: 'READY' | 'DISABLED';
}

export interface EvChargingSession {
  id: string;
  chargerId: string;
  chargerName: string;
  residentName: string;
  unitNumber: string;
  vehicleNumberMasked: string;
  startTime: string;
  endTime?: string;
  energyConsumedKwh: number;
  costEstimateAmount?: number;
  billingStatus: 'PENDING' | 'BILLED' | 'FREE_LIMIT' | 'FAILED';
  status: EvChargingSessionStatus;
}

export interface EvChargingDashboardData {
  totalChargers: number;
  availableChargersCount: number;
  occupiedChargersCount: number;
  offlineChargersCount: number;
  totalSessionsToday: number;
  energyConsumedTodayKwh: number;
  revenueTodayAmount: number;
}
