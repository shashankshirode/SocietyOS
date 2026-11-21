import type { ResidentRepositoryRequestContext } from '../../resident/homeContext/data/residentHomeContext.types';
import type {
  ChannelMemberAccessLevel,
  ChatAuditEvent,
  ChatChannelDefinition,
  ChatChannelMembership,
  ChatChannelSummary,
  ChatConversationSummary,
  ChatMessage,
  ChatMessagePage,
  ChatPageRequest,
  ChatStaffIdentity,
  RequestedChannelAssignment,
} from '../domain/chat.types';

export type SendResidentMessageInput = {
  channelId: string;
  clientMessageId: string;
  messageText: string;
  replyToMessageId?: string;
};

export type StaffChatRequestContext = {
  actorUserId: string;
  societyId: string;
};

export type SendStaffMessageInput = {
  residenceId: string;
  residentUserId: string;
  channelId: string;
  interactionId?: string;
  clientMessageId: string;
  messageText: string;
  replyToMessageId?: string;
};

export type AssignUserChannelsInput = {
  societyId: string;
  userId: string;
  staffProfileId: string;
  roleCode: ChatStaffIdentity['roleCode'];
  assignments: RequestedChannelAssignment[];
  assignedByUserId: string;
  hasGateOperationalAssignment: boolean;
};

export type UpdateChannelMembershipInput = {
  societyId: string;
  membershipId: string;
  actorUserId: string;
  status?: ChatChannelMembership['status'];
  accessLevel?: ChannelMemberAccessLevel;
  validUntilIso?: string;
  validFromIso?: string;
};

export type ChatChannelSummaryPage = ChatChannelSummary[] & {
  nextCursor?: string;
  hasMore: boolean;
};

export type ResidentChatRepository = {
  getResidentChannels: (
    context: ResidentRepositoryRequestContext,
    cursor?: string,
    limit?: number,
  ) => Promise<ChatChannelSummaryPage>;
  getResidentMessages: (
    context: ResidentRepositoryRequestContext,
    channelId: string,
    request: ChatPageRequest,
  ) => Promise<ChatMessagePage>;
  sendResidentMessage: (
    context: ResidentRepositoryRequestContext,
    input: SendResidentMessageInput,
  ) => Promise<ChatMessage>;
  markChannelRead: (context: ResidentRepositoryRequestContext, channelId: string) => Promise<void>;
};

export type GuardChatRepository = {
  getAssignedInbox: (context: StaffChatRequestContext) => Promise<ChatConversationSummary[]>;
  getAssignedMessages: (
    context: StaffChatRequestContext,
    interactionId: string,
    request: ChatPageRequest,
  ) => Promise<ChatMessagePage>;
  sendGuardMessage: (
    context: StaffChatRequestContext,
    input: SendStaffMessageInput,
  ) => Promise<ChatMessage>;
};

export type DepartmentStaffChatRepository = {
  getDepartmentInbox: (
    context: StaffChatRequestContext,
    channelId: string,
  ) => Promise<ChatConversationSummary[]>;
  getDepartmentMessages: (
    context: StaffChatRequestContext,
    channelId: string,
    residenceId: string,
    request: ChatPageRequest,
  ) => Promise<ChatMessagePage>;
  sendDepartmentMessage: (
    context: StaffChatRequestContext,
    input: SendStaffMessageInput,
  ) => Promise<ChatMessage>;
};

export type ChannelCatalogRepository = {
  getSocietyChannels: (societyId: string) => Promise<ChatChannelDefinition[]>;
  getAssignableChannels: (
    societyId: string,
    roleCode: ChatStaffIdentity['roleCode'],
  ) => Promise<ChatChannelDefinition[]>;
  getUserMemberships: (societyId: string, userId: string) => Promise<ChatChannelMembership[]>;
  assignUserChannels: (input: AssignUserChannelsInput) => Promise<ChatChannelMembership[]>;
  updateUserChannelMembership: (input: UpdateChannelMembershipInput) => Promise<ChatChannelMembership>;
  removeUserChannelMembership: (
    societyId: string,
    membershipId: string,
    removedByUserId: string,
  ) => Promise<void>;
  getChannelMembers: (societyId: string, channelId: string) => Promise<ChatStaffIdentity[]>;
};

export type ChatRepository = ResidentChatRepository
  & GuardChatRepository
  & DepartmentStaffChatRepository
  & ChannelCatalogRepository
  & {
    subscribe: (listener: () => void) => () => void;
    getVersion: () => number;
    getAuditEvents: () => readonly ChatAuditEvent[];
  };
