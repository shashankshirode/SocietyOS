import type {
  ResidenceMembership,
  ResidenceAccessRequest,
  ResidenceAccessRequestResult,
  AccessReminderRequest,
  AccessReminderResult,
  WithdrawAccessRequest,
  ResidenceAccessTimelineEvent,
} from './membership.types';

export interface ResidenceMembershipRepository {
  getMemberships(
    signal?: AbortSignal,
  ): Promise<readonly ResidenceMembership[]>;

  getMembershipDetail(
    membershipId: string,
    signal?: AbortSignal,
  ): Promise<ResidenceMembership>;

  requestResidenceAccess(
    request: ResidenceAccessRequest,
    signal?: AbortSignal,
  ): Promise<ResidenceAccessRequestResult>;

  sendAccessReminder(
    membershipId: string,
    request: AccessReminderRequest,
    signal?: AbortSignal,
  ): Promise<AccessReminderResult>;

  withdrawAccessRequest(
    membershipId: string,
    request: WithdrawAccessRequest,
    signal?: AbortSignal,
  ): Promise<ResidenceMembership>;

  getAccessTimeline(
    membershipId: string,
    signal?: AbortSignal,
  ): Promise<readonly ResidenceAccessTimelineEvent[]>;
}
