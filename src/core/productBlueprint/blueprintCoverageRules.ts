export type BlueprintCoverageIssueType =
  | 'MISSING_FEATURE_FLAG'
  | 'MISSING_PERMISSION'
  | 'MISSING_ROUTE'
  | 'MISSING_SCREEN'
  | 'MISSING_HOOK'
  | 'MISSING_REPOSITORY_METHOD'
  | 'MISSING_MOCK_DATA'
  | 'MISSING_ACTION'
  | 'MISSING_DASHBOARD_ENTRY'
  | 'MISSING_TEST'
  | 'PARTIAL_FEATURE';

export type BlueprintCoverageIssue = {
  featureId: string;
  featureTitle: string;
  issueType: BlueprintCoverageIssueType;
  message: string;
  severity: 'BLOCKER' | 'HIGH' | 'MEDIUM' | 'LOW';
};

export type BlueprintCoverageSummary = {
  totalFeatures: number;
  implemented: number;
  partial: number;
  missing: number;
  backendRequired: number;
  integrationRequired: number;
  blockerIssues: number;
  issues: BlueprintCoverageIssue[];
};
