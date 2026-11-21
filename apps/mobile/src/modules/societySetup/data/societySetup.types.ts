import type { PropertyHierarchyLevel, UnitType, UnitBillingCategory } from './societyProperty.types';
import type { JsonValue } from '../../../core/api/api.types';
import type { Absent } from '../../../shared/types/absence.types';

export interface SocietyHierarchyNode {
  id: string;
  name: string;
  type?: 'SOCIETY' | 'BUILDING' | 'WING' | 'FLOOR' | 'UNIT';
  level?: PropertyHierarchyLevel | string;
  code?: string;
  societyId?: string;
  parentId?: string;
  orderIndex?: number;
  children?: SocietyHierarchyNode[];
  createdAt?: string;
  updatedAt?: string;
  [key: string]: JsonValue | SocietyHierarchyNode[] | Absent;
}

export interface TowerSetupData {
  towerName: string;
  wingsCount: number;
  floorsCount: number;
  unitsPerFloor: number;
}

export interface UnitDetailInfo {
  id: string;
  unitNumber: string;
  societyId?: string;
  phaseId?: string;
  towerId?: string;
  wingId?: string;
  floorId?: string;
  wing?: string;
  floor?: number;
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT' | 'RESERVED' | 'UNDER_CONSTRUCTION';
  ownerName?: string;
  tenantName?: string;
  areaSqFt?: number;
  parkingSlot?: string;
  billingFrequency?: 'MONTHLY' | 'QUARTERLY';
  kycVerified?: boolean;
  type?: UnitType;
  carpetAreaSqFt?: number;
  builtupAreaSqFt?: number;
  superBuiltupAreaSqFt?: number;
  billingCategory?: UnitBillingCategory;
  parkingSlots?: string[];
  status?: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RESERVED';
  createdAt?: string;
  updatedAt?: string;
}
