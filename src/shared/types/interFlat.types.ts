export type InterFlatIssueType =
  | 'WATER_LEAKAGE'
  | 'NOISE_DISTURBANCE'
  | 'RENOVATION_DISTURBANCE'
  | 'PET_NUISANCE'
  | 'COMMON_AREA_DAMAGE'
  | 'ODOUR_OR_SMOKE'
  | 'PARKING_RELATED'
  | 'PARKING_DISPUTE'
  | 'TRASH_DISPOSAL'
  | 'OBJECT_IN_COMMON_AREA'
  | 'OTHER';

export type InterFlatIssueSeverity =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'URGENT';

export type InterFlatIssueStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'NEIGHBOUR_NOTIFIED'
  | 'AWAITING_RESPONSE'
  | 'RESPONSE_RECEIVED'
  | 'INSPECTION_REQUESTED'
  | 'INSPECTION_SCHEDULED'
  | 'INSPECTION_COMPLETED'
  | 'MEDIATION_REQUESTED'
  | 'MEDIATION_ACTIVE'
  | 'RESOLUTION_PROPOSED'
  | 'PROPOSAL_PENDING'
  | 'AWAITING_ACCEPTANCE'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REOPENED'
  | 'ESCALATED'
  | 'ESCALATED_TO_COMMITTEE'
  | 'CANCELLED';

export type NoiseType =
  | 'LOUD_MUSIC'
  | 'PARTY'
  | 'RENOVATION_NOISE'
  | 'DOG_BARKING'
  | 'FURNITURE_MOVEMENT'
  | 'SHOUTING'
  | 'MACHINE_NOISE'
  | 'OTHER';

export type RenovationDisturbanceType =
  | 'NOISE'
  | 'DUST'
  | 'DEBRIS'
  | 'COMMON_AREA_DAMAGE'
  | 'LIFT_USAGE'
  | 'WORK_OUTSIDE_ALLOWED_TIME'
  | 'WATER_ELECTRICAL_IMPACT'
  | 'OTHER';

export type PetIssueType =
  | 'NOISE'
  | 'CLEANLINESS'
  | 'AGGRESSIVE_BEHAVIOUR'
  | 'LEASH_RULE'
  | 'COMMON_AREA_DAMAGE'
  | 'OTHER';

export type DamageType =
  | 'WALL_DAMAGE'
  | 'LIFT_DAMAGE'
  | 'PARKING_DAMAGE'
  | 'GARDEN_DAMAGE'
  | 'CLUBHOUSE_DAMAGE'
  | 'WATER_DAMAGE'
  | 'OTHER';

export type EvidenceType =
  | 'PHOTO'
  | 'VIDEO'
  | 'AUDIO_NOTE'
  | 'DOCUMENT'
  | 'FACILITY_INSPECTION_PHOTO'
  | 'DAMAGE_ESTIMATE'
  | 'OTHER';

export type IssueResponseType =
  | 'ACKNOWLEDGE_AND_COOPERATE'
  | 'NEED_MORE_DETAILS'
  | 'DISAGREE'
  | 'ALREADY_RESOLVED'
  | 'NOT_RELATED_TO_MY_FLAT'
  | 'REQUEST_MEDIATION';

export interface EvidencePlaceholder {
  id: string;
  evidenceType: EvidenceType;
  fileName: string;
  fileSizePlaceholder: string;
  uploadedByUserName: string;
  uploadedAt: string;
  note?: string;
}

export interface InterFlatIssueResponse {
  id: string;
  responseType: IssueResponseType;
  explanation: string;
  willCooperateWithInspection: boolean;
  proposedResolution?: string;
  evidence: EvidencePlaceholder[];
  responderName: string;
  responderFlat: string;
  respondedAt: string;
}

export interface InterFlatIssue {
  id: string;
  issueNumber: string;
  issueType: InterFlatIssueType;
  severity: InterFlatIssueSeverity;
  status: InterFlatIssueStatus;
  reporterUserId: string;
  reporterUserName: string;
  reporterFlat: string;
  reporterTower: string;
  involvedFlat: string;
  involvedTower: string;
  involvedResidentName?: string;
  location: string;
  description: string;
  preferredResolution?: string;
  evidence: EvidencePlaceholder[];
  responses: InterFlatIssueResponse[];
  inspectionId?: string;
  mediationId?: string;
  ruleReferenceIds?: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  closedAt?: string;
  closureSummary?: string;
}

export interface CreateInterFlatIssueInput extends JsonObject {
  issueType: InterFlatIssueType;
  severity: InterFlatIssueSeverity;
  involvedFlat: string;
  involvedTower: string;
  location: string;
  description: string;
  preferredResolution?: string;
  isPrivate?: boolean;
}
export type { EvidencePlaceholder as Evidence, InterFlatIssueResponse as IssueResponse };
