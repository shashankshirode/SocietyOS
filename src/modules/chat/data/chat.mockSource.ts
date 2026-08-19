import { resolveChatAccess } from '../domain/chatAccessPolicy';
import { canRoleJoinChannel, validateChannelAssignments } from '../domain/chatChannelPolicy';
import type { ChatAuditEvent, ChatChannelCode, ChatChannelDefinition, ChatChannelMembership, ChatChannelPermissionSet, ChatChannelSummary, ChatConversationSummary, ChatMessage, ChatMessagePage, ChatPageRequest, ChatSenderSnapshot, ChatStaffIdentity, GuardShiftAssignment, SecurityConversationSegment, } from '../domain/chat.types';
import type { AssignUserChannelsInput, ChatRepository, SendResidentMessageInput, SendStaffMessageInput, StaffChatRequestContext, UpdateChannelMembershipInput, } from './chat.repository.types';
import type { ResidentRepositoryRequestContext } from '../../resident/homeContext/data/residentHomeContext.types';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
import type { Absent } from "../../../shared/types/absence.types";
const CREATED_AT = '2026-01-01T00:00:00.000Z';
const ACTIVE_FROM = '2026-01-01T00:00:00.000Z';
const ACTIVE_UNTIL = '2027-01-01T00:00:00.000Z';
const defaultPermissions: ChatChannelPermissionSet = {
    canRead: true,
    canSend: true,
    canRespond: true,
    canAssignConversation: false,
    canViewMemberList: false,
    canManageMembers: false,
    canViewAllGuardInteractions: false
};
const managerPermissions: ChatChannelPermissionSet = {
    ...defaultPermissions,
    canAssignConversation: true,
    canViewMemberList: true,
    canManageMembers: true
};
const channelMetadata: Readonly<Record<ChatChannelCode, {
    displayNameMessageKey: string;
    descriptionMessageKey: string;
    historyModeMessageKey: string;
    historyMode: ChatChannelDefinition['historyMode'];
    audience: ChatChannelDefinition['audience'];
    iconAssetId: string;
}>> = {
    securityGate: {
        displayNameMessageKey: 'chat.channel.securityGate.title',
        descriptionMessageKey: 'chat.channel.securityGate.description',
        historyModeMessageKey: 'chat.channel.securityGate.historyMode',
        historyMode: 'individualStaffIsolated',
        audience: 'residentAndStaff',
        iconAssetId: 'shield-checkmark'
    },
    securityDesk: {
        displayNameMessageKey: 'chat.channel.securityDesk.title',
        descriptionMessageKey: 'chat.channel.securityDesk.description',
        historyModeMessageKey: 'chat.channel.securityDesk.historyMode',
        historyMode: 'sharedChannelHistory',
        audience: 'residentAndStaff',
        iconAssetId: 'shield'
    },
    accounts: {
        displayNameMessageKey: 'chat.channel.accounts.title',
        descriptionMessageKey: 'chat.channel.accounts.description',
        historyModeMessageKey: 'chat.channel.accounts.historyMode',
        historyMode: 'sharedChannelHistory',
        audience: 'residentAndStaff',
        iconAssetId: 'receipt'
    },
    facilityHelpdesk: {
        displayNameMessageKey: 'chat.channel.facilityHelpdesk.title',
        descriptionMessageKey: 'chat.channel.facilityHelpdesk.description',
        historyModeMessageKey: 'chat.channel.facilityHelpdesk.historyMode',
        historyMode: 'sharedChannelHistory',
        audience: 'residentAndStaff',
        iconAssetId: 'construct'
    },
    societyOffice: {
        displayNameMessageKey: 'chat.channel.societyOffice.title',
        descriptionMessageKey: 'chat.channel.societyOffice.description',
        historyModeMessageKey: 'chat.channel.societyOffice.historyMode',
        historyMode: 'sharedChannelHistory',
        audience: 'residentAndStaff',
        iconAssetId: 'business'
    }
};
function createCatalog(societyId: string, disabled: readonly ChatChannelCode[] = []): ChatChannelDefinition[] {
    const codes: ChatChannelCode[] = ['securityGate', 'securityDesk', 'accounts', 'facilityHelpdesk', 'societyOffice'];
    return codes.map((code, index) => ({
        channelId: `${societyId}-${code}`,
        societyId,
        code,
        ...channelMetadata[code],
        isEnabled: !disabled.includes(code),
        isPinned: true,
        sortOrder: index + 1,
        createdAtIso: CREATED_AT,
        updatedAtIso: CREATED_AT
    }));
}
const channels: ChatChannelDefinition[] = [
    ...createCatalog('society-gv'),
    ...createCatalog('society-gp', ['securityDesk']),
];
const staff: ChatStaffIdentity[] = [
    { userId: 'guard-amit', staffProfileId: 'staff-amit', societyId: 'society-gv', displayName: 'Amit Jadhav', roleTitle: 'Security Guard', roleCode: 'securityGuard', status: 'active', chatPermissions: ['chat.channel.view', 'chat.channel.respond', 'security.chat.viewAssignedInteractions'] },
    { userId: 'guard-001', staffProfileId: 'staff-suresh', societyId: 'society-gv', displayName: 'Suresh Patil', roleTitle: 'Security Guard', roleCode: 'securityGuard', status: 'active', chatPermissions: ['chat.channel.view', 'chat.channel.respond', 'security.chat.viewAssignedInteractions'] },
    { userId: 'guard-mahesh', staffProfileId: 'staff-mahesh', societyId: 'society-gv', displayName: 'Mahesh Pawar', roleTitle: 'Security Supervisor', roleCode: 'securitySupervisor', status: 'active', chatPermissions: ['chat.channel.view', 'chat.channel.respond', 'security.chat.viewAssignedInteractions'] },
    { userId: 'accounts-rahul', staffProfileId: 'staff-rahul', societyId: 'society-gv', displayName: 'Rahul Deshmukh', roleTitle: 'Accounts Executive', roleCode: 'accountant', status: 'inactive' },
    { userId: 'accounts-rohit', staffProfileId: 'staff-rohit', societyId: 'society-gv', displayName: 'Rohit Sharma', roleTitle: 'Accounts Executive', roleCode: 'accountant', status: 'active' },
    { userId: 'treasurer-001', staffProfileId: 'staff-priya', societyId: 'society-gv', displayName: 'Priya Kulkarni', roleTitle: 'Treasurer', roleCode: 'treasurer', status: 'active' },
    { userId: 'facility-neha', staffProfileId: 'staff-neha', societyId: 'society-gv', displayName: 'Neha Patil', roleTitle: 'Facility Executive', roleCode: 'facilityExecutive', status: 'active' },
    { userId: 'facility-001', staffProfileId: 'staff-ajay', societyId: 'society-gv', displayName: 'Ajay Shinde', roleTitle: 'Facility Manager', roleCode: 'facilityManager', status: 'active' },
    { userId: 'office-kavita', staffProfileId: 'staff-kavita', societyId: 'society-gv', displayName: 'Kavita Deshmukh', roleTitle: 'Society Secretary', roleCode: 'secretary', status: 'active' },
    { userId: 'admin-001', staffProfileId: 'staff-anil', societyId: 'society-gv', displayName: 'Anil Mehta', roleTitle: 'Committee Member', roleCode: 'committeeMember', status: 'active' },
];
function membership(userId: string, channelCode: ChatChannelCode, status: ChatChannelMembership['status'] = 'active', accessLevel: ChatChannelMembership['accessLevel'] = 'member'): ChatChannelMembership {
    const identity = staff.find((item) => item.userId === userId);
    const societyId = identity?.societyId ?? 'society-gv';
    return {
        membershipId: `membership-${userId}-${channelCode}`,
        societyId,
        channelId: `${societyId}-${channelCode}`,
        userId,
        staffProfileId: identity?.staffProfileId ?? `staff-${userId}`,
        accessLevel,
        permissions: accessLevel === 'channelManager' ? managerPermissions : defaultPermissions,
        status,
        validFromIso: ACTIVE_FROM,
        validUntilIso: status === 'expired' ? '2026-01-31T00:00:00.000Z' : ACTIVE_UNTIL,
        assignedByUserId: 'admin-001',
        assignedAtIso: ACTIVE_FROM
    };
}
const memberships: ChatChannelMembership[] = [
    membership('guard-amit', 'securityGate'),
    membership('guard-001', 'securityGate'),
    membership('guard-mahesh', 'securityGate'),
    membership('guard-mahesh', 'securityDesk', 'active', 'moderator'),
    membership('accounts-rahul', 'accounts', 'inactive'),
    membership('accounts-rohit', 'accounts'),
    membership('accounts-rohit', 'societyOffice'),
    membership('treasurer-001', 'accounts', 'active', 'channelManager'),
    membership('treasurer-001', 'societyOffice'),
    membership('facility-neha', 'facilityHelpdesk'),
    membership('facility-001', 'facilityHelpdesk', 'active', 'channelManager'),
    membership('facility-001', 'securityDesk'),
    membership('facility-001', 'societyOffice'),
    membership('office-kavita', 'societyOffice', 'active', 'channelManager'),
    membership('office-kavita', 'accounts'),
    membership('admin-001', 'societyOffice'),
];
const shifts: GuardShiftAssignment[] = [
    { shiftAssignmentId: 'shift-amit-main', guardUserId: 'guard-amit', societyId: 'society-gv', gateId: 'gate-main', gateName: 'Main Gate', startsAtIso: '2026-07-12T00:00:00.000Z', endsAtIso: '2026-07-12T23:59:59.999Z', status: 'active' },
    { shiftAssignmentId: 'shift-suresh-main', guardUserId: 'guard-001', societyId: 'society-gv', gateId: 'gate-main', gateName: 'Main Gate', startsAtIso: '2026-07-11T00:00:00.000Z', endsAtIso: '2026-07-11T23:59:59.999Z', status: 'completed' },
    { shiftAssignmentId: 'shift-mahesh-service', guardUserId: 'guard-mahesh', societyId: 'society-gv', gateId: 'gate-service', gateName: 'Service Gate', startsAtIso: '2026-07-12T08:00:00.000Z', endsAtIso: '2026-07-12T20:00:00.000Z', status: 'active' },
];
const segments: SecurityConversationSegment[] = [
    { interactionId: 'interaction-amit-delivery', channelId: 'society-gv-securityGate', societyId: 'society-gv', residenceId: 'context-001', residentUserId: 'resident-001', assignedGuardUserId: 'guard-amit', gateId: 'gate-main', shiftAssignmentId: 'shift-amit-main', startedAtIso: '2026-07-11T06:18:00.000Z', status: 'active' },
    { interactionId: 'interaction-suresh-parcel', channelId: 'society-gv-securityGate', societyId: 'society-gv', residenceId: 'context-001', residentUserId: 'resident-001', assignedGuardUserId: 'guard-001', gateId: 'gate-main', shiftAssignmentId: 'shift-suresh-main', startedAtIso: '2026-07-11T10:30:00.000Z', endedAtIso: '2026-07-11T11:00:00.000Z', status: 'completed' },
];
function snapshot(userId: string, senderType: ChatSenderSnapshot['senderType'], channelNameAtSend: string, gateNameAtSend?: string): ChatSenderSnapshot {
    if (senderType === 'resident') {
        return { senderUserId: userId, senderType, displayNameAtSend: 'Shashank Shirode', roleTitleAtSend: 'Resident', channelNameAtSend };
    }
    const identity = staff.find((item) => item.userId === userId);
    return {
        senderUserId: userId,
        senderType,
        displayNameAtSend: identity?.displayName ?? 'Society Team',
        roleTitleAtSend: identity?.roleTitle ?? 'Team Member',
        channelNameAtSend,
        ...includeWhenPresent("gateNameAtSend", gateNameAtSend)
    };
}
function chatMessage(input: {
    id: string;
    channelId: string;
    interactionId?: string;
    sender: ChatSenderSnapshot;
    text: string;
    sentAtIso: string;
    status?: ChatMessage['deliveryStatus'];
    replyToMessageId?: string;
    residenceId?: string;
}): ChatMessage {
    return {
        messageId: input.id,
        clientMessageId: `client-${input.id}`,
        societyId: input.channelId.split('-').slice(0, 2).join('-'),
        residenceId: input.residenceId ?? 'context-001',
        residentUserId: 'resident-001',
        channelId: input.channelId,
        ...includeWhenPresent("interactionId", input.interactionId),
        ...includeWhenPresent("replyToMessageId", input.replyToMessageId),
        senderSnapshot: input.sender,
        messageText: input.text,
        sentAtIso: input.sentAtIso,
        deliveryStatus: input.status ?? 'seen'
    };
}
const messages: ChatMessage[] = [
    chatMessage({ id: 'gate-amit-1', channelId: 'society-gv-securityGate', interactionId: 'interaction-amit-delivery', sender: snapshot('guard-amit', 'securityGuard', 'Security Gate', 'Main Gate'), text: 'Your grocery delivery has arrived at the main gate.', sentAtIso: '2026-07-11T06:18:00.000Z' }),
    chatMessage({ id: 'gate-resident-1', channelId: 'society-gv-securityGate', interactionId: 'interaction-amit-delivery', sender: snapshot('resident-001', 'resident', 'Security Gate'), text: 'Please allow the delivery partner to enter.', sentAtIso: '2026-07-11T06:19:00.000Z', replyToMessageId: 'gate-amit-1' }),
    chatMessage({ id: 'gate-amit-2', channelId: 'society-gv-securityGate', interactionId: 'interaction-amit-delivery', sender: snapshot('guard-amit', 'securityGuard', 'Security Gate', 'Main Gate'), text: 'Entry approved. The delivery partner is on the way.', sentAtIso: '2026-07-11T06:22:00.000Z' }),
    chatMessage({ id: 'gate-suresh-1', channelId: 'society-gv-securityGate', interactionId: 'interaction-suresh-parcel', sender: snapshot('guard-001', 'securityGuard', 'Security Gate', 'Main Gate'), text: 'A parcel is waiting at the gate.', sentAtIso: '2026-07-11T10:30:00.000Z', status: 'delivered' }),
    chatMessage({ id: 'accounts-rahul-1', channelId: 'society-gv-accounts', sender: snapshot('accounts-rahul', 'departmentStaff', 'Accounts'), text: 'Your maintenance payment has been reconciled.', sentAtIso: '2026-07-09T09:30:00.000Z' }),
    chatMessage({ id: 'accounts-resident-1', channelId: 'society-gv-accounts', sender: snapshot('resident-001', 'resident', 'Accounts'), text: 'Thank you. When will the receipt be generated?', sentAtIso: '2026-07-09T09:34:00.000Z', replyToMessageId: 'accounts-rahul-1' }),
    chatMessage({ id: 'accounts-rohit-1', channelId: 'society-gv-accounts', sender: snapshot('accounts-rohit', 'departmentStaff', 'Accounts'), text: 'The receipt is now available under Bills and Payments.', sentAtIso: '2026-07-09T09:40:00.000Z' }),
    chatMessage({ id: 'facility-neha-1', channelId: 'society-gv-facilityHelpdesk', sender: snapshot('facility-neha', 'departmentStaff', 'Facility Helpdesk'), text: 'The clubhouse repair work has started.', sentAtIso: '2026-07-08T10:15:00.000Z' }),
    chatMessage({ id: 'facility-ajay-1', channelId: 'society-gv-facilityHelpdesk', sender: snapshot('facility-001', 'departmentStaff', 'Facility Helpdesk'), text: 'The clubhouse repair work is complete.', sentAtIso: '2026-07-08T14:25:00.000Z' }),
    chatMessage({ id: 'office-kavita-1', channelId: 'society-gv-societyOffice', sender: snapshot('office-kavita', 'departmentStaff', 'Society Office'), text: 'Your vehicle sticker request has been approved.', sentAtIso: '2026-07-10T12:10:00.000Z' }),
    chatMessage({ id: 'desk-mahesh-1', channelId: 'society-gv-securityDesk', sender: snapshot('guard-mahesh', 'departmentStaff', 'Security Desk'), text: 'The lost-and-found desk has received your report.', sentAtIso: '2026-07-07T08:00:00.000Z' }),
    chatMessage({ id: 'gp-accounts-1', channelId: 'society-gp-accounts', residenceId: 'context-003', sender: { senderUserId: 'gp-accounts-1', senderType: 'departmentStaff', displayNameAtSend: 'Madhura Joshi', roleTitleAtSend: 'Accounts Executive', channelNameAtSend: 'Accounts' }, text: 'Your July statement is ready.', sentAtIso: '2026-07-10T07:00:00.000Z' }),
];
messages.push(...Array.from({ length: 35 }, (_, index) => chatMessage({
    id: `accounts-history-${index + 1}`,
    channelId: 'society-gv-accounts',
    sender: index % 2 === 0
        ? snapshot('accounts-rahul', 'departmentStaff', 'Accounts')
        : snapshot('resident-001', 'resident', 'Accounts'),
    text: `Accounts history item ${index + 1}`,
    sentAtIso: `2026-06-${String(index % 28 + 1).padStart(2, '0')}T08:${String(index).padStart(2, '0')}:00.000Z`,
    status: index === 3 ? 'failed' : index === 4 ? 'queued' : index === 5 ? 'sending' : index % 3 === 0 ? 'sent' : 'seen'
})));
const unreadByResidenceChannel = new Map<string, number>([
    ['context-001:society-gv-securityGate', 2],
    ['context-001:society-gv-accounts', 1],
    ['context-003:society-gp-accounts', 1],
]);
const listeners = new Set<() => void>();
const auditEvents: ChatAuditEvent[] = [];
let version = 0;
function emit(): void {
    version += 1;
    listeners.forEach((listener) => listener());
}
function addAudit(input: Omit<ChatAuditEvent, 'auditEventId' | 'occurredAtIso'>): void {
    auditEvents.push({ ...input, auditEventId: `audit-${auditEvents.length + 1}`, occurredAtIso: new Date().toISOString() });
}
function findChannel(societyId: string, channelId: string): ChatChannelDefinition {
    const channel = channels.find((item) => item.societyId === societyId && item.channelId === channelId);
    if (!channel)
        throw new Error('chat.errors.channelUnavailable');
    return channel;
}
function activeMembership(userId: string, channelId: string): ChatChannelMembership | Absent {
    return memberships.find((item) => item.userId === userId && item.channelId === channelId);
}
function page(items: readonly ChatMessage[], request: ChatPageRequest): ChatMessagePage {
    const sorted = [...items].sort((left, right) => left.sentAtIso.localeCompare(right.sentAtIso));
    const end = request.cursor ? Math.max(0, Number(request.cursor)) : sorted.length;
    const start = Math.max(0, end - request.pageSize);
    return {
        messages: sorted.slice(start, end),
        nextCursor: start > 0 ? String(start) : null,
        hasMore: start > 0
    };
}
function channelMessages(societyId: string, residenceId: string, channelId: string): ChatMessage[] {
    return messages.filter((item) => item.societyId === societyId && item.residenceId === residenceId && item.channelId === channelId && !item.deletedAtIso);
}
function makeSummary(channel: ChatChannelDefinition, residenceId: string): ChatChannelSummary {
    const visible = channelMessages(channel.societyId, residenceId, channel.channelId);
    const lastMessage = [...visible].sort((left, right) => left.sentAtIso.localeCompare(right.sentAtIso)).at(-1) ?? null;
    return {
        channel,
        residenceId,
        unreadCount: unreadByResidenceChannel.get(`${residenceId}:${channel.channelId}`) ?? 0,
        updatedAtIso: lastMessage?.sentAtIso ?? channel.updatedAtIso,
        lastMessage
    };
}
function staffSnapshot(identity: ChatStaffIdentity, channel: ChatChannelDefinition, gateName?: string): ChatSenderSnapshot {
    return {
        senderUserId: identity.userId,
        senderType: channel.code === 'securityGate' ? 'securityGuard' : 'departmentStaff',
        displayNameAtSend: identity.displayName,
        roleTitleAtSend: identity.roleTitle,
        channelNameAtSend: channel.configuredDisplayName ?? channel.code,
        ...includeWhenPresent("gateNameAtSend", gateName),
        ...includeWhenPresent("avatarAssetId", identity.avatarAssetId)
    };
}
function assertStaffAccess(context: StaffChatRequestContext, channel: ChatChannelDefinition, interactionAssignedUserId?: string, requiresSend = false): ChatStaffIdentity {
    const identity = staff.find((item) => item.userId === context.actorUserId && item.societyId === context.societyId);
    const decision = resolveChatAccess({
        userId: context.actorUserId,
        societyId: context.societyId,
        channel,
        ...includeWhenPresent("membership", activeMembership(context.actorUserId, channel.channelId)),
        ...includeWhenPresent("staffIdentity", identity),
        ...includeWhenPresent("interactionAssignedUserId", interactionAssignedUserId),
        requiresSend
    }, '2026-07-12T12:00:00.000Z');
    if (!decision.allowed) {
        addAudit({
            eventType: decision.reason === 'interactionNotAssigned' ? 'guardInteractionAccessRejected' : 'membershipAccessRejected',
            actorUserId: context.actorUserId,
            societyId: context.societyId,
            channelId: channel.channelId,
            reason: decision.reason
        });
        throw new Error(`chat.access.${decision.reason}`);
    }
    if (!identity)
        throw new Error('chat.access.staffInactive');
    return identity;
}
function createMessage(input: {
    clientMessageId: string;
    societyId: string;
    residenceId: string;
    residentUserId: string;
    channelId: string;
    interactionId?: string;
    replyToMessageId?: string;
    senderSnapshot: ChatSenderSnapshot;
    messageText: string;
}): ChatMessage {
    const duplicate = messages.find((item) => item.clientMessageId === input.clientMessageId);
    if (duplicate)
        return duplicate;
    const created: ChatMessage = {
        messageId: `message-${Date.now()}-${messages.length + 1}`,
        clientMessageId: input.clientMessageId,
        societyId: input.societyId,
        residenceId: input.residenceId,
        residentUserId: input.residentUserId,
        channelId: input.channelId,
        ...includeWhenPresent("interactionId", input.interactionId),
        ...includeWhenPresent("replyToMessageId", input.replyToMessageId),
        senderSnapshot: input.senderSnapshot,
        messageText: input.messageText.trim(),
        sentAtIso: new Date().toISOString(),
        deliveryStatus: 'sent'
    };
    messages.push(created);
    addAudit({ eventType: 'messageSent', actorUserId: input.senderSnapshot.senderUserId, societyId: input.societyId, channelId: input.channelId, ...includeWhenPresent("interactionId", input.interactionId) });
    emit();
    void Promise.resolve().then(() => {
        if (created.deliveryStatus !== 'sent')
            return;
        created.deliveryStatus = 'delivered';
        emit();
        void Promise.resolve().then(() => {
            if (created.deliveryStatus !== 'delivered')
                return;
            created.deliveryStatus = 'seen';
            emit();
        });
    });
    return created;
}
function resolveResidentSecurityInteraction(context: ResidentRepositoryRequestContext, channel: ChatChannelDefinition, input: SendResidentMessageInput): SecurityConversationSegment {
    if (input.replyToMessageId) {
        const source = messages.find((item) => item.messageId === input.replyToMessageId && item.channelId === channel.channelId);
        const sourceSegment = segments.find((item) => item.interactionId === source?.interactionId);
        if (sourceSegment?.status === 'active')
            return sourceSegment;
    }
    const currentShift = shifts.find((shift) => shift.societyId === context.activeHome.societyId && shift.status === 'active');
    if (!currentShift)
        throw new Error('chat.errors.noGuardAvailable');
    const currentMembership = activeMembership(currentShift.guardUserId, channel.channelId);
    if (currentMembership?.status !== 'active')
        throw new Error('chat.errors.noGuardAvailable');
    const existing = segments.find((segment) => segment.channelId === channel.channelId
        && segment.residenceId === context.activeHome.homeContextId
        && segment.assignedGuardUserId === currentShift.guardUserId
        && segment.status === 'active');
    if (existing)
        return existing;
    const created: SecurityConversationSegment = {
        interactionId: `interaction-${currentShift.guardUserId}-${Date.now()}`,
        channelId: channel.channelId,
        societyId: channel.societyId,
        residenceId: context.activeHome.homeContextId,
        residentUserId: context.activeHome.residentId,
        assignedGuardUserId: currentShift.guardUserId,
        gateId: currentShift.gateId,
        shiftAssignmentId: currentShift.shiftAssignmentId,
        startedAtIso: new Date().toISOString(),
        status: 'active'
    };
    segments.push(created);
    return created;
}
export const chatMockSource: ChatRepository = {
    subscribe(listener) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getVersion: () => version,
    getAuditEvents: () => auditEvents,
    async getSocietyChannels(societyId) {
        return channels.filter((channel) => channel.societyId === societyId).sort((a, b) => a.sortOrder - b.sortOrder);
    },
    async getAssignableChannels(societyId, roleCode) {
        return channels.filter((channel) => channel.societyId === societyId && channel.isEnabled && canRoleJoinChannel(roleCode, channel.code));
    },
    async getUserMemberships(societyId, userId) {
        return memberships.filter((item) => item.societyId === societyId && item.userId === userId);
    },
    async assignUserChannels(input: AssignUserChannelsInput) {
        const societyChannels = channels.filter((channel) => channel.societyId === input.societyId);
        const existing = memberships.filter((item) => item.societyId === input.societyId && item.userId === input.userId);
        const validations = validateChannelAssignments({
            roleCode: input.roleCode,
            channels: societyChannels,
            assignments: input.assignments,
            existingMemberships: existing,
            hasGateOperationalAssignment: input.hasGateOperationalAssignment
        });
        const failure = validations.find((result) => !result.valid);
        if (failure?.code)
            throw new Error(`chat.validation.${failure.code}`);
        const created = input.assignments.map((assignment, index): ChatChannelMembership => ({
            membershipId: `membership-${input.userId}-${Date.now()}-${index}`,
            societyId: input.societyId,
            channelId: assignment.channelId,
            userId: input.userId,
            staffProfileId: input.staffProfileId,
            accessLevel: assignment.accessLevel,
            permissions: assignment.accessLevel === 'channelManager' ? managerPermissions : defaultPermissions,
            status: 'active',
            validFromIso: assignment.validFromIso,
            ...includeWhenPresent("validUntilIso", assignment.validUntilIso),
            assignedByUserId: input.assignedByUserId,
            assignedAtIso: new Date().toISOString()
        }));
        memberships.push(...created);
        emit();
        return created;
    },
    async updateUserChannelMembership(input: UpdateChannelMembershipInput) {
        const target = memberships.find((item) => item.membershipId === input.membershipId && item.societyId === input.societyId);
        if (!target)
            throw new Error('chat.errors.membershipUnavailable');
        if (input.status)
            target.status = input.status;
        if (input.accessLevel) {
            target.accessLevel = input.accessLevel;
            target.permissions = input.accessLevel === 'channelManager' ? managerPermissions : defaultPermissions;
        }
        if (input.validUntilIso)
            target.validUntilIso = input.validUntilIso;
        if (input.validFromIso)
            target.validFromIso = input.validFromIso;
        emit();
        return target;
    },
    async removeUserChannelMembership(societyId, membershipId, removedByUserId) {
        const target = memberships.find((item) => item.societyId === societyId && item.membershipId === membershipId);
        if (!target)
            throw new Error('chat.errors.membershipUnavailable');
        if (target.accessLevel === 'channelManager') {
            const otherManagers = memberships.filter((item) => item.societyId === societyId
                && item.channelId === target.channelId
                && item.membershipId !== target.membershipId
                && item.accessLevel === 'channelManager'
                && item.status === 'active');
            if (otherManagers.length === 0)
                throw new Error('chat.validation.cannotRemoveLastManager');
        }
        target.status = 'inactive';
        target.removedByUserId = removedByUserId;
        target.removedAtIso = new Date().toISOString();
        emit();
    },
    async getChannelMembers(societyId, channelId) {
        const activeUserIds = memberships
            .filter((item) => item.societyId === societyId && item.channelId === channelId && item.status === 'active')
            .map((item) => item.userId);
        return staff.filter((identity) => identity.societyId === societyId && identity.status === 'active' && activeUserIds.includes(identity.userId));
    },
    async getResidentChannels(context, cursor, limit = 20) {
        const all = channels
            .filter((channel) => channel.societyId === context.activeHome.societyId
            && channel.isEnabled
            && channel.audience === 'residentAndStaff')
            .map((channel) => makeSummary(channel, context.activeHome.homeContextId))
            .filter((summary) => summary.channel.isPinned || summary.lastMessage !== null)
            .sort((a, b) => a.channel.sortOrder - b.channel.sortOrder);
        const startIndex = cursor ? parseInt(cursor, 10) : 0;
        const items = all.slice(startIndex, startIndex + limit);
        const hasMore = startIndex + limit < all.length;
        const nextCursor = hasMore ? String(startIndex + limit) : undefined;
        return Object.assign([...items], { ...includeWhenPresent("nextCursor", nextCursor), hasMore });
    },
    async getResidentMessages(context, channelId, request) {
        const channel = findChannel(context.activeHome.societyId, channelId);
        if (!channel.isEnabled)
            throw new Error('chat.errors.channelUnavailable');
        addAudit({ eventType: 'channelOpened', actorUserId: context.activeHome.residentId, societyId: channel.societyId, channelId });
        return page(channelMessages(channel.societyId, context.activeHome.homeContextId, channelId), request);
    },
    async sendResidentMessage(context, input) {
        const channel = findChannel(context.activeHome.societyId, input.channelId);
        const segment = channel.historyMode === 'individualStaffIsolated'
            ? resolveResidentSecurityInteraction(context, channel, input)
            : undefined;
        return createMessage({
            clientMessageId: input.clientMessageId,
            societyId: channel.societyId,
            residenceId: context.activeHome.homeContextId,
            residentUserId: context.activeHome.residentId,
            channelId: channel.channelId,
            ...includeWhenPresent("interactionId", segment?.interactionId),
            ...includeWhenPresent("replyToMessageId", input.replyToMessageId),
            senderSnapshot: {
                senderUserId: context.activeHome.residentId,
                senderType: 'resident',
                displayNameAtSend: 'Resident',
                roleTitleAtSend: 'Resident',
                channelNameAtSend: channel.configuredDisplayName ?? channel.code
            },
            messageText: input.messageText
        });
    },
    async markChannelRead(context, channelId) {
        const cacheKey = `${context.activeHome.homeContextId}:${channelId}`;
        if ((unreadByResidenceChannel.get(cacheKey) ?? 0) === 0)
            return;
        unreadByResidenceChannel.set(cacheKey, 0);
        addAudit({ eventType: 'messageRead', actorUserId: context.activeHome.residentId, societyId: context.activeHome.societyId, channelId });
        emit();
    },
    async getAssignedInbox(context) {
        const channel = findChannel(context.societyId, `${context.societyId}-securityGate`);
        assertStaffAccess(context, channel, context.actorUserId);
        return segments
            .filter((segment) => segment.societyId === context.societyId && segment.assignedGuardUserId === context.actorUserId)
            .map((segment): ChatConversationSummary => {
            const visible = messages.filter((item) => item.interactionId === segment.interactionId);
            const lastMessage = [...visible].sort((a, b) => a.sentAtIso.localeCompare(b.sentAtIso)).at(-1) ?? null;
            return { channel, residenceId: segment.residenceId, residentUserId: segment.residentUserId, residentDisplayName: 'Shashank Shirode', residentUnitLabel: 'A-1204', interactionId: segment.interactionId, unreadCount: 0, updatedAtIso: lastMessage?.sentAtIso ?? segment.startedAtIso, lastMessage };
        });
    },
    async getAssignedMessages(context, interactionId, request) {
        const segment = segments.find((item) => item.interactionId === interactionId && item.societyId === context.societyId);
        const channel = findChannel(context.societyId, `${context.societyId}-securityGate`);
        assertStaffAccess(context, channel, segment?.assignedGuardUserId);
        if (!segment)
            throw new Error('chat.errors.conversationUnavailable');
        addAudit({ eventType: 'channelOpened', actorUserId: context.actorUserId, societyId: context.societyId, channelId: channel.channelId, interactionId });
        return page(messages.filter((item) => item.interactionId === interactionId), request);
    },
    async sendGuardMessage(context, input: SendStaffMessageInput) {
        const channel = findChannel(context.societyId, input.channelId);
        const segment = segments.find((item) => item.interactionId === input.interactionId);
        const identity = assertStaffAccess(context, channel, segment?.assignedGuardUserId, true);
        if (!segment || segment.status !== 'active')
            throw new Error('chat.errors.interactionExpired');
        const shift = shifts.find((item) => item.shiftAssignmentId === segment.shiftAssignmentId);
        if (!shift || shift.guardUserId !== context.actorUserId || shift.status !== 'active') {
            throw new Error('chat.errors.guardOffDuty');
        }
        return createMessage({ ...input, societyId: context.societyId, interactionId: segment.interactionId, senderSnapshot: staffSnapshot(identity, channel, shift?.gateName) });
    },
    async getDepartmentInbox(context, channelId) {
        const channel = findChannel(context.societyId, channelId);
        if (channel.historyMode !== 'sharedChannelHistory')
            throw new Error('chat.access.interactionNotAssigned');
        assertStaffAccess(context, channel);
        const residenceIds = [...new Set(messages.filter((item) => item.channelId === channelId).map((item) => item.residenceId))];
        return residenceIds.map((residenceId): ChatConversationSummary => {
            const visible = channelMessages(context.societyId, residenceId, channelId);
            const lastMessage = [...visible].sort((a, b) => a.sentAtIso.localeCompare(b.sentAtIso)).at(-1) ?? null;
            return { channel, residenceId, residentUserId: lastMessage?.residentUserId ?? 'resident-001', residentDisplayName: 'Shashank Shirode', residentUnitLabel: residenceId === 'context-001' ? 'A-1204' : 'C-503', unreadCount: 0, updatedAtIso: lastMessage?.sentAtIso ?? channel.updatedAtIso, lastMessage };
        });
    },
    async getDepartmentMessages(context, channelId, residenceId, request) {
        const channel = findChannel(context.societyId, channelId);
        if (channel.historyMode !== 'sharedChannelHistory')
            throw new Error('chat.access.interactionNotAssigned');
        assertStaffAccess(context, channel);
        addAudit({ eventType: 'channelOpened', actorUserId: context.actorUserId, societyId: context.societyId, channelId });
        return page(channelMessages(context.societyId, residenceId, channelId), request);
    },
    async sendDepartmentMessage(context, input) {
        const channel = findChannel(context.societyId, input.channelId);
        if (channel.historyMode !== 'sharedChannelHistory')
            throw new Error('chat.access.interactionNotAssigned');
        const identity = assertStaffAccess(context, channel, undefined, true);
        return createMessage({ ...input, societyId: context.societyId, senderSnapshot: staffSnapshot(identity, channel) });
    }
};

