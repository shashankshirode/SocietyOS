import {
  residentReleaseCentralizedDataSourceViolations,
  residentReleaseChecklist,
  residentReleaseForbiddenTypeViolations,
  residentReleaseHardcodedStringViolations,
} from './residentReleaseChecklist';
import type {
  ResidentReleaseCheckItem,
  ResidentReleaseGap,
  ResidentReleaseReadinessSummary,
} from './residentReleaseChecklist.types';

function missingValues(
  item: ResidentReleaseCheckItem,
  values: string[]
): ResidentReleaseGap[] {
  return values
    .filter((value) => value.trim().length === 0)
    .map((key) => ({
      checkId: item.id,
      titleMessageKey: item.titleMessageKey,
      key,
    }));
}

export function validateResidentReleaseReadiness(
  items: ResidentReleaseCheckItem[] = residentReleaseChecklist
): ResidentReleaseReadinessSummary {
  const total = items.length;
  const passed = items.filter((item) => item.status === 'passed').length;
  const failed = items.filter((item) => item.status === 'failed').length;
  const partial = items.filter((item) => item.status === 'partial').length;
  const notApplicable = items.filter((item) => item.status === 'notApplicable').length;
  const releaseBlockingTotal = Math.max(total - notApplicable, 0);
  const releaseScore = releaseBlockingTotal > 0
    ? Math.round((passed / releaseBlockingTotal) * 100)
    : 100;

  const missingScreens = items.flatMap((item) => missingValues(item, item.requiredScreens));
  const missingRoutes = items.flatMap((item) => missingValues(item, item.requiredRoutes));
  const missingActions = items.flatMap((item) => missingValues(item, item.requiredActions));
  const missingRepositoryMethods = items.flatMap((item) => missingValues(item, item.requiredRepositoryMethods));
  const missingMockDataKeys = items.flatMap((item) => missingValues(item, item.requiredMockDataKeys));
  const missingMessageGroups = items.flatMap((item) => missingValues(item, item.requiredMessageGroups));
  const missingLoadingStates = items.flatMap((item) => missingValues(item, item.requiredLoadingStates));
  const missingModalKeys = items.flatMap((item) => missingValues(item, item.requiredModalKeys));
  const missingRoleVariants = items.flatMap((item) => missingValues(item, item.requiredRoleVariants));
  const missingFeatureFlags = items.flatMap((item) => missingValues(item, item.requiredFeatureFlags));

  const blockingIssueCount =
    failed +
    partial +
    missingScreens.length +
    missingRoutes.length +
    missingActions.length +
    missingRepositoryMethods.length +
    missingMockDataKeys.length +
    missingMessageGroups.length +
    missingLoadingStates.length +
    missingModalKeys.length +
    missingRoleVariants.length +
    missingFeatureFlags.length +
    residentReleaseCentralizedDataSourceViolations.length +
    residentReleaseHardcodedStringViolations.length +
    residentReleaseForbiddenTypeViolations.length;

  return {
    items,
    total,
    passed,
    failed,
    partial,
    notApplicable,
    releaseScore,
    missingScreens,
    missingRoutes,
    missingActions,
    missingRepositoryMethods,
    missingMockDataKeys,
    missingMessageGroups,
    missingLoadingStates,
    missingModalKeys,
    missingRoleVariants,
    missingFeatureFlags,
    centralizedDataSourceViolations: residentReleaseCentralizedDataSourceViolations,
    hardcodedStringViolations: residentReleaseHardcodedStringViolations,
    forbiddenTypeViolations: residentReleaseForbiddenTypeViolations,
    blockingIssueCount,
  };
}

