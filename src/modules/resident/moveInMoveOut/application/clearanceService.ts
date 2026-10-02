import { evaluateClearance } from '../domain/engines/clearanceEngine';
import type {
  ClearanceEvaluation,
  ClearanceEvaluationInput,
} from '../domain/types/clearance.types';
import type { DomainViolation } from '../domain/types/primitives';
import { auditService } from '../../../../core/audit/auditService';
import { toAuditEntry, violationsToAuditError } from './phase8Audit';
import type { LifecycleActor } from '../domain/types/primitives';

export type ClearanceServiceOutcome =
  | {
      readonly ok: true;
      readonly evaluation: ClearanceEvaluation;
      readonly warnings: readonly DomainViolation[];
    }
  | {
      readonly ok: false;
      readonly reason: 'CLEARANCE_BLOCKED' | 'AUDIT_FAILED';
      readonly violations: readonly DomainViolation[];
    };

export type ClearanceService = {
  readonly evaluate: (
    input: ClearanceEvaluationInput,
    actor: LifecycleActor,
  ) => ClearanceServiceOutcome;
};

export function createClearanceService(): ClearanceService {
  return {
    evaluate: (input, actor) => {
      const evaluation = evaluateClearance(input);
      const blocking = evaluation.violations.filter((violation) => violation.blocking);
      const usedOverride = evaluation.snapshot.overrides.length > 0;

      const entry = toAuditEntry({
        eventType: usedOverride ? 'MOVE_OUT_CLEARANCE_OVERRIDDEN' : 'MOVE_OUT_CLEARANCE_EVALUATED',
        action: usedOverride ? 'OVERRIDE' : 'VERIFY',
        entityType: 'CLEARANCE_SNAPSHOT',
        entityId: input.moveOutRequestId,
        actor,
        societyId: actor.societyId,
        unitId: actor.unitId,
        idempotencyKey: undefined,
        reason: blocking[0]?.field,
        previousState: undefined,
        newState: { outcome: evaluation.outcome, snapshotId: evaluation.snapshot.snapshotId },
        outcome: evaluation.outcome === 'READY' ? 'SUCCESS' : 'FAILURE',
        error: violationsToAuditError(evaluation.violations),
      });

      auditService.log(entry);

      if (blocking.length > 0) {
        return { ok: false, reason: 'CLEARANCE_BLOCKED', violations: evaluation.violations };
      }

      return { ok: true, evaluation, warnings: evaluation.violations };
    },
  };
}
