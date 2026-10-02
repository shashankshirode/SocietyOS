import {
  MaintenanceRiskRequest,
  MaintenanceRiskResult,
  AssetMaintenanceMetrics,
  calculateRiskScore,
  getRiskRecommendations,
} from './maintenanceRisk.types';
import { aiOrchestrationService } from '../../../aiServices/core/services';

const mockAssetMetrics: Map<string, AssetMaintenanceMetrics> = new Map();

function initializeMockMetrics(): void {
  mockAssetMetrics.set('lift-tower-a-1', {
    assetId: 'lift-tower-a-1',
    assetName: 'Tower A Lift 1',
    assetCategory: 'LIFT',
    lastMaintenanceDate: '2026-06-15',
    breakdownCount: 3,
    totalDowntimeHours: 18,
    amcExpiryDate: '2026-08-31',
    amcVendor: 'Otis Elevators',
    avgResponseTimeHours: 2.5,
    complianceStatus: 'COMPLIANT',
    inspectionDueDate: '2026-09-15',
  });

  mockAssetMetrics.set('water-pump-main-1', {
    assetId: 'water-pump-main-1',
    assetName: 'Main Water Pump',
    assetCategory: 'WATER_PUMP',
    lastMaintenanceDate: '2026-05-20',
    breakdownCount: 1,
    totalDowntimeHours: 4,
    amcExpiryDate: '2026-12-31',
    amcVendor: 'Kirloskar',
    avgResponseTimeHours: 1.5,
    complianceStatus: 'COMPLIANT',
    inspectionDueDate: '2026-11-01',
  });

  mockAssetMetrics.set('generator-main-1', {
    assetId: 'generator-main-1',
    assetName: 'Main DG Set',
    assetCategory: 'GENERATOR',
    lastMaintenanceDate: '2026-04-10',
    breakdownCount: 0,
    totalDowntimeHours: 0,
    amcExpiryDate: '2025-12-31',
    amcVendor: 'Cummins',
    avgResponseTimeHours: 3,
    complianceStatus: 'NON_COMPLIANT',
    inspectionDueDate: '2026-06-30',
  });

  mockAssetMetrics.set('fire-system-main', {
    assetId: 'fire-system-main',
    assetName: 'Fire Suppression System',
    assetCategory: 'FIRE_SYSTEM',
    lastMaintenanceDate: '2026-03-15',
    breakdownCount: 0,
    totalDowntimeHours: 0,
    amcExpiryDate: '2026-10-31',
    amcVendor: 'Siemens',
    avgResponseTimeHours: 1,
    complianceStatus: 'COMPLIANT',
    inspectionDueDate: '2026-09-30',
  });
}

initializeMockMetrics();

function getAssetMetrics(assetId: string): AssetMaintenanceMetrics | undefined {
  return mockAssetMetrics.get(assetId);
}

function getAllMetrics(societyId: string): AssetMaintenanceMetrics[] {
  return Array.from(mockAssetMetrics.values());
}

function generateDeterministicRisk(metrics: AssetMaintenanceMetrics): {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  factors: Array<{ factor: string; value: unknown; weight: number; description: string }>;
  recommendations: Array<{ action: string; priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'; rationale: string }>;
  evidence: Array<{ type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE'; entityId: string; entityType: string; metric: string; value: number; asOf: string }>;
} {
  const riskCalc = calculateRiskScore(metrics);
  const recommendations = getRiskRecommendations(riskCalc.riskLevel, riskCalc.factors);

  const evidence: Array<{ type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE'; entityId: string; entityType: string; metric: string; value: number; asOf: string }> = [
    { type: 'REPORT_METRIC' as const, entityId: metrics.assetId, entityType: 'ASSET', metric: 'breakdownCount', value: metrics.breakdownCount, asOf: new Date().toISOString() },
    { type: 'REPORT_METRIC' as const, entityId: metrics.assetId, entityType: 'ASSET', metric: 'totalDowntimeHours', value: metrics.totalDowntimeHours, asOf: new Date().toISOString() },
  ];

  if (metrics.amcExpiryDate) {
    evidence.push({ type: 'SOURCE_DOCUMENT' as const, entityId: metrics.assetId, entityType: 'ASSET', metric: 'amcExpiryDate', value: new Date(metrics.amcExpiryDate).getTime(), asOf: new Date().toISOString() });
  }
  if (metrics.inspectionDueDate) {
    evidence.push({ type: 'SOURCE_DOCUMENT' as const, entityId: metrics.assetId, entityType: 'ASSET', metric: 'inspectionDueDate', value: new Date(metrics.inspectionDueDate).getTime(), asOf: new Date().toISOString() });
  }
  if (metrics.complianceStatus) {
    evidence.push({ type: 'REPORT_METRIC' as const, entityId: metrics.assetId, entityType: 'ASSET', metric: 'complianceStatus', value: metrics.complianceStatus === 'COMPLIANT' ? 1 : 0, asOf: new Date().toISOString() });
  }

  return {
    riskLevel: riskCalc.riskLevel,
    riskScore: riskCalc.riskScore,
    factors: riskCalc.factors,
    recommendations,
    evidence,
  };
}

export const maintenanceRiskService = {
  async assessRisk(
    request: MaintenanceRiskRequest
  ): Promise<MaintenanceRiskResult> {
    let metrics: AssetMaintenanceMetrics[] = [];

    if (request.assetId) {
      const metric = getAssetMetrics(request.assetId);
      if (metric) metrics.push(metric);
    } else if (request.assetCategory) {
      metrics = getAllMetrics(request.societyId).filter(m => m.assetCategory === request.assetCategory);
    } else {
      metrics = getAllMetrics(request.societyId);
    }

    if (metrics.length === 0) {
      throw new Error('NO_ASSETS_FOUND_FOR_ASSESSMENT');
    }

    const aiCommand = {
      capability: 'MAINTENANCE_RISK' as const,
      input: {
        assets: metrics.map(m => ({
          assetId: m.assetId,
          assetName: m.assetName,
          assetCategory: m.assetCategory,
          metrics: {
            breakdownCount: m.breakdownCount,
            totalDowntimeHours: m.totalDowntimeHours,
            amcExpiryDate: m.amcExpiryDate,
            complianceStatus: m.complianceStatus,
            inspectionDueDate: m.inspectionDueDate,
            avgResponseTimeHours: m.avgResponseTimeHours,
          },
        })),
        timeWindowDays: request.timeWindowDays || 30,
      },
      societyId: request.societyId,
      requestedBy: request.requestedBy,
      priority: 'NORMAL',
      timeoutMs: 30000,
    };

    let aggregatedRisk: {
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      riskScore: number;
      factors: any[];
      recommendations: any[];
      evidence: any[];
    } = { riskLevel: 'LOW', riskScore: 0, factors: [], recommendations: [], evidence: [] };
    let modelVersion = 'deterministic-v1';
    let templateVersion = 1;
    let source: 'AI_PROVIDER' | 'RULE_FALLBACK' = 'RULE_FALLBACK';
    let confidence = 1.0;
    let confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN' = 'HIGH';
    let warnings: string[] = ['DETERMINISTIC_RISK: Calculated from asset metrics'];
    let requiresReview = false;
    let processingTimeMs = 10;

    for (const metric of metrics) {
      const risk = generateDeterministicRisk(metric);
      if (risk.riskScore > aggregatedRisk.riskScore) {
        aggregatedRisk = risk;
      }
    }

    let dataFreshness = new Date().toISOString();
    if (metrics.length > 0) {
      const latestMaintenance = metrics.reduce((latest, m) =>
        m.lastMaintenanceDate && (!latest || new Date(m.lastMaintenanceDate) > new Date(latest)) ? m.lastMaintenanceDate : latest,
        ''
      );
      dataFreshness = latestMaintenance || new Date().toISOString();
    }

    const result: MaintenanceRiskResult = {
      requestId: `mrisk_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...(request.assetId ? { assetId: request.assetId } : {}),
      ...(request.assetCategory ? { assetCategory: request.assetCategory } : {}),
      riskLevel: aggregatedRisk.riskLevel,
      riskScore: aggregatedRisk.riskScore,
      factors: aggregatedRisk.factors,
      evidence: aggregatedRisk.evidence,
      recommendations: aggregatedRisk.recommendations,
      confidence,
      confidenceBand,
      dataFreshness,
      modelVersion,
      templateVersion,
      source,
      warnings,
      requiresReview: aggregatedRisk.riskLevel === 'HIGH' || aggregatedRisk.riskLevel === 'CRITICAL',
      processingTimeMs,
      completedAt: new Date().toISOString(),
    };

    return result;
  },

  getDeterministicRisk(request: MaintenanceRiskRequest): MaintenanceRiskResult | null {
    let metrics: AssetMaintenanceMetrics[] = [];

    if (request.assetId) {
      const metric = getAssetMetrics(request.assetId);
      if (metric) metrics.push(metric);
    } else if (request.assetCategory) {
      metrics = getAllMetrics(request.societyId).filter(m => m.assetCategory === request.assetCategory);
    } else {
      metrics = getAllMetrics(request.societyId);
    }

    if (metrics.length === 0) return null;

    let aggregatedRisk: {
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      riskScore: number;
      factors: any[];
      recommendations: any[];
      evidence: any[];
    } = { riskLevel: 'LOW', riskScore: 0, factors: [], recommendations: [], evidence: [] };

    for (const metric of metrics) {
      const risk = generateDeterministicRisk(metric);
      if (risk.riskScore > aggregatedRisk.riskScore) {
        aggregatedRisk = risk;
      }
    }

    return {
      requestId: `mrisk_${Date.now()}`,
      ...(request.assetId ? { assetId: request.assetId } : {}),
      ...(request.assetCategory ? { assetCategory: request.assetCategory } : {}),
      riskLevel: aggregatedRisk.riskLevel,
      riskScore: aggregatedRisk.riskScore,
      factors: aggregatedRisk.factors,
      evidence: aggregatedRisk.evidence,
      recommendations: aggregatedRisk.recommendations,
      confidence: 1.0,
      confidenceBand: 'HIGH',
      dataFreshness: new Date().toISOString(),
      modelVersion: 'deterministic-v1',
      templateVersion: 1,
      source: 'RULE_FALLBACK',
      warnings: ['DETERMINISTIC_RISK: Calculated from asset metrics'],
      requiresReview: aggregatedRisk.riskLevel === 'HIGH' || aggregatedRisk.riskLevel === 'CRITICAL',
      processingTimeMs: 5,
      completedAt: new Date().toISOString(),
    };
  },

  getAssetMetrics(assetId: string): AssetMaintenanceMetrics | undefined {
    return getAssetMetrics(assetId);
  },

  getAllAssetMetrics(societyId: string): AssetMaintenanceMetrics[] {
    return getAllMetrics(societyId);
  },
};
