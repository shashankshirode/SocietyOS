import { getRecommendedChannelAssignments } from '../domain/chatChannelPolicy';
import { chatRepository } from '../data/chat.repository';

describe('channel membership management', () => {
  it('recommends required and optional channels by role', () => {
    expect(getRecommendedChannelAssignments('securityGuard')).toEqual([
      { channelCode: 'securityGate', recommendedAccessLevel: 'member', isRequired: true },
    ]);
    expect(getRecommendedChannelAssignments('treasurer').map((item) => item.channelCode))
      .toEqual(['accounts', 'societyOffice']);
    expect(getRecommendedChannelAssignments('facilityManager').map((item) => item.channelCode))
      .toEqual(['facilityHelpdesk', 'securityDesk', 'societyOffice']);
  });

  it('assigns one user to multiple channels and rejects duplicate active membership', async () => {
    const nowIso = '2026-07-12T00:00:00.000Z';
    const created = await chatRepository.assignUserChannels({
      societyId: 'society-gv', userId: 'membership-test-user', staffProfileId: 'membership-test-staff',
      roleCode: 'treasurer', assignedByUserId: 'admin-001', hasGateOperationalAssignment: false,
      assignments: [
        { channelId: 'society-gv-accounts', accessLevel: 'member', validFromIso: nowIso },
        { channelId: 'society-gv-societyOffice', accessLevel: 'member', validFromIso: nowIso },
      ],
    });
    expect(created).toHaveLength(2);
    await expect(chatRepository.assignUserChannels({
      societyId: 'society-gv', userId: 'membership-test-user', staffProfileId: 'membership-test-staff',
      roleCode: 'treasurer', assignedByUserId: 'admin-001', hasGateOperationalAssignment: false,
      assignments: [{ channelId: 'society-gv-accounts', accessLevel: 'member', validFromIso: nowIso }],
    })).rejects.toThrow('chat.validation.duplicateMembership');
  });

  it('requires an operational gate assignment for Security Gate membership', async () => {
    await expect(chatRepository.assignUserChannels({
      societyId: 'society-gv', userId: 'guard-no-shift', staffProfileId: 'guard-no-shift',
      roleCode: 'securityGuard', assignedByUserId: 'admin-001', hasGateOperationalAssignment: false,
      assignments: [{ channelId: 'society-gv-securityGate', accessLevel: 'member', validFromIso: '2026-07-12T00:00:00.000Z' }],
    })).rejects.toThrow('chat.validation.gateAssignmentRequired');
  });

  it('suspends and removes memberships without deleting history', async () => {
    const membership = (await chatRepository.getUserMemberships('society-gv', 'accounts-rohit'))
      .find((item) => item.channelId === 'society-gv-societyOffice');
    expect(membership).toBeDefined();
    if (!membership) return;
    await chatRepository.updateUserChannelMembership({ societyId: 'society-gv', membershipId: membership.membershipId, actorUserId: 'admin-001', status: 'suspended' });
    await expect(chatRepository.getDepartmentMessages(
      { actorUserId: 'accounts-rohit', societyId: 'society-gv' }, 'society-gv-societyOffice', 'context-001',
      { cursor: null, pageSize: 10 },
    )).rejects.toThrow('chat.access.membershipInactive');
    await chatRepository.updateUserChannelMembership({ societyId: 'society-gv', membershipId: membership.membershipId, actorUserId: 'admin-001', status: 'active' });

    const removable = (await chatRepository.getUserMemberships('society-gv', 'membership-test-user'))
      .find((item) => item.channelId === 'society-gv-accounts');
    expect(removable).toBeDefined();
    if (!removable) return;
    await chatRepository.removeUserChannelMembership('society-gv', removable.membershipId, 'admin-001');
    expect((await chatRepository.getUserMemberships('society-gv', 'membership-test-user'))
      .find((item) => item.membershipId === removable.membershipId)?.status).toBe('inactive');
  });
});
