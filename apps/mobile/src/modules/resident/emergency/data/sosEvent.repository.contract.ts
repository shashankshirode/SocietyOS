import type { Absent } from '../../../../shared/types/absence.types';
import type {
  SosEvent,
  SosResidenceContext,
  SosResolvedRecipient,
  SosType,
} from './sosResponsePlan.types';

export interface TriggerSosInput {
  readonly context: SosResidenceContext;
  readonly sosType: SosType;
  readonly triggeredByUserId: string;
  readonly triggeredByUserName: string;
  readonly note?: string;
  readonly isTestMode: boolean;
  readonly resolvedRecipients: SosResolvedRecipient[];
}

export interface SosEventRepositoryContract {
  triggerSos(input: TriggerSosInput): Promise<SosEvent>;
  getActiveSosEvent(context: SosResidenceContext): Promise<SosEvent | Absent>;
  getSosEvent(eventId: string): Promise<SosEvent | Absent>;
  acknowledgeSos(eventId: string, recipientId: string): Promise<SosEvent>;
  cancelSos(eventId: string, reason: string): Promise<SosEvent>;
  resolveSos(eventId: string): Promise<SosEvent>;
  getSosHistory(context: SosResidenceContext): Promise<SosEvent[]>;
}
