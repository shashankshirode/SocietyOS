import type { MessageKey } from '../../../core/localization/localization.types';

export type ChatChannelCode =
  | 'securityGate'
  | 'securityDesk'
  | 'accounts'
  | 'facilityHelpdesk'
  | 'societyOffice';

export type ChatChannelHistoryMode =
  | 'individualStaffIsolated'
  | 'sharedChannelHistory';

export type ChatChannelAudience = 'residentAndStaff' | 'staffOnly';

export type ChatChannelDefinition = {
  channelId: string;
  societyId: string;
  code: ChatChannelCode;
  displayNameMessageKey: MessageKey;
  descriptionMessageKey: MessageKey;
  historyModeMessageKey: MessageKey;
  configuredDisplayName?: string;
  historyMode: ChatChannelHistoryMode;
  audience: ChatChannelAudience;
  isEnabled: boolean;
  isPinned: boolean;
  sortOrder: number;
  iconAssetId: string;
  createdAtIso: string;
  updatedAtIso: string;
};

export type ChannelMembershipStatus =
  | 'pending'
  | 'active'
  | 'inactive'
  | 'suspended'
  | 'expired';

export type ChannelMemberAccessLevel = 'member' | 'moderator' | 'channelManager';

export type ChatChannelPermissionSet = {
  canRead: boolean;
  canSend: boolean;
  canRespond: boolean;
  canAssignConversation: boolean;
  canViewMemberList: boolean;
  canManageMembers: boolean;
  canViewAllGuardInteractions: boolean;
};

export type ChatChannelMembership = {
  membershipId: string;
  societyId: string;
  channelId: string;
  userId: string;
  staffProfileId: string;
  accessLevel: ChannelMemberAccessLevel;
  permissions: ChatChannelPermissionSet;
  status: ChannelMembershipStatus;
  validFromIso: string;
  validUntilIso?: string;
  assignedByUserId: string;
  assignedAtIso: string;
  removedByUserId?: string;
  removedAtIso?: string;
};

export type StaffRoleCode =
  | 'securityGuard'
  | 'securitySupervisor'
  | 'treasurer'
  | 'accountant'
  | 'facilityManager'
  | 'facilityExecutive'
  | 'secretary'
  | 'chairperson'
  | 'committeeMember'
  | 'societyManager'
  | 'officeExecutive';

export type ChatPermission =
  | 'chat.channel.view'
  | 'chat.channel.respond'
  | 'chat.channel.assignConversation'
  | 'chat.channel.viewMembers'
  | 'chat.channel.manageMembers'
  | 'chat.channel.manageConfiguration'
  | 'security.chat.viewAssignedInteractions'
  | 'security.chat.viewAllGuardInteractions';

export type RecommendedChannelAssignment = {
  channelCode: ChatChannelCode;
  recommendedAccessLevel: ChannelMemberAccessLevel;
  isRequired: boolean;
};

export type ChatSenderType =
  | 'resident'
  | 'securityGuard'
  | 'departmentStaff'
  | 'system';

export type ChatSenderSnapshot = {
  senderUserId: string;
  senderType: ChatSenderType;
  displayNameAtSend: string;
  roleTitleAtSend: string;
  channelNameAtSend: string;
  departmentNameAtSend?: string;
  gateNameAtSend?: string;
  avatarAssetId?: string;
};

export type ChatMessageDeliveryStatus =
  | 'queued'
  | 'sending'
  | 'sent'
  | 'delivered'
  | 'seen'
  | 'failed';

export type ChatMessage = {
  messageId: string;
  clientMessageId: string;
  societyId: string;
  residenceId: string;
  residentUserId: string;
  channelId: string;
  interactionId?: string;
  replyToMessageId?: string;
  senderSnapshot: ChatSenderSnapshot;
  messageText: string;
  sentAtIso: string;
  deliveryStatus: ChatMessageDeliveryStatus;
  editedAtIso?: string;
  deletedAtIso?: string;
};

export type SecurityConversationSegment = {
  interactionId: string;
  channelId: string;
  societyId: string;
  residenceId: string;
  residentUserId: string;
  assignedGuardUserId: string;
  gateId: string;
  shiftAssignmentId: string;
  startedAtIso: string;
  endedAtIso?: string;
  status: 'active' | 'completed' | 'expired';
};

export type GuardShiftAssignment = {
  shiftAssignmentId: string;
  guardUserId: string;
  societyId: string;
  gateId: string;
  gateName: string;
  startsAtIso: string;
  endsAtIso: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
};

export type ChatStaffIdentity = {
  userId: string;
  staffProfileId: string;
  societyId: string;
  displayName: string;
  roleTitle: string;
  roleCode: StaffRoleCode;
  status: 'active' | 'inactive' | 'suspended';
  avatarAssetId?: string;
  chatPermissions?: readonly ChatPermission[];
};

export type ChatChannelSummary = {
  channel: ChatChannelDefinition;
  residenceId: string;
  unreadCount: number;
  updatedAtIso: string;
  lastMessage: ChatMessage | null;
};

export type ChatConversationSummary = {
  channel: ChatChannelDefinition;
  residenceId: string;
  residentUserId: string;
  residentDisplayName: string;
  residentUnitLabel: string;
  interactionId?: string;
  unreadCount: number;
  updatedAtIso: string;
  lastMessage: ChatMessage | null;
};

export type ChatPageRequest = { cursor: string | null; pageSize: number };

export type ChatMessagePage = {
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ChatAuditEventType =
  | 'channelOpened'
  | 'messageSent'
  | 'messageRead'
  | 'membershipAccessRejected'
  | 'guardInteractionAccessRejected';

export type ChatAuditEvent = {
  auditEventId: string;
  eventType: ChatAuditEventType;
  actorUserId: string;
  societyId: string;
  channelId?: string;
  interactionId?: string;
  occurredAtIso: string;
  reason?: ChatAccessDecisionReason;
};

export type ChatAccessDecisionReason =
  | 'allowed'
  | 'membershipMissing'
  | 'membershipInactive'
  | 'channelDisabled'
  | 'wrongSociety'
  | 'interactionNotAssigned'
  | 'permissionMissing'
  | 'staffInactive';

export type ChatAccessDecision = {
  allowed: boolean;
  reason: ChatAccessDecisionReason;
};

export type RequestedChannelAssignment = {
  channelId: string;
  accessLevel: ChannelMemberAccessLevel;
  validFromIso: string;
  validUntilIso?: string;
};

export type AssignmentValidationCode =
  | 'channelRequired'
  | 'duplicateMembership'
  | 'channelDisabled'
  | 'roleNotEligible'
  | 'gateAssignmentRequired'
  | 'cannotRemoveLastManager';

export type ChannelAssignmentValidation = {
  valid: boolean;
  code?: AssignmentValidationCode;
  channelId?: string;
};
