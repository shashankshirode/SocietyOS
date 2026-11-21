import {
  admin,
  command,
  newRuntime,
  openStandardCase,
  reporter,
  revisionOf,
  respondent,
} from './fixtures/disputeHarness';

describe('dispute case lifecycle', () => {
  it('opens a case with a neutral, structured record', () => {
    const runtime = newRuntime();
    const result = runtime.cases.openCase(
      reporter(),
      command('', 'OPEN_CASE', 'open-1', 0),
      {
        title: 'Repeated late-night noise from the unit above',
        category: 'NOISE_DISTURBANCE',
        severity: 'MEDIUM',
        description:
          'Loud music and drilling continue past 23:00 on at least four nights, and are audible in the bedroom.',
        locationLabel: 'Tower A, Unit 1204 and the unit directly above',
        reporterUnitId: 'unit-1204',
        reporterTowerId: 'tower-a',
        respondentUnitId: 'unit-1402',
        respondentUnitLabel: 'Unit 1402',
        respondentTowerId: 'tower-a',
        respondentUserId: 'user-respondent',
        propertyTags: [],
        trace: { correlationId: 'corr-1', causationId: undefined },
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    expect(result.value.caseNumber).toBe('TEST-0001');
    expect(result.value.status).toBe('OPEN');
    expect(result.value.reporterUnitId).toBe('unit-1204');
    expect(result.value.parties).toHaveLength(2);
    expect(result.value.sla.responseDueAt).toBeDefined();
    expect(result.value.closure).toBeUndefined();
    expect(result.value.resolvedAt).toBeUndefined();
  });

  it('rejects a non-neutral, accusatory description', () => {
    const runtime = newRuntime();
    const result = runtime.cases.openCase(
      reporter(),
      command('', 'OPEN_CASE', 'open-2', 0),
      {
        title: 'Unit above is at fault',
        category: 'NOISE_DISTURBANCE',
        severity: 'MEDIUM',
        description:
          'The neighbour is guilty of intentionally disrupting our nights every single weekend without any reason at all.',
        locationLabel: 'Tower A',
        reporterUnitId: 'unit-1204',
        reporterTowerId: undefined,
        respondentUnitId: undefined,
        respondentUnitLabel: undefined,
        respondentTowerId: undefined,
        respondentUserId: undefined,
        propertyTags: [],
        trace: { correlationId: 'corr-2', causationId: undefined },
      },
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.code).toBe('VALIDATION_FAILED');
    expect(result.violations.some((entry) => entry.field.startsWith('case.description'))).toBe(true);
  });

  it('rejects a replayed idempotency key when opening a case', () => {
    const runtime = newRuntime();
    const first = runtime.cases.openCase(reporter(), command('', 'OPEN_CASE', 'same-key', 0), {
      title: 'Water seepage in the utility closet',
      category: 'WATER_LEAKAGE',
      severity: 'HIGH',
      description:
        'Water has pooled beneath the utility closet sink on three separate occasions after rainfall.',
      locationLabel: 'Tower A, Unit 1204 utility closet',
      reporterUnitId: 'unit-1204',
      reporterTowerId: 'tower-a',
      respondentUnitId: undefined,
      respondentUnitLabel: undefined,
      respondentTowerId: undefined,
      respondentUserId: undefined,
      propertyTags: [],
      trace: { correlationId: 'corr-3', causationId: undefined },
    });
    expect(first.ok).toBe(true);

    const second = runtime.cases.openCase(reporter(), command('', 'OPEN_CASE', 'same-key', 0), {
      title: 'A completely different issue about parking',
      category: 'PARKING_RELATED',
      severity: 'LOW',
      description: 'A visitor parks across the ramp on weekday mornings without any arrangement in place.',
      locationLabel: 'Basement ramp',
      reporterUnitId: 'unit-1204',
      reporterTowerId: 'tower-a',
      respondentUnitId: undefined,
      respondentUnitLabel: undefined,
      respondentTowerId: undefined,
      respondentUserId: undefined,
      propertyTags: [],
      trace: { correlationId: 'corr-4', causationId: undefined },
    });

    expect(second.ok).toBe(false);
    if (second.ok) {
      return;
    }
    expect(second.code).toBe('IDEMPOTENCY_KEY_CONFLICT');
    expect(runtime.ports.cases.listBySociety('soc-test-1')).toHaveLength(1);
  });

  it('moves the case to RESPONSE_RECEIVED once a party responds', () => {
    const runtime = newRuntime();
    const caseId = openStandardCase(runtime);

    const result = runtime.cases.recordResponse(
      respondent(),
      command(caseId, 'RECORD_RESPONSE', 'resp-1', revisionOf(runtime, caseId)),
      caseId,
      {
        position: 'ACKNOWLEDGE_AND_COOPERATE',
        statement:
          'Some drilling did occur on two of those evenings; we are happy to agree quiet hours going forward.',
        cooperatesWithInspection: true,
        proposedOutcome: undefined,
        evidenceIds: [],
      },
    );

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }
    const stored = runtime.ports.cases.read(caseId);
    expect(stored?.status).toBe('RESPONSE_RECEIVED');
    expect(stored?.responses).toHaveLength(1);
  });

  it('rejects a command issued with a stale revision', () => {
    const runtime = newRuntime();
    const caseId = openStandardCase(runtime);
    const staleRevision = revisionOf(runtime, caseId);

    const first = runtime.cases.recordClaim(
      reporter(),
      command(caseId, 'RECORD_CLAIM', 'claim-1', staleRevision),
      caseId,
      {
        statement: 'The noise is loud enough to be heard through closed windows in the bedroom.',
        claimedCategory: 'NOISE_DISTURBANCE',
        relatedEvidenceIds: [],
        relatedInspectionIds: [],
      },
    );
    expect(first.ok).toBe(true);

    const second = runtime.cases.recordClaim(
      reporter(),
      command(caseId, 'RECORD_CLAIM', 'claim-2', staleRevision),
      caseId,
      {
        statement: 'A second observation from the following weekend with the same pattern recorded.',
        claimedCategory: 'NOISE_DISTURBANCE',
        relatedEvidenceIds: [],
        relatedInspectionIds: [],
      },
    );

    expect(second.ok).toBe(false);
    if (second.ok) {
      return;
    }
    expect(second.code).toBe('REVISION_MISMATCH');
  });

  it('refuses to let the committee speak on a party behalf', () => {
    const runtime = newRuntime();
    const caseId = openStandardCase(runtime);

    const result = runtime.cases.recordResponse(
      admin(),
      command(caseId, 'RECORD_RESPONSE', 'resp-admin', revisionOf(runtime, caseId)),
      caseId,
      {
        position: 'NOT_RELATED_TO_MY_UNIT',
        statement: 'The committee attempted to reach the respondent and did not receive a response.',
        cooperatesWithInspection: false,
        proposedOutcome: undefined,
        evidenceIds: [],
      },
    );

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }
    expect(result.code).toBe('NOT_A_PARTY');
    expect(runtime.ports.cases.read(caseId)?.status).toBe('OPEN');
    expect(runtime.ports.cases.read(caseId)?.responses).toHaveLength(0);
  });
});
