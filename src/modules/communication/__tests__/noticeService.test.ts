import { buildActor, buildTrace, createHarness, seedResident, SOCIETY_ID } from './harness';

type Harness = ReturnType<typeof createHarness>;

type NoticeOverrides = {
  readonly title?: string;
  readonly effectiveFromIso?: string;
  readonly effectiveUntilIso?: string;
  readonly requiresAcknowledgement?: boolean;
  readonly priority?: 'ROUTINE' | 'IMPORTANT' | 'URGENT' | 'EMERGENCY';
  readonly emergencyOverride?: boolean;
  readonly emergencyOverrideReason?: string;
  readonly quietHoursOverride?: boolean;
  readonly allowedDepartments?: readonly ('A' | 'B' | 'C')[];
};

let noticeSequence = 0;

function noticeCommand(overrides: NoticeOverrides = {}) {
  noticeSequence += 1;
  return {
    societyId: SOCIETY_ID,
    owningEntityType: 'NOTICE',
    owningEntityId: 'draft',
    actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
    title: overrides.title ?? 'Water tank cleaning on Saturday',
    subjectCiphertextRef: 'cipher://notice/subject',
    bodyCiphertextRef: 'cipher://notice/body',
    localizedBodyRefs: {},
    attachmentReferences: [],
    priority: overrides.priority ?? 'IMPORTANT',
    audienceType: 'TOWER' as const,
    audienceValue: 'A',
    effectiveFromIso: overrides.effectiveFromIso ?? '2026-09-02T09:00:00.000Z',
    effectiveUntilIso: overrides.effectiveUntilIso ?? '2026-09-09T09:00:00.000Z',
    requiresAcknowledgement: overrides.requiresAcknowledgement ?? true,
    acknowledgementDueAtIso: '2026-09-08T09:00:00.000Z',
    retentionDays: 90,
    emergencyOverride: overrides.emergencyOverride ?? false,
    emergencyOverrideReason: overrides.emergencyOverrideReason,
    quietHoursOverride: overrides.quietHoursOverride ?? false,
    allowedDepartments: overrides.allowedDepartments ?? (['A'] as const),
    idempotencyKey: `notice-${noticeSequence}`,
    trace: buildTrace('corr-notice-setup'),
  };
}

describe('notice lifecycle and audience integrity', () => {
  it('freezes the audience at authoring time and delivers only to active residents', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');
    const inactive = seedResident(harness, 'carol', 'user-carol');
    harness.repository.directoryEntries.update({
      ...inactive,
      occupancyStatus: 'MOVED_OUT',
      isFormerResident: true,
      revision: { revision: inactive.revision.revision + 1, revisionToken: 'rev-inactive' },
    }, inactive.revision.revision);
    const otherBuilding = seedResident(harness, 'dave', 'user-dave');
    harness.repository.directoryEntries.update({
      ...otherBuilding,
      towerOrWing: 'B',
      unitId: 'unit-B-201',
      revision: { revision: otherBuilding.revision.revision + 1, revisionToken: 'rev-dave' },
    }, otherBuilding.revision.revision);

    const created = await harness.notices.create(noticeCommand());
    expect(created.ok).toBe(true);
    if (!created.ok) {
      return;
    }

    const published = await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-1',
      trace: buildTrace('corr-notice-publish-1'),
    });
    expect(published.ok).toBe(true);

    const recipients = harness.notices.listRecipients(created.value.id);
    const recipientUserIds = recipients.map((recipient) => recipient.userId).sort();
    expect(recipientUserIds).toEqual(['user-alice', 'user-bob']);
    expect(recipients.every((recipient) => recipient.id.length > 0)).toBe(true);
  });

  it('rejects an emergency notice without a reason', async () => {
    const harness = createHarness();

    const created = await harness.notices.create(
      noticeCommand({
        priority: 'EMERGENCY',
        emergencyOverride: true,
        emergencyOverrideReason: undefined,
      }),
    );

    expect(created.ok).toBe(false);
    if (created.ok) {
      return;
    }
    expect(created.code).toBe('NOTICE_EMERGENCY_REASON_REQUIRED');
  });

  it('refuses a quiet-hours override for a resident actor', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');

    const created = await harness.notices.create({
      ...noticeCommand({ quietHoursOverride: true }),
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
    });

    expect(created.ok).toBe(false);
    if (created.ok) {
      return;
    }
    expect(created.code).toBe('ACTOR_NOT_AUTHORIZED');
  });

  it('validates the acknowledgement revision instead of ignoring it', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    const created = await harness.notices.create(noticeCommand());
    if (!created.ok) {
      throw new Error(`create failed with ${created.code}`);
    }
    await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-2',
      trace: buildTrace('corr-notice-publish-2'),
    });
    const [recipient] = harness.notices.listRecipients(created.value.id);
    if (recipient === undefined) {
      throw new Error('expected a frozen recipient');
    }
    await harness.notices.markRecipientDelivered({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      recipientId: recipient.id,
      channel: 'PUSH',
      outcome: 'DELIVERED',
      providerReference: 'provider-ref-2',
      failureReason: undefined,
    });

    const stale = await harness.notices.acknowledge({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      noticeId: created.value.id,
      expectedRevision: 999,
      trace: buildTrace('corr-notice-ack-stale'),
    });

    expect(stale.ok).toBe(false);
    if (stale.ok) {
      return;
    }
    expect(stale.code).toBe('NOTICE_REVISION_MISMATCH');

    const current = created.value.revision.revision;
    const accepted = await harness.notices.acknowledge({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      noticeId: created.value.id,
      expectedRevision: current,
      trace: buildTrace('corr-notice-ack-ok'),
    });
    expect(accepted.ok).toBe(true);
  });

  it('refuses to acknowledge a notice that was never delivered', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    const created = await harness.notices.create(noticeCommand());
    if (!created.ok) {
      throw new Error(`create failed with ${created.code}`);
    }
    await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-undelivered',
      trace: buildTrace('corr-notice-publish-undelivered'),
    });

    const acknowledged = await harness.notices.acknowledge({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      noticeId: created.value.id,
      expectedRevision: created.value.revision.revision,
      trace: buildTrace('corr-notice-ack-undelivered'),
    });

    expect(acknowledged.ok).toBe(false);
    if (acknowledged.ok) {
      return;
    }
    expect(acknowledged.code).toBe('ILLEGAL_TRANSITION');
  });

  it('preserves withdrawal history instead of deleting the notice', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    const created = await harness.notices.create(noticeCommand());
    if (!created.ok) {
      throw new Error(`create failed with ${created.code}`);
    }
    await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-3',
      trace: buildTrace('corr-notice-publish-3'),
    });

    const withdrawn = await harness.notices.withdraw({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      reason: 'Cleaning crew rescheduled to next week',
      idempotencyKey: 'notice-withdraw-1',
      trace: buildTrace('corr-notice-withdraw-1'),
    });

    expect(withdrawn.ok).toBe(true);
    const stored = harness.notices.getNotice(created.value.id);
    expect(stored?.status).toBe('WITHDRAWN');
    expect(stored?.withdrawnAtIso).toBeDefined();
    expect(stored?.withdrawalReason).toBe('Cleaning crew rescheduled to next week');
    expect(stored?.publishedAtIso).toBeDefined();
    expect(harness.notices.listRecipients(created.value.id).length).toBeGreaterThan(0);
  });

  it('retries a failed delivery and only marks delivered after the attempt', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    const created = await harness.notices.create(noticeCommand({ requiresAcknowledgement: false }));
    if (!created.ok) {
      throw new Error(`create failed with ${created.code}`);
    }
    await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-4',
      trace: buildTrace('corr-notice-publish-4'),
    });
    const [recipient] = harness.notices.listRecipients(created.value.id);
    expect(recipient).toBeDefined();
    if (recipient === undefined) {
      return;
    }

    const failed = await harness.notices.markRecipientDelivered({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      recipientId: recipient.id,
      channel: 'PUSH',
      outcome: 'FAILED',
      providerReference: undefined,
      failureReason: 'Provider rejected token',
    });
    expect(failed.ok).toBe(true);
    if (!failed.ok) {
      return;
    }
    expect(failed.value.state).toBe('FAILED');
    expect(failed.value.deliveryAttempts).toBe(1);
    expect(failed.value.failureReason).toBe('Provider rejected token');

    const delivered = await harness.notices.markRecipientDelivered({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      recipientId: recipient.id,
      channel: 'SMS',
      outcome: 'DELIVERED',
      providerReference: 'provider-ref-1',
      failureReason: undefined,
    });
    expect(delivered.ok).toBe(true);
    if (!delivered.ok) {
      return;
    }
    expect(delivered.value.state).toBe('DELIVERED');
    expect(delivered.value.deliveryAttempts).toBe(2);
    expect(delivered.value.deliveredAtIso).toBeDefined();
  });

  it('exposes an acknowledgement report only to notice managers', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    const created = await harness.notices.create(noticeCommand());
    if (!created.ok) {
      throw new Error(`create failed with ${created.code}`);
    }
    await harness.notices.publish({
      societyId: SOCIETY_ID,
      owningEntityType: 'NOTICE',
      owningEntityId: created.value.id,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
      scheduledPublishAtIso: undefined,
      idempotencyKey: 'notice-publish-5',
      trace: buildTrace('corr-notice-publish-5'),
    });

    const asResident = await harness.notices.getAcknowledgementReport({
      societyId: SOCIETY_ID,
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      noticeId: created.value.id,
    });
    expect(asResident.ok).toBe(false);
    if (asResident.ok) {
      return;
    }
    expect(asResident.code).toBe('ACTOR_NOT_AUTHORIZED');

    const asAdmin = await harness.notices.getAcknowledgementReport({
      societyId: SOCIETY_ID,
      actor: buildActor('admin-1', 'SOCIETY_ADMIN'),
      noticeId: created.value.id,
    });
    expect(asAdmin.ok).toBe(true);
  });
});
