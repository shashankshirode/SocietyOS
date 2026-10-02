import type { Absent } from '../../../../../shared/types/absence.types';
import type {
  DomainErrorCode,
  DomainValidationResult,
  DomainViolation,
  LifecycleActor,
  LifecycleScope,
} from '../types/primitives';

export function blocking(code: DomainErrorCode, field: string): DomainViolation {
  return { code, field, blocking: true };
}

export function advisory(code: DomainErrorCode, field: string): DomainViolation {
  return { code, field, blocking: false };
}

export function isAbsent(value: string | Absent): boolean {
  return value === undefined || value.trim().length === 0;
}

export function requireText(
  value: string | Absent,
  code: DomainErrorCode,
  field: string,
): readonly DomainViolation[] {
  return isAbsent(value) ? [blocking(code, field)] : [];
}

export function requireNonNegativeInteger(
  value: number,
  code: DomainErrorCode,
  field: string,
): readonly DomainViolation[] {
  if (!Number.isInteger(value) || value < 0) {
    return [blocking(code, field)];
  }
  return [];
}

export function requireBoolean(value: boolean, field: string): readonly DomainViolation[] {
  return value ? [] : [blocking('PRECONDITION_FAILED', field)];
}

export function toValidation(
  violations: readonly DomainViolation[],
): DomainValidationResult {
  const blockers = violations.filter((violation) => violation.blocking);
  const warnings = violations.filter((violation) => !violation.blocking);
  if (blockers.length === 0) {
    return { valid: true, warnings };
  }
  return { valid: false, violations, warnings };
}

export function violationsToList(
  violations: readonly DomainViolation[],
): readonly DomainViolation[] {
  return violations;
}

export function scopeMatchesActor(
  scope: LifecycleScope,
  actor: LifecycleActor,
  scopeWideActorTypes: readonly LifecycleActor['actorType'][],
): boolean {
  if (actor.societyId !== scope.societyId) {
    return false;
  }
  if (actor.unitId === undefined) {
    return true;
  }
  if (scopeWideActorTypes.includes(actor.actorType)) {
    return true;
  }
  return actor.unitId === scope.unitId;
}

export function isSameResidentScope(
  scope: LifecycleScope,
  actor: LifecycleActor,
): boolean {
  if (actor.onBehalfOfResidentId !== undefined) {
    return actor.onBehalfOfResidentId === scope.residentId;
  }
  return actor.unitId === scope.unitId;
}

export function actorTypeAllowed(
  actor: LifecycleActor,
  permitted: readonly LifecycleActor['actorType'][],
): boolean {
  return permitted.includes(actor.actorType);
}

export function firstViolation(
  violations: readonly DomainViolation[],
): DomainViolation | Absent {
  return violations.find((violation) => violation.blocking);
}

export function allViolations(
  groups: readonly (readonly DomainViolation[])[],
): readonly DomainViolation[] {
  const flattened: DomainViolation[] = [];
  for (const group of groups) {
    for (const violation of group) {
      flattened.push(violation);
    }
  }
  return flattened;
}
