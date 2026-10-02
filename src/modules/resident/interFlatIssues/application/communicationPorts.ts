import type { Absent } from '../../../../shared/types/absence.types';

export type DisputeThreadParticipant = {
  readonly userId: string;
  readonly role: 'REPORTER' | 'RESPONDENT' | 'AFFECTED_PARTY' | 'MEDIATOR' | 'COMMITTEE';
  readonly consentedAt: string | Absent;
};

export type DisputeThread = {
  readonly threadId: string;
  readonly caseId: string;
  readonly societyId: string;
  readonly participants: readonly DisputeThreadParticipant[];
  readonly createdAt: string;
  readonly channelState: 'PENDING_CONSENT' | 'OPEN' | 'CLOSED';
  readonly closeReason: string | Absent;
};

export type CommunicationThreadPort = {
  readonly provider: string;
  readonly openThread: (thread: DisputeThread) => boolean;
  readonly read: (threadId: string) => DisputeThread | Absent;
  readonly close: (threadId: string, reason: string) => boolean;
  readonly isAvailable: () => boolean;
};

export const UNAVAILABLE_COMMUNICATION_THREADS: CommunicationThreadPort = {
  provider: 'controlled-communication',
  isAvailable: () => false,
  openThread: () => false,
  read: () => undefined,
  close: () => false,
};
