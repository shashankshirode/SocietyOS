import type { ResidentScopedEntity } from './residentScope.types';

export type DirectoryVisibilityStatus =
  | 'VISIBLE'
  | 'LIMITED'
  | 'HIDDEN'
  | 'RESTRICTED';

export type ResidentConnectionStatus =
  | 'NOT_CONNECTED'
  | 'REQUEST_SENT'
  | 'REQUEST_RECEIVED'
  | 'CONNECTED'
  | 'BLOCKED_BY_ME'
  | 'BLOCKED_ME'
  | 'RESTRICTED';

export type ContactRequestStatus =
  | 'PENDING'
  | 'ACCEPTED'
  | 'REJECTED'
  | 'BLOCKED'
  | 'REPORTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type ContactRequestCategory =
  | 'WATER_LEAKAGE'
  | 'PARKING_ISSUE'
  | 'PARCEL_HANDOVER'
  | 'NOISE'
  | 'RENOVATION_NOTICE'
  | 'PET_CONCERN'
  | 'COMMUNITY_HELP'
  | 'OTHER';

export type ContactRequestUrgency =
  | 'NORMAL'
  | 'IMPORTANT'
  | 'URGENT';

export interface ResidentDirectoryEntry extends ResidentScopedEntity {
  id: string;
  name: string;
  unitId: string;
  flatNumber: string;
  tower: string;
  residentType: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  visibilityStatus: DirectoryVisibilityStatus;
  connectionStatus: ResidentConnectionStatus;
  lastActiveText?: string;
  allowedTopics?: ContactRequestCategory[];
  mutualContext?: string[];
  bio?: string;
}

export interface ContactRequest {
  id: string;
  fromResidentId: string;
  fromResidentName: string;
  fromFlat: string;
  toResidentId: string;
  toResidentName: string;
  toFlat: string;
  subject: string;
  message: string;
  category: ContactRequestCategory;
  urgency: ContactRequestUrgency;
  allowFlatShare: boolean;
  status: ContactRequestStatus;
  createdAt: string;
  updatedAt: string;
}
