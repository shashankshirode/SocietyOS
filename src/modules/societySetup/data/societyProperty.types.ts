import type { JsonValue, JsonObject } from '../../../core/api/api.types';
import type { Absent } from '../../../shared/types/absence.types';

export type SocietyLifecycleStatus =
  | 'DRAFT'
  | 'CONFIGURING'
  | 'VALIDATING'
  | 'READY'
  | 'ACTIVE'
  | 'SUSPENDED'
  | 'ARCHIVED';

export type SocietyType =
  | 'STANDALONE_BUILDING'
  | 'COOPERATIVE_HOUSING_SOCIETY'
  | 'GATED_APARTMENT'
  | 'VILLA_COMMUNITY'
  | 'LARGE_TOWNSHIP'
  | 'MIXED_USE_COMPLEX';

export type LaunchMode =
  | 'FREE_LAUNCH'
  | 'INTERNAL_DEMO'
  | 'PILOT'
  | 'PAID';

export interface SocietyAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface SocietyRegionalConfig {
  timezone: string;
  currency: string;
  financialYearStartMonth: number;
  defaultLanguage: string;
}

export interface Society {
  id: string;
  name: string;
  registrationNumber?: string;
  type: SocietyType;
  status: SocietyLifecycleStatus;
  address: SocietyAddress;
  regionalConfig: SocietyRegionalConfig;
  planCode: string;
  billingMode: string;
  totalUnits: number;
  activeUsers: number;
  enabledModulesCount: number;
  facilities?: JsonValue[];
  parkingAreas?: JsonValue[];
  admins?: JsonValue[];
  notificationConfig?: JsonObject;
  features?: JsonObject;
  featureFlags?: JsonObject;
  createdAt: string;
  updatedAt: string;
  activatedAt?: string;
}

export interface CreateSocietyRequest {
  name: string;
  registrationNumber?: string;
  type: SocietyType;
  address: SocietyAddress;
  regionalConfig: SocietyRegionalConfig;
  primaryContactName: string;
  primaryContactMobile: string;
  primaryContactEmail: string;
  initialAdminEmail: string;
  launchMode: LaunchMode;
  defaultLanguage: string;
  enabledModuleTemplate: string;
  notes?: string;
  facilities?: JsonValue[];
  parkingAreas?: JsonValue[];
  admins?: JsonValue[];
  notificationConfig?: JsonObject;
  features?: JsonObject;
  featureFlags?: JsonObject;
}

export interface UpdateSocietyRequest extends Partial<CreateSocietyRequest> {
  id: string;
  status?: SocietyLifecycleStatus;
}

export interface SocietyOnboardingDraft {
  id: string;
  societyName: string;
  societyType: SocietyType;
  city: string;
  state: string;
  address?: string;
  numberOfTowersWings: number;
  approximateUnitCount: number;
  primaryContactName: string;
  primaryContactMobile: string;
  primaryContactEmail: string;
  initialAdminEmail: string;
  launchMode: LaunchMode;
  defaultLanguage: string;
  enabledModuleTemplate: string;
  notes?: string;
  status: 'DRAFT' | 'REVIEW' | 'READY_FOR_ACTIVATION' | 'ACTIVATED';
  createdAt: string;
  updatedAt: string;
}

export type PropertyHierarchyLevel =
  | 'SOCIETY'
  | 'PHASE'
  | 'TOWER'
  | 'BLOCK'
  | 'WING'
  | 'FLOOR'
  | 'UNIT';

export interface PropertyHierarchyNode {
  id: string;
  name: string;
  code: string;
  level: PropertyHierarchyLevel;
  parentId?: string;
  societyId: string;
  orderIndex: number;
  metadata?: Record<string, JsonValue>;
  children?: PropertyHierarchyNode[];
  createdAt: string;
  updatedAt: string;
}

export interface Phase extends PropertyHierarchyNode {
  level: 'PHASE';
  description?: string;
  startDate?: string;
  endDate?: string;
}

export interface Tower extends PropertyHierarchyNode {
  level: 'TOWER';
  phaseId: string;
  wingsCount: number;
  floorsCount: number;
  unitsPerFloor: number;
}

export interface Wing extends PropertyHierarchyNode {
  level: 'WING';
  towerId: string;
  wingType: 'BLOCK' | 'WING';
}

export interface Floor extends PropertyHierarchyNode {
  level: 'FLOOR';
  wingId: string;
  floorNumber: number;
  floorLabel?: string;
}

export type UnitType =
  | '1BHK'
  | '2BHK'
  | '3BHK'
  | '4BHK'
  | 'PENTHOUSE'
  | 'STUDIO'
  | 'SHOP'
  | 'OFFICE'
  | 'VILLA'
  | 'ROW_HOUSE'
  | 'OTHER';

export type UnitOccupancyStatus =
  | 'VACANT'
  | 'OWNER_OCCUPIED'
  | 'TENANT_OCCUPIED'
  | 'RESERVED'
  | 'UNDER_CONSTRUCTION';

export type UnitBillingCategory =
  | 'RESIDENTIAL'
  | 'COMMERCIAL'
  | 'MIXED'
  | 'EXEMPT';

export interface Unit {
  id: string;
  unitNumber: string;
  societyId: string;
  phaseId?: string;
  towerId: string;
  wingId?: string;
  floorId: string;
  type: UnitType;
  carpetAreaSqFt: number;
  builtupAreaSqFt: number;
  superBuiltupAreaSqFt?: number;
  occupancyStatus: UnitOccupancyStatus;
  billingCategory: UnitBillingCategory;
  parkingSlots?: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'RESERVED';
  metadata?: Record<string, JsonValue>;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitRequest {
  unitNumber: string;
  societyId: string;
  phaseId?: string;
  towerId: string;
  wingId?: string;
  floorId: string;
  type: UnitType;
  carpetAreaSqFt: number;
  builtupAreaSqFt: number;
  superBuiltupAreaSqFt?: number;
  occupancyStatus: UnitOccupancyStatus;
  billingCategory: UnitBillingCategory;
  parkingSlots?: string[];
}

export interface UpdateUnitRequest extends Partial<CreateUnitRequest> {
  id: string;
}

export interface BulkUnitGenerationRequest {
  societyId: string;
  towerId: string;
  wingId?: string;
  startFloor: number;
  endFloor: number;
  unitsPerFloor: number;
  unitNumberPattern: string;
  unitType: UnitType;
  carpetAreaSqFt: number;
  builtupAreaSqFt: number;
  occupancyStatus: UnitOccupancyStatus;
  billingCategory: UnitBillingCategory;
}

export interface BulkUnitPreviewItem {
  unitNumber: string;
  floorNumber: number;
  wingName?: string;
  towerName: string;
  isDuplicate: boolean;
  existingUnitId?: string;
  errors: string[];
}

export interface BulkUnitPreviewResult {
  totalGenerated: number;
  valid: number;
  duplicates: number;
  errors: number;
  items: BulkUnitPreviewItem[];
}

export interface ValidationCheck {
  id: string;
  category: 'SOCIETY' | 'PROPERTY' | 'CONFIGURATION' | 'UNITS';
  name: string;
  description: string;
  status: 'PASS' | 'FAIL' | 'WARNING' | 'SKIPPED';
  entityId?: string;
  entityType?: PropertyHierarchyLevel;
  message?: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
}

export interface ValidationResult {
  societyId: string;
  overallStatus: 'READY' | 'FAILED' | 'WARNING';
  checks: ValidationCheck[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    warnings: number;
  };
  validatedAt: string;
}

export interface SocietyActivationRequest {
  societyId: string;
  confirmValidationPassed: boolean;
  activatedBy: string;
}

export interface SocietyActivationResult {
  societyId: string;
  status: SocietyLifecycleStatus;
  activatedAt: string;
  activatedBy: string;
}

export const SOCIETY_LIFECYCLE_TRANSITIONS: Record<SocietyLifecycleStatus, SocietyLifecycleStatus[]> = {
  DRAFT: ['CONFIGURING', 'ARCHIVED'],
  CONFIGURING: ['VALIDATING', 'DRAFT', 'ARCHIVED'],
  VALIDATING: ['READY', 'CONFIGURING', 'ARCHIVED'],
  READY: ['ACTIVE', 'CONFIGURING', 'ARCHIVED'],
  ACTIVE: ['SUSPENDED', 'ARCHIVED'],
  SUSPENDED: ['ACTIVE', 'ARCHIVED'],
  ARCHIVED: [],
};

export function canTransition(from: SocietyLifecycleStatus, to: SocietyLifecycleStatus): boolean {
  return SOCIETY_LIFECYCLE_TRANSITIONS[from]?.includes(to) ?? false;
}

export const DEFAULT_SOCIETY_REGIONAL_CONFIG: SocietyRegionalConfig = {
  timezone: 'Asia/Kolkata',
  currency: 'INR',
  financialYearStartMonth: 4,
  defaultLanguage: 'en',
};

export const DEFAULT_SOCIETY_ADDRESS: SocietyAddress = {
  line1: '',
  line2: '',
  city: '',
  state: '',
  pincode: '',
  country: 'India',
};

export const UNIT_TYPES: UnitType[] = [
  '1BHK', '2BHK', '3BHK', '4BHK', 'PENTHOUSE', 'STUDIO', 'SHOP', 'OFFICE', 'VILLA', 'ROW_HOUSE', 'OTHER'
];

export const OCCUPANCY_STATUSES: UnitOccupancyStatus[] = [
  'VACANT', 'OWNER_OCCUPIED', 'TENANT_OCCUPIED', 'RESERVED', 'UNDER_CONSTRUCTION'
];

export const BILLING_CATEGORIES: UnitBillingCategory[] = [
  'RESIDENTIAL', 'COMMERCIAL', 'MIXED', 'EXEMPT'
];

export const SOCIETY_TYPES: SocietyType[] = [
  'STANDALONE_BUILDING', 'COOPERATIVE_HOUSING_SOCIETY', 'GATED_APARTMENT', 'VILLA_COMMUNITY', 'LARGE_TOWNSHIP', 'MIXED_USE_COMPLEX'
];

export const LAUNCH_MODES: LaunchMode[] = [
  'FREE_LAUNCH', 'INTERNAL_DEMO', 'PILOT', 'PAID'
];

export const PROPERTY_HIERARCHY_LEVELS: PropertyHierarchyLevel[] = [
  'SOCIETY', 'PHASE', 'TOWER', 'BLOCK', 'WING', 'FLOOR', 'UNIT'
];

export const LEVEL_HIERARCHY_ORDER: Record<PropertyHierarchyLevel, number> = {
  SOCIETY: 0,
  PHASE: 1,
  TOWER: 2,
  BLOCK: 3,
  WING: 4,
  FLOOR: 5,
  UNIT: 6,
};

export function getAllowedChildren(parentLevel: PropertyHierarchyLevel): PropertyHierarchyLevel[] {
  const parentOrder = LEVEL_HIERARCHY_ORDER[parentLevel];
  return PROPERTY_HIERARCHY_LEVELS.filter(level => LEVEL_HIERARCHY_ORDER[level] === parentOrder + 1);
}

export function getParentLevel(childLevel: PropertyHierarchyLevel): PropertyHierarchyLevel | null {
  const childOrder = LEVEL_HIERARCHY_ORDER[childLevel];
  if (childOrder === 0) return null;
  const parentOrder = childOrder - 1;
  return PROPERTY_HIERARCHY_LEVELS.find(level => LEVEL_HIERARCHY_ORDER[level] === parentOrder) ?? null;
}