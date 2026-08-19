import type { MessageKey } from '../../navigation/residentHeader.types';

export type ResidentRoleVariant =
  | 'RESIDENT_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY';

export type ResidentRoleCapabilityKey =
  | 'ownerProfile'
  | 'tenantProfile'
  | 'family'
  | 'familyMemberManagement'
  | 'tenantOnboarding'
  | 'tenantDocumentUpload'
  | 'tenantAccessPermissionManagement'
  | 'maintenance'
  | 'noc'
  | 'documents'
  | 'vehicles'
  | 'governance'
  | 'polls'
  | 'residentConnect'
  | 'emergency'
  | 'marketplace'
  | 'facilityBooking'
  | 'settings'
  | 'visitors'
  | 'complaints';

export type ResidentRoleCapability = {
  key: ResidentRoleCapabilityKey;
  titleMessageKey: MessageKey;
  enabled: boolean;
  requiredRoutes: string[];
  requiredActions: string[];
};

export type ResidentRoleCapabilityProfile = {
  role: ResidentRoleVariant;
  roleLabelKey: MessageKey;
  capabilities: ResidentRoleCapability[];
};
