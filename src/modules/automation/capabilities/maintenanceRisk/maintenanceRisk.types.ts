export type MaintenanceRiskRequest = {
  assetId?: string;
  assetCategory?: 'LIFT' | 'WATER_PUMP' | 'GENERATOR' | 'FIRE_SYSTEM' | 'HVAC' | 'SOLAR' | 'EV_CHARGER' | 'OTHER';
  societyId: string;
  requestedBy: string;
  timeWindowDays?: number;
};

export type MaintenanceRiskResult = {
  requestId: string;
  assetId?: string;
  assetCategory?: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  factors: Array<{
    factor: string;
    value: unknown;
    weight: number;
    description: string;
  }>;
  evidence: Array<{
    type: 'SOURCE_DOCUMENT' | 'REPORT_METRIC' | 'HISTORICAL_DATA' | 'ENTITY_REFERENCE';
    entityId: string;
    entityType: string;
    metric: string;
    value: number;
    asOf: string;
  }>;
  recommendations: Array<{
    action: string;
    priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    rationale: string;
  }>;
  confidence: number;
  confidenceBand: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNCERTAIN';
  dataFreshness: string;
  modelVersion: string;
  templateVersion: number;
  source: 'AI_PROVIDER' | 'RULE_FALLBACK';
  warnings: string[];
  requiresReview: boolean;
  processingTimeMs: number;
  completedAt: string;
};

export type AssetMaintenanceMetrics = {
  assetId: string;
  assetName: string;
  assetCategory: string;
  lastMaintenanceDate?: string;
  breakdownCount: number;
  totalDowntimeHours: number;
  amcExpiryDate?: string;
  amcVendor?: string;
  avgResponseTimeHours?: number;
  complianceStatus: 'COMPLIANT' | 'NON_COMPLIANT' | 'PENDING';
  inspectionDueDate?: string;
};

export function calculateRiskScore(metrics: AssetMaintenanceMetrics): {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  riskScore: number;
  factors: Array<{ factor: string; value: unknown; weight: number; description: string }>;
} {
  let score = 0;
  const factors: Array<{ factor: string; value: unknown; weight: number; description: string }> = [];

  if (metrics.breakdownCount > 0) {
    const breakdownScore = Math.min(metrics.breakdownCount * 15, 40);
    score += breakdownScore;
    factors.push({
      factor: 'breakdownCount',
      value: metrics.breakdownCount,
      weight: 15,
      description: `${metrics.breakdownCount} breakdown(s) recorded`,
    });
  }

  if (metrics.totalDowntimeHours > 0) {
    const downtimeScore = Math.min(metrics.totalDowntimeHours * 2, 30);
    score += downtimeScore;
    factors.push({
      factor: 'totalDowntimeHours',
      value: metrics.totalDowntimeHours,
      weight: 10,
      description: `${metrics.totalDowntimeHours} hours total downtime`,
    });
  }

  if (metrics.amcExpiryDate) {
    const daysToExpiry = Math.ceil((new Date(metrics.amcExpiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysToExpiry < 0) {
      score += 25;
      factors.push({
        factor: 'amcExpired',
        value: true,
        weight: 25,
        description: 'AMC has expired',
      });
    } else if (daysToExpiry <= 30) {
      score += 15;
      factors.push({
        factor: 'amcExpiringSoon',
        value: daysToExpiry,
        weight: 15,
        description: `AMC expires in ${daysToExpiry} days`,
      });
    }
  }

  if (metrics.complianceStatus === 'NON_COMPLIANT') {
    score += 20;
    factors.push({
      factor: 'complianceStatus',
      value: 'NON_COMPLIANT',
      weight: 20,
      description: 'Asset is non-compliant',
    });
  } else if (metrics.complianceStatus === 'PENDING') {
    score += 10;
    factors.push({
      factor: 'complianceStatus',
      value: 'PENDING',
      weight: 10,
      description: 'Compliance status is pending',
    });
  }

  if (metrics.inspectionDueDate) {
    const daysToInspection = Math.ceil((new Date(metrics.inspectionDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysToInspection < 0) {
      score += 20;
      factors.push({
        factor: 'inspectionOverdue',
        value: true,
        weight: 20,
        description: 'Inspection is overdue',
      });
    } else if (daysToInspection <= 7) {
      score += 10;
      factors.push({
        factor: 'inspectionDueSoon',
        value: daysToInspection,
        weight: 10,
        description: `Inspection due in ${daysToInspection} days`,
      });
    }
  }

  if (metrics.avgResponseTimeHours && metrics.avgResponseTimeHours > 4) {
    score += 10;
    factors.push({
      factor: 'slowResponseTime',
      value: metrics.avgResponseTimeHours,
      weight: 10,
      description: `Average response time: ${metrics.avgResponseTimeHours} hours`,
    });
  }

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
  if (score >= 70) riskLevel = 'CRITICAL';
  else if (score >= 50) riskLevel = 'HIGH';
  else if (score >= 30) riskLevel = 'MEDIUM';

  return { riskLevel, riskScore: Math.min(score, 100), factors };
}

export function getRiskRecommendations(riskLevel: string, factors: any[]): Array<{
  action: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  rationale: string;
}> {
  const recommendations: Array<{ action: string; priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'; rationale: string }> = [];

  if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
    recommendations.push({
      action: 'Schedule immediate inspection',
      priority: 'URGENT',
      rationale: 'High risk score indicates potential failure or safety issue',
    });
    recommendations.push({
      action: 'Review AMC status and renew if expired',
      priority: 'URGENT',
      rationale: 'Expired AMC leaves asset without vendor support',
    });
  }

  if (riskLevel === 'MEDIUM') {
    recommendations.push({
      action: 'Schedule preventive maintenance',
      priority: 'HIGH',
      rationale: 'Moderate risk factors suggest preventive action is needed',
    });
  }

  if (riskLevel === 'LOW') {
    recommendations.push({
      action: 'Continue routine monitoring',
      priority: 'LOW',
      rationale: 'Asset appears to be in good condition',
    });
  }

  for (const factor of factors) {
    if (factor.factor === 'amcExpired' || factor.factor === 'amcExpiringSoon') {
      recommendations.push({
        action: 'Renew AMC contract',
        priority: 'HIGH',
        rationale: 'AMC expiry leaves asset without vendor maintenance coverage',
      });
    }
    if (factor.factor === 'inspectionOverdue' || factor.factor === 'inspectionDueSoon') {
      recommendations.push({
        action: 'Schedule regulatory inspection',
        priority: 'HIGH',
        rationale: 'Overdue or upcoming inspection deadline',
      });
    }
    if (factor.factor === 'complianceStatus' && factor.value === 'NON_COMPLIANT') {
      recommendations.push({
        action: 'Address compliance gaps',
        priority: 'URGENT',
        rationale: 'Non-compliant asset may face regulatory penalties',
      });
    }
  }

  return recommendations;
}