export type CapacityType =
  | 'PARKING_SLOTS'
  | 'FACILITY_BOOKING_SLOTS'
  | 'WATER_STORAGE_CAPACITY'
  | 'EV_CHARGER_CAPACITY'
  | 'STAFF_COVERAGE'
  | 'GATE_LANES'
  | 'WATER_TREATMENT_CAPACITY'
  | 'SEWAGE_TREATMENT_CAPACITY'
  | 'SOLAR_GENERATION_CAPACITY'
  | 'COMMON_AREA_CAPACITY'
  | 'WASTE_COLLECTION_CAPACITY'
  | 'EV_CHARGING_BAYS'
  | 'GUEST_ROOM_CAPACITY'
  | 'SPORTS_FACILITY_CAPACITY'
  | 'COMMUNITY_HALL_CAPACITY'
  | 'GYM_CAPACITY'
  | 'POOL_CAPACITY'
  | 'LIFT_CAPACITY'
  | 'WATER_PUMP_CAPACITY'
  | 'STP_CAPACITY'
  | 'ETP_CAPACITY'
  | 'DG_SET_CAPACITY'
  | 'TRANSFORMER_CAPACITY';

export type CapacityUnit =
  | 'SLOTS'
  | 'UNITS'
  | 'LITERS'
  | 'KILOLITERS'
  | 'CUBIC_METERS'
  | 'KWH'
  | 'MWH'
  | 'KW'
  | 'MW'
  | 'PERSONS'
  | 'VEHICLES'
  | 'KVA'
  | 'KVAR'
  | 'AMPERES'
  | 'VOLTS'
  | 'HORSEPOWER'
  | 'LPM'
  | 'CUBIC_METERS_PER_HOUR'
  | 'LITERS_PER_MINUTE';

export type CapacityStatus =
  | 'ADEQUATE'
  | 'NEAR_CAPACITY'
  | 'AT_CAPACITY'
  | 'OVER_CAPACITY'
  | 'UNKNOWN'
  | 'NOT_CONFIGURED'
  | 'DEGRADED'
  | 'OFFLINE';

export interface CapacityDefinition {
  capacityId: string;
  societyId: string;
  capacityType: CapacityType;
  name: string;
  description?: string;
  sourceEntityType: string;
  sourceEntityId: string;
  totalCapacity: number;
  unit: CapacityUnit;
  effectiveFrom: string;
  effectiveTo?: string;
  allocationRules?: CapacityAllocationRule[];
  thresholds: CapacityThresholds;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy?: string;
}

export interface CapacityAllocationRule {
  ruleId: string;
  priority: number;
  condition: string;
  allocationPercent?: number;
  fixedAllocation?: number;
  minGuaranteed?: number;
  maxAllowed?: number;
  priorityGroups: string[];
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface CapacityThresholds {
  nearCapacityPercent: number;
  atCapacityPercent: number;
  overCapacityPercent: number;
  degradedThresholdPercent?: number;
  criticalThresholdPercent?: number;
}

export interface CapacitySnapshot {
  capacityId: string;
  societyId: string;
  capacityType: CapacityType;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizedCapacity: number;
  reservedCapacity: number;
  unit: CapacityUnit;
  status: CapacityStatus;
  utilizationPercent: number;
  allocatedPercent: number;
  reservedPercent: number;
  freePercent: number;
  timestamp: string;
  projectionVersion: number;
  sourceQuality: 'CONFIRMED' | 'ESTIMATED' | 'STALE' | 'PARTIAL' | 'UNKNOWN';
  allocationBreakdown: AllocationBreakdown[];
  warnings: string[];
}

export interface AllocationBreakdown {
  allocationRuleId: string;
  allocatedTo: string;
  allocatedAmount: number;
  usedAmount: number;
  availableAmount: number;
  percentUtilized: number;
  status: 'ACTIVE' | 'EXHAUSTED' | 'PENDING' | 'EXPIRED';
}

export interface CapacityUtilizationHistory {
  capacityId: string;
  societyId: string;
  period: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  fromTimestamp: string;
  toTimestamp: string;
  granularity: 'MINUTE' | 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  dataPoints: CapacityDataPoint[];
  summary: CapacitySummary;
  dataQuality: 'COMPLETE' | 'PARTIAL' | 'ESTIMATED' | 'MISSING';
  sourceProvenance: string[];
}

export interface CapacityDataPoint {
  timestamp: string;
  totalCapacity: number;
  allocatedCapacity: number;
  availableCapacity: number;
  utilizedCapacity: number;
  reservedCapacity: number;
  utilizationPercent: number;
  status: CapacityStatus;
}

export interface CapacitySummary {
  averageUtilization: number;
  peakUtilization: number;
  minUtilization: number;
  timeAtPeak: string;
  timeAtMin: string;
  capacityChanges: number;
  thresholdBreaches: number;
  nearCapacityEvents: number;
  atCapacityEvents: number;
  overCapacityEvents: number;
}

export interface CapacityForecast {
  capacityId: string;
  societyId: string;
  forecastType: CapacityType;
  horizon: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH' | 'QUARTER' | 'YEAR';
  granularity: 'HOUR' | 'DAY' | 'WEEK' | 'MONTH';
  generatedAt: string;
  generatedBy: string;
  modelId: string;
  modelVersion: string;
  horizonStart: string;
  horizonEnd: string;
  dataPoints: CapacityForecastPoint[];
  assumptions: ForecastAssumption[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  confidenceInterval?: {
    lowerBound: number;
    upperBound: number;
    confidenceLevel: number;
  };
  warnings: string[];
  dataQuality: 'COMPLETE' | 'PARTIAL' | 'ESTIMATED' | 'MISSING';
  sourceFreshness: string;
}

export interface CapacityForecastPoint {
  timestamp: string;
  predictedUtilization: number;
  predictedAllocated: number;
  predictedAvailable: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  lowerBound?: number;
  upperBound?: number;
}

export interface ForecastAssumption {
  assumptionId: string;
  description: string;
  type: 'CONFIGURED' | 'HISTORICAL_BASELINE' | 'USER_INPUT' | 'MODEL_ESTIMATE';
  value: any;
  source: string;
  confidence: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface CapacityBottleneck {
  bottleneckId: string;
  societyId: string;
  capacityType: CapacityType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  currentUtilization: number;
  projectedUtilization: number;
  timeToCapacity: string;
  affectedEntities: string[];
  rootCause: string;
  contributingFactors: string[];
  recommendedActions: string[];
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  detectedAt: string;
  projectedResolution?: string;
  relatedSimulations: string[];
}

export interface CapacityAlert {
  alertId: string;
  societyId: string;
  capacityId: string;
  alertType: 'THRESHOLD_BREACH' | 'TREND' | 'ANOMALY' | 'FORECAST_BREACH' | 'CAPACITY_EXHAUSTION' | 'DEGRADED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  message: string;
  currentValue: number;
  thresholdValue: number;
  triggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  autoResolve: boolean;
  escalationLevel: number;
}

export interface CapacityPlanningRequest {
  societyId: string;
  capacityType: CapacityType;
  planningHorizon: string;
  targetUtilization: number;
  constraints: CapacityPlanningConstraint[];
  scenarios: CapacityPlanningScenario[];
}

export interface CapacityPlanningConstraint {
  constraintId: string;
  type: 'BUDGET' | 'SPACE' | 'REGULATORY' | 'CONTRACTUAL' | 'OPERATIONAL' | 'PHYSICAL';
  description: string;
  value: any;
  unit: string;
  priority: 'MANDATORY' | 'PREFERRED' | 'OPTIONAL';
}

export interface CapacityPlanningScenario {
  scenarioId: string;
  name: string;
  description: string;
  assumptions: CapacityAssumption[];
  expectedOutcome: CapacityPlanningOutcome;
}

export interface CapacityAssumption {
  assumptionId: string;
  description: string;
  type: 'CONFIGURED' | 'HISTORICAL_BASELINE' | 'USER_INPUT' | 'MODEL_ESTIMATE';
  value: any;
  confidence: number;
  source: string;
}

export interface CapacityPlanningOutcome {
  requiredCapacity: number;
  additionalCapacityNeeded: number;
  estimatedCost: number;
  implementationTimeline: string;
  recommendedActions: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface CapacityAlertThreshold {
  thresholdId: string;
  societyId: string;
  capacityType: CapacityType;
  thresholdType: 'UTILIZATION_PERCENT' | 'ABSOLUTE_VALUE' | 'TREND' | 'FORECAST';
  thresholdValue: number;
  operator: 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'EQUALS' | 'NOT_EQUALS';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  enabled: boolean;
  notificationChannels: string[];
  cooldownMinutes: number;
  escalationPolicy?: {
    levels: number;
    escalationIntervalMinutes: number;
    escalationContacts: string[];
  };
}