import type { PrerequisiteCheck, PrerequisiteSeverity } from './prerequisite.types';

export function resolvePrerequisiteSeverity(status: PrerequisiteCheck['status']): PrerequisiteSeverity {
  if (status === 'restricted') {
    return 'restricted';
  }

  if (status === 'blocked') {
    return 'blocking';
  }

  if (status === 'missing') {
    return 'warning';
  }

  return 'info';
}

export function isBlockingPrerequisite(check: PrerequisiteCheck): boolean {
  return check.status === 'blocked' || check.status === 'restricted' || check.severity === 'blocking' || check.severity === 'restricted';
}
