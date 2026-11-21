import { repositoryFailure, repositorySuccess, withMockDelay, type RepositoryResult, } from '../../../../core/repositories/repository.types';
import type { CreateResidentContactRequestInput, ReportContactRequestInput, ResidentContactRepositoryContract, ResidentContactRequest, ResidentContactScope, ResidentCursorPage, ResidentDirectConversation, ResidentDirectMessage, ResidentDirectoryGroup, ResidentDirectoryProfile, RespondToContactRequestInput, SearchResidentDirectoryInput, } from '../domain/residentContact.types';
import { validateResidentContactRequest } from '../domain/residentContact.validation';
import { getResidentMockNotificationEvents, publishResidentMockNotification, resetResidentMockNotificationEvents, type ResidentMockNotificationEvent, } from '../../notifications/data/residentNotificationEvents.mock';
import { getRequiredItem } from "../../../../shared/utils/requiredItem";
import { includeWhenPresent } from "../../../../shared/utils/presentProperty";
import type { Absent } from "../../../../shared/types/absence.types";
const directoryProfiles: ResidentDirectoryProfile[] = [
    profile('gv-a-1201-ananya', 'society-gv', 'unit-gv-a-1201', 'A-1201', 'Tower A', 'Floor 12', 12, 'Ananya Kulkarni', 'Owner'),
    profile('gv-a-1202-rahul', 'society-gv', 'unit-gv-a-1202', 'A-1202', 'Tower A', 'Floor 12', 12, 'Rahul Deshmukh', 'Tenant'),
    profile('gv-a-1203-meera', 'society-gv', 'unit-gv-a-1203', 'A-1203', 'Tower A', 'Floor 12', 12, 'Meera Shah', 'Resident', { displayNameVisible: false }),
    profile('gv-a-1101-rohan', 'society-gv', 'unit-gv-a-1101', 'A-1101', 'Tower A', 'Floor 11', 11, 'Rohan Patil', 'Owner'),
    profile('gv-a-1102-kavita', 'society-gv', 'unit-gv-a-1102', 'A-1102', 'Tower A', 'Floor 11', 11, 'Kavita Joshi', 'Tenant'),
    profile('gv-b-804-dev', 'society-gv', 'unit-gv-b-804', 'B-804', 'Tower B', 'Floor 8', 8, 'Dev Mehta', 'Owner'),
    profile('gv-b-804-isha', 'society-gv', 'unit-gv-b-804', 'B-804', 'Tower B', 'Floor 8', 8, 'Isha Mehta', 'Resident'),
    profile('gv-b-804-minor', 'society-gv', 'unit-gv-b-804', 'B-804', 'Tower B', 'Floor 8', 8, 'Minor Resident', 'Resident', { isAdult: false }),
    profile('gv-c-g01-sana', 'society-gv', 'unit-gv-c-g01', 'C-G01', 'Wing C', 'Ground Floor', 0, 'Sana Khan', 'Tenant'),
    profile('gv-p-p02-amit', 'society-gv', 'unit-gv-p-p02', 'P-P02', 'Podium', 'Podium 2', -2, 'Amit Sane', 'Owner'),
    profile('gv-hidden', 'society-gv', 'unit-gv-a-901', 'A-901', 'Tower A', 'Floor 9', 9, 'Hidden Resident', 'Owner', { directoryVisible: false }),
    profile('gv-inactive', 'society-gv', 'unit-gv-a-902', 'A-902', 'Tower A', 'Floor 9', 9, 'Inactive Resident', 'Owner', { activeOccupancy: false }),
    profile('gp-c-501-neha', 'society-gp', 'unit-gp-c-501', 'C-501', 'Wing C', 'Floor 5', 5, 'Neha Rao', 'Owner'),
    profile('gp-c-504-arun', 'society-gp', 'unit-gp-c-504', 'C-504', 'Wing C', 'Floor 5', 5, 'Arun Nair', 'Tenant'),
    profile('ra-b-2102-tara', 'society-ra', 'unit-ra-b-2102', 'B-2102', 'Tower B', 'Floor 21', 21, 'Tara Singh', 'Owner'),
];
function profile(residentProfileId: string, societyId: string, unitId: string, flatNumber: string, towerOrWing: string, floorLabel: string, floorSortOrder: number, displayName: string, occupancyLabel: ResidentDirectoryProfile['occupancyLabel'], overrides: Partial<Pick<ResidentDirectoryProfile, 'activeOccupancy' | 'eligibleForContact' | 'directoryVisible' | 'displayNameVisible' | 'contactRequestsAllowed' | 'isAdult'>> = {}): ResidentDirectoryProfile {
    return {
        residentProfileId,
        userId: `user-${residentProfileId}`,
        societyId,
        unitId,
        flatNumber,
        towerOrWing,
        floorLabel,
        floorSortOrder,
        displayName,
        occupancyLabel,
        activeOccupancy: true,
        eligibleForContact: true,
        directoryVisible: true,
        displayNameVisible: true,
        contactRequestsAllowed: true,
        isAdult: true,
        blockedResidentProfileIds: [],
        ...overrides
    };
}
const directoryExpansion = [
    { societyId: 'society-gv', prefix: 'gv', tower: 'Tower D', wing: 'D' },
    { societyId: 'society-gp', prefix: 'gp', tower: 'Wing E', wing: 'E' },
    { societyId: 'society-ra', prefix: 'ra', tower: 'Tower C', wing: 'C' },
] as const;
const expansionNames = [
    'Aarav Joshi', 'Diya Patil', 'Ishaan Kulkarni', 'Myra Shah',
    'Kabir Deshmukh', 'Nisha Nair', 'Vihaan Mehta', 'Riya Rao',
    'Arjun Sane', 'Aditi Singh', 'Neil Bhat', 'Pooja Khan',
] as const;
directoryProfiles.push(...directoryExpansion.flatMap((society, societyIndex) => Array.from({ length: 6 }, (_, floorIndex) => floorIndex + 1).flatMap((floor) => [1, 2].map((flatIndex) => {
    const flatNumber = `${society.wing}-${floor}${String(flatIndex).padStart(2, '0')}`;
    const residentIndex = societyIndex * 4 + ((floor - 1) * 2 + flatIndex - 1) % 4;
    return profile(`${society.prefix}-${society.wing.toLocaleLowerCase()}-${floor}-${flatIndex}`, society.societyId, `unit-${society.prefix}-${society.wing.toLocaleLowerCase()}-${floor}-${flatIndex}`, flatNumber, society.tower, `Floor ${floor}`, floor, getRequiredItem(expansionNames, residentIndex, "residentContact.mockSource.ts"), flatIndex === 1 ? 'Owner' : 'Tenant');
}))));
const now = '2026-07-12T08:00:00.000Z';
let requestSequence = 100;
let messageSequence = 100;
let requests: ResidentContactRequest[] = [
    request('contact-pending-out', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-a-1201-ananya', 'unit-gv-a-1201', 'Parking clarification', 'Could we coordinate about the visitor parking allocation near our units?', 'parking', 'pending'),
    request('contact-rejected-out', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-a-1101-rohan', 'unit-gv-a-1101', 'Renovation timing', 'I wanted to coordinate the renovation timing for this weekend.', 'maintenanceImpact', 'rejected'),
    request('contact-expired-out', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-a-1102-kavita', 'unit-gv-a-1102', 'Community notice', 'Could we discuss the notice for the upcoming community activity?', 'communityActivity', 'expired'),
    request('contact-incoming-1', 'society-gv', 'gv-a-1202-rahul', 'unit-gv-a-1202', 'resident-001', 'unit-gv-a-1204', 'Package collected by mistake', 'A package for your flat was delivered to me. Please connect so we can coordinate.', 'misdeliveredItem', 'pending'),
    request('contact-accepted-1', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-b-804-dev', 'unit-gv-b-804', 'Neighbour coordination', 'I would like to coordinate about the shared floor notice.', 'neighbourCoordination', 'accepted', 'resident-conversation-1'),
    request('contact-reported-1', 'society-gv', 'gv-a-1101-rohan', 'unit-gv-a-1101', 'resident-001', 'unit-gv-a-1204', 'Repeated message', 'Please review this contact request.', 'other', 'reported'),
    request('contact-cancelled-out', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-p-p02-amit', 'unit-gv-p-p02', 'Podium coordination', 'This request was cancelled before the resident responded.', 'neighbourCoordination', 'cancelled'),
    request('contact-blocked-in', 'society-gv', 'gv-a-1102-kavita', 'unit-gv-a-1102', 'resident-001', 'unit-gv-a-1204', 'Contact unavailable', 'This request is retained only as a blocked status scenario.', 'other', 'blocked'),
    request('contact-draft-out', 'society-gv', 'resident-001', 'unit-gv-a-1204', 'gv-a-1203-meera', 'unit-gv-a-1203', 'Draft neighbour note', 'This request has not been submitted and creates no notification.', 'other', 'draft'),
];
function request(requestId: string, societyId: string, requesterResidentProfileId: string, requesterUnitId: string, recipientResidentProfileId: string, recipientUnitId: string, subject: string, introductoryMessage: string, topic: ResidentContactRequest['topic'], status: ResidentContactRequest['status'], conversationId?: string): ResidentContactRequest {
    return {
        requestId,
        societyId,
        requesterUserId: `user-${requesterResidentProfileId}`,
        requesterResidentProfileId,
        requesterUnitId,
        recipientUserId: `user-${recipientResidentProfileId}`,
        recipientResidentProfileId,
        recipientUnitId,
        subject,
        introductoryMessage,
        topic,
        status,
        createdAtIso: '2026-07-10T10:00:00.000Z',
        expiresAtIso: status === 'expired' ? '2026-07-11T10:00:00.000Z' : '2026-07-20T10:00:00.000Z',
        ...includeWhenPresent("respondedAtIso", status !== 'pending' ? '2026-07-11T10:00:00.000Z' : undefined),
        ...includeWhenPresent("conversationId", conversationId)
    };
}
let conversations: ResidentDirectConversation[] = [
    {
        conversationId: 'resident-conversation-1',
        societyId: 'society-gv',
        participantResidentProfileIds: ['resident-001', 'gv-b-804-dev'],
        participantUnitIds: ['unit-gv-a-1204', 'unit-gv-b-804'],
        contactRequestId: 'contact-accepted-1',
        subject: 'Neighbour coordination',
        latestMessage: 'Thanks, we can coordinate here without sharing contact details.',
        latestMessageAtIso: '2026-07-11T11:10:00.000Z',
        unreadByResidentProfileId: { 'resident-001': 1, 'gv-b-804-dev': 0 }
    },
];
const initialRequests = [...requests];
const initialConversations = [...conversations];
let conversationMessages: Record<string, ResidentDirectMessage[]> = {
    'resident-conversation-1': [
        {
            messageId: 'resident-message-0',
            conversationId: 'resident-conversation-1',
            societyId: 'society-gv',
            senderResidentProfileId: 'resident-001',
            text: 'I have shared the floor notice context in this private chat.',
            sentAtIso: '2026-07-11T11:00:00.000Z',
            deliveryStatus: 'delivered'
        },
        {
            messageId: 'resident-message-1',
            conversationId: 'resident-conversation-1',
            societyId: 'society-gv',
            senderResidentProfileId: 'gv-b-804-dev',
            text: 'Thanks, we can coordinate here without sharing contact details.',
            sentAtIso: '2026-07-11T11:10:00.000Z',
            deliveryStatus: 'seen'
        },
    ]
};
const initialConversationMessages = { ...conversationMessages };
const blockedPairs = new Set<string>();
function pairKey(societyId: string, first: string, second: string): string {
    return `${societyId}:${first}:${second}`;
}
function isScopeValid(scope: ResidentContactScope): boolean {
    return Boolean(scope.societyId && scope.activeUnitId && scope.authenticatedUserId && scope.residentProfileId);
}
function eligibleProfiles(scope: ResidentContactScope): ResidentDirectoryProfile[] {
    if (!isScopeValid(scope))
        return [];
    return directoryProfiles.filter((entry) => entry.societyId === scope.societyId
        && entry.unitId !== scope.activeUnitId
        && entry.residentProfileId !== scope.residentProfileId
        && entry.activeOccupancy
        && entry.eligibleForContact
        && entry.directoryVisible
        && entry.contactRequestsAllowed
        && entry.isAdult
        && !entry.blockedResidentProfileIds.includes(scope.residentProfileId)
        && !blockedPairs.has(pairKey(scope.societyId, scope.residentProfileId, entry.residentProfileId))
        && !blockedPairs.has(pairKey(scope.societyId, entry.residentProfileId, scope.residentProfileId)));
}
export function groupResidentDirectory(entries: ResidentDirectoryProfile[]): ResidentDirectoryGroup[] {
    const groups = new Map<string, ResidentDirectoryGroup>();
    entries.forEach((entry) => {
        const groupId = `${entry.towerOrWing}:${entry.floorLabel}`;
        const existing = groups.get(groupId) ?? {
            groupId,
            towerOrWing: entry.towerOrWing,
            floorLabel: entry.floorLabel,
            floorSortOrder: entry.floorSortOrder,
            units: []
        };
        const unit = existing.units.find((item) => item.unitId === entry.unitId);
        if (unit) {
            unit.residents.push(entry);
        }
        else {
            existing.units.push({
                unitId: entry.unitId,
                flatNumber: entry.flatNumber,
                towerOrWing: entry.towerOrWing,
                floorLabel: entry.floorLabel,
                floorSortOrder: entry.floorSortOrder,
                residents: [entry]
            });
        }
        groups.set(groupId, existing);
    });
    return [...groups.values()]
        .sort((left, right) => left.towerOrWing.localeCompare(right.towerOrWing) || right.floorSortOrder - left.floorSortOrder)
        .map((group) => ({ ...group, units: [...group.units].sort((left, right) => left.flatNumber.localeCompare(right.flatNumber)) }));
}
function matchesQuery(entry: ResidentDirectoryProfile, query: string): boolean {
    const normalized = query.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
    if (!normalized)
        return true;
    const visibleName = entry.displayNameVisible ? entry.displayName : '';
    return `${entry.flatNumber} ${visibleName} ${entry.towerOrWing} ${entry.floorLabel}`
        .toLocaleLowerCase()
        .includes(normalized);
}
function findRequest(input: RespondToContactRequestInput): ResidentContactRequest | Absent {
    return requests.find((item) => item.requestId === input.requestId && item.societyId === input.societyId);
}
function updateRequest(requestId: string, update: ResidentContactRequest): ResidentContactRequest {
    requests = requests.map((item) => item.requestId === requestId ? update : item);
    return update;
}
function isConversationParticipant(conversation: ResidentDirectConversation, scope: ResidentContactScope): boolean {
    const participantIndex = conversation.participantResidentProfileIds.findIndex((profileId) => profileId === scope.residentProfileId);
    return participantIndex >= 0 && getRequiredItem(conversation.participantUnitIds, participantIndex, "residentContact.mockSource.ts") === scope.activeUnitId;
}
function notify(societyId: string, recipientResidentProfileId: string, kind: ResidentMockNotificationEvent['kind']): void {
    publishResidentMockNotification({ societyId, recipientResidentProfileId, kind });
}
const invalidScopeError = { code: 'INVALID_RESIDENT_SCOPE', message: 'The active residence could not be verified.' };
const unavailableResidentError = { code: 'RESIDENT_UNAVAILABLE', message: 'This resident is no longer available for contact.' };
const requestUnavailableError = { code: 'REQUEST_UNAVAILABLE', message: 'This contact request is no longer available.' };
export const residentContactMockSource: ResidentContactRepositoryContract = {
    async getDirectory(input): Promise<RepositoryResult<ResidentDirectoryGroup[]>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        return repositorySuccess(groupResidentDirectory(eligibleProfiles(input)));
    },
    async searchDirectory(input: SearchResidentDirectoryInput): Promise<RepositoryResult<ResidentDirectoryGroup[]>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        return repositorySuccess(groupResidentDirectory(eligibleProfiles(input).filter((entry) => matchesQuery(entry, input.query))));
    },
    async getResident(input): Promise<RepositoryResult<ResidentDirectoryProfile | Absent>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        return repositorySuccess(eligibleProfiles(input).find((entry) => entry.residentProfileId === input.residentProfileIdToFind));
    },
    async createRequest(input: CreateResidentContactRequestInput): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay(450);
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        if (input.canInitiateResidentContact === false) {
            return repositoryFailure({ code: 'RESIDENT_CONTACT_PERMISSION_DENIED', message: 'This resident profile cannot initiate private contact requests.' });
        }
        if (!validateResidentContactRequest(input.subject, input.introductoryMessage).formValid) {
            return repositoryFailure({ code: 'INVALID_CONTACT_REQUEST', message: 'The subject or introductory message is invalid.' });
        }
        const recipient = eligibleProfiles(input).find((entry) => entry.residentProfileId === input.recipientResidentProfileId);
        if (!recipient || recipient.societyId !== input.societyId)
            return repositoryFailure(unavailableResidentError);
        const duplicate = requests.find((item) => item.societyId === input.societyId
            && item.requesterResidentProfileId === input.residentProfileId
            && item.recipientResidentProfileId === input.recipientResidentProfileId
            && (item.status === 'pending' || item.status === 'accepted'));
        if (duplicate) {
            return repositoryFailure({ code: 'DUPLICATE_CONTACT_REQUEST', message: 'A request or conversation already exists for this resident.' });
        }
        requestSequence += 1;
        const created = request(`contact-request-${requestSequence}`, input.societyId, input.residentProfileId, input.activeUnitId, recipient.residentProfileId, recipient.unitId, input.subject.trim(), input.introductoryMessage.trim(), input.topic, 'pending');
        requests = [created, ...requests];
        notify(input.societyId, recipient.residentProfileId, 'contactRequestReceived');
        return repositorySuccess(created);
    },
    async getOutgoingRequests(input): Promise<RepositoryResult<ResidentCursorPage<ResidentContactRequest>>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        const all = requests.filter((item) => item.societyId === input.societyId
            && item.requesterResidentProfileId === input.residentProfileId
            && item.requesterUnitId === input.activeUnitId);
        const limit = input.limit ?? 20;
        const startIndex = input.cursor ? parseInt(input.cursor, 10) : 0;
        const items = all.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < all.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async getIncomingRequests(input): Promise<RepositoryResult<ResidentCursorPage<ResidentContactRequest>>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        const all = requests.filter((item) => item.societyId === input.societyId
            && item.recipientResidentProfileId === input.residentProfileId
            && item.recipientUnitId === input.activeUnitId);
        const limit = input.limit ?? 20;
        const startIndex = input.cursor ? parseInt(input.cursor, 10) : 0;
        const items = all.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < all.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async acceptRequest(input): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay();
        const current = findRequest(input);
        if (!current || current.recipientResidentProfileId !== input.residentProfileId || current.recipientUnitId !== input.activeUnitId) {
            return repositoryFailure(requestUnavailableError);
        }
        if (current.status === 'accepted')
            return repositorySuccess(current);
        if (current.status !== 'pending' || Date.parse(current.expiresAtIso) <= Date.parse(now))
            return repositoryFailure(requestUnavailableError);
        const conversationId = `resident-conversation-${current.requestId}`;
        if (!conversations.some((item) => item.contactRequestId === current.requestId)) {
            conversations = [{
                    conversationId,
                    societyId: current.societyId,
                    participantResidentProfileIds: [current.requesterResidentProfileId, current.recipientResidentProfileId],
                    participantUnitIds: [current.requesterUnitId, current.recipientUnitId],
                    contactRequestId: current.requestId,
                    subject: current.subject,
                    latestMessage: current.introductoryMessage,
                    latestMessageAtIso: now,
                    unreadByResidentProfileId: { [current.requesterResidentProfileId]: 1, [current.recipientResidentProfileId]: 0 }
                }, ...conversations];
            conversationMessages[conversationId] = [{
                    messageId: `resident-message-context-${current.requestId}`,
                    conversationId,
                    societyId: current.societyId,
                    senderResidentProfileId: current.requesterResidentProfileId,
                    text: current.introductoryMessage,
                    sentAtIso: now,
                    deliveryStatus: 'seen'
                }];
        }
        const accepted = updateRequest(current.requestId, { ...current, status: 'accepted', respondedAtIso: now, conversationId });
        notify(current.societyId, current.requesterResidentProfileId, 'contactRequestAccepted');
        return repositorySuccess(accepted);
    },
    async rejectRequest(input): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay();
        const current = findRequest(input);
        if (!current || current.status !== 'pending' || current.recipientResidentProfileId !== input.residentProfileId || current.recipientUnitId !== input.activeUnitId) {
            return repositoryFailure(requestUnavailableError);
        }
        const rejected = updateRequest(current.requestId, { ...current, status: 'rejected', respondedAtIso: now });
        notify(current.societyId, current.requesterResidentProfileId, 'contactRequestRejected');
        return repositorySuccess(rejected);
    },
    async cancelRequest(input): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay();
        const current = findRequest(input);
        if (!current || current.status !== 'pending' || current.requesterResidentProfileId !== input.residentProfileId || current.requesterUnitId !== input.activeUnitId) {
            return repositoryFailure(requestUnavailableError);
        }
        return repositorySuccess(updateRequest(current.requestId, { ...current, status: 'cancelled', respondedAtIso: now }));
    },
    async blockRequester(input): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay();
        const current = findRequest(input);
        if (!current || current.status !== 'pending' || current.recipientResidentProfileId !== input.residentProfileId || current.recipientUnitId !== input.activeUnitId) {
            return repositoryFailure(requestUnavailableError);
        }
        blockedPairs.add(pairKey(current.societyId, current.recipientResidentProfileId, current.requesterResidentProfileId));
        return repositorySuccess(updateRequest(current.requestId, { ...current, status: 'blocked', respondedAtIso: now }));
    },
    async reportRequest(input: ReportContactRequestInput): Promise<RepositoryResult<ResidentContactRequest>> {
        await withMockDelay();
        const current = findRequest(input);
        if (!current || current.status !== 'pending' || current.recipientResidentProfileId !== input.residentProfileId || current.recipientUnitId !== input.activeUnitId) {
            return repositoryFailure(requestUnavailableError);
        }
        blockedPairs.add(pairKey(current.societyId, current.recipientResidentProfileId, current.requesterResidentProfileId));
        return repositorySuccess(updateRequest(current.requestId, { ...current, status: 'reported', respondedAtIso: now, responseReason: input.reportCategory }));
    },
    async getConversations(input): Promise<RepositoryResult<ResidentDirectConversation[]>> {
        await withMockDelay();
        if (!isScopeValid(input))
            return repositoryFailure(invalidScopeError);
        return repositorySuccess(conversations.filter((item) => item.societyId === input.societyId
            && isConversationParticipant(item, input)));
    },
    async getConversationMessages(input): Promise<RepositoryResult<ResidentCursorPage<ResidentDirectMessage>>> {
        await withMockDelay();
        const available = conversations.some((item) => item.conversationId === input.conversationId
            && item.societyId === input.societyId
            && isConversationParticipant(item, input));
        if (!available)
            return repositoryFailure({ code: 'CONVERSATION_UNAVAILABLE', message: 'This conversation is unavailable for the active residence.' });
        const all = conversationMessages[input.conversationId] ?? [];
        const limit = input.limit ?? 20;
        const startIndex = input.cursor ? parseInt(input.cursor, 10) : 0;
        const items = all.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < all.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        const result = Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
        return repositorySuccess(result);
    },
    async sendDirectMessage(input): Promise<RepositoryResult<ResidentDirectMessage>> {
        await withMockDelay(300);
        const clean = input.text.trim();
        const available = conversations.some((item) => item.conversationId === input.conversationId
            && item.societyId === input.societyId
            && isConversationParticipant(item, input));
        if (!available || !clean)
            return repositoryFailure({ code: 'MESSAGE_UNAVAILABLE', message: 'This message could not be sent.' });
        messageSequence += 1;
        const sent: ResidentDirectMessage = {
            messageId: `resident-message-${messageSequence}`,
            conversationId: input.conversationId,
            societyId: input.societyId,
            senderResidentProfileId: input.residentProfileId,
            text: clean,
            sentAtIso: now,
            deliveryStatus: 'sent'
        };
        conversationMessages[input.conversationId] = [...(conversationMessages[input.conversationId] ?? []), sent];
        conversations = conversations.map((item) => item.conversationId === input.conversationId
            ? { ...item, latestMessage: clean, latestMessageAtIso: now }
            : item);
        return repositorySuccess(sent);
    }
};
export function getResidentContactMockNotificationEvents(): readonly ResidentMockNotificationEvent[] {
    return getResidentMockNotificationEvents();
}
export function resetResidentContactMockState(): void {
    blockedPairs.clear();
    requests = [...initialRequests];
    conversations = [...initialConversations];
    conversationMessages = Object.fromEntries(Object.entries(initialConversationMessages).map(([key, value]) => [key, [...value]]));
    resetResidentMockNotificationEvents();
    requestSequence = 100;
    messageSequence = 100;
}

