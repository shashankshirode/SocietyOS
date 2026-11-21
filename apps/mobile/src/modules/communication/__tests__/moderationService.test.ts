import { buildActor, buildTrace, createHarness, seedResident, SOCIETY_ID } from './harness';

type Harness = ReturnType<typeof createHarness>;

async function reportedCase(
  harness: Harness,
  reporterUserId = 'user-bob',
): Promise<{ readonly caseId: string; readonly messageId: string; readonly channelId: string }> {
  seedResident(harness, 'alice', 'user-alice');
  seedResident(harness, 'bob', 'user-bob');
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
    idempotencyKey: 'mod-setup-1',
    trace: buildTrace('corr-mod-setup'),
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
    idempotencyKey: 'mod-setup-accept-1',
    trace: buildTrace('corr-mod-setup-accept'),
  });
  if (!accepted.ok) {
    throw new Error(`accept failed with ${accepted.code}`);
  }
  const channelId = accepted.value.channel.id;
  const sent = await harness.messages.sendMessage({
    societyId: SOCIETY_ID,
    owningEntityType: 'CHANNEL',
    owningEntityId: channelId,
    actor: buildActor('user-alice', 'RESIDENT_OWNER'),
    channelId,
    clientMessageId: 'mod-msg-1',
    bodyCiphertextRef: 'cipher://mod/1',
    bodyLength: 24,
    replyToMessageId: undefined,
    attachments: [],
    trace: buildTrace('corr-mod-send'),
  });
  if (!sent.ok) {
    throw new Error(`send failed with ${sent.code}`);
  }
  const reported = await harness.moderation.report({
    societyId: SOCIETY_ID,
    owningEntityType: 'MODERATION_CASE',
    owningEntityId: sent.value.id,
    actor: buildActor(reporterUserId, 'RESIDENT_OWNER'),
    targetType: 'MESSAGE',
    targetId: sent.value.id,
    channelId,
    messageId: sent.value.id,
    category: 'HARASSMENT',
    description: 'This message targeted me repeatedly and feels threatening.',
    idempotencyKey: 'mod-report-1',
    trace: buildTrace('corr-mod-report'),
  });
  if (!reported.ok) {
    throw new Error(`report failed with ${reported.code}`);
  }
  return { caseId: reported.value.id, messageId: sent.value.id, channelId };
}

describe('moderation access control', () => {
  it('refuses to show reported content without a purpose-bound grant', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);

    const viewed = await harness.moderation.viewReportedMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      messageId: reported.messageId,
      purpose: 'Investigate resident complaint',
      trace: buildTrace('corr-mod-view-1'),
    });

    expect(viewed.ok).toBe(false);
    if (viewed.ok) {
      return;
    }
    expect(viewed.code).toBe('MODERATION_SCOPE_BLOCKED');
  });

  it('refuses access when the declared purpose differs from the grant', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);
    await harness.moderation.grantAccess({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      moderatorUserId: 'admin-1',
      purpose: 'Investigate resident complaint',
      ttlMs: 60 * 60 * 1000,
      trace: buildTrace('corr-mod-grant-1'),
    });

    const viewed = await harness.moderation.viewReportedMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      messageId: reported.messageId,
      purpose: 'Curiosity',
      trace: buildTrace('corr-mod-view-2'),
    });

    expect(viewed.ok).toBe(false);
    if (viewed.ok) {
      return;
    }
    expect(viewed.code).toBe('MODERATION_SCOPE_BLOCKED');
  });

  it('grants scoped access and records an audit entry for every read', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);
    const granted = await harness.moderation.grantAccess({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      moderatorUserId: 'admin-1',
      purpose: 'Investigate resident complaint',
      ttlMs: 60 * 60 * 1000,
      trace: buildTrace('corr-mod-grant-2'),
    });
    expect(granted.ok).toBe(true);

    const viewed = await harness.moderation.viewReportedMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      messageId: reported.messageId,
      purpose: 'Investigate resident complaint',
      trace: buildTrace('corr-mod-view-3'),
    });

    expect(viewed.ok).toBe(true);
    const moderationAudit = harness.repository.moderationAudit.listByCase(reported.caseId);
    expect(moderationAudit.length).toBeGreaterThan(0);
    expect(
      moderationAudit.some((entry) => entry.purpose === 'Investigate resident complaint'),
    ).toBe(true);
  });

  it('keeps private content away from a non-moderator role', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);
    await harness.moderation.grantAccess({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      moderatorUserId: 'admin-1',
      purpose: 'Investigate resident complaint',
      ttlMs: 60 * 60 * 1000,
      trace: buildTrace('corr-mod-grant-guard'),
    });

    const viewed = await harness.moderation.viewReportedMessage({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('guard-1', 'SECURITY_GUARD'),
      caseId: reported.caseId,
      messageId: reported.messageId,
      purpose: 'Investigate resident complaint',
      trace: buildTrace('corr-mod-view-guard'),
    });

    expect(viewed.ok).toBe(false);
    if (viewed.ok) {
      return;
    }
    expect(viewed.code).toBe('ACTOR_NOT_AUTHORIZED');
  });

  it('rejects a report with no reporter statement', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const reported = await harness.moderation.report({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: 'missing',
      actor: buildActor('user-bob', 'RESIDENT_OWNER'),
      targetType: 'MESSAGE',
      targetId: 'missing',
      channelId: undefined,
      messageId: undefined,
      category: 'OTHER',
      description: 'no',
      idempotencyKey: 'mod-empty-1',
      trace: buildTrace('corr-mod-empty'),
    });

    expect(reported.ok).toBe(false);
    if (reported.ok) {
      return;
    }
    expect(reported.code).toBe('VALIDATION_FAILED');
  });

  it('closes the channel when a moderator applies a close action', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);
    await harness.moderation.grantAccess({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      moderatorUserId: 'admin-1',
      purpose: 'Investigate resident complaint',
      ttlMs: 60 * 60 * 1000,
      trace: buildTrace('corr-mod-grant-3'),
    });

    const review = await harness.moderation.startReview({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      purpose: 'Investigate resident complaint',
      idempotencyKey: 'mod-review-1',
      trace: buildTrace('corr-mod-review-1'),
    });
    expect(review.ok).toBe(true);

    const applied = await harness.moderation.applyAction({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      action: 'CLOSE_CHANNEL',
      reason: 'Repeated targeted abuse',
      purpose: 'Investigate resident complaint',
      idempotencyKey: 'mod-action-1',
      trace: buildTrace('corr-mod-action-1'),
    });

    expect(applied.ok).toBe(true);
    const channel = harness.repository.channels.read(reported.channelId);
    expect(channel?.status).toBe('CLOSED');
  });

  it('refuses to act on a case that was never taken under review', async () => {
    const harness = createHarness();
    const reported = await reportedCase(harness);
    await harness.moderation.grantAccess({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      moderatorUserId: 'admin-1',
      purpose: 'Investigate resident complaint',
      ttlMs: 60 * 60 * 1000,
      trace: buildTrace('corr-mod-grant-4'),
    });

    const applied = await harness.moderation.applyAction({
      societyId: SOCIETY_ID,
      owningEntityType: 'MODERATION_CASE',
      owningEntityId: reported.caseId,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      caseId: reported.caseId,
      action: 'CLOSE_CHANNEL',
      reason: 'Repeated targeted abuse',
      purpose: 'Investigate resident complaint',
      idempotencyKey: 'mod-action-2',
      trace: buildTrace('corr-mod-action-2'),
    });

    expect(applied.ok).toBe(false);
    if (applied.ok) {
      return;
    }
    expect(applied.code).toBe('ILLEGAL_TRANSITION');
  });
});
