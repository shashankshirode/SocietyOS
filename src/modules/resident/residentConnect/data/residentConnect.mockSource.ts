import { repositorySuccess, withMockDelay, type RepositoryResult } from '../../../../core/repositories/repository.types';
import { resolveRequestContext } from '../../homeContext/utils/resolveRequestContext';
import type { ResidentRepositoryRequestContext } from '../../homeContext/data/residentHomeContext.types';
import type { ResidentDirectoryEntry, ContactRequest } from '../../../../shared/types/residentConnect.types';
import type { ChatThread, ChatMessage } from '../../../../shared/types/chat.types';
import type { ResidentPrivacySettings, BlockedResidentInfo, ModerationReport, ReportCategory } from '../../../../shared/types/privacy.types';
import { mockStore } from '../../../../core/mockStore/mockStore';
import { mockDirectoryResidents, mockIncomingRequests, mockOutgoingRequests, } from '../../../../shared/mock/residentConnect.mock';
import { mockChatMessages } from '../../../../shared/mock/chat.mock';
import { mockPrivacySettings, mockBlockedResidents } from '../../../../shared/mock/privacySettings.mock';
import { mockModerationReports } from '../../../../shared/mock/moderation.mock';
import { residentScopedDirectoryEntries } from '../../mock/residentMockDomainBuilders';
import { matchesResidentRepositoryContext } from '../../homeContext/utils/matchesResidentRepositoryContext';
import type { ResidentCursorPage } from '../domain/residentContact.types';
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
let directoryCache = [...mockDirectoryResidents];
let incomingRequestsCache = [...mockIncomingRequests];
let outgoingRequestsCache = [...mockOutgoingRequests];
let messagesCache = { ...mockChatMessages };
let privacyCache = { ...mockPrivacySettings };
let blockedCache = [...mockBlockedResidents];
let reportsCache = [...mockModerationReports];
export const residentConnectMockSource = {
    async getResidentConnectHome(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<{
        activeChatsCount: number;
        pendingIncomingCount: number;
        pendingOutgoingCount: number;
        blockedCount: number;
    }>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const activeDir = await residentConnectMockSource.getResidentDirectory(undefined, ctx);
        const directoryIds = activeDir.ok ? activeDir.data.map(r => r.id) : [];
        const threads = mockStore.getState().chatThreads.filter((thread) => matchesResidentRepositoryContext(thread, ctx));
        return repositorySuccess({
            activeChatsCount: threads.filter((t) => t.status === 'ACTIVE' && !t.isArchived).length,
            pendingIncomingCount: incomingRequestsCache.filter((r) => r.status === 'PENDING' && (r.toResidentId === 'resident-001' || directoryIds.includes(r.fromResidentId))).length,
            pendingOutgoingCount: outgoingRequestsCache.filter((r) => r.status === 'PENDING' && (r.fromResidentId === 'resident-001' || directoryIds.includes(r.toResidentId))).length,
            blockedCount: blockedCache.length
        });
    },
    async getResidentDirectory(params?: {
        residentType?: string;
        tower?: string;
        onlyAvailable?: boolean;
        cursor?: string;
        limit?: number;
        search?: string;
    }, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentCursorPage<ResidentDirectoryEntry>>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        let list = residentScopedDirectoryEntries.filter((entry) => matchesResidentRepositoryContext(entry, ctx));
        if (params) {
            if (params.residentType && params.residentType !== 'ALL') {
                list = list.filter((r) => r.residentType === params.residentType);
            }
            if (params.tower && params.tower !== 'ALL') {
                list = list.filter((r) => r.tower === params.tower);
            }
            if (params.onlyAvailable) {
                list = list.filter((r) => r.visibilityStatus === 'VISIBLE');
            }
            if (params.search) {
                const query = params.search.toLowerCase().trim();
                if (query) {
                    list = list.filter((r) => r.name.toLowerCase().includes(query) ||
                        r.flatNumber.toLowerCase().includes(query));
                }
            }
        }
        const limit = params?.limit ?? 20;
        const startIndex = params?.cursor ? parseInt(params.cursor, 10) : 0;
        const items = list.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < list.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async searchResidents(query: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentDirectoryEntry[]>> {
        await withMockDelay();
        const cleanQuery = query.toLowerCase().trim();
        if (!cleanQuery)
            return repositorySuccess([]);
        const ctx = resolveRequestContext(context);
        const directoryResult = await residentConnectMockSource.getResidentDirectory(undefined, ctx);
        const activeList = directoryResult.ok ? directoryResult.data : [];
        const results = activeList.filter((r) => r.flatNumber.toLowerCase().includes(cleanQuery) ||
            r.name.toLowerCase().includes(cleanQuery) ||
            r.tower.toLowerCase().includes(cleanQuery));
        return repositorySuccess(results);
    },
    async getResidentPreview(residentId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentDirectoryEntry | Absent>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const directoryResult = await residentConnectMockSource.getResidentDirectory(undefined, ctx);
        const activeList = directoryResult.ok ? directoryResult.data : [];
        const entry = activeList.find((r) => r.id === residentId);
        return repositorySuccess(entry);
    },
    async getIncomingRequests(params?: {
        cursor?: string;
        limit?: number;
    }, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentCursorPage<ContactRequest>>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const activeDir = await residentConnectMockSource.getResidentDirectory(undefined, ctx);
        const directoryIds = activeDir.ok ? activeDir.data.map(r => r.id) : [];
        const filtered = incomingRequestsCache.filter(r => directoryIds.includes(r.fromResidentId));
        const limit = params?.limit ?? 20;
        const startIndex = params?.cursor ? parseInt(params.cursor, 10) : 0;
        const items = filtered.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < filtered.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async getOutgoingRequests(params?: {
        cursor?: string;
        limit?: number;
    }, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ResidentCursorPage<ContactRequest>>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const activeDir = await residentConnectMockSource.getResidentDirectory(undefined, ctx);
        const directoryIds = activeDir.ok ? activeDir.data.map(r => r.id) : [];
        const filtered = outgoingRequestsCache.filter(r => directoryIds.includes(r.toResidentId));
        const limit = params?.limit ?? 20;
        const startIndex = params?.cursor ? parseInt(params.cursor, 10) : 0;
        const items = filtered.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < filtered.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async getContactRequestDetail(requestId: string, context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ContactRequest | Absent>> {
        await withMockDelay();
        const request = incomingRequestsCache.find((r) => r.id === requestId) ||
            outgoingRequestsCache.find((r) => r.id === requestId);
        if (!request || !context)
            return repositorySuccess(request);
        const activeDirectory = await residentConnectMockSource.getResidentDirectory(undefined, context);
        const residentIds = activeDirectory.ok ? activeDirectory.data.map((resident) => resident.id) : [];
        const belongsToActiveHome = residentIds.includes(request.fromResidentId) || residentIds.includes(request.toResidentId);
        return repositorySuccess(belongsToActiveHome ? request : undefined);
    },
    async createContactRequest(input: Partial<ContactRequest>): Promise<RepositoryResult<ContactRequest>> {
        await withMockDelay();
        const newReq: ContactRequest = {
            id: `req-out-${Math.floor(1000 + Math.random() * 9000)}`,
            fromResidentId: 'resident-001',
            fromResidentName: 'Shashank Shirode',
            fromFlat: 'A-1204',
            toResidentId: input.toResidentId || '',
            toResidentName: input.toResidentName || '',
            toFlat: input.toFlat || '',
            subject: input.subject || '',
            message: input.message || '',
            category: input.category || 'OTHER',
            urgency: input.urgency || 'NORMAL',
            allowFlatShare: !!input.allowFlatShare,
            status: 'PENDING',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        outgoingRequestsCache.unshift(newReq);
        directoryCache = directoryCache.map((dir) => {
            if (dir.id === input.toResidentId) {
                return { ...dir, connectionStatus: 'REQUEST_SENT' };
            }
            return dir;
        });
        return repositorySuccess(newReq);
    },
    async acceptContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        let foundRequest: ContactRequest | Absent;
        incomingRequestsCache = incomingRequestsCache.map((r) => {
            if (r.id === requestId) {
                foundRequest = r;
                return { ...r, status: 'ACCEPTED', updatedAt: new Date().toISOString() };
            }
            return r;
        });
        if (foundRequest) {
            const senderId = foundRequest.fromResidentId;
            const senderName = foundRequest.fromResidentName;
            const senderFlat = foundRequest.fromFlat;
            directoryCache = directoryCache.map((dir) => {
                if (dir.id === senderId) {
                    return { ...dir, connectionStatus: 'CONNECTED' };
                }
                return dir;
            });
            const existingThread = mockStore.getState().chatThreads.find((t) => t.otherResidentId === senderId);
            if (!existingThread) {
                const newThreadId = `thread-${Math.floor(1000 + Math.random() * 9000)}`;
                const newThread: ChatThread = {
                    id: newThreadId,
                    otherResidentId: senderId,
                    otherResidentName: senderName,
                    otherFlat: senderFlat,
                    lastMessage: 'Contact request accepted.',
                    lastMessageTime: 'Just now',
                    unreadCount: 0,
                    status: 'ACTIVE',
                    isMuted: false,
                    isArchived: false
                };
                mockStore.addChatThread(newThread);
                messagesCache[newThreadId] = [
                    {
                        id: `msg-${newThreadId}-sys`,
                        threadId: newThreadId,
                        senderId: 'system',
                        senderName: 'System',
                        type: 'SYSTEM',
                        content: 'Contact request accepted. You can now chat without sharing phone numbers.',
                        status: 'READ',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                    {
                        id: `msg-${newThreadId}-ctx`,
                        threadId: newThreadId,
                        senderId: senderId,
                        senderName: senderName,
                        type: 'REQUEST_CONTEXT',
                        content: `Subject: ${foundRequest.subject}\n\n${foundRequest.message}`,
                        status: 'READ',
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    },
                ];
            }
        }
        return repositorySuccess(true);
    },
    async rejectContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        incomingRequestsCache = incomingRequestsCache.map((r) => {
            if (r.id === requestId) {
                return { ...r, status: 'REJECTED', updatedAt: new Date().toISOString() };
            }
            return r;
        });
        return repositorySuccess(true);
    },
    async getChatThreads(context?: ResidentRepositoryRequestContext): Promise<RepositoryResult<ChatThread[]>> {
        await withMockDelay();
        const ctx = resolveRequestContext(context);
        const threads = mockStore.getState().chatThreads.filter((thread) => matchesResidentRepositoryContext(thread, ctx));
        return repositorySuccess(threads);
    },
    async getChatMessages(threadId: string): Promise<RepositoryResult<ChatMessage[]>> {
        await withMockDelay();
        return repositorySuccess(messagesCache[threadId] || []);
    },
    async sendMessage(threadId: string, content: string): Promise<RepositoryResult<ChatMessage>> {
        await withMockDelay(300);
        const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            threadId: threadId,
            senderId: 'resident-001',
            senderName: 'Shashank Shirode',
            type: 'TEXT',
            content: content,
            status: 'SENT',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        if (!messagesCache[threadId]) {
            messagesCache[threadId] = [];
        }
        messagesCache[threadId].push(newMsg);
        mockStore.updateChatThread(threadId, {
            lastMessage: content,
            lastMessageTime: 'Just now'
        });
        return repositorySuccess(newMsg);
    },
    async getBlockedResidents(): Promise<RepositoryResult<BlockedResidentInfo[]>> {
        await withMockDelay();
        return repositorySuccess(blockedCache);
    },
    async getPrivacySettings(): Promise<RepositoryResult<ResidentPrivacySettings>> {
        await withMockDelay();
        return repositorySuccess(privacyCache);
    },
    async updatePrivacySettings(settings: Partial<ResidentPrivacySettings>): Promise<RepositoryResult<ResidentPrivacySettings>> {
        await withMockDelay();
        privacyCache = { ...privacyCache, ...settings };
        return repositorySuccess(privacyCache);
    },
    async reportResident(report: Partial<ModerationReport>): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        reportsCache.push({
            id: `rep-${Date.now()}`,
            targetType: 'RESIDENT',
            targetId: report.targetId || '',
            reportedBy: 'resident-001',
            reportedFlat: 'A-1204',
            category: report.category || 'OTHER',
            description: report.description || '',
            status: 'SUBMITTED',
            createdAt: new Date().toISOString()
        });
        return repositorySuccess(true);
    },
    async markThreadRead(threadId: string): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        mockStore.updateChatThread(threadId, { unreadCount: 0 });
        return repositorySuccess(true);
    },
    async getAcceptedContacts(): Promise<RepositoryResult<ResidentDirectoryEntry[]>> {
        await withMockDelay();
        const accepted = directoryCache.filter((r) => r.connectionStatus === 'CONNECTED');
        return repositorySuccess(accepted);
    },
    async unblockResident(blockedResidentId: string): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        blockedCache = blockedCache.filter((r) => r.id !== blockedResidentId);
        return repositorySuccess(true);
    },
    async blockContactRequest(requestId: string): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        const request = incomingRequestsCache.find((candidate) => candidate.id === requestId);
        incomingRequestsCache = incomingRequestsCache.map((candidate) => candidate.id === requestId
            ? { ...candidate, status: 'BLOCKED', updatedAt: new Date().toISOString() }
            : candidate);
        if (request) {
            directoryCache = directoryCache.map((resident) => resident.id === request.fromResidentId
                ? { ...resident, connectionStatus: 'BLOCKED_BY_ME' }
                : resident);
            if (!blockedCache.some((resident) => resident.blockedResidentId === request.fromResidentId)) {
                blockedCache.unshift({
                    id: `block-${Date.now()}`,
                    blockedResidentId: request.fromResidentId,
                    blockedResidentName: request.fromResidentName,
                    blockedFlat: request.fromFlat,
                    blockedDate: new Date().toISOString(),
                    reason: 'Blocked from a contact request'
                });
            }
        }
        return repositorySuccess(true);
    },
    async reportContactRequest(requestId: string, input: {
        category: ReportCategory;
        description: string;
    }): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        reportsCache.push({
            id: `rep-${Date.now()}`,
            targetType: 'CONTACT_REQUEST',
            targetId: requestId,
            reportedBy: 'resident-001',
            reportedFlat: 'A-1204',
            category: input.category,
            description: input.description,
            status: 'SUBMITTED',
            createdAt: new Date().toISOString()
        });
        return repositorySuccess(true);
    },
    async reportMessage(messageId: string, input: {
        category: ReportCategory;
        description: string;
        contextText?: string;
    }): Promise<RepositoryResult<boolean>> {
        await withMockDelay();
        reportsCache.push({
            id: `rep-${Date.now()}`,
            targetType: 'MESSAGE',
            targetId: messageId,
            reportedBy: 'resident-001',
            reportedFlat: 'A-1204',
            category: input.category,
            description: input.description,
            status: 'SUBMITTED',
            createdAt: new Date().toISOString(),
            ...includeWhenPresent("messageContext", input.contextText)
        });
        return repositorySuccess(true);
    },
    async getReportedItems(): Promise<RepositoryResult<ModerationReport[]>> {
        await withMockDelay();
        return repositorySuccess(reportsCache);
    },
    async updateDirectoryVisibility(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async searchFlatResident(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async createFirstContactRequest(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async sendPrivateChatMessage(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async sendDepartmentMessage(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async sendGroupMessage(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listBlockedUsers(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    },
    async listReportedMessages(params?: JsonValue) {
        return [{
                id: 'mock-1',
                name: 'Mock Item 1',
                status: 'ACTIVE'
            }];
    }
};

