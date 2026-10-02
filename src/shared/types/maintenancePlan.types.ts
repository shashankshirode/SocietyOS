import type { MaintenanceFrequency } from './asset.types';

export interface ChecklistItem {
  id: string;
  taskDescription: string;
  isMandatory: boolean;
}

export type NextDueCalculationRule = 'FIXED_CALENDAR' | 'COMPLETION_RELATIVE';

export interface MaintenancePlan {
  id: string;
  planNumber: string;
  assetId: string;
  assetName: string;
  title: string;
  frequency: MaintenanceFrequency;
  checklist: ChecklistItem[];
  assignedVendorId?: string;
  assignedVendorName?: string;
  assignedTeam?: string;
  slaHours: number;
  requiredEvidence: string[];
  nextDueRule: NextDueCalculationRule;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  isActive: boolean;
  version: number;
  createdAt: string;
  updatedAt?: string;
}

export interface MaintenanceOccurrence {
  id: string;
  occurrenceKey: string;
  societyId: string;
  planId: string;
  assetId: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'GENERATED' | 'MISSED' | 'COMPLETED' | 'CANCELLED';
  generatedWorkOrderId?: string;
  createdAt: string;
  escalatedAt?: string;
}

export interface CreateMaintenancePlanInput {
  assetId: string;
  assetName: string;
  title: string;
  frequency: MaintenanceFrequency;
  checklist: ChecklistItem[];
  assignedVendorId?: string;
  assignedVendorName?: string;
  assignedTeam?: string;
  slaHours: number;
  requiredEvidence: string[];
  nextDueRule: NextDueCalculationRule;
  effectiveStartDate: string;
  effectiveEndDate?: string;
  clientOperationId?: string;
}
