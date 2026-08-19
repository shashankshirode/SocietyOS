import type { OwnerInfo, TenantInfo } from './ownerTenant.types';

export type UnitOccupancyStatus =
  | 'OWNER_OCCUPIED'
  | 'TENANT_OCCUPIED'
  | 'VACANT'
  | 'UNDER_RENOVATION'
  | 'MOVE_IN_PENDING'
  | 'MOVE_OUT_PENDING';

export type OccupancyTimelineEventStatus =
  | 'COMPLETED'
  | 'CURRENT'
  | 'PENDING'
  | 'CANCELLED';

export interface UnitDetails {
  id: string;
  societyId: string;
  tower: string;
  floor: string;
  flatNumber: string;
  unitType: 'APARTMENT' | 'PENTHOUSE' | 'VILLA' | 'STUDIO';
  occupancyStatus: UnitOccupancyStatus;
  carpetAreaSqFt: number;
  parkingSlots: string[];
}

export interface OccupancyTimelineEvent {
  id: string;
  eventTitle: string;
  eventType:
    | 'OWNERSHIP_STARTED'
    | 'TENANT_MOVE_IN'
    | 'TENANT_PV_COMPLETED'
    | 'VEHICLE_ADDED'
    | 'NOC_REQUESTED'
    | 'MOVE_OUT_REQUESTED'
    | 'DUES_CLEARED'
    | 'NOC_GENERATED'
    | 'ACCESS_REVOKED'
    | 'OWNERSHIP_TRANSFERRED';
  eventDate: string;
  actorName: string;
  description: string;
  linkedReferenceId?: string;
  status: OccupancyTimelineEventStatus;
}

export interface OccupancyOverview {
  unitDetails: UnitDetails;
  societyName: string;
  currentOwner?: OwnerInfo;
  currentTenant?: TenantInfo;
  familyMembersCount: number;
  vehiclesCount: number;
  documentsCompletionCount: number;
  documentsPendingCount: number;
  activeMoveOutNocId?: string;
  previousOwnersCount: number;
  previousTenantsCount: number;
  lastOwnershipChangeDate?: string;
  lastTenancyChangeDate?: string;
}
