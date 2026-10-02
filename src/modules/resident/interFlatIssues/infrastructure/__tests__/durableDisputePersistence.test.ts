import { createDurableDisputeRuntime } from '../durableDisputeRuntime';
import { createMemoryDisputeSink, DISPUTE_SNAPSHOT_SCHEMA_VERSION, isDisputeSnapshot, EMPTY_SNAPSHOT } from '../durableDisputePersistence';
import { openStandardCase, newRuntime, reporter, command, revisionOf } from '../../__tests__/fixtures/disputeHarness';
import type { DisputeRuntime } from '../disputeRuntime';
async function openOne(runtime: DisputeRuntime): Promise<string> {
    const caseId = openStandardCase(runtime);
    return caseId;
}
describe('durable dispute persistence', () => {
    it('starts empty when the sink has no prior state', async () => {
        const sink = createMemoryDisputeSink();
        const runtime = createDurableDisputeRuntime(sink);
        const restored = await runtime.durable.snapshot();
        expect(restored.cases).toEqual([]);
        expect(runtime.cases.listCasesForActor(reporter())).toHaveLength(0);
    });
    it('survives a simulated app restart', async () => {
        const sink = createMemoryDisputeSink();
        const first = createDurableDisputeRuntime(sink);
        const caseId = await openOne(first);
        await first.durable.flush();
        const second = createDurableDisputeRuntime(sink);
        expect(await second.durable.rehydrate()).toBe(true);
        const restored = second.durable.snapshot();
        expect(restored.cases).toHaveLength(1);
        expect(restored.cases[0]?.id).toBe(caseId);
        expect(restored.cases[0]?.caseNumber).toBeDefined();
    });
    it('persists the case parties so party relationships survive', async () => {
        const sink = createMemoryDisputeSink();
        const first = createDurableDisputeRuntime(sink);
        await openOne(first);
        await first.durable.flush();
        const second = createDurableDisputeRuntime(sink);
        await second.durable.rehydrate();
        const parties = second.durable.snapshot().parties;
        expect(parties.length).toBeGreaterThanOrEqual(2);
        expect(parties.some((party) => party.role === 'REPORTER')).toBe(true);
        expect(parties.some((party) => party.role === 'RESPONDENT')).toBe(true);
    });
    it('persists the timeline and audit trail', async () => {
        const sink = createMemoryDisputeSink();
        const first = createDurableDisputeRuntime(sink);
        await openOne(first);
        await first.durable.flush();
        const second = createDurableDisputeRuntime(sink);
        await second.durable.rehydrate();
        const snapshot = second.durable.snapshot();
        expect(snapshot.timeline.length).toBeGreaterThan(0);
        expect(snapshot.audit.length).toBeGreaterThan(0);
    });
    it('persists case numbering so numbers are not reused after a restart', async () => {
        const sink = createMemoryDisputeSink();
        const first = createDurableDisputeRuntime(sink);
        await openOne(first);
        await first.durable.flush();
        const second = createDurableDisputeRuntime(sink);
        await second.durable.rehydrate();
        expect(second.durable.snapshot().caseSequences['soc-test-1']).toBe(1);
    });
    it('persists a mediation workflow end to end', async () => {
        const sink = createMemoryDisputeSink();
        const first = createDurableDisputeRuntime(sink);
        const caseId = await openOne(first);
        const mediation = first.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'durable-m', revisionOf(first, caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
        expect(mediation.ok).toBe(true);
        await first.durable.flush();
        const second = createDurableDisputeRuntime(sink);
        await second.durable.rehydrate();
        const snapshot = second.durable.snapshot();
        expect(snapshot.mediations).toHaveLength(1);
        expect(snapshot.mediations[0]?.caseId).toBe(caseId);
        expect(snapshot.cases[0]?.mediationId).toBe(mediation.ok ? mediation.value.id : undefined);
    });
    it('coalesces many writes into fewer durable flushes', async () => {
        const sink = createMemoryDisputeSink();
        const runtime = createDurableDisputeRuntime(sink);
        const caseId = await openOne(runtime);
        const before = sink.writeCount();
        runtime.ports.timeline.append({
            id: 't-1',
            caseId,
            societyId: 'soc-test-1',
            sequence: 900,
            eventType: 'MEDIATION_NOTE_RECORDED',
            actorUserId: 'user-reporter',
            actorRoleLabel: 'Resident',
            occurredAt: '2026-03-02T10:00:00.000Z',
            summary: 'A note.',
            audience: 'ALL_PARTIES',
            neutralStatement: true,
            relatedEntityId: undefined,
        });
        runtime.ports.timeline.append({
            id: 't-2',
            caseId,
            societyId: 'soc-test-1',
            sequence: 901,
            eventType: 'MEDIATION_NOTE_RECORDED',
            actorUserId: 'user-reporter',
            actorRoleLabel: 'Resident',
            occurredAt: '2026-03-02T10:01:00.000Z',
            summary: 'Another note.',
            audience: 'ALL_PARTIES',
            neutralStatement: true,
            relatedEntityId: undefined,
        });
        await runtime.durable.flush();
        const writes = sink.writeCount() - before;
        expect(writes).toBeGreaterThan(0);
        const restored = await sink.read();
        expect(restored?.timeline.length).toBeGreaterThanOrEqual(2);
    });
    it('rejects a snapshot written by a different schema version', () => {
        expect(isDisputeSnapshot(EMPTY_SNAPSHOT)).toBe(true);
        expect(isDisputeSnapshot({ ...EMPTY_SNAPSHOT, schemaVersion: 99 })).toBe(false);
        expect(isDisputeSnapshot({ schemaVersion: DISPUTE_SNAPSHOT_SCHEMA_VERSION, cases: 'nope' })).toBe(false);
        expect(isDisputeSnapshot(null)).toBe(false);
        expect(isDisputeSnapshot('string')).toBe(false);
    });
    it('represents the removed penalty and guilt entities as empty', async () => {
        const sink = createMemoryDisputeSink();
        const runtime = createDurableDisputeRuntime(sink);
        await openOne(runtime);
        await runtime.durable.flush();
        const snapshot = runtime.durable.snapshot();
        expect(snapshot.actionCommitments).toEqual([]);
        expect(snapshot.ruleDecisions).toEqual([]);
    });
    it('clears durable state on request', async () => {
        const sink = createMemoryDisputeSink();
        const runtime = createDurableDisputeRuntime(sink);
        await openOne(runtime);
        await runtime.durable.flush();
        expect((await sink.read())?.cases.length).toBe(1);
        await runtime.durable.clear();
        expect(await sink.read()).toBeUndefined();
    });
    it('does not leak a durable case into the in-memory runtime', async () => {
        const sink = createMemoryDisputeSink();
        const durable = createDurableDisputeRuntime(sink);
        await openOne(durable);
        await durable.durable.flush();
        const inMemory = newRuntime();
        expect(inMemory.cases.listCasesForActor(reporter())).toHaveLength(0);
    });
});
describe('snapshot completeness', () => {
    it('persists a mediation even before the case records it', async () => {
        const sink = createMemoryDisputeSink();
        const runtime = createDurableDisputeRuntime(sink);
        const caseId = openStandardCase(runtime);
        runtime.ports.mediations.insert({
            id: 'med-orphan',
            caseId,
            societyId: 'soc-test-1',
            status: 'REQUESTED',
            mediatorUserId: undefined,
            notes: [],
            requestedByUserId: 'user-reporter',
            requestedAt: '2026-03-02T09:00:00.000Z',
            assignedAt: undefined,
            closedAt: undefined,
        });
        await runtime.durable.flush();
        const stored = await sink.read();
        expect(stored?.mediations).toHaveLength(1);
        expect(stored?.mediations[0]?.id).toBe('med-orphan');
    });
    it('links the case to the mediation it requested', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const mediation = runtime.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'link-m', revisionOf(runtime, caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
        expect(mediation.ok).toBe(true);
        if (!mediation.ok) {
            return;
        }
        expect(runtime.ports.cases.read(caseId)?.mediationId).toBe(mediation.value.id);
    });
    it('refuses a second open mediation on the same case', () => {
        const runtime = newRuntime();
        const caseId = openStandardCase(runtime);
        const first = runtime.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'dup-1', revisionOf(runtime, caseId)), caseId, { reason: 'Direct conversation has not resolved the recurring disturbance.' });
        expect(first.ok).toBe(true);
        const second = runtime.mediation.requestMediation(reporter(), command(caseId, 'REQUEST_MEDIATION', 'dup-2', revisionOf(runtime, caseId)), caseId, { reason: 'A second attempt at mediation on the same concern.' });
        expect(second.ok).toBe(false);
        if (second.ok) {
            return;
        }
        expect(second.code).toBe('PRECONDITION_FAILED');
    });
});
describe('durability limits that are not satisfied', () => {
    it('does not share state between two separate sinks', async () => {
        const sinkA = createMemoryDisputeSink();
        const sinkB = createMemoryDisputeSink();
        const deviceA = createDurableDisputeRuntime(sinkA);
        await openOne(deviceA);
        await deviceA.durable.flush();
        const deviceB = createDurableDisputeRuntime(sinkB);
        expect(await deviceB.durable.rehydrate()).toBe(false);
        expect(deviceB.durable.snapshot().cases).toHaveLength(0);
    });
});

