import type { JsonValue } from '../../../core/api/api.types';

export type RelationshipType =
  | 'OWNER'
  | 'CO_OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'AUTHORIZED_OCCUPANT';

export type RelationshipStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'ENDED'
  | 'CANCELLED';

export type TenancyApprovalStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED';

export interface ResidentUnitRelationship {
  id: string;
  residentId: string;
  unitId: string;
  societyId: string;
  relationshipType: RelationshipType;
  familyRelation?: FamilyRelation;
  startDate: string;
  endDate?: string;
  status: RelationshipStatus;
  tenancyDetails?: TenancyDetails;
  approvalStatus?: TenancyApprovalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  endedAt?: string;
  endedBy?: string;
  endReason?: string;
}

export interface TenancyDetails {
  agreementStartDate: string;
  agreementEndDate: string;
  occupancyStartDate: string;
  monthlyRent?: number;
  securityDeposit?: number;
  lockInPeriodMonths?: number;
  numberOfOccupants: number;
  rentAgreementDocumentId?: string;
}

export type FamilyRelation =
  | 'SPOUSE'
  | 'FATHER'
  | 'MOTHER'
  | 'SON'
  | 'DAUGHTER'
  | 'BROTHER'
  | 'SISTER'
  | 'GRANDFATHER'
  | 'GRANDMOTHER'
  | 'OTHER';

export interface CreateRelationshipInput {
  residentId: string;
  unitId: string;
  societyId: string;
  relationshipType: RelationshipType;
  familyRelation?: FamilyRelation;
  startDate: string;
  endDate?: string;
  tenancyDetails?: TenancyDetails;
}

export interface UpdateRelationshipInput {
  id: string;
  endDate?: string;
  status?: RelationshipStatus;
  tenancyDetails?: Partial<TenancyDetails>;
  approvalStatus?: TenancyApprovalStatus;
}

export interface EndRelationshipInput {
  id: string;
  endDate: string;
  endedBy: string;
  endReason?: string;
}

export interface RelationshipValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  field: string;
  message: string;
}

export interface ValidationWarning {
  code: string;
  field: string;
  message: string;
}

export interface CurrentOccupancy {
  unitId: string;
  unitNumber: string;
  relationships: ResidentUnitRelationship[];
}

export interface OccupancyHistory {
  unitId: string;
  unitNumber: string;
  relationships: ResidentUnitRelationship[];
}

export interface UnitTimelineEvent {
  id: string;
  unitId: string;
  type: TimelineEventType;
  title: string;
  description: string;
  relationshipId?: string;
  residentId?: string;
  residentName?: string;
  occurredAt: string;
  metadata?: Record<string, JsonValue>;
}

export type TimelineEventType =
  | 'OWNERSHIP_STARTED'
  | 'OWNERSHIP_ENDED'
  | 'CO_OWNERSHIP_STARTED'
  | 'CO_OWNERSHIP_ENDED'
  | 'TENANCY_STARTED'
  | 'TENANCY_ENDED'
  | 'FAMILY_MEMBER_ADDED'
  | 'FAMILY_MEMBER_REMOVED'
  | 'AUTHORIZED_OCCUPANT_ADDED'
  | 'AUTHORIZED_OCCUPANT_REMOVED'
  | 'RELATIONSHIP_STATUS_CHANGED'
  | 'TENANCY_APPROVED'
  | 'TENANCY_REJECTED';

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  OWNER: 'Owner',
  CO_OWNER: 'Co-Owner',
  TENANT: 'Tenant',
  FAMILY_MEMBER: 'Family Member',
  AUTHORIZED_OCCUPANT: 'Authorized Occupant',
};

export const RELATIONSHIP_STATUS_LABELS: Record<RelationshipStatus, string> = {
  PENDING: 'Pending',
  ACTIVE: 'Active',
  ENDED: 'Ended',
  CANCELLED: 'Cancelled',
};

export const FAMILY_RELATION_LABELS: Record<FamilyRelation, string> = {
  SPOUSE: 'Spouse',
  FATHER: 'Father',
  MOTHER: 'Mother',
  SON: 'Son',
  DAUGHTER: 'Daughter',
  BROTHER: 'Brother',
  SISTER: 'Sister',
  GRANDFATHER: 'Grandfather',
  GRANDMOTHER: 'Grandmother',
  OTHER: 'Other',
};

export const RELATIONSHIP_CARDINALITY: Record<RelationshipType, { maxActive: number; allowOverlap: boolean }> = {
  OWNER: { maxActive: 1, allowOverlap: false },
  CO_OWNER: { maxActive: 10, allowOverlap: true },
  TENANT: { maxActive: 1, allowOverlap: false },
  FAMILY_MEMBER: { maxActive: 20, allowOverlap: true },
  AUTHORIZED_OCCUPANT: { maxActive: 5, allowOverlap: true },
};

export const RELATIONSHIP_STATE_TRANSITIONS: Record<RelationshipStatus, RelationshipStatus[]> = {
  PENDING: ['ACTIVE', 'CANCELLED'],
  ACTIVE: ['ENDED', 'CANCELLED'],
  ENDED: [],
  CANCELLED: [],
};

export function canTransitionRelationshipStatus(
  from: RelationshipStatus,
  to: RelationshipStatus
): boolean {
  return RELATIONSHIP_STATE_TRANSITIONS[from]?.includes(to) ?? false;
}