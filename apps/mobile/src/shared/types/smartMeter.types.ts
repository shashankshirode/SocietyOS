

import type { HardwareDeviceStatus } from './hardware.types';

export type MeterType =
  | 'ELECTRICITY'
  | 'WATER'
  | 'GAS';

export type MeterReadingStatus =
  | 'IMPORTED'
  | 'VALIDATED'
  | 'ESTIMATED'
  | 'ERROR'
  | 'DUPLICATE'
  | 'MISSING'
  | 'BILLING_READY';

export interface SmartMeter {
  id: string;
  meterCode: string;
  unitNumber: string;
  type: MeterType;
  status: HardwareDeviceStatus;
  lastReadingValue: number;
  lastReadingDate: string;
  billingReadiness: 'READY' | 'PENDING' | 'ERROR';
  societyId?: string | undefined;
  unitId?: string | undefined;
  locationId?: string | undefined;
}

export interface SmartMeterReading {
  id: string;
  meterId: string;
  unitNumber: string;
  type: MeterType;
  previousReadingValue: number;
  currentReadingValue: number;
  consumptionValue: number;
  readingDate: string;
  source: 'AUTOMATIC' | 'MANUAL' | 'ESTIMATED' | 'IMPORT';
  status: MeterReadingStatus;
  billingReadiness: 'READY' | 'PENDING_VALIDATION' | 'ERROR';
  errorNote?: string | undefined;
  meterCode?: string | undefined;
  sourceTimestamp?: string | undefined;
  receivedAt?: string | undefined;
  isOutlier?: boolean | undefined;
  isDecreasingReset?: boolean | undefined;
  reconciliationNote?: string | undefined;
  deduplicationKey?: string | undefined;
}

export interface SmartMeterDashboardData {
  totalMeters: number;
  electricityMetersCount: number;
  waterMetersCount: number;
  gasMetersCount: number;
  onlineMetersCount: number;
  offlineMetersCount: number;
  lastImportDate?: string;
  readingErrorsCount: number;
}
