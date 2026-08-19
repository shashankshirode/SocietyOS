import type { ChatRepository } from './chat.repository.types';

function notConfigured(): Promise<never> {
  return Promise.reject(new Error('chat.errors.apiNotConfigured'));
}

export const chatApiSource: ChatRepository = {
  subscribe: () => () => undefined,
  getVersion: () => 0,
  getAuditEvents: () => [],
  getResidentChannels: notConfigured,
  getResidentMessages: notConfigured,
  sendResidentMessage: notConfigured,
  markChannelRead: notConfigured,
  getAssignedInbox: notConfigured,
  getAssignedMessages: notConfigured,
  sendGuardMessage: notConfigured,
  getDepartmentInbox: notConfigured,
  getDepartmentMessages: notConfigured,
  sendDepartmentMessage: notConfigured,
  getSocietyChannels: notConfigured,
  getAssignableChannels: notConfigured,
  getUserMemberships: notConfigured,
  assignUserChannels: notConfigured,
  updateUserChannelMembership: notConfigured,
  removeUserChannelMembership: notConfigured,
  getChannelMembers: notConfigured,
};
