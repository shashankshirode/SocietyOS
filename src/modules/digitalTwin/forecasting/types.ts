export type ForecastType =
  | 'COLLECTION_FORECAST'
  | 'COMPLAINT_VOLUME_FORECAST'
  | 'FACILITY_UTILIZATION_FORECAST'
  | 'WATER_DEMAND_FORECAST'
  | 'ELECTRICITY_DEMAND_FORECAST'
  | 'EV_LOAD_FORECAST'
  | 'ASSET_MAINTENANCE_RISK_FORECAST'
  | 'STAFF_COVERAGE_FORECAST'
  | 'GATE_LOAD_FORECAST'
  | 'WATER_DEMAND'
  | 'ELECTRICITY_DEMAND'
  | 'EV_LOAD'
  | 'COLLECTIONS'
  | 'COMPLAINT_VOLUME'
  | 'FACILITY_UTILIZATION'
  | 'STAFF_COVERAGE'
  | 'GATE_LOAD'
  | 'WATER_SUPPLY'
  | 'SOLAR_GENERATION'
  | 'ASSET_MAINTENANCE_RISK';

export type ForecastHorizon =
  | 'HOUR'
  | 'DAY'
  | 'WEEK'
  | 'MONTH'
  | 'QUARTER'
  | 'YEAR'
  | 'CUSTOM';

export type ForecastGranularity =
  | 'MINUTE'
  | 'HOUR'
  | 'DAY'
  | 'WEEK'
  | 'MONTH'
  | 'QUARTER'
  | 'YEAR';

export type ForecastRunStatus =
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

export type ForecastModelStatus =
  | 'EXPERIMENTAL'
  | 'VALIDATING'
  | 'ACTIVE'
  | 'DEGRADED'
  | 'SUSPENDED'
  | 'RETIRED'
  | 'ARCHIVED';

export type ForecastModelType =
  | 'ARIMA'
  | 'SARIMA'
  | 'ETS'
  | 'PROPHET'
  | 'LSTM'
  | 'TRANSFORMER'
  | 'XGBOOST'
  | 'LIGHTGBM'
  | 'RANDOM_FOREST'
  | 'LINEAR_REGRESSION'
  | 'ENSEMBLE'
  | 'STATISTICAL'
  | 'HEURISTIC'
  | 'RULE_BASED'
  | 'SEASONAL_NAIVE'
  | 'MOVING_AVERAGE'
  | 'EXPONENTIAL_SMOOTHING'
  | 'HOLT_WINTERS'
  | 'CUSTOM';

export type ForecastOutputType =
  | 'POINT_ESTIMATE'
  | 'PREDICTION_INTERVAL'
  | 'CONFIDENCE_INTERVAL'
  | 'DISTRIBUTION'
  | 'SCENARIO_BASED'
  | 'PROBABILISTIC'
  | 'DETERMINISTIC';

export type ForecastDataQuality =
  | 'COMPLETE'
  | 'PARTIAL'
  | 'ESTIMATED'
  | 'MISSING'
  | 'INSUFFICIENT'
  | 'STALE'
  | 'CONFLICTED';

export interface ForecastDefinition {
  forecastId: string;
  societyId: string;
  forecastType: ForecastType;
  name: string;
  description: string;
  targetEntityType: string;
  targetEntityId?: string;
  targetMetric: string;
  horizon: ForecastHorizon;
  granularity: ForecastGranularity;
  outputType: ForecastOutputType;
  modelId: string;
  modelVersion: string;
  sourceDataSpecification: SourceDataSpecification;
  schedule: ForecastSchedule;
  outputConfiguration: ForecastOutputConfiguration;
  validationRules: ForecastValidationRule[];
  qualityGates: ForecastQualityGate[];
  scheduleConfig: ForecastScheduleConfig;
  tags: string[];
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'DISABLED' | 'ARCHIVED';
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  activatedAt?: string;
  activatedBy?: string;
  deprecatedAt?: string;
  deprecatedBy?: string;
}

export interface SourceDataSpecification {
  sourceDomains: string[];
  requiredMetrics: string[];
  minimumHistoryLength: number;
  minimumDataPoints: number;
  requiredGranularity: string;
  allowedGapPercentage: number;
  requiredFeatures: string[];
  optionalFeatures: string[];
  externalDataSources?: string[];
  dataQualityRequirements: DataQualityRequirements;
}

export interface DataQualityRequirements {
  minCompleteness: number;
  maxStalenessHours: number;
  maxOutlierPercentage: number;
  minConsistencyScore: number;
  requireGroundTruth: boolean;
}

export interface ForecastSchedule {
  scheduleType: 'CRON' | 'INTERVAL' | 'EVENT_DRIVEN' | 'MANUAL' | 'ON_DEMAND';
  cronExpression?: string;
  intervalMinutes?: number;
  timezone: string;
  startDate?: string;
  endDate?: string;
  retryPolicy: {
    maxRetries: number;
    retryDelayMinutes: number;
    backoffMultiplier: number;
  };
  timeoutMinutes: number;
  concurrencyLimit: number;
}

export interface ForecastOutputConfiguration {
  outputType: ForecastOutputType;
  confidenceLevels: number[];
  includePointEstimate: boolean;
  includePredictionInterval: boolean;
  includeConfidenceInterval: boolean;
  includeComponents: boolean;
  includeDiagnostics: boolean;
  precision: number;
  formatting: {
    decimalPlaces: number;
    dateFormat: string;
    numberFormat: string;
    locale: string;
  };
  includeMetadata: boolean;
  includeSourceReferences: boolean;
}

export interface ForecastValidationRule {
  ruleId: string;
  name: string;
  description: string;
  expression: string;
  severity: 'ERROR' | 'WARNING' | 'INFO';
  appliesTo: 'INPUT' | 'OUTPUT' | 'MODEL' | 'DATA';
}

export interface ForecastQualityGate {
  gateId: string;
  name: string;
  description: string;
  metric: string;
  threshold: number;
  operator: 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'EQUALS' | 'NOT_EQUALS';
  actionOnFailure: 'FAIL' | 'WARN' | 'DOWNGRADE_CONFIDENCE' | 'USE_FALLBACK' | 'BLOCK';
  enabled: boolean;
}

export interface ForecastScheduleConfig {
  enabled: boolean;
  respectQuietHours: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  respectCalendar: boolean;
  excludedDates?: string[];
  maxConcurrentRuns: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
}

export interface ForecastDefinitionVersion {
  versionId: string;
  forecastId: string;
  version: number;
  changelog: string;
  changedBy: string;
  changedAt: string,
  changeType: 'MINOR' | 'MAJOR' | 'PATCH' | 'HOTFIX' | 'SECURITY' | 'FEATURE' | 'BUGFIX' | 'DOCS' | 'REFACTOR' | 'STYLE' | 'TEST' | 'CHORE' | 'BUILD' | 'CI' | 'REVERT' | 'MERGE' | 'SQUASH' | 'REBASE' | 'CHERRY_PICK' | 'AMEND';
  previousVersionId?: string;
  approvedBy?: string;
  approvedAt?: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface ForecastRun {
  runId: string;
  forecastId: string;
  definitionVersionId: string;
  status: 'DRAFT' | 'VALIDATING' | 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_WARNINGS' | 'FAILED' | 'CANCELLED' | 'EXPIRED' | 'ARCHIVED';
  modelId: string;
  modelVersion: string;
  modelVersionId: string;
  startedAt: string;
  completedAt?: string;
  failedAt?: string;
  cancelledAt?: string;
  cancelledBy?: string;
  cancelledReason?: string;
  triggeredBy: 'SCHEDULE' | 'MANUAL' | 'EVENT' | 'WEBHOOK' | 'API' | 'USER' | 'SYSTEM' | 'AUTO' | 'RETRY' | 'REPLAY';
  triggeredAt: string;
  inputDataSnapshot: InputDataSnapshot;
  modelVersionUsed: string;
  templateVersionUsed: string;
  output: ForecastResult;
  warnings: ForecastRunWarning[];
  errors: ForecastRunError[];
  durationMs?: number;
  idempotencyKey: string;
}

export interface InputDataSnapshot {
  snapshotId: string;
  dataAsOf: string;
  sourcePeriod: { from: string; to: string };
  dataPoints: number;
  featuresUsed: string[];
  dataQualityMetrics: DataQualityMetrics;
  sourceVersions: Record<string, string>;
  dataChecksum: string;
}

export interface DataQualityMetrics {
  completeness: number;
  stalenessHours: number;
  outlierPercentage: number;
  consistencyScore: number;
  missingValues: number;
  totalDataPoints: number;
  expectedDataPoints: number;
  dataFreshness: 'REAL_TIME' | 'NEAR_REAL_TIME' | 'RECENT' | 'STALE' | 'STALE_KNOWN' | 'STALE_UNKNOWN' | 'HISTORICAL' | 'ARCHIVED';
  qualityFlags: string[];
}

export interface ForecastResult {
  resultId: string;
  runId: string;
  forecastId: string;
  modelId: string;
  modelVersion: string;
  generatedAt: string;
  forecastPeriod: { from: string; to: string };
  granularity: string;
  horizon: string;
  outputType: string;
  confidenceLevel: number;
  pointEstimates: ForecastPoint[];
  predictionIntervals?: PredictionInterval[];
  confidenceIntervals?: ConfidenceInterval[];
  distributionParameters?: DistributionParameters;
  scenarioOutputs?: ScenarioOutput[];
  diagnostics: ForecastDiagnostics;
  warnings: ForecastWarning[];
  templateVersion: string;
  dataFreshness: string;
  sourcePeriod: { from: string; to: string };
  dataQuality: ForecastDataQuality;
  metadata: Record<string, any>;
}

export interface ForecastPoint {
  timestamp: string;
  value: number;
  lowerBound?: number;
  upperBound?: number;
  confidence?: number;
  components?: Record<string, number>;
}

export interface PredictionInterval {
  lowerBound: number[];
  upperBound: number[];
  confidenceLevel: number;
  method: string;
}

export interface ConfidenceInterval {
  lowerBound: number;
  upperBound: number;
  confidenceLevel: number;
}

export interface DistributionParameters {
  distributionType: 'NORMAL' | 'LOGNORMAL' | 'GAMMA' | 'BETA' | 'POISSON' | 'NEGATIVE_BINOMIAL' | 'CUSTOM';
  parameters: Record<string, number>;
}

export interface ScenarioOutput {
  scenarioId: string;
  scenarioName: string;
  pointEstimates: ForecastPoint[];
  probability: number;
}

export interface ForecastDiagnostics {
  modelFit: ModelFitMetrics;
  residualAnalysis: ResidualAnalysis;
  featureImportance: FeatureImportance[];
  stabilityMetrics: StabilityMetrics;
  backtestResults: BacktestResult[];
}

export interface ModelFitMetrics {
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  smape: number;
  mase: number;
  r2: number;
  aic: number;
  bic: number;
}

export interface ResidualAnalysis {
  mean: number;
  std: number;
  skewness: number;
  kurtosis: number;
  autocorrelation: number[];
  ljungBoxPValue: number;
  normalityTestPValue: number;
  heteroscedasticityTestPValue: number;
}

export interface FeatureImportance {
  feature: string;
  importance: number;
  rank: number;
  shapValue?: number;
}

export interface StabilityMetrics {
  parameterStability: number;
  predictionStability: number;
  conceptDriftScore: number;
  dataDriftScore: number;
}

export interface BacktestResult {
  period: { from: string; to: string };
  actuals: number[];
  predictions: number[];
  metrics: ModelFitMetrics;
  coverage: number;
}

export interface ForecastWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedPeriod?: { from: string; to: string };
  recommendation?: string;
}

export interface ForecastRunWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedPeriod?: { from: string; to: string };
  recommendation?: string;
}

export interface ForecastRunError {
  errorCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  step?: string;
  recoverable: boolean;
  retryable: boolean;
}

export interface ForecastEvaluation {
  evaluationId: string;
  forecastId: string;
  runId: string;
  evaluationPeriod: { from: string; to: string };
  generatedAt: string;
  actuals: number[];
  predictions: number[];
  metrics: ForecastEvaluationMetrics;
  byPeriod: PeriodEvaluation[];
  byEntity?: EntityEvaluation[];
  driftDetected: boolean;
  driftDetails?: DriftDetails;
  recommendation: 'CONTINUE' | 'RETRAIN' | 'SUSPEND' | 'INVESTIGATE';
  notes?: string;
}

export interface ForecastEvaluationMetrics {
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  smape: number;
  mase: number;
  r2: number;
  coverage: number;
  bias: number;
  maeByPeriod: Record<string, number>;
  coverageByPeriod: Record<string, number>;
}

export interface PeriodEvaluation {
  period: { from: string; to: string };
  actuals: number[];
  predictions: number[];
  metrics: ForecastEvaluationMetrics;
}

export interface EntityEvaluation {
  entityId: string;
  entityType: string;
  metrics: ForecastEvaluationMetrics;
}

export interface DriftDetails {
  driftType: 'CONCEPT_DRIFT' | 'DATA_DRIFT' | 'FEATURE_DRIFT' | 'TARGET_DRIFT' | 'CONCEPT_SHIFT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  driftMagnitude: number;
  affectedFeatures: string[];
  affectedPeriods: string[];
  suggestedAction: 'MONITOR' | 'RETRAIN' | 'SUSPEND' | 'INVESTIGATE';
  confidence: number;
}

export interface ForecastWarning {
  warningCode: string;
  message: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  affectedPeriod?: { from: string; to: string };
  recommendation?: string;
}

export interface ForecastModel {
  modelId: string;
  name: string;
  description: string;
  forecastType: string;
  type: string;
  version: string;
  status: 'EXPERIMENTAL' | 'VALIDATING' | 'ACTIVE' | 'DEGRADED' | 'SUSPENDED' | 'RETIRED' | 'ARCHIVED';
  configuration: ModelConfiguration;
  trainingConfig: TrainingConfig;
  evaluationMetrics: ModelEvaluationMetrics;
  effectiveFrom: string;
  effectiveTo?: string;
  createdBy: string;
  createdAt: string;
  updatedBy?: string;
  updatedAt?: string;
  activatedBy?: string;
  activatedAt?: string;
  deprecatedBy?: string;
  deprecatedAt?: string;
  deprecatedReason?: string;
  tags: string[];
}

export interface ModelConfiguration {
  algorithm: string;
  hyperparameters: Record<string, any>;
  featureEngineering: FeatureEngineeringConfig;
  preprocessing: PreprocessingConfig;
  featureSelection: FeatureSelectionConfig;
  validationStrategy: ValidationStrategyConfig;
  ensembleConfig?: EnsembleConfig;
}

export interface FeatureEngineeringConfig {
  enabled: boolean;
  methods: string[];
  targetLags: number[];
  rollingWindows: number[];
  seasonalFeatures: boolean;
  trendFeatures: boolean;
  holidayFeatures: boolean;
  weatherFeatures: boolean;
  customFeatures: Record<string, any>;
}

export interface PreprocessingConfig {
  missingValueStrategy: 'DROP' | 'INTERPOLATE' | 'FORWARD_FILL' | 'BACKWARD_FILL' | 'MEAN' | 'MEDIAN' | 'ZERO' | 'MODEL';
  outlierStrategy: 'REMOVE' | 'CAP' | 'WINSORIZE' | 'TRANSFORM' | 'KEEP';
  scalingStrategy: 'NONE' | 'STANDARD' | 'MIN_MAX' | 'ROBUST' | 'POWER_TRANSFORM' | 'QUANTILE';
  featureSelection: 'NONE' | 'UNIVARIATE' | 'RECURSIVE' | 'LASSO' | 'TREE_BASED' | 'PERMUTATION';
}

export interface FeatureSelectionConfig {
  method: 'NONE' | 'UNIVARIATE' | 'RECURSIVE' | 'LASSO' | 'TREE_BASED' | 'PERMUTATION' | 'SHAP';
  threshold?: number;
  maxFeatures?: number;
}

export interface ValidationStrategyConfig {
  strategy: 'TIME_SERIES_SPLIT' | 'K_FOLD' | 'WALK_FORWARD' | 'BLOCKED' | 'PURGED_K_FOLD' | 'COMBINATORIAL_PURGED_K_FOLD';
  nSplits: number;
  testSize: number;
  gap: number;
  expandingWindow: boolean;
}

export interface EnsembleConfig {
  method: 'AVERAGING' | 'WEIGHTED_AVERAGING' | 'STACKING' | 'BLENDING' | 'VOTING';
  models: string[];
  weights?: number[];
  metaLearner?: string;
}

export interface TrainingConfig {
  trainingWindow: { from: string; to: string };
  validationWindow?: { from: string; to: string };
  testWindow?: { from: string; to: string };
  retrainSchedule: RetrainSchedule;
  incrementalTraining: boolean;
  warmStart: boolean;
  earlyStopping: EarlyStoppingConfig;
  hardwareRequirements: HardwareRequirements;
}

export interface RetrainSchedule {
  enabled: boolean;
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'ON_DEMAND' | 'ON_DRIFT' | 'ON_PERFORMANCE_DEGRADATION';
  cronExpression?: string;
  triggerThresholds: DriftThresholds;
  maxRetrainsPerPeriod: number;
  minDataSinceLastRetrain: number;
}

export interface DriftThresholds {
  conceptDriftThreshold: number;
  dataDriftThreshold: number;
  performanceDegradationThreshold: number;
  featureDriftThreshold: number;
}

export interface EarlyStoppingConfig {
  enabled: boolean;
  patience: number;
  minDelta: number;
  metric: string;
  mode: 'MIN' | 'MAX';
  restoreBestWeights: boolean;
}

export interface HardwareRequirements {
  gpuRequired: boolean;
  gpuMemoryGb?: number;
  cpuCores?: number;
  memoryGb?: number;
  diskSpaceGb?: number;
  estimatedTrainingTimeMinutes: number;
  estimatedInferenceTimeMs: number;
}

export interface ModelEvaluationMetrics {
  mae: number;
  mse: number;
  rmse: number;
  mape: number;
  smape: number;
  mase: number;
  r2: number;
  precision: number;
  recall: number;
  f1: number;
  accuracy: number;
  precisionAtK?: number;
  recallAtK?: number;
  ndcg?: number;
  auc?: number;
  logLoss?: number;
  brierScore?: number;
  calibrationError?: number;
}

export interface ForecastDriftEvaluation {
  forecastId: string;
  evaluationPeriod: { from: string; to: string };
  driftDetected: boolean;
  driftType: 'CONCEPT_DRIFT' | 'DATA_DRIFT' | 'FEATURE_DRIFT' | 'TARGET_DRIFT' | 'CONCEPT_SHIFT';
  driftMagnitude: number;
  driftTrend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  confidence: number;
  affectedMetrics: string[];
  recommendedAction: 'CONTINUE' | 'MONITOR' | 'RETRAIN' | 'SUSPEND' | 'INVESTIGATE';
  details: DriftDetails;
}

export interface DriftDetails {
  driftType: 'CONCEPT_DRIFT' | 'DATA_DRIFT' | 'FEATURE_DRIFT' | 'TARGET_DRIFT' | 'CONCEPT_SHIFT';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  driftMagnitude: number;
  affectedFeatures: string[];
  affectedPeriods: string[];
  suggestedAction: 'MONITOR' | 'RETRAIN' | 'SUSPEND' | 'INVESTIGATE';
  confidence: number;
}

export interface ForecastAlert {
  alertId: string;
  forecastId: string;
  alertType: 'DRIFT_DETECTED' | 'PERFORMANCE_DEGRADATION' | 'SLA_BREACH' | 'MODEL_UNAVAILABLE' | 'DATA_QUALITY_ISSUE' | 'FORECAST_FAILURE' | 'MODEL_DRIFT' | 'SCHEDULE_MISSED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  details: Record<string, any>;
  createdAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED' | 'ESCALATED';
}

export interface ForecastRunRequest {
  forecastId: string;
  triggeredBy: 'SCHEDULE' | 'MANUAL' | 'EVENT' | 'WEBHOOK' | 'API' | 'USER' | 'SYSTEM' | 'AUTO' | 'RETRY' | 'REPLAY';
  requestedBy: string;
  overrideParameters?: Partial<any>;
  idempotencyKey?: string;
}

export interface ForecastRunResult {
  runId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'COMPLETED_WITH_WARNINGS' | 'FAILED' | 'CANCELLED';
  output?: any;
  warnings: string[];
  errors: string[];
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
}

export interface ForecastQuery {
  societyId?: string;
  forecastType?: string;
  status?: string;
  modelId?: string;
  modelVersion?: string;
  statusFilter?: string[];
  dateRange?: { from: string; to: string };
  tags?: string[];
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'lastRunAt' | 'nextRunAt';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ForecastListResult {
  forecasts: ForecastDefinition[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ForecastRunListResult {
  runs: ForecastRun[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ForecastEvaluationResult {
  evaluations: ForecastEvaluation[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ForecastModelListResult {
  models: ForecastModel[];
  totalCount: number;
  hasMore: boolean;
  nextCursor?: string;
}

export interface ModelDriftAlert {
  modelId: string;
  modelName: string;
  driftDetected: boolean;
  driftType: string;
  driftMagnitude: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedAt: string;
  recommendedAction: 'CONTINUE' | 'MONITOR' | 'RETRAIN' | 'SUSPEND' | 'INVESTIGATE';
  confidence: number;
  details: string;
}

export interface ForecastDataQualityIssue {
  issueId: string;
  forecastId: string;
  runId: string;
  issueType: 'MISSING_DATA' | 'STALE_DATA' | 'OUTLIER' | 'INCONSISTENT' | 'INCOMPLETE' | 'SCHEMA_MISMATCH' | 'SCHEMA_EVOLUTION';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  affectedPeriod?: { from: string; to: string };
  affectedEntities: string[];
  affectedMetrics: string[];
  detectedAt: string;
  autoResolvable: boolean;
  resolutionStatus: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED' | 'ESCALATED';
  resolution?: string;
}

export interface ForecastModelEvaluation {
  modelId: string;
  modelVersion: string;
  evaluationPeriod: { from: string; to: string };
  evaluationMetrics: ModelEvaluationMetrics;
  backtestResults: BacktestResult[];
  driftMetrics: DriftMetrics;
  dataQualityMetrics: DataQualityMetrics;
  evaluationTimestamp: string;
  evaluatedBy: string;
  nextEvaluationDue: string;
}

export interface DriftMetrics {
  conceptDriftScore: number;
  dataDriftScore: number;
  featureDriftScore: number;
  targetDriftScore: number;
  predictionDriftScore: number;
  overallDriftScore: number;
  trend: 'IMPROVING' | 'STABLE' | 'DEGRADING';
  lastDriftDetectedAt?: string;
  driftHistory: Array<{
    detectedAt: string;
    driftType: string;
    magnitude: number;
    resolved: boolean;
    resolvedAt?: string;
  }>;
}

export interface ForecastDataQualityReport {
  forecastId: string;
  period: { from: string; to: string };
  overallQuality: 'COMPLETE' | 'PARTIAL' | 'ESTIMATED' | 'MISSING' | 'INSUFFICIENT' | 'STALE' | 'CONFLICTED';
  metrics: DataQualityMetrics;
  issues: ForecastDataQualityIssue[];
  recommendations: string[];
  generatedAt: string;
}

export interface ForecastModelVersion {
  modelId: string;
  version: string;
  modelVersionId: string;
  createdAt: string;
  createdBy: string;
  status: 'EXPERIMENTAL' | 'VALIDATING' | 'ACTIVE' | 'DEGRADED' | 'SUSPENDED' | 'RETIRED' | 'ARCHIVED';
  trainingPeriod: { from: string; to: string };
  validationMetrics: ModelEvaluationMetrics;
  trainingDataHash: string;
  codeVersion: string;
  dependencies: Record<string, string>;
  artifacts: ModelArtifacts;
}

export interface ModelArtifacts {
  modelFilePath: string;
  modelFileSize: number;
  modelChecksum: string;
  modelChecksumAlgorithm: string;
  preprocessingArtifactsPath?: string;
  featureEngineeringArtifactsPath?: string;
  featureImportancePath?: string;
  featureImportanceData?: FeatureImportance[];
  evaluationReportPath?: string;
  backtestResultsPath?: string;
  driftReportPath?: string;
  trainingLogsPath?: string;
  trainingMetricsPath?: string;
  hyperparametersPath?: string;
  featureEngineeringConfigPath?: string;
  preprocessingConfigPath?: string;
}

export interface ForecastModelRollout {
  rolloutId: string;
  modelId: string;
  fromVersion: string;
  toVersion: string;
  rolloutStrategy: 'CANARY' | 'BLUE_GREEN' | 'ROLLING' | 'IMMEDIATE' | 'SCHEDULED';
  rolloutPercentage: number;
  steps: RolloutStep[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'ROLLED_BACK' | 'FAILED' | 'PAUSED';
  startedAt: string;
  completedAt?: string;
  rolledBackAt?: string;
  rolledBackBy?: string;
  rollbackReason?: string;
}

export interface RolloutStep {
  stepId: string;
  name: string;
  percentage: number;
  durationMinutes: number;
  successCriteria: string[];
  validationQueries: string[];
  autoProceed: boolean;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED' | 'ROLLED_BACK';
  startedAt?: string;
  completedAt?: string;
  metrics?: Record<string, number>;
  notes?: string;
}

export interface ForecastExportRequest {
  forecastId?: string;
  runId?: string;
  evaluationId?: string;
  format: 'JSON' | 'COMPRESSED_JSON' | 'CSV' | 'PARQUET' | 'PDF_REPORT' | 'HTML_REPORT' | 'EXCEL';
  includeMetadata: boolean;
  includePointEstimates: boolean;
  includeIntervals: boolean;
  includeDiagnostics: boolean;
  includeWarnings: boolean;
  includeModelInfo: boolean;
  dateRange?: { from: string; to: string };
  filters?: Record<string, any>;
  requestedBy: string;
}

export interface ForecastExportResult {
  exportId: string;
  format: string;
  downloadUrl: string;
  expiresAt: string;
  sizeBytes: number;
  checksum: string;
  checksumAlgorithm: string;
  createdAt: string;
}

export interface ForecastImportRequest {
  file: string;
  format: 'JSON' | 'COMPRESSED_JSON' | 'CSV' | 'PARQUET';
  overwriteExisting: boolean;
  validateOnly: boolean;
  requestedBy: string;
}

export interface ForecastImportResult {
  importId: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  importedCount: number;
  failedCount: number;
  errors: Array<{ row: number; field: string; error: string }>;
  warnings: string[];
  processedAt: string;
}

export interface ForecastModelRollback {
  modelId: string;
  targetVersion: string;
  requestedBy: string;
  reason: string;
  force: boolean;
}

export interface ForecastModelRollbackResult {
  rollbackId: string;
  modelId: string;
  fromVersion: string;
  toVersion: string;
  status: 'SUCCESS' | 'FAILED' | 'PARTIAL';
  rolledBackAt: string;
  rolledBackBy: string;
  details: string;
  affectedForecasts: string[];
}

export interface ForecastModelComparison {
  modelIdA: string;
  modelIdB: string;
  comparisonPeriod: { from: string; to: string };
  comparisonMetrics: Record<string, { modelA: number; modelB: number; difference: number; better: 'A' | 'B' | 'TIE' }>;
  statisticalSignificance: Record<string, number>;
  recommendation: 'A' | 'B' | 'NEITHER' | 'INCONCLUSIVE';
  confidence: number;
  notes?: string;
}

export interface ForecastModelEnsemble {
  ensembleId: string;
  name: string;
  description: string;
  memberModels: Array<{ modelId: string; weight: number; role: 'PRIMARY' | 'SECONDARY' | 'BACKUP' }>;
  combinationMethod: 'AVERAGING' | 'WEIGHTED_AVERAGE' | 'STACKING' | 'BLENDING' | 'VOTING' | 'STACKING';
  metaLearner?: string;
  aggregationWeights?: Record<string, number>;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'RETIRED';
  evaluationMetrics?: ModelEvaluationMetrics;
}