import { buildActor, buildTrace, createHarness, seedResident, SOCIETY_ID } from './harness';

async function acceptedChannel(
  harness: ReturnType<typeof createHarness>,
): Promise<string> {
  seedResident(harness, 'alice', 'user-alice');
  seedResident(harness, 'bob', 'user-bob');
  seedResident(harness, 'carol', 'user-carol');
  const created = await harness.contactRequests.create({
    societyId: SOCIETY_ID,
    owningEntityType: 'CONTACT_REQUEST',
    owningEntityId: 'pending',
    actor: buildActor('user-alice', 'RESIDENT_OWNER'),
    requesterResidentProfileId: 'alice',
    recipientResidentProfileId: 'bob',
    subject: 'Water supply timing',
    introductoryMessage: 'Could you share the shutoff window for tomorrow morning?',
    topic: 'MAINTENANCE_IMPACT',
    idempotencyKey: 'message-setup-1',
    trace: buildTrace('corr-msg-setup'),
  });
  if (!created.ok) {
    throw new Error(`setup failed with ${created.code}`);
  }
  const accepted = await harness.contactRequests.accept({
    societyId: SOCIETY_ID,
    owningEntityType: 'CONTACT_REQUEST',
    owningEntityId: created.value.id,
    actor: buildActor('user-bob', 'RESIDENT_OWNER'),
    requestId: created.value.id,
    decision: 'ACCEPT',
    reason: undefined,
    idempotencyKey: 'message-setup-accept-1',
    trace: buildTrace('corr-msg-setup-accept'),
  });
  if (!accepted.ok) {
    throw new Error(`accept failed with ${accepted.code}`);
  }
  return accepted.value.channel.id;
}

describe('channel messaging', () => {
  it('refuses to send into a channel the sender is not a member of', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);

    const sent = await harness.messages.sendMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-carol', 'RESIDENT_OWNER'),
      channelId,
      clientMessageId: 'client-msg-outsider-1',
      bodyCiphertextRef: 'cipher://msg/1',
      bodyLength: 12,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-outsider'),
    });

    expect(sent.ok).toBe(false);
    if (sent.ok) {
      return;
    }
    expect(sent.code).toBe('CHANNEL_MEMBERSHIP_REQUIRED');
  });

  it('persists the message before any transport and assigns a sequence', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);

    const sent = await harness.messages.sendMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      channelId,
      clientMessageId: 'client-msg-1',
      bodyCiphertextRef: 'cipher://msg/2',
      bodyLength: 20,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-send-1'),
    });

    expect(sent.ok).toBe(true);
    if (!sent.ok) {
      return;
    }
    expect(sent.value.sequence).toBe(1);
    expect(harness.repository.messages.listByChannel(channelId)).toHaveLength(1);
  });

  it('deduplicates a retried send by client message id', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);
    const command = {
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      channelId,
      clientMessageId: 'client-msg-retry-1',
      bodyCiphertextRef: 'cipher://msg/3',
      bodyLength: 20,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-retry'),
    };

    const first = await harness.messages.sendMessage(command);
    const second = await harness.messages.sendMessage(command);

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }
    expect(second.value.id).toBe(first.value.id);
    expect(harness.repository.messages.listByChannel(channelId)).toHaveLength(1);
  });

  it('rejects an empty message body', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);

    const sent = await harness.messages.sendMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      channelId,
      clientMessageId: 'client-msg-empty-1',
      bodyCiphertextRef: '',
      bodyLength: 0,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-empty'),
    });

    expect(sent.ok).toBe(false);
    if (sent.ok) {
      return;
    }
    expect(sent.code).toBe('MESSAGE_EMPTY');
  });

  it('refuses to read a message from another channel', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);
    const sent = await harness.messages.sendMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      channelId,
      clientMessageId: 'client-msg-read-1',
      bodyCiphertextRef: 'cipher://msg/4',
      bodyLength: 20,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-read-send'),
    });
    if (!sent.ok) {
      throw new Error(`send failed with ${sent.code}`);
    }

    const read = await harness.messages.markRead({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: 'some-other-channel',
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      channelId: 'some-other-channel',
      messageId: sent.value.id,
      trace: buildTrace('corr-msg-read'),
    });

    expect(read.ok).toBe(false);
    if (read.ok) {
      return;
    }
    expect(read.code).toBe('AGGREGATE_NOT_FOUND');
  });

  it('blocks delivery into a suspended channel', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');
    const group = await harness.messages.createControlledGroup({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTROLLED_GROUP',
      owningEntityId: 'tower-b',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      displayName: 'Tower B Neighbours',
      description: undefined,
      groupScopeType: 'TOWER',
      groupScopeValue: 'B',
      memberUserIds: ['user-bob'],
      trace: buildTrace('corr-group-suspend-setup'),
    });
    expect(group.ok).toBe(true);
    if (!group.ok) {
      return;
    }

    const suspended = await harness.messages.suspendChannel({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: group.value.id,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      channelId: group.value.id,
      trace: buildTrace('corr-msg-suspend'),
    });
    expect(suspended.ok).toBe(true);

    const sent = await harness.messages.sendMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: group.value.id,
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      channelId: group.value.id,
      clientMessageId: 'client-msg-suspended-1',
      bodyCiphertextRef: 'cipher://msg/5',
      bodyLength: 20,
      replyToMessageId: undefined,
      attachments: [],
      trace: buildTrace('corr-msg-suspended'),
    });

    expect(sent.ok).toBe(false);
    if (sent.ok) {
      return;
    }
    expect(sent.code).toBe('CHANNEL_NOT_ACTIVE');
  });

  it('does not let a member close a direct channel directly', async () => {
    const harness = createHarness();
    const channelId = await acceptedChannel(harness);

    const closed = await harness.messages.closeChannel({
      societyId: SOCIETY_ID,
      owningEntityType: 'CHANNEL',
      owningEntityId: channelId,
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      channelId,
      trace: buildTrace('corr-msg-close-direct'),
    });

    expect(closed.ok).toBe(false);
    if (closed.ok) {
      return;
    }
    expect(closed.code).toBe('MODERATION_SCOPE_BLOCKED');
  });

  it('refuses to invite a resident who opted out of group invites', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob', { groupInvitesAllowed: false });
    seedResident(harness, 'carol', 'user-carol');

    const group = await harness.messages.createControlledGroup({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTROLLED_GROUP',
      owningEntityId: 'tower-a',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      displayName: 'Tower A Neighbours',
      description: undefined,
      groupScopeType: 'TOWER',
      groupScopeValue: 'A',
      memberUserIds: ['user-bob', 'user-carol'],
      trace: buildTrace('corr-group-1'),
    });

    expect(group.ok).toBe(false);
    if (group.ok) {
      return;
    }
    expect(group.code).toBe('PRIVACY_OPT_OUT_BLOCKED');
    expect(harness.repository.channels.listBySociety(SOCIETY_ID)).toHaveLength(0);
  });

  it('creates a controlled group when every invitee consented', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');
    seedResident(harness, 'carol', 'user-carol');

    const group = await harness.messages.createControlledGroup({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTROLLED_GROUP',
      owningEntityId: 'tower-a',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      displayName: 'Tower A Neighbours',
      description: undefined,
      groupScopeType: 'TOWER',
      groupScopeValue: 'A',
      memberUserIds: ['user-bob', 'user-carol'],
      trace: buildTrace('corr-group-2'),
    });

    expect(group.ok).toBe(true);
    if (!group.ok) {
      return;
    }
    const memberships = harness.repository.channelMemberships.listByChannel(group.value.id);
    expect(memberships).toHaveLength(3);
    expect(
      memberships.filter((membership) => membership.memberRole === 'MANAGER'),
    ).toHaveLength(1);
  });
});
