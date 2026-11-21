import { chatRepository } from '../data/chat.repository';
import { includeWhenPresent } from "../../../shared/utils/presentProperty";
describe('chat access architecture', () => {
    it('provides only the five practical default channels and disables Security Desk per society configuration', async () => {
        const greenValley = await chatRepository.getSocietyChannels('society-gv');
        const gokhalePark = await chatRepository.getSocietyChannels('society-gp');
        expect(greenValley.map((channel) => channel.code)).toEqual([
            'securityGate', 'securityDesk', 'accounts', 'facilityHelpdesk', 'societyOffice',
        ]);
        expect(gokhalePark.find((channel) => channel.code === 'securityDesk')?.isEnabled).toBe(false);
    });
    it('prevents Guard A, Guard B and Security Desk members from reading another guard interaction', async () => {
        const request = { cursor: null, pageSize: 50 };
        const amit = await chatRepository.getAssignedMessages({ actorUserId: 'guard-amit', societyId: 'society-gv' }, 'interaction-amit-delivery', request);
        expect(amit.messages.some((message) => message.senderSnapshot.displayNameAtSend === 'Suresh Patil')).toBe(false);
        await expect(chatRepository.getAssignedMessages({ actorUserId: 'guard-001', societyId: 'society-gv' }, 'interaction-amit-delivery', request)).rejects.toThrow('chat.access.interactionNotAssigned');
        await expect(chatRepository.getAssignedMessages({ actorUserId: 'guard-mahesh', societyId: 'society-gv' }, 'interaction-amit-delivery', request)).rejects.toThrow('chat.access.interactionNotAssigned');
    });
    it('shares department history with active replacements and rejects inactive former staff', async () => {
        const accountsChannelId = 'society-gv-accounts';
        const rohitHistory = await chatRepository.getDepartmentMessages({ actorUserId: 'accounts-rohit', societyId: 'society-gv' }, accountsChannelId, 'context-001', { cursor: null, pageSize: 50 });
        expect(rohitHistory.messages.some((message) => message.senderSnapshot.displayNameAtSend === 'Rahul Deshmukh')).toBe(true);
        expect(rohitHistory.messages.some((message) => message.senderSnapshot.displayNameAtSend === 'Rohit Sharma')).toBe(true);
        await expect(chatRepository.getDepartmentMessages({ actorUserId: 'accounts-rahul', societyId: 'society-gv' }, accountsChannelId, 'context-001', { cursor: null, pageSize: 20 })).rejects.toThrow('chat.access.membershipInactive');
    });
    it('shares Facility Helpdesk and Society Office history only with their active members', async () => {
        const facility = await chatRepository.getDepartmentMessages({ actorUserId: 'facility-neha', societyId: 'society-gv' }, 'society-gv-facilityHelpdesk', 'context-001', { cursor: null, pageSize: 20 });
        expect(facility.messages.map((message) => message.senderSnapshot.displayNameAtSend))
            .toEqual(expect.arrayContaining(['Neha Patil', 'Ajay Shinde']));
        const office = await chatRepository.getDepartmentMessages({ actorUserId: 'admin-001', societyId: 'society-gv' }, 'society-gv-societyOffice', 'context-001', { cursor: null, pageSize: 20 });
        expect(office.messages.some((message) => message.senderSnapshot.displayNameAtSend === 'Kavita Deshmukh')).toBe(true);
        await expect(chatRepository.getDepartmentMessages({ actorUserId: 'facility-neha', societyId: 'society-gv' }, 'society-gv-accounts', 'context-001', { cursor: null, pageSize: 20 })).rejects.toThrow('chat.access.membershipMissing');
    });
    it('retains immutable historical sender attribution and paginates older history', async () => {
        const page = await chatRepository.getDepartmentMessages({ actorUserId: 'accounts-rohit', societyId: 'society-gv' }, 'society-gv-accounts', 'context-001', { cursor: null, pageSize: 10 });
        expect(page.hasMore).toBe(true);
        expect(page.nextCursor).not.toBeNull();
        const older = await chatRepository.getDepartmentMessages({ actorUserId: 'accounts-rohit', societyId: 'society-gv' }, 'society-gv-accounts', 'context-001', { cursor: page.nextCursor, pageSize: 50 });
        expect(older.messages.some((message) => message.senderSnapshot.displayNameAtSend === 'Rahul Deshmukh'
            && message.senderSnapshot.roleTitleAtSend === 'Accounts Executive')).toBe(true);
    });
    it('routes a generic resident gate message to the on-duty guard and records authenticated guard attribution', async () => {
        const context = {
            activeHome: {
                homeContextId: 'context-001', residentId: 'resident-001', societyId: 'society-gv',
                societyName: 'Green Valley Heights', societyAreaId: 'area-nashik-road', societyAreaName: 'Nashik Road',
                city: 'Nashik', unitId: 'unit-gv-a-1204', flatNumber: 'A-1204', displayUnitName: 'A-1204',
                residentRole: 'owner' as const, status: 'active' as const, featureFlagScopeId: 'scope-gv',
                permissionScopeId: 'scope-gv-owner', dataScopeKey: 'context-001:society-gv:unit-gv-a-1204'
            },
            dataScopeKey: 'context-001:society-gv:unit-gv-a-1204'
        };
        const residentMessage = await chatRepository.sendResidentMessage(context, {
            channelId: 'society-gv-securityGate', clientMessageId: 'generic-on-duty-routing-test',
            messageText: 'Please check the arriving cab.'
        });
        expect(residentMessage.interactionId).toBe('interaction-amit-delivery');
        const guardReply = await chatRepository.sendGuardMessage({ actorUserId: 'guard-amit', societyId: 'society-gv' }, {
            channelId: 'society-gv-securityGate',
            ...includeWhenPresent("interactionId", residentMessage.interactionId),
            residenceId: 'context-001', residentUserId: 'resident-001', clientMessageId: 'amit-authenticated-reply-test',
            messageText: 'The cab has been verified.'
        });
        expect(guardReply.senderSnapshot.displayNameAtSend).toBe('Amit Jadhav');
        expect(guardReply.senderSnapshot.gateNameAtSend).toBe('Main Gate');
    });
    it('records the authenticated replacement employee on a shared-channel response', async () => {
        const reply = await chatRepository.sendDepartmentMessage({ actorUserId: 'accounts-rohit', societyId: 'society-gv' }, {
            channelId: 'society-gv-accounts', residenceId: 'context-001', residentUserId: 'resident-001',
            clientMessageId: 'rohit-authenticated-reply-test', messageText: 'Your revised receipt is ready.'
        });
        expect(reply.senderSnapshot.displayNameAtSend).toBe('Rohit Sharma');
        expect(reply.senderSnapshot.roleTitleAtSend).toBe('Accounts Executive');
    });
});

