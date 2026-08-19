import type { Absent } from "./absence.types";
export type EmergencyBroadcastType = 'FIRE_ALERT' | 'LIFT_OUTAGE' | 'SECURITY_ALERT' | 'WATER_EMERGENCY' | 'WEATHER_ALERT' | 'EVACUATION_NOTICE' | 'DRILL_NOTICE' | 'OTHER';
export type EmergencyBroadcastStatus = 'DRAFT' | 'SENT' | 'CANCELLED' | 'FAILED' | 'EXPIRED';
export type SafetyInstructionCategory = 'MEDICAL' | 'FIRE' | 'LIFT' | 'EARTHQUAKE' | 'SECURITY' | 'SENIOR_HELP' | 'CHILD_SAFETY' | 'PET_EMERGENCY' | 'OTHER';
export type SafetyDrillType = 'FIRE_DRILL' | 'EVACUATION_DRILL' | 'LIFT_RESCUE_DRILL' | 'MEDICAL_RESPONSE_DRILL' | 'SECURITY_DRILL';
export type SafetyDrillStatus = 'PLANNED' | 'COMPLETED' | 'MISSED' | 'CANCELLED' | 'REVIEW_PENDING';
export type PostIncidentReviewStatus = 'PENDING' | 'IN_PROGRESS' | 'ACTION_REQUIRED' | 'COMPLETED' | 'CLOSED';
export interface EmergencyBroadcast {
    id: string;
    broadcastType: EmergencyBroadcastType;
    senderName: string;
    senderRole: string;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    targetAudience: string;
    affectedArea?: string;
    status: EmergencyBroadcastStatus;
    sentAt: string;
}
export interface SafetyInstruction {
    id: string;
    category: SafetyInstructionCategory;
    title: string;
    steps: string[];
    emergencyNumbers: {
        label: string;
        number: string;
    }[];
    audience: string;
    lastUpdatedAt: string;
}
export interface SafetyDrillRecord {
    id: string;
    drillType: SafetyDrillType;
    drillName: string;
    scheduledDate: string;
    targetArea: string;
    participantsCount: number;
    status: SafetyDrillStatus;
    observations?: string;
    improvementActions?: string;
    completedAt?: string;
}
export interface PostIncidentReview {
    id: string;
    incidentId: string;
    incidentNumber: string;
    emergencyType: string;
    reviewOwnerName: string;
    whatHappened: string;
    responseTimeMinutes: number;
    whatWorkedWell: string;
    whatFailed: string;
    followUpActions: string;
    responsiblePerson: string;
    dueDate?: string;
    status: PostIncidentReviewStatus;
    createdAt: string;
}
export interface EmergencyAuditLog {
    id: string;
    timestamp: string;
    actorId: string;
    actorName: string;
    actorRole: string;
    eventType: string;
    entityReference: string;
    correlationId: string;
    metadata: Record<string, string | number | boolean | Absent>;
}
export interface CreateBroadcastInput {
    broadcastType: EmergencyBroadcastType;
    message: string;
    severity: 'INFO' | 'WARNING' | 'CRITICAL';
    targetAudience: string;
    affectedArea?: string;
}
export interface CreateSafetyDrillInput {
    drillType: SafetyDrillType;
    drillName: string;
    scheduledDate: string;
    targetArea: string;
}
export interface CreatePostIncidentReviewInput {
    incidentId: string;
    whatHappened: string;
    responseTimeMinutes: number;
    whatWorkedWell: string;
    whatFailed: string;
    followUpActions: string;
    responsiblePerson: string;
    dueDate?: string;
}

