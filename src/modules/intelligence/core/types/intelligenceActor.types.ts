export type IntelligenceActorRole =
  | 'RESIDENT'
  | 'OWNER'
  | 'TENANT'
  | 'FAMILY_MEMBER'
  | 'SOCIETY_ADMIN'
  | 'FACILITY_MANAGER'
  | 'TREASURER'
  | 'SECURITY_GUARD'
  | 'SECURITY_SUPERVISOR'
  | 'COMMITTEE_MEMBER'
  | 'PLATFORM_SUPPORT';

export type IntelligenceActorContext = {
  actorId: string;
  societyId: string;
  residenceId?: string;
  unitId?: string;
  householdId?: string;
  role: IntelligenceActorRole;
  capabilities: IntelligenceCapability[];
  societyName: string;
  locale: string;
  timezone: string;
  featureFlags: Record<string, boolean>;
  effectiveAt: string;
};

export type IntelligenceCapability =
  | 'ASSISTANT_QUERY'
  | 'ASSISTANT_ACTION'
  | 'KNOWLEDGE_SEARCH'
  | 'KNOWLEDGE_READ'
  | 'INSIGHT_VIEW'
  | 'INSIGHT_DISMISS'
  | 'INSIGHT_FEEDBACK'
  | 'ADMIN_BRIEF'
  | 'ADMIN_ACTION'
  | 'PREDICTIVE_MAINTENANCE_VIEW'
  | 'PREDICTIVE_MAINTENANCE_ACTION'
  | 'KNOWLEDGE_INDEX'
  | 'KNOWLEDGE_ADMIN'
  | 'CONVERSATION_HISTORY'
  | 'CONVERSATION_FEEDBACK'
  | 'INSIGHT_CONFIGURE';

export type IntelligenceSocietyContext = {
  societyId: string;
  societyName: string;
  timezone: string;
  locale: string;
  activeFeatures: string[];
  intelligenceConfig: IntelligenceSocietyConfig;
};

export type IntelligenceSocietyConfig = {
  aiAssistanceEnabled: boolean;
  knowledgeSearchEnabled: boolean;
  predictiveMaintenanceEnabled: boolean;
  adminCopilotEnabled: boolean;
  residentAssistantEnabled: boolean;
  contextualInsightsEnabled: boolean;
  maxConversationHistoryDays: number;
  maxContextTokens: number;
  aiProvider: 'openai' | 'anthropic' | 'local' | 'none';
  aiModel: string;
  confidenceThreshold: number;
  maxContextTokens: number;
  retentionDays: {
    conversations: number;
    insights: number;
    predictions: number;
    feedback: number;
  };
};

export type IntelligenceUnitContext = {
  unitId: string;
  unitNumber: string;
  towerId?: string;
  towerName?: string;
  floor?: number;
  unitType: 'APARTMENT' | 'VILLA' | 'COMMERCIAL' | 'PARKING' | 'STORAGE';
  occupancyStatus: 'OWNER_OCCUPIED' | 'TENANT_OCCUPIED' | 'VACANT' | 'UNDER_MAINTENANCE';
  currentOccupants: string[];
  ownerId?: string;
  tenantId?: string;
};

export type IntelligenceResidenceContext = {
  societyId: string;
  societyName: string;
  unitId: string;
  unitNumber: string;
  towerId?: string;
  towerName?: string;
  householdId: string;
  householdMembers: string[];
  role: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER' | 'DOMESTIC_HELP';
  permissions: IntelligenceCapability[];
  effectiveFrom: string;
  effectiveTo?: string;
};