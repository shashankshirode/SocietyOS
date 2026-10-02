import type { ResidentScopedEntity } from './residentScope.types';
import type { JsonObject } from '../../core/api/api.types';

export type ComplaintCategory =
  | 'PLUMBING'
  | 'LIFT'
  | 'SECURITY'
  | 'HOUSEKEEPING'
  | 'PARKING'
  | 'NOISE'
  | 'WATER_LEAKAGE'
  | 'ELECTRICAL'
  | 'COMMON_AREA'
  | 'FACILITY'
  | 'PEST_CONTROL'
  | 'CLEANING'
  | 'WASTE_MANAGEMENT'
  | 'FIRE_SAFETY'
  | 'OTHER';

export type ComplaintSubcategory =
  | 'PIPE_BURST'
  | 'LEAKAGE'
  | 'LOW_PRESSURE'
  | 'NO_WATER'
  | 'DRAINAGE_BLOCK'
  | 'LIFT_STUCK'
  | 'LIFT_NOISY'
  | 'LIFT_DOOR_ISSUE'
  | 'UNAUTHORIZED_ENTRY'
  | 'THEFT'
  | 'SUSPICIOUS_ACTIVITY'
  | 'COMMON_AREA_DIRTY'
  | 'GARBAGE_NOT_COLLECTED'
  | 'PARKING_OBSTRUCTION'
  | 'WRONG_PARKING'
  | 'LOUD_MUSIC'
  | 'CONSTRUCTION_NOISE'
  | 'WALL_DAMPNESS'
  | 'CEILING_LEAK'
  | 'POWER_OUTAGE'
  | 'FLICKERING_LIGHTS'
  | 'MCB_TRIPPING'
  | 'GENERATOR_ISSUE'
  | 'LOBBY_DIRTY'
  | 'CORRIDOR_LIGHTS'
  | 'GYM_EQUIPMENT'
  | 'POOL_ISSUE'
  | 'RODENTS'
  | 'INSECTS'
  | 'MOSQUITOES'
  | 'SWEEPING_MISSING'
  | 'MOPPING_MISSING'
  | 'GARBAGE_OVERFLOW'
  | 'SEGREGATION_ISSUE'
  | 'FIRE_EXTINGUISHER'
  | 'SMOKE_DETECTOR'
  | 'SPRINKLER'
  | 'EMERGENCY_LIGHT'
  | 'OTHER';

export type ComplaintStatus =
  | 'CREATED'
  | 'CLASSIFIED'
  | 'PENDING_ASSIGNMENT'
  | 'ASSIGNED'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'WAITING'
  | 'HOLD'
  | 'RESOLVED'
  | 'CONFIRMED'
  | 'CLOSED'
  | 'REOPENED'
  | 'REASSIGNED'
  | 'ESCALATED'
  | 'CANCELLED'
  | 'REJECTED'
  | 'DUPLICATE'
  | 'LINKED_TO_PARENT';

export type ComplaintPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'NORMAL'
  | 'HIGH'
  | 'CRITICAL'
  | 'EMERGENCY';

export type ComplaintVisibility =
  | 'PUBLIC'
  | 'PRIVATE'
  | 'RESTRICTED'
  | 'UNIT_ONLY';

export interface CreateComplaintPayload {
  category: ComplaintCategory;
  subcategory?: ComplaintSubcategory;
  title: string;
  description: string;
  priority: ComplaintPriority;
  location?: string;
  isPrivate?: boolean;
}

export type ComplaintSource =
  | 'RESIDENT_APP'
  | 'GUARD_APP'
  | 'ADMIN_PORTAL'
  | 'EMAIL'
  | 'PHONE'
  | 'WALK_IN'
  | 'SYSTEM';

export type SlaPolicyType =
  | 'FIXED_HOURS'
  | 'BUSINESS_HOURS'
  | 'CALENDAR_BASED'
  | 'CATEGORY_BASED';

export type SlaPausePolicy =
  | 'FULL_PAUSE'
  | 'PARTIAL_PAUSE'
  | 'NO_PAUSE';

export type HoldReason =
  | 'SPARE_PART_REQUIRED'
  | 'VENDOR_REQUIRED'
  | 'RESIDENT_UNAVAILABLE'
  | 'EXTERNAL_DEPENDENCY'
  | 'SOCIETY_APPROVAL_REQUIRED'
  | 'ANOTHER_OPERATIONAL_REASON'
  | 'WEATHER_DELAY'
  | 'SAFETY_CONCERN';

export type EscalationLevel =
  | 'TECHNICIAN'
  | 'SUPERVISOR'
  | 'HELPDESK_ADMIN'
  | 'FACILITY_ADMIN'
  | 'SOCIETY_ADMIN';

export type EscalationReason =
  | 'SLA_BREACH'
  | 'TECHNICIAN_UNAVAILABLE'
  | 'SKILL_MISMATCH'
  | 'WORKLOAD'
  | 'VENDOR_DELAY'
  | 'RESIDENT_COMPLAINT'
  | 'ADMIN_DECISION';

export type ResolutionOutcome =
  | 'FIXED'
  | 'WORKAROUND'
  | 'NO_ACTION_NEEDED'
  | 'ESCALATED_TO_VENDOR'
  | 'PARTIAL_FIX'
  | 'WONT_FIX';

export type ReopenReason =
  | 'ISSUE_PERSISTS'
  | 'NEW_ISSUE_SAME_ROOT'
  | 'INCOMPLETE_FIX'
  | 'RESIDENT_DISSATISFIED'
  | 'EVIDENCE_MISSING'
  | 'OTHER';

export type ConfirmationPolicy =
  | 'AUTO_CLOSE_AFTER_PERIOD'
  | 'REQUIRE_EXPLICIT_CONFIRMATION'
  | 'SUPERVISOR_REVIEW';

export type CancellationReason =
  | 'RESOLVED_SELF'
  | 'WRONG_CATEGORY'
  | 'DUPLICATE'
  | 'NO_LONGER_NEEDED'
  | 'PRIVACY_CONCERN'
  | 'OTHER';

export type EvidenceType =
  | 'PHOTO'
  | 'VIDEO'
  | 'DOCUMENT'
  | 'AUDIO'
  | 'OTHER';

export type CommentVisibility =
  | 'PUBLIC'
  | 'TECHNICIAN_ONLY'
  | 'ADMIN_ONLY'
  | 'RESIDENT_ONLY';

export type AssignmentRule =
  | 'ROUND_ROBIN'
  | 'SKILL_BASED'
  | 'WORKLOAD_BASED'
  | 'LOCATION_BASED'
  | 'CATEGORY_BASED'
  | 'MANUAL';

export interface ComplaintCategoryConfig extends ResidentScopedEntity {
  id: string;
  code: string;
  name: string;
  description?: string;
  subcategories: ComplaintSubcategoryConfig[];
  defaultPriority: ComplaintPriority;
  defaultSlaPolicyId: string;
  defaultAssignmentRule: AssignmentRule;
  escalationPolicyId?: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  version: number;
  previousVersionId?: string;
}

export interface ComplaintSubcategoryConfig extends ResidentScopedEntity {
  id: string;
  categoryId: string;
  code: string;
  name: string;
  description?: string;
  defaultPriority: ComplaintPriority;
  slaPolicyId?: string;
  assignmentRule?: AssignmentRule;
  requiresEvidenceForResolution: boolean;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface SlaPolicy extends ResidentScopedEntity {
  id: string;
  name: string;
  description?: string;
  policyType: SlaPolicyType;
  categoryId?: string;
  priority: ComplaintPriority;
  responseTimeHours: number;
  resolutionTimeHours: number;
  acknowledgementTimeHours: number;
  businessHoursOnly: boolean;
  calendarId?: string;
  warningThresholdPercent: number;
  escalationPolicyId?: string;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  version: number;
  previousVersionId?: string;
}

export interface EscalationPolicy extends ResidentScopedEntity {
  id: string;
  name: string;
  description?: string;
  levels: EscalationLevelConfig[];
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface EscalationLevelConfig {
  level: EscalationLevel;
  triggerAfterHours: number;
  notifyRoles: string[];
  autoReassign: boolean;
  requiresApproval: boolean;
}

export interface Complaint extends ResidentScopedEntity {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory?: ComplaintSubcategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  visibility: ComplaintVisibility;
  source: ComplaintSource;
  unitId: string;
  unitNumber: string;
  tower?: string;
  floor?: number;
  location?: string;
  reportedByUserId: string;
  reportedByDisplayName: string;
  reportedByRole: string;
  isPrivate: boolean;
  isSensitive: boolean;
  slaPolicyId?: string;
  slaPolicyVersion?: number;
  slaResponseDeadline?: string;
  slaResolutionDeadline?: string;
  slaAcknowledgementDeadline?: string;
  slaIsPaused: boolean;
  slaPausePolicy?: SlaPausePolicy;
  slaPausedAt?: string;
  slaPauseReason?: string;
  slaPauseStartedBy?: string;
  escalationPolicyId?: string;
  escalationLevel: EscalationLevel;
  escalatedAt?: string;
  escalatedBy?: string;
  escalationReason?: EscalationReason;
  assignedToUserId?: string;
  assignedToDisplayName?: string;
  assignedAt?: string;
  acknowledgedAt?: string;
  workStartedAt?: string;
  holdReason?: HoldReason;
  holdStartedAt?: string;
  holdExpectedResumeAt?: string;
  holdNotes?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionOutcome?: ResolutionOutcome;
  resolutionSummary?: string;
  resolutionEvidenceIds?: string[];
  confirmationPolicy?: ConfirmationPolicy;
  confirmationRequestedAt?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  closedAt?: string;
  closedBy?: string;
  reopenedAt?: string;
  reopenedBy?: string;
  reopenReason?: ReopenReason;
  reopenSlaPolicy?: 'RESET' | 'CONTINUE' | 'NEW_SLA' | 'NO_SLA';
  cancelledAt?: string;
  cancelledBy?: string;
  cancellationReason?: CancellationReason;
  duplicateOfId?: string;
  parentIncidentId?: string;
  isParentIncident: boolean;
  childComplaintIds: string[];
  correlationConfidence?: number;
  correlationRuleId?: string;
  evidenceIds: string[];
  comments: ComplaintComment[];
  statusHistory: ComplaintStatusHistory[];
  createdAt: string;
  updatedAt: string;
  metadata?: JsonObject;
}

export interface ComplaintComment extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  authorUserId: string;
  authorDisplayName: string;
  authorRole: string;
  content: string;
  visibility: CommentVisibility;
  isSystemGenerated: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ComplaintStatusHistory extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  fromStatus: ComplaintStatus;
  toStatus: ComplaintStatus;
  changedByUserId: string;
  changedByDisplayName: string;
  changedByRole: string;
  reason?: string;
  automated: boolean;
  metadata?: JsonObject;
  createdAt: string;
}

export interface ComplaintEvidence extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  documentId?: string;
  type: EvidenceType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedByUserId: string;
  uploadedByDisplayName: string;
  uploadedAt: string;
  description?: string;
  isResolutionEvidence: boolean;
  metadata?: JsonObject;
}

export interface ComplaintAssignment extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  assignedToUserId: string;
  assignedToDisplayName: string;
  assignedByUserId: string;
  assignedByDisplayName: string;
  assignedAt: string;
  acknowledgedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  ruleUsed?: AssignmentRule;
  metadata?: JsonObject;
}

export interface ComplaintHold extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  reason: HoldReason;
  notes?: string;
  startedByUserId: string;
  startedByDisplayName: string;
  startedAt: string;
  expectedResumeAt?: string;
  resumedAt?: string;
  resumedByUserId?: string;
  resumedByDisplayName?: string;
  dependencyDetails?: JsonObject;
  isActive: boolean;
}

export interface ComplaintEscalation extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  fromLevel: EscalationLevel;
  toLevel: EscalationLevel;
  reason: EscalationReason;
  triggeredBy: 'SYSTEM' | 'USER';
  triggeredByUserId?: string;
  triggeredAt: string;
  previousAssigneeUserId?: string;
  newAssigneeUserId?: string;
  acknowledgedAt?: string;
  acknowledgedByUserId?: string;
  metadata?: JsonObject;
}

export interface ComplaintResolution extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  resolvedByUserId: string;
  resolvedByDisplayName: string;
  resolvedAt: string;
  outcome: ResolutionOutcome;
  summary: string;
  evidenceIds: string[];
  requiresConfirmation: boolean;
  confirmationPolicy: ConfirmationPolicy;
  metadata?: JsonObject;
}

export interface ComplaintReopen extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  reopenedByUserId: string;
  reopenedByDisplayName: string;
  reopenedAt: string;
  reason: ReopenReason;
  description?: string;
  evidenceIds?: string[];
  slaPolicy: 'RESET' | 'CONTINUE' | 'NEW_SLA' | 'NO_SLA';
  previousResolutionId?: string;
  metadata?: JsonObject;
}

export interface ComplaintCancellation extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  cancelledByUserId: string;
  cancelledByDisplayName: string;
  cancelledAt: string;
  reason: CancellationReason;
  description?: string;
  metadata?: JsonObject;
}

export interface ParentIncident extends ResidentScopedEntity {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory?: ComplaintSubcategory;
  priority: ComplaintPriority;
  status: 'DETECTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  detectedAt: string;
  confirmedAt?: string;
  confirmedByUserId?: string;
  resolvedAt?: string;
  resolvedByUserId?: string;
  resolutionSummary?: string;
  rootCause?: string;
  closedAt?: string;
  closedByUserId?: string;
  childComplaintIds: string[];
  affectedUnits: string[];
  affectedTowers: string[];
  affectedFloors?: string[];
  commonLocation?: string;
  assignedToUserId?: string;
  assignedToDisplayName?: string;
  assignedAt?: string;
  slaDeadline?: string;
  correlationRuleId?: string;
  correlationConfidence: number;
  metadata?: JsonObject;
  createdAt: string;
  updatedAt: string;
}

export interface CorrelationRule extends ResidentScopedEntity {
  id: string;
  name: string;
  description?: string;
  category?: ComplaintCategory;
  timeWindowMinutes: number;
  minComplaints: number;
  locationRadiusMeters?: number;
  sameTower: boolean;
  sameFloor: boolean;
  sameCategory: boolean;
  keywords?: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CorrelationCandidate extends ResidentScopedEntity {
  id: string;
  ruleId: string;
  ruleName: string;
  complaintIds: string[];
  confidence: number;
  suggestedParentTitle: string;
  suggestedCategory: ComplaintCategory;
  suggestedPriority: ComplaintPriority;
  detectedAt: string;
  status: 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'MERGED';
  reviewedByUserId?: string;
  reviewedAt?: string;
  parentIncidentId?: string;
}

export interface DuplicateCandidate {
  complaintId: string;
  existingComplaintId: string;
  confidence: number;
  matchReasons: string[];
}

export interface ComplaintSearchFilters {
  societyId: string;
  unitId?: string;
  status?: ComplaintStatus[];
  priority?: ComplaintPriority[];
  category?: ComplaintCategory[];
  assigneeUserId?: string;
  reporterUserId?: string;
  dateFrom?: string;
  dateTo?: string;
  slaStatus?: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  visibility?: ComplaintVisibility[];
  hasParentIncident?: boolean;
  parentIncidentId?: string;
  isSensitive?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'slaDeadline' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface ComplaintListItem {
  id: string;
  ticketNumber: string;
  title: string;
  category: ComplaintCategory;
  subcategory?: ComplaintSubcategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  visibility: ComplaintVisibility;
  unitNumber: string;
  tower?: string;
  reporterName: string;
  assigneeName?: string;
  slaStatus: 'ON_TIME' | 'AT_RISK' | 'BREACHED';
  slaResolutionDeadline?: string;
  escalationLevel: EscalationLevel;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  isSensitive: boolean;
  hasParentIncident: boolean;
  parentIncidentId?: string;
  childComplaintCount: number;
}

export interface ComplaintDashboardMetrics {
  totalOpen: number;
  totalAssigned: number;
  totalInProgress: number;
  totalWaiting: number;
  totalHold: number;
  totalResolved: number;
  totalClosed: number;
  totalReopened: number;
  slaOnTime: number;
  slaAtRisk: number;
  slaBreached: number;
  avgFirstResponseHours: number;
  avgAcknowledgementHours: number;
  avgResolutionHours: number;
  reopenRate: number;
  avgHoldDurationHours: number;
  escalationCount: number;
  byCategory: Record<ComplaintCategory, number>;
  byPriority: Record<ComplaintPriority, number>;
  byStatus: Record<ComplaintStatus, number>;
  byAssignee: Record<string, number>;
}

export interface ComplaintSlaMetrics {
  complaintId: string;
  createdAt: string;
  responseDeadline?: string;
  resolutionDeadline?: string;
  acknowledgementDeadline?: string;
  firstResponseAt?: string;
  acknowledgedAt?: string;
  workStartedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  totalPauseDurationMs: number;
  holdEvents: { reason: HoldReason; startAt: string; endAt?: string; durationMs?: number }[];
  escalationEvents: { level: EscalationLevel; at: string }[];
  isBreached: boolean;
  breachedAt?: string;
  breachType?: 'RESPONSE' | 'RESOLUTION' | 'ACKNOWLEDGEMENT';
  compliancePercent: number;
}

export const COMPLAINT_STATUS_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  CREATED: ['CLASSIFIED', 'CANCELLED', 'REJECTED'],
  CLASSIFIED: ['PENDING_ASSIGNMENT', 'ASSIGNED', 'CANCELLED'],
  PENDING_ASSIGNMENT: ['ASSIGNED', 'CANCELLED'],
  ASSIGNED: ['ACKNOWLEDGED', 'REASSIGNED', 'ESCALATED', 'CANCELLED'],
  ACKNOWLEDGED: ['IN_PROGRESS', 'REASSIGNED', 'ESCALATED'],
  IN_PROGRESS: ['WAITING', 'HOLD', 'RESOLVED', 'ESCALATED', 'REASSIGNED'],
  WAITING: ['IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'HOLD'],
  HOLD: ['IN_PROGRESS', 'RESOLVED', 'ESCALATED', 'WAITING'],
  RESOLVED: ['CONFIRMED', 'REOPENED', 'ESCALATED'],
  CONFIRMED: ['CLOSED', 'REOPENED'],
  CLOSED: ['REOPENED'],
  REOPENED: ['ASSIGNED', 'IN_PROGRESS', 'PENDING_ASSIGNMENT', 'CANCELLED'],
  REASSIGNED: ['ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'CANCELLED'],
  ESCALATED: ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CANCELLED'],
  CANCELLED: ['CREATED'],
  REJECTED: ['CREATED'],
  DUPLICATE: ['CREATED'],
  LINKED_TO_PARENT: ['CREATED'],
};

export const COMPLAINT_STATUS_LABELS: Record<ComplaintStatus, string> = {
  CREATED: 'Created',
  CLASSIFIED: 'Classified',
  PENDING_ASSIGNMENT: 'Pending Assignment',
  ASSIGNED: 'Assigned',
  ACKNOWLEDGED: 'Acknowledged',
  IN_PROGRESS: 'In Progress',
  WAITING: 'Waiting',
  HOLD: 'On Hold',
  RESOLVED: 'Resolved',
  CONFIRMED: 'Confirmed',
  CLOSED: 'Closed',
  REOPENED: 'Reopened',
  REASSIGNED: 'Reassigned',
  ESCALATED: 'Escalated',
  CANCELLED: 'Cancelled',
  REJECTED: 'Rejected',
  DUPLICATE: 'Duplicate',
  LINKED_TO_PARENT: 'Linked to Parent',
};

export const COMPLAINT_PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  NORMAL: 'Normal',
  HIGH: 'High',
  CRITICAL: 'Critical',
  EMERGENCY: 'Emergency',
};

export const COMPLAINT_CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  PLUMBING: 'Plumbing',
  LIFT: 'Lift/Elevator',
  SECURITY: 'Security',
  HOUSEKEEPING: 'Housekeeping',
  PARKING: 'Parking',
  NOISE: 'Noise',
  WATER_LEAKAGE: 'Water Leakage',
  ELECTRICAL: 'Electrical',
  COMMON_AREA: 'Common Area',
  FACILITY: 'Facility',
  PEST_CONTROL: 'Pest Control',
  CLEANING: 'Cleaning',
  WASTE_MANAGEMENT: 'Waste Management',
  FIRE_SAFETY: 'Fire Safety',
  OTHER: 'Other',
};

export const COMPLAINT_SUBCATEGORY_LABELS: Record<ComplaintSubcategory, string> = {
  PIPE_BURST: 'Pipe Burst',
  LEAKAGE: 'Leakage',
  LOW_PRESSURE: 'Low Pressure',
  NO_WATER: 'No Water',
  DRAINAGE_BLOCK: 'Drainage Block',
  LIFT_STUCK: 'Lift Stuck',
  LIFT_NOISY: 'Lift Noisy',
  LIFT_DOOR_ISSUE: 'Lift Door Issue',
  UNAUTHORIZED_ENTRY: 'Unauthorized Entry',
  THEFT: 'Theft',
  SUSPICIOUS_ACTIVITY: 'Suspicious Activity',
  COMMON_AREA_DIRTY: 'Common Area Dirty',
  GARBAGE_NOT_COLLECTED: 'Garbage Not Collected',
  PARKING_OBSTRUCTION: 'Parking Obstruction',
  WRONG_PARKING: 'Wrong Parking',
  LOUD_MUSIC: 'Loud Music',
  CONSTRUCTION_NOISE: 'Construction Noise',
  WALL_DAMPNESS: 'Wall Dampness',
  CEILING_LEAK: 'Ceiling Leak',
  POWER_OUTAGE: 'Power Outage',
  FLICKERING_LIGHTS: 'Flickering Lights',
  MCB_TRIPPING: 'MCB Tripping',
  GENERATOR_ISSUE: 'Generator Issue',
  LOBBY_DIRTY: 'Lobby Dirty',
  CORRIDOR_LIGHTS: 'Corridor Lights',
  GYM_EQUIPMENT: 'Gym Equipment',
  POOL_ISSUE: 'Pool Issue',
  RODENTS: 'Rodents',
  INSECTS: 'Insects',
  MOSQUITOES: 'Mosquitoes',
  SWEEPING_MISSING: 'Sweeping Missing',
  MOPPING_MISSING: 'Mopping Missing',
  GARBAGE_OVERFLOW: 'Garbage Overflow',
  SEGREGATION_ISSUE: 'Segregation Issue',
  FIRE_EXTINGUISHER: 'Fire Extinguisher',
  SMOKE_DETECTOR: 'Smoke Detector',
  SPRINKLER: 'Sprinkler',
  EMERGENCY_LIGHT: 'Emergency Light',
  OTHER: 'Other',
};

export function canTransitionComplaintStatus(from: ComplaintStatus, to: ComplaintStatus): boolean {
  return COMPLAINT_STATUS_TRANSITIONS[from]?.includes(to) ?? false;
}

export function isComplaintStatusFinal(status: ComplaintStatus): boolean {
  return ['CLOSED', 'CANCELLED', 'REJECTED', 'DUPLICATE'].includes(status);
}

export function isComplaintStatusActive(status: ComplaintStatus): boolean {
  return ['CREATED', 'CLASSIFIED', 'PENDING_ASSIGNMENT', 'ASSIGNED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'WAITING', 'HOLD', 'ESCALATED'].includes(status);
}

export function isComplaintStatusResolvable(status: ComplaintStatus): boolean {
  return ['IN_PROGRESS', 'WAITING', 'HOLD'].includes(status);
}

export function getComplaintStatusOrder(status: ComplaintStatus): number {
  const order: Record<ComplaintStatus, number> = {
    CREATED: 1,
    CLASSIFIED: 2,
    PENDING_ASSIGNMENT: 3,
    ASSIGNED: 4,
    ACKNOWLEDGED: 5,
    IN_PROGRESS: 6,
    WAITING: 7,
    HOLD: 8,
    RESOLVED: 9,
    CONFIRMED: 10,
    CLOSED: 11,
    REOPENED: 12,
    REASSIGNED: 13,
    ESCALATED: 14,
    CANCELLED: 15,
    REJECTED: 16,
    DUPLICATE: 17,
    LINKED_TO_PARENT: 18,
  };
  return order[status] ?? 0;
}

export type ComplaintStatusHistoryItem = ComplaintStatusHistory;

export interface ComplaintFeedback extends ResidentScopedEntity {
  id: string;
  complaintId: string;
  submittedByUserId: string;
  rating: number;
  comment?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}