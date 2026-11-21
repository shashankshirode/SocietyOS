import { buildActor, buildTrace, createHarness, seedResident, SOCIETY_ID } from './harness';

type CreateOverrides = {
  readonly idempotencyKey?: string;
  readonly subject?: string;
  readonly introductoryMessage?: string;
};

async function createRequest(
  harness: ReturnType<typeof createHarness>,
  requesterUserId: string,
  recipientUserId: string,
  overrides: CreateOverrides = {},
): ReturnType<typeof harness.contactRequests.create> {
  return harness.contactRequests.create({
    societyId: SOCIETY_ID,
    owningEntityType: 'CONTACT_REQUEST',
    owningEntityId: 'pending',
    actor: buildActor(requesterUserId, 'RESIDENT_OWNER'),
    requesterResidentProfileId: requesterUserId.replace('user-', ''),
    recipientResidentProfileId: recipientUserId.replace('user-', ''),
    subject: overrides.subject ?? 'Water supply timing',
    introductoryMessage:
      overrides.introductoryMessage ??
      'Could you share the shutoff window for tomorrow morning?',
    topic: 'MAINTENANCE_IMPACT',
    idempotencyKey: overrides.idempotencyKey ?? 'contact-default-1',
    trace: buildTrace('corr-contact-create'),
  });
}

describe('first-contact consent', () => {
  it('creates no channel before the recipient accepts', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const created = await createRequest(harness, 'user-alice', 'user-bob');
    expect(created.ok).toBe(true);
    expect(harness.repository.channels.listBySociety(SOCIETY_ID)).toHaveLength(0);
    if (!created.ok) {
      return;
    }
    expect(created.value.status).toBe('PENDING_CONSENT');
    expect(created.value.channelId).toBeUndefined();
  });

  it('creates exactly one channel with both members when accepted', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const created = await createRequest(harness, 'user-alice', 'user-bob');
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const accepted = await harness.contactRequests.accept({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: created.value.id,
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      requestId: created.value.id,
      decision: 'ACCEPT',
      reason: undefined,
      idempotencyKey: 'accept-1',
      trace: buildTrace('corr-contact-accept'),
    });

    expect(accepted.ok).toBe(true);
    const channels = harness.repository.channels.listBySociety(SOCIETY_ID);
    expect(channels).toHaveLength(1);
    const memberships = harness.repository.channelMemberships.listByChannel(channels[0]?.id ?? '');
    expect(
      memberships.filter((membership) => membership.status === 'ACTIVE'),
    ).toHaveLength(2);
  });

  it('reuses the persistent channel for a second accepted request on the same pair', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const first = await createRequest(harness, 'user-alice', 'user-bob', {
      idempotencyKey: 'contact-pair-1',
    });
    expect(first.ok).toBe(true);
    if (!first.ok) {
      return;
    }
    const firstAccept = await harness.contactRequests.accept({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: first.value.id,
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      requestId: first.value.id,
      decision: 'ACCEPT',
      reason: undefined,
      idempotencyKey: 'accept-pair-1',
      trace: buildTrace('corr-pair-1'),
    });
    expect(firstAccept.ok).toBe(true);
    if (!firstAccept.ok) {
      return;
    }
    const channelId = firstAccept.value.channel.id;

    const second = await createRequest(harness, 'user-bob', 'user-alice', {
      idempotencyKey: 'contact-pair-2',
    });
    expect(second.ok).toBe(true);
    if (!second.ok) {
      return;
    }
    const secondAccept = await harness.contactRequests.accept({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: second.value.id,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      requestId: second.value.id,
      decision: 'ACCEPT',
      reason: undefined,
      idempotencyKey: 'accept-pair-2',
      trace: buildTrace('corr-pair-2'),
    });

    expect(secondAccept.ok).toBe(true);
    if (!secondAccept.ok) {
      return;
    }
    expect(secondAccept.value.channel.id).toBe(channelId);
    expect(secondAccept.value.channelCreated).toBe(false);
    expect(harness.repository.channels.listBySociety(SOCIETY_ID)).toHaveLength(1);
  });

  it('stops a third party from accepting on behalf of the recipient', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');
    seedResident(harness, 'carol', 'user-carol');

    const created = await createRequest(harness, 'user-alice', 'user-bob');
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const accepted = await harness.contactRequests.accept({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: created.value.id,
      actor: buildActor('user-carol', 'RESIDENT_OWNER'),
      requestId: created.value.id,
      decision: 'ACCEPT',
      reason: undefined,
      idempotencyKey: 'accept-idor',
      trace: buildTrace('corr-contact-idor'),
    });

    expect(accepted.ok).toBe(false);
    if (accepted.ok) {
      return;
    }
    expect(accepted.code).toBe('IDOR_BLOCKED');
    expect(harness.repository.channels.listBySociety(SOCIETY_ID)).toHaveLength(0);
  });

  it('leaves no channel when acceptance is rejected', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const created = await createRequest(harness, 'user-alice', 'user-bob');
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const rejected = await harness.contactRequests.reject({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: created.value.id,
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      requestId: created.value.id,
      decision: 'REJECT',
      reason: 'Not interested right now',
      idempotencyKey: 'reject-1',
      trace: buildTrace('corr-contact-reject'),
    });

    expect(rejected.ok).toBe(true);
    expect(harness.repository.channels.listBySociety(SOCIETY_ID)).toHaveLength(0);
  });

  it('prevents a blocked resident from sending a first-contact request', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const blocked = await harness.contactRequests.blockResident({
      societyId: SOCIETY_ID,
      owningEntityType: 'RESIDENT_BLOCK',
      owningEntityId: 'bob',
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      blockedResidentProfileId: 'alice',
      reason: 'Not welcome',
      idempotencyKey: 'block-1',
      trace: buildTrace('corr-contact-block'),
    });
    expect(blocked.ok).toBe(true);

    const created = await createRequest(harness, 'user-alice', 'user-bob', {
      idempotencyKey: 'contact-after-block',
    });

    expect(created.ok).toBe(false);
    if (created.ok) {
      return;
    }
    expect(created.code).toBe('BLOCKED_RESIDENT_BLOCKED');
  });

  it('replays the same idempotency key without creating a duplicate request', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const first = await createRequest(harness, 'user-alice', 'user-bob', {
      idempotencyKey: 'contact-replay-1',
    });
    const second = await createRequest(harness, 'user-alice', 'user-bob', {
      idempotencyKey: 'contact-replay-1',
    });

    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (!first.ok || !second.ok) {
      return;
    }
    expect(second.value.id).toBe(first.value.id);
    expect(harness.repository.contactRequests.listBySociety(SOCIETY_ID)).toHaveLength(1);
  });

  it('refuses a contact request from a resident to themselves', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');

    const created = await createRequest(harness, 'user-alice', 'user-alice', {
      idempotencyKey: 'contact-self-1',
    });

    expect(created.ok).toBe(false);
    if (created.ok) {
      return;
    }
    expect(created.code).toBe('SELF_CONTACT_BLOCKED');
  });
});
