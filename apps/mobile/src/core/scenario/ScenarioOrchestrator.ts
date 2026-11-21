import { scenarioPresets } from './scenarioPresets';
import type { ScenarioDefinition, ScenarioPresetId, ScenarioNetworkState } from './scenario.types';
import { AppClock } from '../clock/AppClock';
import { residentHomeContextStore } from '../../modules/resident/homeContext/state/residentHomeContext.store';
import type { ActiveResidentHomeContext } from '../../modules/resident/homeContext/data/residentHomeContext.types';
export type ScenarioListener = (scenario: ScenarioDefinition) => void;
class ScenarioOrchestratorEngine {
    private currentScenario: ScenarioDefinition = scenarioPresets.CALM_HOME;
    private listeners = new Set<ScenarioListener>();
    private networkState: ScenarioNetworkState = 'online';
    getCurrentScenario(): ScenarioDefinition {
        return this.currentScenario;
    }
    getNetworkState(): ScenarioNetworkState {
        return this.networkState;
    }
    setNetworkState(state: ScenarioNetworkState) {
        this.networkState = state;
        this.currentScenario = {
            ...this.currentScenario,
            networkState: state,
        };
        this.notify();
    }
    applyPreset(presetId: ScenarioPresetId): ScenarioDefinition {
        const preset = scenarioPresets[presetId];
        if (!preset) {
            throw new Error(`UNKNOWN_SCENARIO_PRESET: ${presetId}`);
        }
        this.currentScenario = preset;
        this.networkState = preset.networkState;
        if (preset.residenceCount === 0 || preset.membershipStatus === 'PENDING_APPROVAL') {
            residentHomeContextStore.setZeroHomeState(preset.membershipStatus);
        }
        else {
            const activeContext: ActiveResidentHomeContext = {
                homeContextId: preset.residenceCount === 2 ? 'ctx-palms-01' : 'ctx-001',
                residentId: 'resident-001',
                societyId: 'soc-palms-01',
                societyName: preset.activeResidenceName,
                societyAreaId: 'area-01',
                societyAreaName: 'Main Campus',
                city: 'Pune',
                unitId: 'unit-402',
                flatNumber: preset.activeUnitNumber || '402',
                displayUnitName: preset.activeUnitNumber || 'Flat 402',
                residentRole: preset.role,
                status: preset.membershipStatus === 'ACTIVE' ? 'active' : preset.membershipStatus === 'EXPIRING' ? 'moveOutPending' : 'accessRestricted',
                featureFlagScopeId: 'scope-palms',
                permissionScopeId: 'perm-resident',
                pendingCount: preset.domain.hasWaitingParcel || preset.domain.hasWaitingAtGate ? 2 : 0,
                dataScopeKey: `scope:resident-001:soc-palms-01:unit-402:${preset.role}`,
            };
            residentHomeContextStore.setActiveContext(activeContext);
        }
        this.notify();
        return this.currentScenario;
    }
    subscribe(listener: ScenarioListener): () => void {
        this.listeners.add(listener);
        return () => {
            this.listeners.delete(listener);
        };
    }
    advanceClockMinutes(minutes: number) {
        AppClock.advanceMinutes(minutes);
        this.notify();
    }
    advanceClockDays(days: number) {
        AppClock.advanceDays(days);
        this.notify();
    }
    resetClock() {
        AppClock.reset();
        this.notify();
    }
    private notify() {
        this.listeners.forEach((l) => l(this.currentScenario));
    }
}
export const ScenarioOrchestrator = new ScenarioOrchestratorEngine();
export default ScenarioOrchestrator;

