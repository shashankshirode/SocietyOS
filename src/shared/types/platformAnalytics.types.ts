

export interface UsageAnalyticsMetrics {
  activeSocieties: number;
  monthlyActiveUsers: number;
  dailyActiveUsersPlaceholder: number;
  visitorPassesCreated: number;
  complaintsCreated: number;
  billsGenerated: number;
  paymentsRecorded: number;
  facilityBookings: number;
  documentsViewed: number;
  guardEntries: number;
  emergencyAlerts: number;
  marketplaceListings: number;
  knowledgeBaseArticleViews: number;
}

export interface ModuleAdoptionRow {
  moduleName: string;
  moduleKey: string;
  enabledSocieties: number;
  activeSocieties: number;
  usageCount: number;
  adoptionPercentage: number;
  trendPlaceholder: 'UP' | 'DOWN' | 'STABLE';
  lowAdoptionReasonPlaceholder?: string;
  recommendedActionPlaceholder?: string;
}

export type SocietyHealthRiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL';

export interface SocietyHealthDimension {
  dimension: string;
  score: number;
  maxScore: number;
}

export interface SocietyHealthRow {
  societyId: string;
  societyName: string;
  city: string;
  overallHealthScore: number;
  riskLevel: SocietyHealthRiskLevel;
  weakestDimension: string;
  recommendedAction: string;
  lastUpdated: string;
  dimensions: SocietyHealthDimension[];
}
