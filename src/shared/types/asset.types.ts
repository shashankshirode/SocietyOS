import type { AmcStatus } from './amc.types';

export type AssetCategory =
  | 'LIFT' | 'FIRE_SYSTEM' | 'WATER_PUMP' | 'GENERATOR' | 'CCTV_CAMERA' | 'INTERCOM' | 'STP' | 'WTP'
  | 'SOLAR_PANEL' | 'SWIMMING_POOL_EQUIPMENT' | 'SWIMMING_POOL' | 'GYM_EQUIPMENT' | 'ELECTRICAL_PANEL'
  | 'ELECTRICAL' | 'SYSTEM' | 'PLUMBING_SYSTEM' | 'COMMON_AREA_LIGHTING' | 'OTHER';

export type AssetStatus = 'ACTIVE' | 'UNDER_MAINTENANCE' | 'BREAKDOWN' | 'RETIRED' | 'REPLACEMENT_DUE' | 'INACTIVE';
export type AssetLifecycleStatus = 'COMMISSIONED' | 'ACTIVE' | 'UNDER_MAINTENANCE' | 'RETIRED' | 'DISPOSED';
export type AssetOperationalCondition = 'OPTIMAL' | 'DEGRADED' | 'BREAKDOWN' | 'DECOMMISSIONED';
export type MaintenanceFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'HALF_YEARLY' | 'YEARLY' | 'CUSTOM' | 'USAGE_BASED' | 'RULE_BASED';
export type MaintenanceScheduleStatus = 'SCHEDULED' | 'DUE' | 'OVERDUE' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

export type AssetTransfer = {
  id: string;
  assetId: string;
  fromLocation: string;
  toLocation: string;
  transferredAt: string;
  transferredBy: string;
  reason: string;
};

export type CreateAssetInput = {
  assetName: string;
  assetCode?: string;
  category: AssetCategory;
  location: string;
  vendorId: string;
  vendorName: string;
  purchaseDate: string;
  installationDate: string;
  warrantyExpiry: string;
  serviceFrequency: MaintenanceFrequency;
  warrantyStatus?: string;
  amcStatus?: string;
  documentVaultIds?: string[];
  notes?: string;
  serialNumber?: string;
  model?: string;
  amcContractId?: string;
  amcContractNumber?: string;
  clientOperationId?: string;
};

export type TransferAssetInput = {
  assetId: string;
  toLocation: string;
  reason: string;
  clientOperationId?: string;
};

export type RetireAssetInput = {
  assetId: string;
  reason: string;
  replacementAssetId?: string;
};

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
  lifecycleStatus?: AssetLifecycleStatus;
  operationalCondition?: AssetOperationalCondition;
  replacementAssetId?: string;
  retirementReason?: string;
  retiredAt?: string;
  retiredBy?: string;
  serialNumber?: string;
  model?: string;
  documentVaultIds?: string[];
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
