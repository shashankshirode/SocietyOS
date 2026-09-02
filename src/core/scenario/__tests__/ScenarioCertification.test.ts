import { ScenarioOrchestrator } from '../ScenarioOrchestrator';
import { scenarioPresets } from '../scenarioPresets';
import type { ScenarioPresetId } from '../scenario.types';
import { AppClock } from '../../clock/AppClock';
import { residentHomeContextStore } from '../../../modules/resident/homeContext/state/residentHomeContext.store';
import { PendingOperationStore } from '../../operations/PendingOperationStore';
import { AppLifecycleCoordinator } from '../../lifecycle/AppLifecycleCoordinator';

describe('SocietyOS Scenario Orchestrator & Certification Engine', () => {
  beforeEach(() => {
    AppClock.reset();
    ScenarioOrchestrator.applyPreset('CALM_HOME');
  });

  it('contains all 22 required scenario presets', () => {
    const presetIds = Object.keys(scenarioPresets);
    expect(presetIds.length).toBe(22);
    expect(presetIds).toContain('FIRST_INSTALL');
    expect(presetIds).toContain('NO_HOME');
    expect(presetIds).toContain('PENDING_HOME');
    expect(presetIds).toContain('BUSY_EVENING');
    expect(presetIds).toContain('ATTENTION_OVERLOAD');
    expect(presetIds).toContain('PAYMENT_PROCESSING');
    expect(presetIds).toContain('VISITOR_AT_GATE');
    expect(presetIds).toContain('OFFLINE');
    expect(presetIds).toContain('SLOW_NETWORK');
    expect(presetIds).toContain('ZERO_DATA');
    expect(presetIds).toContain('HIGH_FONT_SCALE');
    expect(presetIds).toContain('TABLET_MULTI_PANE');
  });

  it('applies the NO_HOME preset and configures zero-home context gracefully', () => {
    const applied = ScenarioOrchestrator.applyPreset('NO_HOME');
    expect(applied.id).toBe('NO_HOME');
    expect(applied.residenceCount).toBe(0);

    const activeCtx = residentHomeContextStore.getActiveContext();
    expect(activeCtx.societyName).toBe('No Home Linked');
    expect(activeCtx.status).toBe('accessRestricted');
  });

  it('applies the PENDING_HOME preset and sets pending approval indicators', () => {
    const applied = ScenarioOrchestrator.applyPreset('PENDING_HOME');
    expect(applied.id).toBe('PENDING_HOME');
    expect(applied.membershipStatus).toBe('PENDING_APPROVAL');

    const activeCtx = residentHomeContextStore.getActiveContext();
    expect(activeCtx.societyName).toContain('Pending');
    expect(activeCtx.displayUnitName).toContain('Under Review');
  });

  it('advances time deterministically using AppClock', () => {
    AppClock.setDate('2026-08-22T10:00:00.000Z');
    const startIso = AppClock.iso();
    ScenarioOrchestrator.advanceClockMinutes(15);
    const advancedIso = AppClock.iso();

    expect(new Date(advancedIso).getTime() - new Date(startIso).getTime()).toBe(15 * 60 * 1000);

    ScenarioOrchestrator.advanceClockDays(1);
    const dayAdvancedIso = AppClock.iso();
    expect(new Date(dayAdvancedIso).getTime() - new Date(advancedIso).getTime()).toBe(24 * 60 * 60 * 1000);
  });

  it('supports network state transitions (online -> slow -> offline -> error_inject)', () => {
    expect(ScenarioOrchestrator.getNetworkState()).toBe('online');

    ScenarioOrchestrator.setNetworkState('slow');
    expect(ScenarioOrchestrator.getNetworkState()).toBe('slow');

    ScenarioOrchestrator.setNetworkState('offline');
    expect(ScenarioOrchestrator.getNetworkState()).toBe('offline');

    ScenarioOrchestrator.setNetworkState('error_inject');
    expect(ScenarioOrchestrator.getNetworkState()).toBe('error_inject');
  });

  it('tracks in-flight pending operations across lifecycle interruptions', () => {
    const op = PendingOperationStore.createOperation('payment', 'ctx-001', {
      amount: 4850,
      billId: 'bill-aug-2026',
    });

    expect(op.operationId).toMatch(/^OP-PAYMENT-/);
    expect(op.status).toBe('pending');
    expect(PendingOperationStore.getActiveOperations().length).toBeGreaterThan(0);

    // Simulate App Background & Resume
    AppLifecycleCoordinator.simulateBackground();
    expect(AppLifecycleCoordinator.getState().currentState).toBe('background');

    AppLifecycleCoordinator.simulateResume();
    expect(AppLifecycleCoordinator.getState().currentState).toBe('active');

    // Operation survives resume
    const retrieved = PendingOperationStore.getOperation(op.operationId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.status).toBe('pending');

    // Mark confirmed
    PendingOperationStore.updateStatus(op.operationId, 'confirmed');
    expect(PendingOperationStore.getOperation(op.operationId)?.status).toBe('confirmed');
  });
});
