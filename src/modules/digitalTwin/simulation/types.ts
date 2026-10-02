export type SimulationScenarioType =
  | 'ASSET_OUTAGE'
  | 'WATER_SHORTAGE'
  | 'GATE_OUTAGE'
  | 'FACILITY_CLOSURE'
  | 'STAFF_SHORTAGE'
  | 'EV_PEAK_LOAD'
  | 'HIGH_VISITOR_LOAD'
  | 'HIGH_MOVE_IN_LOAD'
  | 'HIGH_COMPLAINT_LOAD'
  | 'COLLECTION_STRESS'
  | 'UTILITY_DEMAND_SPIKE'
  | 'POWER_OUTAGE'
  | 'SOLAR_OUTAGE'
  | 'EV_CHARGER_OUTAGE'
  | 'WATER_QUALITY_ISSUE'
  | 'FIRE_ZONE_CLOSURE'
  | 'COMMUNICATION_OUTAGE'
  | 'CUSTOM';

export type SimulationRunStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'COMPLETED_WITH_WARNINGS'
  | 'FAILED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'ARCHIVED';

export type SimulationEngineStatus =
  | 'IDLE'
  | 'INITIALIZING'
  | 'RUNNING'
  | 'PAUSED'
  | 'COMPLETING'
  | 'FAILED'
  | 'CANCELLED';

export type SimulationScenarioStatus =
  | 'DRAFT'
  | 'VALIDATING'
  | 'VALID'
  | 'INVALID'
  | 'ACTIVE'
  | 'ARCHIVED'
  | 'DEPRECATED';

export type SimulationAssumptionSource =
  | 'CONFIGURED'
  | 'HISTORICAL_BASELINE'
  | 'USER_INPUT'
  | 'MODEL_ESTIMATE'
  | 'EXPERT_OPINION'
  | 'REGULATORY_REQUIREMENT';

export type SimulationOutputType =
  | 'METRICS'
  | 'STATE_TIMELINE'
  | 'CAPACITY_IMPACT'
  | 'AFFECTED_ENTITIES'
  | 'RESOURCE_REQUIREMENTS'
  | 'RISK_FLAGS'
  | 'RECOMMENDATIONS'
  | 'COMPARISON'
  | 'EXPORT';

export type SimulationOutputFormat =
  | 'JSON'
  | 'COMPRESSED_JSON'
  | 'CSV'
  | 'PARQUET'
  | 'PDF_REPORT'
  | 'HTML_REPORT'
  | 'EXCEL';

export interface SimulationScenario {
  scenarioId: string;
  societyId: string;
  scenarioType: SimulationScenarioType;
  name: string;
  description: string;
  version: number;
  status: SimulationScenarioStatus;
  parameters: SimulationParameters;
  assumptions: SimulationAssumption[];
  applicableDomains: string[];
  requiredCapacities: string[];
  validationRules: ValidationRule[];
  tags: string[];
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  validatedAt?: string;
  validatedBy?: string;
  activatedAt?: string;
  activatedBy?: string;
  archivedAt?: string;
  archivedBy?: string;
}

export interface SimulationParameters {
  scenarioSpecific: Record<string, any>;
  durationMinutes: number;
  timeStepMinutes: number;
  startTimeOffsetMinutes: number;
  randomSeed?: number;
  monteCarloRuns?: number;
  confidenceLevel?: number;
}

export interface SimulationAssumption {
  assumptionId: string;
  description: string;
  source: SimulationAssumptionSource;
  value: any;
  confidence: number;
  effectiveFrom: string;
  effectiveTo?: string;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  impactIfWrong: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  validationRule?: string;
}

export interface ValidationRule {
  ruleId: string;
  description: string;
  expression: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  appliesTo: string[];
}

export interface SimulationBaseline {
  baselineId: string;
  societyId: string;
  snapshotId: string;
  projectionVersion: number;
  asOf: string;
  sourceCutoff: string;
  qualityMetrics: BaselineQualityMetrics;
  createdAt: string;
  createdBy: string;
  expiresAt?: string;
  isActive: boolean;
  metadata: Record<string, any>;
}

export interface BaselineQualityMetrics {
  nodeCoverage: number;
  relationshipCoverage: number;
  stateCoverage: number;
  stateFreshnessScore: number;
  stateQualityScore: number;
  conflictRate: number;
  orphanRate: number;
  dataQualityScore: number;
  sourceCoverage: Record<string, number>;
  warnings: BaselineWarning[];
}

export interface BaselineWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedDomain?: string;
  affectedEntityId?: string;
  recommendation?: string;
}

export interface SimulationRun {
  simulationId: string;
  societyId: string;
  scenarioId: string;
  scenarioVersion: number;
  baselineId: string;
  simulationRunId: string;
  status: SimulationRunStatus;
  engineVersion: string;
  parameters: SimulationParameters;
  assumptions: SimulationAssumption[];
  startedBy: string;
  startedAt: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelledReason?: string;
  engineStatus: SimulationEngineStatus;
  progressPercent: number;
  currentStep: string;
  totalSteps: number;
  resultVersion?: string;
  resultSnapshotId?: string;
  resultMetrics: SimulationMetrics;
  outputFormat: SimulationOutputFormat;
  outputData?: SimulationOutputData;
  warnings: SimulationWarning[];
  errors: SimulationError[];
  resultExportId?: string;
  resultExportUrl?: string;
  resultExportExpiresAt?: string;
  durationMs?: number;
  queuePosition?: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  tags: string[];
}

export interface SimulationParameters {
  scenarioSpecific: Record<string, any>;
  durationMinutes: number;
  timeStepMinutes: number;
  startTimeOffsetMinutes: number;
  randomSeed?: number;
  monteCarloRuns?: number;
  confidenceLevel?: number;
  outputFormat: SimulationOutputFormat;
  outputDataTypes: SimulationOutputType[];
}

export interface SimulationAssumption {
  assumptionId: string;
  description: string;
  source: SimulationAssumptionSource;
  value: any;
  confidence: number;
  effectiveFrom: string;
  effectiveTo?: string;
  sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
  impactIfWrong: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  validationRule?: string;
}


export interface SimulationMetrics {
  totalSteps: number;
  completedSteps: number;
  failedSteps: number;
  entitiesAffected: number;
  capacityViolations: number;
  riskFlags: number;
  recommendationsGenerated: number;
  maxCapacityUtilization: number;
  minCapacityAvailable: number;
  peakQueueLength: number;
  avgQueueTimeMinutes: number;
  totalNotificationsProjected: number;
  totalHardwareCommandsProjected: number;
  estimatedCostImpact: number;
  estimatedRevenueImpact: number;
}

export interface SimulationWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedEntityId?: string;
  affectedEntityType?: string;
  stepNumber?: number;
  recommendation?: string;
}

export interface SimulationError {
  errorCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  stepNumber?: number;
  entityId?: string;
  entityType?: string;
  recoverable: boolean;
  retryable: boolean;
  retryCount: number;
  maxRetries: number;
  stackTrace?: string;
}


export interface SimulationOutputData {
  baselineMetrics: Record<string, number>;
  simulatedMetrics: Record<string, number>;
  deltaMetrics: Record<string, number>;
  stateTimeline: SimulationStateEvent[];
  affectedEntities: AffectedEntity[];
  capacityImpact: CapacityImpact[];
  resourceRequirements: ResourceRequirement[];
  riskFlags: RiskFlag[];
  recommendations: SimulationRecommendation[];
  comparisonData?: ComparisonData;
  visualizationData?: VisualizationData;
}

export interface SimulationStateEvent {
  stepNumber: number;
  timestamp: string;
  entityId: string;
  entityType: string;
  previousState: any;
  newState: any;
  triggeredBy: string;
  cause: string;
}

export interface AffectedEntity {
  entityId: string;
  entityType: string;
  entityName: string;
  impactType: 'STATE_CHANGE' | 'CAPACITY' | 'UTILIZATION' | 'AVAILABILITY' | 'PERFORMANCE' | 'COST' | 'REVENUE' | 'RISK';
  impactSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  baselineValue: any;
  simulatedValue: any;
  delta: any;
  impactDescription: string;
  confidence: number;
}

export interface CapacityImpact {
  capacityType: string;
  capacityId: string;
  baselineUtilization: number;
  simulatedUtilization: number;
  deltaUtilization: number;
  thresholdBreached: boolean;
  thresholdValue: number;
  timeToThreshold?: string;
  affectedEntities: string[];
}

export interface ResourceRequirement {
  resourceType: string;
  resourceId: string;
  baselineRequired: number;
  simulatedRequired: number;
  delta: number;
  unit: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  alternatives: string[];
}

export interface RiskFlag {
  riskId: string;
  riskType: 'CAPACITY_BREACH' | 'PERFORMANCE_DEGRADATION' | 'SLA_RISK' | 'COMPLIANCE_RISK' | 'SAFETY_RISK' | 'SECURITY_RISK' | 'FINANCIAL_RISK' | 'OPERATIONAL_RISK';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedEntities: string[];
  probability: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timeToImpact?: string;
  mitigation?: string;
}

export interface SimulationRecommendation {
  recommendationId: string;
  type: 'CAPACITY_INCREASE' | 'STAFFING_CHANGE' | 'SCHEDULE_CHANGE' | 'POLICY_CHANGE' | 'PROCESS_CHANGE' | 'INFRASTRUCTURE_CHANGE' | 'CONFIGURATION_CHANGE' | 'MONITORING_INCREASE' | 'CONTINGENCY_PLAN';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  title: string;
  description: string;
  rationale: string;
  affectedEntities: string[];
  estimatedCost?: number;
  estimatedBenefit?: number;
  implementationEffort: 'LOW' | 'MEDIUM' | 'HIGH';
  timeToImplement: string;
  confidence: number;
  supportingEvidence: string[];
  prerequisites?: string[];
}

export interface ComparisonData {
  baselineLabel: string;
  scenarioALabel: string;
  scenarioBLabel?: string;
  baselineMetrics: Record<string, number>;
  scenarioAMetrics: Record<string, number>;
  scenarioBMetrics?: Record<string, number>;
  deltaA: Record<string, number>;
  deltaB?: Record<string, number>;
  betterScenario?: 'A' | 'B' | 'BASELINE' | 'NEITHER';
  comparisonNotes: string[];
}

export interface VisualizationData {
  timelineData: Array<{
    timestamp: string;
    metrics: Record<string, number>;
    events: SimulationEvent[];
  }>;
  capacityCharts: Array<{
    capacityType: string;
    capacityId: string;
    dataPoints: Array<{
      timestamp: string;
      baseline: number;
      simulated: number;
      threshold?: number;
    }>;
  }>;
  heatmapData?: Array<{
    entityId: string;
    entityType: string;
    metric: string;
    values: Array<{ timestamp: string; value: number }>;
  }>;
  networkDiagram?: {
    nodes: Array<{ id: string; label: string; x: number; y: number; status: string }>;
    edges: Array<{ from: string; to: string; label: string; capacity?: number }>;
  };
}

export interface SimulationEvent {
  stepNumber: number;
  timestamp: string;
  eventType: string;
  entityId: string;
  entityType: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedEntities: string[];
}

export interface SimulationResult {
  simulationRunId: string;
  status: SimulationRunStatus;
  outputData: SimulationOutputData;
  generatedAt: string;
  generatedBy: string;
  engineVersion: string;
  watermark: SimulationWatermark;
}

export interface SimulationWatermark {
  text: string;
  position: 'TOP_LEFT' | 'TOP_RIGHT' | 'BOTTOM_LEFT' | 'BOTTOM_RIGHT' | 'CENTER' | 'DIAGONAL';
  opacity: number;
  color: string;
  fontSize: number;
  fontFamily: string;
}

export interface SimulationComparisonRequest {
  baselineSnapshotId: string;
  scenarioAId: string;
  scenarioAVersion: number;
  scenarioBId?: string;
  scenarioBVersion?: number;
  comparisonMetrics: string[];
}

export interface SimulationComparisonResult {
  comparisonId: string;
  baselineSnapshotId: string;
  scenarioA: SimulationRun;
  scenarioB?: SimulationRun;
  comparison: ComparisonData;
  generatedAt: string;
  generatedBy: string;
}

export interface SimulationExportRequest {
  simulationRunId: string;
  format: SimulationOutputFormat;
  includeWatermark: boolean;
  includeAssumptions: boolean;
  includeParameters: boolean;
  includeMetrics: boolean;
  includeOutputData: boolean;
  includeComparison?: boolean;
  password?: string;
  requestedBy: string;
}

export interface SimulationExportResult {
  exportId: string;
  simulationRunId: string;
  format: string;
  downloadUrl: string;
  expiresAt: string;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: string;
  createdAt: string;
}

export interface SimulationQueueItem {
  queueItemId: string;
  simulationRunId: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  queuedAt: string;
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  status: 'QUEUED' | 'SCHEDULED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  retryCount: number;
  maxRetries: number;
  estimatedDurationMs: number;
  actualDurationMs?: number;
  queuePosition: number;
}

export interface SimulationQueueStats {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  averageWaitTimeMs: number;
  averageDurationMs: number;
  queueDepth: number;
  throughputPerHour: number;
}

export interface SimulationRunComparisonRequest {
  simulationRunIdA: string;
  simulationRunIdB: string;
  comparisonMetrics: string[];
}

export interface SimulationRunComparisonResult {
  comparisonId: string;
  runA: SimulationRun;
  runB: SimulationRun;
  metricComparison: Record<string, { baseline: number; scenarioA: number; scenarioB: number; deltaA: number; deltaB: number }>;
  betterScenario: 'A' | 'B' | 'NEITHER';
  generatedAt: string;
}

export interface SimulationRunExportRequest {
  simulationRunId: string;
  format: 'JSON' | 'COMPRESSED_JSON' | 'CSV' | 'PARQUET' | 'PDF_REPORT' | 'HTML_REPORT' | 'EXCEL';
  includeWatermark: boolean;
  includeAssumptions: boolean;
  includeParameters: boolean;
  includeMetrics: boolean;
  includeOutputData: boolean;
  includeComparison?: boolean;
  password?: string;
  requestedBy: string;
}

export interface SimulationRunExportResult {
  exportId: string;
  simulationRunId: string;
  format: string;
  downloadUrl: string;
  expiresAt: string;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: string;
  createdAt: string;
}

export interface SimulationQueueStatus {
  queued: number;
  running: number;
  completed: number;
  failed: number;
  cancelled: number;
  averageWaitTimeMs: number;
  averageDurationMs: number;
  queueDepth: number;
  throughputPerHour: number;
  oldestQueuedAt?: string;
  longestRunningAt?: string;
}

export interface SimulationCapacityCheck {
  canRun: boolean;
  reason?: string;
  estimatedQueueTimeMs: number;
  estimatedDurationMs: number;
  currentQueueDepth: number;
  maxConcurrentRuns: number;
  availableSlots: number;
}

export interface SimulationValidationResult {
  valid: boolean;
  errors: SimulationValidationError[];
  warnings: SimulationValidationWarning[];
  checkedAt: string;
}

export interface SimulationValidationError {
  errorCode: string;
  message: string;
  field?: string;
  severity: 'ERROR' | 'WARNING';
}

export interface SimulationValidationWarning {
  warningCode: string;
  message: string;
  field?: string;
  recommendation?: string;
}

export interface SimulationDryRunResult {
  dryRunId: string;
  scenarioId: string;
  wouldExecute: boolean;
  estimatedDurationMs: number;
  estimatedSteps: number;
  wouldAffectEntities: string[];
  wouldTriggerActions: string[];
  wouldTriggerNotifications: number;
  wouldTriggerHardwareCommands: number;
  wouldCreateWorkOrders: number;
  wouldSendNotifications: number;
  validationErrors: SimulationValidationError[];
  validationWarnings: SimulationValidationWarning[];
}

export interface SimulationPermissionCheck {
  canRun: boolean;
  canView: boolean;
  canExport: boolean;
  canCancel: boolean;
  canCompare: boolean;
  canExportFinance: boolean;
  canExportSecurity: boolean;
  missingCapabilities: string[];
  missingPermissions: string[];
}