import type { AmcStatus } from './amc.types';

export type AssetCategory =
  | 'LIFT' | 'FIRE_SYSTEM' | 'WATER_PUMP' | 'GENERATOR' | 'CCTV_CAMERA' | 'INTERCOM' | 'STP' | 'WTP'
  | 'SOLAR_PANEL' | 'SWIMMING_POOL_EQUIPMENT' | 'GYM_EQUIPMENT' | 'ELECTRICAL_PANEL'
  | 'PLUMBING_SYSTEM' | 'COMMON_AREA_LIGHTING' | 'OTHER';

export type AssetStatus = 'ACTIVE' | 'UNDER_MAINTENANCE' | 'BREAKDOWN' | 'RETIRED' | 'REPLACEMENT_DUE' | 'INACTIVE';
export type MaintenanceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'CUSTOM';
export type MaintenanceScheduleStatus = 'SCHEDULED' | 'DUE' | 'OVERDUE' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

export type Asset = {
  id: string;
  assetName: string;
  assetCode: string;
  category: AssetCategory;
  location: string;
  installationDate: string;
  purchaseDate: string;
  vendorId: string;
  vendorName: string;
  amcContractId?: string;
  amcContractNumber?: string;
  amcStatus: AmcStatus;
  warrantyExpiry: string;
  warrantyStatus: string;
  status: AssetStatus;
  healthScore: number;
  lastServiceDate: string;
  nextServiceDate: string;
  serviceFrequency: MaintenanceFrequency;
  openWorkOrders: number;
  documents: string[];
  serviceHistorySummary: string;
  breakdownCount: number;
  notes: string;
};

export type AssetDocument = {
  id: string;
  assetId: string;
  documentName: string;
  documentType: string;
  status: 'REQUIRED' | 'UPLOADED' | 'PENDING_VERIFICATION' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  expiryDate?: string;
  uploadedDate?: string;
  verifiedBy?: string;
};

export type PreventiveMaintenanceSchedule = {
  id: string;
  scheduleNumber: string;
  assetId: string;
  assetName: string;
  category: AssetCategory;
  vendorName: string;
  plannedDate: string;
  plannedTime: string;
  frequency: MaintenanceFrequency;
  status: MaintenanceScheduleStatus;
  assignedTo: string;
  lastCompletedDate: string;
  nextDueDate: string;
};
