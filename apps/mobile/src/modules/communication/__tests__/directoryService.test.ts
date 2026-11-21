import { buildActor, buildTrace, createHarness, seedResident, SOCIETY_ID } from './harness';

describe('directory privacy', () => {
  it('excludes former residents from search results', async () => {
    const harness = createHarness();
    const alice = seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');
    seedResident(harness, 'carol', 'user-carol', { occupancyStatus: 'MOVED_OUT' });

    const result = await harness.directory.search({
      societyId: SOCIETY_ID,
      owningEntityType: 'SOCIETY_DIRECTORY',
      owningEntityId: 'all',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      searchTerm: '',
      towerFilter: undefined,
      occupancyFilter: [],
      limit: 50,
      trace: buildTrace('corr-directory-1'),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const profileIds = result.value.entries.map((entry) => entry.residentProfileId);
    expect(profileIds).toContain(alice.residentProfileId);
    expect(profileIds).toContain('bob');
    expect(profileIds).not.toContain('carol');
  });

  it('never exposes contact details on a directory entry', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob');

    const result = await harness.directory.search({
      societyId: SOCIETY_ID,
      owningEntityType: 'SOCIETY_DIRECTORY',
      owningEntityId: 'all',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      searchTerm: 'bob',
      towerFilter: undefined,
      occupancyFilter: [],
      limit: 50,
      trace: buildTrace('corr-directory-2'),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    for (const entry of result.value.entries) {
      expect(Object.keys(entry)).not.toContain('phone');
      expect(Object.keys(entry)).not.toContain('email');
      expect(Object.keys(entry)).not.toContain('phoneNumber');
      expect(Object.keys(entry)).not.toContain('emailAddress');
    }
  });

  it('masks the flat number and display name when the resident opts out', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(
      harness,
      'bob',
      'user-bob',
      {},
      { showFlatNumber: false, showDisplayName: false },
    );

    const result = await harness.directory.search({
      societyId: SOCIETY_ID,
      owningEntityType: 'SOCIETY_DIRECTORY',
      owningEntityId: 'all',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      searchTerm: 'bob',
      towerFilter: undefined,
      occupancyFilter: [],
      limit: 50,
      trace: buildTrace('corr-directory-3'),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const bob = result.value.entries.find((entry) => entry.residentProfileId === 'bob');
    expect(bob).toBeDefined();
    expect(bob?.flatNumber).toBe('A-•••');
    expect(bob?.displayName).toBe('Resident');
  });

  it('hides a resident who disabled directory listing', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob', {}, { allowDirectoryListing: false });

    const result = await harness.directory.search({
      societyId: SOCIETY_ID,
      owningEntityType: 'SOCIETY_DIRECTORY',
      owningEntityId: 'all',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      searchTerm: 'bob',
      towerFilter: undefined,
      occupancyFilter: [],
      limit: 50,
      trace: buildTrace('corr-directory-4'),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(
      result.value.entries.some((entry) => entry.residentProfileId === 'bob'),
    ).toBe(false);
  });

  it('rejects a resident who opts out of first contact', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');
    seedResident(harness, 'bob', 'user-bob', {}, { allowFirstContact: false });

    const created = await harness.contactRequests.create({
      societyId: SOCIETY_ID,
      owningEntityType: 'CONTACT_REQUEST',
      owningEntityId: 'pending',
      actor: buildActor('user-alice', 'RESIDENT_OWNER'),
      requesterResidentProfileId: 'alice',
      recipientResidentProfileId: 'bob',
      subject: 'Water supply timing',
      introductoryMessage: 'Could you share the shutoff window for tomorrow?',
      topic: 'MAINTENANCE_IMPACT',
      idempotencyKey: 'contact-privacy-1',
      trace: buildTrace('corr-contact-privacy-1'),
    });

    expect(created.ok).toBe(false);
    if (created.ok) {
      return;
    }
    expect(created.code).toBe('CONTACT_NOT_PERMITTED');
  });

  it('blocks cross-society directory access', async () => {
    const harness = createHarness();
    seedResident(harness, 'alice', 'user-alice');

    const result = await harness.directory.search({
      societyId: SOCIETY_ID,
      owningEntityType: 'SOCIETY_DIRECTORY',
      owningEntityId: 'all',
      actor: buildActor('user-alice', 'RESIDENT_OWNER', { societyId: 'society-2' }),
      searchTerm: '',
      towerFilter: undefined,
      occupancyFilter: [],
      limit: 50,
      trace: buildTrace('corr-directory-5'),
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.code).toBe('CROSS_SOCIETY_BLOCKED');
  });
});
