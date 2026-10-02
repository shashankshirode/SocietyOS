import AsyncStorage from '@react-native-async-storage/async-storage';
import type { DisputeCase } from '../domain/types/case.types';
import type { EvidenceRecord } from '../domain/types/evidence.types';
import type { TimelineEvent, CaseAuditEntry } from '../domain/types/timeline.types';
import type { Inspection } from '../domain/types/inspection.types';
import type { ResolutionProposal, PartyDecision, MediatorNote, ClosureProof } from '../domain/types/mediation.types';
import type { Mediation } from '../domain/stateMachines/mediationMachine';
import type { Escalation } from '../domain/types/escalation.types';
import type { DisputeRetentionRecord } from '../domain/types/retention.types';
import type { DisputeParty, DisputePropertyTag } from '../domain/types/case.types';
import type { DisputeResponse, DisputeClaim } from '../domain/types/case.types';
export const DISPUTE_STORAGE_KEY = 'society-os.disputes.v1.snapshot';
export const DISPUTE_SNAPSHOT_SCHEMA_VERSION = 1;
export type DisputeSnapshot = {
    readonly schemaVersion: number;
    readonly writtenAt: string;
    readonly cases: readonly DisputeCase[];
    readonly parties: readonly DisputeParty[];
    readonly affectedProperties: readonly DisputePropertyTag[];
    readonly evidence: readonly EvidenceRecord[];
    readonly claims: readonly DisputeClaim[];
    readonly responses: readonly DisputeResponse[];
    readonly inspections: readonly Inspection[];
    readonly inspectionFindings: readonly {
        readonly inspectionId: string;
        readonly finding: string;
    }[];
    readonly mediations: readonly Mediation[];
    readonly mediatorAssignments: readonly {
        readonly mediationId: string;
        readonly mediatorUserId: string;
    }[];
    readonly mediatorNotes: readonly MediatorNote[];
    readonly proposals: readonly ResolutionProposal[];
    readonly decisions: readonly (PartyDecision & {
        readonly proposalId: string;
    })[];
    readonly actionCommitments: readonly {
        readonly caseId: string;
        readonly note: string;
    }[];
    readonly closureProofs: readonly ClosureProof[];
    readonly escalations: readonly Escalation[];
    readonly retention: readonly DisputeRetentionRecord[];
    readonly ruleDecisions: readonly {
        readonly caseId: string;
        readonly note: string;
    }[];
    readonly timeline: readonly TimelineEvent[];
    readonly audit: readonly CaseAuditEntry[];
    readonly caseSequences: Readonly<Record<string, number>>;
};
export const EMPTY_SNAPSHOT: DisputeSnapshot = {
    schemaVersion: DISPUTE_SNAPSHOT_SCHEMA_VERSION,
    writtenAt: '1970-01-01T00:00:00.000Z',
    cases: [],
    parties: [],
    affectedProperties: [],
    evidence: [],
    claims: [],
    responses: [],
    inspections: [],
    inspectionFindings: [],
    mediations: [],
    mediatorAssignments: [],
    mediatorNotes: [],
    proposals: [],
    decisions: [],
    actionCommitments: [],
    closureProofs: [],
    escalations: [],
    retention: [],
    ruleDecisions: [],
    timeline: [],
    audit: [],
    caseSequences: {},
};
export type DisputeSnapshotSink = {
    readonly read: () => Promise<DisputeSnapshot | undefined>;
    readonly write: (snapshot: DisputeSnapshot) => Promise<void>;
    readonly clear: () => Promise<void>;
};
export const asyncStorageDisputeSink: DisputeSnapshotSink = {
    read: async () => {
        const raw = await AsyncStorage.getItem(DISPUTE_STORAGE_KEY);
        if (raw === null) {
            return undefined;
        }
        const parsed: unknown = JSON.parse(raw);
        return isDisputeSnapshot(parsed) ? parsed : undefined;
    },
    write: async (snapshot) => {
        await AsyncStorage.setItem(DISPUTE_STORAGE_KEY, JSON.stringify(snapshot));
    },
    clear: async () => {
        await AsyncStorage.removeItem(DISPUTE_STORAGE_KEY);
    },
};
export function createMemoryDisputeSink(initial?: DisputeSnapshot): DisputeSnapshotSink & {
    readonly current: () => DisputeSnapshot;
    readonly writeCount: () => number;
} {
    let held: DisputeSnapshot | undefined = initial;
    let writes = 0;
    return {
        read: async () => held,
        write: async (snapshot) => {
            held = snapshot;
            writes += 1;
        },
        clear: async () => {
            held = undefined;
        },
        current: () => held ?? EMPTY_SNAPSHOT,
        writeCount: () => writes,
    };
}
export function isDisputeSnapshot(value: unknown): value is DisputeSnapshot {
    if (typeof value !== 'object' || value === null) {
        return false;
    }
    const candidate = value as {
        schemaVersion?: unknown;
        cases?: unknown;
    };
    if (candidate.schemaVersion !== DISPUTE_SNAPSHOT_SCHEMA_VERSION) {
        return false;
    }
    return Array.isArray(candidate.cases);
}
export function createDurableDisputePersistence(sink: DisputeSnapshotSink) {
    let pending: DisputeSnapshot | undefined;
    let inFlight: Promise<void> | undefined;
    let dirty = false;
    const schedule = (build: () => DisputeSnapshot): void => {
        pending = build();
        dirty = true;
        if (inFlight !== undefined) {
            return;
        }
        inFlight = Promise.resolve().then(async () => {
            while (dirty) {
                dirty = false;
                const snapshot = pending;
                pending = undefined;
                if (snapshot !== undefined) {
                    await sink.write(snapshot);
                }
            }
            inFlight = undefined;
        });
    };
    return {
        schedule,
        hydrate: () => sink.read(),
        flush: async (): Promise<void> => {
            if (inFlight !== undefined) {
                await inFlight;
            }
            if (pending !== undefined) {
                const snapshot = pending;
                pending = undefined;
                await sink.write(snapshot);
            }
        },
        clear: () => sink.clear(),
    };
}

