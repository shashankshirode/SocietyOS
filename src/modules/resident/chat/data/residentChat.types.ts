import type {
  ChatChannelDefinition,
  ChatMessage,
  ChatMessageDeliveryStatus,
} from '../../../chat/domain/chat.types';

export type ResidentChatMessageStatus = ChatMessageDeliveryStatus;
export type ResidentChatMessage = ChatMessage;

export type ResidentChatConversation = {
  id: string;
  homeContextId: string;
  channel: ChatChannelDefinition;
  unreadCount: number;
  updatedAt: string;
  messages: ChatMessage[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ResidentChatConversationSummary = Omit<ResidentChatConversation, 'messages' | 'nextCursor' | 'hasMore'> & {
  lastMessage: ChatMessage | null;
};
