import { planAccessTransition } from '../domain/engines/accessTransitionEngine';
import type { AccessPlan } from '../domain/engines/accessTransitionEngine';
import type { AccessTransitionRequest } from '../domain/types/access.types';
import type { IntegrationStatus } from '../domain/types/primitives';
import { isActivationIntent } from '../domain/engines/accessTransitionEngine';
import { auditService } from '../../../../core/audit/auditService';
import { toAuditEntry } from './phase8Audit';

export type AccessTransitionOutcome =
  | {
      readonly ok: true;
      readonly plan: AccessPlan;
      readonly requiresCompensation: boolean;
      readonly requiresHumanFollowUp: boolean;
    }
  | {
      readonly ok: false;
      readonly reason: 'NOT_ADMITTED';
      readonly plan: AccessPlan;
    };

export type AccessService = {
  readonly planTransition: (
    request: AccessTransitionRequest,
    integrationStatus: IntegrationStatus,
    liveSessionIds: readonly string[],
    gateMappingIds: readonly string[],
  ) => AccessTransitionOutcome;
};

function requiresCompensationFor(plan: AccessPlan): boolean {
  return (
    plan.status === 'COMPENSATION_REQUIRED' || plan.status === 'FAILED'
  );
}

export function createAccessService(): AccessService {
  return {
    planTransition: (request, integrationStatus, liveSessionIds, gateMappingIds) => {
      const plan = planAccessTransition(request, integrationStatus, liveSessionIds, gateMappingIds);
      const activation = isActivationIntent(request.intent);
      const compensated = requiresCompensationFor(plan);

      auditService.log(
        toAuditEntry({
          eventType:
            activation && !compensated ? 'ACCESS_ACTIVATED' : 'ACCESS_REVOCATION_FAILED',
          action: activation ? 'CREATE' : 'REVERSE',
          entityType: 'ACCESS_TRANSITION',
          entityId: request.transitionId,
          actor: request.requestedBy,
          societyId: request.societyId,
          unitId: request.unitId,
          idempotencyKey: request.idempotencyKey,
          reason: plan.failureCode,
          previousState:
            request.residenceAccessStatusBefore === undefined
              ? undefined
              : { status: request.residenceAccessStatusBefore },
          newState: { status: plan.status, integrationStatus: plan.integrationStatus },
          outcome: plan.status === 'SUCCEEDED' ? 'SUCCESS' : compensated ? 'PARTIAL' : 'FAILURE',
          error: plan.failureCode === undefined
            ? undefined
            : { code: plan.failureCode, message: `access transition ${plan.status}` },
        }),
      );

      if (!plan.admitted.permitted) {
        return { ok: false, reason: 'NOT_ADMITTED', plan };
      }

      return {
        ok: true,
        plan,
        requiresCompensation: compensated,
        requiresHumanFollowUp: plan.integrationStatus !== 'INTEGRATED' || compensated,
      };
    },
  };
}
