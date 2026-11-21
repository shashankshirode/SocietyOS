import type { RepositoryResult } from '../../../../core/repositories/repository.types';
import type { Absent } from "../../../../shared/types/absence.types";
export type ResidentContactRequestStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'blocked' | 'reported' | 'expired';
export type ResidentContactTopic = 'neighbourCoordination' | 'parking' | 'maintenanceImpact' | 'communityActivity' | 'misdeliveredItem' | 'other';
export type ResidentContactScope = {
    societyId: string;
    activeUnitId: string;
    authenticatedUserId: string;
    residentProfileId: string;
};
export type ResidentPaginationInput = {
    cursor?: string;
    limit?: number;
};
export type ResidentCursorPage<T> = T[] & {
    nextCursor?: string;
    hasMore: boolean;
};
export type ResidentDirectoryProfile = {
    residentProfileId: string;
    userId: string;
    societyId: string;
    unitId: string;
    flatNumber: string;
    towerOrWing: string;
    floorLabel: string;
    floorSortOrder: number;
    displayName: string;
    occupancyLabel: 'Owner' | 'Tenant' | 'Resident';
    activeOccupancy: boolean;
    eligibleForContact: boolean;
    directoryVisible: boolean;
    displayNameVisible: boolean;
    contactRequestsAllowed: boolean;
    isAdult: boolean;
    blockedResidentProfileIds: string[];
};
export type ResidentDirectoryUnit = {
    unitId: string;
    flatNumber: string;
    towerOrWing: string;
    floorLabel: string;
    floorSortOrder: number;
    residents: ResidentDirectoryProfile[];
};
export type ResidentDirectoryGroup = {
    groupId: string;
    towerOrWing: string;
    floorLabel: string;
    floorSortOrder: number;
    units: ResidentDirectoryUnit[];
};
export type ResidentContactRequest = {
    requestId: string;
    societyId: string;
    requesterUserId: string;
    requesterResidentProfileId: string;
    requesterUnitId: string;
    recipientUserId: string;
    recipientResidentProfileId: string;
    recipientUnitId: string;
    subject: string;
    introductoryMessage: string;
    topic: ResidentContactTopic;
    status: ResidentContactRequestStatus;
    createdAtIso: string;
    expiresAtIso: string;
    respondedAtIso?: string;
    responseReason?: string;
    conversationId?: string;
};
export type ResidentDirectConversation = {
    conversationId: string;
    societyId: string;
    participantResidentProfileIds: [
        string,
        string
    ];
    participantUnitIds: [
        string,
        string
    ];
    contactRequestId: string;
    subject: string;
    latestMessage: string;
    latestMessageAtIso: string;
    unreadByResidentProfileId: Record<string, number>;
};
export type ResidentDirectMessage = {
    messageId: string;
    conversationId: string;
    societyId: string;
    senderResidentProfileId: string;
    text: string;
    sentAtIso: string;
    deliveryStatus: 'sent' | 'delivered' | 'seen';
};
export type CreateResidentContactRequestInput = ResidentContactScope & {
    canInitiateResidentContact?: boolean;
    recipientResidentProfileId: string;
    subject: string;
    introductoryMessage: string;
    topic: ResidentContactTopic;
};
export type RespondToContactRequestInput = ResidentContactScope & {
    requestId: string;
};
export type ReportContactRequestInput = RespondToContactRequestInput & {
    reportCategory: 'harassment' | 'spam' | 'privacyConcern' | 'other';
    explanation?: string;
};
export type SearchResidentDirectoryInput = ResidentContactScope & {
    query: string;
};
export type ResidentContactRepositoryContract = {
    getDirectory: (input: ResidentContactScope) => Promise<RepositoryResult<ResidentDirectoryGroup[]>>;
    searchDirectory: (input: SearchResidentDirectoryInput) => Promise<RepositoryResult<ResidentDirectoryGroup[]>>;
    getResident: (input: ResidentContactScope & {
        residentProfileIdToFind: string;
    }) => Promise<RepositoryResult<ResidentDirectoryProfile | Absent>>;
    createRequest: (input: CreateResidentContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    getOutgoingRequests: (input: ResidentContactScope & ResidentPaginationInput) => Promise<RepositoryResult<ResidentCursorPage<ResidentContactRequest>>>;
    getIncomingRequests: (input: ResidentContactScope & ResidentPaginationInput) => Promise<RepositoryResult<ResidentCursorPage<ResidentContactRequest>>>;
    acceptRequest: (input: RespondToContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    rejectRequest: (input: RespondToContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    cancelRequest: (input: RespondToContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    blockRequester: (input: RespondToContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    reportRequest: (input: ReportContactRequestInput) => Promise<RepositoryResult<ResidentContactRequest>>;
    getConversations: (input: ResidentContactScope) => Promise<RepositoryResult<ResidentDirectConversation[]>>;
    getConversationMessages: (input: ResidentContactScope & ResidentPaginationInput & {
        conversationId: string;
    }) => Promise<RepositoryResult<ResidentCursorPage<ResidentDirectMessage>>>;
    sendDirectMessage: (input: ResidentContactScope & {
        conversationId: string;
        text: string;
    }) => Promise<RepositoryResult<ResidentDirectMessage>>;
};

