import type { IntegrationCapability, IntegrationStatus } from '../../domain/types/primitives';

export type IntegrationCapabilityKey =
  | 'MOVE_IN_LIFECYCLE'
  | 'MOVE_OUT_LIFECYCLE'
  | 'CLEARANCE_EVALUATION'
  | 'FINAL_SETTLEMENT_LEDGER'
  | 'NOC_ISSUANCE'
  | 'NOC_VERIFICATION'
  | 'SLOT_SCHEDULING'
  | 'ACCESS_ACTIVATION'
  | 'ACCESS_REVOCATION'
  | 'GATE_DEVICE_SYNC'
  | 'PARKING_ALLOCATION'
  | 'AUDIT_PERSISTENCE'
  | 'DOCUMENT_VAULT'
  | 'IDENTITY_KYC';

export type CapabilityGaps = {
  readonly capability: IntegrationCapabilityKey;
  readonly authoritativeDomain: string;
  readonly status: IntegrationStatus;
  readonly blockingReadiness: boolean;
  readonly gaps: readonly string[];
};

export type RegistrySnapshot = {
  readonly capabilities: readonly IntegrationCapability[];
  readonly gaps: readonly CapabilityGaps[];
  readonly blockingCount: number;
  readonly honestSummary: string;
};

const AUTHORITATIVE_DOMAINS: Readonly<Record<IntegrationCapabilityKey, string>> = {
  MOVE_IN_LIFECYCLE: 'moveInStateMachine',
  MOVE_OUT_LIFECYCLE: 'moveOutStateMachine',
  CLEARANCE_EVALUATION: 'clearanceEngine',
  FINAL_SETTLEMENT_LEDGER: 'settlementEngine',
  NOC_ISSUANCE: 'nocStateMachine',
  NOC_VERIFICATION: 'verifyNocCertificate',
  SLOT_SCHEDULING: 'schedulingEngine',
  ACCESS_ACTIVATION: 'accessTransitionEngine',
  ACCESS_REVOCATION: 'accessTransitionEngine',
  GATE_DEVICE_SYNC: 'accessTransitionEngine',
  PARKING_ALLOCATION: 'accessTransitionEngine',
  AUDIT_PERSISTENCE: 'auditService',
  DOCUMENT_VAULT: 'documentService',
  IDENTITY_KYC: 'verificationService',
};

const AUTHORITATIVE_STATUSES: readonly IntegrationCapabilityKey[] = [
  'MOVE_IN_LIFECYCLE',
  'MOVE_OUT_LIFECYCLE',
  'CLEARANCE_EVALUATION',
  'FINAL_SETTLEMENT_LEDGER',
  'NOC_ISSUANCE',
  'NOC_VERIFICATION',
  'SLOT_SCHEDULING',
  'ACCESS_ACTIVATION',
  'ACCESS_REVOCATION',
  'GATE_DEVICE_SYNC',
  'PARKING_ALLOCATION',
  'AUDIT_PERSISTENCE',
  'DOCUMENT_VAULT',
  'IDENTITY_KYC',
];

const DEFAULT_STATUSES: Readonly<Record<IntegrationCapabilityKey, IntegrationStatus>> = {
  MOVE_IN_LIFECYCLE: 'PARTIAL',
  MOVE_OUT_LIFECYCLE: 'PARTIAL',
  CLEARANCE_EVALUATION: 'PARTIAL',
  FINAL_SETTLEMENT_LEDGER: 'PARTIAL',
  NOC_ISSUANCE: 'PARTIAL',
  NOC_VERIFICATION: 'PARTIAL',
  SLOT_SCHEDULING: 'PARTIAL',
  ACCESS_ACTIVATION: 'API_READY',
  ACCESS_REVOCATION: 'API_READY',
  GATE_DEVICE_SYNC: 'NOT_AVAILABLE',
  PARKING_ALLOCATION: 'NOT_AVAILABLE',
  AUDIT_PERSISTENCE: 'INTEGRATED',
  DOCUMENT_VAULT: 'NOT_AVAILABLE',
  IDENTITY_KYC: 'NOT_AVAILABLE',
};

const BLOCKING_GAPS: Readonly<Record<IntegrationCapabilityKey, readonly string[]>> = {
  MOVE_IN_LIFECYCLE: ['gap.moveIn.createAndDispatchNotComposedAtRuntime', 'gap.moveIn.backendContractUnconfirmed'],
  MOVE_OUT_LIFECYCLE: ['gap.moveOut.creationPathMissing', 'gap.moveOut.backendContractUnconfirmed'],
  CLEARANCE_EVALUATION: ['gap.clearance.noApplicationService', 'gap.clearance.noBackendEndpoint'],
  FINAL_SETTLEMENT_LEDGER: ['gap.settlement.noApplicationService', 'gap.settlement.noLedgerEndpoint'],
  NOC_ISSUANCE: ['gap.noc.noApplicationService', 'gap.noc.certificateEndpointUnconfirmed'],
  NOC_VERIFICATION: ['gap.noc.verificationNotImplemented'],
  SLOT_SCHEDULING: ['gap.scheduling.noApplicationService', 'gap.scheduling.holdNotPersisted'],
  ACCESS_ACTIVATION: ['gap.access.adapterNotComposed', 'gap.access.gateNotAuthoritative'],
  ACCESS_REVOCATION: ['gap.access.adapterNotComposed', 'gap.access.gateNotAuthoritative'],
  GATE_DEVICE_SYNC: ['gap.gate.deviceProtocolAbsent'],
  PARKING_ALLOCATION: ['gap.parking.allocationEndpointAbsent'],
  AUDIT_PERSISTENCE: [],
  DOCUMENT_VAULT: ['gap.documents.noAuthoritativeVaultForMoveRecords'],
  IDENTITY_KYC: ['gap.kyc.verificationProviderNotWired'],
};

export function integrationGaps(
  statusOverrides: Readonly<Partial<Record<IntegrationCapabilityKey, IntegrationStatus>>> = {},
): readonly CapabilityGaps[] {
  return Object.keys(AUTHORITATIVE_DOMAINS).map((rawKey) => {
    const capability = rawKey as IntegrationCapabilityKey;
    const status = statusOverrides[capability] ?? DEFAULT_STATUSES[capability];
    const gaps = status === 'INTEGRATED' ? [] : BLOCKING_GAPS[capability];

    return {
      capability,
      authoritativeDomain: AUTHORITATIVE_DOMAINS[capability],
      status,
      blockingReadiness: status !== 'INTEGRATED' && AUTHORITATIVE_STATUSES.includes(capability),
      gaps,
    };
  });
}

export function declareIntegrated(
  capability: IntegrationCapabilityKey,
): Readonly<Partial<Record<IntegrationCapabilityKey, IntegrationStatus>>> {
  const gaps = BLOCKING_GAPS[capability];

  if (gaps.length > 0) {
    throw new Error(`Cannot declare ${capability} integrated while gaps remain: ${gaps.join(', ')}`);
  }

  return { [capability]: 'INTEGRATED' };
}

export function buildRegistrySnapshot(
  statusOverrides: Readonly<Partial<Record<IntegrationCapabilityKey, IntegrationStatus>>> = {},
): RegistrySnapshot {
  const gaps = integrationGaps(statusOverrides);
  const capabilities: readonly IntegrationCapability[] = gaps.map((gap) => ({
    capability: gap.capability,
    authoritativeDomain: gap.authoritativeDomain,
    status: gap.status,
    blockingReadiness: gap.blockingReadiness,
    gap: gap.gaps.length > 0 ? (gap.gaps[0] as string) : '',
  }));
  const blocking = gaps.filter((gap) => gap.blockingReadiness);

  return {
    capabilities,
    gaps,
    blockingCount: blocking.length,
    honestSummary:
      blocking.length === 0
        ? 'All authoritative capabilities are integrated.'
        : `Blocked capabilities: ${blocking.map((gap) => gap.capability).join(', ')}.`,
  };
}

export function isFullyIntegrated(snapshot: RegistrySnapshot): boolean {
  return snapshot.blockingCount === 0;
}
