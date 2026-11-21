import type { ResidentScopedEntity } from './residentScope.types';

export type ChatThreadStatus =
  | 'ACTIVE'
  | 'MUTED'
  | 'BLOCKED'
  | 'REPORTED'
  | 'ARCHIVED';

export type ChatMessageType =
  | 'TEXT'
  | 'SYSTEM'
  | 'REQUEST_CONTEXT'
  | 'REPORTED_PLACEHOLDER';

export type ChatMessageStatus =
  | 'SENDING'
  | 'SENT'
  | 'DELIVERED'
  | 'READ'
  | 'FAILED';

export interface ChatThread extends ResidentScopedEntity {
  id: string;
  otherResidentId: string;
  otherResidentName: string;
  otherFlat: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  status: ChatThreadStatus;
  isMuted: boolean;
  isArchived: boolean;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  type: ChatMessageType;
  content: string;
  status: ChatMessageStatus;
  timestamp: string;
}
