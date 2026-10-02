import { mockStore } from '../../../core/mockStore/mockStore';
import {
  ResidentUnitRelationship,
  RelationshipType,
  RelationshipStatus,
  TenancyDetails,
  TenancyApprovalStatus,
  CreateRelationshipInput,
  UpdateRelationshipInput,
  EndRelationshipInput,
  RelationshipValidationResult,
  ValidationError,
  ValidationWarning,
  CurrentOccupancy,
  OccupancyHistory,
  UnitTimelineEvent,
  TimelineEventType,
  RELATIONSHIP_CARDINALITY,
  RELATIONSHIP_STATE_TRANSITIONS,
  RELATIONSHIP_TYPE_LABELS,
  FAMILY_RELATION_LABELS,
  canTransitionRelationshipStatus,
} from '../data/occupancyRelationship.types';
import type { Absent } from '../../../shared/types/absence.types';

let _generateIdCounter = 0;
function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${++_generateIdCounter}-${Math.random().toString(36).substr(2, 9)}`;
}

function getAll(): ResidentUnitRelationship[] {
  try {
    const stored = localStorage.getItem('society-os.resident-unit-relationships');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveAll(rels: ResidentUnitRelationship[]): void {
  localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(rels));
}

function getByUnit(unitId: string): ResidentUnitRelationship[] {
  const all = getAll();
  return all.filter((r) => r.unitId === unitId);
}

function getBySociety(societyId: string): ResidentUnitRelationship[] {
  const all = getAll();
  return all.filter((r) => r.societyId === societyId);
}

function getActiveByUnit(unitId: string): ResidentUnitRelationship[] {
  const all = getAll();
  return all.filter((r) => r.unitId === unitId && r.status === 'ACTIVE');
}

function getActiveByResident(residentId: string): ResidentUnitRelationship[] {
  const all = getAll();
  return all.filter((r) => r.residentId === residentId && r.status === 'ACTIVE');
}

export class RelationshipService {
  static async getRelationshipsForUnit(unitId: string): Promise<ResidentUnitRelationship[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getByUnit(unitId)), 300);
    });
  }

  static async getActiveRelationshipsForUnit(unitId: string): Promise<ResidentUnitRelationship[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getActiveByUnit(unitId)), 300);
    });
  }

  static async getRelationshipsForSociety(societyId: string): Promise<ResidentUnitRelationship[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getBySociety(societyId)), 300);
    });
  }

  static async getActiveRelationshipsForResident(residentId: string): Promise<ResidentUnitRelationship[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(getActiveByResident(residentId)), 300);
    });
  }

  static async getRelationshipById(id: string): Promise<ResidentUnitRelationship | Absent> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const all = getAll();
        resolve(all.find((r) => r.id === id));
      }, 300);
    });
  }

  static async validateRelationship(input: CreateRelationshipInput): Promise<RelationshipValidationResult> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        const activeRelationships = getActiveByUnit(input.unitId);
        const cardinality = RELATIONSHIP_CARDINALITY[input.relationshipType];
        const existingActiveOfType = activeRelationships.filter((r) => r.relationshipType === input.relationshipType);

        if (existingActiveOfType.length >= cardinality.maxActive) {
          errors.push({
            code: 'MAX_CARDINALITY_EXCEEDED',
            field: 'relationshipType',
            message: `Maximum ${cardinality.maxActive} active ${RELATIONSHIP_TYPE_LABELS[input.relationshipType].toLowerCase()}(s) allowed per unit`,
          });
        }

        if (input.endDate && new Date(input.endDate) <= new Date(input.startDate)) {
          errors.push({
            code: 'INVALID_DATE_RANGE',
            field: 'endDate',
            message: 'End date must be after start date',
          });
        }

        if (!cardinality.allowOverlap) {
          const overlapping = getActiveByUnit(input.unitId).some((r) => {
            if (r.relationshipType !== input.relationshipType) return false;
            const existingStart = new Date(r.startDate);
            const existingEnd = r.endDate ? new Date(r.endDate) : null;
            const newStart = new Date(input.startDate);
            const newEnd = input.endDate ? new Date(input.endDate) : null;
            return (
              newStart <= (existingEnd ?? new Date('2099-12-31')) &&
              (newEnd ?? new Date('2099-12-31')) >= existingStart
            );
          });
          if (overlapping) {
            errors.push({
              code: 'OVERLAPPING_RELATIONSHIP',
              field: 'startDate',
              message: `An active ${RELATIONSHIP_TYPE_LABELS[input.relationshipType].toLowerCase()} relationship already exists for this period`,
            });
          }
        }

        if (input.relationshipType === 'TENANT' && input.tenancyDetails) {
          const { agreementStartDate, agreementEndDate, occupancyStartDate } = input.tenancyDetails;
          if (new Date(agreementEndDate) <= new Date(agreementStartDate)) {
            errors.push({
              code: 'INVALID_AGREEMENT_DATES',
              field: 'agreementEndDate',
              message: 'Agreement end date must be after agreement start date',
            });
          }
          if (new Date(occupancyStartDate) < new Date(agreementStartDate)) {
            warnings.push({
              code: 'OCCUPANCY_BEFORE_AGREEMENT',
              field: 'occupancyStartDate',
              message: 'Occupancy start date is before agreement start date',
            });
          }
        }

        if (input.relationshipType === 'TENANT') {
          const activeTenancy = getActiveByUnit(input.unitId).find((r) => r.relationshipType === 'TENANT');
          if (activeTenancy) {
            errors.push({
              code: 'ACTIVE_TENANCY_EXISTS',
              field: 'relationshipType',
              message: 'An active tenancy already exists for this unit',
            });
          }
        }

        if (input.relationshipType === 'OWNER') {
          const activeOwner = getActiveByUnit(input.unitId).find((r) => r.relationshipType === 'OWNER');
          if (activeOwner) {
            errors.push({
              code: 'ACTIVE_OWNER_EXISTS',
              field: 'relationshipType',
              message: 'An active owner already exists for this unit',
            });
          }
        }

        const duplicateResident = getActiveByUnit(input.unitId).some((r) => r.residentId === input.residentId && r.relationshipType === input.relationshipType);
        if (duplicateResident) {
          errors.push({
            code: 'DUPLICATE_RELATIONSHIP',
            field: 'residentId',
            message: 'This resident already has an active relationship of this type for this unit',
          });
        }

        resolve({
          isValid: errors.length === 0,
          errors,
          warnings,
        });
      }, 500);
    });
  }

  static async createRelationship(input: CreateRelationshipInput): Promise<ResidentUnitRelationship> {
    return new Promise(async (resolve, reject) => {
      const validation = await this.validateRelationship(input);
      if (!validation.isValid) {
        reject(new Error(validation.errors.map((e) => e.message).join('; ')));
        return;
      }

      setTimeout(() => {
        const all = getAll();
        const now = new Date().toISOString();
        const newRelationship: ResidentUnitRelationship = {
          id: generateId('rel'),
          residentId: input.residentId,
          unitId: input.unitId,
          societyId: input.societyId,
          relationshipType: input.relationshipType,
          startDate: input.startDate,
          status: 'ACTIVE',
          approvalStatus: input.relationshipType === 'TENANT' ? 'PENDING' : 'NOT_REQUIRED',
          createdBy: 'current-user',
          createdAt: now,
          updatedAt: now,
          ...(input.familyRelation ? { familyRelation: input.familyRelation } : {}),
          ...(input.endDate ? { endDate: input.endDate } : {}),
          ...(input.tenancyDetails ? { tenancyDetails: input.tenancyDetails } : {}),
        };
        all.push(newRelationship);
        localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(all));
        this.emitTimelineEvent({
          id: generateId('evt'),
          unitId: input.unitId,
          type: this.getTimelineEventTypeForCreate(input.relationshipType),
          title: `${RELATIONSHIP_TYPE_LABELS[input.relationshipType]} relationship created`,
          description: `New ${RELATIONSHIP_TYPE_LABELS[input.relationshipType].toLowerCase()} relationship activated`,
          relationshipId: newRelationship.id,
          residentId: input.residentId,
          occurredAt: new Date().toISOString(),
        });
        resolve(newRelationship);
      }, 400);
    });
  }

  static async updateRelationship(input: UpdateRelationshipInput): Promise<ResidentUnitRelationship> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const all = getAll();
        const index = all.findIndex((r) => r.id === input.id);
        if (index === -1) {
          reject(new Error('Relationship not found'));
          return;
        }

        const existing = all[index];
        if (!existing) {
          reject(new Error('Relationship not found'));
          return;
        }
        if (input.status && !canTransitionRelationshipStatus(existing.status, input.status)) {
          reject(new Error(`Cannot transition from ${existing.status} to ${input.status}`));
          return;
        }

        if (input.endDate && new Date(input.endDate) <= new Date(existing.startDate)) {
          reject(new Error('End date must be after start date'));
          return;
        }

        const updatedTenancy = input.tenancyDetails
          ? ({ ...(existing.tenancyDetails || { monthlyRent: 0, leaseAgreementUrl: '', policeVerificationStatus: 'NOT_SUBMITTED' }), ...input.tenancyDetails } as TenancyDetails)
          : existing.tenancyDetails;

        const updated: ResidentUnitRelationship = {
          ...existing,
          ...(input.status ? { status: input.status } : {}),
          ...(input.endDate ? { endDate: input.endDate } : {}),
          ...(input.approvalStatus ? { approvalStatus: input.approvalStatus } : {}),
          ...(updatedTenancy ? { tenancyDetails: updatedTenancy } : {}),
          updatedAt: new Date().toISOString(),
        };
        all[index] = updated;
        localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(all));
        resolve(updated);
      }, 400);
    });
  }

  static async endRelationship(input: EndRelationshipInput): Promise<ResidentUnitRelationship> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const all = getAll();
        const index = all.findIndex((r) => r.id === input.id);
        if (index === -1) {
          reject(new Error('Relationship not found'));
          return;
        }

        const existing = all[index];
        if (!existing) {
          reject(new Error('Relationship not found'));
          return;
        }
        if (existing.status !== 'ACTIVE') {
          reject(new Error('Only active relationships can be ended'));
          return;
        }

        if (new Date(input.endDate) <= new Date(existing.startDate)) {
          reject(new Error('End date must be after start date'));
          return;
        }

        const now = new Date().toISOString();
        const updated: ResidentUnitRelationship = {
          ...existing,
          endDate: input.endDate,
          status: 'ENDED',
          updatedAt: now,
          endedAt: now,
          endedBy: input.endedBy,
          ...(input.endReason ? { endReason: input.endReason } : {}),
        };
        all[index] = updated;
        localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(all));

        this.emitTimelineEvent({
          id: generateId('evt'),
          unitId: existing.unitId,
          type: this.getTimelineEventTypeForEnd(existing.relationshipType),
          title: `${RELATIONSHIP_TYPE_LABELS[existing.relationshipType]} relationship ended`,
          description: `${RELATIONSHIP_TYPE_LABELS[existing.relationshipType]} relationship ended on ${new Date(input.endDate).toLocaleDateString()}`,
          relationshipId: existing.id,
          residentId: existing.residentId,
          occurredAt: new Date().toISOString(),
          ...(input.endReason ? { metadata: { endReason: input.endReason } } : {}),
        });
        resolve(updated);
      }, 400);
    });
  }

  static async getCurrentOccupancy(unitId: string): Promise<CurrentOccupancy> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unit = mockStore.getState().societyUnits.find((u) => u.id === unitId);
        resolve({
          unitId,
          unitNumber: unit?.unitNumber ?? 'Unknown',
          relationships: getActiveByUnit(unitId),
        });
      }, 300);
    });
  }

  static async getOccupancyHistory(unitId: string): Promise<OccupancyHistory> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const unit = mockStore.getState().societyUnits.find((u) => u.id === unitId);
        const all = getAll();
        const unitRels = all.filter((r) => r.unitId === unitId).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        resolve({
          unitId,
          unitNumber: unit?.unitNumber ?? 'Unknown',
          relationships: unitRels,
        });
      }, 300);
    });
  }

  static async getUnitTimeline(unitId: string): Promise<UnitTimelineEvent[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem('society-os.unit-timeline');
        const events: UnitTimelineEvent[] = stored ? JSON.parse(stored) : [];
        const unitEvents = events.filter((e) => e.unitId === unitId).sort((a, b) => new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime());
        resolve(unitEvents);
      }, 300);
    });
  }

  static async approveTenancy(relationshipId: string, approvedBy: string): Promise<ResidentUnitRelationship> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const all = getAll();
        const index = all.findIndex((r) => r.id === relationshipId);
        if (index === -1) {
          reject(new Error('Relationship not found'));
          return;
        }
        const existing = all[index];
        if (!existing) {
          reject(new Error('Relationship not found'));
          return;
        }
        if (existing.relationshipType !== 'TENANT') {
          reject(new Error('Only tenant relationships can be approved'));
          return;
        }
        if (existing.approvalStatus === 'APPROVED') {
          reject(new Error('Tenancy already approved'));
          return;
        }
        const updated: ResidentUnitRelationship = {
          ...existing,
          approvalStatus: 'APPROVED',
          updatedAt: new Date().toISOString(),
        };
        all[index] = updated;
        localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(all));

        this.emitTimelineEvent({
          id: generateId('evt'),
          unitId: existing.unitId,
          type: 'TENANCY_APPROVED',
          title: 'Tenancy approved',
          description: `Tenancy approved by ${approvedBy}`,
          relationshipId: existing.id,
          residentId: existing.residentId,
          occurredAt: new Date().toISOString(),
        });
        resolve(updated);
      }, 400);
    });
  }

  static async rejectTenancy(relationshipId: string, rejectedBy: string, reason: string): Promise<ResidentUnitRelationship> {
    return new Promise(async (resolve, reject) => {
      setTimeout(() => {
        const all = getAll();
        const index = all.findIndex((r) => r.id === relationshipId);
        if (index === -1) {
          reject(new Error('Relationship not found'));
          return;
        }
        const existing = all[index];
        if (!existing) {
          reject(new Error('Relationship not found'));
          return;
        }
        if (existing.relationshipType !== 'TENANT') {
          reject(new Error('Only tenant relationships can be rejected'));
          return;
        }
        const now = new Date().toISOString();
        const updated: ResidentUnitRelationship = {
          ...existing,
          approvalStatus: 'REJECTED',
          status: 'ENDED',
          updatedAt: now,
          endedAt: now,
          endedBy: rejectedBy,
          endReason: reason,
        };
        all[index] = updated;
        localStorage.setItem('society-os.resident-unit-relationships', JSON.stringify(all));
        resolve(updated);
      }, 400);
    });
  }

  private static emitTimelineEvent(event: UnitTimelineEvent): void {
    const stored = localStorage.getItem('society-os.unit-timeline');
    const events: UnitTimelineEvent[] = stored ? JSON.parse(stored) : [];
    events.push(event);
    localStorage.setItem('society-os.unit-timeline', JSON.stringify(events));
  }

  private static getTimelineEventTypeForCreate(type: RelationshipType): TimelineEventType {
    switch (type) {
      case 'OWNER': return 'OWNERSHIP_STARTED';
      case 'CO_OWNER': return 'CO_OWNERSHIP_STARTED';
      case 'TENANT': return 'TENANCY_STARTED';
      case 'FAMILY_MEMBER': return 'FAMILY_MEMBER_ADDED';
      case 'AUTHORIZED_OCCUPANT': return 'AUTHORIZED_OCCUPANT_ADDED';
      default: return 'RELATIONSHIP_STATUS_CHANGED';
    }
  }

  private static getTimelineEventTypeForEnd(type: RelationshipType): TimelineEventType {
    switch (type) {
      case 'OWNER': return 'OWNERSHIP_ENDED';
      case 'CO_OWNER': return 'CO_OWNERSHIP_ENDED';
      case 'TENANT': return 'TENANCY_ENDED';
      case 'FAMILY_MEMBER': return 'FAMILY_MEMBER_REMOVED';
      case 'AUTHORIZED_OCCUPANT': return 'AUTHORIZED_OCCUPANT_REMOVED';
      default: return 'RELATIONSHIP_STATUS_CHANGED';
    }
  }
}


export const relationshipService = RelationshipService;
export default RelationshipService;