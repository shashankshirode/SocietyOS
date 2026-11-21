import type { ResidentAccessStatus, AppAccessCapability } from './ownerTenant.types';

export interface AccessCapabilityDetail {
  capability: AppAccessCapability;
  label: string;
  description: string;
  isAllowed: boolean;
}

export interface UnitAccessStatusInfo {
  unitId: string;
  residentId: string;
  residentName: string;
  residentType: 'OWNER' | 'TENANT' | 'FAMILY';
  accessStatus: ResidentAccessStatus;
  capabilities: AccessCapabilityDetail[];
  lastModifiedDate: string;
  lastModifiedBy: string;
  warningNote?: string;
}
