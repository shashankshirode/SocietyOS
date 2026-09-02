import { AppState, type AppStateStatus } from 'react-native';
import { AppClock } from '../clock/AppClock';
import { ScenarioOrchestrator } from '../scenario/ScenarioOrchestrator';

export interface AppLifecycleState {
  currentState: AppStateStatus;
  backgroundedAt: number | null;
  resumedAt: number | null;
  elapsedBackgroundSeconds: number;
}

export type LifecycleListener = (state: AppLifecycleState) => void;

class AppLifecycleCoordinatorEngine {
  private currentState: AppStateStatus = 'active';
  private backgroundedAt: number | null = null;
  private resumedAt: number | null = null;
  private listeners = new Set<LifecycleListener>();

  constructor() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = (nextState: AppStateStatus) => {
    const prev = this.currentState;
    this.currentState = nextState;

    if (prev === 'active' && (nextState === 'background' || nextState === 'inactive')) {
      this.backgroundedAt = AppClock.now();
    } else if ((prev === 'background' || prev === 'inactive') && nextState === 'active') {
      this.resumedAt = AppClock.now();
      this.reconcileOnResume();
    }

    this.notify();
  };

  private reconcileOnResume() {
    // Check if background duration requires clock catch-up or pending operation reconciliation
    if (this.backgroundedAt && this.resumedAt) {
      const elapsedMs = this.resumedAt - this.backgroundedAt;
      if (elapsedMs > 0 && !AppClock.isMocked()) {
        AppClock.advance(elapsedMs);
      }
    }
  }

  getState(): AppLifecycleState {
    const elapsedSeconds = this.backgroundedAt && this.resumedAt
      ? Math.max(0, Math.floor((this.resumedAt - this.backgroundedAt) / 1000))
      : 0;

    return {
      currentState: this.currentState,
      backgroundedAt: this.backgroundedAt,
      resumedAt: this.resumedAt,
      elapsedBackgroundSeconds: elapsedSeconds,
    };
  }

  simulateBackground() {
    this.handleAppStateChange('background');
  }

  simulateResume() {
    this.handleAppStateChange('active');
  }

  subscribe(listener: LifecycleListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((l) => l(state));
  }
}

export const AppLifecycleCoordinator = new AppLifecycleCoordinatorEngine();
export default AppLifecycleCoordinator;
