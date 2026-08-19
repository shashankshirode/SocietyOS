
export interface GovernanceGeneratedRecord {
  id: string;
  name?: string;
  status?: string;
}

export type createMeetingNoticeRecord = GovernanceGeneratedRecord;
export type AgendaItemsRecord = GovernanceGeneratedRecord;
export type submitMeetingRsvpRecord = GovernanceGeneratedRecord;
export type submitProxyAuthorizationRecord = GovernanceGeneratedRecord;
export type submitMeetingQuestionRecord = GovernanceGeneratedRecord;
export type createMinutesOfMeetingRecord = GovernanceGeneratedRecord;
export type ResolutionsRecord = GovernanceGeneratedRecord;
export type createPollRecord = GovernanceGeneratedRecord;
export type submitPollVoteRecord = GovernanceGeneratedRecord;
export type ElectionReadinessStatusRecord = GovernanceGeneratedRecord;
