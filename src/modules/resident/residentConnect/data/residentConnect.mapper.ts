import type { ResidentDirectoryEntry, ContactRequest, } from '../../../../shared/types/residentConnect.types';
import type { ChatThread, ChatMessage } from '../../../../shared/types/chat.types';
import type { ResidentPrivacySettings, BlockedResidentInfo, ModerationReport } from '../../../../shared/types/privacy.types';
import type { ResidentDirectoryEntryDto, ContactRequestDto, ChatThreadDto, ChatMessageDto, PrivacySettingsDto, BlockedResidentInfoDto, ModerationReportDto, } from './residentConnect.dto';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
export function mapDirectoryEntryDtoToDomain(dto: ResidentDirectoryEntryDto): ResidentDirectoryEntry {
    return {
        id: dto.id,
        name: dto.name,
        unitId: dto.unit_id,
        flatNumber: dto.flat_number,
        tower: dto.tower,
        residentType: dto.resident_type,
        visibilityStatus: dto.visibility_status,
        connectionStatus: dto.connection_status,
        ...includeWhenPresent("lastActiveText", dto.last_active_text),
        ...includeWhenPresent("allowedTopics", dto.allowed_topics),
        ...includeWhenPresent("mutualContext", dto.mutual_context),
        ...includeWhenPresent("bio", dto.bio)
    };
}
export function mapContactRequestDtoToDomain(dto: ContactRequestDto): ContactRequest {
    return {
        id: dto.id,
        fromResidentId: dto.from_resident_id,
        fromResidentName: dto.from_resident_name,
        fromFlat: dto.from_flat,
        toResidentId: dto.to_resident_id,
        toResidentName: dto.to_resident_name,
        toFlat: dto.to_flat,
        subject: dto.subject,
        message: dto.message,
        category: dto.category,
        urgency: dto.urgency,
        allowFlatShare: dto.allow_flat_share,
        status: dto.status,
        createdAt: dto.created_at,
        updatedAt: dto.updated_at
    };
}
export function mapChatThreadDtoToDomain(dto: ChatThreadDto): ChatThread {
    return {
        id: dto.id,
        otherResidentId: dto.other_resident_id,
        otherResidentName: dto.other_resident_name,
        otherFlat: dto.other_flat,
        ...includeWhenPresent("lastMessage", dto.last_message),
        ...includeWhenPresent("lastMessageTime", dto.last_message_time),
        unreadCount: dto.unread_count,
        status: dto.status,
        isMuted: dto.is_muted,
        isArchived: dto.is_archived
    };
}
export function mapChatMessageDtoToDomain(dto: ChatMessageDto): ChatMessage {
    return {
        id: dto.id,
        threadId: dto.thread_id,
        senderId: dto.sender_id,
        senderName: dto.sender_name,
        type: dto.type,
        content: dto.content,
        status: dto.status,
        timestamp: dto.timestamp
    };
}
export function mapPrivacySettingsDtoToDomain(dto: PrivacySettingsDto): ResidentPrivacySettings {
    return {
        showFlatNumber: dto.show_flat_number,
        showDisplayName: dto.show_display_name,
        allowFirstContact: dto.allow_first_contact,
        sameTowerOnly: dto.same_tower_only,
        allowCommitteeContact: dto.allow_committee_contact
    };
}
export function mapBlockedResidentDtoToDomain(dto: BlockedResidentInfoDto): BlockedResidentInfo {
    return {
        id: dto.id,
        blockedResidentId: dto.blocked_resident_id,
        blockedResidentName: dto.blocked_resident_name,
        blockedFlat: dto.blocked_flat,
        blockedDate: dto.blocked_date,
        ...includeWhenPresent("reason", dto.reason)
    };
}
export function mapModerationReportDtoToDomain(dto: ModerationReportDto): ModerationReport {
    return {
        id: dto.id,
        targetType: dto.target_type,
        targetId: dto.target_id,
        reportedBy: dto.reported_by,
        reportedFlat: dto.reported_flat,
        category: dto.category,
        description: dto.description,
        status: dto.status,
        createdAt: dto.created_at,
        ...includeWhenPresent("messageContext", dto.message_context)
    };
}

