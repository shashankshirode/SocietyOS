import type { ChatMessage, ChatThread } from '../../../../shared/types/chat.types';
import type { ModerationReport } from '../../../../shared/types/privacy.types';
import type {
  ContactRequest,
  ResidentDirectoryEntry,
} from '../../../../shared/types/residentConnect.types';

export interface ResidentDirectoryEntryDto {
  id: string;
  name: string;
  unit_id: string;
  flat_number: string;
  tower: string;
  resident_type: 'OWNER' | 'TENANT' | 'FAMILY_MEMBER';
  visibility_status: ResidentDirectoryEntry['visibilityStatus'];
  connection_status: ResidentDirectoryEntry['connectionStatus'];
  last_active_text?: string;
  allowed_topics?: NonNullable<ResidentDirectoryEntry['allowedTopics']>;
  mutual_context?: string[];
  bio?: string;
}

export interface ContactRequestDto {
  id: string;
  from_resident_id: string;
  from_resident_name: string;
  from_flat: string;
  to_resident_id: string;
  to_resident_name: string;
  to_flat: string;
  subject: string;
  message: string;
  category: ContactRequest['category'];
  urgency: ContactRequest['urgency'];
  allow_flat_share: boolean;
  status: ContactRequest['status'];
  created_at: string;
  updated_at: string;
}

export interface ChatThreadDto {
  id: string;
  other_resident_id: string;
  other_resident_name: string;
  other_flat: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  status: ChatThread['status'];
  is_muted: boolean;
  is_archived: boolean;
}

export interface ChatMessageDto {
  id: string;
  thread_id: string;
  sender_id: string;
  sender_name: string;
  type: ChatMessage['type'];
  content: string;
  status: ChatMessage['status'];
  timestamp: string;
}

export interface PrivacySettingsDto {
  show_flat_number: boolean;
  show_display_name: boolean;
  allow_first_contact: boolean;
  same_tower_only: boolean;
  allow_committee_contact: boolean;
}

export interface BlockedResidentInfoDto {
  id: string;
  blocked_resident_id: string;
  blocked_resident_name: string;
  blocked_flat: string;
  blocked_date: string;
  reason?: string;
}

export interface ModerationReportDto {
  id: string;
  target_type: ModerationReport['targetType'];
  target_id: string;
  reported_by: string;
  reported_flat: string;
  category: ModerationReport['category'];
  description: string;
  status: ModerationReport['status'];
  created_at: string;
  message_context?: string;
}
