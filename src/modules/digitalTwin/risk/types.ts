export type RiskType =
  | 'MAINTENANCE_RISK'
  | 'OPERATIONAL_RISK'
  | 'FINANCIAL_RISK'
  | 'COMPLIANCE_RISK'
  | 'SAFETY_RISK'
  | 'SECURITY_RISK'
  | 'CAPACITY_RISK'
  | 'PERFORMANCE_RISK'
  | 'ASSET_FAILURE_RISK'
  | 'VENDOR_RISK'
  | 'VENDOR_DEPENDENCY_RISK'
  | 'REGULATORY_RISK'
  | 'REPUTATIONAL_RISK'
  | 'ENVIRONMENTAL_RISK'
  | 'CYBER_RISK'
  | 'BUSINESS_CONTINUITY_RISK';

export type RiskLevel =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
  | 'ELEVATED'
  | 'MODERATE'
  | 'NEGLIGIBLE';

export type RiskStatus =
  | 'IDENTIFIED'
  | 'ASSESSED'
  | 'MONITORING'
  | 'MITIGATING'
  | 'MITIGATED'
  | 'ACCEPTED'
  | 'TRANSFERRED'
  | 'AVOIDED'
  | 'ESCALATED'
  | 'CLOSED'
  | 'REOPENED';

export type RiskCategory =
  | 'ASSET'
  | 'FACILITY'
  | 'UTILITY'
  | 'SECURITY'
  | 'FINANCIAL'
  | 'OPERATIONAL'
  | 'COMPLIANCE'
  | 'SAFETY'
  | 'ENVIRONMENTAL'
  | 'VENDOR'
  | 'STAFF'
  | 'TECHNOLOGY'
  | 'PROJECT'
  | 'STRATEGIC';

export type RiskSource =
  | 'PREDICTIVE_MODEL'
  | 'MANUAL_ASSESSMENT'
  | 'AUTOMATED_MONITORING'
  | 'INCIDENT'
  | 'AUDIT'
  | 'AUDIT_FINDING'
  | 'COMPLIANCE_CHECK'
  | 'VENDOR_ASSESSMENT'
  | 'INSPECTION'
  | 'SENSOR_DATA'
  | 'EXPERT_ASSESSMENT'
  | 'HISTORICAL_ANALYSIS'
  | 'SIMULATION'
  | 'FORECAST'
  | 'RESIDENT_REPORT'
  | 'STAFF_REPORT'
  | 'VENDOR_REPORT'
  | 'AUDIT_FINDING'
  | 'INSPECTION_REPORT'
  | 'REGULATORY_NOTICE'
  | 'INSURANCE_CLAIM';

export type RiskLikelihood =
  | 'RARE'
  | 'UNLIKELY'
  | 'POSSIBLE'
  | 'LIKELY'
  | 'ALMOST_CERTAIN'
  | 'CERTAIN';

export type RiskImpact =
  | 'INSIGNIFICANT'
  | 'MINOR'
  | 'MODERATE'
  | 'MAJOR'
  | 'SEVERE'
  | 'CATASTROPHIC'
  | 'NEGLIGIBLE'
  | 'MINOR'
  | 'SIGNIFICANT'
  | 'SEVERE'
  | 'CRITICAL';

export type RiskVelocity =
  | 'VERY_SLOW'
  | 'SLOW'
  | 'MODERATE'
  | 'FAST'
  | 'RAPID'
  | 'IMMEDIATE';

export type RiskTimeHorizon =
  | 'IMMEDIATE'
  | 'SHORT_TERM'
  | 'MEDIUM_TERM'
  | 'LONG_TERM'
  | 'STRATEGIC';

export interface Risk {
  riskId: string;
  societyId: string;
  riskType: RiskType;
  riskCategory: RiskCategory;
  title: string;
  description: string;
  riskLevel: RiskLevel;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  velocity: RiskVelocity;
  timeHorizon: RiskTimeHorizon;
  riskScore: number;
  status: RiskStatus;
  source: RiskSource;
  sourceReference?: string;
  sourceConfidence: number;
  identifiedAt: string;
  identifiedBy: string;
  identifiedByType: 'SYSTEM' | 'USER' | 'AUTOMATED' | 'MANUAL' | 'AI' | 'ML_MODEL' | 'RULE_ENGINE' | 'EXTERNAL';
  ownerId: string;
  ownerRole: string;
  riskOwnerId?: string;
  riskOwnerRole?: string;
  assessedAt?: string;
  assessedBy?: string;
  assessedByRole?: string;
  riskScoreHistory: Array<{
    score: number;
    assessedAt: string;
    assessedBy: string;
    reason?: string;
  }>;
  likelihoodJustification: string;
  impactJustification: string;
  velocityJustification: string;
  timeHorizonJustification: string;
  inherentRiskScore: number;
  residualRiskScore: number;
  targetRiskScore: number;
  mitigationPlan?: RiskMitigationPlan;
  mitigationActions: RiskMitigationAction[];
  mitigationEffectiveness?: number;
  residualRiskAfterMitigation?: number;
  targetDate?: string;
  reviewDate?: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
  nextReviewDate?: string;
  escalationLevel: number;
  escalationPath: string[];
  escalationTriggered: boolean;
  escalationTriggeredAt?: string;
  escalationTriggeredBy?: string;
  relatedRisks: string[];
  dependentRisks: string[];
  mitigatingRisks: string[];
  tags: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  version: number;
}

export interface RiskMitigationPlan {
  planId: string;
  riskId: string;
  objective: string;
  strategy: 'AVOID' | 'REDUCE' | 'TRANSFER' | 'ACCEPT' | 'EXPLOIT' | 'ENHANCE' | 'SHARE';
  targetResidualRisk: number;
  targetDate: string;
  budget?: number;
  budgetCurrency: string;
  resourcesRequired: string[];
  responsibleRoles: string[];
  responsiblePersons: string[];
  milestones: RiskMilestone[];
  dependencies: string[];
  assumptions: string[];
  constraints: string[];
  reviewFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ON_DEMAND';
  reviewCadence: string;
  contingencyPlan?: string;
  contingencyBudget?: number;
  contingencyBudgetCurrency: string;
  successCriteria: string[];
  keyPerformanceIndicators: string[];
  monitoringPlan: string;
  communicationPlan: string;
  escalationCriteria: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'APPROVED' | 'ACTIVE' | 'ON_HOLD' | 'COMPLETED' | 'CANCELLED' | 'SUPERSEDED';
}

export interface RiskMilestone {
  milestoneId: string;
  description: string;
  targetDate: string;
  responsibleParty: string;
  successCriteria: string[];
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'BLOCKED' | 'CANCELLED';
  completedAt?: string;
  evidence?: string;
}

export interface RiskMitigationAction {
  actionId: string;
  riskId: string;
  planId?: string;
  description: string;
  actionType: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'DIRECTIVE' | 'CONTINGENCY' | 'RECOVERY';
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED' | 'ON_HOLD' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' | 'CRITICAL';
  assignedTo: string;
  assignedRole: string;
  assignedTeam?: string;
  startDate: string;
  dueDate: string;
  completedAt?: string;
  estimatedEffortHours: number;
  actualEffortHours?: number;
  costEstimate: number;
  costCurrency: string;
  actualCost?: number;
  actualCostCurrency?: string;
  progressPercent: number;
  statusReason?: string;
  dependencies: string[];
  blockers: string[];
  evidence: string[];
  outcome?: string;
  effectiveness?: number;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface RiskAssessment {
  assessmentId: string;
  riskId: string;
  assessedAt: string;
  assessedBy: string;
  assessedByRole: string;
  likelihood: RiskLikelihood;
  impact: RiskImpact;
  velocity: RiskVelocity;
  timeHorizon: RiskTimeHorizon;
  riskScore: number;
  confidence: number;
  methodology: string;
  dataSources: string[];
  assumptions: string[];
  limitations: string[];
  evidence: string[];
  previousAssessmentId?: string;
  riskScoreChange?: number;
  likelihoodChange?: string;
  impactChange?: string;
  velocityChange?: string;
  timeHorizonChange?: string;
  notes?: string;
}

export interface RiskHeatmap {
  societyId: string;
  generatedAt: string;
  generatedBy: string;
  timeHorizon: RiskTimeHorizon;
  matrix: Array<Array<{
    likelihood: RiskLikelihood;
    impact: RiskImpact;
    count: number;
    riskIds: string[];
  }>>;
  summary: {
    totalRisks: number;
    criticalRisks: number;
    highRisks: number;
    mediumRisks: number;
    lowRisks: number;
    riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    topRisks: Array<{ riskId: string; title: string; riskLevel: RiskLevel; riskScore: number }>;
  };
  byCategory: Record<RiskCategory, { count: number; averageScore: number }>;
  bySource: Record<string, number>;
}

export interface RiskRegister {
  registerId: string;
  societyId: string;
  name: string;
  description: string;
  risks: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
  version: number;
  status: 'ACTIVE' | 'ARCHIVED' | 'DRAFT';
  scope: 'SOCIETY' | 'TOWER' | 'WING' | 'FLOOR' | 'UNIT' | 'FACILITY' | 'ASSET_GROUP';
  scopeEntityId?: string;
  scopeEntityType?: string;
  filters: {
    riskTypes?: string[];
    riskLevels?: RiskLevel[];
    riskCategories?: RiskCategory[];
    riskStatuses?: RiskStatus[];
    minRiskScore?: number;
    maxRiskScore?: number;
    dateRange?: { from: string; to: string };
  };
  sortBy: 'riskScore' | 'likelihood' | 'impact' | 'createdAt' | 'updatedAt' | 'reviewDate';
  sortOrder: 'ASC' | 'DESC';
}

export interface RiskDashboard {
  societyId: string;
  asOf: string;
  summary: {
    totalRisks: number;
    byLevel: Record<RiskLevel, number>;
    byCategory: Record<RiskCategory, number>;
    byStatus: Record<RiskStatus, number>;
    bySource: Record<string, number>;
    averageRiskScore: number;
    riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
    newRisksThisPeriod: number;
    closedRisksThisPeriod: number;
    escalatedRisks: number;
    overdueReviews: number;
  };
  topRisks: Array<{
    riskId: string;
    title: string;
    riskLevel: RiskLevel;
    riskScore: number;
    riskCategory: RiskCategory;
    nextReviewDate?: string;
    escalationLevel: number;
  }>;
  escalatedRisks: Array<{
    riskId: string;
    title: string;
    escalationLevel: number;
    escalatedAt: string;
    escalatedBy: string;
    escalationPath: string[];
  }>;
  upcomingReviews: Array<{
    riskId: string;
    title: string;
    reviewDate: string;
    ownerId: string;
  }>;
  newRisks: Array<{
    riskId: string;
    title: string;
    riskLevel: RiskLevel;
    identifiedAt: string;
    identifiedBy: string;
  }>;
  riskTrends: Array<{
    period: string;
    totalRisks: number;
    averageRiskScore: number;
    newRisks: number;
    closedRisks: number;
  }>;
  heatmap: RiskHeatmap;
}

export interface RiskAppetite {
  societyId: string;
  definedAt: string;
  definedBy: string;
  approvedBy: string;
  approvedAt: string;
  effectiveFrom: string;
  effectiveTo?: string;
  thresholds: {
    maxAcceptableRiskScore: number;
    maxCriticalRisks: number;
    maxHighRisks: number;
    maxMediumRisks: number;
    maxRiskScoreByCategory: Record<RiskCategory, number>;
    maxLikelihoodForCriticalImpact: RiskLikelihood;
    maxImpactForAlmostCertainLikelihood: RiskImpact;
  };
  exceptions: Array<{
    exceptionId: string;
    riskType: RiskType;
    reason: string;
    approvedBy: string;
    approvedAt: string;
    expiresAt?: string;
    conditions: string[];
  }>;
  reviewFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';
  nextReviewDate: string;
  version: number;
}

export interface RiskReport {
  reportId: string;
  societyId: string;
  reportType: 'SUMMARY' | 'DETAILED' | 'EXECUTIVE' | 'BOARD' | 'REGULATORY' | 'AUDIT' | 'COMPLIANCE' | 'OPERATIONAL' | 'DEPARTMENTAL' | 'PROJECT' | 'INCIDENT' | 'PERIODIC';
  period: { from: string; to: string };
  generatedAt: string;
  generatedBy: string;
  generatedFor: string[];
  executiveSummary: string;
  keyFindings: string[];
  riskSummary: RiskDashboard['summary'];
  topRisks: Array<{ riskId: string; title: string; riskLevel: RiskLevel; riskScore: number; trend: 'INCREASING' | 'STABLE' | 'DECREASING' }>;
  criticalRisks: Array<{ riskId: string; title: string; riskScore: number; mitigationStatus: string; ownerId: string; nextReviewDate?: string }>;
  emergingRisks: Array<{ riskId: string; title: string; riskLevel: RiskLevel; riskScore: number; identifiedAt: string }>;
  mitigatedRisks: Array<{ riskId: string; title: string; mitigationEffectiveness: number; residualRisk: number }>;
  riskTrends: Array<{ period: string; totalRisks: number; avgRiskScore: number; newRisks: number; closedRisks: number }>;
  recommendations: string[];
  appendices?: Record<string, any>;
  format: 'PDF' | 'HTML' | 'EXCEL' | 'POWERPOINT' | 'JSON';
  formatVersion: string;
  classification: 'CONFIDENTIAL' | 'INTERNAL' | 'PUBLIC' | 'RESTRICTED';
  watermark?: string;
}

export interface RiskAlert {
  alertId: string;
  riskId: string;
  alertType: 'THRESHOLD_BREACH' | 'ESCALATION' | 'REVIEW_DUE' | 'MITIGATION_DUE' | 'MITIGATION_OVERDUE' | 'ESCALATION_TRIGGERED' | 'NEW_RELATED_RISK' | 'RISK_REOPENED' | 'RISK_ESCALATED' | 'RISK_CLOSED' | 'RISK_REOPENED' | 'MITIGATION_EFFECTIVE' | 'MITIGATION_INEFFECTIVE' | 'TARGET_DATE_APPROACHING' | 'REVIEW_OVERDUE' | 'ESCALATION_OVERDUE' | 'RISK_SCORE_INCREASE' | 'RISK_SCORE_DECREASE' | 'NEW_RELATED_RISK_IDENTIFIED' | 'MITIGATION_ACTION_DUE' | 'MITIGATION_ACTION_OVERDUE' | 'MITIGATION_ACTION_COMPLETED' | 'MITIGATION_ACTION_CANCELLED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'URGENT' | 'EMERGENCY';
  message: string;
  details: Record<string, any>;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  dismissedAt?: string;
  dismissedBy?: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED' | 'ESCALATED' | 'DISMISSED' | 'SNOOZED';
  snoozedUntil?: string;
  escalatedAt?: string;
  escalatedBy?: string;
  escalationPath?: string[];
  notificationChannels: string[];
  acknowledgedByRoles: string[];
  requiredAcknowledgements: number;
  receivedAcknowledgements: number;
}