import type { Absent } from '../../../../../shared/types/absence.types';
import type { DisputeErrorCode, DisputeViolation, VersionedDisputeAggregate } from '../types/primitives';
import { violation } from '../types/primitives';
export type DisputeCommandEnvelope = {
    readonly aggregateType: 'DISPUTE_CASE' | 'INSPECTION' | 'MEDIATION' | 'RESOLUTION_PROPOSAL';
    readonly aggregateId: string;
    readonly commandKind: string;
    readonly idempotencyKey: string;
    readonly payloadDigest: string;
};
export type DisputeFingerprint = {
    readonly envelope: DisputeCommandEnvelope;
    readonly fingerprint: string;
};
export type DisputeIdempotencyRecord = {
    readonly envelope: DisputeCommandEnvelope;
    readonly fingerprint: string;
    readonly committedRevision: number;
    readonly resultStatus: string;
    readonly committedAt: string;
};
export type DisputeIdempotencyLedger = {
    readonly find: (idempotencyKey: string) => DisputeIdempotencyRecord | Absent;
    readonly record: (entry: DisputeIdempotencyRecord) => void;
};
export type DisputeConcurrencyStore<TState> = {
    readonly read: (aggregateId: string) => TState | Absent;
    readonly commit: (aggregateId: string, state: TState, expectedRevision: number) => boolean;
};
export type DisputeGuardRejection = {
    readonly kind: 'IDEMPOTENCY_KEY_MISSING';
} | {
    readonly kind: 'REPLAY';
    readonly record: DisputeIdempotencyRecord;
} | {
    readonly kind: 'KEY_REUSED_FOR_DIFFERENT_COMMAND';
    readonly stored: DisputeIdempotencyRecord;
} | {
    readonly kind: 'STALE_REVISION';
    readonly actualRevision: number;
} | {
    readonly kind: 'AGGREGATE_MISSING';
} | {
    readonly kind: 'CONCURRENT_WRITE';
    readonly actualRevision: number;
};
export type DisputeGuardDecision<TState> = {
    readonly proceed: true;
    readonly state: TState;
} | {
    readonly proceed: false;
    readonly rejection: DisputeGuardRejection;
    readonly violations: readonly DisputeViolation[];
};
function rejection(code: DisputeErrorCode, field: string): readonly DisputeViolation[] {
    return [violation(code, field)];
}
export function fingerprintDisputeCommand(envelope: DisputeCommandEnvelope): string {
    const preimage = [
        'sos.dispute.command.v1',
        envelope.aggregateType,
        envelope.aggregateId,
        envelope.commandKind,
        envelope.idempotencyKey,
        envelope.payloadDigest,
    ].join('|');
    let hash = 0x811c9dc5;
    for (let index = 0; index < preimage.length; index += 1) {
        hash ^= preimage.charCodeAt(index);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    return hash.toString(16).padStart(8, '0');
}
export function digestDisputePayload(parts: readonly string[]): string {
    return fingerprintDisputeCommand({
        aggregateType: 'DISPUTE_CASE',
        aggregateId: '',
        commandKind: '',
        idempotencyKey: '',
        payloadDigest: [...parts].sort().join('\u001f'),
    });
}
export function guardDisputeCommand<TState extends VersionedDisputeAggregate>(envelope: DisputeCommandEnvelope, expectedRevision: number, ledger: DisputeIdempotencyLedger, store: DisputeConcurrencyStore<TState>): DisputeGuardDecision<TState> {
    if (envelope.idempotencyKey.trim().length === 0) {
        return {
            proceed: false,
            rejection: { kind: 'IDEMPOTENCY_KEY_MISSING' },
            violations: rejection('IDEMPOTENCY_KEY_REQUIRED', 'command.idempotencyKey'),
        };
    }
    const fingerprint = fingerprintDisputeCommand(envelope);
    const prior = ledger.find(envelope.idempotencyKey);
    if (prior !== undefined) {
        if (prior.envelope.aggregateId !== envelope.aggregateId || prior.fingerprint !== fingerprint) {
            return {
                proceed: false,
                rejection: { kind: 'KEY_REUSED_FOR_DIFFERENT_COMMAND', stored: prior },
                violations: rejection('IDEMPOTENCY_KEY_CONFLICT', 'command.idempotencyKey'),
            };
        }
        return {
            proceed: false,
            rejection: { kind: 'REPLAY', record: prior },
            violations: rejection('IDEMPOTENCY_KEY_REPLAY', 'command.idempotencyKey'),
        };
    }
    const state = store.read(envelope.aggregateId);
    if (state === undefined) {
        return {
            proceed: false,
            rejection: { kind: 'AGGREGATE_MISSING' },
            violations: rejection('AGGREGATE_NOT_FOUND', `aggregate.${envelope.aggregateType}.${envelope.aggregateId}`),
        };
    }
    if (state.revision.revision !== expectedRevision) {
        return {
            proceed: false,
            rejection: { kind: 'STALE_REVISION', actualRevision: state.revision.revision },
            violations: rejection('REVISION_MISMATCH', 'command.expectedRevision'),
        };
    }
    return { proceed: true, state };
}
export function commitDisputeCommand<TState extends VersionedDisputeAggregate>(envelope: DisputeCommandEnvelope, nextState: TState, resultStatus: string, committedAt: string, ledger: DisputeIdempotencyLedger, store: DisputeConcurrencyStore<TState>): boolean {
    const committed = store.commit(envelope.aggregateId, nextState, nextState.revision.revision - 1);
    if (!committed) {
        return false;
    }
    ledger.record({
        envelope,
        fingerprint: fingerprintDisputeCommand(envelope),
        committedRevision: nextState.revision.revision,
        resultStatus,
        committedAt,
    });
    return true;
}
export function createInMemoryDisputeLedger(seed: readonly DisputeIdempotencyRecord[] = []): DisputeIdempotencyLedger & {
    readonly entries: () => readonly DisputeIdempotencyRecord[];
} {
    const records = new Map<string, DisputeIdempotencyRecord>();
    for (const entry of seed) {
        records.set(entry.envelope.idempotencyKey, entry);
    }
    return {
        find: (idempotencyKey) => records.get(idempotencyKey),
        record: (entry) => {
            records.set(entry.envelope.idempotencyKey, entry);
        },
        entries: () => [...records.values()],
    };
}
export function createInMemoryDisputeStore<TState extends VersionedDisputeAggregate>(seed: readonly (readonly [
    string,
    TState
])[] = []): DisputeConcurrencyStore<TState> & {
    readonly insert: (aggregateId: string, state: TState) => boolean;
    readonly snapshot: () => readonly (readonly [
        string,
        TState
    ])[];
} {
    const states = new Map<string, TState>();
    for (const [aggregateId, state] of seed) {
        states.set(aggregateId, state);
    }
    return {
        read: (aggregateId) => states.get(aggregateId),
        insert: (aggregateId, state) => {
            if (states.has(aggregateId)) {
                return false;
            }
            states.set(aggregateId, state);
            return true;
        },
        commit: (aggregateId, state, expectedRevision) => {
            const current = states.get(aggregateId);
            if (current === undefined || current.revision.revision !== expectedRevision) {
                return false;
            }
            states.set(aggregateId, state);
            return true;
        },
        snapshot: () => [...states.entries()],
    };
}

