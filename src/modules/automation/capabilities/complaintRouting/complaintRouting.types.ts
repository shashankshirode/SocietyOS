export type ComplaintClassificationRequest = {
  complaintId: string;
  title: string;
  description: string;
  mediaUrls?: string[];
  category?: string;
  priority?: string;
  societyId: string;
};

export type ComplaintClassificationResult = {
  requestId: string;
  complaintId: string;
  primaryClassification: {
    category: string;
    confidence: number;
    reasoning: string;
    suggestedPriority: string;
    suggestedSlaHours: number;
    tags: string[];
  };
  alternativeClassifications: Array<{
    category: string;
    confidence: number;
    reasoning: string;
    suggestedPriority: string;
    suggestedSlaHours: number;
    tags: string[];
  }>;
  modelVersion: string;
  templateVersion: number;
  source: 'AI_PROVIDER' | 'RULE_FALLBACK';
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  warnings: string[];
  evidenceReferences: Array<{
    type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE';
    entityId: string;
    entityType: string;
    asOf: string;
  }>;
  requiresReview: boolean;
  processingTimeMs: number;
  completedAt: string;
};

export type ComplaintRoutingRule = {
  category: string;
  defaultAssigneeRole: string;
  defaultAssigneeId?: string;
  escalationRole: string;
  slaHours: number;
  autoAssign: boolean;
};

export const COMPLAINT_ROUTING_RULES: Record<string, ComplaintRoutingRule> = {
  PLUMBING: { category: 'PLUMBING', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 4, autoAssign: true },
  ELECTRICAL: { category: 'ELECTRICAL', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 4, autoAssign: true },
  HVAC: { category: 'HVAC', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
  STRUCTURAL: { category: 'STRUCTURAL', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 2, autoAssign: false },
  SECURITY: { category: 'SECURITY', defaultAssigneeRole: 'SECURITY_GUARD', escalationRole: 'SUPER_ADMIN', slaHours: 1, autoAssign: false },
  HOUSEKEEPING: { category: 'HOUSEKEEPING', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
  PEST_CONTROL: { category: 'PEST_CONTROL', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 48, autoAssign: true },
  WATER_SUPPLY: { category: 'WATER_SUPPLY', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 2, autoAssign: false },
  POWER_BACKUP: { category: 'POWER_BACKUP', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 4, autoAssign: true },
  LIFT: { category: 'LIFT', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 2, autoAssign: false },
  FIRE_SAFETY: { category: 'FIRE_SAFETY', defaultAssigneeRole: 'SECURITY_GUARD', escalationRole: 'SUPER_ADMIN', slaHours: 1, autoAssign: false },
  WASTE_MANAGEMENT: { category: 'WASTE_MANAGEMENT', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
  NOISE: { category: 'NOISE', defaultAssigneeRole: 'SECURITY_GUARD', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
  PARKING: { category: 'PARKING', defaultAssigneeRole: 'SECURITY_GUARD', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
  OTHER: { category: 'OTHER', defaultAssigneeRole: 'FACILITY_MANAGER', escalationRole: 'SUPER_ADMIN', slaHours: 24, autoAssign: true },
};

export const SAFETY_CATEGORIES = ['FIRE_SAFETY', 'SECURITY', 'STRUCTURAL', 'LIFT', 'WATER_SUPPLY'];

export function isSafetyCategory(category: string): boolean {
  return SAFETY_CATEGORIES.includes(category);
}

export function getMinPriorityForCategory(category: string): string {
  const minPriority: Record<string, string> = {
    FIRE_SAFETY: 'EMERGENCY',
    SECURITY: 'EMERGENCY',
    STRUCTURAL: 'CRITICAL',
    LIFT: 'HIGH',
    WATER_SUPPLY: 'CRITICAL',
  };
  return minPriority[category] || 'NORMAL';
}