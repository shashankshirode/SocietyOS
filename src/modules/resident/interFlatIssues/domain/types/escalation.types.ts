import type { Absent } from '../../../../../shared/types/absence.types';

export type EscalationLevel = 'COMMITTEE' | 'MANAGEMENT' | 'EXTERNAL_ADVISOR';

export type EscalationTarget = {
  readonly level: EscalationLevel;
  readonly targetLabel: string;
  readonly contactRole: string;
  readonly requiresReason: boolean;
};

export type Escalation = {
  readonly id: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly escalatedByUserId: string;
  readonly reason: string;
  readonly level: EscalationLevel;
  readonly target: EscalationTarget;
  readonly actionTaken: string | Absent;
  readonly assignedToUserId: string | Absent;
  readonly createdAt: string;
  readonly acknowledgedAt: string | Absent;
  readonly resolvedAt: string | Absent;
};

export type EscalationDecision = {
  readonly acceptEscalation: boolean;
  readonly actionTaken: string | Absent;
  readonly assignedToUserId: string | Absent;
};

export function minimumEscalationReason(reason: string): string {
  return reason.trim().length >= 10 ? reason.trim() : `${reason.trim()} (insufficient detail)`;
}
