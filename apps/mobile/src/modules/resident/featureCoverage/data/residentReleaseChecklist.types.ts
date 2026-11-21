import type { MessageKey } from '../../navigation/residentHeader.types';

export type ResidentReleaseCheckStatus = 'passed' | 'failed' | 'partial' | 'notApplicable';

export type ResidentReleaseRoleVariant =
  | 'RESIDENT_OWNER'
  | 'RESIDENT_TENANT'
  | 'RESIDENT_FAMILY';

export type ResidentReleaseCheckItem = {
  id: string;
  moduleKey: string;
  titleMessageKey: MessageKey;
  requiredScreens: string[];
  requiredRoutes: string[];
  requiredRepositoryMethods: string[];
  requiredMockDataKeys: string[];
  requiredMessageGroups: string[];
  requiredLoadingStates: string[];
  requiredModalKeys: string[];
  requiredFeatureFlags: string[];
  
  requiredRoleVariants: ('RESIDENT_OWNER' | 'RESIDENT_TENANT' | 'RESIDENT_FAMILY')[];
  requiredActions: string[];
  status: ResidentReleaseCheckStatus;
};

export type ResidentReleaseGap = {
  checkId: string;
  titleMessageKey: MessageKey;
  key: string;
};

export type ResidentReleaseStaticViolation = {
  id: string;
  source: string;
  count: number;
  messageKey: MessageKey;
};

export type ResidentReleaseReadinessSummary = {
  items: ResidentReleaseCheckItem[];
  total: number;
  passed: number;
  failed: number;
  partial: number;
  notApplicable: number;
  releaseScore: number;
  missingScreens: ResidentReleaseGap[];
  missingRoutes: ResidentReleaseGap[];
  missingActions: ResidentReleaseGap[];
  missingRepositoryMethods: ResidentReleaseGap[];
  missingMockDataKeys: ResidentReleaseGap[];
  missingMessageGroups: ResidentReleaseGap[];
  missingLoadingStates: ResidentReleaseGap[];
  missingModalKeys: ResidentReleaseGap[];
  missingRoleVariants: ResidentReleaseGap[];
  missingFeatureFlags: ResidentReleaseGap[];
  centralizedDataSourceViolations: ResidentReleaseStaticViolation[];
  hardcodedStringViolations: ResidentReleaseStaticViolation[];
  forbiddenTypeViolations: ResidentReleaseStaticViolation[];
  blockingIssueCount: number;
};
