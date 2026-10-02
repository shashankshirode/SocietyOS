import { hasPermission } from '../../../../core/permissions/rolePermissionMap';
import type { AppRole, Permission } from '../../../../core/permissions/permission.types';
import type { Absent } from '../../../../shared/types/absence.types';
import type {
  ActionPermissionRule,
  CommunicationAction,
  CommunicationClock,
  CommunicationDecision,
  CommunicationViolation,
} from '../types';
import { allowedWith, denied, violation } from '../types';
import type {
  ChannelRecord,
  ChannelMembershipRecord,
  ContactRequestRecord,
  MessageRecord,
} from '../types';
import type {
  ModerationAccessGrant,
  ModerationCase,
  ResidentBlock,
  ResidentDirectoryEntry,
  ResidentPrivacySettings,
} from '../types';
import type { NoticeRecord } from '../types';

const ACTION_PERMISSIONS: readonly ActionPermissionRule[] = [
  { action: 'DIRECTORY_SEARCH', permissions: ['RESIDENT_DIRECTORY_VIEW'], anyOf: true },
  { action: 'DIRECTORY_VIEW_PROFILE', permissions: ['RESIDENT_DIRECTORY_VIEW'], anyOf: true },
  { action: 'SEND_CONTACT_REQUEST', permissions: ['RESIDENT_CONNECT_REQUEST'], anyOf: false },
  { action: 'RESPOND_CONTACT_REQUEST', permissions: ['RESIDENT_CONNECT_REQUEST'], anyOf: false },
  { action: 'OPEN_PRIVATE_CHANNEL', permissions: ['RESIDENT_CHAT'], anyOf: false },
  { action: 'SEND_MESSAGE', permissions: ['RESIDENT_CHAT'], anyOf: false },
  { action: 'READ_MESSAGE', permissions: ['RESIDENT_CHAT'], anyOf: false },
  { action: 'BLOCK_RESIDENT', permissions: ['RESIDENT_CONNECT_REQUEST'], anyOf: false },
  { action: 'REPORT_CONTENT', permissions: ['RESIDENT_CHAT'], anyOf: false },
  { action: 'VIEW_REPORTED_MESSAGE', permissions: ['RESIDENT_CHAT_MODERATE_REPORTED'], anyOf: false },
  { action: 'MODERATE_REPORT', permissions: ['RESIDENT_CHAT_MODERATE_REPORTED'], anyOf: false },
  { action: 'VIEW_MODERATION_AUDIT', permissions: ['RESIDENT_CHAT_MODERATE_REPORTED'], anyOf: false },
  { action: 'CREATE_NOTICE', permissions: ['NOTICE_CREATE'], anyOf: false },
  { action: 'PUBLISH_NOTICE', permissions: ['NOTICE_PUBLISH'], anyOf: false },
  { action: 'SCHEDULE_NOTICE', permissions: ['NOTICE_SCHEDULE'], anyOf: false },
  { action: 'WITHDRAW_NOTICE', permissions: ['NOTICE_WITHDRAW'], anyOf: false },
  { action: 'ACKNOWLEDGE_NOTICE', permissions: ['NOTICE_ACKNOWLEDGE'], anyOf: false },
  { action: 'VIEW_NOTICE_DELIVERY_REPORT', permissions: ['NOTICE_DELIVERY_REPORT_VIEW'], anyOf: false },
  { action: 'MANAGE_CONTROLLED_GROUP', permissions: ['RESIDENT_CHAT_GROUP_MANAGE'], anyOf: false },
  { action: 'MANAGE_DEPARTMENT_CHANNEL', permissions: ['CHAT_CHANNEL_MANAGE_CONFIGURATION'], anyOf: false },
];

const MODERATOR_ROLES: readonly AppRole[] = [
  'SOCIETY_ADMIN',
  'CHAIRPERSON',
  'SECRETARY',
  'COMMITTEE_MEMBER',
  'SUPER_ADMIN',
  'AUDITOR',
];

const COMMITTEE_ROLES: readonly AppRole[] = [
  'SOCIETY_ADMIN',
  'CHAIRPERSON',
  'SECRETARY',
  'TREASURER',
  'COMMITTEE_MEMBER',
  'SUPER_ADMIN',
];

export function permissionRuleFor(
  action: CommunicationAction,
): ActionPermissionRule | Absent {
  return ACTION_PERMISSIONS.find((rule) => rule.action === action);
}

export function evaluateActionPermission(
  actorRole: AppRole,
  action: CommunicationAction,
): CommunicationDecision {
  const rule = permissionRuleFor(action);
  if (rule === undefined) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `No permission rule is defined for action ${action}; the request fails closed.`,
      ),
    ]);
  }
  const results = rule.permissions.map((permission: Permission) =>
    hasPermission([actorRole], permission),
  );
  const satisfied = rule.anyOf ? results.some(Boolean) : results.every(Boolean);
  if (!satisfied) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHORIZED',
        `action.${action}`,
        `Role ${actorRole} does not hold the required permission for ${action}.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function isModeratorRole(actorRole: AppRole): boolean {
  return MODERATOR_ROLES.includes(actorRole);
}

export function isCommitteeRole(actorRole: AppRole): boolean {
  return COMMITTEE_ROLES.includes(actorRole);
}

export function evaluateTenantBoundary(
  actorSocietyId: string,
  subjectSocietyId: string,
): CommunicationDecision {
  if (actorSocietyId !== subjectSocietyId) {
    return denied([
      violation(
        'CROSS_SOCIETY_BLOCKED',
        'scope.societyId',
        'The subject belongs to a different society.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateSessionFreshness(
  actorAuthenticatedAt: string,
  clock: CommunicationClock,
  maximumSessionAgeMs: number,
): CommunicationDecision {
  if (actorAuthenticatedAt.trim().length === 0) {
    return denied([
      violation(
        'ACTOR_NOT_AUTHENTICATED',
        'actor.authenticatedAt',
        'No authenticated session is bound to the request.',
      ),
    ]);
  }
  const nowMs = clock.now().getTime();
  const authenticatedAtMs = Date.parse(actorAuthenticatedAt);
  if (Number.isNaN(authenticatedAtMs)) {
    return denied([
      violation(
        'ACTOR_SESSION_STALE',
        'actor.authenticatedAt',
        'The bound session timestamp is not a valid instant.',
      ),
    ]);
  }
  if (authenticatedAtMs > nowMs) {
    return denied([
      violation(
        'ACTOR_SESSION_STALE',
        'actor.authenticatedAt',
        'The bound session timestamp is in the future.',
      ),
    ]);
  }
  if (nowMs - authenticatedAtMs > maximumSessionAgeMs) {
    return denied([
      violation(
        'ACTOR_SESSION_STALE',
        'actor.authenticatedAt',
        'The bound session is no longer fresh; re-authentication is required.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateOccupancyEligible(
  entry: ResidentDirectoryEntry,
  includeFormer: boolean,
): CommunicationDecision {
  if (entry.isSelf) {
    return denied([
      violation(
        'SELF_CONTACT_BLOCKED',
        'directoryEntry.isSelf',
        'A resident cannot open a first-contact request with themselves.',
      ),
    ]);
  }
  if (entry.occupancyStatus === 'ACTIVE') {
    return allowedWith([]);
  }
  if (includeFormer && entry.occupancyStatus === 'MOVED_OUT') {
    return allowedWith([
      {
        code: 'HISTORICAL_PRIVACY_BLOCKED',
        field: 'directoryEntry.occupancyStatus',
        blocking: false,
        detail: 'The target is a former resident and only historical records are reachable.',
      },
    ]);
  }
  return denied([
    violation(
      'INACTIVE_RESIDENT_BLOCKED',
      'directoryEntry.occupancyStatus',
      `Occupancy status ${entry.occupancyStatus} cannot be contacted through the directory.`,
    ),
  ]);
}

export function evaluateDirectoryVisibility(
  viewer: ResidentDirectoryEntry,
  viewerUserId: string,
  viewerRole: AppRole,
  subject: ResidentDirectoryEntry,
  subjectPrivacy: ResidentPrivacySettings,
): CommunicationDecision {
  if (subject.isSelf || viewerUserId === subject.userId) {
    return allowedWith([]);
  }
  if (subject.occupancyStatus !== 'ACTIVE' && subject.occupancyStatus !== 'MOVED_OUT') {
    return denied([
      violation(
        'INACTIVE_RESIDENT_BLOCKED',
        'directoryEntry.occupancyStatus',
        'Only active or historical residents may appear in directory results.',
      ),
    ]);
  }
  if (subject.occupancyStatus === 'MOVED_OUT') {
    return denied([
      violation(
        'HISTORICAL_PRIVACY_BLOCKED',
        'directoryEntry.occupancyStatus',
        'Former residents are excluded from directory search results.',
      ),
    ]);
  }
  if (subject.isBlocked) {
    return denied([
      violation(
        'BLOCKED_RESIDENT_BLOCKED',
        'directoryEntry.isBlocked',
        'A block relationship exists between these residents.',
      ),
    ]);
  }
  if (subjectPrivacy.allowDirectoryListing === false) {
    return denied([
      violation(
        'DIRECTORY_VISIBILITY_BLOCKED',
        'privacy.allowDirectoryListing',
        'The resident has opted out of the resident directory.',
      ),
    ]);
  }
  if (isCommitteeRole(viewerRole) && subjectPrivacy.allowCommitteeContact) {
    return allowedWith([]);
  }
  if (subjectPrivacy.sameTowerOnly && !isCommitteeRole(viewerRole)) {
    const viewerTower = viewer.towerOrWing;
    if (viewerTower.length > 0 && viewerTower !== subject.towerOrWing) {
      return denied([
        violation(
          'PRIVACY_OPT_OUT_BLOCKED',
          'privacy.sameTowerOnly',
          'The resident accepts first contact from their own tower only.',
        ),
      ]);
    }
  }
  if (subject.visibilityStatus === 'HIDDEN') {
    return denied([
      violation(
        'PRIVACY_OPT_OUT_BLOCKED',
        'directoryEntry.visibilityStatus',
        'The resident is hidden from directory discovery.',
      ),
    ]);
  }
  if (subject.visibilityStatus === 'RESTRICTED') {
    if (isCommitteeRole(viewerRole)) {
      return allowedWith([
        {
          code: 'HISTORICAL_PRIVACY_BLOCKED',
          field: 'directoryEntry.visibilityStatus',
          blocking: false,
          detail: 'The resident restricts discovery to committee roles; a first-contact request is still required.',
        },
      ]);
    }
    return denied([
      violation(
        'PRIVACY_OPT_OUT_BLOCKED',
        'directoryEntry.visibilityStatus',
        'The resident restricts directory discovery to approved requesters.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateContactPermission(
  viewerUserId: string,
  subject: ResidentDirectoryEntry,
  subjectPrivacy: ResidentPrivacySettings,
): CommunicationDecision {
  if (subject.userId === viewerUserId) {
    return denied([
      violation(
        'SELF_CONTACT_BLOCKED',
        'contactRequest.recipientUserId',
        'A resident cannot send a first-contact request to themselves.',
      ),
    ]);
  }
  if (subject.occupancyStatus !== 'ACTIVE') {
    return denied([
      violation(
        'INACTIVE_RESIDENT_BLOCKED',
        'contactRequest.recipientResidentProfileId',
        'Only currently active residents can receive first-contact requests.',
      ),
    ]);
  }
  if (subject.isBlocked) {
    return denied([
      violation(
        'BLOCKED_RESIDENT_BLOCKED',
        'contactRequest.recipientResidentProfileId',
        'A block relationship exists; contact is not permitted.',
      ),
    ]);
  }
  if (subjectPrivacy.allowFirstContact === false) {
    return denied([
      violation(
        'CONTACT_NOT_PERMITTED',
        'privacy.allowFirstContact',
        'The resident does not accept new first-contact requests.',
      ),
    ]);
  }
  if (subject.contactRequestsAllowed === false) {
    return denied([
      violation(
        'CONTACT_NOT_PERMITTED',
        'directoryEntry.contactRequestsAllowed',
        'The resident is not accepting first-contact requests.',
      ),
    ]);
  }
  if (subject.isFormerResident) {
    return denied([
      violation(
        'HISTORICAL_PRIVACY_BLOCKED',
        'directoryEntry.isFormerResident',
        'Former residents cannot receive new first-contact requests.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateBlockDirection(
  block: ResidentBlock,
  viewerUserId: string,
  subjectUserId: string,
): CommunicationDecision {
  if (block.blockedUserId === viewerUserId && block.blockingUserId === subjectUserId) {
    return denied([
      violation(
        'BLOCKED_RESIDENT_BLOCKED',
        'block.blockedUserId',
        'The viewer blocked this resident.',
      ),
    ]);
  }
  if (block.blockingUserId === viewerUserId && block.blockedUserId === subjectUserId) {
    return denied([
      violation(
        'BLOCKED_RESIDENT_BLOCKED',
        'block.blockingUserId',
        'This resident blocked the viewer.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function isPairAlreadyConnected(
  channel: ChannelRecord,
  requesterResidentProfileId: string,
  recipientResidentProfileId: string,
  memberships: readonly ChannelMembershipRecord[],
): boolean {
  if (channel.kind !== 'PRIVATE_DIRECT' || channel.status === 'CLOSED') {
    return false;
  }
  const activeProfileIds = new Set(
    memberships
      .filter(
        (membership) =>
          membership.channelId === channel.id && membership.status === 'ACTIVE',
      )
      .map((membership) => membership.residentProfileId)
      .filter((value): value is string => typeof value === 'string' && value.length > 0),
  );
  return (
    activeProfileIds.has(requesterResidentProfileId) &&
    activeProfileIds.has(recipientResidentProfileId)
  );
}

export function evaluateChannelMembership(
  actorUserId: string,
  channel: ChannelRecord,
  membership: ChannelMembershipRecord | Absent,
): CommunicationDecision {
  if (channel.status !== 'ACTIVE') {
    return denied([
      violation(
        'CHANNEL_NOT_ACTIVE',
        'channel.status',
        `Channel ${channel.id} is ${channel.status} and is not accepting traffic.`,
      ),
    ]);
  }
  if (membership === undefined) {
    return denied([
      violation(
        'CHANNEL_MEMBERSHIP_REQUIRED',
        'channelMembership',
        'The actor holds no membership on this channel.',
      ),
    ]);
  }
  if (membership.userId !== actorUserId) {
    return denied([
      violation(
        'IDOR_BLOCKED',
        'channelMembership.userId',
        'The membership record belongs to a different user.',
      ),
    ]);
  }
  if (membership.status !== 'ACTIVE') {
    return denied([
      violation(
        'CHANNEL_MEMBERSHIP_REQUIRED',
        'channelMembership.status',
        `Membership is ${membership.status} and does not grant access.`,
      ),
    ]);
  }
  return allowedWith([]);
}

export function isChannelParticipant(
  channel: ChannelRecord,
  userId: string,
  memberships: readonly ChannelMembershipRecord[],
): boolean {
  return memberships.some(
    (membership) =>
      membership.channelId === channel.id &&
      membership.userId === userId &&
      membership.status === 'ACTIVE',
  );
}

export function evaluateModerationAccess(
  actorUserId: string,
  actorRole: AppRole,
  moderationCase: ModerationCase,
  grant: ModerationAccessGrant | Absent,
  nowMs: number,
  purpose: string,
): CommunicationDecision {
  if (moderationCase.societyId.length === 0) {
    return denied([
      violation('VALIDATION_FAILED', 'moderationCase.societyId', 'Moderation case scope is invalid.'),
    ]);
  }
  if (!isModeratorRole(actorRole)) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'actor.role',
        'Private communication moderation is restricted to designated moderator roles.',
      ),
    ]);
  }
  if (grant === undefined) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant',
        'No purpose-bound moderation access grant exists for this case.',
      ),
    ]);
  }
  if (grant.moderatorUserId !== actorUserId) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.moderatorUserId',
        'The moderation access grant was issued to a different moderator.',
      ),
    ]);
  }
  if (grant.caseId !== moderationCase.id) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.caseId',
        'The moderation access grant is bound to a different case.',
      ),
    ]);
  }
  if (grant.revokedAtIso !== undefined) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.revokedAtIso',
        'The moderation access grant has been revoked.',
      ),
    ]);
  }
  if (nowMs >= Date.parse(grant.expiresAtIso)) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.expiresAtIso',
        'The moderation access grant has expired.',
      ),
    ]);
  }
  if (purpose.trim().length === 0) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.purpose',
        'A recorded purpose is mandatory for every moderation access.',
      ),
    ]);
  }
  if (grant.purpose !== purpose) {
    return denied([
      violation(
        'MODERATION_SCOPE_BLOCKED',
        'moderationAccessGrant.purpose',
        'The declared purpose does not match the purpose-bound grant.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function evaluateModerationTarget(
  moderationCase: ModerationCase,
  targetChannelId: string | Absent,
  reportedMessage: MessageRecord | Absent,
): CommunicationDecision {
  if (moderationCase.targetType === 'MESSAGE') {
    if (reportedMessage === undefined) {
      return denied([
        violation(
          'EVIDENCE_REQUIRED',
          'moderationCase.targetId',
          'A reported message record is required before moderation may proceed.',
        ),
      ]);
    }
    if (reportedMessage.id !== moderationCase.targetId) {
      return denied([
        violation(
          'EVIDENCE_REQUIRED',
          'moderationCase.targetId',
          'The supplied evidence does not match the reported target.',
        ),
      ]);
    }
    if (reportedMessage.channelId !== moderationCase.channelId) {
      return denied([
        violation(
          'EVIDENCE_REQUIRED',
          'moderationCase.channelId',
          'The reported message belongs to a different channel.',
        ),
      ]);
    }
    return allowedWith([]);
  }
  if (moderationCase.targetType === 'CHANNEL') {
    if (targetChannelId === undefined || targetChannelId !== moderationCase.targetId) {
      return denied([
        violation(
          'EVIDENCE_REQUIRED',
          'moderationCase.targetId',
          'The supplied channel does not match the reported target.',
        ),
      ]);
    }
    return allowedWith([]);
  }
  return allowedWith([]);
}

export function evaluateEmergencyOverride(
  notice: NoticeRecord,
  overrideReason: string | Absent,
  approverUserId: string | Absent,
): CommunicationDecision {
  if (!notice.emergencyOverride) {
    return allowedWith([]);
  }
  if (overrideReason === undefined || overrideReason.trim().length === 0) {
    return denied([
      violation(
        'NOTICE_EMERGENCY_REASON_REQUIRED',
        'notice.emergencyOverrideReason',
        'Emergency override requires an explicit recorded reason.',
      ),
    ]);
  }
  if (approverUserId === undefined || approverUserId.trim().length === 0) {
    return denied([
      violation(
        'NOTICE_EMERGENCY_REASON_REQUIRED',
        'notice.emergencyOverrideApprovedByUserId',
        'Emergency override requires a named approver.',
      ),
    ]);
  }
  return allowedWith([]);
}

export function collectViolations(
  decisions: readonly CommunicationDecision[],
): readonly CommunicationViolation[] {
  const collected: CommunicationViolation[] = [];
  for (const decision of decisions) {
    if (!decision.allowed) {
      collected.push(...decision.violations);
    }
  }
  return collected;
}

export function isContactRequestRespondent(
  request: ContactRequestRecord,
  actorUserId: string,
): boolean {
  return request.recipientUserId === actorUserId;
}

export function isContactRequestOwner(
  request: ContactRequestRecord,
  actorUserId: string,
): boolean {
  return request.requesterUserId === actorUserId;
}
