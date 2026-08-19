import { formatResidentRelativeTime } from '../../../../core/localization/dateTimeFormatters';
import type { EnglishMessagesType } from '../../../../messages/en';
import { resolveMessage } from '../../../../messages/resolveMessage';
import type { ResidentChatConversationSummary } from '../data/residentChat.types';

export type ResidentChatConversationViewModel = ResidentChatConversationSummary & {
  displayName: string;
  subtitle: string;
  avatarInitials: string;
  pinned: boolean;
  timestampLabel: string;
  senderPreview: string | null;
  lastMessageText: string;
  formattedPreview: string;
};

function initials(value: string): string {
  return value.split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toLocaleUpperCase();
}

export function mapResidentChatConversation(
  conversation: ResidentChatConversationSummary,
  messages: EnglishMessagesType,
): ResidentChatConversationViewModel {
  const displayName = conversation.channel.configuredDisplayName
    ?? resolveMessage(messages, conversation.channel.displayNameMessageKey);
  const lastMessage = conversation.lastMessage;
  const isStaff = lastMessage
    && lastMessage.senderSnapshot.senderType !== 'resident'
    && lastMessage.senderSnapshot.senderType !== 'system';
  const lastMessageText = lastMessage?.messageText
    ?? resolveMessage(messages, 'resident.chat.newConversation');
  const senderPreview = isStaff ? lastMessage.senderSnapshot.displayNameAtSend : null;
  return {
    ...conversation,
    displayName,
    subtitle: resolveMessage(messages, conversation.channel.descriptionMessageKey),
    avatarInitials: initials(displayName),
    pinned: conversation.channel.isPinned,
    timestampLabel: formatResidentRelativeTime(conversation.updatedAt),
    senderPreview,
    lastMessageText,
    formattedPreview: senderPreview ? `${senderPreview}: ${lastMessageText}` : lastMessageText,
  };
}
