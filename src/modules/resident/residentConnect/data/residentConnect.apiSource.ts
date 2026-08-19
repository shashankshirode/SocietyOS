import { apiClient } from '../../../../core/api/apiClient';
import { apiEndpoints } from '../../../../core/api/apiEndpoints';
import { createIdempotencyKey } from '../../../../core/api/idempotency';
import { repositoryErrorFromUnknown, repositoryFailure, repositorySuccess, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import type { ResidentDirectoryEntry, ContactRequest } from '../../../../shared/types/residentConnect.types';
import type { ChatThread, ChatMessage } from '../../../../shared/types/chat.types';
import type { ResidentPrivacySettings, BlockedResidentInfo, ModerationReport, ReportCategory } from '../../../../shared/types/privacy.types';
import type { BlockedResidentInfoDto, ChatMessageDto, ChatThreadDto, ContactRequestDto, ModerationReportDto, PrivacySettingsDto, ResidentDirectoryEntryDto, } from './residentConnect.dto';
import type { ResidentCursorPage } from '../domain/residentContact.types';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import { mapDirectoryEntryDtoToDomain, mapContactRequestDtoToDomain, mapChatThreadDtoToDomain, mapChatMessageDtoToDomain, mapPrivacySettingsDtoToDomain, mapBlockedResidentDtoToDomain, mapModerationReportDtoToDomain, } from './residentConnect.mapper';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
export const residentConnectApiSource = {
    async getResidentConnectHome(): Promise<RepositoryResult<{
        activeChatsCount: number;
        pendingIncomingCount: number;
        pendingOutgoingCount: number;
        blockedCount: number;
    }>> {
        try {
            const activeChats = await apiClient.get<ChatThreadDto[]>(apiEndpoints.residentConnect.threads);
            const incoming = await apiClient.get<ContactRequestDto[]>(apiEndpoints.residentConnect.incomingRequests);
            const outgoing = await apiClient.get<ContactRequestDto[]>(apiEndpoints.residentConnect.outgoingRequests);
            const blocked = await apiClient.get<BlockedResidentInfoDto[]>(apiEndpoints.residentConnect.blockedResidents);
            return repositorySuccess({
                activeChatsCount: activeChats.filter((t) => t.status === 'ACTIVE' && !t.is_archived).length,
                pendingIncomingCount: incoming.filter((r) => r.status === 'PENDING').length,
                pendingOutgoingCount: outgoing.filter((r) => r.status === 'PENDING').length,
                blockedCount: blocked.length
            });
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getResidentDirectory(params?: {
        residentType?: string;
        tower?: string;
        onlyAvailable?: boolean;
        cursor?: string;
        limit?: number;
        search?: string;
    }): Promise<RepositoryResult<ResidentCursorPage<ResidentDirectoryEntry>>> {
        try {
            const queryParams: Record<string, string> = {};
            if (params?.residentType)
                queryParams.resident_type = params.residentType;
            if (params?.tower)
                queryParams.tower = params.tower;
            if (params?.onlyAvailable)
                queryParams.only_available = String(params.onlyAvailable);
            if (params?.cursor)
                queryParams.cursor = params.cursor;
            if (params?.limit)
                queryParams.limit = String(params.limit);
            if (params?.search)
                queryParams.search = params.search;
            const dtos = await apiClient.get<ResidentDirectoryEntryDto[]>(apiEndpoints.residentConnect.directory, { query: queryParams });
            const entries = dtos.map(mapDirectoryEntryDtoToDomain);
            return repositorySuccess(Object.assign(entries, { ...includeWhenPresent("nextCursor", undefined), hasMore: false }));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async searchResidents(query: string): Promise<RepositoryResult<ResidentDirectoryEntry[]>> {
        try {
            const dtos = await apiClient.get<ResidentDirectoryEntryDto[]>(apiEndpoints.residentConnect.directorySearch, { query: { q: query } });
            return repositorySuccess(dtos.map(mapDirectoryEntryDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getResidentPreview(residentId: string): Promise<RepositoryResult<ResidentDirectoryEntry | Absent>> {
        try {
            const dto = await apiClient.get<ResidentDirectoryEntryDto>(apiEndpoints.residentConnect.preview(residentId));
            return repositorySuccess(dto ? mapDirectoryEntryDtoToDomain(dto) : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getIncomingRequests(): Promise<RepositoryResult<ResidentCursorPage<ContactRequest>>> {
        try {
            const dtos = await apiClient.get<ContactRequestDto[]>(apiEndpoints.residentConnect.incomingRequests);
            return repositorySuccess(Object.assign(dtos.map(mapContactRequestDtoToDomain), { hasMore: false }));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getOutgoingRequests(): Promise<RepositoryResult<ResidentCursorPage<ContactRequest>>> {
        try {
            const dtos = await apiClient.get<ContactRequestDto[]>(apiEndpoints.residentConnect.outgoingRequests);
            return repositorySuccess(Object.assign(dtos.map(mapContactRequestDtoToDomain), { hasMore: false }));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getContactRequestDetail(requestId: string, _context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ContactRequest | Absent>> {
        try {
            const dto = await apiClient.get<ContactRequestDto>(apiEndpoints.residentConnect.requestDetail(requestId));
            return repositorySuccess(dto ? mapContactRequestDtoToDomain(dto) : undefined);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async createContactRequest(input: Partial<ContactRequest>): Promise<RepositoryResult<ContactRequest>> {
        try {
            const body = {
                to_resident_id: input.toResidentId,
                to_resident_name: input.toResidentName,
                to_flat: input.toFlat,
                subject: input.subject,
                message: input.message,
                category: input.category,
                urgency: input.urgency,
                allow_flat_share: input.allowFlatShare
            };
            const dto = await apiClient.post<ContactRequestDto>(apiEndpoints.residentConnect.requests, body, { idempotencyKey: createIdempotencyKey('create-contact-request') });
            return repositorySuccess(mapContactRequestDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async acceptContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.acceptRequest(requestId), {}, { idempotencyKey: createIdempotencyKey('accept-contact-request') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async rejectContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.rejectRequest(requestId), {}, { idempotencyKey: createIdempotencyKey('reject-contact-request') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async blockContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.blockRequest(requestId), {}, { idempotencyKey: createIdempotencyKey('block-contact-request') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async reportContactRequest(requestId: string, input: {
        category: ReportCategory;
        description: string;
    }): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.reportRequest(requestId), { category: input.category, description: input.description }, { idempotencyKey: createIdempotencyKey('report-contact-request') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getAcceptedContacts(): Promise<RepositoryResult<ResidentDirectoryEntry[]>> {
        try {
            const dtos = await apiClient.get<ResidentDirectoryEntryDto[]>(apiEndpoints.residentConnect.contacts);
            return repositorySuccess(dtos.map(mapDirectoryEntryDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getChatThreads(): Promise<RepositoryResult<ChatThread[]>> {
        try {
            const dtos = await apiClient.get<ChatThreadDto[]>(apiEndpoints.residentConnect.threads);
            return repositorySuccess(dtos.map(mapChatThreadDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getChatMessages(threadId: string): Promise<RepositoryResult<ChatMessage[]>> {
        try {
            const dtos = await apiClient.get<ChatMessageDto[]>(apiEndpoints.residentConnect.threadMessages(threadId));
            return repositorySuccess(dtos.map(mapChatMessageDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async sendMessage(threadId: string, content: string): Promise<RepositoryResult<ChatMessage>> {
        try {
            const dto = await apiClient.post<ChatMessageDto>(apiEndpoints.residentConnect.createMessage(threadId), { content }, { idempotencyKey: createIdempotencyKey('send-chat-message') });
            return repositorySuccess(mapChatMessageDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async markThreadRead(threadId: string): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.markRead(threadId), {});
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getBlockedResidents(): Promise<RepositoryResult<BlockedResidentInfo[]>> {
        try {
            const dtos = await apiClient.get<BlockedResidentInfoDto[]>(apiEndpoints.residentConnect.blockedResidents);
            return repositorySuccess(dtos.map(mapBlockedResidentDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async unblockResident(blockedResidentId: string): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.delete<JsonObject>(apiEndpoints.residentConnect.unblockResident(blockedResidentId));
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getPrivacySettings(): Promise<RepositoryResult<ResidentPrivacySettings>> {
        try {
            const dto = await apiClient.get<PrivacySettingsDto>(apiEndpoints.residentConnect.privacySettings);
            return repositorySuccess(mapPrivacySettingsDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async updatePrivacySettings(input: Partial<ResidentPrivacySettings>): Promise<RepositoryResult<ResidentPrivacySettings>> {
        try {
            const body = {
                show_flat_number: input.showFlatNumber,
                show_display_name: input.showDisplayName,
                allow_first_contact: input.allowFirstContact,
                same_tower_only: input.sameTowerOnly,
                allow_committee_contact: input.allowCommitteeContact
            };
            const dto = await apiClient.patch<PrivacySettingsDto>(apiEndpoints.residentConnect.updatePrivacySettings, body);
            return repositorySuccess(mapPrivacySettingsDtoToDomain(dto));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async getReportedItems(): Promise<RepositoryResult<ModerationReport[]>> {
        try {
            const dtos = await apiClient.get<ModerationReportDto[]>(apiEndpoints.residentConnect.reports);
            return repositorySuccess(dtos.map(mapModerationReportDtoToDomain));
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async reportMessage(messageId: string, input: {
        category: ReportCategory;
        description: string;
        contextText?: string;
    }): Promise<RepositoryResult<boolean>> {
        try {
            await apiClient.post<JsonObject>(apiEndpoints.residentConnect.reportMessage(messageId), { category: input.category, description: input.description, context_text: input.contextText }, { idempotencyKey: createIdempotencyKey('report-message') });
            return repositorySuccess(true);
        }
        catch (error) {
            return repositoryFailure(repositoryErrorFromUnknown(error as Error));
        }
    },
    async updateDirectoryVisibility(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async searchFlatResident(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async createFirstContactRequest(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async sendPrivateChatMessage(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async sendDepartmentMessage(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async sendGroupMessage(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async listBlockedUsers(params?: JsonValue) {
        throw new Error('Backend Integration required');
    },
    async listReportedMessages(params?: JsonValue) {
        throw new Error('Backend Integration required');
    }
};
export type { BlockedResidentInfo, ModerationReport };

