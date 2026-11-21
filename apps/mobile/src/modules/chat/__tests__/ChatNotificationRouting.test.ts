import { chatRepository } from '../data/chat.repository';
import { resolveChatNotificationRecipients } from '../domain/chatNotificationRouting';
import type { SecurityConversationSegment } from '../domain/chat.types';

describe('chat notification routing', () => {
  it('notifies all active shared-channel members but only the assigned Security Gate guard', async () => {
    const channels = await chatRepository.getSocietyChannels('society-gv');
    const accounts = channels.find((channel) => channel.code === 'accounts');
    const gate = channels.find((channel) => channel.code === 'securityGate');
    const memberships = [
      ...(await chatRepository.getUserMemberships('society-gv', 'accounts-rahul')),
      ...(await chatRepository.getUserMemberships('society-gv', 'accounts-rohit')),
      ...(await chatRepository.getUserMemberships('society-gv', 'treasurer-001')),
    ];
    expect(accounts).toBeDefined();
    expect(gate).toBeDefined();
    if (!accounts || !gate) return;
    expect(resolveChatNotificationRecipients({ channel: accounts, memberships, nowIso: '2026-07-12T12:00:00.000Z' }))
      .toEqual(expect.arrayContaining(['accounts-rohit', 'treasurer-001']));
    expect(resolveChatNotificationRecipients({ channel: accounts, memberships, nowIso: '2026-07-12T12:00:00.000Z' }))
      .not.toContain('accounts-rahul');
    const interaction: SecurityConversationSegment = {
      interactionId: 'notification-test', channelId: gate.channelId, societyId: gate.societyId,
      residenceId: 'context-001', residentUserId: 'resident-001', assignedGuardUserId: 'guard-amit',
      gateId: 'gate-main', shiftAssignmentId: 'shift-amit-main', startedAtIso: '2026-07-12T10:00:00.000Z', status: 'active',
    };
    expect(resolveChatNotificationRecipients({ channel: gate, memberships: [], interaction })).toEqual(['guard-amit']);
  });
});
