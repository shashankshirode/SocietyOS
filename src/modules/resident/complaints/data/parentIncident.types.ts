import type { JsonObject } from '../../../../core/api/api.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type ComplaintCategory = 'PLUMBING' | 'ELECTRICAL' | 'HVAC' | 'STRUCTURAL' | 'SECURITY' | 'HOUSEKEEPING' | 'PEST_CONTROL' | 'WATER_SUPPLY' | 'POWER_BACKUP' | 'LIFT' | 'FIRE_SAFETY' | 'WASTE_MANAGEMENT' | 'NOISE' | 'PARKING' | 'OTHER';
export type ComplaintStatus = 'CREATED' | 'CLASSIFIED' | 'ASSIGNED' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'WAITING' | 'HOLD' | 'RESOLVED' | 'REOPENED' | 'CLOSED';
export type ComplaintPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL' | 'EMERGENCY';
export type Complaint = {
    id: string;
    correlationId: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    subCategory?: string;
    priority: ComplaintPriority;
    status: ComplaintStatus;
    slaDeadline?: string;
    reportedBy: string;
    reportedAt: string;
    unitId: string;
    tower: string;
    floor: number;
    location?: string;
    mediaUrls: string[];
    assignedTo?: string;
    assignedAt?: string;
    acknowledgedAt?: string;
    resolvedAt?: string;
    closedAt?: string;
    resolutionSummary?: string;
    resolutionMediaUrls: string[];
    parentIncidentId?: string;
    isParentIncident: boolean;
    childComplaintIds: string[];
    tags: string[];
    metadata: JsonObject;
    createdAt: string;
    updatedAt: string;
};
export type ParentIncident = {
    id: string;
    title: string;
    description: string;
    category: ComplaintCategory;
    priority: ComplaintPriority;
    status: 'DETECTED' | 'CONFIRMED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    detectedAt: string;
    confirmedAt?: string | Absent;
    resolvedAt?: string | Absent;
    closedAt?: string | Absent;
    childComplaintIds: string[];
    affectedUnits: string[];
    affectedTowers: string[];
    affectedFloors?: string[] | Absent;
    commonLocation?: string | Absent;
    rootCause?: string | Absent;
    resolutionSummary?: string | Absent;
    assignedTo?: string | Absent;
    assignedAt?: string | Absent;
    slaDeadline?: string | Absent;
    correlationRuleId?: string | Absent;
    correlationConfidence: number;
    metadata: JsonObject;
    createdAt: string;
    updatedAt: string;
};
export type CorrelationRule = {
    id: string;
    name: string;
    description: string;
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
};
export type CorrelationCandidate = {
    id: string;
    ruleId: string;
    ruleName: string;
    complaints: Complaint[];
    confidence: number;
    suggestedParentTitle: string;
    suggestedCategory: ComplaintCategory;
    suggestedPriority: ComplaintPriority;
    detectedAt: string;
    status: 'PENDING_REVIEW' | 'CONFIRMED' | 'REJECTED' | 'MERGED';
    reviewedBy?: string;
    reviewedAt?: string;
    parentIncidentId?: string;
};
export type CorrelationResult = {
    parentIncidentId: string;
    linkedComplaintIds: string[];
    confidence: number;
    ruleId: string;
};
export const DEFAULT_CORRELATION_RULES: CorrelationRule[] = [
    {
        id: 'rule-water-pressure',
        name: 'Low Water Pressure Cluster',
        description: 'Multiple low water pressure complaints in same tower within 30 minutes',
        category: 'WATER_SUPPLY',
        timeWindowMinutes: 30,
        minComplaints: 3,
        sameTower: true,
        sameFloor: false,
        sameCategory: true,
        keywords: ['water pressure', 'low pressure', 'no water'],
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'rule-power-outage',
        name: 'Power Outage Cluster',
        description: 'Multiple power outage complaints in same area',
        category: 'ELECTRICAL',
        timeWindowMinutes: 15,
        minComplaints: 2,
        sameTower: true,
        sameFloor: false,
        sameCategory: true,
        keywords: ['power outage', 'no electricity', 'power cut'],
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'rule-lift-stuck',
        name: 'Lift Stuck Cluster',
        description: 'Multiple lift stuck complaints for same lift',
        category: 'LIFT',
        timeWindowMinutes: 60,
        minComplaints: 2,
        sameTower: true,
        sameFloor: false,
        sameCategory: true,
        keywords: ['lift stuck', 'elevator stuck', 'lift not working'],
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: 'rule-security',
        name: 'Security Incident Cluster',
        description: 'Multiple security complaints in nearby units',
        category: 'SECURITY',
        timeWindowMinutes: 60,
        minComplaints: 2,
        locationRadiusMeters: 50,
        sameTower: false,
        sameFloor: false,
        sameCategory: true,
        keywords: ['theft', 'break in', 'suspicious', 'unauthorized entry'],
        enabled: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
];
export const COMPLAINT_STATUS_ORDER: Record<ComplaintStatus, number> = {
    CREATED: 1,
    CLASSIFIED: 2,
    ASSIGNED: 3,
    ACKNOWLEDGED: 4,
    IN_PROGRESS: 5,
    WAITING: 6,
    HOLD: 7,
    RESOLVED: 8,
    REOPENED: 9,
    CLOSED: 10,
};

