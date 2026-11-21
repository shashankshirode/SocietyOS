import type { PrerequisiteEvaluationResult } from './prerequisite.types';

export function getPrimaryPrerequisiteMessageKey(result: PrerequisiteEvaluationResult): string {
  const primary = result.blockingChecks[0] ?? result.warningChecks[0] ?? result.checks[0];
  return primary?.titleMessageKey ?? 'resident.prerequisites.stateTitle';
}

export function getPrimaryPrerequisiteDescriptionKey(result: PrerequisiteEvaluationResult): string {
  const primary = result.blockingChecks[0] ?? result.warningChecks[0] ?? result.checks[0];
  return primary?.descriptionMessageKey ?? 'resident.prerequisites.stateDescription';
}
