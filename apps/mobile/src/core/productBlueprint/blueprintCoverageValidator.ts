import type { BlueprintFeature } from './blueprintFeature.types';
import type { BlueprintCoverageSummary, BlueprintCoverageIssue } from './blueprintCoverageRules';

export function validateBlueprintFeature(feature: BlueprintFeature): BlueprintCoverageIssue[] {
  const issues: BlueprintCoverageIssue[] = [];

  
  if (!feature.featureFlag) {
    issues.push({
      featureId: feature.id,
      featureTitle: feature.title,
      issueType: 'MISSING_FEATURE_FLAG',
      message: `Feature '${feature.title}' is missing a feature flag definition.`,
      severity: 'HIGH',
    });
  }

  
  if (feature.roles.length > 0 && feature.permissions.length === 0) {
    issues.push({
      featureId: feature.id,
      featureTitle: feature.title,
      issueType: 'MISSING_PERMISSION',
      message: `Feature '${feature.title}' requires roles but specifies no permission keys.`,
      severity: 'MEDIUM',
    });
  }

  
  if (feature.status === 'IMPLEMENTED' || feature.status === 'PARTIAL' || feature.status.startsWith('FRONTEND_READY')) {
    if (feature.routeNames.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_ROUTE',
        message: `Feature '${feature.title}' is marked ready/implemented but has no routeNames defined.`,
        severity: 'BLOCKER',
      });
    }
    if (feature.screenNames.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_SCREEN',
        message: `Feature '${feature.title}' is marked ready/implemented but has no screenNames defined.`,
        severity: 'BLOCKER',
      });
    }
    if (feature.hookNames.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_HOOK',
        message: `Feature '${feature.title}' is missing react hook references.`,
        severity: 'HIGH',
      });
    }
    if (feature.repositoryMethods.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_REPOSITORY_METHOD',
        message: `Feature '${feature.title}' is missing repository methods.`,
        severity: 'HIGH',
      });
    }
    if (feature.mockDataKeys.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_MOCK_DATA',
        message: `Feature '${feature.title}' is missing mock data keys.`,
        severity: 'MEDIUM',
      });
    }
    if (feature.requiredActions.length === 0) {
      issues.push({
        featureId: feature.id,
        featureTitle: feature.title,
        issueType: 'MISSING_ACTION',
        message: `Feature '${feature.title}' has no interactive user actions registered.`,
        severity: 'HIGH',
      });
    }
  }

  
  if (feature.status === 'MISSING') {
    issues.push({
      featureId: feature.id,
      featureTitle: feature.title,
      issueType: 'PARTIAL_FEATURE',
      message: `Feature '${feature.title}' is completely missing from frontend code.`,
      severity: 'BLOCKER',
    });
  }

  return issues;
}

export function blueprintCoverageValidator(features: BlueprintFeature[]): BlueprintCoverageSummary {
  let implemented = 0;
  let partial = 0;
  let missing = 0;
  let backendRequired = 0;
  let integrationRequired = 0;
  let blockerIssues = 0;
  const issues: BlueprintCoverageIssue[] = [];

  features.forEach((feature) => {
    switch (feature.status) {
      case 'IMPLEMENTED':
        implemented++;
        break;
      case 'PARTIAL':
        partial++;
        break;
      case 'MISSING':
        missing++;
        break;
      case 'FRONTEND_READY_BACKEND_REQUIRED':
        backendRequired++;
        break;
      case 'FRONTEND_READY_INTEGRATION_REQUIRED':
        integrationRequired++;
        break;
    }

    const featureIssues = validateBlueprintFeature(feature);
    issues.push(...featureIssues);
  });

  blockerIssues = issues.filter((issue) => issue.severity === 'BLOCKER').length;

  return {
    totalFeatures: features.length,
    implemented,
    partial,
    missing,
    backendRequired,
    integrationRequired,
    blockerIssues,
    issues,
  };
}
