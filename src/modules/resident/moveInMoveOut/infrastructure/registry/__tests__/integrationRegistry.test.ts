import {
  buildRegistrySnapshot,
  declareIntegrated,
  integrationGaps,
  isFullyIntegrated,
} from '../integrationRegistry';

describe('integrationRegistry', () => {
  it('does not claim a written domain engine is integrated end to end', () => {
    const moveIn = integrationGaps().find((gap) => gap.capability === 'MOVE_IN_LIFECYCLE');

    expect(moveIn?.status).toBe('PARTIAL');
    expect(moveIn?.authoritativeDomain).toBe('moveInStateMachine');
    expect(moveIn?.blockingReadiness).toBe(true);
    expect(moveIn?.gaps.length).toBeGreaterThan(0);
  });

  it('documents why each unwired authoritative capability is blocked', () => {
    const gaps = integrationGaps();

    for (const gap of gaps) {
      if (gap.status === 'INTEGRATED') {
        expect(gap.gaps).toEqual([]);
        expect(gap.blockingReadiness).toBe(false);
      } else {
        expect(gap.gaps.length).toBeGreaterThan(0);
        for (const entry of gap.gaps) {
          expect(entry.startsWith('gap.')).toBe(true);
        }
      }
    }
  });

  it('never claims a capability that has no implementation is integrated', () => {
    const gaps = integrationGaps();
    for (const capability of ['GATE_DEVICE_SYNC', 'PARKING_ALLOCATION', 'DOCUMENT_VAULT', 'IDENTITY_KYC']) {
      const gap = gaps.find((entry) => entry.capability === capability);
      expect(gap?.status).toBe('NOT_AVAILABLE');
      expect(gap?.gaps.length).toBeGreaterThan(0);
    }
  });

  it('reports the default registry as not fully integrated', () => {
    const snapshot = buildRegistrySnapshot();

    expect(isFullyIntegrated(snapshot)).toBe(false);
    expect(snapshot.blockingCount).toBeGreaterThan(0);
    expect(snapshot.honestSummary).toContain('Blocked capabilities');
  });

  it('treats audit persistence as the only fully integrated capability', () => {
    const integrated = integrationGaps().filter((gap) => gap.status === 'INTEGRATED');

    expect(integrated.map((gap) => gap.capability)).toEqual(['AUDIT_PERSISTENCE']);
  });

  it('blocks readiness when an authoritative capability is degraded', () => {
    const snapshot = buildRegistrySnapshot({ MOVE_OUT_LIFECYCLE: 'MOCK_ONLY' });
    const moveOut = snapshot.gaps.find((gap) => gap.capability === 'MOVE_OUT_LIFECYCLE');

    expect(isFullyIntegrated(snapshot)).toBe(false);
    expect(moveOut?.status).toBe('MOCK_ONLY');
    expect(moveOut?.blockingReadiness).toBe(true);
    expect(snapshot.honestSummary).toContain('MOVE_OUT_LIFECYCLE');
  });

  it('keeps mock only and local only distinguishable from api ready', () => {
    const mockOnly = buildRegistrySnapshot({ NOC_ISSUANCE: 'MOCK_ONLY' }).gaps.find(
      (gap) => gap.capability === 'NOC_ISSUANCE',
    );
    const apiReady = buildRegistrySnapshot({ NOC_ISSUANCE: 'API_READY' }).gaps.find(
      (gap) => gap.capability === 'NOC_ISSUANCE',
    );

    expect(mockOnly?.status).toBe('MOCK_ONLY');
    expect(apiReady?.status).toBe('API_READY');
    expect(mockOnly?.status).not.toBe(apiReady?.status);
  });

  it('marks api ready as not yet wired rather than integrated', () => {
    const noc = integrationGaps({ NOC_ISSUANCE: 'API_READY' }).find((gap) => gap.capability === 'NOC_ISSUANCE');

    expect(noc?.status).toBe('API_READY');
    expect(noc?.blockingReadiness).toBe(true);
    expect(noc?.gaps.length).toBeGreaterThan(0);
  });

  it('records no gap for a fully integrated capability', () => {
    const slot = integrationGaps({ SLOT_SCHEDULING: 'INTEGRATED' }).find(
      (gap) => gap.capability === 'SLOT_SCHEDULING',
    );

    expect(slot?.gaps).toEqual([]);
    expect(slot?.blockingReadiness).toBe(false);
  });

  it('exposes one snapshot entry per capability with a readable gap string', () => {
    const snapshot = buildRegistrySnapshot({ ACCESS_REVOCATION: 'LOCAL_ONLY' });

    expect(snapshot.capabilities.length).toBe(snapshot.gaps.length);
    for (const capability of snapshot.capabilities) {
      expect(capability.capability.length).toBeGreaterThan(0);
      expect(capability.authoritativeDomain.length).toBeGreaterThan(0);
      if (capability.status === 'INTEGRATED') {
        expect(capability.gap).toBe('');
      } else {
        expect(capability.gap.length).toBeGreaterThan(0);
      }
    }
  });

  it('refuses to declare a capability integrated while gaps remain', () => {
    expect(() => declareIntegrated('MOVE_IN_LIFECYCLE')).toThrow(/Cannot declare MOVE_IN_LIFECYCLE integrated/);
    expect(() => declareIntegrated('GATE_DEVICE_SYNC')).toThrow();
  });

  it('allows declaring integrated only for a capability with no known gaps', () => {
    expect(declareIntegrated('AUDIT_PERSISTENCE')).toEqual({ AUDIT_PERSISTENCE: 'INTEGRATED' });
  });

  it('is fully integrated only when every authoritative capability is integrated', () => {
    const snapshot = buildRegistrySnapshot({
      MOVE_IN_LIFECYCLE: 'INTEGRATED',
      MOVE_OUT_LIFECYCLE: 'INTEGRATED',
      CLEARANCE_EVALUATION: 'INTEGRATED',
      FINAL_SETTLEMENT_LEDGER: 'INTEGRATED',
      NOC_ISSUANCE: 'INTEGRATED',
      NOC_VERIFICATION: 'INTEGRATED',
      SLOT_SCHEDULING: 'INTEGRATED',
      ACCESS_ACTIVATION: 'INTEGRATED',
      ACCESS_REVOCATION: 'INTEGRATED',
      GATE_DEVICE_SYNC: 'INTEGRATED',
      PARKING_ALLOCATION: 'INTEGRATED',
      DOCUMENT_VAULT: 'INTEGRATED',
      IDENTITY_KYC: 'INTEGRATED',
    });

    expect(snapshot.blockingCount).toBe(0);
    expect(isFullyIntegrated(snapshot)).toBe(true);
    expect(snapshot.honestSummary).toBe('All authoritative capabilities are integrated.');
  });
});
